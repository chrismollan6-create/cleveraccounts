"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Users,
  FileText,
  Receipt,
  Calculator,
  Calendar,
  PiggyBank,
  ShieldCheck,
  MessageCircle,
  Zap,
  AlertTriangle,
  BadgeCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";

// ── What's included ──────────────────────────────────────────
const included = [
  {
    icon: Calendar,
    title: "Monthly payroll processing",
    desc: "Salaries, dividends timing, bonuses and deductions — calculated and posted on the same date each month so your team is paid on time, every time.",
  },
  {
    icon: FileText,
    title: "RTI submissions to HMRC",
    desc: "Full Payment Submission (FPS) every pay run and Employer Payment Summary (EPS) where required — filed in real time as HMRC requires.",
  },
  {
    icon: Receipt,
    title: "Payslips for directors & staff",
    desc: "Branded, compliant digital payslips delivered to every employee. Available in FreeAgent and via email — no paper, no fuss.",
  },
  {
    icon: BadgeCheck,
    title: "P60s & P11Ds at year-end",
    desc: "Annual certificates of pay for every employee and benefits-in-kind reporting for directors — all prepared, filed, and distributed by us.",
  },
  {
    icon: PiggyBank,
    title: "Pension auto-enrolment",
    desc: "Assessment, enrolment, ongoing contributions and re-enrolment every three years — fully managed in line with The Pensions Regulator's rules.",
  },
  {
    icon: Calculator,
    title: "PAYE & NI calculations",
    desc: "Correct tax codes, NI categories, student loan deductions, attachment of earnings orders — handled correctly so HMRC isn't writing to you.",
  },
  {
    icon: Users,
    title: "Director & employee changes",
    desc: "New starters, leavers, P45s, salary changes, address updates — all reflected in the next pay run with no admin from your side.",
  },
  {
    icon: MessageCircle,
    title: "Unlimited payroll advice",
    desc: "Ring your accountant whenever you have a question. Optimal director salary, dividend timing, statutory pay, redundancy — no per-question charges.",
  },
];

// ── Why it matters ───────────────────────────────────────────
const whyItMatters = [
  {
    icon: AlertTriangle,
    title: "RTI penalties stack up fast",
    desc: "HMRC fines start at £100 per month for late Full Payment Submissions and escalate by employer size. One missed deadline can cost more than a year of accountancy fees.",
  },
  {
    icon: Clock,
    title: "Auto-enrolment isn't optional",
    desc: "If you employ anyone — including a sole director — you're a pension scheme employer. The Pensions Regulator can fine non-compliance up to £10,000 a day for serious breaches.",
  },
  {
    icon: TrendingUp,
    title: "Director salary affects your tax bill",
    desc: "The right director salary balances NI threshold, Corporation Tax relief, and state pension qualifying years. Getting it wrong typically costs £500–£2,000 a year in unnecessary tax.",
  },
  {
    icon: ShieldCheck,
    title: "Mistakes are visible to employees",
    desc: "Wrong tax code, missed pension contribution, late payslip — employees notice instantly. Payroll errors damage trust faster than almost any other admin mistake.",
  },
];

// ── FAQ ──────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is payroll included in my package?",
    a: "Yes — for our Limited Company package (from £104.50/month), payroll for directors and one employee is included as standard. Additional employees are added at a small per-employee monthly cost. Sole traders without employees don't need payroll, so it's only added on if you take on staff.",
  },
  {
    q: "What's the optimal salary for a limited company director in 2025/26?",
    a: "Most directors with no other employment income should take a salary at the secondary NI threshold (£9,100/year for 2025/26 if you're the only employee, or up to £12,570 if you can claim Employment Allowance with at least one other employee). Above that, dividends are usually more tax-efficient. We assess your specific situation and recommend the right number — and we update it each tax year.",
  },
  {
    q: "Do I need to run payroll if I only pay myself dividends?",
    a: "If you're a sole director taking only dividends with no salary, you technically don't need a PAYE scheme — but most directors take a small salary alongside dividends to use the personal allowance, NI threshold, and maintain a state pension qualifying year. Even £1 of salary requires a registered PAYE scheme and monthly RTI submissions to HMRC.",
  },
  {
    q: "How does pension auto-enrolment work for a small company?",
    a: "Every UK employer must assess employees against the auto-enrolment criteria each pay period and enrol qualifying staff into a workplace pension scheme. Even a single-director company is an 'employer' for these rules, though sole directors are usually exempt. We handle assessment, enrolment, contributions, declarations of compliance, and the three-yearly re-enrolment exercise.",
  },
  {
    q: "Can I pay myself a bonus or one-off?",
    a: "Yes — bonuses can be processed through payroll any time. They're treated as salary for tax purposes (income tax + employee/employer NI), so they're usually less efficient than dividends. We model the tax impact before processing so you know exactly what it costs.",
  },
  {
    q: "What happens if I take on my first employee?",
    a: "Tell us before the first day. We'll register the PAYE scheme if you don't already have one, set up the employee's tax code and pension assessment, draft a basic employment contract template if you need one, and run the first pay run on schedule. Auto-enrolment duties begin from day one of employment.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-dark hover:bg-surface transition-colors"
      >
        <span className="flex items-center gap-3">
          <HelpCircle size={18} className="text-primary shrink-0" />
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 ml-3 text-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 text-sm text-text-light leading-relaxed border-t border-border ml-9">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PayrollServicesPage() {
  const brand = useBrand();
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
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Users size={15} />
                Payroll, RTI, P60s & pensions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
                Payroll, <span className="text-gradient">handled</span>.
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
                Monthly payroll processing, RTI submissions, payslips, P60s and
                pension auto-enrolment — all run by your dedicated accountant
                so HMRC and your team are happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <a
                  href={`tel:${brand.freephone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
                >
                  <Phone size={20} /> {brand.freephone}
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-white/60">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary-light" /> Included in Limited Company package</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary-light" /> No setup fee</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary-light" /> Unlimited advice</span>
              </div>
            </div>

            {/* Right — summary card */}
            <div className="bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/20 text-primary-light flex items-center justify-center">
                  <Zap size={22} />
                </div>
                <h2 className="text-white font-black text-xl">What you get</h2>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Pay runs per year", value: "12 monthly" },
                  { label: "RTI submissions", value: "Real-time, every run" },
                  { label: "Payslips", value: "Branded, digital, FreeAgent" },
                  { label: "P60 & P11D filings", value: "Year-end, included" },
                  { label: "Pension auto-enrolment", value: "Fully managed" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-white/70 text-sm">{label}</span>
                    <span className="text-white font-semibold text-sm text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-5 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <BadgeCheck size={18} className="text-secondary shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs leading-relaxed">
                    Included in our Limited Company package from £104.50/month.
                    Extra employees from £5/month each.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider — dark to white */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 md:h-16 block"
          >
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              All Included
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 leading-tight">
              Every part of UK payroll — <span className="text-gradient">all in one fee</span>
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Payroll has a lot of moving parts. We handle every one of them so you
              don&apos;t have to keep on top of HMRC deadlines, pension rules, or
              tax-code changes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {included.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface rounded-2xl p-6 border border-border card-hover">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-black text-dark text-sm mb-2">{title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ───────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Why It Matters
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 leading-tight">
              Payroll mistakes are the <span className="text-gradient">expensive</span> kind
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              HMRC, The Pensions Regulator, and your own employees all see payroll
              errors immediately. Getting it right matters — and getting it
              optimised saves real money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whyItMatters.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-dark mb-2">{title}</h3>
                    <p className="text-text-light text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 leading-tight">
              Set up once. <span className="text-gradient">Run forever.</span>
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              From your first pay run to year-end P60s, here&apos;s how payroll
              works at {brand.name}.
            </p>
          </div>

          <div className="md:grid md:grid-cols-[7rem_1fr] md:gap-x-6 gap-y-6 flex flex-col relative">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-5 bottom-5 left-[3.5rem] -translate-x-1/2 w-0.5 bg-primary/20"
            />
            {[
              {
                step: "Day 1",
                title: "PAYE scheme set up",
                desc: "If you don't already have a PAYE scheme registered with HMRC, we register one for you. If you do, we get authorised on your behalf via the agent portal.",
              },
              {
                step: "Day 2–7",
                title: "Employees onboarded",
                desc: "We add directors and staff to the payroll, set tax codes from P45s or starter checklists, configure pension scheme details, and confirm pay dates.",
              },
              {
                step: "Monthly",
                title: "Pay run + RTI",
                desc: "Same date each month: payslips generated, Full Payment Submission filed to HMRC in real time, pension contributions calculated and deducted.",
              },
              {
                step: "April",
                title: "Tax year-end",
                desc: "Final FPS, P60s issued to every employee, P11D benefits reporting for directors, new tax codes applied automatically for the new year.",
              },
              {
                step: "Ongoing",
                title: "Changes handled",
                desc: "New starters, leavers, salary changes, statutory pay (sick, maternity, paternity), redundancy — all processed without you chasing forms.",
              },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="contents">
                <div className="relative z-10 flex md:justify-center items-start pt-1">
                  <div className="w-[104px] h-10 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center text-center leading-tight px-2 shadow-sm ring-4 ring-white">
                    {step}
                  </div>
                </div>
                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <div className="font-bold text-dark mb-1">{title}</div>
                  <div className="text-text-light text-sm leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 leading-tight">
              Payroll <span className="text-gradient">FAQs</span>
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Quick answers to the questions our payroll clients ask most.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
            Payroll Sorted
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
            Stop wrestling with RTI deadlines and tax codes
          </h2>
          <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Payroll is included in our Limited Company package from £104.50/month —
            including your dedicated accountant, FreeAgent, and unlimited advice.
            No setup fee, no minimum contract.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
            >
              Get Started Today <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${brand.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/30"
            >
              <Phone size={20} /> {brand.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
