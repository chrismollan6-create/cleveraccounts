import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const c = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});
const docs = await c.fetch(
  `*[_type=="servicePage"]{ "slug": slug.current, brand, "feat": count(features), "ben": count(benefits), "faq": count(faqs), "stats": count(stats), "cats": count(serviceCategories) } | order(slug)`
);
for (const d of docs) {
  console.log(
    `${(d.slug || "(no slug)").padEnd(28)} | ${(d.brand || "shared").padEnd(8)} | feat ${d.feat || 0}  ben ${d.ben || 0}  faq ${d.faq || 0}  stats ${d.stats || 0}  cats ${d.cats || 0}`
  );
}
