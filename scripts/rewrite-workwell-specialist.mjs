/**
 * Create/refresh Workwell servicePage docs for the specialist pages with
 * ORIGINAL grounded copy (Gemini + live Google Search). These render via
 * WorkwellServiceRoute once their route is wired. Creates the doc if missing.
 *
 *   node scripts/rewrite-workwell-specialist.mjs vat-returns
 *   node scripts/rewrite-workwell-specialist.mjs            # whole batch
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

const VOICE = "Workwell Accountancy is a UK online accountancy firm with dedicated, named accountants, free FreeAgent software and one fixed monthly fee. Voice: professional, modern, proactive, genuinely helpful; plain British English; warm but not gimmicky; no hype, no jargon, no exclamation marks.";
const REVIEW = { name: "Limited company client", role: "With Workwell since 2014", quote: "Workwell has administered my company since formation in 2014. I am very happy with the quality of the service that they have provided. Danielle and Ross, in particular, have been excellent in their roles as lead client accountants." };

const PAGES = {
  "vat-returns": { title: "VAT Returns", price: "104.50", audience: "VAT-registered UK businesses and those approaching the threshold", focus: "the VAT registration threshold, choosing the right scheme (standard, Flat Rate, Cash Accounting, Annual Accounting), Making Tax Digital for VAT and compatible software, preparing and filing quarterly returns, what VAT can and cannot be reclaimed, and deregistration" },
  "self-assessment": { title: "Self Assessment Tax Returns", price: "42.50", audience: "anyone who must file a UK Self Assessment tax return", focus: "who needs to file, the registration and filing deadlines (paper vs online, 31 January), payments on account, what income must be declared, allowable expenses, and HMRC penalties for late filing and payment" },
  "making-tax-digital": { title: "Making Tax Digital", price: "104.50", audience: "UK businesses, sole traders and landlords affected by Making Tax Digital", focus: "Making Tax Digital for VAT (already mandatory), Making Tax Digital for Income Tax Self Assessment and the phased start dates and income thresholds, what quarterly updates involve, MTD-compatible software (FreeAgent), and how to prepare without disruption" },
  "payroll-services": { title: "Payroll Services", price: "104.50", audience: "UK limited company directors and small employers", focus: "running payroll and RTI submissions, payslips, P60s and P11Ds, the most tax-efficient director salary for the current tax year, pension auto-enrolment duties, and adding employees" },
  // Batch 2
  "switching-accountants": { title: "Switching Accountants", price: "42.50", audience: "UK businesses thinking about changing their accountant", focus: "how switching actually works (professional clearance, your old accountant hands over records), that you can switch at any point in the year with no gap in compliance, what to check before you move, and why the common worries about cost, hassle and timing are usually unfounded. Frame this as a clear how-to guide." },
  "accountant-switch": { title: "Switch Accountants", price: "42.50", audience: "UK businesses ready to move to a better accountant", focus: "how Workwell handles the entire switch for you, for free — professional clearance with your current accountant, transferring your records and accounting software, no disruption to deadlines or compliance, and being set up within days. Frame this as the done-for-you service, distinct from a general how-to guide." },
  "accounting-software": { title: "Accounting Software", price: "42.50", audience: "small UK businesses and the self-employed choosing accounting software", focus: "FreeAgent included free with every package, what it does (invoicing, expense capture, bank feeds, real-time tax estimates, Self Assessment and VAT filing), that it is Making Tax Digital compatible, the real-time view of your tax position, and that it works on any device with your accountant alongside" },
  "it-contractor-accountant": { title: "IT Contractor Accountants", price: "104.50", audience: "UK IT and technology contractors", focus: "limited company (PSC) vs umbrella for IT contractors, IR35 and off-payroll working for technology roles, tax-efficient dividend planning, the expenses IT contractors can legitimately claim, and having a dedicated accountant who understands contracting" },
  // Batch 3
  "ir35": { title: "IR35 Specialists", price: "104.50", audience: "UK contractors concerned about IR35 and off-payroll working", focus: "what IR35 and the off-payroll working rules mean, how employment status is determined (control, the right of substitution, mutuality of obligation), who decides status (the end client for medium and large clients, the contractor's company for small clients), working compliantly either outside IR35 via a personal service company or inside via an umbrella, and getting contracts reviewed for IR35 risk" },
  "local-accountants": { title: "Local Accountants", price: "42.50", audience: "small business owners looking for a local accountant", focus: "moving from a traditional high-street accountant to a dedicated online accountant, what you gain (a named accountant you can always reach, modern cloud software, a lower fixed monthly cost, and year-round proactive support), and why responsiveness now matters more than a local office" },
  "integrations": { title: "Integrations", price: "42.50", audience: "small businesses that want their finances connected to their other tools", focus: "open banking and automatic bank feeds with UK banks, connecting payment providers such as Stripe, PayPal and GoCardless, and how the included FreeAgent software's integrations automate bookkeeping so transactions flow in and stay reconciled with little manual work" },
  "tax-returns": { title: "Tax Returns", price: "42.50", audience: "individuals and businesses who need any UK tax return prepared and filed", focus: "the full range of returns handled — Self Assessment (SA100), Corporation Tax (CT600), partnership (SA800) and VAT — who needs each, the key filing deadlines, and how a dedicated accountant prepares and files them accurately and on time. Cover the full range so this is clearly distinct from a Self Assessment-only page" },
};

async function gen(p) {
  const prompt = `You are writing the website copy for the "${p.title}" page on Workwell Accountancy's site.
${VOICE}

Audience: ${p.audience}.
Topics to genuinely help with: ${p.focus}.

Write ORIGINAL, DIFFERENTIATED, genuinely INFORMATIVE copy that leads with the SPECIFIC real concerns of this audience — not generic accountant boilerplate. Be concise and scannable: short sentences, key facts and figures over long prose. The reader should be able to skim and learn the essentials quickly.

GROUNDING (critical): Use Google Search to ground EVERY factual claim — thresholds, rates, allowances, deadlines, dates, scheme rules — in CURRENT, authoritative UK sources (prefer gov.uk and HMRC). State the figures that apply to the 2025/26 and 2026/27 tax years. If a figure is uncertain, disputed or changing, describe it qualitatively and point the reader to where to check, rather than stating a number that may be wrong. Do NOT invent statistics, client numbers, ratings, awards or testimonials. Do NOT include citation markers, footnotes, links or markdown in the copy. British English throughout.

Return ONLY one JSON object (no markdown/fences/commentary) with exactly:
{
  "headline": "confident hero headline, max 9 words",
  "description": "2-sentence hero paragraph, specific to this audience",
  "features": ["8-10 short 'what we handle' lines"],
  "benefits": [{"title":"3-5 words","description":"1-2 sentences"} x4],
  "guide": [{"heading":"clear topic title, 3-6 words","intro":"one short plain-English sentence introducing the topic","points":["3-4 short, specific bullet facts — the key numbers, thresholds, dates and rules a reader needs; ONE fact per bullet, roughly 12-20 words, no fluff"]} x4 — SCANNABLE key points, NOT long paragraphs; accurate and current],
  "serviceCategories": [{"title":"3-4 word column title","items":["4-6 short bullet lines"]} x4 — how Workwell handles this service, grouped],
  "faqs": [{"question":"real question this audience asks","answer":"2-4 accurate, current sentences"} x8],
  "stats": [{"value":"e.g. £0","label":"e.g. Setup fees"} x4 — TRUE claims only, never invented metrics],
  "metaTitle": "<= 60 chars incl service",
  "metaDescription": "120-160 chars"
}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.7, maxOutputTokens: 16384 } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
  let text = (data?.candidates?.[0]?.content?.parts || []).map((x) => x.text).filter(Boolean).join("");
  text = text.replace(/```json/gi, "").replace(/```/g, "");
  // Brace-match the first complete top-level object (respecting strings/escapes),
  // ignoring any prose the model emits before/after the JSON.
  const start = text.indexOf("{");
  if (start < 0) throw new Error("no JSON object in response");
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) { end = i + 1; break; }
  }
  if (end < 0) throw new Error("unterminated JSON object");
  const json = text.slice(start, end).replace(/,(\s*[}\]])/g, "$1"); // drop trailing commas
  return JSON.parse(json);
}
const key = (pfx, i) => `${pfx}-${i}`;

async function run() {
  const only = process.argv.slice(2);
  for (const slug of only.length ? only : Object.keys(PAGES)) {
    const p = PAGES[slug];
    if (!p) { console.log("skip", slug); continue; }
    try {
      let c;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try { c = await gen(p); break; }
        catch (e) { if (attempt === 3) throw e; console.log(`  retry ${slug} (${String(e.message).slice(0, 60)})`); }
      }
      await sanity.createOrReplace({
        _id: `servicePage-${slug}`,
        _type: "servicePage",
        brand: "workwell",
        slug: { _type: "slug", current: slug },
        title: p.title,
        price: p.price,
        headline: c.headline,
        description: c.description,
        features: (c.features || []).slice(0, 12),
        benefits: (c.benefits || []).slice(0, 4).map((b, i) => ({ _key: key("ben", i), title: b.title, description: b.description })),
        guide: (c.guide || []).slice(0, 4).map((g, i) => ({ _key: key("guide", i), heading: g.heading, intro: g.intro, points: (g.points || []).slice(0, 5) })),
        serviceCategories: (c.serviceCategories || []).slice(0, 4).map((sc, i) => ({ _key: key("cat", i), title: sc.title, items: (sc.items || []).slice(0, 6) })),
        faqs: (c.faqs || []).slice(0, 10).map((f, i) => ({ _key: key("faq", i), question: f.question, answer: f.answer })),
        stats: (c.stats || []).slice(0, 4).map((st, i) => ({ _key: key("stat", i), value: st.value, label: st.label })),
        testimonial: REVIEW,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
      });
      console.log(`✓ ${slug}: "${c.headline}"`);
    } catch (e) { console.log(`✗ ${slug}: ${e.message}`); }
  }
}
run();
