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
};

async function gen(p) {
  const prompt = `You are writing the website copy for the "${p.title}" page on Workwell Accountancy's site.
${VOICE}

Audience: ${p.audience}.
Topics to genuinely help with: ${p.focus}.

Write ORIGINAL, DIFFERENTIATED copy that leads with the SPECIFIC real concerns of this audience — not generic accountant boilerplate. Use CURRENT UK tax facts for the 2025/26 and 2026/27 tax years, grounded in up-to-date web sources; if unsure of a current figure, describe it qualitatively rather than state a wrong number. Do NOT invent statistics, client numbers, ratings, awards or testimonials. British English.

Return ONLY one JSON object (no markdown/fences/commentary) with exactly:
{
  "headline": "confident hero headline, max 9 words",
  "description": "2-sentence hero paragraph, specific to this audience",
  "features": ["8-10 short 'what we handle' lines"],
  "benefits": [{"title":"3-5 words","description":"1-2 sentences"} x4],
  "faqs": [{"question":"real question","answer":"2-4 accurate sentences"} x5],
  "stats": [{"value":"e.g. £0","label":"e.g. Setup fees"} x4 — TRUE claims only, never invented metrics],
  "metaTitle": "<= 60 chars incl service",
  "metaDescription": "120-160 chars"
}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.7 } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
  let text = (data?.candidates?.[0]?.content?.parts || []).map((x) => x.text).filter(Boolean).join("");
  text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
}
const key = (pfx, i) => `${pfx}-${i}`;

async function run() {
  const only = process.argv.slice(2);
  for (const slug of only.length ? only : Object.keys(PAGES)) {
    const p = PAGES[slug];
    if (!p) { console.log("skip", slug); continue; }
    try {
      const c = await gen(p);
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
        faqs: (c.faqs || []).slice(0, 6).map((f, i) => ({ _key: key("faq", i), question: f.question, answer: f.answer })),
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
