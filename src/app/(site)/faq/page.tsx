import type { Metadata } from "next";
import { getFAQs } from "@/sanity/queries";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";
import FAQPageClient from "./FAQPageClient";
import { getBrand } from "@/lib/brand";

const cleverMetadata: Metadata = {
  title: "FAQs — Clever Accounts | Online Accounting Questions Answered",
  description:
    "Answers to common questions about Clever Accounts — pricing, services, switching accountants, software, sole trader / limited company / contractor specifics, VAT, payroll and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  if (brand.id === "clever") return cleverMetadata;
  return {
    title: `FAQs — ${brand.name} | Online Accounting Questions Answered`,
    description: `Answers to common questions about ${brand.name} — pricing, services, switching accountants, software, sole trader / limited company / contractor specifics, VAT, payroll and more.`,
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
// Built per-brand so brand names render correctly (and no "Clever" text leaks
// onto Workwell) AND so Workwell ships distinct, reworded copy rather than a
// duplicate of Clever's. Every fact, figure, threshold and date is identical
// across brands — only the phrasing differs.

const buildCleverFallback = (brandName: string): Record<string, { q: string; a: string }[]> => ({
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
    { q: "Where are your accountants based?", a: "All our accountants are UK-based. No offshore call centres." },
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
    { q: "Is there a cost to switch?", a: `No. Switching to ${brandName} is completely free. There are no setup fees or transfer charges, and you can switch at any point in the year.` },
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
    { q: "Can I switch between PSC and umbrella?", a: `Yes — you can switch between operating through your PSC (outside IR35) and our umbrella (inside IR35) within the same ${brandName} relationship — no second provider, no setup fees, no payment gap when a contract status changes mid-year.` },
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
    { q: "Is FreeAgent included free?", a: `Yes, completely free with every ${brandName} package. Retail price is £19/month, so it's effectively £228/year of value bundled in. There's no extra charge or add-on.` },
    { q: "Can I integrate FreeAgent with my bank?", a: "Yes — open banking is built in with 25+ UK banks. Transactions flow into FreeAgent automatically, you categorise them in seconds, and your accountant sees everything in real time." },
    { q: "Does FreeAgent have a mobile app?", a: "Yes — iOS and Android. Snap photos of receipts to capture expenses, send invoices from anywhere, and see your tax position on the go." },
  ],
});

// Workwell-specific rewording. Same facts, figures, thresholds and dates as the
// Clever copy above — only the questions and answers are rephrased so the two
// brands don't read identically.
const buildWorkwellFallback = (brandName: string): Record<string, { q: string; a: string }[]> => ({
  "Getting Started": [
    { q: "What's the process to join?", a: "Pick the package that fits on our pricing page, then fill in a brief online form. A dedicated accountant is assigned to you within 24 hours, and the typical client is up and running inside a week." },
    { q: "Will I be charged to get set up?", a: "Never. We don't charge a penny in setup costs. Your monthly fee begins on your sign-up date and nothing is added on top of it." },
    { q: "Am I tied into a fixed term?", a: "Not at all. Leave whenever you like on one month's notice. We'd rather earn your loyalty each month than rely on a lock-in to keep you." },
    { q: "How soon can I be up and running?", a: "Signing up takes only a few minutes. Expect your dedicated accountant to reach out within 24 hours to arrange your onboarding call and configure FreeAgent." },
    { q: "What details do you need from me to join?", a: "Only your name, email, phone number and chosen package to begin. The rest — company details, HMRC references, bank information — we gather together during onboarding once you're on board." },
  ],
  "Services & Support": [
    { q: "What does my monthly fee actually cover?", a: "All of it: a dedicated accountant, advice without limits, every tax return and filing, free FreeAgent software, a live dashboard, open banking, and mortgage reference letters whenever you need one." },
    { q: "Will I have a named accountant of my own?", a: "Yes. We pair every client with a named accountant who knows their type of business inside out. They handle everything for you directly — never a call centre or a ticket queue." },
    { q: "Is advice genuinely unlimited?", a: "It is. Phone or email your accountant whenever something comes up. Nothing is charged per question and nothing is capped — that's exactly what a fixed monthly fee is for." },
    { q: "Who covers my accountant when they're away?", a: "Each accountant has a named deputy who's familiar with your account. Should anything urgent crop up while yours is off, the cover already understands your business and can step in immediately." },
    { q: "Are your accountants in the UK?", a: "Every one of our accountants is based in the UK. There are no offshore call centres." },
  ],
  "Pricing & Billing": [
    { q: "What will it cost me?", a: "Sole Trader packages begin at £42.50/month, while Limited Company, Contractor and Freelancer packages begin at £104.50/month. Every price is plus VAT, and you'll find the full breakdown on our /pricing page." },
    { q: "Should I expect any hidden charges?", a: "There aren't any. Your monthly fee takes care of everything — no unexpected bills for phone calls, tax returns, IR35 reviews, mortgage reference letters or one-off questions." },
    { q: "How does payment work?", a: "By Direct Debit each month on the same date. It's automatic and straightforward, with no invoices for you to chase." },
    { q: "Am I able to move between plans?", a: "Yes. When things change — a sole trader incorporating, a limited company hiring, a contractor moving to a freelancer model — you can switch plans whenever you need. A quick word with your accountant is all it takes." },
    { q: "Is there a discount for paying yearly?", a: "We prefer one clear monthly fee to annual prepayment discounts. Since you can leave at any time, there's nothing to gain from committing for a full year." },
  ],
  "Switching to Us": [
    { q: "Can I move over from my existing accountant?", a: "Of course — we manage the entire move for you. Send your previous firm a single line confirming you're leaving, and we take care of the rest: the professional clearance letter, the transfer of records, HMRC re-authorisation, everything." },
    { q: "Will switching cost me anything?", a: `No. Moving to ${brandName} costs nothing. There are no setup or transfer charges, and you're free to switch at any time of year.` },
    { q: "How long will the move take?", a: "Usually 3–6 weeks from sign-up to a complete transfer. You can begin using FreeAgent right away while we manage the handover with your old firm behind the scenes." },
    { q: "Should I expect any disruption?", a: "None. The two firms coordinate under professional clearance rules (ICAEW/ACCA), so your accounting carries on seamlessly. We resume precisely where your previous firm stopped." },
    { q: "What if I'm partway through my year-end?", a: "Mid-year moves are common and uncomplicated. We liaise with your former firm on the year-end work, take the reins for the following year, and make certain nothing slips through the handover." },
  ],
  "Sole Trader": [
    { q: "As a sole trader, do I really need an accountant?", a: "There's no legal requirement — but most sole traders overpay tax without one. On average we save sole traders £500–£1,500/year in tax versus filing alone, and our fee is just £42.50/month." },
    { q: "Will I have to register for VAT?", a: "Only when your taxable turnover passes £90,000 across any rolling 12-month period. You can register voluntarily before then, which can pay off when you want to reclaim VAT on purchases — we'll advise whether that's right for you." },
    { q: "Which expenses are claimable as a sole trader?", a: "Anything used wholly and exclusively for the business: tools, equipment, business mileage, phone, broadband, home office (a £6/week flat rate or a share of your actual costs), professional subscriptions and accountancy fees. We make sure nothing slips by." },
    { q: "What are my Self Assessment deadline dates?", a: "Your online return and any tax due must be in by 31 January after the tax year ends (so your 2025/26 return is due by 31 January 2027). Where HMRC requires payments on account, the second instalment falls due on 31 July." },
  ],
  "Limited Company": [
    { q: "Sole trader or limited company — which suits me?", a: "As a rule of thumb: sole trader if you earn under roughly £40k/year and value simplicity, limited company if you earn more, want greater tax efficiency, or want the liability protection. We model both routes for your exact figures before you commit." },
    { q: "How much should a director's salary be?", a: "For most directors with no other income, the ideal salary sits at the secondary NI threshold (£9,100 in 2025/26) — or as high as £12,570 if you can claim Employment Allowance with at least one further employee. Beyond that, dividends usually win on tax." },
    { q: "How do salary and dividends differ?", a: "Salary carries income tax plus employer and employee NI. Dividends carry dividend tax instead (8.75% at the basic rate, 33.75% at the higher rate in 2025/26) — generally cheaper overall. We tune the balance to your circumstances." },
    { q: "What must I file with Companies House?", a: "An annual confirmation statement (CS01), statutory accounts within 9 months of your year-end, and a Corporation Tax return (CT600) within 12 months. We take care of every one." },
    { q: "Can I borrow money from my own company?", a: "You can, but tread carefully. Loans above £10,000 create a benefit-in-kind tax charge, and anything not repaid within 9 months of year-end attracts a 32.5% Corporation Tax charge. We'll help you stay on the right side of the rules." },
  ],
  "Contractor / IR35": [
    { q: "Inside versus outside IR35 — what's the difference?", a: "Outside IR35: your limited company keeps the full contract rate, you draw a modest salary plus dividends, and the tax is lower. Inside IR35: the whole day rate runs through payroll, with income tax and NI on all of it. The gap is usually 15–25% of gross income." },
    { q: "Do you include IR35 contract reviews?", a: "Yes — our contractor package at £104.50/month includes unlimited contract reviews. Plenty of providers limit free reviews or bill per contract; we don't." },
    { q: "Can I move between PSC and umbrella?", a: `Yes — you can move between trading through your PSC (outside IR35) and our umbrella (inside IR35) all within the same ${brandName} relationship, with no second provider, no setup fees and no break in payment when a contract's status changes mid-year.` },
    { q: "What if a contract is judged inside IR35?", a: "Only that single contract is affected. Your limited company stays in place and other contracts are assessed on their own merits. We'll model the tax impact and advise whether to run it through your PSC or via umbrella." },
  ],
  "VAT": [
    { q: "At what point must I register for VAT?", a: "As soon as taxable turnover tops £90,000 in any rolling 12-month period — not simply a calendar year. HMRC considers any consecutive 12-month window. Miss it and you'll owe backdated VAT plus penalties, so we track your turnover and warn you before you reach the threshold." },
    { q: "Which VAT scheme is right for me?", a: "Most businesses sit on the Standard Scheme. The Flat Rate Scheme can suit service businesses with little input VAT, where you pay HMRC a set percentage of turnover. Cash Accounting eases cash flow when customers are slow to pay. We work out which fits your business." },
    { q: "Does FreeAgent meet MTD rules for VAT?", a: "Yes — it's fully MTD-compliant and HMRC-recognised. Returns go straight from FreeAgent to HMRC with no bridging software needed. This has been mandatory for all VAT-registered businesses since April 2022." },
    { q: "Can I recover VAT spent before I registered?", a: "Yes, within limits: 4 years back on goods you still hold, and 6 months on services. We'll go through your pre-registration purchases and reclaim everything eligible on your very first return." },
  ],
  "Payroll": [
    { q: "Does my package include payroll?", a: "With the Limited Company package (£104.50/month), payroll for a director plus one employee is built in. Further employees cost a small amount each per month. Sole traders rarely need payroll unless they take on staff." },
    { q: "What does RTI mean?", a: "Real Time Information — HMRC asks employers to file a Full Payment Submission (FPS) on every pay run. We do this for you automatically each month, so no deadline is ever missed (penalties begin at £100/month)." },
    { q: "How does pension auto-enrolment work?", a: "Every UK employer has to assess employees for auto-enrolment and place them in a qualifying scheme. We manage the assessment, enrolment, contributions, declarations of compliance and the three-yearly re-enrolment." },
    { q: "Can I pay myself a bonus?", a: "Yes, a bonus can go through payroll at any time — but it attracts income tax and NI, so it's usually less efficient than dividends. We model the tax cost first so you know exactly what it means before we run it." },
  ],
  "Software": [
    { q: "Which accounting software comes with my package?", a: "FreeAgent is included free with every package. It's HMRC-recognised, MTD-compliant and cloud-based, letting you handle invoices, expenses and bank feeds from any device. Your accountant works inside the same FreeAgent — no separate logins." },
    { q: "Do I really get FreeAgent for free?", a: `Yes, entirely free with every ${brandName} package. At a £19/month retail price, that's around £228/year of value built in, with no extra charge or add-on.` },
    { q: "Can FreeAgent connect to my bank?", a: "Yes — open banking comes built in across 25+ UK banks. Transactions feed into FreeAgent automatically, you categorise them in moments, and your accountant sees it all in real time." },
    { q: "Is there a FreeAgent mobile app?", a: "Yes — on both iOS and Android. Photograph receipts to log expenses, send invoices from anywhere, and check your tax position while you're on the move." },
  ],
});

const buildFallbackCategories = (
  brandId: string,
  brandName: string,
): Record<string, { q: string; a: string }[]> =>
  brandId === "workwell" ? buildWorkwellFallback(brandName) : buildCleverFallback(brandName);

export default async function FAQPage() {
  const brand = await getBrand();
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
    faqsByCategory = buildFallbackCategories(brand.id, brand.name);
  }

  // Flatten for JSON-LD
  const allFaqs = Object.values(faqsByCategory).flat();

  return (
    <>
      {brand.id !== "workwell" && <FAQPageJsonLd faqs={allFaqs} />}
      <FAQPageClient faqsByCategory={faqsByCategory} />
    </>
  );
}
