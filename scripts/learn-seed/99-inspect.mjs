/**
 * One-off: inspect the directors-loan article in Sanity to diagnose the 500.
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

const r = await client.fetch(`*[_type == "knowledgeArticle" && slug.current == "directors-loan-account-s455-explained"] {
  _id, _type, title, "slug": slug.current,
  canonicalQuestion, excerpt, appliesTo,
  lastReviewed, reviewedBy,
  "topicRef": topic._ref,
  "resolvedTopic": topic->{_id, name, "slug": slug.current},
  "bodyLen": length(body),
  "firstBlock": body[0],
  "secondBlock": body[1],
  "lastBlock": body[length(body)-1],
  "blocksMissingKey": count(body[!defined(_key)]),
  "blocksMissingType": count(body[!defined(_type)]),
  "blockTypes": array::unique(body[]._type)
}`);

console.log(JSON.stringify(r, null, 2));
