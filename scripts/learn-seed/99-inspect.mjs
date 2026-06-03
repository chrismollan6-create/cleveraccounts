/**
 * Inspect a single article's drafted sources to verify grounding worked.
 * Run: node scripts/learn-seed/99-inspect.mjs <article-slug>
 */
import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const client = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node 99-inspect.mjs <article-slug>");
  process.exit(1);
}

const draftId = `drafts.knowledgeArticle-${slug}`;
const r = await client.getDocument(draftId);
if (!r) {
  console.error(`Draft not found: ${draftId}`);
  process.exit(1);
}
console.log("title:", r.title);
console.log("body blocks:", r.body?.length ?? 0);
console.log("draftedSources:", r.draftedSources?.length ?? 0);
console.log("");
const sources = r.draftedSources ?? [];
const govuk = sources.filter((s) => (s.source || "").endsWith("gov.uk"));
const other = sources.filter((s) => !(s.source || "").endsWith("gov.uk"));
console.log(`── gov.uk sources (${govuk.length}) ──`);
for (const s of govuk) console.log(`  ${s.title || "(no title)"}\n    ${s.url}`);
console.log(`\n── other sources (${other.length}) ──`);
for (const s of other) console.log(`  [${s.source}] ${s.title || "(no title)"}\n    ${s.url}`);
