"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Phone, AlertCircle, ChevronDown,
  HelpCircle, FileText, Shield, Users, Zap, BarChart2, Calculator, UserCheck,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const dynamic = "force-static";

const providers = [
  {
    name: "Clever Accounts",
    fee: "£104.50/mo",
    software: "FreeAgent",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "Excellent",
    bestFor: "IT contractors wanting full-service at a mid-market price",
    highlight: true,
    notes:
      "Specialist contractor accountant with 20+ years' experience. Includes a dedicated contractor specialist, unlimited IR35 contract reviews, and Clever FLEX — seamless switching between PSC and umbrella when contract status changes. FreeAgent and all filings at one flat fee.",
  },
  {
    name: "Crunch",
    fee: "From £82/mo",
    software: "Crunch platform",
    namedAccountant: false,
    ir35Included: false,
    trustpilot: "4.6",
    bestFor: "Price-sensitive contractors comfortable self-serving",
    highlight: false,
    notes:
      "One of the UK's largest online accountants with competitive pricing. Lower-tier plans are largely portal-based; the Professional plan adds a named accountant. IR35 reviews may be capped or charged separately.",
  },
  {
    name: "Caroola",
    fee: "From £89/mo",
    software: "FreeAgent",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "4.5",
    bestFor: "Contractors who may move between limited company and umbrella",
    highlight: false,
    notes:
      "Formed from the merger of SG Accounting and Caroola. Strong IR35 expertise and a good fit if you might move between PSC and umbrella without changing providers.",
  },
  {
    name: "inniAccounts",
    fee: "From £79/mo",
    software: "inniAccounts platform",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "4.8",
    bestFor: "Contractors who want strong software and proactive advice",
    highlight: false,
    notes:
      "Strong technology platform and consistently high Trustpilot scores. Real-time visibility into tax position and dividend capacity. Particularly well regarded for proactive year-round advice.",
  },
  {
    name: "Gorilla Accounting",
    fee: "From £95/mo",
    software: "FreeAgent",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "4.9",
    bestFor: "Contractors wanting high-touch personal service",
    highlight: false,
    notes:
      "Smaller than most, which is their selling point — genuine personal attention. Consistently the highest-rated contractor accountant by percentage of 5-star reviews.",
  },
  {
    name: "Brookson",
    fee: "From £79/mo",
    software: "Varies by plan",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "4.1",
    bestFor: "Contractors also considering umbrella",
    highlight: false,
    notes:
      "One of the oldest names in contractor solutions, with both accountancy and umbrella/PAYE services. Solid offering but Trustpilot scores are lower than most peers.",
  },
  {
    name: "ClearSky",
    fee: "From £85/mo",
    software: "FreeAgent",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "4.6",
    bestFor: "IT contractors; strong IR35 specialism",
    highlight: false,
    notes:
      "Strong IR35 specialism and good FreeAgent integration. A consistent mid-market choice for IT contractors. Less prominent than larger brands but well regarded by clients.",
  },
  {
    name: "Dolan Accountancy",
    fee: "From £105/mo",
    software: "FreeAgent",
    namedAccountant: true,
    ir35Included: true,
    trustpilot: "4.9",
    bestFor: "Contractors wanting boutique, high-touch service",
    highlight: false,
    notes:
      "Boutique contractor accountant with a loyal client base and excellent ratings. Slightly higher price point reflects the personal service.",
  },
];

const faqs = [
  {
    q: "Do I need an accountant if I'm contracting through a limited company?",
    a: "Legally, no — but practically, yes. Limited company directors are personally responsible for Companies House filings, Corporation Tax, PAYE, VAT, and their own Self Assessment. HMRC treats ignorance as no excuse. The cost of mistakes far exceeds accountancy fees, and most contractors find a specialist pays for itself within the first year through tax optimisation alone.",
  },
  {
    q: "What's the difference between IR35 inside and outside?",
    a: "Outside IR35: your limited company receives the full contract rate. You pay yourself a small salary (typically ~£9,100/year) and take the remainder as dividends, taxed at lower rates (8.75% basic, 33.75% higher rate in 2025/26). Inside IR35: you must run the equivalent of a full salary through payroll — income tax and National Insurance on your full day rate. The tax difference is typically 15–25% of gross income.",
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
    q: "What happens if my contract goes inside IR35 mid-year?",
    a: "Only income from that specific contract is affected — past income is unaffected. Your limited company continues to exist; you process that contract's income differently. Many contractors run simultaneous contracts, one inside and one outside IR35. Your accountant should review the full-year tax impact.",
  },
  {
    q: "Can I use my limited company for multiple contracts at once?",
    a: "Yes. Each contract is assessed separately for IR35 purposes — an inside determination on one contract does not affect the status of others. This is one of the key advantages of a limited company.",
  },
  {
    q: "How do contractor accountants handle mortgage reference letters?",
    a: "Lenders who offer contractor mortgages typically use your day rate × 5 days × 46–48 weeks as implied annual income. Your accountant should be familiar with this calculation and produce a reference letter in the format lenders expect.",
  },
  {
    q: "Do I need to register for VAT as an IT contractor?",
    a: "You must register once taxable turnover exceeds £90,000 in any rolling 12-month period. Most IT contractors exceed this quickly. The VAT Flat Rate Scheme is generally advantageous — you charge clients 20% VAT but pay HMRC a lower flat rate, keeping the difference.",
  },
  {
    q: "Should I set up a company pension through my limited company?",
    a: "Almost always yes. Employer pension contributions are a Corporation Tax-deductible expense and are not subject to income tax or National Insurance within annual allowance limits. Contributing £20,000/year effectively costs your company £16,200 after CT relief — and you pay no income tax on it.",
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

export default function ITContractorAccountantPage() {
  return (
    <>
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
              Updated 17 April 2026 · 14 min read
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Best Accountant for IT{" "}
              <span className="text-gradient">Contractors</span>{" "}
              UK (2026 Guide)
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl">
              An honest comparison of the 8 leading contractor accountants — pricing, IR35 review policies,
              software included, and a decision framework to help you choose.
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
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> Unlimited IR35 reviews</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> FreeAgent included free</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TL;DR ─────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Quick Summary</p>
          <ul className="space-y-3">
            {[
              "IT contractors operating outside IR35 typically pay £85–£130/month for a specialist contractor accountant.",
              "The most important things to check: named accountant included, FreeAgent bundled, and IR35 reviews included (not charged per review).",
              "Clever Accounts includes all three at £104.50/month, plus Clever FLEX for seamless PSC/umbrella switching.",
              "Switching accountants mid-year is straightforward — your new firm handles the professional clearance letter.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-text text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What a contractor accountant does ─────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What an IT contractor accountant <span className="text-gradient-teal">actually does</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              A specialist contractor accountant is actively involved throughout the year — not just at year-end.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: FileText, title: "Company formation", desc: "Setting up your limited company correctly, including the right SIC code and share structure." },
              { icon: Calculator, title: "Quarterly VAT returns", desc: "Most contractors use the Flat Rate scheme — your accountant manages this so the difference stays in your pocket." },
              { icon: Users, title: "Monthly payroll", desc: "Running a small salary to maintain your NI record without triggering large PAYE bills." },
              { icon: BarChart2, title: "Dividend planning", desc: "Advising when and how much to draw as dividends to stay within basic rate tax bands." },
              { icon: Shield, title: "IR35 contract reviews", desc: "Reviewing your contracts to confirm inside or outside IR35 status before you sign." },
              { icon: Zap, title: "Clever FLEX (CA only)", desc: "Seamless switching between PSC and umbrella when contract status changes — no admin, no gaps." },
              { icon: UserCheck, title: "Year-end accounts & CT600", desc: "Statutory accounts filed at Companies House, Corporation Tax return filed with HMRC." },
              { icon: FileText, title: "Self Assessment", desc: "Your personal tax return filed annually, incorporating dividends, salary, and any other income." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface rounded-2xl p-6 border border-border card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-dark text-sm mb-2">{title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto bg-dark rounded-2xl p-8 border border-white/10">
            <h3 className="font-bold text-white text-lg mb-3">What IR35 means for your take-home pay</h3>
            <p className="text-slate-400 leading-relaxed mb-3 text-sm">
              IR35 determines whether HMRC considers you a &ldquo;disguised employee&rdquo; of your end client.
              Outside IR35, you pay yourself a small salary and take most income as dividends — taxed at significantly lower rates.
              Inside IR35, your company must deduct income tax and National Insurance on your full contract rate before you see anything.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              The tax difference is typically{" "}
              <span className="text-white font-semibold">15–25% of gross income</span>. For most private-sector contracts
              since 2021, the end client determines your IR35 status — making professional contract reviews essential before you sign.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing tiers ─────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              How much should an IT contractor pay?
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Monthly fees are billed by direct debit, plus VAT.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {[
              {
                tier: "Budget",
                price: "£65–£85/mo",
                included: ["Year-end accounts", "Corporation Tax (CT600)", "Self Assessment", "Basic payroll"],
                missing: ["Named accountant", "IR35 reviews", "FreeAgent included", "Proactive advice"],
              },
              {
                tier: "Mid-market",
                price: "£85–£120/mo",
                included: ["Everything in Budget", "Named accountant", "Accounting software", "IR35 contract reviews"],
                missing: [],
                highlight: true,
              },
              {
                tier: "Premium",
                price: "£120–£160+/mo",
                included: ["Everything in Mid-market", "Proactive tax planning", "Priority phone support", "Pension planning"],
                missing: [],
              },
            ].map((t) => (
              <div
                key={t.tier}
                className={`rounded-2xl p-6 ${t.highlight ? "bg-dark border-2 border-primary shadow-lg" : "bg-white border border-border"} card-hover`}
              >
                {t.highlight && (
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Most popular</div>
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
          <div className="max-w-5xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm mb-1">Hidden costs to watch for</p>
              <ul className="text-amber-800 text-sm space-y-1 list-disc list-inside">
                <li>IR35 contract reviews charged per review (£50–£200 each at some firms)</li>
                <li>Mortgage reference letters charged separately (£50–£150)</li>
                <li>Accounting software not bundled — add £16–£35/month for FreeAgent or Xero</li>
                <li>Amended returns or late filing work billed at hourly rates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────── */}
      <section className="bg-white py-16 md:py-24" id="comparison">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              The 8 leading providers compared <span className="text-gradient">(2026)</span>
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
                  <th className="text-center px-5 py-4 font-bold text-dark">IR35 included</th>
                  <th className="text-left px-5 py-4 font-bold text-dark">Trustpilot</th>
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
                      {p.namedAccountant
                        ? <CheckCircle2 size={18} className="text-success mx-auto" />
                        : <span className="text-red-400 font-bold text-base">✗</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {p.ir35Included
                        ? <CheckCircle2 size={18} className="text-success mx-auto" />
                        : <span className="text-red-400 font-bold text-base">✗</span>}
                    </td>
                    <td className="px-5 py-4 text-text-light">{p.trustpilot}</td>
                    <td className="px-5 py-4 text-text-light">{p.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mb-12">
            {providers.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-5 card-hover ${p.highlight ? "border-primary bg-primary/5" : "border-border bg-white"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold ${p.highlight ? "text-primary" : "text-dark"}`}>{p.name}</span>
                  {p.highlight && (
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Our pick</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                  <div><span className="text-text-light">Fee: </span><span className="font-semibold text-dark">{p.fee}</span></div>
                  <div><span className="text-text-light">Software: </span><span className="font-semibold text-dark">{p.software}</span></div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="text-text-light">Named accountant: </span>
                    {p.namedAccountant ? <CheckCircle2 size={14} className="text-success" /> : <span className="text-red-400 font-bold">✗</span>}
                    <span className="text-text-light ml-3">IR35 reviews: </span>
                    {p.ir35Included ? <CheckCircle2 size={14} className="text-success" /> : <span className="text-red-400 font-bold">✗</span>}
                  </div>
                </div>
                <p className="text-text-light text-xs leading-relaxed">{p.notes}</p>
              </div>
            ))}
          </div>

          {/* Provider notes (desktop) */}
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
              How to choose: a <span className="text-gradient-teal">decision framework</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Before signing up with any provider, ask these five questions directly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-10">
            {[
              {
                n: "1",
                q: "Is a named accountant included at this price?",
                a: "If the answer involves 'portal' or 'ticket system' as the primary support channel, you're in the budget tier. Fine if you're comfortable self-serving — just know what you're buying.",
              },
              {
                n: "2",
                q: "Are IR35 contract reviews included, and is there a limit?",
                a: "Some providers include one or two free reviews then charge per additional review. If you change clients frequently, unlimited IR35 reviews is the standard to look for.",
              },
              {
                n: "3",
                q: "Is accounting software bundled, or is it extra?",
                a: "If it's extra, add the licence cost to their monthly fee for a true price comparison. FreeAgent or Xero adds £16–£35/month.",
              },
              {
                n: "4",
                q: "What's your response time commitment?",
                a: "Ask specifically: 'If I send an email on a Tuesday morning, when should I expect a reply?' A credible answer is same or next business day. Vague answers about 'best efforts' are a red flag.",
              },
              {
                n: "5",
                q: "How do you handle mortgage reference letters?",
                a: "An accountant who's helped contractors get mortgages dozens of times has a process. One who hasn't will fumble it when you need it most.",
              },
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
          <div className="max-w-5xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="font-bold text-red-900 mb-3">Red flags to walk away from</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "No clear answer on who your named contact will be",
                "IR35 reviews charged per contract with no fixed price given upfront",
                "Setup fees above £150 for a standard limited company",
                "No clarity on what happens to your data if you leave",
                "Trustpilot reviews that only appear in bursts (often incentivised)",
              ].map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-400 mt-0.5 shrink-0 font-bold">✗</span>
                  {flag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Switching guide ───────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Switching accountants: the <span className="text-gradient">step-by-step</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              You can switch at any point in the year — no need to wait until your year-end.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-10">
            {[
              { n: "1", title: "Sign up with us", desc: "Complete our simple sign-up form. Your new accountant takes it from here." },
              { n: "2", title: "Notify your old firm", desc: "A simple email is all you need. No reason required." },
              { n: "3", title: "Professional clearance", desc: "We write to your old accountant. By ICAEW/ACCA ethics rules, they must respond and hand over your records." },
              { n: "4", title: "Records transferred", desc: "Accounts, CT600, payroll history, VAT returns — we collect everything." },
              { n: "5", title: "HMRC authorisation", desc: "We guide you through the 64-8 form so HMRC deals with us directly." },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.n}
                </div>
                <h3 className="font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto bg-surface rounded-2xl p-5 border border-border text-center">
            <p className="text-sm font-bold text-dark mb-1">How long does switching take?</p>
            <p className="text-text-light text-sm">
              Typically 3–6 weeks from sign-up to full HMRC authorisation. No compliance risk from switching
              mid-year when both firms coordinate through professional clearance.
            </p>
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
              Common questions from IT contractors about accountancy, IR35, and tax.
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
            The contractor accountant built for IT professionals
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Dedicated accountant · FreeAgent included · Unlimited IR35 reviews · Clever FLEX — all for £104.50/month.
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
