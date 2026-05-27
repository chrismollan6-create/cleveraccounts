/**
 * Read raw.jsonl, classify each email in batches via Gemini 2.5 Flash, write classified.jsonl.
 *
 * Run: node scripts/learn-seed/02-classify.mjs
 *
 * Resumable: if classified.jsonl already has N lines, the script skips the first N rows
 * of raw.jsonl. Delete classified.jsonl to start over.
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const RAW = join(ROOT, "scratch", "learn-seed", "raw.jsonl");
const OUT = join(ROOT, "scratch", "learn-seed", "classified.jsonl");

// Load .env.local manually (no dotenv dep needed)
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("✗ GEMINI_API_KEY not set in .env.local");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash";
const BATCH_SIZE = 15;       // emails per Gemini call
const CONCURRENCY = 4;       // parallel Gemini calls
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are a UK accountancy firm classifying client emails to identify what topics clients ask about.

For each email I send you, return:
- is_client_question (bool): true if this is a CLIENT asking a question or raising an issue (NOT internal staff, NOT automated system mail, NOT a thank-you, NOT a one-line reply with no question).
- topic (string): one of: VAT, PAYE, Self-Assessment, Corporation-Tax, Dividends, IR35, Expenses, Companies-House, Bookkeeping, Pensions, Mortgages-Refs, Payroll, CIS, Year-End-Accounts, Switching-Accountants, Software, Billing, Other
- subtopic (string): ≤6 words describing the specific area (e.g. "VAT registration threshold", "Salary vs dividend split", "Mileage claim rules")
- extracted_question (string): rewrite the client's question as a clean, generic question (≤120 chars). Remove the client's name, company names, dates, amounts. e.g. "Can I claim mileage for my commute?". If is_client_question is false, return empty string.
- applies_to (array of strings): subset of ["sole-trader", "ltd", "employer", "landlord", "contractor", "umbrella"] — empty if not specific.

Rules:
- Be strict on is_client_question. "Please confirm payment" is not a question for a learning centre. "Do I need to register for VAT?" is.
- NEVER include client names, company names, dates, or monetary amounts in extracted_question. Always rewrite generically.
- If the email is multiple questions, pick the most substantive one.
- If you can't tell, set is_client_question=false.

Return JSON only, an array of objects in the same order as inputs.`;

const responseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      is_client_question: { type: "boolean" },
      topic: { type: "string" },
      subtopic: { type: "string" },
      extracted_question: { type: "string" },
      applies_to: { type: "array", items: { type: "string" } },
    },
    required: ["is_client_question", "topic", "subtopic", "extracted_question", "applies_to"],
  },
};

async function classifyBatch(batch) {
  const userText = batch
    .map((row, i) => `--- Email ${i + 1} ---\nSubject: ${row.subject}\nBody: ${row.body}`)
    .join("\n\n");

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema,
    },
  };

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429 || res.status >= 500) {
          const wait = 2000 * Math.pow(2, attempt);
          console.warn(`  retry ${attempt + 1} after ${wait}ms (HTTP ${res.status})`);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
      }
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("no candidate text");
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length !== batch.length) {
        throw new Error(`expected ${batch.length} results, got ${parsed?.length}`);
      }
      return parsed;
    } catch (e) {
      if (attempt === 3) throw e;
      const wait = 2000 * Math.pow(2, attempt);
      console.warn(`  retry ${attempt + 1} after ${wait}ms: ${e.message}`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function readJsonl(path) {
  const rows = [];
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    rows.push(JSON.parse(line));
  }
  return rows;
}

function countLines(path) {
  if (!existsSync(path)) return 0;
  return readFileSync(path, "utf8").split("\n").filter((l) => l.trim()).length;
}

(async () => {
  const rows = await readJsonl(RAW);
  console.log(`→ Loaded ${rows.length} raw rows`);

  const already = countLines(OUT);
  if (already > 0) console.log(`  Resuming — ${already} already classified, skipping`);
  const remaining = rows.slice(already);

  // Build batches
  const batches = [];
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    batches.push(remaining.slice(i, i + BATCH_SIZE));
  }
  console.log(`  ${batches.length} batches of up to ${BATCH_SIZE} (concurrency ${CONCURRENCY})`);

  let done = 0;
  const t0 = Date.now();
  let nextIdx = 0;
  let consecutiveFailures = 0;
  let aborted = false;
  const FAILURE_BAIL_THRESHOLD = 5; // bail if 5 batches in a row all fail

  async function worker() {
    while (!aborted) {
      const idx = nextIdx++;
      if (idx >= batches.length) return;
      const batch = batches[idx];
      try {
        const results = await classifyBatch(batch);
        const out = batch.map((row, i) => ({ ...row, ...results[i] }));
        appendFileSync(OUT, out.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
        done++;
        consecutiveFailures = 0;
        const elapsed = (Date.now() - t0) / 1000;
        const rate = done / elapsed;
        const eta = (batches.length - done) / Math.max(rate, 0.001);
        process.stdout.write(`\r  batch ${done}/${batches.length} (${(rate * 60).toFixed(1)}/min, ETA ${eta.toFixed(0)}s)   `);
      } catch (e) {
        consecutiveFailures++;
        console.error(`\n  batch ${idx} failed: ${e.message}`);
        if (consecutiveFailures >= FAILURE_BAIL_THRESHOLD) {
          console.error(`\n✗ Bailing — ${consecutiveFailures} consecutive batch failures. Fix the underlying problem and re-run (script will resume from where it left off).`);
          aborted = true;
          return;
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  if (aborted) process.exit(2);

  console.log(`\n✓ Done — ${countLines(OUT)} classified rows → ${OUT}`);
})().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
