"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  FileText,
  User,
  Users,
  Home,
  Building2,
  Briefcase,
  TrendingUp,
  TrendingDown,
  BadgeCheck,
  Clock,
  Star,
  ShieldCheck,
  XCircle,
  Receipt,
  Calculator,
  MessageSquare,
  Bell,
  UserCheck,
  Globe,
  PiggyBank,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── Who needs to file ─────────────────────────────────────────
const whoNeedsToFile = [
  {
    icon: Briefcase,
    title: "Self-Employed",
    desc: "Sole traders with trading income over £1,000 in the tax year.",
  },
  {
    icon: TrendingUp,
    title: "High Earners",
    desc: "Individuals with income over £100,000, regardless of employment status.",
  },
  {
    icon: Home,
    title: "Landlords",
    desc: "Anyone receiving rental income from property in the UK or abroad.",
  },
  {
    icon: Building2,
    title: "Company Directors",
    desc: "Directors of limited companies who receive income outside PAYE.",
  },
  {
    icon: Globe,
    title: "Foreign Income",
    desc: "UK residents with income from overseas sources or foreign assets.",
  },
  {
    icon: PiggyBank,
    title: "Untaxed Income",
    desc: "Those with savings interest, dividends, or other untaxed income above allowances.",
  },
];

// ── What's included ───────────────────────────────────────────
const whatsIncluded = [
  {
    icon: UserCheck,
    title: "Dedicated Accountant",
    desc: "Your own named accountant who knows your situation, handles your return, and is available whenever you need them.",
  },
  {
    icon: FileText,
    title: "Complete SA Return Preparation",
    desc: "We prepare and file your full self assessment tax return with HMRC — all pages, all supplementary forms.",
  },
  {
    icon: Receipt,
    title: "All Income Sources Covered",
    desc: "Employment, self-employment, rental income, dividends, savings, capital gains — every source accounted for correctly.",
  },
  {
    icon: TrendingDown,
    title: "Expense Maximisation",
    desc: "We review all allowable expenses and claim everything you're entitled to, reducing your tax bill legitimately.",
  },
  {
    icon: MessageSquare,
    title: "HMRC Correspondence",
    desc: "We deal with HMRC on your behalf. Enquiries, letters, and compliance checks handled professionally.",
  },
  {
    icon: Bell,
    title: "Tax Calculation & Payment Reminders",
    desc: "We calculate exactly what you owe, including payments on account, and remind you before every deadline.",
  },
];

// ── Deadlines ─────────────────────────────────────────────────
const deadlines = [
  {
    date: "5 October",
    label: "Register for Self Assessment",
    desc: "Deadline to register with HMRC if this is your first self assessment return. Miss this and you risk penalties before you've even filed.",
    colour: "border-blue-500",
    badgeColour: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: User,
  },
  {
    date: "31 October",
    label: "Paper Return Deadline",
    desc: "If you want to submit a paper tax return rather than online, this is the deadline. Most people file online — it's simpler and gives you three more months.",
    colour: "border-amber-500",
    badgeColour: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: FileText,
  },
  {
    date: "31 January",
    label: "Online Filing + Payment",
    desc: "The main deadline — online returns must be submitted and any tax owed must be paid. This is also when your first payment on account for the following year is due.",
    colour: "border-red-500",
    badgeColour: "bg-red-500/15 text-red-300 border-red-500/30",
    icon: Calculator,
  },
  {
    date: "31 July",
    label: "Second Payment on Account",
    desc: "If HMRC has set payments on account (advance payments toward next year's bill), the second instalment is due in July. We'll make sure you know exactly what to pay.",
    colour: "border-orange-500",
    badgeColour: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    icon: Clock,
  },
];

// ── Common mistakes ───────────────────────────────────────────
const commonMistakes = [
  {
    icon: Clock,
    title: "Missing Deadlines",
    desc: "An automatic £100 penalty applies the moment you miss the 31 January deadline, even if you owe no tax. Penalties escalate rapidly — £10/day after 3 months, then 5% surcharges on unpaid tax after 6 and 12 months.",
  },
  {
    icon: Receipt,
    title: "Forgetting Expenses",
    desc: "Many self-employed people and landlords miss allowable expenses they're entitled to claim — home office, mileage, professional subscriptions, equipment, and more. Every missed expense means paying more tax than necessary.",
  },
  {
    icon: Calculator,
    title: "Wrong Income Figures",
    desc: "Forgetting to include all income sources — rental income, savings interest, freelance work alongside employment, dividends — is a common error that can trigger HMRC enquiries and penalties for inaccurate returns.",
  },
  {
    icon: AlertTriangle,
    title: "Not Registering on Time",
    desc: "If you're newly self-employed or have a new income source requiring self assessment, you must register with HMRC by 5 October following the end of the tax year. Late registration itself carries penalties.",
  },
];

// ── Testimonials ──────────────────────────────────────────────
const testimonials = [
  {
    name: "Rachel Brennan",
    role: "Freelance Graphic Designer",
    quote:
      "I used to spend weeks every January dreading the tax return. Since switching to Clever Accounts, my accountant just tells me what I owe and when to pay it. Total peace of mind.",
    rating: 5,
  },
  {
    name: "Mark Oduya",
    role: "Buy-to-Let Landlord",
    quote:
      "With three rental properties, my self assessment used to be a nightmare. My dedicated accountant at Clever Accounts handles everything — including making sure I claim every expense I'm entitled to.",
    rating: 5,
  },
  {
    name: "Priya Chandra",
    role: "Sole Trader Consultant",
    quote:
      "I was worried I'd missed expenses over previous years. Clever Accounts reviewed my situation, amended my returns, and got me a refund I didn't know I was owed. Brilliant service.",
    rating: 5,
  },
];

// ── FAQs ──────────────────────────────────────────────────────
const faqs = [
  {
    q: "Do I need to do a self assessment tax return?",
    a: "You must complete a self assessment if you're self-employed with trading income over £1,000, a company director, a landlord, earning over £100,000 per year, receiving untaxed income above certain allowances (savings, dividends), or have foreign income. If you're unsure, HMRC has an online tool to check — or just ask us.",
  },
  {
    q: "What is the self assessment deadline?",
    a: "There are two main deadlines: 31 October for paper returns and 31 January for online returns. Both deadlines also apply to paying any tax owed. An automatic £100 penalty applies the moment you miss the 31 January deadline. We manage all deadlines for you so you'll never be late.",
  },
  {
    q: "What expenses can I claim on my self assessment?",
    a: "For self-employed individuals: office costs, travel and mileage, clothing (uniforms/protective gear), staff costs, materials, financial charges, advertising, and training. For landlords: mortgage interest (now a tax credit), letting agent fees, maintenance and repairs, insurance, and utilities. We review your specific situation to maximise every legitimate claim.",
  },
  {
    q: "What happens if I miss the self assessment deadline?",
    a: "An automatic £100 penalty applies immediately. After 3 months, an additional £10 per day charge is added (up to £900). After 6 months, a further 5% of the tax due (or £300 if greater). After 12 months, another 5% surcharge. Interest also accrues on unpaid tax from 31 January. It's always cheaper to file on time — or to use us so you never have to worry.",
  },
  {
    q: "What income do I need to declare on my self assessment?",
    a: "All untaxed income must be declared: self-employment profits, rental income, dividends above the £500 dividend allowance (2024/25), savings interest above the personal savings allowance, capital gains above the annual exempt amount, foreign income, and employment income if you earn over £100,000 (as your personal allowance is tapered). We ensure every source is captured correctly.",
  },
  {
    q: "How much will my tax bill be?",
    a: "Your bill depends on your total taxable income after deductions and allowances. Self-employed individuals pay income tax (20%, 40%, or 45% depending on the band) plus Class 4 National Insurance (6% on profits £12,570–£50,270, 2% above). Your dedicated accountant will calculate your liability in advance so there are no surprises, and advise on legal ways to reduce it.",
  },
  {
    q: "Can you complete self assessment returns for previous tax years?",
    a: "Yes — we regularly help clients catch up on outstanding returns. HMRC can accept late returns going back several years, and sometimes there are refunds to be claimed from earlier years where expenses were missed. We'll review your position, file any outstanding returns, and negotiate with HMRC where needed. Get in touch and we'll sort it out.",
  },
  {
    q: "What if I owe tax from previous years?",
    a: "HMRC will typically add interest and potentially surcharges to overdue tax, but penalties for non-payment can be reduced or disputed in some circumstances. The key is to get compliant as quickly as possible. We can file your outstanding returns, calculate exactly what you owe (including any overpayments that may reduce the balance), and liaise with HMRC on your behalf.",
  },
];

// ── FAQ accordion item ────────────────────────────────────────
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

export default function SelfAssessmentPage() {
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
            {/* Left column */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <FileText size={15} />
                HMRC Filing
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Self Assessment Tax Return —{" "}
                <span className="text-gradient">Done For You</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Stop dreading the 31 January deadline. We prepare and file your
                self assessment tax return to HMRC — accurately, on time, and
                with every expense claimed that you&apos;re entitled to.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Whether you&apos;re self-employed, a landlord, a company
                director, or a high earner, your dedicated Clever Accounts
                accountant handles everything from start to finish.
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

            {/* Right column — glassmorphism panel */}
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">
                What&apos;s Included
              </p>
              <ul className="space-y-3 mb-7">
                {[
                  "Dedicated accountant assigned to you",
                  "Full SA100 return preparation & filing",
                  "All income sources covered",
                  "Maximum expense claims reviewed",
                  "Tax liability calculated in advance",
                  "Payments on account managed",
                  "HMRC correspondence handled",
                  "Deadline reminders & year-round support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 pt-5">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                  Starting from
                </p>
                <p className="text-3xl font-black text-white">
                  £32.50
                  <span className="text-white/50 text-base font-normal">
                    /month
                  </span>
                </p>
                <p className="text-white/50 text-sm mt-1">
                  No setup fees · No minimum contract
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER dark → white ─────────────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── WHO NEEDS TO FILE ─────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left copy */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Do You Need to File?
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight mb-6">
                Who Has to Complete{" "}
                <span className="text-gradient">Self Assessment?</span>
              </h2>
              <p className="text-text leading-relaxed mb-5">
                HMRC requires a self assessment tax return from anyone with
                income that isn&apos;t taxed at source through PAYE. This
                affects millions of UK taxpayers — and the consequences of
                missing the requirement can be expensive.
              </p>
              <p className="text-text leading-relaxed mb-5">
                You must register with HMRC by{" "}
                <strong className="text-dark">5 October</strong> following the
                end of the tax year in which you first need to file. If
                you&apos;re newly self-employed or have recently started
                receiving rental or investment income, don&apos;t delay.
              </p>
              <p className="text-text leading-relaxed mb-8">
                If you&apos;re not sure whether you need to file, speak to one
                of our accountants — there&apos;s no obligation, and we&apos;ll
                give you a straight answer.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all"
              >
                Check If You Need to File <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right grid of audience cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whoNeedsToFile.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-border rounded-2xl shadow-sm card-hover p-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-dark mb-1">{title}</h3>
                  <p className="text-text/80 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER white → surface ─────────────────────── */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="rgb(var(--color-surface, 240 249 255))"
          />
        </svg>
      </div>

      {/* ── WHAT'S INCLUDED ───────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              The Full Service
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight mb-4">
              Everything Handled{" "}
              <span className="text-gradient">For You</span>
            </h2>
            <p className="text-text max-w-2xl mx-auto">
              Self assessment isn&apos;t just about filling in a form. Done
              properly, it means reviewing every income source, maximising
              legitimate expenses, calculating your liability accurately, and
              never missing a deadline. That&apos;s what we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatsIncluded.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-text/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER surface → dark ──────────────────────── */}
      <div className="bg-surface">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="#0F172A"
          />
        </svg>
      </div>

      {/* ── DEADLINES ─────────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Key Dates
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Self Assessment{" "}
              <span className="text-gradient">Deadlines</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Missing any of these dates results in automatic penalties — even
              if you owe no tax. With Clever Accounts, every deadline is managed
              for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {deadlines.map(({ date, label, desc, colour, badgeColour, icon: Icon }) => (
              <div
                key={date}
                className={`bg-white/[0.05] border-t-4 ${colour} rounded-2xl p-6 border border-white/10`}
              >
                <div
                  className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs font-semibold mb-4 ${badgeColour}`}
                >
                  <Icon size={13} />
                  {date}
                </div>
                <h3 className="font-bold text-white mb-2">{label}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Penalty warning banner */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex gap-4 items-start">
            <AlertTriangle
              size={24}
              className="text-red-400 shrink-0 mt-0.5"
            />
            <div>
              <p className="font-bold text-white mb-1">
                Penalties Are Automatic — and They Escalate Fast
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                A <strong className="text-white">£100 immediate penalty</strong>{" "}
                applies the moment you miss the 31 January deadline, even if you
                owe nothing. After 3 months: £10/day (up to £900). After 6
                months: 5% of tax owed (minimum £300). After 12 months: another
                5% surcharge. Interest accrues throughout on any unpaid balance.
                The simplest solution is never to miss it — which is exactly
                what we ensure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER dark → white ─────────────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── COMMON MISTAKES ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Avoid These Pitfalls
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight mb-4">
              Common Self Assessment{" "}
              <span className="text-gradient">Mistakes</span>
            </h2>
            <p className="text-text max-w-2xl mx-auto">
              These errors cost taxpayers money every year — in penalties, in
              overpaid tax, and in unnecessary HMRC investigations. A dedicated
              accountant eliminates every one of them.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonMistakes.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-500 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-text/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Client Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight">
              What Our Clients{" "}
              <span className="text-gradient">Say</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, rating }) => (
              <div
                key={name}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-secondary fill-secondary"
                    />
                  ))}
                </div>
                <p className="text-text leading-relaxed mb-6 flex-1">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-dark">{name}</p>
                  <p className="text-text/60 text-sm">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER surface → dark ──────────────────────── */}
      <div className="bg-surface">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="#0F172A"
          />
        </svg>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Your Questions Answered
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Self Assessment{" "}
              <span className="text-gradient">FAQs</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER dark → orange CTA ───────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="rgb(234 88 12)"
          />
        </svg>
      </div>

      {/* ── ORANGE GRADIENT CTA ───────────────────────────────── */}
      <section className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
            Get Started Today
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
            Never Miss a Tax Deadline Again
          </h2>
          <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Join thousands of sole traders, landlords, and individuals who let
            Clever Accounts handle their self assessment. From just £32.50/month
            — no setup fees, no minimum contract.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/25 transition-all border border-white/30"
            >
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER orange → surface ────────────────────── */}
      <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600">
        <svg viewBox="0 0 1440 40" className="w-full block" aria-hidden="true">
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="rgb(var(--color-surface, 240 249 255))"
          />
        </svg>
      </div>

      {/* ── BOTTOM SURFACE CTA ───────────────────────────────── */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-dark mb-1">
                Already have outstanding returns?
              </h3>
              <p className="text-text">
                We can catch you up on previous years and get you fully
                compliant. No judgement — just solutions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all whitespace-nowrap"
              >
                Get Caught Up <ArrowRight size={18} />
              </Link>
              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 border border-border text-text font-semibold px-6 py-3 rounded-xl hover:bg-surface transition-all whitespace-nowrap"
              >
                <Phone size={18} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
