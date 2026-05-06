"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Phone, ChevronDown, HelpCircle,
  AlertCircle, FileText, Shield, Users, BarChart2, Calculator, Building2, UserCheck,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const dynamic = "force-static";

const providers = [
  {
    name: "Clever Accounts",
    fee: "£104.50/mo",
    software: "FreeAgent",
    namedAccountant: true,
    payrollIncluded: true,
    selfAssessment: true,
    trustpilot: "Excellent",
    bestFor: "Small limited companies wanting full-service at a clear monthly price",
    highlight: true,
    notes:
      "Full-service online accountant with 20+ years' experience across sole traders, limited companies, and contractors. Includes a dedicated named accountant, FreeAgent, payroll, VAT, and your personal Self Assessment — all in one fixed monthly fee. No hidden charges.",
  },
  {
    name: "Crunch",
    fee: "From £82/mo",
    software: "Crunch platform",
    namedAccountant: false,
    payrollIncluded: true,
    selfAssessment: false,
    trustpilot: "4.6",
    bestFor: "Business owners comfortable with self-serve software",
    highlight: false,
    notes:
      "One of the UK's largest online accountants. Lower-tier plans are portal-based with limited personal contact; the Professional plan adds a named accountant. Self Assessment is an add-on on most plans. Good if you're tech-confident and price-sensitive.",
  },
  {
    name: "Xero + local accountant",
    fee: "£120–£200+/mo",
    software: "Xero",
    namedAccountant: true,
    payrollIncluded: true,
    selfAssessment: true,
    trustpilot: "Varies",
    bestFor: "Businesses needing bespoke advice or complex requirements",
    highlight: false,
    notes:
      "Pairing Xero with a local or specialist accountant gives maximum flexibility and face-to-face access, but typically at a higher price. Worth considering for businesses with employees, inventory, or complex structures. Less competitive for straightforward limited companies.",
  },
  {
    name: "inniAccounts",
    fee: "From £79/mo",
    software: "inniAccounts platform",
    namedAccountant: true,
    payrollIncluded: true,
    selfAssessment: true,
    trustpilot: "4.8",
    bestFor: "Tech-forward small businesses wanting strong software",
    highlight: false,
    notes:
      "Strong platform with real-time tax position visibility. Originally contractor-focused but works well for small limited companies. Consistently high Trustpilot scores and well-regarded for proactive advice.",
  },
  {
    name: "Gorilla Accounting",
    fee: "From £95/mo",
    software: "FreeAgent",
    namedAccountant: true,
    payrollIncluded: true,
    selfAssessment: true,
    trustpilot: "4.9",
    bestFor: "Small businesses wanting boutique personal service",
    highlight: false,
    notes:
      "Smaller firm with genuinely high-touch personal service and excellent Trustpilot scores. More boutique than the larger online providers — you get a real relationship with your accountant.",
  },
  {
    name: "Quickbooks + accountant",
    fee: "£100–£180+/mo",
    software: "QuickBooks",
    namedAccountant: true,
    payrollIncluded: true,
    selfAssessment: true,
    trustpilot: "Varies",
    bestFor: "Businesses already using QuickBooks or needing its inventory features",
    highlight: false,
    notes:
      "QuickBooks has strong inventory and e-commerce integrations, making it a reasonable choice for product-based businesses. Less natural for pure service businesses or consultancies.",
  },
];

const whatIsIncluded = [
  { icon: FileText, title: "Year-end statutory accounts", desc: "Filed at Companies House within 9 months of your accounting year-end. Required by law for all limited companies." },
  { icon: Calculator, title: "Corporation Tax return (CT600)", desc: "Filed with HMRC within 12 months of your year-end. Corporation Tax is paid 9 months and 1 day after year-end." },
  { icon: BarChart2, title: "Quarterly VAT returns", desc: "Prepared and submitted to HMRC — typically due one month and 7 days after each quarter end." },
  { icon: Users, title: "Payroll (directors + staff)", desc: "Monthly payroll processing with RTI submissions to HMRC. Payslips produced. Includes employer NI calculations." },
  { icon: Building2, title: "Companies House filings", desc: "Annual confirmation statement and accounts filed on time. We track all deadlines so you never miss one." },
  { icon: UserCheck, title: "Personal Self Assessment", desc: "Your personal tax return filed annually, covering your salary, dividends, and any other income." },
  { icon: Shield, title: "Unlimited advice", desc: "Call or email your dedicated accountant as often as you need — no meter running, no extra charge per question." },
  { icon: FileText, title: "Accounting software", desc: "FreeAgent included free. Real-time view of your profit, VAT liability, and estimated Corporation Tax bill." },
];

const faqs = [
  {
    q: "Do I need an accountant for my limited company?",
    a: "Legally you can act as your own accountant, but limited company directors are personally liable for Corporation Tax, Companies House filings, VAT, payroll, and Self Assessment. HMRC treats errors as your responsibility regardless. Most small limited company owners find a specialist accountant saves more in tax than it costs in fees within the first year.",
  },
  {
    q: "How much does an accountant cost for a small limited company?",
    a: "Online accountants for small limited companies typically charge £80–£130/month plus VAT, covering year-end accounts, Corporation Tax, VAT returns, payroll, Self Assessment, and accounting software. Traditional high-street firms typically charge £1,200–£3,000+ per year billed annually. The online model is almost always better value for straightforward limited companies.",
  },
  {
    q: "What's the difference between an online accountant and a traditional accountant?",
    a: "Online accountants deliver the same statutory services via cloud software and phone/email support, at lower cost. The trade-off is less face-to-face contact — though most small limited company owners find they rarely need it. The key question is whether you get a named, dedicated contact, not whether they have a local office.",
  },
  {
    q: "Is FreeAgent or Xero better for a small limited company?",
    a: "FreeAgent is generally better suited to small limited companies — it's designed for this audience and shows real-time estimates of your Corporation Tax liability, dividend capacity, and VAT position. Xero has more features for businesses with inventory or multiple currencies but is overkill for most small limited companies.",
  },
  {
    q: "What should be included in a limited company accounting package?",
    a: "As a minimum: year-end statutory accounts, Corporation Tax return (CT600), quarterly VAT returns, monthly payroll and RTI submissions, annual confirmation statement, and personal Self Assessment. A good package also includes accounting software, a named accountant, and unlimited advice — all for one fixed monthly fee.",
  },
  {
    q: "Can I switch accountants mid-year?",
    a: "Yes. You can switch at any point in the year. Your new accountant handles the professional clearance process with your old firm and collects all records. There's no disruption to your compliance position and no need to wait for a year-end.",
  },
  {
    q: "What is the Corporation Tax rate for small companies?",
    a: "From April 2023: 25% for profits over £250,000; 19% for profits under £50,000 (small profits rate); marginal relief tapers the effective rate between £50,000 and £250,000. Your accountant should actively advise on legitimate ways to reduce taxable profits — pension contributions, capital allowances, and timing of expenses all matter.",
  },
  {
    q: "What expenses can a limited company claim?",
    a: "Common allowable expenses: salaries and employer pension contributions, home office costs (£6/week flat rate or proportionate calculation), business mileage (45p/mile up to 10,000), professional subscriptions, accounting and legal fees, business insurance, equipment and technology, training and CPD, and broadband (business proportion). Client entertainment is not deductible for Corporation Tax.",
  },
  {
    q: "Do I need to pay myself a salary from my limited company?",
    a: "You're not legally required to, but most directors pay a small salary (typically ~£9,100/year in 2025/26, the secondary threshold) combined with dividends. This is usually the most tax-efficient combination: the salary is deductible for Corporation Tax, it maintains your NI record, and dividends are taxed at lower rates than salary.",
  },
  {
    q: "What are the filing deadlines for a small limited company?",
    a: "Corporation Tax return: 12 months after accounting year-end. Corporation Tax payment: 9 months and 1 day after year-end. Statutory accounts at Companies House: 9 months after year-end. Confirmation statement: annually within 14 days of review date. VAT returns: quarterly (1 month and 7 days after quarter end). Payroll RTI: on or before each pay day. Your accountant manages all of these.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-white hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-3">
          <HelpCircle size={18} className="text-primary shrink-0" />
          {q}
        </span>
        <ChevronDown size={18} className={`shrink-0 ml-3 text-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-3 text-sm text-white/60 leading-relaxed border-t border-white/10 bg-white/[0.03] ml-9">
          {a}
        </div>
      )}
    </div>
  );
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://cleveraccounts.com/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://cleveraccounts.com/our-services" },
    { "@type": "ListItem", position: 3, name: "Small Business Accountant", item: "https://cleveraccounts.com/small-business-accountant" },
  ],
};

export default function SmallBusinessAccountantPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/15 animate-blob blob-shape" />
          <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] bg-accent/8 animate-blob blob-shape-2" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 pattern-dots" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 w-full">
          <div className="max-w-3xl">
            <span className="text-primary font-bold text-sm uppercase tracking-wider mb-4 block">
              Updated 17 April 2026 · 12 min read
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Best Accountant for Small{" "}
              <span className="text-gradient">Limited Companies</span>{" "}
              UK (2026)
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl">
              An honest guide for small limited company directors — what accounting services you actually need,
              what they should cost, and how the leading online providers compare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
              >
                Get Started — £104.50/mo <ArrowRight size={22} />
              </Link>
              <a
                href="#comparison"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-5 rounded-2xl text-lg hover:bg-white/10 transition-all"
              >
                See the comparison
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> Named accountant included</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> Everything in one fixed fee</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> No minimum contract</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Summary ─────────────────────────────── */}
      <section className="bg-surface border-b border-border py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Quick Summary</p>
          <ul className="space-y-3">
            {[
              "Small limited companies typically pay £80–£130/month for an online accountant covering all statutory requirements.",
              "The most important things to check: named accountant included, Self Assessment in the package, and no hidden per-service charges.",
              "Clever Accounts includes everything — year-end accounts, CT600, VAT, payroll, Self Assessment, and FreeAgent — for £104.50/month.",
              "Online accountants deliver the same statutory services as high-street firms, typically at 40–60% lower cost.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-text text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What's included ───────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What a small limited company <span className="text-gradient-teal">actually needs</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              These are the statutory and practical services every limited company director requires. Make sure they&apos;re all included in your monthly fee.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {whatIsIncluded.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface rounded-2xl p-6 border border-border card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-dark text-sm mb-2">{title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm mb-1">Common hidden extras to watch for</p>
              <ul className="text-amber-800 text-sm space-y-1 list-disc list-inside">
                <li>Personal Self Assessment charged separately (often £100–£200/year extra)</li>
                <li>Payroll for employees beyond directors charged per employee per month</li>
                <li>Accounting software not bundled — add £16–£35/month for FreeAgent or Xero</li>
                <li>Mortgage reference letters charged at £50–£150 each</li>
                <li>Ad hoc advice billed at hourly rates above a low threshold</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              How much should you pay?
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Monthly fees vary significantly depending on the level of service and whether everything is bundled.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                tier: "Budget online",
                price: "£65–£85/mo",
                included: ["Year-end accounts", "Corporation Tax return", "Basic VAT", "Portal-based support"],
                missing: ["Named accountant", "Self Assessment included", "FreeAgent bundled", "Proactive advice"],
              },
              {
                tier: "Full-service online",
                price: "£85–£130/mo",
                included: ["Everything in Budget", "Named accountant", "Self Assessment", "Accounting software", "Unlimited advice"],
                missing: [],
                highlight: true,
              },
              {
                tier: "High-street / traditional",
                price: "£100–£250+/mo",
                included: ["Full service", "Face-to-face access", "Bespoke advice", "Named partner contact"],
                missing: ["Often higher cost for same output", "Less real-time visibility"],
              },
            ].map((t) => (
              <div
                key={t.tier}
                className={`rounded-2xl p-6 card-hover ${t.highlight ? "bg-dark border-2 border-primary shadow-lg" : "bg-white border border-border"}`}
              >
                {t.highlight && (
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Best value</div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${t.highlight ? "text-white" : "text-dark"}`}>{t.tier}</h3>
                <p className="text-2xl font-black text-gradient mb-5">{t.price}</p>
                <ul className="space-y-2 mb-4">
                  {t.included.map((item) => (
                    <li key={item} className={`flex items-center gap-2 text-sm ${t.highlight ? "text-slate-300" : "text-text"}`}>
                      <CheckCircle2 size={15} className="text-success shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                {t.missing.length > 0 && (
                  <ul className="space-y-2 pt-3 border-t border-border">
                    {t.missing.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-sm text-text-light">
                        <span className="text-red-400 shrink-0 font-bold">✗</span> {m}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24" id="comparison">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Leading providers compared <span className="text-gradient">(2026)</span>
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Prices last verified April 2026. Verify directly with each provider — pricing changes regularly.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border shadow-sm mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left px-5 py-4 font-bold text-dark">Provider</th>
                  <th className="text-left px-5 py-4 font-bold text-dark">Monthly fee</th>
                  <th className="text-left px-5 py-4 font-bold text-dark">Software</th>
                  <th className="text-center px-5 py-4 font-bold text-dark">Named accountant</th>
                  <th className="text-center px-5 py-4 font-bold text-dark">Payroll included</th>
                  <th className="text-center px-5 py-4 font-bold text-dark">Self Assessment</th>
                  <th className="text-left px-5 py-4 font-bold text-dark">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {providers.map((p) => (
                  <tr key={p.name} className={p.highlight ? "bg-primary/5" : "bg-white hover:bg-surface/60 transition-colors"}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${p.highlight ? "text-primary" : "text-dark"}`}>{p.name}</span>
                        {p.highlight && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Our pick</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-light">{p.fee}</td>
                    <td className="px-5 py-4 text-text-light">{p.software}</td>
                    <td className="px-5 py-4 text-center">
                      {p.namedAccountant ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <span className="text-red-400 font-bold">✗</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {p.payrollIncluded ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <span className="text-red-400 font-bold">✗</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {p.selfAssessment ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <span className="text-red-400 font-bold">✗</span>}
                    </td>
                    <td className="px-5 py-4 text-text-light">{p.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mb-12">
            {providers.map((p) => (
              <div key={p.name} className={`rounded-2xl border p-5 card-hover ${p.highlight ? "border-primary bg-primary/5" : "border-border bg-white"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold ${p.highlight ? "text-primary" : "text-dark"}`}>{p.name}</span>
                  {p.highlight && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Our pick</span>}
                </div>
                <div className="text-sm mb-3 space-y-1.5">
                  <div><span className="text-text-light">Fee: </span><span className="font-semibold text-dark">{p.fee}</span></div>
                  <div><span className="text-text-light">Software: </span><span className="font-semibold text-dark">{p.software}</span></div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 text-text-light">Named accountant: {p.namedAccountant ? <CheckCircle2 size={13} className="text-success" /> : <span className="text-red-400 font-bold">✗</span>}</span>
                    <span className="flex items-center gap-1 text-text-light">Self Assessment: {p.selfAssessment ? <CheckCircle2 size={13} className="text-success" /> : <span className="text-red-400 font-bold">✗</span>}</span>
                  </div>
                </div>
                <p className="text-text-light text-xs leading-relaxed">{p.notes}</p>
              </div>
            ))}
          </div>

          {/* Provider notes desktop */}
          <div className="hidden lg:grid grid-cols-1 gap-4 max-w-4xl mx-auto">
            {providers.map((p) => (
              <div key={p.name} className={`rounded-xl border p-5 ${p.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-white"}`}>
                <h3 className={`font-bold mb-1.5 ${p.highlight ? "text-primary" : "text-dark"}`}>{p.name}</h3>
                <p className="text-text-light text-sm leading-relaxed">{p.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to choose ─────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              How to choose: five questions to ask
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {[
              { n: "1", q: "Is a named accountant included?", a: "You want a specific person responsible for your account — not a call centre. Ask: 'Who will be my accountant, and how do I contact them directly?'" },
              { n: "2", q: "Is my personal Self Assessment included?", a: "Many providers charge this separately. As a limited company director, you need a Self Assessment every year — confirm it's in the monthly fee." },
              { n: "3", q: "What's your response time?", a: "Ask directly: 'If I email Tuesday morning, when will I hear back?' The answer should be same or next business day — not 'we aim to respond within 5 working days'." },
              { n: "4", q: "Is accounting software bundled?", a: "FreeAgent or Xero should be included. If not, add the licence cost to their monthly fee to make a fair comparison." },
              { n: "5", q: "What triggers an additional charge?", a: "Ask specifically: 'What's NOT included in the monthly fee?' Things like payroll for extra employees, mortgage letters, or amended returns should have clear, disclosed rates — not ambiguous 'reasonable' charges." },
            ].map((item) => (
              <div key={item.n} className="bg-white rounded-2xl border border-border p-6 shadow-sm card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                    {item.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-2">{item.q}</h3>
                    <p className="text-text-light text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Common questions from small limited company directors about accounting, tax, and costs.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────── */}
      <section className="gradient-cta py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Everything your limited company needs, one fixed fee
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Dedicated accountant · FreeAgent included · Year-end accounts · VAT · Payroll · Self Assessment — all for £104.50/month. No hidden extras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-secondary-dark font-bold px-8 py-4 rounded-2xl text-lg hover:bg-orange-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all"
            >
              <Phone size={20} />
              Call Free: {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
