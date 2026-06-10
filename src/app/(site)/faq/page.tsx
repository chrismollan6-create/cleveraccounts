import type { Metadata } from "next";
import { getFAQs } from "@/sanity/queries";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";
import FAQPageClient from "./FAQPageClient";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `FAQs — ${brand.name} | Online Accounting Questions Answered`,
    description:
      `Answers to common questions about ${brand.name} — pricing, services, switching accountants, software, sole trader / limited company / contractor specifics, VAT, payroll and more.`,
  };
}

export const revalidate = 60;

// Slug → human label for grouping CMS rows. Order here is the order shown on the page.
const categoryLabels: Record<string, string> = {
  "getting-started": "Getting Started",
  "services": "Services & Support",
  "pricing": "Pricing & Billing",
  "switching": "Switching to Us",
  "sole-trader": "Sole Trader",
  "limited-company": "Limited Company",
  "contractor": "Contractor / IR35",
  "vat": "VAT",
  "payroll": "Payroll",
  "software": "Software",
};

// Fallback content for when Sanity is empty / fetch fails. Covers all 10
// declared categories so the page is never sparse even on a cold start.
const fallbackCategories: Record<string, { q: string; a: string }[]> = {
  "Getting Started": [
    { q: "How do I sign up?", a: "Choose your plan on our pricing page and complete the short online form. You'll be matched with your dedicated accountant within 24 hours — most clients are fully set up within a week." },
    { q: "Are there any setup fees?", a: "No. There are absolutely no setup fees. You start paying your monthly fee from the date you sign up, and there's nothing on top." },
    { q: "Is there a minimum contract?", a: "No. You can cancel at any time with one month's notice. We believe you should stay because you want to, not because you're locked in." },
    { q: "How quickly can I get started?", a: "You can sign up in minutes. Your dedicated accountant will typically be in touch within 24 hours to book your onboarding call and get FreeAgent set up." },
    { q: "What information do I need to sign up?", a: "Just your name, email, phone number, and which package you want. We'll collect everything else — company details, HMRC references, bank info — during onboarding once you're signed up." },
  ],
  "Services & Support": [
    { q: "What's included in the monthly fee?", a: "Everything: your dedicated accountant, unlimited advice, all tax returns and filings, free FreeAgent accounting software, real-time dashboard, open banking, and mortgage reference letters when you need them." },
    { q: "Do I get a dedicated accountant?", a: "Yes. Every client is matched with a named, dedicated accountant who specialises in their business type. They're your main point of contact for everything — not a call centre, not a ticket queue." },
    { q: "Is the advice really unlimited?", a: "Absolutely. Call or email your accountant as often as you need. There are no per-question charges and no limits — that's the whole point of a fixed monthly fee." },
    { q: "What if my accountant is on leave?", a: "Every accountant has a named backup who knows your account. If something urgent comes up while yours is away, the cover knows your business and can help straight away." },
    { q: "Where are your accountants based?", a: "All our accountants are UK-based, working from our Leeds office. No offshore call centres." },
  ],
  "Pricing & Billing": [
    { q: "How much does it cost?", a: "Sole Trader packages start from £42.50/month. Limited Company, Contractor and Freelancer packages start from £104.50/month. All prices are plus VAT. Full pricing detail is on our /pricing page." },
    { q: "Are there any hidden fees?", a: "None. The monthly fee covers everything. No surprise charges for phone calls, tax returns, IR35 reviews, mortgage reference letters or one-off advice." },
    { q: "How do I pay?", a: "Monthly by Direct Debit on the same date each month. Simple, automatic, and hassle-free — no invoices to chase." },
    { q: "Can I change my plan?", a: "Yes. If your circumstances change — sole trader incorporating, limited company taking on staff, contractor switching to a freelancer model — you can move between plans at any time. Just speak to your accountant." },
    { q: "Do you offer annual discounts?", a: "We keep pricing simple with one transparent monthly fee rather than annual prepayment discounts. You can cancel any time, so there's no benefit to locking in for a year." },
  ],
  "Switching to Us": [
    { q: "Can I switch from my current accountant?", a: "Absolutely — we handle the whole switch. You give your old firm a one-line email saying you're moving, and we take it from there: professional clearance letter, records transfer, HMRC re-authorisation, all of it." },
    { q: "Is there a cost to switch?", a: "No. Switching to Clever Accounts is completely free. There are no setup fees or transfer charges, and you can switch at any point in the year." },
    { q: "How long does switching take?", a: "Typically 3–6 weeks from sign-up to fully transferred. You can start using FreeAgent immediately while we handle the handover with your previous firm in the background." },
    { q: "Will there be any disruption?", a: "No. Both firms coordinate via professional clearance rules (ICAEW/ACCA) and your accounting continues without a gap. We pick up exactly where the previous firm left off." },
    { q: "What if I'm mid-year-end?", a: "Most switches happen mid-year and it's straightforward. We coordinate with your previous firm on the year-end work, take over for the next year, and make sure nothing is missed in the handover." },
  ],
  "Sole Trader": [
    { q: "Do I need an accountant as a sole trader?", a: "Legally, no — but most sole traders pay more tax than they need to without one. We typically save sole traders £500–£1,500/year in tax compared to filing themselves, and our fee is £42.50/month." },
    { q: "Do I need to register for VAT?", a: "Only once your taxable turnover exceeds £90,000 in any rolling 12-month period. You can voluntarily register below that — sometimes it's worth it to reclaim VAT on purchases. We assess whether voluntary registration suits you." },
    { q: "What expenses can I claim as a sole trader?", a: "Anything used wholly and exclusively for your business: tools, equipment, vehicle costs for business journeys, phone, broadband, home office (flat rate £6/week or proportion of actual costs), professional subscriptions, accountancy fees. We make sure you don't miss any." },
    { q: "When are my Self Assessment deadlines?", a: "Online tax return and any tax owed: 31 January following the end of the tax year (so the 2025/26 return is due by 31 January 2027). If HMRC has set payments on account, the second instalment is due 31 July." },
  ],
  "Limited Company": [
    { q: "Should I be a sole trader or a limited company?", a: "Roughly: sole trader if you're earning under ~£40k/year and want simplicity, limited company if you're earning more, want tax efficiency, or want the liability protection. We model both options for you specifically before you decide." },
    { q: "What's the optimal director's salary?", a: "For most directors with no other income, the right salary is at the secondary NI threshold (£9,100 in 2025/26) — or up to £12,570 if you can claim Employment Allowance with at least one other employee. Above that, dividends are usually more tax-efficient." },
    { q: "What's the difference between salary and dividends?", a: "Salary attracts income tax + employer/employee NI. Dividends attract dividend tax (8.75% basic, 33.75% higher rate in 2025/26) — usually lower overall. We optimise the mix for your specific situation." },
    { q: "What are my Companies House obligations?", a: "Annual confirmation statement (CS01), annual statutory accounts within 9 months of year-end, and a Corporation Tax return (CT600) within 12 months. We handle all of this." },
    { q: "Can I take a director's loan from my company?", a: "Yes, but be careful. Loans over £10,000 trigger benefit-in-kind tax, and loans not repaid within 9 months of year-end trigger a 32.5% Corporation Tax charge. We help you stay on the right side of the rules." },
  ],
  "Contractor / IR35": [
    { q: "What's the difference between inside and outside IR35?", a: "Outside IR35: your limited company receives the full contract rate, you pay yourself a small salary plus dividends, taxed at lower rates. Inside IR35: you run the full day rate through payroll — income tax + NI on the lot. The tax difference is typically 15–25% of gross income." },
    { q: "Are IR35 contract reviews included?", a: "Yes — unlimited contract reviews are included in our contractor package at £104.50/month. Many providers cap free reviews or charge per contract." },
    { q: "What is Clever FLEX?", a: "Clever FLEX lets you switch between operating through your PSC (outside IR35) and our umbrella (inside IR35) within the same Clever Accounts relationship — no second provider, no setup fees, no payment gap when a contract status changes mid-year." },
    { q: "What happens if a contract is determined inside IR35?", a: "Only that contract is affected. Your limited company continues to exist, and other contracts are assessed separately. We model the tax impact and recommend whether to run it through your PSC or via umbrella." },
  ],
  "VAT": [
    { q: "When do I need to register for VAT?", a: "Once taxable turnover exceeds £90,000 in any rolling 12-month period — not just a calendar year. HMRC looks at any consecutive 12-month window. Miss this and you owe backdated VAT plus penalties. We monitor your turnover and alert you before you hit the threshold." },
    { q: "What VAT scheme should I use?", a: "Most businesses use the Standard Scheme. The Flat Rate Scheme can be beneficial for service businesses with low input VAT (you pay HMRC a fixed % of turnover). Cash Accounting helps cash flow if customers pay slowly. We assess which suits your business." },
    { q: "Is FreeAgent MTD-compliant for VAT?", a: "Yes — fully MTD-compliant and HMRC-recognised. Returns submit directly from FreeAgent to HMRC with no bridging software. Mandatory for all VAT-registered businesses since April 2022." },
    { q: "Can I reclaim VAT on purchases before registering?", a: "Yes, to a limit: 4 years back on goods you still have, and 6 months on services. We'll review pre-registration purchases and reclaim everything eligible on your first return." },
  ],
  "Payroll": [
    { q: "Is payroll included in my package?", a: "For the Limited Company package (£104.50/month), payroll for directors plus one employee is included. Extra employees are added at a small per-employee monthly cost. Sole traders don't typically need payroll unless they take on staff." },
    { q: "What's RTI?", a: "Real Time Information — HMRC requires employers to submit a Full Payment Submission (FPS) every pay run. We handle this automatically every month, so you never miss a deadline (penalties start at £100/month)." },
    { q: "What about pension auto-enrolment?", a: "Every UK employer must assess employees for auto-enrolment and enrol them in a qualifying scheme. We handle assessment, enrolment, contributions, declarations of compliance, and three-yearly re-enrolment." },
    { q: "Can I pay myself a bonus?", a: "Yes, bonuses can run through payroll any time — but they attract income tax + NI, so they're usually less tax-efficient than dividends. We model the tax impact before processing so you know what it costs." },
  ],
  "Software": [
    { q: "What accounting software do you use?", a: "We include FreeAgent free with every package. It's HMRC-recognised, MTD-compliant, cloud-based, and lets you manage invoices, expenses and bank feeds on any device. Your accountant works in the same FreeAgent — no separate logins." },
    { q: "Is FreeAgent included free?", a: "Yes, completely free with every Clever Accounts package. Retail price is £19/month, so it's effectively £228/year of value bundled in. There's no extra charge or add-on." },
    { q: "Can I integrate FreeAgent with my bank?", a: "Yes — open banking is built in with 25+ UK banks. Transactions flow into FreeAgent automatically, you categorise them in seconds, and your accountant sees everything in real time." },
    { q: "Does FreeAgent have a mobile app?", a: "Yes — iOS and Android. Snap photos of receipts to capture expenses, send invoices from anywhere, and see your tax position on the go." },
  ],
};

export default async function FAQPage() {
  const brand = await getBrand();
  const flexLabel = brand.id === "workwell" ? "Workwell Flex" : "Clever FLEX";
  // Rewrite "Clever Accounts" → current brand and "Clever FLEX" → flexLabel
  // for both the visible FAQ content and the JSON-LD payload so SEO matches.
  const swap = (s: string) =>
    s.replaceAll("Clever Accounts", brand.name).replaceAll("Clever FLEX", flexLabel);
  // Try CMS first
  let faqsByCategory: Record<string, { q: string; a: string }[]> = {};
  let usingCMS = false;

  try {
    const cmsFaqs = await getFAQs();
    if (cmsFaqs && cmsFaqs.length > 0) {
      usingCMS = true;
      // Preserve the order declared in categoryLabels by pre-seeding empty arrays
      for (const label of Object.values(categoryLabels)) {
        faqsByCategory[label] = [];
      }
      for (const faq of cmsFaqs) {
        const label = categoryLabels[faq.category] || faq.category;
        if (!faqsByCategory[label]) faqsByCategory[label] = [];
        faqsByCategory[label].push({ q: faq.question, a: faq.answer });
      }
      // Drop any empty categories that ended up with no CMS rows
      for (const label of Object.keys(faqsByCategory)) {
        if (faqsByCategory[label].length === 0) delete faqsByCategory[label];
      }
    }
  } catch {
    /* fall through to fallback */
  }

  if (!usingCMS) {
    faqsByCategory = fallbackCategories;
  }

  // Brand-aware swap on every q/a so both the visible content and the JSON-LD
  // match the host brand. Module-scope fallback + CMS data both flow through.
  const swappedByCategory: Record<string, { q: string; a: string }[]> = {};
  for (const [label, items] of Object.entries(faqsByCategory)) {
    swappedByCategory[label] = items.map((f) => ({ q: swap(f.q), a: swap(f.a) }));
  }
  const allFaqs = Object.values(swappedByCategory).flat();

  return (
    <>
      <FAQPageJsonLd faqs={allFaqs} />
      <FAQPageClient faqsByCategory={swappedByCategory} />
    </>
  );
}
