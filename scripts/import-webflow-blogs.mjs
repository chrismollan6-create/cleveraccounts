/**
 * Import blog posts from a Webflow CSV export into Sanity.
 *
 * Prerequisites:
 *   1. Get a write token from https://www.sanity.io/manage
 *      → project sgaod5tg → API → Tokens → Add API token (choose "Editor")
 *   2. Place your Webflow CSV export at scripts/webflow-blogs.csv
 *   3. Run:
 *      SANITY_TOKEN=your-token node scripts/import-webflow-blogs.mjs
 *
 * Webflow CSV columns (Clever Accounts blog export):
 *   Name, Slug, Collection ID, Locale ID, Item ID, Archived, Draft,
 *   Created On, Updated On, Published On, Image, Card Text, Time to read,
 *   Featured, Author, Tag, Rich Text, Published Date
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Buffer } from "buffer";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.SANITY_TOKEN) {
  console.error("❌  SANITY_TOKEN is not set.");
  console.error("   Get one from https://www.sanity.io/manage → project sgaod5tg → API → Tokens");
  process.exit(1);
}

const client = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// Sanity allows: tax | ir35 | vat | business-tips | payroll | news | guides
// Map Webflow Tag values (lowercased) to a Sanity category.
const CATEGORY_MAP = {
  "tax": "tax",
  "ir35": "ir35",
  "vat": "vat",
  "payroll": "payroll",
  "news": "news",
  "business-news": "news",
  "business news": "news",
  "guides": "guides",
  "running-a-business": "business-tips",
  "running a business": "business-tips",
  "business tips": "business-tips",
  "business-tips": "business-tips",
  "expenses": "business-tips",
  "limited-company": "business-tips",
  "limited company": "business-tips",
  "personal-finance": "business-tips",
  "property-finance": "business-tips",
  "finance": "business-tips",
  "tools": "guides",
};

const ONLY_SLUG = process.env.ONLY_SLUG || null;
const SKIP_DRAFTS = process.env.SKIP_DRAFTS !== "false";
const SKIP_ARCHIVED = process.env.SKIP_ARCHIVED !== "false";
const UPLOAD_IMAGES = process.env.UPLOAD_IMAGES !== "false";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function key() {
  return Math.random().toString(36).slice(2, 14);
}

// Decode the most common HTML entities & strip Webflow's mojibake "Â" artefacts
function decodeEntities(s) {
  if (!s) return "";
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&pound;/gi, "£")
    .replace(/&euro;/gi, "€")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, "\"")
    .replace(/&ldquo;/gi, "\"")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    // Webflow exports often double-encode UTF-8 as latin1 → "Â£" instead of "£"
    .replace(/Â£/g, "£")
    .replace(/Â /g, " ")
    .replace(/â¬/g, "€")
    .replace(/â¦/g, "…")
    .replace(/â/g, "'");
}

// Parse inline HTML (a single block's contents) into PT children + markDefs.
// Supported: <strong>/<b>, <em>/<i>, <a href>. Everything else is stripped.
function parseInline(html) {
  const children = [];
  const markDefs = [];
  const activeMarks = [];
  let buffer = "";

  const flush = () => {
    if (!buffer) return;
    children.push({
      _type: "span",
      _key: key(),
      text: decodeEntities(buffer),
      marks: [...activeMarks],
    });
    buffer = "";
  };

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?>/g;
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    buffer += html.slice(lastIndex, match.index);
    const full = match[0];
    const tag = match[1].toLowerCase();
    const isClosing = full.startsWith("</");

    if (tag === "strong" || tag === "b") {
      flush();
      if (isClosing) {
        const idx = activeMarks.lastIndexOf("strong");
        if (idx !== -1) activeMarks.splice(idx, 1);
      } else {
        activeMarks.push("strong");
      }
    } else if (tag === "em" || tag === "i") {
      flush();
      if (isClosing) {
        const idx = activeMarks.lastIndexOf("em");
        if (idx !== -1) activeMarks.splice(idx, 1);
      } else {
        activeMarks.push("em");
      }
    } else if (tag === "a") {
      flush();
      if (isClosing) {
        // pop the last active link mark
        for (let i = activeMarks.length - 1; i >= 0; i--) {
          if (activeMarks[i].startsWith("link-")) {
            activeMarks.splice(i, 1);
            break;
          }
        }
      } else {
        const hrefMatch = (match[2] || "").match(/href\s*=\s*"([^"]+)"|href\s*=\s*'([^']+)'/i);
        const href = hrefMatch ? (hrefMatch[1] || hrefMatch[2]) : "";
        if (href) {
          const markKey = `link-${key()}`;
          markDefs.push({ _key: markKey, _type: "link", href: decodeEntities(href) });
          activeMarks.push(markKey);
        }
      }
    } else if (tag === "br") {
      buffer += "\n";
    }
    // ignore everything else (img inside p, span, etc.) — image blocks handled at block level

    lastIndex = match.index + full.length;
  }
  buffer += html.slice(lastIndex);
  flush();

  // Sanity requires at least one child span
  if (children.length === 0) {
    children.push({ _type: "span", _key: key(), text: "", marks: [] });
  }

  return { children, markDefs };
}

function makeBlock(style, html, listItem = null) {
  const { children, markDefs } = parseInline(html);
  const block = {
    _type: "block",
    _key: key(),
    style,
    children,
    markDefs,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = 1;
  }
  return block;
}

// Convert HTML body to Sanity Portable Text blocks
function htmlToPortableText(html) {
  if (!html) return [];

  const blocks = [];
  // Drop Webflow's embedded raw-HTML/script blocks and figures (tables, twitter, etc.)
  // We can't render them as Portable Text without custom block types.
  let cleaned = html
    .replace(/<div\s+data-rt-embed-type=[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .trim();

  const blockRegex = /<(h[1-6]|p|ul|ol|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = blockRegex.exec(cleaned)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];

    let style = "normal";
    if (tag === "h1" || tag === "h2") style = "h2";
    else if (tag === "h3") style = "h3";
    else if (tag === "h4" || tag === "h5" || tag === "h6") style = "h4";
    else if (tag === "blockquote") style = "blockquote";

    if (tag === "ul" || tag === "ol") {
      const liRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(inner)) !== null) {
        const liText = liMatch[1].trim();
        if (!liText) continue;
        blocks.push(makeBlock("normal", liText, tag === "ul" ? "bullet" : "number"));
      }
    } else {
      const trimmedInner = inner.trim();
      if (!trimmedInner) continue;
      // skip the tiny "â" continuation paragraphs Webflow leaves behind
      const plain = trimmedInner.replace(/<[^>]+>/g, "").trim();
      if (!plain || plain === "â" || plain === "—") continue;
      blocks.push(makeBlock(style, trimmedInner));
    }
  }

  if (blocks.length === 0) {
    const text = cleaned.replace(/<[^>]+>/g, "").trim();
    if (text) blocks.push(makeBlock("normal", text));
  }

  return blocks;
}

async function uploadImageFromUrl(url, alt) {
  if (!url || !UPLOAD_IMAGES) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`   ⚠️  image fetch ${res.status} for ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = url.split("/").pop()?.split("?")[0] || "image";
    const asset = await client.assets.upload("image", buf, { filename });
    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      ...(alt && { alt }),
    };
  } catch (e) {
    console.warn(`   ⚠️  image upload failed: ${e.message}`);
    return null;
  }
}

function parseRow(row) {
  const get = (...keys) => {
    for (const k of keys) {
      const found = Object.keys(row).find((r) => r.toLowerCase().trim() === k.toLowerCase());
      if (found && row[found] != null) return String(row[found]).trim();
    }
    return "";
  };

  const title = decodeEntities(get("name", "title"));
  const rawSlug = get("slug", "post-slug");
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  const archived = get("archived").toLowerCase() === "true";
  const draft = get("draft").toLowerCase() === "true";
  const featured = get("featured").toLowerCase() === "true";
  const publishedAt =
    get("published date") || get("published on") || get("updated on") || get("created on");
  const body = get("rich text", "post body", "body", "content");
  const excerpt = decodeEntities(get("card text", "post summary", "summary", "excerpt")).slice(0, 200);
  const tag = get("tag", "category", "categories");
  const author = decodeEntities(get("author")) || "Clever Accounts";
  const imageUrl = get("image", "main image");
  const metaTitle = decodeEntities(get("seo title", "meta title", "meta-title")).slice(0, 60);
  const metaDescription = decodeEntities(
    get("seo description", "meta description", "meta-description")
  ).slice(0, 160);

  const mappedCategory = CATEGORY_MAP[tag.toLowerCase()] || "news";

  let parsedDate;
  try {
    parsedDate = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
  } catch {
    parsedDate = new Date().toISOString();
  }

  return {
    title,
    slug,
    archived,
    draft,
    featured,
    publishedAt: parsedDate,
    body,
    excerpt,
    author,
    imageUrl,
    category: mappedCategory,
    metaTitle,
    metaDescription,
  };
}

async function run() {
  const csvPath = join(__dirname, "webflow-blogs.csv");
  const rows = [];

  await new Promise((resolve, reject) => {
    createReadStream(csvPath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true, relax_quotes: true }))
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`📄 Found ${rows.length} rows in CSV`);

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const parsed = parseRow(row);

    if (!parsed.title || !parsed.slug) {
      skipped++;
      continue;
    }
    if (ONLY_SLUG && parsed.slug !== ONLY_SLUG) {
      skipped++;
      continue;
    }
    if (SKIP_ARCHIVED && parsed.archived) {
      console.log(`↪︎  archived, skip: ${parsed.title}`);
      skipped++;
      continue;
    }
    if (SKIP_DRAFTS && parsed.draft) {
      console.log(`↪︎  draft, skip: ${parsed.title}`);
      skipped++;
      continue;
    }

    const featuredImage = parsed.imageUrl
      ? await uploadImageFromUrl(parsed.imageUrl, parsed.title)
      : null;

    const doc = {
      _type: "blogPost",
      _id: `webflow-${parsed.slug}`,
      title: parsed.title,
      slug: { _type: "slug", current: parsed.slug },
      excerpt: parsed.excerpt || parsed.title.slice(0, 200),
      category: parsed.category,
      author: parsed.author,
      publishedAt: parsed.publishedAt,
      body: htmlToPortableText(parsed.body),
      ...(featuredImage && { featuredImage }),
      ...(parsed.metaTitle && { metaTitle: parsed.metaTitle }),
      ...(parsed.metaDescription && { metaDescription: parsed.metaDescription }),
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✅ ${doc.title}`);
      created++;
    } catch (err) {
      console.error(`❌ Failed: ${doc.title} — ${err.message}`);
      skipped++;
    }
  }

  console.log(`\nDone. ${created} imported, ${skipped} skipped.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
