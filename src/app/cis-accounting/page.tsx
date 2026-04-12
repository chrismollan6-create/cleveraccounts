"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  ChevronDown,
  ChevronUp,
  HardHat,
  Hammer,
  FileText,
  Users,
  RefreshCw,
  BadgeCheck,
  TrendingDown,
  ShieldCheck,
  Star,
  AlertTriangle,
  Percent,
  ClipboardList,
  Receipt,
  UserCheck,
  Building2,
  Wrench,
  BarChart3,
  Info,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── Deduction rate cards ──────────────────────────────────────
const deductionRates = [
  {
    rate: "0%",
    label: "Gross Payment Status",
    colour: "border-green-500",
    badgeColour: "bg-green-500/15 text-green-700 border-green-500/30",
    dotColour: "bg-green-500",
    description:
      "Subcontractors who have applied for and been granted gross payment status receive their full contract payment with no deduction. Requires passing HMRC's turnover and compliance tests.",
    who: "Registered & compliant — GPS granted",
  },
  {
    rate: "20%",
    label: "Standard Rate",
    colour: "border-orange-500",
    badgeColour: "bg-orange-500/15 text-orange-700 border-orange-500/30",
    dotColour: "bg-orange-500",
    description:
      "The standard CIS deduction rate for subcontractors who are registered with HMRC under the scheme. Deductions are credited against your income tax and National Insurance liability at year end.",
    who: "Registered with HMRC for CIS",
  },
  {
    rate: "30%",
    label: "Higher Rate",
    colour: "border-red-500",
    badgeColour: "bg-red-500/15 text-red-700 border-red-500/30",
    dotColour: "bg-red-500",
    description:
      "Applied to subcontractors who cannot be verified by HMRC — typically because they are not registered for CIS or the details provided do not match HMRC records. Registering for CIS avoids this higher rate.",
    who: "Not registered / cannot be verified",
  },
];

// ── Contractor obligations ────────────────────────────────────
const contractorObligations = [
  {
    icon: UserCheck,
    title: "Verify subcontractors",
    desc: "Before making a first payment, contractors must verify each subcontractor with HMRC to determine the correct deduction rate (0%, 20%, or 30%).",
  },
  {
    icon: Percent,
    title: "Make CIS deductions",
    desc: "Deduct the correct percentage from each payment to a subcontractor (labour element only — materials are excluded from the deduction).",
  },
  {
    icon: ClipboardList,
    title: "File monthly returns",
    desc: "Submit a CIS monthly return to HMRC by the 19th of each month detailing payments made and deductions taken in the previous tax month.",
  },
  {
    icon: Receipt,
    title: "Issue payment & deduction statements",
    desc: "Provide each subcontractor with a payment and deduction statement within 14 days of the end of each tax month.",
  },
];

// ── Subcontractor needs ───────────────────────────────────────
const subcontractorNeeds = [
  {
    icon: BadgeCheck,
    title: "Register with HMRC for CIS",
    desc: "Register before work starts to ensure you're on the 20% standard rate rather than the 30% higher rate. We handle registration as part of onboarding.",
  },
  {
    icon: FileText,
    title: "Provide your UTR to contractors",
    desc: "Your Unique Taxpayer Reference (UTR) is what contractors use to verify you with HMRC. Without it, they must deduct at 30%.",
  },
  {
    icon: BarChart3,
    title: "Track deductions suffered",
    desc: "Keep records of every payment and deduction statement you receive. These deductions will be offset against your tax liability at year end.",
  },
  {
    icon: TrendingDown,
    title: "Reclaim overpaid tax at year end",
    desc: "Most CIS subcontractors overpay tax during the year. Your self assessment return is where you reclaim the difference — we make sure you don't miss a penny.",
  },
];

// ── What we do ───────────────────────────────────────────────
const whatWeDo = [
  {
    icon: HardHat,
    title: "CIS Registration",
    desc: "We register you with HMRC for the Construction Industry Scheme — whether as a contractor, a subcontractor, or both. Get on the 20% standard rate from the start.",
  },
  {
    icon: ClipboardList,
    title: "Monthly Contractor Returns",
    desc: "We prepare and file your CIS monthly returns by the 19th deadline each month — covering all payments made, deductions taken, and subcontractor details.",
  },
  {
    icon: UserCheck,
    title: "Subcontractor Verification",
    desc: "We verify your subcontractors with HMRC before first payment, confirming the correct deduction rate for each worker to keep you fully compliant.",
  },
  {
    icon: TrendingDown,
    title: "Year-End Tax Reclaim",
    desc: "We prepare your self assessment return and reclaim any CIS tax deducted in excess of your actual liability — getting overpaid tax back into your pocket.",
  },
  {
    icon: BadgeCheck,
    title: "Gross Payment Status Applications",
    desc: "We assess your eligibility and handle the application for gross payment status — so you can receive payments without any deduction being made.",
  },
  {
    icon: FileText,
    title: "Self Assessment Including CIS Income",
    desc: "Your full self assessment return, including all CIS income, deductions suffered, expenses, and any other self-employment income — filed accurately and on time.",
  },
];

// ── GPS requirements ─────────────────────────────────────────
const gpsRequirements = [
  {
    label: "Turnover test",
    desc: "Net construction turnover (excluding materials and VAT) must meet HMRC's minimum threshold — £30,000 per director/partner or £100,000 for the business.",
  },
  {
    label: "Compliance test",
    desc: "Your tax affairs must be up to date. HMRC checks that all returns have been filed and all taxes paid on time for the previous 12 months.",
  },
  {
    label: "Business test",
    desc: "The business must be carrying on a construction business in the UK and dealing with construction contracts in the normal course of trade.",
  },
];

// ── MTD & CIS points ─────────────────────────────────────────
const mtdCisPoints = [
  "CIS subcontractors are self-employed — MTD for Income Tax (ITSA) applies from April 2026 if your income exceeds £50,000",
  "From April 2027, the threshold drops to £30,000, bringing more CIS workers into quarterly reporting",
  "FreeAgent (included free with Clever Accounts) tracks CIS deductions and submits quarterly updates directly to HMRC",
  "Real-time deduction tracking through FreeAgent means year-end reclaims are faster and more accurate",
  "CIS contractors must also ensure their subcontractors are MTD-ready where applicable",
  "Gross payment status applications benefit from clean digital records — MTD compliance strengthens your case",
];

// ── Testimonials ─────────────────────────────────────────────
const testimonials = [
  {
    name: "Mark Hutchinson",
    role: "CIS Subcontractor — Plastering",
    quote:
      "I used to lose hundreds every year because I wasn't claiming everything back. Clever Accounts got me registered for CIS, sorted my self assessment, and reclaimed nearly £3,000 in overpaid tax in the first year. Absolutely brilliant.",
    rating: 5,
  },
  {
    name: "Alan Trevithick",
    role: "Building Contractor",
    quote:
      "The monthly CIS returns used to take me an entire day. Now Clever Accounts handles the whole thing. They verify my subbies, file the returns on time, and I haven't had a single HMRC penalty since switching.",
    rating: 5,
  },
  {
    name: "Wayne Pilkington",
    role: "Self-Employed Electrician (CIS)",
    quote:
      "Got gross payment status with their help — the difference to my cash flow has been massive. My accountant explained everything clearly and handled all the paperwork. Couldn't recommend them more.",
    rating: 5,
  },
];

// ── FAQs ─────────────────────────────────────────────────────
const faqs = [
  {
    q: "What is the Construction Industry Scheme?",
    a: "The Construction Industry Scheme (CIS) is an HMRC scheme that sets out rules for how contractors in the construction industry must handle payments to subcontractors. Contractors are required to deduct tax at source from payments to subcontractors and pass those deductions to HMRC. The scheme covers most construction work on buildings and infrastructure in the UK.",
  },
  {
    q: "Do I need to register for CIS as a subcontractor?",
    a: "You are not legally required to register for CIS as a subcontractor, but it is strongly advisable. If you are not registered and cannot be verified by HMRC, contractors must deduct tax at 30% from your payments rather than the standard 20%. Registering takes only a few minutes and immediately reduces the deduction rate applied to your earnings.",
  },
  {
    q: "What's the difference between 20% and 30% deductions?",
    a: "The 20% standard rate applies to subcontractors who are registered with HMRC for CIS and can be verified. The 30% higher rate applies when HMRC cannot verify the subcontractor — usually because they are not registered or the details don't match records. On a £1,000 payment, the difference is £100. Over a year this adds up significantly, and registering for CIS is the straightforward solution.",
  },
  {
    q: "How do I reclaim overpaid CIS tax?",
    a: "CIS tax deducted from your payments is credited against your income tax and National Insurance liability via your self assessment tax return. If more has been deducted than you actually owe in tax, HMRC will repay the difference. Many CIS subcontractors — particularly those with lower incomes or significant allowable expenses — receive a refund. We prepare your self assessment return and ensure every deduction is accounted for.",
  },
  {
    q: "What is gross payment status and how do I get it?",
    a: "Gross payment status (GPS) means HMRC will allow a subcontractor to receive their full payment from contractors without any CIS deduction being made. To qualify, you must pass three tests: a business test (genuine construction business), a turnover test (minimum construction turnover), and a compliance test (all tax affairs up to date for the past 12 months). We assess your eligibility and handle the application on your behalf.",
  },
  {
    q: "I'm a contractor — what are my monthly obligations?",
    a: "As a CIS contractor you must: verify each new subcontractor with HMRC before making a first payment; make the correct deduction (0%, 20%, or 30%) from all payments to subcontractors; file a CIS monthly return by the 19th of each month detailing all payments and deductions; and provide each subcontractor with a payment and deduction statement within 14 days of the end of the tax month. Failure to meet these obligations results in penalties.",
  },
  {
    q: "Does MTD apply to CIS subcontractors?",
    a: "Yes. CIS subcontractors are classed as self-employed, so Making Tax Digital for Income Tax (MTD for ITSA) applies to them in the same way as any other sole trader. From April 2026, CIS workers with income over £50,000 must keep digital records and submit quarterly updates to HMRC. From April 2027, the threshold drops to £30,000. FreeAgent — included free with Clever Accounts — is fully MTD-compatible and handles all submissions automatically.",
  },
  {
    q: "Can CIS subcontractors claim expenses?",
    a: "Yes — CIS subcontractors can claim allowable business expenses against their self-employment income, which reduces the profit on which tax is calculated. Typical claimable expenses include tools, equipment, work clothing (PPE and specialist items), vehicle costs for business journeys, phone costs, insurance, and accountancy fees. Materials are generally excluded from CIS deductions in any case, but keeping good records of all expenses is key to minimising your tax bill.",
  },
];

// ── FAQ Item component ────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white">{q}</span>
        {open ? (
          <ChevronUp size={20} className="text-primary-light shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-white/50 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Star rating ───────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-secondary text-secondary" />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function CisAccountingPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <HardHat size={15} />
                Construction Industry Scheme
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                CIS Accounting —{" "}
                <span className="text-gradient">
                  Built for the Construction Industry
                </span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                The Construction Industry Scheme is one of the most
                administratively demanding areas of UK tax. Contractors face
                monthly filing obligations, verification requirements, and
                strict payment rules. Subcontractors need to ensure they're
                registered, tracking deductions, and reclaiming overpaid tax
                every year.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Clever Accounts has specialist experience in CIS accounting for
                both contractors and subcontractors — fixed monthly fee,
                dedicated accountant, no nasty surprises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <a
                  href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20"
                >
                  <Phone size={20} /> {COMPANY.freephone}
                </a>
              </div>
            </div>

            {/* Right — glassmorphism panel */}
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">
                Key CIS Facts
              </p>
              <div className="space-y-4 mb-6">
                {[
                  {
                    dot: "bg-green-500",
                    label: "Gross payment status",
                    value: "0% deduction",
                    valueCol: "text-green-400",
                  },
                  {
                    dot: "bg-orange-500",
                    label: "Standard rate (registered)",
                    value: "20% deduction",
                    valueCol: "text-orange-400",
                  },
                  {
                    dot: "bg-red-500",
                    label: "Higher rate (unregistered)",
                    value: "30% deduction",
                    valueCol: "text-red-400",
                  },
                  {
                    dot: "bg-blue-500",
                    label: "Monthly return deadline",
                    value: "19th each month",
                    valueCol: "text-blue-400",
                  },
                  {
                    dot: "bg-purple-500",
                    label: "Deduction applies to",
                    value: "Labour only",
                    valueCol: "text-purple-400",
                  },
                ].map(({ dot, label, value, valueCol }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`}
                    />
                    <span className="text-white/80 text-sm flex-1">
                      {label}
                    </span>
                    <span className={`text-xs font-semibold ${valueCol}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-5 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <HardHat size={18} className="text-secondary shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs leading-relaxed">
                    Specialists in CIS accounting for contractors and
                    subcontractors across the UK construction industry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── WHAT IS CIS ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            {/* Left — explanation */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                The Basics
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                What is the Construction Industry Scheme?
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                The Construction Industry Scheme (CIS) is an HMRC scheme
                governing tax on payments made by contractors to subcontractors
                in the UK construction industry. Rather than subcontractors
                receiving their full fee and paying tax themselves at year end,
                contractors are required to <strong className="text-dark">deduct tax at source</strong> from
                every payment made.
              </p>
              <p className="text-text-light leading-relaxed mb-5">
                Those deductions are paid to HMRC on the subcontractor's behalf
                and credited against the subcontractor's income tax and National
                Insurance liability. At year end, subcontractors file a self
                assessment return — and for most CIS workers, this results in a
                refund because more tax has been deducted in-year than they
                actually owe.
              </p>
              <p className="text-text-light leading-relaxed">
                The scheme applies to most construction work in the UK —
                building, alterations, repairs, decorating, civil engineering,
                demolition, installation of systems — and covers both
                individuals and companies operating in the sector.
              </p>
            </div>

            {/* Right — deduction rate cards */}
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">
                Deduction Rates
              </p>
              {deductionRates.map((r) => (
                <div
                  key={r.rate}
                  className={`bg-white border-l-4 ${r.colour} border border-border rounded-2xl shadow-sm p-5`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-2xl font-black ${
                        r.rate === "0%"
                          ? "text-green-600"
                          : r.rate === "20%"
                          ? "text-orange-500"
                          : "text-red-500"
                      }`}
                    >
                      {r.rate}
                    </span>
                    <span className="font-bold text-dark">{r.label}</span>
                  </div>
                  <p className="text-text-light text-sm leading-relaxed mb-2">
                    {r.description}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 ${r.badgeColour}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${r.dotColour}`}
                    />
                    {r.who}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider to surface */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
              fill="var(--surface)"
            />
          </svg>
        </div>
      </section>

      {/* ── CONTRACTORS vs SUBCONTRACTORS ────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Know Your Role
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight">
              Contractors &amp; Subcontractors —{" "}
              <span className="text-gradient">Different Obligations</span>
            </h2>
            <p className="mt-4 text-text-light max-w-2xl mx-auto">
              CIS creates very different obligations depending on whether you
              engage other workers or work under contract yourself. Many people
              in construction are both — we handle both sides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contractors */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-dark">Contractors</h3>
                  <p className="text-text-light text-sm">
                    Businesses that engage subcontractors
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {contractorObligations.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/8 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-text-light text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-border bg-orange-50 rounded-xl p-4">
                <div className="flex gap-2">
                  <AlertTriangle
                    size={16}
                    className="text-orange-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-orange-800 leading-relaxed">
                    <strong>Penalties start at £100</strong> for a late monthly
                    return, rising to £3,000 or more for persistent
                    non-compliance. We file every return on time.
                  </p>
                </div>
              </div>
            </div>

            {/* Subcontractors */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Hammer size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-dark">
                    Subcontractors
                  </h3>
                  <p className="text-text-light text-sm">
                    Individuals and businesses working under contract
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {subcontractorNeeds.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-text-light text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-border bg-green-50 rounded-xl p-4">
                <div className="flex gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-green-600 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-green-800 leading-relaxed">
                    <strong>Most subcontractors overpay tax</strong> during the
                    year. We reclaim every penny you're owed through your self
                    assessment return.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider to dark */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
              fill="var(--dark)"
            />
          </svg>
        </div>
      </section>

      {/* ── WHAT WE DO ───────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Our CIS Service
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              What We Do For{" "}
              <span className="text-gradient">You</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              End-to-end CIS compliance and tax management — so you can focus on
              the build, not the paperwork.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.map((item) => (
              <div
                key={item.title}
                className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider to white */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── GROSS PAYMENT STATUS ─────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            {/* Left */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Advanced CIS
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                Gross Payment Status —{" "}
                <span className="text-gradient">
                  Get Paid Without Deductions
                </span>
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                Gross payment status (GPS) is a special classification granted
                by HMRC that allows a subcontractor to receive their full
                contract payments from contractors without any CIS deduction
                being made. Instead of waiting until year end to reclaim
                overpaid tax, you keep your full cash flow throughout the year.
              </p>
              <p className="text-text-light leading-relaxed mb-5">
                For businesses with significant construction turnover, the
                difference to cash flow can be substantial — hundreds or
                thousands of pounds that would otherwise be locked up until your
                self assessment return is processed.
              </p>
              <p className="text-text-light leading-relaxed mb-8">
                HMRC sets strict criteria, but many established subcontractors
                qualify without realising it. We assess your eligibility, advise
                on any steps needed to meet the requirements, and handle the
                full application process.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-7 py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md"
              >
                Speak to an Accountant <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right — requirements + benefits */}
            <div className="space-y-5">
              <div>
                <p className="font-black text-dark mb-3">
                  GPS Requirements
                </p>
                <div className="space-y-3">
                  {gpsRequirements.map((r) => (
                    <div
                      key={r.label}
                      className="bg-white border border-border rounded-2xl shadow-sm card-hover p-5"
                    >
                      <p className="font-bold text-dark text-sm mb-1">
                        {r.label}
                      </p>
                      <p className="text-text-light text-sm leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="font-bold text-dark mb-3">
                  Benefits of Gross Payment Status
                </p>
                <ul className="space-y-2">
                  {[
                    "Receive 100% of your contract payment from day one",
                    "Improved cash flow — no waiting for year-end reclaims",
                    "Signals credibility and compliance to contractors",
                    "Reduces admin — no deduction statements to reconcile",
                    "Tax is still owed at year end, but you manage it yourself",
                  ].map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-green-800"
                    >
                      <CheckCircle2
                        size={15}
                        className="text-green-500 shrink-0 mt-0.5"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-dark leading-relaxed">
                  HMRC can withdraw GPS if compliance slips — that's why having
                  a dedicated accountant keeping your affairs up to date is so
                  important.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave to surface */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
              fill="var(--surface)"
            />
          </svg>
        </div>
      </section>

      {/* ── MTD & CIS ────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Making Tax Digital
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight">
              MTD &amp; CIS —{" "}
              <span className="text-gradient">What You Need to Know</span>
            </h2>
            <p className="mt-4 text-text-light">
              Making Tax Digital for Income Tax (MTD for ITSA) is coming for
              all self-employed individuals — and CIS subcontractors are no
              exception. Here's how it affects you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            {mtdCisPoints.map((point) => (
              <div
                key={point}
                className="bg-white border border-border rounded-2xl shadow-sm p-5 flex gap-3"
              >
                <CheckCircle2
                  size={18}
                  className="text-primary shrink-0 mt-0.5"
                />
                <p className="text-dark text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-white border border-border rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <RefreshCw size={22} />
            </div>
            <div className="flex-1">
              <p className="font-black text-dark mb-1">
                FreeAgent is fully MTD-compatible — and it's included free
              </p>
              <p className="text-text-light text-sm leading-relaxed">
                Every Clever Accounts package includes FreeAgent, HMRC's
                recognised MTD-compatible software. It tracks your CIS
                deductions and submits quarterly updates to HMRC automatically —
                no bridging software needed.
              </p>
            </div>
            <Link
              href="/making-tax-digital"
              className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-5 py-3 rounded-xl text-sm whitespace-nowrap hover:bg-secondary/90 transition-all"
            >
              MTD Guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Wave to white */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Client Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight">
              Trusted by the Construction Industry
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-7"
              >
                <Stars count={t.rating} />
                <p className="text-dark leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{t.name}</p>
                    <p className="text-text-light text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave to dark for FAQ */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
              fill="var(--dark)"
            />
          </svg>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              CIS Questions Answered
            </h2>
            <p className="mt-4 text-white/60">
              Everything you need to know about the Construction Industry Scheme
              — from registration to gross payment status.
            </p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Wave to orange CTA */}
        <div className="overflow-hidden leading-none mt-16 md:mt-24 -mb-16 md:-mb-24">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
              fill="#ea580c"
            />
          </svg>
        </div>
      </section>

      {/* ── ORANGE GRADIENT CTA ───────────────────────────────── */}
      <section className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Wrench size={15} />
            CIS Specialists
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            Let's Sort Your CIS Accounting
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Whether you're a contractor filing monthly returns or a
            subcontractor chasing an overpaid tax reclaim — we've got you
            covered. Fixed monthly fee, dedicated accountant, no nasty
            surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-black px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
            >
              Get Started Today <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/30 transition-all border border-white/30"
            >
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
          <p className="text-white/60 text-sm mt-5">
            Free freephone &bull; No setup fee &bull; Cancel anytime
          </p>
        </div>

        {/* Wave to surface */}
        <div className="overflow-hidden leading-none mt-16 md:mt-20 -mb-16 md:-mb-20">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
              fill="var(--surface)"
            />
          </svg>
        </div>
      </section>

      {/* ── BOTTOM SURFACE CTA ───────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-border rounded-3xl shadow-sm p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={30} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-dark mb-4">
              Switch to Clever Accounts — it's quick and easy
            </h2>
            <p className="text-text-light leading-relaxed mb-6 max-w-xl mx-auto">
              Already with another accountant? We handle the switch for you —
              contacting your previous accountant, gathering your records, and
              getting you fully set up with no disruption to your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl hover:bg-secondary/90 transition-all shadow-md"
              >
                Start Your Switch <ArrowRight size={18} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-surface text-dark font-semibold px-8 py-4 rounded-xl hover:bg-border transition-all border border-border"
              >
                View Pricing
              </Link>
            </div>
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap justify-center gap-6 text-sm text-text-light">
              {[
                "No setup fee",
                "Dedicated accountant",
                "Free FreeAgent software",
                "No minimum contract",
                "Cancel anytime",
              ].map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
