import type { Metadata } from "next";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Best Accountant for Small Limited Companies UK (2026 Guide) | Clever Accounts",
  description:
    "Compare the leading online accountants for small UK limited companies. Honest pricing, what's included, software compared, and a decision framework — updated April 2026.",
  keywords: [
    "accountant for small limited company UK",
    "small business accountant UK",
    "limited company accountant",
    "online accountant small business",
    "best accountant small limited company",
    "small limited company accounting",
    "online accounting small business UK",
    "limited company accountant comparison 2026",
  ],
  openGraph: {
    title: "Best Accountant for Small Limited Companies UK (2026 Guide)",
    description:
      "An honest comparison of the leading online accountants for small UK limited companies — pricing, software, what's included, and how to choose. Updated April 2026.",
    type: "article",
  },
  alternates: {
    canonical: "https://cleveraccounts.com/small-business-accountant",
  },
};

const faqs = [
  {
    q: "Do I need an accountant for my limited company?",
    a: "Legally you can act as your own accountant, but limited company directors are personally liable for Corporation Tax, Companies House filings, VAT, payroll, and their own Self Assessment. HMRC treats errors as your responsibility regardless of whether you prepared the returns yourself. Most small limited company owners find a specialist accountant saves more in tax than it costs in fees.",
  },
  {
    q: "How much does an accountant cost for a small limited company?",
    a: "Online accountants for small limited companies typically charge £80–£130/month plus VAT, covering year-end accounts, Corporation Tax, VAT returns, payroll, and accounting software. Traditional high-street firms typically charge £1,200–£3,000+ per year, billed annually. The online model is usually better value for straightforward limited companies.",
  },
  {
    q: "What's the difference between an online accountant and a traditional accountant?",
    a: "Online accountants deliver the same statutory services (accounts, tax returns, VAT, payroll) via cloud software and email/phone support, at a lower price point than high-street firms. The trade-off is less face-to-face contact — though most small limited company owners find they rarely need it. The key question is whether you get a named, dedicated contact, not whether they have a local office.",
  },
  {
    q: "Is FreeAgent or Xero better for a small limited company?",
    a: "FreeAgent is generally better suited to small limited companies and contractors — it's designed specifically for this audience and shows real-time estimates of your Corporation Tax liability, dividend capacity, and VAT position. Xero is more feature-rich for businesses with complex inventory or multiple currencies, but is overkill for most small limited companies. If your accountant bundles either, use what they bundle.",
  },
  {
    q: "What should be included in a limited company accounting package?",
    a: "As a minimum: year-end statutory accounts filed at Companies House, Corporation Tax return (CT600) filed with HMRC, quarterly VAT returns, monthly payroll and RTI submissions, annual confirmation statement, and your personal Self Assessment. A good package also includes accounting software, a named accountant contact, and unlimited advice — all for one fixed monthly fee.",
  },
  {
    q: "Can I switch accountants mid-year as a limited company?",
    a: "Yes — you can switch at any point. Your new accountant handles the professional clearance process with your old firm and collects all records needed to continue. There's no disruption to your compliance position and no need to wait for a year-end.",
  },
  {
    q: "What is the Corporation Tax rate for small companies?",
    a: "From April 2023, the main Corporation Tax rate is 25% for profits over £250,000. Companies with profits under £50,000 pay 19% (the small profits rate). Profits between £50,000 and £250,000 are subject to marginal relief, which tapers the effective rate between 19% and 25%. Your accountant should actively advise on legitimate ways to reduce taxable profits — pension contributions, capital allowances, and timing of expenses.",
  },
  {
    q: "Do I need to pay myself a salary from my limited company?",
    a: "You're not legally required to pay yourself a salary, but most limited company directors pay a small salary (typically at the secondary threshold, around £9,100/year in 2025/26) combined with dividends. This is usually the most tax-efficient combination: the salary is deductible for Corporation Tax, it maintains your NI record, and dividends are taxed at lower rates than salary.",
  },
  {
    q: "What expenses can a limited company claim?",
    a: "Common allowable expenses include: salaries and employer pension contributions, home office costs (either flat rate £6/week or proportionate calculation), business mileage (45p/mile up to 10,000 miles), professional subscriptions, accounting and legal fees, business insurance, equipment and technology, training and CPD, and broadband (business proportion). Client entertainment is not deductible for Corporation Tax. Your accountant should review your specific situation.",
  },
  {
    q: "What are the filing deadlines for a small limited company?",
    a: "Corporation Tax return: 12 months after your accounting year-end. Corporation Tax payment: 9 months and 1 day after your accounting year-end. Statutory accounts at Companies House: 9 months after your accounting year-end (for private companies). Confirmation statement: annually within 14 days of the review date. VAT returns: quarterly (usually 1 month and 7 days after quarter end). Payroll RTI: on or before each pay day. Your accountant manages all of these on your behalf.",
  },
];

export default function SmallBusinessAccountantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Limited Company", url: "/limited-company" },
          { name: "Best Accountant for Small Limited Companies", url: "/small-business-accountant" },
        ]}
      />
      {children}
    </>
  );
}
