/**
 * One-off migration: split the shared `pricingPlan` documents into per-brand
 * panels so Clever Accounts and Workwell Accountancy each have their OWN plans
 * in the CMS (editable independently in Studio).
 *
 * For every existing plan that isn't already brand-tagged it:
 *   1. tags the ORIGINAL doc  brand = "clever"  (stays Clever-only), and
 *   2. creates a WORKWELL COPY (_id `<origId>-workwell`, brand = "workwell")
 *      with Clever-specific product names stripped from the copy.
 *
 * Idempotent: re-running skips plans already tagged, and uses createIfNotExists
 * for the Workwell copy so it never clobbers edits you've made in Studio.
 *
 * Needs a Sanity token with WRITE access (Editor role). The read token in
 * .env.local won't work for the live run — create a fresh Editor token at
 * Studio → project sgaod5tg → API → Tokens, then either set it as
 * SANITY_WRITE_TOKEN or pass it inline.
 *
 *   node scripts/split-pricing-brands.mjs            # DRY RUN (no writes)
 *   node scripts/split-pricing-brands.mjs --live     # apply changes
 *   SANITY_WRITE_TOKEN=sk... node scripts/split-pricing-brands.mjs --live
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(ROOT, ".env.local");
if (existsSync(envPath))
  for (const l of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }

const LIVE = process.argv.includes("--live");
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_TOKEN;
if (LIVE && !token) {
  console.error("✗ No Sanity token. Set SANITY_WRITE_TOKEN (Editor role) for the live run.");
  process.exit(1);
}

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "sgaod5tg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/** Strip Clever-specific product names so the Workwell copy reads clean. Mirrors
 *  the in-page deClever helpers (pricing/page.tsx + service/ServiceRoute.tsx). */
function deClever(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/Clever FLEX umbrella solution/gi, "Umbrella solution")
    .replace(/\bClever FLEX\b/gi, "umbrella")
    .replace(/Free FreeAgent accounting software/gi, "Free accounting software")
    .replace(/\bFreeAgent\b/gi, "accounting software")
    .replace(/Clever Accounts/g, "Workwell Accountancy");
}

function workwellCopy(plan) {
  const ww = { ...plan };
  ww._id = `${plan._id}-workwell`;
  ww.brand = "workwell";
  delete ww._rev;
  delete ww._createdAt;
  delete ww._updatedAt;
  if (Array.isArray(ww.features)) ww.features = ww.features.map(deClever);
  for (const f of ["subtitle", "homepageHeadline", "homepageStat", "priceNote"])
    if (ww[f]) ww[f] = deClever(ww[f]);
  return ww;
}

async function main() {
  const plans = await sanity.fetch(
    `*[_type == "pricingPlan" && !(_id in path("drafts.**"))] | order(order asc)`
  );
  console.log(`Found ${plans.length} pricingPlan document(s).\n`);

  let tagged = 0;
  let created = 0;
  let skipped = 0;

  for (const plan of plans) {
    // Skip the Workwell copies this script generates.
    if (plan._id.endsWith("-workwell") || plan.brand === "workwell") {
      skipped++;
      continue;
    }

    const needsTag = plan.brand !== "clever";
    const ww = workwellCopy(plan);
    const wwExists = !!(await sanity.fetch(`*[_id == $id][0]._id`, { id: ww._id }));

    console.log(`• ${plan.name} (${plan._id})`);
    console.log(`    original → brand=clever${needsTag ? "" : " (already)"}`);
    console.log(
      `    workwell copy → ${ww._id}${wwExists ? " (exists, leave as-is)" : " (create)"}`
    );

    if (LIVE) {
      if (needsTag) {
        await sanity.patch(plan._id).set({ brand: "clever" }).commit();
        tagged++;
      }
      if (!wwExists) {
        await sanity.createIfNotExists(ww);
        created++;
      }
    } else {
      if (needsTag) tagged++;
      if (!wwExists) created++;
    }
  }

  console.log(
    `\n${LIVE ? "DONE" : "DRY RUN"} — ${tagged} original(s) tagged clever, ` +
      `${created} Workwell copy(ies) ${LIVE ? "created" : "to create"}, ${skipped} skipped.`
  );
  if (!LIVE) console.log("Re-run with --live to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
