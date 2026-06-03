/**
 * Create the 6 knowledge topics + 8 launch article drafts in Sanity.
 *
 * - Topics are created (or updated) as PUBLISHED documents.
 * - Articles are created as DRAFTS (Sanity prefixes `_id` with `drafts.`),
 *   so they won't appear on the live /learn pages until an accountant
 *   reviews them, fills in `lastReviewed`, and publishes from Studio.
 *
 * Idempotent — re-running won't duplicate. Topic intros / metadata are
 * patched on every run. Existing article drafts keep their body (so you
 * can re-run after changes without clobbering accountant edits).
 *
 * Run:
 *   SANITY_TOKEN=... node scripts/learn-seed/05-create-hubs.mjs
 *
 * Or set SANITY_TOKEN in .env.local and just:
 *   node scripts/learn-seed/05-create-hubs.mjs
 */

import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { TOPICS, HUBS } from "./launch-hubs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

// Load .env.local if present
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

if (!process.env.SANITY_TOKEN) {
  console.error("✗ SANITY_TOKEN not set.");
  console.error("  Get a write token from https://www.sanity.io/manage → sgaod5tg → API → Tokens (Editor)");
  console.error("  Then add to .env.local:  SANITY_TOKEN=skXXXX...");
  process.exit(1);
}

const client = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const TOPIC_ID = (slug) => `knowledgeTopic-${slug}`;
const ARTICLE_DRAFT_ID = (slug) => `drafts.knowledgeArticle-${slug}`;
const ARTICLE_PUB_ID = (slug) => `knowledgeArticle-${slug}`;

async function upsertTopic(topic) {
  const id = TOPIC_ID(topic.slug);
  const baseFields = {
    name: topic.name,
    slug: { _type: "slug", current: topic.slug },
    shortDescription: topic.shortDescription,
    intro: topic.intro,
    icon: topic.icon,
    order: topic.order,
  };
  // Patch base fields if the topic exists, otherwise create. We deliberately
  // DO NOT createOrReplace — that would wipe keyFacts / timeline / usefulLinks
  // / quickAnswers managed by 07-enrich-topics.mjs (or by accountants in
  // Studio). This is exactly how the Expenses-and-friends topic data got
  // wiped on 2026-05-28; never again.
  const existing = await client.getDocument(id).catch(() => null);
  if (existing) {
    await client.patch(id).set(baseFields).commit();
    console.log(`  ↻ topic: ${topic.name} — base fields refreshed`);
  } else {
    await client.create({ _id: id, _type: "knowledgeTopic", ...baseFields });
    console.log(`  + topic: ${topic.name} — created`);
  }
  return id;
}

async function ensureArticleDraft(hub, topicSanityId) {
  const draftId = ARTICLE_DRAFT_ID(hub.articleSlug);
  const pubId = ARTICLE_PUB_ID(hub.articleSlug);

  // If a published version already exists, don't touch it (accountant has published it)
  const pub = await client.getDocument(pubId).catch(() => null);
  if (pub) {
    console.log(`  ⏭  ${hub.articleSlug} — already published, skipping`);
    return;
  }

  // If a draft already exists, don't clobber the body — patch only the metadata fields
  const existing = await client.getDocument(draftId).catch(() => null);
  if (existing) {
    await client
      .patch(draftId)
      .set({
        title: hub.title,
        slug: { _type: "slug", current: hub.articleSlug },
        topic: { _type: "reference", _ref: topicSanityId },
        canonicalQuestion: hub.canonicalQuestion,
        appliesTo: hub.appliesTo,
      })
      .commit();
    console.log(`  ↻ ${hub.articleSlug} — draft existed, metadata refreshed`);
    return;
  }

  // Create fresh draft. Body is intentionally empty — the drafter (06) fills it.
  // lastReviewed is intentionally NOT set — Sanity Studio will block publishing
  // until an accountant fills it in. That's the desired workflow.
  await client.create({
    _id: draftId,
    _type: "knowledgeArticle",
    title: hub.title,
    slug: { _type: "slug", current: hub.articleSlug },
    topic: { _type: "reference", _ref: topicSanityId },
    canonicalQuestion: hub.canonicalQuestion,
    appliesTo: hub.appliesTo,
    excerpt: "[Drafter will fill this — short one-line answer.]",
  });
  console.log(`  + ${hub.articleSlug} — new draft created`);
}

(async () => {
  console.log("→ Creating/updating knowledge topics…");
  const topicIds = new Map();
  for (const topic of TOPICS) {
    const id = await upsertTopic(topic);
    topicIds.set(topic.slug, id);
  }

  console.log("\n→ Ensuring 8 launch article drafts…");
  for (const hub of HUBS) {
    const topicId = topicIds.get(hub.topicSlug);
    if (!topicId) {
      console.error(`  ✗ ${hub.articleSlug}: topic "${hub.topicSlug}" not found`);
      continue;
    }
    await ensureArticleDraft(hub, topicId);
  }

  console.log("\n✓ Done. Open https://your-domain/studio → 🎓 Learning Centre to see them.");
  console.log("  Next: run scripts/learn-seed/06-draft.mjs to fill the bodies via Gemini.");
})().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
