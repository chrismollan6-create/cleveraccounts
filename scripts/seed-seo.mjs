/**
 * Seed Sanity with SEO metadata from hardcoded Next.js pages.
 *
 * Prerequisites:
 *   1. Get a write token from https://www.sanity.io/manage
 *      → select project sgaod5tg → API → Tokens → Add API token (choose "Editor")
 *   2. Run:
 *      SANITY_TOKEN=your-token node scripts/seed-seo.mjs
 *
 * Safe to run multiple times — uses createOrReplace with fixed IDs.
 */

import { createClient } from "@sanity/client";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function key(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function toBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key("b"),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key("s"), text, marks: [] }],
  }));
}

// ─── Home Page ────────────────────────────────────────────────────────────────

const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroHeadline: "Stop Worrying About Your Accounts.",
  heroSubheadline:
    "Your own dedicated accountant, unlimited advice, and free software — all for one fixed monthly fee. No surprises. Ever.",
  heroCTA: "Get Started — It's Free to Set Up",
  trustBadgeText: "Rated 5/5 by 10,000+ UK businesses",
  metaTitle: "Clever Accounts | Expert Online Accountants UK",
  metaDescription:
    "Your own dedicated UK accountant, unlimited advice, and free FreeAgent software for one fixed monthly fee. Sole traders, limited companies, contractors & freelancers. From £42.50/month.",
};

// ─── Service Pages ────────────────────────────────────────────────────────────

const servicePages = [
  {
    _id: "servicePage-sole-trader",
    _type: "servicePage",
    title: "Sole Trader Accountants",
    slug: { _type: "slug", current: "sole-trader" },
    headline: "Expert Accounting for Sole Traders",
    description:
      "Straightforward, hassle-free online accounting designed exclusively for sole traders. MTD compliant software, dedicated accountant, unlimited advice — all for one fixed monthly fee.",
    price: "42.50",
    metaTitle: "Sole Trader Accountants UK | From £42.50/mo",
    metaDescription:
      "Online accounting for sole traders. Dedicated accountant, unlimited advice, MTD compliant software. From £42.50/month. No setup fees.",
  },
  {
    _id: "servicePage-limited-company",
    _type: "servicePage",
    title: "Limited Company Accountants",
    slug: { _type: "slug", current: "limited-company" },
    headline: "Complete Accounting for Limited Companies",
    description:
      "Everything your limited company needs — year-end accounts, corporation tax, VAT, payroll and self assessment — all in one fixed monthly fee with a dedicated accountant.",
    price: "104.50",
    metaTitle: "Limited Company Accountants UK | £104.50/mo",
    metaDescription:
      "Complete accounting for limited companies. Year-end accounts, CT600, VAT, payroll and Self Assessment included. Dedicated accountant from £104.50/month.",
  },
  {
    _id: "servicePage-contractor-accountancy",
    _type: "servicePage",
    title: "Contractor Accountants",
    slug: { _type: "slug", current: "contractor-accountancy" },
    headline: "Contractor Accounting With Full IR35 Support",
    description:
      "Specialist contractor accounting with IR35 contract reviews, Clever FLEX umbrella, and full limited company accounting — managed by one dedicated accountant.",
    price: "104.50",
    metaTitle: "Contractor Accountants & IR35 Support | £104.50/mo",
    metaDescription:
      "Specialist contractor accounting with IR35 reviews, Clever FLEX umbrella and full limited company service. Dedicated accountant from £104.50/month.",
  },
  {
    _id: "servicePage-freelancer-accountancy",
    _type: "servicePage",
    title: "Freelancer Accountants",
    slug: { _type: "slug", current: "freelancer-accountancy" },
    headline: "Accounting Made Simple for Freelancers",
    description:
      "Online accounting tailored for freelancers. Keep more of what you earn with proactive tax advice, unlimited support, and free accounting software.",
    price: "42.50",
    metaTitle: "Accountants for Freelancers UK | From £42.50/mo",
    metaDescription:
      "Online accounting for freelancers. Dedicated accountant, self assessment, unlimited advice and free FreeAgent software. From £42.50/month.",
  },
  {
    _id: "servicePage-landlord-accounting",
    _type: "servicePage",
    title: "Landlord Accountants",
    slug: { _type: "slug", current: "landlord-accounting" },
    headline: "Specialist Accounting for Property Landlords",
    description:
      "Expert accounting for landlords — rental income, allowable expenses, mortgage interest relief, and self assessment handled by a dedicated property accountant.",
    price: "42.50",
    metaTitle: "Landlord Accountants UK | Property Tax Experts",
    metaDescription:
      "Specialist accounting for landlords. Rental income, allowable expenses, mortgage interest relief and self assessment. Dedicated accountant from £42.50/month.",
  },
  {
    _id: "servicePage-accounting-for-startups",
    _type: "servicePage",
    title: "Startup Accountants",
    slug: { _type: "slug", current: "accounting-for-startups" },
    headline: "Accounting for Startups & New Businesses",
    description:
      "Get your startup off to the right financial start. Company formation, HMRC registration, bookkeeping and proactive tax advice from day one.",
    price: "104.50",
    metaTitle: "Startup Accountants UK | New Business Experts",
    metaDescription:
      "Accounting for startups and new businesses. Company formation, HMRC registration, bookkeeping and tax advice. Dedicated accountant from £104.50/month.",
  },
  {
    _id: "servicePage-ecommerce-accounting",
    _type: "servicePage",
    title: "Ecommerce Accountants",
    slug: { _type: "slug", current: "ecommerce-accounting" },
    headline: "Accounting for Online Sellers & Ecommerce Businesses",
    description:
      "Specialist accounting for Amazon, eBay, Etsy and Shopify sellers. Platform reconciliation, VAT (OSS/IOSS), inventory accounting and more.",
    price: "42.50",
    metaTitle: "Ecommerce Accountants UK | Online Sellers",
    metaDescription:
      "Specialist accounting for ecommerce and online sellers. Amazon, eBay, Etsy, Shopify reconciliation, VAT compliance and tax returns. From £42.50/month.",
  },
  {
    _id: "servicePage-cis-accounting",
    _type: "servicePage",
    title: "CIS Accountants",
    slug: { _type: "slug", current: "cis-accounting" },
    headline: "CIS Accounting for Contractors & Subcontractors",
    description:
      "Specialist CIS accounting for the construction industry. Monthly returns, subcontractor verification, gross payment status applications and tax reclaims.",
    price: "42.50",
    metaTitle: "CIS Accountants UK | Construction Industry",
    metaDescription:
      "CIS accounting for contractors and subcontractors. Monthly returns, verification, gross payment status and tax reclaims. Dedicated accountant from £42.50/month.",
  },
  {
    _id: "servicePage-small-business-accountant",
    _type: "servicePage",
    title: "Small Business Accountants",
    slug: { _type: "slug", current: "small-business-accountant" },
    headline: "Best Accountant for Small Limited Companies UK",
    description:
      "Full-service accounting for small limited companies. Year-end accounts, corporation tax, VAT, payroll and self assessment — one fixed monthly fee.",
    price: "104.50",
    metaTitle: "Small Business Accountants UK | £104.50/mo",
    metaDescription:
      "Full-service accounting for small limited companies. Year-end accounts, CT600, VAT, payroll and Self Assessment included. Dedicated accountant from £104.50/month.",
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

const blogPosts = [
  {
    _id: "blogPost-mtd-income-tax-sole-traders",
    _type: "blogPost",
    title: "MTD for Income Tax: What Sole Traders Need to Know",
    slug: { _type: "slug", current: "mtd-income-tax-sole-traders" },
    category: "tax",
    author: "Clever Accounts",
    publishedAt: "2026-03-15T00:00:00.000Z",
    excerpt:
      "Making Tax Digital for Income Tax Self Assessment is one of the biggest changes to UK tax in decades. Here's what sole traders need to know.",
    metaTitle: "MTD for Income Tax: What Sole Traders Need to Know",
    metaDescription:
      "MTD for ITSA explained for sole traders. Quarterly reporting, digital records, key dates and how Clever Accounts makes the transition painless.",
    body: toBlocks([
      "Making Tax Digital (MTD) for Income Tax Self Assessment represents one of the biggest changes to the UK tax system in decades. If you're a sole trader or landlord with qualifying income, this will affect how you report your earnings to HMRC.",
      "Under MTD for ITSA, you'll need to keep digital records using compatible software and submit quarterly updates to HMRC, instead of filing a single annual self assessment tax return. This means HMRC will have a more up-to-date picture of your income throughout the year.",
      "The good news? If you're a Clever Accounts client, you're already prepared. Our FreeAgent accounting software is fully MTD compliant, and your dedicated accountant will handle the transition for you.",
      "Key dates to remember: MTD for ITSA is being rolled out in phases. Sole traders and landlords with annual business or property income above £50,000 will need to comply first. Those with income above £30,000 will follow in the next phase.",
      "What you need to do: Start keeping digital records now if you haven't already. Your Clever Accounts software makes this easy — simply log your income and expenses as you go, and we'll take care of the rest.",
      "If you have any questions about MTD and how it affects your business, your dedicated accountant is always just a phone call away. We're here to make the transition as smooth as possible.",
    ]),
  },
  {
    _id: "blogPost-ir35-2026-updates",
    _type: "blogPost",
    title: "IR35 in 2026: Latest Updates for Contractors",
    slug: { _type: "slug", current: "ir35-2026-updates" },
    category: "ir35",
    author: "Clever Accounts",
    publishedAt: "2026-02-20T00:00:00.000Z",
    excerpt:
      "IR35 continues to be one of the most important topics for UK contractors. Here's what you need to know about the off-payroll rules in 2026.",
    metaTitle: "IR35 in 2026: Latest Updates for Contractors",
    metaDescription:
      "Latest IR35 updates for UK contractors in 2026. Off-payroll rules, contract reviews, Clever FLEX umbrella and what to do if you're caught inside IR35.",
    body: toBlocks([
      "IR35 continues to be one of the most important topics for UK contractors. The off-payroll working rules determine whether a contractor should be taxed as an employee or can operate through their own limited company (PSC).",
      "Since the reforms that shifted IR35 responsibility to end clients in the private sector, the contracting landscape has evolved significantly. Many contractors have faced challenges with blanket determinations and uncertainty about their status.",
      "At Clever Accounts, our specialist contractor team reviews every contract to assess IR35 status. We provide detailed written assessments and can support you if a client's determination doesn't align with the reality of your working arrangements.",
      "Our unique Clever FLEX solution means you don't have to choose between PSC and umbrella. As your contracts change, you can switch seamlessly between the two — all managed by the same dedicated accountant.",
      "Tips for contractors in 2026: Always get your contracts reviewed before starting work. Keep evidence of your working practices. Understand the difference between substitution, control, and mutuality of obligation. And most importantly, work with an accountant who specialises in contractor tax.",
    ]),
  },
  {
    _id: "blogPost-tax-saving-tips-ltd",
    _type: "blogPost",
    title: "5 Tax-Saving Tips for Limited Company Directors",
    slug: { _type: "slug", current: "tax-saving-tips-ltd" },
    category: "tax",
    author: "Clever Accounts",
    publishedAt: "2026-01-10T00:00:00.000Z",
    excerpt:
      "Running a limited company gives you more flexibility when it comes to tax planning. Here are five strategies our accountants recommend.",
    metaTitle: "5 Tax-Saving Tips for Limited Company Directors",
    metaDescription:
      "Five practical tax-saving strategies for limited company directors. Salary and dividend mix, pension contributions, expenses and year-end tax planning.",
    body: toBlocks([
      "Running a limited company gives you more flexibility when it comes to tax planning. Here are five strategies our accountants recommend to maximise your tax efficiency.",
      "1. Optimise your salary and dividend mix: The most tax-efficient way to extract profits from your company is usually a combination of a low salary (up to the NI threshold) and dividends for the rest.",
      "2. Claim all allowable business expenses: From home office costs to business travel, professional subscriptions to equipment — make sure you're claiming everything you're entitled to.",
      "3. Consider pension contributions: Company pension contributions are a corporation tax deductible expense and don't attract income tax or NI.",
      "4. Plan your corporation tax: With careful timing of expenses and income, you can optimise your corporation tax position.",
      "5. Use your annual allowances: Make sure you're using your tax-free dividend allowance, capital gains annual exemption, and ISA allowances.",
    ]),
  },
  {
    _id: "blogPost-claiming-expenses-sole-trader",
    _type: "blogPost",
    title: "Expenses You Can Claim as a Sole Trader",
    slug: { _type: "slug", current: "claiming-expenses-sole-trader" },
    category: "tax",
    author: "Clever Accounts",
    publishedAt: "2025-12-05T00:00:00.000Z",
    excerpt:
      "Claiming all your allowable expenses is crucial for reducing your tax bill as a sole trader. Here's a comprehensive guide to what you can and can't claim.",
    metaTitle: "Expenses You Can Claim as a Sole Trader | HMRC Guide",
    metaDescription:
      "Complete guide to allowable expenses for sole traders. Home office, travel, equipment, professional costs and marketing — what you can claim to reduce your tax bill.",
    body: toBlocks([
      "As a sole trader, claiming all your allowable expenses is crucial for reducing your tax bill. Here's a comprehensive guide to what you can and can't claim.",
      "Home office costs: If you work from home, you can claim a proportion of your household bills including heating, electricity, broadband, and council tax.",
      "Travel and vehicle expenses: Business mileage can be claimed at 45p per mile for the first 10,000 miles and 25p thereafter.",
      "Equipment and supplies: Computers, phones, printers, stationery, and other business equipment are all claimable.",
      "Professional costs: Accountancy fees, professional memberships, trade publications, training courses, and software subscriptions related to your business are all allowable expenses.",
    ]),
  },
  {
    _id: "blogPost-choosing-business-structure",
    _type: "blogPost",
    title: "Sole Trader vs Limited Company: Which Is Right for You?",
    slug: { _type: "slug", current: "choosing-business-structure" },
    category: "business-tips",
    author: "Clever Accounts",
    publishedAt: "2025-11-15T00:00:00.000Z",
    excerpt:
      "Choosing between sole trader and limited company is one of the most important decisions when starting a business. Here's how to decide.",
    metaTitle: "Sole Trader vs Limited Company: Which Is Right?",
    metaDescription:
      "Sole trader vs limited company compared. Tax efficiency, liability, admin and when to switch. Expert guidance from Clever Accounts — free consultation available.",
    body: toBlocks([
      "One of the first decisions you'll make when starting a business is choosing your legal structure. The two most common options for small businesses in the UK are sole trader and limited company.",
      "Sole Trader: This is the simplest structure. You and your business are legally the same entity. Setup is instant and free, there's less admin and compliance, and your accounts are private.",
      "Limited Company: Your business is a separate legal entity. This means limited personal liability for business debts, potential tax advantages, and more credibility with some clients.",
      "When is a limited company more tax-efficient? Generally, once your profits exceed around £30,000-£50,000 per year, a limited company structure can be more tax-efficient.",
      "The best advice? Talk to an accountant. At Clever Accounts, your dedicated accountant will assess your situation and recommend the most tax-efficient structure for your business.",
    ]),
  },
  {
    _id: "blogPost-vat-registration-guide",
    _type: "blogPost",
    title: "VAT Registration: When & How to Register",
    slug: { _type: "slug", current: "vat-registration-guide" },
    category: "vat",
    author: "Clever Accounts",
    publishedAt: "2025-10-20T00:00:00.000Z",
    excerpt:
      "VAT registration is something every growing business needs to understand. Here's your guide to when you must register and whether voluntary registration makes sense.",
    metaTitle: "VAT Registration Guide UK: When & How to Register",
    metaDescription:
      "Complete guide to VAT registration in the UK. When you must register (£90k threshold), voluntary registration benefits and the different VAT schemes explained.",
    body: toBlocks([
      "Value Added Tax (VAT) is something every growing business needs to understand. Here's your guide to VAT registration.",
      "When must you register? You must register for VAT when your taxable turnover exceeds £90,000 in any 12-month period, or when you expect it to exceed £90,000 in the next 30 days alone.",
      "Should you register voluntarily? Even if your turnover is below the threshold, voluntary registration can be beneficial. You can reclaim VAT on business purchases.",
      "How to register: You can register online through the HMRC website, or your Clever Accounts accountant can handle the entire process for you.",
      "VAT schemes: There are several VAT schemes available including the Flat Rate Scheme, Cash Accounting Scheme, and Annual Accounting Scheme.",
    ]),
  },
];

// ─── Run ──────────────────────────────────────────────────────────────────────

async function seed() {
  const all = [homePage, ...servicePages, ...blogPosts];
  let created = 0;
  let errors = 0;

  console.log(`\n🌱  Seeding ${all.length} documents into Sanity...\n`);

  for (const doc of all) {
    try {
      await client.createOrReplace(doc);
      console.log(`  ✅  ${doc._type}: ${doc._id}`);
      created++;
    } catch (err) {
      console.error(`  ❌  ${doc._type}: ${doc._id} — ${err.message}`);
      errors++;
    }
  }

  console.log(`\n${created} documents seeded, ${errors} errors.\n`);

  if (errors === 0) {
    console.log("✨  All done! Open /studio to see your content.");
    console.log("    The SEO dashboard will now show scores for all these pages.");
  }
}

seed().catch(console.error);
