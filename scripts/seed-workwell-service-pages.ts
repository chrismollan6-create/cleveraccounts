/**
 * One-off: populate the Workwell service-page docs in Sanity so Studio matches
 * the live page (no more "No items" + hidden fallback). Non-destructive — only
 * FILLS EMPTY fields, never overwrites editor changes — and tags each doc
 * Brand = Workwell. Idempotent (safe to re-run).
 *
 * Run:  npx tsx scripts/seed-workwell-service-pages.ts
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { servicePages } from "../src/lib/service-page-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Load .env.local (same approach as scripts/learn-seed/*).
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const SANITY_TOKEN = process.env.SANITY_TOKEN;
if (!SANITY_TOKEN) {
  console.error("✗ SANITY_TOKEN not set in .env.local");
  process.exit(1);
}

const sanity = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: SANITY_TOKEN,
  useCdn: false,
});

const deClever = (s: string): string =>
  s
    .replace(/Clever Accounts/g, "Workwell Accountancy")
    .replace(/Clever FLEX umbrella solution/gi, "umbrella solution")
    .replace(/\bClever FLEX\b/gi, "umbrella");

const stripBrand = (s: string) => s.replace(/\s*\|\s*Clever Accounts\s*$/i, "").trim();
const key = (p: string, i: number) => `${p}-${i}`;

// Only the slugs that have a Workwell route wired today.
const SLUGS = [
  "sole-trader",
  "limited-company",
  "contractor-accountancy",
  "freelancer-accountancy",
  "landlord-accounting",
  "accounting-for-startups",
  "ecommerce-accounting",
  "small-business-accountant",
  "cis-accounting",
];

function isEmpty(v: unknown): boolean {
  if (v == null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v as object).length === 0;
  return false;
}

async function run() {
  for (const slug of SLUGS) {
    const fb = servicePages[slug];
    if (!fb) {
      console.log(`- ${slug}: no fallback data, skipping`);
      continue;
    }

    const full = {
      title: deClever(stripBrand(fb.title)),
      headline: deClever(fb.headline),
      description: deClever(fb.description),
      price: fb.price,
      features: fb.features.map(deClever),
      benefits: fb.benefits.map((b, i) => ({
        _key: key("benefit", i),
        title: deClever(b.title),
        description: deClever(b.description),
      })),
      faqs: fb.faqs.map((f, i) => ({ _key: key("faq", i), question: deClever(f.q), answer: deClever(f.a) })),
      stats: fb.stats?.map((s, i) => ({ _key: key("stat", i), value: s.value, label: deClever(s.label) })),
      serviceCategories: fb.serviceCategories?.map((c, i) => ({
        _key: key("cat", i),
        title: deClever(c.title),
        items: c.items.map(deClever),
      })),
      testimonial: fb.testimonial
        ? {
            name: deClever(fb.testimonial.name),
            role: deClever(fb.testimonial.role),
            quote: deClever(fb.testimonial.quote),
          }
        : undefined,
      metaTitle: deClever(stripBrand(fb.title)),
      metaDescription: deClever(fb.metaDescription),
    };

    const existing = await sanity.fetch<Record<string, unknown> & { _id: string }>(
      `*[_type == "servicePage" && slug.current == $slug] | order(_updatedAt desc)[0]`,
      { slug }
    );

    // Build a patch that only fills empties + tags Workwell.
    const set: Record<string, unknown> = { brand: "workwell" };
    const fillIfEmpty = (field: string, value: unknown) => {
      if (value !== undefined && isEmpty(existing?.[field])) set[field] = value;
    };
    fillIfEmpty("title", full.title);
    fillIfEmpty("headline", full.headline);
    fillIfEmpty("description", full.description);
    fillIfEmpty("price", full.price);
    fillIfEmpty("features", full.features);
    fillIfEmpty("benefits", full.benefits);
    fillIfEmpty("faqs", full.faqs);
    fillIfEmpty("stats", full.stats);
    fillIfEmpty("serviceCategories", full.serviceCategories);
    fillIfEmpty("metaTitle", full.metaTitle);
    fillIfEmpty("metaDescription", full.metaDescription);
    if (full.testimonial && isEmpty((existing?.testimonial as { quote?: string })?.quote)) {
      set.testimonial = full.testimonial;
    }

    if (existing?._id) {
      const id = existing._id.replace(/^drafts\./, "");
      await sanity.patch(id).set(set).commit();
      console.log(`✓ patched ${slug} (${id}) — filled ${Object.keys(set).length - 1} empty field(s) + Brand=Workwell`);
    } else {
      const created = await sanity.create({
        _type: "servicePage",
        slug: { _type: "slug", current: slug },
        ...set,
        ...full,
      });
      console.log(`✓ created ${slug} (${created._id})`);
    }
  }
  console.log("\nDone. Reload Studio (you may need to discard any open draft to see the filled fields).");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
