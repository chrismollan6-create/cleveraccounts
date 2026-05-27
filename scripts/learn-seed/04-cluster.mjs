/**
 * Cluster questions within each topic into thematic hubs.
 *
 * Reads classified.jsonl, groups by topic, asks Gemini to cluster the questions
 * for each topic into 5-15 named hubs, writes clusters.jsonl + final-seed.md.
 *
 * Run: node scripts/learn-seed/04-cluster.mjs
 */

import { readFileSync, writeFileSync, existsSync, createReadStream } from "fs";
import { createInterface } from "readline";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const IN = join(ROOT, "scratch", "learn-seed", "classified.jsonl");
const OUT_JSONL = join(ROOT, "scratch", "learn-seed", "clusters.jsonl");
const OUT_MD = join(ROOT, "scratch", "learn-seed", "final-seed.md");

// Load .env.local
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("✗ GEMINI_API_KEY not set");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const MIN_QUESTIONS_TO_CLUSTER = 15;

const responseSchema = {
  type: "object",
  properties: {
    clusters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hub_name: { type: "string" },
          canonical_question: { type: "string" },
          why_clients_ask: { type: "string" },
          question_indexes: { type: "array", items: { type: "integer" } },
        },
        required: ["hub_name", "canonical_question", "why_clients_ask", "question_indexes"],
      },
    },
  },
  required: ["clusters"],
};

async function clusterTopic(topic, questions) {
  const numbered = questions.map((q, i) => `${i}. ${q}`).join("\n");

  const prompt = `You are organising client questions for an accountancy knowledge base under the topic "${topic}".

I will give you a numbered list of real client questions. Cluster them into thematic hubs — between 5 and 12 hubs, depending on how varied the questions are. Each hub should be:
- A distinct theme a client could read about as a single guide
- Broad enough to cover several similar questions, narrow enough to be a useful article
- Phrased as a topic, not as a question (e.g. "Payments on account" not "What are payments on account?")

For each hub, give:
- hub_name (≤6 words, topic-style, no question mark)
- canonical_question (one clear, generic question a client might Google — the one that best represents this hub)
- why_clients_ask (one short sentence on what's confusing or important — gives the article writer angle)
- question_indexes (array of input list indexes that belong to this hub)

Rules:
- Every input question should appear in exactly one hub. If a question is borderline, put it in the closest hub.
- Don't create a "Misc / Other" hub unless there are truly orphan questions. Try to fit everything.
- Order hubs by question count, biggest first.
- Hub names must be neutral and educational — they'll become article headings on a client-facing learning centre.

Topic: ${topic}
Number of questions: ${questions.length}

Questions:
${numbered}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
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
          const wait = 4000 * Math.pow(2, attempt);
          console.warn(`  retry after ${wait}ms (HTTP ${res.status})`);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
      }
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("no candidate text");
      const parsed = JSON.parse(text);
      return parsed.clusters;
    } catch (e) {
      if (attempt === 3) throw e;
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`  retry after ${wait}ms: ${e.message}`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function readJsonl(path) {
  const rows = [];
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch {}
  }
  return rows;
}

(async () => {
  const rows = await readJsonl(IN);
  const valid = rows.filter((r) => r.is_client_question && r.topic && r.topic !== "ERROR");
  console.log(`→ ${valid.length} real client questions across ${new Set(valid.map((r) => r.topic)).size} topics`);

  // Group by topic
  const byTopic = new Map();
  for (const r of valid) {
    if (!byTopic.has(r.topic)) byTopic.set(r.topic, []);
    byTopic.get(r.topic).push(r);
  }

  const topicOrder = [...byTopic.entries()].sort((a, b) => b[1].length - a[1].length);

  const allClusters = [];
  for (const [topic, items] of topicOrder) {
    if (items.length < MIN_QUESTIONS_TO_CLUSTER) {
      console.log(`  ${topic}: ${items.length} questions — too few to cluster, keeping flat`);
      allClusters.push({
        topic,
        flat: true,
        questions: items.map((r) => ({ q: r.extracted_question, applies_to: r.applies_to || [] })),
      });
      continue;
    }
    console.log(`  ${topic}: clustering ${items.length} questions…`);
    const questions = items.map((r) => r.extracted_question);
    const clusters = await clusterTopic(topic, questions);
    // Attach applies_to tally per cluster
    const enriched = clusters.map((c) => {
      const tally = new Map();
      for (const idx of c.question_indexes) {
        const a = items[idx]?.applies_to || [];
        for (const tag of a) tally.set(tag, (tally.get(tag) || 0) + 1);
      }
      const appliesTop = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
      const exampleQs = c.question_indexes.slice(0, 5).map((idx) => questions[idx]).filter(Boolean);
      return {
        ...c,
        count: c.question_indexes.length,
        applies_to_top: appliesTop,
        examples: exampleQs,
      };
    });
    allClusters.push({ topic, flat: false, clusters: enriched });
  }

  // Write JSONL of clusters
  writeFileSync(OUT_JSONL, allClusters.map((c) => JSON.stringify(c)).join("\n") + "\n", "utf8");
  console.log(`✓ Wrote ${OUT_JSONL}`);

  // Write final markdown
  const md = [];
  md.push(`# Learning centre — seed list`);
  md.push("");
  md.push(`Extracted from ${valid.length} real client questions across 12 months of Salesforce inbound.`);
  md.push("");
  md.push(`## Proposed top-level topics, with hub article ideas`);
  md.push("");

  for (const t of allClusters) {
    const total = t.flat ? t.questions.length : t.clusters.reduce((a, b) => a + b.count, 0);
    md.push(`## ${t.topic} (${total})`);
    md.push("");
    if (t.flat) {
      md.push(`_Few enough to list flat:_`);
      for (const q of t.questions) {
        const tag = q.applies_to.length ? ` _(${q.applies_to.join(", ")})_` : "";
        md.push(`- ${q.q}${tag}`);
      }
      md.push("");
      continue;
    }
    md.push(`| Hub | Q's | Applies to | Canonical question |`);
    md.push(`|---|---:|---|---|`);
    for (const c of t.clusters) {
      const applies = c.applies_to_top.length ? c.applies_to_top.join(", ") : "—";
      md.push(`| **${c.hub_name}** | ${c.count} | ${applies} | ${c.canonical_question} |`);
    }
    md.push("");
    for (const c of t.clusters) {
      md.push(`### ${t.topic} → ${c.hub_name} (${c.count})`);
      md.push(`*Why clients ask:* ${c.why_clients_ask}`);
      md.push("");
      md.push(`Canonical: **${c.canonical_question}**`);
      md.push("");
      md.push(`Example phrasings from clients:`);
      for (const ex of c.examples) md.push(`- ${ex}`);
      md.push("");
    }
  }

  writeFileSync(OUT_MD, md.join("\n"), "utf8");
  console.log(`✓ Wrote ${OUT_MD}`);
})().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
