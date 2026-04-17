import type { Metadata } from "next";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Best Accountant for IT Contractors UK (2026 Guide) | Clever Accounts",
  description:
    "Compare the 8 leading contractor accountants for UK IT contractors. Honest pricing, IR35 review policies, software included, and named accountant comparison. Updated April 2026.",
  keywords: [
    "IT contractor accountant",
    "best accountant for IT contractors UK",
    "contractor accountant comparison",
    "IR35 accountant",
    "limited company contractor accountant",
    "FreeAgent contractor accountant",
    "outside IR35 accountant",
    "contractor accountant 2026",
  ],
  openGraph: {
    title: "Best Accountant for IT Contractors UK (2026 Guide)",
    description:
      "An honest comparison of the 8 leading contractor accountants — pricing, IR35 reviews, software, and a decision framework. Updated April 2026.",
    type: "article",
  },
  alternates: {
    canonical: "https://cleveraccounts.com/it-contractor-accountant",
  },
};

const faqs = [
  {
    q: "Do I need an accountant if I'm contracting through a limited company?",
    a: "Legally, no — but practically, yes. Limited company directors are personally responsible for Companies House filings, Corporation Tax, PAYE, VAT, and their own Self Assessment. HMRC treats ignorance as no excuse. The cost of mistakes far exceeds accountancy fees, and most contractors find a specialist pays for itself within the first year through tax optimisation alone.",
  },
  {
    q: "What's the difference between IR35 inside and outside?",
    a: "Outside IR35: your limited company receives the full contract rate. You pay yourself a small salary and take the remainder as dividends, taxed at lower rates. Inside IR35: you must run the equivalent of a full salary through payroll — income tax and National Insurance on your full day rate. The tax difference is typically 15–25% of gross income.",
  },
  {
    q: "How much do IT contractor accountants charge?",
    a: "IT contractor accountants typically charge £65–£160 per month plus VAT. Budget providers (£65–£85) are largely portal-based. Mid-market (£85–£120) includes a named accountant and FreeAgent. Premium (£120–£160+) offers high-touch service with proactive planning.",
  },
  {
    q: "Is FreeAgent free with my accountant?",
    a: "FreeAgent is free for RBS, NatWest, and Ulster Bank business account holders. For everyone else it's £19/month if self-subscribed, or included free by many contractor accountants. Always confirm before signing up.",
  },
  {
    q: "Can I claim my home office as a limited company contractor?",
    a: "Yes. The simplest method is the HMRC flat rate of £6/week (£312/year) without receipts. The more accurate method calculates the proportion of your home used for work and claims that share of rent or mortgage interest, utilities, and broadband.",
  },
  {
    q: "How do I switch accountants as a contractor?",
    a: "Sign up with your new accountant first — they manage the rest. You notify your old accountant by email, your new firm sends a professional clearance letter, and your old accountant is required to hand over all records. The whole process typically takes 3–6 weeks and can be done at any point in the year.",
  },
  {
    q: "What happens if my contract goes inside IR35 mid-year?",
    a: "Only income from that specific contract is affected — past income is unaffected. Your limited company continues to exist; you process that contract's income differently. Many contractors run simultaneous contracts, one inside and one outside IR35.",
  },
  {
    q: "Should I set up a company pension through my limited company?",
    a: "Almost always yes. Employer pension contributions are a Corporation Tax-deductible expense and are not subject to income tax or National Insurance within annual allowance limits. Contributing £20,000/year effectively costs your company £16,200 after CT relief.",
  },
  {
    q: "Do I need to register for VAT as an IT contractor?",
    a: "You must register once taxable turnover exceeds £90,000 in any rolling 12-month period. Most IT contractors exceed this quickly. The VAT Flat Rate Scheme is generally advantageous — you charge clients 20% VAT but pay HMRC a lower flat rate, keeping the difference.",
  },
  {
    q: "Can I use my limited company for multiple contracts at once?",
    a: "Yes. Each contract is assessed separately for IR35 purposes — an inside determination on one contract does not affect the status of others. This is one of the key advantages of a limited company.",
  },
];

export default function ITContractorGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contractor Accountancy", url: "/contractor-accountancy" },
          { name: "IT Contractor Guide 2026", url: "/it-contractor-accountant" },
        ]}
      />
      {children}
    </>
  );
}
