/**
 * One-off: pull inbound EmailMessages from production Salesforce that look
 * like fresh client questions, filter out automation noise, sample, write JSONL.
 *
 * Run: node scripts/learn-seed/01-pull.mjs
 *
 * Output: scratch/learn-seed/raw.jsonl
 */

import { execFileSync } from "child_process";
import { writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "scratch", "learn-seed");
const OUT_FILE = join(OUT_DIR, "raw.jsonl");
const TARGET_ORG = "CleverAccounts-Production";
const SAMPLE_SIZE = 3000;

// Excluded sender patterns (substring match, lowercase)
const SENDER_EXCLUDES = [
  "companieshouse",
  "pandadoc",
  "freeagent",
  "tax.service.gov.uk",
  "hmrc.gov.uk",
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "mailer-daemon",
  "postmaster",
  "sendgrid",
  "mailchimp",
  "hubspot",
  "docusign",
  "@cleveraccounts.com",
  "@workwellsolutions.com",
  "@workwellaccountancy.com",
  "skuid",
  "ico.org.uk",
  "gov.uk",
  "linkedin",
  "intuit",
  "xero",
  "stripe.com",
  "gocardless",
];

// Excluded subject patterns (case-insensitive substring)
const SUBJECT_EXCLUDES = [
  "automatic reply",
  "out of office",
  "auto-reply",
  "sms reply",
  "sms has been sent",
  "has been completed",
  "is due soon",
  "reminder -",
  "reminder:",
  "urgent reminder",
  "your vat return is due",
  "your tax return",
  "file your confirmation statement",
  "p30 employer",
  "bounced dd notice",
  "delivery status notification",
  "undeliverable",
  "verify your identity",
];

function shouldExcludeSender(from) {
  if (!from) return true;
  const lower = from.toLowerCase();
  return SENDER_EXCLUDES.some((p) => lower.includes(p));
}

function shouldExcludeSubject(subject) {
  if (!subject) return true;
  const lower = subject.toLowerCase().trim();
  if (lower === "re:" || lower === "fwd:" || lower === "fw:") return true;
  return SUBJECT_EXCLUDES.some((p) => lower.includes(p));
}

// Strip quoted reply chains, signatures, disclaimers, common boilerplate.
function cleanBody(body) {
  if (!body) return "";
  let txt = body;
  // Cut at common reply-chain markers
  const cutMarkers = [
    /\nFrom: .+?\nSent: /is,
    /\n-+ ?Original Message ?-+/i,
    /\nOn .+ wrote:/i,
    /\nSent from my (iPhone|iPad|Android|mobile)/i,
    /\nThis email and any attachments/i,
    /\nDisclaimer:/i,
    /\nThis message and any attachments/i,
    /\nThis is an automated email/i,
    /\nPlease note that this e-mail/i,
    /\nThis message has been scanned/i,
    /\n_{5,}/, // long underscores
    /\n-{5,}/, // long dashes
  ];
  for (const m of cutMarkers) {
    const match = txt.match(m);
    if (match) {
      txt = txt.slice(0, match.index);
    }
  }
  // Collapse whitespace
  txt = txt.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  // Cap length so Gemini calls don't balloon
  if (txt.length > 4000) txt = txt.slice(0, 4000) + "\n…[truncated]";
  return txt;
}

function runSoql(query) {
  // Write SOQL to a temp file — avoids Windows quoting hell and Node 24's shell-false restriction on .cmd
  const tmpFile = join(tmpdir(), `soql-${randomBytes(6).toString("hex")}.txt`);
  writeFileSync(tmpFile, query, "utf8");
  try {
    const out = execFileSync(
      "sf",
      ["data", "query", "--target-org", TARGET_ORG, "--file", tmpFile, "--result-format", "json"],
      { maxBuffer: 200 * 1024 * 1024, encoding: "utf8", shell: true }
    );
    const parsed = JSON.parse(out);
    return parsed.result?.records ?? [];
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

console.log("→ Querying inbound EmailMessages, stratified by month (last 12 months)…");

// SOQL accepts ISO datetime literals. Build per-month windows so we don't
// bias toward whichever month is heaviest.
function monthRange(monthsAgo) {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo - 1, 1));
  return { start: start.toISOString(), end: end.toISOString() };
}

const PER_MONTH_LIMIT = 2500;
const records = [];
for (let monthsAgo = 0; monthsAgo < 12; monthsAgo++) {
  const { start, end } = monthRange(monthsAgo);
  const q = `
    SELECT Id, Subject, FromAddress, TextBody, CreatedDate, Parent.AccountId, Parent.Origin
    FROM EmailMessage
    WHERE Incoming = true
      AND CreatedDate >= ${start}
      AND CreatedDate < ${end}
      AND Parent.AccountId != null
      AND Parent.Origin IN ('Clever Accounts','Workwell')
    ORDER BY CreatedDate DESC
    LIMIT ${PER_MONTH_LIMIT}
  `.replace(/\s+/g, " ").trim();
  const chunk = runSoql(q);
  records.push(...chunk);
  process.stdout.write(`  month ${start.slice(0,7)}: ${chunk.length}\n`);
}

console.log(`  Pulled ${records.length} raw rows total`);

const kept = [];
let droppedSender = 0, droppedSubject = 0, droppedShort = 0;

for (const r of records) {
  if (shouldExcludeSender(r.FromAddress)) { droppedSender++; continue; }
  if (shouldExcludeSubject(r.Subject)) { droppedSubject++; continue; }
  const cleaned = cleanBody(r.TextBody);
  if (cleaned.length < 80) { droppedShort++; continue; }
  kept.push({
    id: r.Id,
    subject: (r.Subject || "").trim(),
    body: cleaned,
    origin: r.Parent?.Origin || null,
    createdDate: r.CreatedDate,
  });
}

console.log(`  After filter: ${kept.length} kept`);
console.log(`    dropped (sender): ${droppedSender}`);
console.log(`    dropped (subject): ${droppedSubject}`);
console.log(`    dropped (body too short): ${droppedShort}`);

const sampled = shuffle(kept).slice(0, SAMPLE_SIZE);
console.log(`  Sampling ${sampled.length}`);

mkdirSync(OUT_DIR, { recursive: true });
const lines = sampled.map((r) => JSON.stringify(r)).join("\n");
writeFileSync(OUT_FILE, lines + "\n", "utf8");

console.log(`✓ Wrote ${sampled.length} rows → ${OUT_FILE}`);
