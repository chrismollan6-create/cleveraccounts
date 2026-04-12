"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Calendar,
  FileText,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Clock,
  Search,
  RefreshCw,
  UserCheck,
  Star,
  Zap,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── VAT Schemes ───────────────────────────────────────────────
const vatSchemes = [
  {
    icon: Calculator,
    title: "Standard Rate",
    subtitle: "20% on most goods & services",
    who: "Suits most VAT-registered businesses",
    pros: [
      "Claim back VAT on all eligible purchases",
      "Simple and transparent",
      "No turnover restrictions",
      "Works for any business size",
    ],
    cons: [
      "Quarterly admin of all purchases and sales",
      "Must track input/output VAT on every transaction",
    ],
  },
  {
    icon: TrendingUp,
    title: "Flat Rate Scheme",
    subtitle: "Fixed % of gross turnover",
    who: "Best for businesses with low input VAT (e.g. service businesses)",
    pros: [
      "Simplified bookkeeping — one flat percentage",
      "Can be more profitable in the first year (1% discount)",
      "Less time tracking individual VAT receipts",
    ],
    cons: [
      "Cannot reclaim input VAT on purchases (except capital assets over £2,000)",
      "Not suitable if you buy a lot of VAT-rated goods",
    ],
  },
  {
    icon: RefreshCw,
    title: "Cash Accounting",
    subtitle: "Pay & reclaim VAT when cash moves",
    who: "Ideal for businesses with slow-paying customers or cash flow concerns",
    pros: [
      "Only pay VAT when your customer pays you",
      "Automatic bad debt relief — no VAT on unpaid invoices",
      "Helps smooth cash flow peaks and troughs",
    ],
    cons: [
      "Can only join if turnover is under £1.35m",
      "You must leave if turnover exceeds £1.6m",
    ],
  },
  {
    icon: Calendar,
    title: "Annual Accounting",
    subtitle: "One return per year, 9 payments on account",
    who: "Suits stable businesses wanting to reduce filing frequency",
    pros: [
      "Only one VAT return per year instead of four",
      "Spread payments with interim direct debits",
      "Less quarterly admin",
    ],
    cons: [
      "Interim payments based on last year's liability — can cause cash flow issues",
      "You must leave if turnover exceeds £1.35m",
    ],
  },
];

// ── What we handle ────────────────────────────────────────────
const whatWeHandle = [
  {
    icon: UserCheck,
    title: "VAT Registration with HMRC",
    desc: "We handle the entire registration process — completing form VAT1, advising on your effective date of registration, and getting you set up correctly from the start.",
  },
  {
    icon: FileText,
    title: "Quarterly Return Preparation",
    desc: "Your dedicated accountant reviews all your transactions in FreeAgent and prepares your VAT return, ensuring every box is correct before submission.",
  },
  {
    icon: Zap,
    title: "MTD-Compliant Submission via FreeAgent",
    desc: "FreeAgent is HMRC-recognised MTD-compatible software included free with every package. Returns are submitted directly to HMRC — no bridging software, no manual uploads.",
  },
  {
    icon: TrendingUp,
    title: "Input VAT Reclaim",
    desc: "We make sure you're claiming back every penny of input VAT you're entitled to on allowable purchases, expenses and capital expenditure.",
  },
  {
    icon: ShieldCheck,
    title: "VAT Inspection Support",
    desc: "If HMRC selects you for a VAT compliance check, your accountant will liaise with HMRC on your behalf, prepare the necessary records, and support you throughout.",
  },
  {
    icon: XCircle,
    title: "De-registration When Needed",
    desc: "If your turnover drops below the de-registration threshold (currently £88,000) or you cease trading, we manage the de-registration process and final return.",
  },
];

// ── Common mistakes ───────────────────────────────────────────
const mistakes = [
  {
    icon: AlertTriangle,
    title: "Missing the Registration Threshold",
    desc: "Many businesses don't realise they've crossed the £90,000 rolling 12-month threshold until it's too late. HMRC can charge backdated VAT, interest and penalties. We monitor your turnover and alert you before you hit the limit.",
  },
  {
    icon: Calculator,
    title: "Choosing the Wrong VAT Scheme",
    desc: "Picking the flat rate scheme when you buy a lot of VAT-rated stock, or using standard accounting when cash accounting would ease your cash flow — the wrong scheme can cost thousands. We advise you on the right choice from day one.",
  },
  {
    icon: Search,
    title: "Missing Claimable Input VAT",
    desc: "Forgetting to claim VAT on subscriptions, equipment, home office costs, or pre-registration purchases is surprisingly common. Your accountant systematically checks for every recoverable penny.",
  },
  {
    icon: Clock,
    title: "Filing or Paying Late",
    desc: "HMRC operates a points-based penalty system for late VAT returns. Accumulate enough points and financial penalties follow — starting at £200. We track every deadline so you never receive a late filing penalty.",
  },
];

// ── Testimonials ──────────────────────────────────────────────
const testimonials = [
  {
    name: "Rachel Hennessy",
    role: "eCommerce Business Owner",
    quote:
      "I was terrified about VAT when my sales crossed £90k. Clever Accounts made the whole process painless — registered me, set up FreeAgent, and I've never missed a deadline. Couldn't recommend them more.",
  },
  {
    name: "Marcus Webb",
    role: "Limited Company Director",
    quote:
      "The flat rate scheme advice alone saved me over £3,000 in my first year. My accountant explained exactly why it suited my business and handled everything from registration onwards.",
  },
  {
    name: "Priya Nair",
    role: "Sole Trader — Consultancy",
    quote:
      "I voluntarily registered for VAT to reclaim on equipment and it's been brilliant. The whole process was smooth and I now look far more professional to larger clients. My accountant handles every quarterly return.",
  },
];

// ── FAQ data ──────────────────────────────────────────────────
const faqs = [
  {
    q: "When do I need to register for VAT?",
    a: "You must register for VAT when your taxable turnover exceeds £90,000 in any rolling 12-month period (not just a calendar year). You must register within 30 days of the end of the month in which you crossed the threshold. You can also register voluntarily at any point if your turnover is below the threshold — which can be beneficial if you want to reclaim input VAT on purchases or appear more established to clients.",
  },
  {
    q: "What is MTD for VAT?",
    a: "Making Tax Digital (MTD) for VAT requires all VAT-registered businesses to keep digital records and submit VAT returns using HMRC-recognised software. It has been mandatory for all VAT-registered businesses since April 2022. FreeAgent — included free with every Clever Accounts package — is fully MTD-compliant and submits directly to HMRC with no bridging software required.",
  },
  {
    q: "What's the VAT flat rate scheme?",
    a: "The flat rate scheme (FRS) lets eligible businesses pay VAT as a fixed percentage of their gross (VAT-inclusive) turnover, rather than calculating the difference between output and input VAT on every transaction. The percentage varies by sector — for example, 14.5% for IT consultants. It's most beneficial for service businesses with low VAT-rated purchases. There's also a 1% first-year discount. Your accountant will calculate whether FRS saves you money before recommending it.",
  },
  {
    q: "What happens if I miss the VAT registration deadline?",
    a: "If you fail to register on time, HMRC can assess and charge backdated VAT from the date you should have registered — meaning you effectively owe VAT on sales you may have already collected without it. On top of that, HMRC can charge a penalty of between 5% and 15% of the net tax due, plus interest. The longer you delay, the larger the penalty. If you think you might have already passed the threshold, contact us immediately.",
  },
  {
    q: "Can I reclaim VAT on purchases before registration?",
    a: "Yes — you can reclaim input VAT on goods purchased up to 4 years before your VAT registration date, provided you still hold them when you register. For services, you can reclaim VAT on supplies received up to 6 months before registration. This can be a significant benefit if you've been investing in your business before registering. Your accountant will identify and claim everything you're entitled to.",
  },
  {
    q: "How often do I file VAT returns?",
    a: "Most VAT-registered businesses file quarterly returns — every three months. The filing and payment deadline is one month and seven days after the end of each VAT quarter. Some businesses on the Annual Accounting Scheme file just one return per year and make interim payments throughout. The exact quarters depend on the stagger group HMRC assigns to you at registration.",
  },
  {
    q: "What if HMRC investigates my VAT?",
    a: "HMRC conducts VAT compliance checks on businesses both randomly and where they spot discrepancies. If you're selected, HMRC will request access to your records, invoices, and VAT workings. With Clever Accounts, your accountant handles all correspondence with HMRC, prepares the required documentation from your FreeAgent records, and attends or participates in any inspection on your behalf.",
  },
  {
    q: "Should I register voluntarily below the threshold?",
    a: "It depends on your situation. Voluntary registration makes sense if you buy a lot of VAT-rated goods and want to reclaim input VAT, if your customers are VAT-registered businesses (who can reclaim your VAT anyway), or if you want to appear more established. It may not suit you if your customers are end consumers who can't reclaim VAT — as it effectively increases your prices by 20% unless you absorb the cost. Your accountant will help you weigh up the pros and cons.",
  },
];

// ── FAQ item component ────────────────────────────────────────
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
          <ChevronUp size={20} className="text-primary shrink-0" />
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

export default function VATReturnsPage() {
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
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <BadgeCheck size={15} />
                VAT Compliance
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                VAT Returns —<br />
                <span className="text-gradient">Handled Every Quarter</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Stress-free VAT compliance for UK businesses. We prepare and
                submit your quarterly VAT returns on time, every time — fully
                MTD for VAT compliant via FreeAgent.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Whether you&apos;re newly VAT-registered or looking to switch
                accountants, your dedicated Clever Accounts expert handles
                everything from scheme selection to HMRC submission.
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
                VAT at a Glance
              </p>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">
                    Registration threshold
                  </span>
                  <span className="text-white font-bold text-lg">£90,000</span>
                </div>
                <div className="border-t border-white/10" />
                <div className="space-y-3">
                  {[
                    { label: "Q1 deadline (Feb–Apr quarter)", value: "7 May" },
                    { label: "Q2 deadline (May–Jul quarter)", value: "7 Aug" },
                    { label: "Q3 deadline (Aug–Oct quarter)", value: "7 Nov" },
                    { label: "Q4 deadline (Nov–Jan quarter)", value: "7 Feb" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white/60 text-sm">{label}</span>
                      <span className="text-primary font-semibold text-sm">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                    <BadgeCheck size={16} className="text-green-400" />
                  </div>
                  <span className="text-white/80 text-sm">
                    MTD for VAT compliant — FreeAgent submits directly to HMRC
                  </span>
                </div>
                <div className="bg-secondary/20 border border-secondary/30 rounded-2xl p-4 text-center">
                  <p className="text-white/60 text-xs mb-1">
                    VAT included in packages from
                  </p>
                  <p className="text-white font-black text-2xl">
                    £32.50
                    <span className="text-white/50 text-sm font-normal">
                      /month
                    </span>
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
            <path
              d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ── VAT REGISTRATION ─────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            {/* Left */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                VAT Registration
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                When You Must Register — and When You Might Want To
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                You are legally required to register for VAT once your taxable
                turnover exceeds <strong className="text-dark">£90,000</strong>{" "}
                in any rolling 12-month period. This is not a calendar year —
                HMRC looks at any consecutive 12-month window. Miss this and
                you&apos;ll owe backdated VAT, interest, and penalties.
              </p>
              <p className="text-text-light leading-relaxed mb-5">
                But registration isn&apos;t always forced. Many businesses
                voluntarily register below the threshold because it makes
                commercial and financial sense:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Reclaim input VAT on purchases, equipment and expenses",
                  "Appear more established and credible to corporate clients",
                  "Recover VAT on pre-registration purchases (up to 4 years for goods)",
                  "Plan ahead before you hit the compulsory threshold",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <span className="text-text-light">{point}</span>
                  </li>
                ))}
              </ul>
              <p className="text-text-light leading-relaxed">
                Your Clever Accounts accountant will assess your situation,
                advise whether voluntary registration makes sense, and handle
                the entire HMRC registration process for you.
              </p>
            </div>

            {/* Right — comparison cards */}
            <div className="space-y-5">
              <div className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <p className="font-black text-dark text-lg">
                      Mandatory Registration
                    </p>
                    <p className="text-text-light text-sm">
                      Turnover over £90,000
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    "Must register within 30 days of end of the threshold month",
                    "Charge VAT on all taxable sales from effective date",
                    "Submit quarterly returns to HMRC via MTD-compliant software",
                    "Penalties apply for late registration",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={15}
                        className="text-red-400 shrink-0 mt-0.5"
                      />
                      <span className="text-text-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="font-black text-dark text-lg">
                      Voluntary Registration
                    </p>
                    <p className="text-text-light text-sm">
                      Your choice below £90,000
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    "Reclaim input VAT on business purchases and expenses",
                    "Pre-registration VAT reclaimable on goods (4 years) and services (6 months)",
                    "Signals professionalism to VAT-registered clients",
                    "Can de-register if turnover stays below £88,000",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={15}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <span className="text-text-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider — white to surface */}
      <div className="relative overflow-hidden bg-white h-10">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 absolute bottom-0"
        >
          <path
            d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
            fill="var(--color-surface, #F8FAFC)"
          />
        </svg>
      </div>

      {/* ── VAT SCHEMES ──────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              VAT Schemes
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 leading-tight">
              Which VAT Scheme Is Right for You?
            </h2>
            <p className="text-text-light max-w-2xl mx-auto leading-relaxed">
              HMRC offers four main VAT accounting schemes. The right one depends
              on your turnover, business type, and how much VAT-rated purchasing
              you do. Your accountant will advise before you register.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {vatSchemes.map((scheme) => {
              const Icon = scheme.icon;
              return (
                <div
                  key={scheme.title}
                  className="bg-white border border-border rounded-2xl shadow-sm card-hover p-7"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="font-black text-dark text-xl">
                        {scheme.title}
                      </p>
                      <p className="text-primary text-sm font-semibold">
                        {scheme.subtitle}
                      </p>
                      <p className="text-text-light text-xs mt-1">
                        {scheme.who}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                        Pros
                      </p>
                      <ul className="space-y-1.5">
                        {scheme.pros.map((pro) => (
                          <li
                            key={pro}
                            className="flex items-start gap-1.5 text-xs text-text-light"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-green-500 shrink-0 mt-0.5"
                            />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">
                        Cons
                      </p>
                      <ul className="space-y-1.5">
                        {scheme.cons.map((con) => (
                          <li
                            key={con}
                            className="flex items-start gap-1.5 text-xs text-text-light"
                          >
                            <XCircle
                              size={13}
                              className="text-red-400 shrink-0 mt-0.5"
                            />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave divider — surface to dark */}
      <div className="relative overflow-hidden bg-surface h-10">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 absolute bottom-0"
        >
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="#0F172A"
          />
        </svg>
      </div>

      {/* ── WHAT WE HANDLE ───────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              What We Handle
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Complete VAT Management —{" "}
              <span className="text-gradient">Start to Finish</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
              From your first VAT registration through to every quarterly return
              and beyond, your dedicated accountant handles everything.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeHandle.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <p className="font-black text-white text-lg mb-2">
                    {item.title}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wave divider — dark to white */}
        <div className="relative mt-16 overflow-hidden h-10">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10"
          >
            <path
              d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ── MTD FOR VAT CALLOUT ──────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 text-green-600 rounded-full px-4 py-2 text-sm font-semibold mb-5">
                  <BadgeCheck size={15} />
                  Already Live — Mandatory for All
                </div>
                <h2 className="text-3xl font-black text-dark mb-4 leading-tight">
                  MTD for VAT — We&apos;ve Had You Covered Since Day One
                </h2>
                <p className="text-text-light leading-relaxed mb-4">
                  Making Tax Digital for VAT has been mandatory for all
                  VAT-registered businesses since April 2022. Every business
                  must keep digital records and submit returns via
                  HMRC-recognised software — paper returns are no longer
                  accepted.
                </p>
                <p className="text-text-light leading-relaxed">
                  With Clever Accounts, there is nothing extra for you to do.
                  FreeAgent is a fully HMRC-approved MTD software platform —
                  included free with every package. Your accountant handles your
                  submission each quarter directly from FreeAgent. No bridging
                  software. No spreadsheets. No manual uploads.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    label: "FreeAgent submits directly to HMRC",
                    colour: "bg-primary/10 text-primary",
                  },
                  {
                    icon: ShieldCheck,
                    label: "No bridging software required",
                    colour: "bg-green-500/10 text-green-600",
                  },
                  {
                    icon: BadgeCheck,
                    label: "Digital records maintained automatically",
                    colour: "bg-primary/10 text-primary",
                  },
                  {
                    icon: Calendar,
                    label: "Deadlines tracked and never missed",
                    colour: "bg-secondary/10 text-secondary",
                  },
                  {
                    icon: FileText,
                    label: "Full audit trail of every submission",
                    colour: "bg-green-500/10 text-green-600",
                  },
                ].map(({ icon: Icon, label, colour }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colour}`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="text-dark font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMON MISTAKES ──────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Common Pitfalls
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 leading-tight">
              The VAT Mistakes We See Every Week
            </h2>
            <p className="text-text-light max-w-2xl mx-auto leading-relaxed">
              VAT is one of the areas where HMRC most actively investigates
              businesses. These are the mistakes that cost UK businesses
              thousands of pounds each year — none of which happen with a
              Clever Accounts accountant in your corner.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mistakes.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <p className="font-black text-dark text-base mb-2">
                    {m.title}
                  </p>
                  <p className="text-text-light text-sm leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              What Our Clients Say
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight">
              VAT Made Simple for Real Businesses
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-7"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-secondary fill-secondary"
                    />
                  ))}
                </div>
                <p className="text-text leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-black text-dark">{t.name}</p>
                  <p className="text-text-light text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              FAQs
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              VAT Questions, Answered
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ORANGE GRADIENT CTA ──────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
              Get Started Today
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Hand Your VAT Over to the Experts?
            </h2>
            <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Join thousands of UK businesses who trust {COMPANY.name} with
              their accounts. VAT registration, quarterly returns, MTD
              compliance — all handled from{" "}
              <strong className="text-white">£32.50/month</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-all shadow-lg"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-10 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
              >
                <Phone size={20} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM SURFACE CTA ───────────────────────────────── */}
      <section className="bg-surface py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            No Setup Fees · No Minimum Contract
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-dark mb-4">
            VAT compliance included in every package
          </h2>
          <p className="text-text-light leading-relaxed mb-6 max-w-xl mx-auto">
            Quarterly VAT returns, MTD submission via FreeAgent, scheme advice
            and HMRC registration — all included as standard with{" "}
            {COMPANY.name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all"
            >
              View Pricing <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-border text-dark font-semibold px-8 py-3 rounded-xl hover:bg-white transition-all"
            >
              Speak to an Accountant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
