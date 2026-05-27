/**
 * Read classified.jsonl, aggregate by topic + subtopic, write seed.csv and seed.md.
 *
 * Run: node scripts/learn-seed/03-aggregate.mjs
 */

import { readFileSync, writeFileSync, createReadStream } from "fs";
import { createInterface } from "readline";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const IN = join(ROOT, "scratch", "learn-seed", "classified.jsonl");
const CSV = join(ROOT, "scratch", "learn-seed", "seed.csv");
const MD = join(ROOT, "scratch", "learn-seed", "seed.md");

async function readJsonl(path) {
  const rows = [];
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch {}
  }
  return rows;
}

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// Cluster similar questions within a (topic, subtopic) bucket using simple normalisation.
function normaliseQ(q) {
  return q
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

(async () => {
  const rows = await readJsonl(IN);
  const valid = rows.filter((r) => r.is_client_question && r.topic && r.topic !== "ERROR");
  console.log(`→ ${rows.length} classified, ${valid.length} marked as real client questions`);

  // Group by topic → subtopic → questions
  const byTopic = new Map();
  for (const r of valid) {
    const topic = r.topic;
    const sub = (r.subtopic || "").trim() || "(unspecified)";
    if (!byTopic.has(topic)) byTopic.set(topic, new Map());
    const subs = byTopic.get(topic);
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub).push(r);
  }

  // Sort topics by count desc
  const topicList = [...byTopic.entries()]
    .map(([t, subs]) => ({
      topic: t,
      count: [...subs.values()].reduce((a, b) => a + b.length, 0),
      subs,
    }))
    .sort((a, b) => b.count - a.count);

  // ---------- CSV output ----------
  const csvLines = [
    ["topic", "subtopic", "question_count", "applies_to_top", "example_question_1", "example_question_2", "example_question_3"].join(","),
  ];
  for (const t of topicList) {
    const subEntries = [...t.subs.entries()]
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => b.items.length - a.items.length);
    for (const sub of subEntries) {
      // Dedupe near-identical phrasings
      const seen = new Map();
      for (const it of sub.items) {
        const k = normaliseQ(it.extracted_question);
        if (!seen.has(k)) seen.set(k, it);
      }
      const uniques = [...seen.values()];
      // applies_to top tag
      const appliesTally = new Map();
      for (const it of sub.items) {
        for (const a of (it.applies_to || [])) {
          appliesTally.set(a, (appliesTally.get(a) || 0) + 1);
        }
      }
      const appliesTop = [...appliesTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k).join("|");
      const examples = uniques.slice(0, 3).map((u) => u.extracted_question);
      csvLines.push([
        csvEscape(t.topic),
        csvEscape(sub.name),
        csvEscape(sub.items.length),
        csvEscape(appliesTop),
        csvEscape(examples[0] || ""),
        csvEscape(examples[1] || ""),
        csvEscape(examples[2] || ""),
      ].join(","));
    }
  }
  writeFileSync(CSV, csvLines.join("\n") + "\n", "utf8");
  console.log(`✓ Wrote ${CSV}`);

  // ---------- Markdown summary ----------
  const md = [];
  md.push(`# Learn-seed: client questions extracted from Salesforce`);
  md.push("");
  md.push(`Total classified rows: ${rows.length}`);
  md.push(`Real client questions: ${valid.length}`);
  md.push(`Topics found: ${topicList.length}`);
  md.push("");
  md.push(`## Topic ranking`);
  md.push("");
  md.push(`| Topic | Question count |`);
  md.push(`|---|---:|`);
  for (const t of topicList) md.push(`| ${t.topic} | ${t.count} |`);
  md.push("");

  for (const t of topicList) {
    md.push(`## ${t.topic} (${t.count})`);
    md.push("");
    const subEntries = [...t.subs.entries()]
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => b.items.length - a.items.length);
    for (const sub of subEntries) {
      md.push(`### ${sub.name} (${sub.items.length})`);
      const seen = new Map();
      for (const it of sub.items) {
        const k = normaliseQ(it.extracted_question);
        if (!seen.has(k)) seen.set(k, it);
      }
      for (const it of [...seen.values()].slice(0, 5)) {
        const tag = (it.applies_to || []).join(", ");
        md.push(`- ${it.extracted_question}${tag ? `  _(${tag})_` : ""}`);
      }
      md.push("");
    }
  }

  writeFileSync(MD, md.join("\n"), "utf8");
  console.log(`✓ Wrote ${MD}`);
})().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
