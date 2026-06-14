/**
 * Export every knowledgeArticle (published + drafts) into a single
 * self-contained HTML file for a senior accountant to review for accuracy.
 *
 * The accountant can open it in a browser, print to PDF and annotate, or
 * open it directly in Word and use track changes.
 *
 * Run:
 *   SANITY_TOKEN=... node scripts/learn-seed/export-for-review.mjs
 *
 * Or set SANITY_TOKEN in .env.local and just:
 *   node scripts/learn-seed/export-for-review.mjs
 *
 * Output: ./learn-articles-review.html (path printed on completion)
 */

import { createClient } from "@sanity/client";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname, resolve } from "path";
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

if (!process.env.SANITY_TOKEN) {
  console.warn("⚠  SANITY_TOKEN not set — will export PUBLISHED articles only.");
  console.warn("   To include unpublished drafts, get a read token from");
  console.warn("   https://www.sanity.io/manage → sgaod5tg → API → Tokens (Viewer is enough)");
  console.warn("   and add SANITY_TOKEN=... to .env.local, then re-run.\n");
}

const client = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  perspective: "raw",
});

const query = `*[_type == "knowledgeArticle"] | order(coalesce(topic->name, "zzz") asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  canonicalQuestion,
  excerpt,
  appliesTo,
  lastReviewed,
  reviewDue,
  reviewedBy,
  "topicName": topic->name,
  body,
  draftedSources
}`;

const docs = await client.fetch(query);

const byId = new Map();
for (const d of docs) {
  const baseId = d._id.replace(/^drafts\./, "");
  const isDraft = d._id.startsWith("drafts.");
  const existing = byId.get(baseId);
  if (!existing || (isDraft && !existing.isDraft)) {
    byId.set(baseId, { ...d, isDraft });
  }
}

const articles = [...byId.values()].sort((a, b) => {
  const t = (a.topicName || "zzz").localeCompare(b.topicName || "zzz");
  return t !== 0 ? t : a.title.localeCompare(b.title);
});

const escape = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function renderSpans(children = [], markDefs = []) {
  return children
    .map((c) => {
      if (c._type !== "span") return "";
      let text = escape(c.text || "");
      const marks = c.marks || [];
      for (const m of marks) {
        if (m === "strong") text = `<strong>${text}</strong>`;
        else if (m === "em") text = `<em>${text}</em>`;
        else {
          const def = markDefs.find((d) => d._key === m);
          if (def?._type === "link" && def.href) {
            text = `<a href="${escape(def.href)}">${text}</a>`;
          }
        }
      }
      return text;
    })
    .join("");
}

function renderBody(body = []) {
  const out = [];
  let listBuf = null;
  const flushList = () => {
    if (!listBuf) return;
    const tag = listBuf.type === "number" ? "ol" : "ul";
    out.push(`<${tag}>${listBuf.items.join("")}</${tag}>`);
    listBuf = null;
  };

  for (const block of body) {
    if (block._type === "block") {
      const text = renderSpans(block.children, block.markDefs);
      if (block.listItem) {
        if (!listBuf || listBuf.type !== block.listItem) {
          flushList();
          listBuf = { type: block.listItem, items: [] };
        }
        listBuf.items.push(`<li>${text}</li>`);
        continue;
      }
      flushList();
      const style = block.style || "normal";
      if (style === "h2") out.push(`<h2>${text}</h2>`);
      else if (style === "h3") out.push(`<h3>${text}</h3>`);
      else if (style === "h4") out.push(`<h4>${text}</h4>`);
      else if (style === "blockquote") out.push(`<blockquote>${text}</blockquote>`);
      else out.push(`<p>${text}</p>`);
    } else {
      flushList();
      if (block._type === "image") {
        out.push(`<p class="note">[Image: ${escape(block.alt || "no alt text")}]</p>`);
      } else if (block._type === "faqBlock") {
        const heading = block.heading ? `<h3>${escape(block.heading)}</h3>` : `<h3>FAQs</h3>`;
        const items = (block.faqs || [])
          .map((f) => `<p><strong>Q. ${escape(f.q)}</strong><br>A. ${escape(f.a)}</p>`)
          .join("");
        out.push(`<div class="embed">${heading}${items}</div>`);
      } else if (block._type === "howToBlock") {
        const heading = `<h3>How to: ${escape(block.name || "")}</h3>`;
        const desc = block.description ? `<p>${escape(block.description)}</p>` : "";
        const steps = (block.steps || [])
          .map(
            (s, i) =>
              `<li><strong>${escape(s.name || `Step ${i + 1}`)}.</strong> ${escape(s.text)}</li>`,
          )
          .join("");
        out.push(`<div class="embed">${heading}${desc}<ol>${steps}</ol></div>`);
      } else if (block._type === "ctaBlock") {
        out.push(
          `<p class="note">[CTA: ${escape(block.heading || "")}${block.subheading ? " — " + escape(block.subheading) : ""}]</p>`,
        );
      } else if (block._type === "htmlEmbed") {
        out.push(
          `<p class="note">[HTML embed${block.label ? ": " + escape(block.label) : ""} — review in Studio]</p>`,
        );
      } else {
        out.push(`<p class="note">[Unsupported block: ${escape(block._type)}]</p>`);
      }
    }
  }
  flushList();
  return out.join("\n");
}

const today = new Date().toISOString().slice(0, 10);

const summaryRows = articles
  .map((a, i) => {
    const reviewed = a.lastReviewed || "—";
    const status = a.isDraft ? "DRAFT" : "PUBLISHED";
    return `<tr>
      <td>${i + 1}</td>
      <td><a href="#article-${i + 1}">${escape(a.title)}</a></td>
      <td>${escape(a.topicName || "—")}</td>
      <td>${escape(status)}</td>
      <td>${escape(reviewed)}</td>
    </tr>`;
  })
  .join("\n");

const articleSections = articles
  .map((a, i) => {
    const sources = (a.draftedSources || [])
      .map(
        (s) =>
          `<li><strong>[${escape(s.source || "?")}]</strong> ${escape(s.title || "(no title)")}<br><a href="${escape(s.url || "")}">${escape(s.url || "")}</a></li>`,
      )
      .join("");
    const appliesTo = (a.appliesTo || []).map((t) => `<span class="tag">${escape(t)}</span>`).join(" ");
    return `<section class="article" id="article-${i + 1}">
      <div class="meta-bar">
        <span class="badge ${a.isDraft ? "draft" : "published"}">${a.isDraft ? "DRAFT" : "PUBLISHED"}</span>
        <span class="topic">${escape(a.topicName || "No topic")}</span>
      </div>
      <h1>${escape(a.title)}</h1>
      <p class="canonical"><strong>Question:</strong> ${escape(a.canonicalQuestion || "—")}</p>
      <p class="excerpt"><strong>Excerpt:</strong> ${escape(a.excerpt || "—")}</p>
      <table class="meta">
        <tr><th>Slug</th><td>/learn/${escape(a.slug || "")}</td></tr>
        <tr><th>Applies to</th><td>${appliesTo || "—"}</td></tr>
        <tr><th>Last reviewed</th><td>${escape(a.lastReviewed || "— (not yet reviewed)")}</td></tr>
        <tr><th>Reviewed by</th><td>${escape(a.reviewedBy || "—")}</td></tr>
        <tr><th>Next review due</th><td>${escape(a.reviewDue || "—")}</td></tr>
      </table>

      <h2 class="section-h">Article body</h2>
      <div class="body">
        ${renderBody(a.body)}
      </div>

      ${
        sources
          ? `<h2 class="section-h">Drafter sources (please spot-check gov.uk citations)</h2>
             <ul class="sources">${sources}</ul>`
          : `<p class="note">No drafter sources recorded.</p>`
      }

      <div class="reviewer-block">
        <h3>Reviewer notes</h3>
        <p>Accuracy verdict (delete as appropriate): <strong>Accurate&nbsp;&nbsp;/&nbsp;&nbsp;Needs minor edits&nbsp;&nbsp;/&nbsp;&nbsp;Needs rewrite&nbsp;&nbsp;/&nbsp;&nbsp;Withdraw</strong></p>
        <p>Notes:</p>
        <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
      </div>
    </section>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Clever Accounts — Learn Articles for Accuracy Review (${today})</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; max-width: 820px; margin: 2rem auto; color: #111; padding: 0 1rem; line-height: 1.55; }
  h1 { font-size: 1.7rem; margin: 0 0 0.5rem; }
  h2 { font-size: 1.25rem; margin-top: 1.8rem; }
  h2.section-h { border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; color: #444; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
  h3 { font-size: 1.05rem; margin-top: 1.2rem; }
  .cover { border-bottom: 3px solid #10b981; padding-bottom: 1rem; margin-bottom: 2rem; }
  .cover h1 { font-size: 2rem; }
  .summary { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .summary th, .summary td { border: 1px solid #ddd; padding: 0.4rem 0.6rem; text-align: left; }
  .summary th { background: #f6f8fa; }
  .article { page-break-before: always; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #eee; }
  .article:first-of-type { page-break-before: auto; }
  .meta-bar { display: flex; gap: 0.75rem; align-items: center; font-size: 0.85rem; margin-bottom: 0.5rem; }
  .badge { padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; letter-spacing: 0.05em; }
  .badge.draft { background: #fef3c7; color: #92400e; }
  .badge.published { background: #d1fae5; color: #065f46; }
  .topic { color: #666; }
  .canonical, .excerpt { background: #f9fafb; padding: 0.5rem 0.75rem; border-left: 3px solid #3b82f6; font-style: italic; }
  table.meta { border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
  table.meta th { text-align: left; padding: 0.25rem 0.75rem 0.25rem 0; color: #666; font-weight: normal; vertical-align: top; }
  table.meta td { padding: 0.25rem 0; }
  .tag { display: inline-block; background: #eef2ff; color: #3730a3; padding: 1px 8px; border-radius: 10px; font-size: 0.8rem; margin-right: 4px; }
  .body p { margin: 0.7rem 0; }
  .body blockquote { border-left: 3px solid #ccc; margin: 1rem 0; padding: 0.25rem 1rem; color: #555; }
  .body .note { color: #999; font-style: italic; }
  .body .embed { background: #fafafa; padding: 0.75rem 1rem; border: 1px dashed #ddd; margin: 1rem 0; }
  .sources { font-size: 0.85rem; }
  .sources li { margin-bottom: 0.5rem; }
  .reviewer-block { margin-top: 2rem; background: #fffbeb; border: 1px solid #fde68a; padding: 1rem; border-radius: 4px; }
  .reviewer-block h3 { margin-top: 0; }
  @media print {
    body { max-width: none; margin: 0; }
    .article { page-break-before: always; }
  }
</style>
</head>
<body>

<div class="cover">
  <h1>Clever Accounts — Learning Centre articles</h1>
  <p><strong>For accuracy review by:</strong> ____________________________</p>
  <p><strong>Generated:</strong> ${today}</p>
  <p><strong>Articles included:</strong> ${articles.length} (${articles.filter((a) => a.isDraft).length} draft, ${articles.filter((a) => !a.isDraft).length} published)</p>
  <p>Please review each article for technical accuracy against current UK tax/accounting rules. The “Drafter sources” section at the foot of each article lists URLs Gemini cited while drafting — please spot-check the gov.uk ones. Use the Reviewer notes box at the foot of each article to record your verdict and any edits.</p>

  <h2 class="section-h">Contents</h2>
  <table class="summary">
    <thead><tr><th>#</th><th>Title</th><th>Topic</th><th>Status</th><th>Last reviewed</th></tr></thead>
    <tbody>${summaryRows}</tbody>
  </table>
</div>

${articleSections}

</body>
</html>`;

const htmlOut = resolve(ROOT, "learn-articles-review.html");
writeFileSync(htmlOut, html, "utf8");

// Word-friendly copy. Word opens this directly via double-click and lets the
// reviewer use track changes; they can "Save As .docx" if they want a native
// Word file. The MIME meta tag makes Word treat it as a Word document rather
// than a generic web page.
const wordHtml = html.replace(
  "<head>",
  `<head>
<meta http-equiv="Content-Type" content="application/msword; charset=utf-8">
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml>`,
);
const docOut = resolve(ROOT, "learn-articles-review.doc");
writeFileSync(docOut, wordHtml, "utf8");

const draftCount = articles.filter((a) => a.isDraft).length;
const pubCount = articles.filter((a) => !a.isDraft).length;
console.log(`✓ Exported ${articles.length} articles (${draftCount} draft, ${pubCount} published)`);
console.log(`  HTML: ${htmlOut}`);
console.log(`  Word: ${docOut}  (double-click to open in Word)`);
