/**
 * Tighten the hero `description` on every Workwell servicePage doc to a punchy
 * 1-2 sentences (the grounded copy is accurate but too long for a hero). Keeps
 * meaning + facts; only shortens. The longer detail still lives in features/FAQs.
 *   node scripts/tighten-workwell-descriptions.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = join(ROOT, ".env.local");
if (existsSync(env)) for (const l of readFileSync(env, "utf8").split(/\r?\n/)) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) { console.error("✗ GEMINI_API_KEY not set"); process.exit(1); }
const sanity = createClient({ projectId: "sgaod5tg", dataset: "production", apiVersion: "2024-01-01", token: process.env.SANITY_TOKEN, useCdn: false });

async function tighten(title, description) {
  const prompt = `Rewrite this accountancy hero description so it is PUNCHY and scannable for a B2C website hero: a maximum of TWO short sentences, ideally under 28 words total. Keep the same meaning and any facts; do not add new claims. Voice: warm, modern, proactive, plain British English; no hype, no exclamation marks. Return ONLY the rewritten text, nothing else.

Page: ${title}
Current: ${description}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  let t = (data?.candidates?.[0]?.content?.parts || []).map((x) => x.text).filter(Boolean).join("").trim();
  return t.replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
}

async function run() {
  const docs = await sanity.fetch(`*[_type=="servicePage" && brand=="workwell" && defined(description)]{_id, title, description}`);
  for (const d of docs) {
    try {
      const tight = await tighten(d.title, d.description);
      if (!tight || tight.length < 20) { console.log(`- skip ${d._id} (bad output)`); continue; }
      await sanity.patch(d._id).set({ description: tight }).commit();
      console.log(`✓ ${d.title}: ${tight.split(" ").length}w — "${tight}"`);
    } catch (e) { console.log(`✗ ${d._id}: ${e.message}`); }
  }
}
run();
