"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  FileText,
  Monitor,
  Users,
  Zap,
  Award,
  HardHat,
  TrendingDown,
  RefreshCw,
  BadgeCheck,
  Clock,
  Star,
  ShieldCheck,
  Info,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── Timeline data ─────────────────────────────────────────────
const timeline = [
  {
    status: "live",
    label: "Live Now",
    date: "April 2019 → April 2022",
    title: "MTD for VAT",
    who: "All VAT-registered businesses (turnover above then below £85k threshold)",
    description:
      "MTD for VAT is fully mandated. Every VAT-registered business must keep digital records and file VAT returns using HMRC-recognised software. Paper VAT returns are no longer accepted. If you're VAT-registered and not yet using MTD-compatible software, you're already non-compliant.",
    affects: ["All VAT-registered businesses", "Sole traders above VAT threshold", "Limited companies", "Partnerships"],
    colour: "border-green-500",
    badgeColour: "bg-green-500/15 text-green-400 border-green-500/30",
    dotColour: "bg-green-500",
  },
  {
    status: "imminent",
    label: "April 2026",
    date: "6 April 2026",
    title: "MTD for Income Tax — £50,000+",
    who: "Self-employed individuals & landlords with combined income over £50,000",
    description:
      "From April 2026, sole traders and landlords with combined income from self-employment and property exceeding £50,000 must use MTD-compatible software to keep digital records and submit quarterly updates to HMRC. The annual self assessment tax return is replaced with four quarterly submissions plus a final declaration.",
    affects: ["Sole traders earning £50k+", "Landlords with rental income £50k+", "Those with combined self-employment + property income £50k+"],
    colour: "border-orange-500",
    badgeColour: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dotColour: "bg-orange-500",
  },
  {
    status: "upcoming",
    label: "April 2027",
    date: "6 April 2027",
    title: "MTD for Income Tax — £30,000+",
    who: "Self-employed individuals & landlords with combined income over £30,000",
    description:
      "MTD for ITSA extends to those earning over £30,000. This brings a significantly larger group of sole traders and landlords into the quarterly reporting regime. With Clever Accounts, you'll be prepared well in advance — FreeAgent handles all quarterly submissions automatically.",
    affects: ["Sole traders earning £30k–£50k", "Smaller landlords with rental income", "Part-time self-employed with other income pushing total above £30k"],
    colour: "border-blue-500",
    badgeColour: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dotColour: "bg-blue-500",
  },
  {
    status: "future",
    label: "TBC",
    date: "To be confirmed",
    title: "MTD for Income Tax — Under £30,000",
    who: "Smaller sole traders and landlords — consultation ongoing",
    description:
      "HMRC has indicated MTD for ITSA will eventually extend to those earning below £30,000, but the timeline is subject to ongoing consultation. Partnerships and other business structures may also be brought in. We'll keep all clients informed as dates are confirmed.",
    affects: ["Smaller sole traders", "Micro-landlords", "Partnerships (timeline TBC)"],
    colour: "border-purple-500",
    badgeColour: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    dotColour: "bg-purple-500",
  },
  {
    status: "future",
    label: "Future",
    date: "To be confirmed",
    title: "MTD for Corporation Tax",
    who: "Limited companies",
    description:
      "HMRC has confirmed MTD will be extended to corporation tax, though the exact timeline is still under consultation. Limited companies will need to keep digital records and submit quarterly updates for corporation tax purposes. FreeAgent is expected to be fully compliant ahead of the deadline.",
    affects: ["All limited companies", "Directors with complex tax positions"],
    colour: "border-gray-500",
    badgeColour: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    dotColour: "bg-gray-500",
  },
];

// ── Quarterly filing what it means ───────────────────────────
const quarterlySteps = [
  { period: "Q1", dates: "6 Apr – 5 Jul", deadline: "5 Aug", label: "Quarter 1" },
  { period: "Q2", dates: "6 Jul – 5 Oct", deadline: "5 Nov", label: "Quarter 2" },
  { period: "Q3", dates: "6 Oct – 5 Jan", deadline: "5 Feb", label: "Quarter 3" },
  { period: "Q4", dates: "6 Jan – 5 Apr", deadline: "5 May", label: "Quarter 4" },
];

// ── How we help ───────────────────────────────────────────────
const howWeHelp = [
  {
    icon: Monitor,
    title: "Free FreeAgent Software",
    desc: "FreeAgent is HMRC-recognised MTD-compatible software, included free with every Clever Accounts package. It keeps your digital records automatically and submits your quarterly updates directly to HMRC — no bridging software, no manual uploads.",
  },
  {
    icon: Users,
    title: "Dedicated Accountant",
    desc: "Your accountant manages your MTD compliance end-to-end. They'll review your quarterly figures before submission, flag anything unusual, and make sure your final declaration is accurate and optimised for tax.",
  },
  {
    icon: Calendar,
    title: "Deadline Management",
    desc: "We track every quarterly submission deadline and your final declaration. You'll never receive a late filing penalty because we missed a date — that's our job, not yours.",
  },
  {
    icon: TrendingDown,
    title: "Quarterly Tax Estimates",
    desc: "FreeAgent calculates your estimated tax liability in real time as you record income and expenses. No year-end shock — you'll know what you owe each quarter and can plan accordingly.",
  },
  {
    icon: RefreshCw,
    title: "Seamless Record-Keeping",
    desc: "Open banking pulls transactions directly from your bank into FreeAgent and categorises them automatically. Snap receipts on your phone. Mileage tracked in the app. Digital records kept without you thinking about it.",
  },
  {
    icon: BadgeCheck,
    title: "Migration & Set-Up",
    desc: "If you're currently doing self assessment manually or through a different accountant, we handle the full migration — transferring your records, setting up FreeAgent, and getting you compliant from day one.",
  },
];

// ── CIS section ───────────────────────────────────────────────
const cisPoints = [
  "CIS subcontractors are classed as self-employed — MTD for ITSA applies to you if your income exceeds the threshold",
  "CIS deductions suffer at source (20% standard or 30% unverified) — quarterly MTD submissions let you track your deductions and tax position in real time",
  "At year end, CIS subcontractors can reclaim overpaid tax — with FreeAgent tracking all deductions, this process is straightforward",
  "Gross payment status applications benefit from clean digital records — MTD compliance supports your case",
  "CIS contractors must also ensure their subcontractors are MTD-ready where applicable",
];

// ── FAQ ───────────────────────────────────────────────────────
const faqs = [
  {
    q: "What is Making Tax Digital?",
    a: "Making Tax Digital (MTD) is HMRC's programme to move the UK tax system to a fully digital basis. Instead of filing one annual tax return, businesses must keep digital records using approved software and submit updates to HMRC on a more frequent basis. MTD for VAT is already live. MTD for Income Tax (ITSA) starts April 2026 for those earning over £50,000.",
  },
  {
    q: "Does MTD apply to me as a sole trader?",
    a: "If your total income from self-employment and/or property exceeds £50,000 in a tax year, MTD for ITSA applies from April 2026. If it's between £30,000 and £50,000, it applies from April 2027. Below £30,000, the timeline is still being confirmed. Use your 2024/25 tax year income to assess whether you'll be caught from April 2026.",
  },
  {
    q: "What does 'quarterly reporting' actually mean?",
    a: "Instead of one annual self assessment return, you'll submit four quarterly updates to HMRC throughout the year — roughly every three months — showing your income and expenses. You then submit a final declaration after the tax year ends. Your dedicated accountant and FreeAgent handle all of this automatically.",
  },
  {
    q: "What happens if I'm not MTD-compliant by the deadline?",
    a: "HMRC will issue penalties for non-compliance. This includes penalties for not keeping digital records, not submitting quarterly updates, and for late submissions. The penalty system has been revised to a points-based approach — accumulate enough points and financial penalties follow. It's important to be set up ahead of the deadline.",
  },
  {
    q: "Does MTD apply to CIS subcontractors?",
    a: "Yes — CIS subcontractors are self-employed for tax purposes, so MTD for ITSA applies if their income meets the threshold. CIS deductions (suffered at source from contractors) will be tracked within your quarterly submissions, making year-end reclaims much simpler.",
  },
  {
    q: "Will I still need to do a self assessment tax return?",
    a: "The traditional annual self assessment tax return is replaced by four quarterly updates plus a final declaration under MTD for ITSA. The final declaration covers the same ground as a self assessment return but is simpler because your records have been maintained digitally throughout the year.",
  },
  {
    q: "Is FreeAgent really MTD-compliant?",
    a: "Yes — FreeAgent is an HMRC-recognised MTD-compatible software for both VAT and Income Tax. It submits directly to HMRC with no bridging software needed. We're a FreeAgent Platinum Partner and it's included free with every Clever Accounts package.",
  },
  {
    q: "I'm currently doing my own self assessment — what do I need to change?",
    a: "If you're in scope for MTD for ITSA, you'll need MTD-compatible software and to register for MTD with HMRC by your start date. We handle all of this as part of onboarding — set up your FreeAgent account, register you for MTD, and manage your quarterly submissions going forward.",
  },
  {
    q: "What if my income fluctuates and I might go above or below the threshold?",
    a: "The threshold is assessed based on your income in the previous tax year. If you go above the threshold in one year, you enter MTD and remain in it — you can't opt out if income later drops below the threshold, though HMRC has indicated some flexibility for exceptional circumstances.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white">{q}</span>
        {open
          ? <ChevronUp size={20} className="text-primary-light shrink-0" />
          : <ChevronDown size={20} className="text-white/50 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">{a}</div>
      )}
    </div>
  );
}

export default function MakingTaxDigitalPage() {
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
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <AlertTriangle size={15} />
                MTD for Income Tax starts April 2026
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Making Tax Digital —<br />
                <span className="text-gradient">What You Need to Know</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-6">
                HMRC is replacing the annual self assessment with quarterly digital reporting. It's not optional — and the deadlines are closer than most people think.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Clever Accounts gets you MTD-ready from day one. Free FreeAgent software included. Dedicated accountant managing every submission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
                  Get MTD Ready <ArrowRight size={20} />
                </Link>
                <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
                  <Phone size={20} /> {COMPANY.freephone}
                </a>
              </div>
            </div>

            {/* Status panel */}
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">MTD Status at a Glance</p>
              <div className="space-y-4">
                {[
                  { dot: "bg-green-500", label: "MTD for VAT", status: "Live — mandatory now", statusCol: "text-green-400" },
                  { dot: "bg-orange-500", label: "MTD for ITSA £50k+", status: "April 2026", statusCol: "text-orange-400" },
                  { dot: "bg-blue-500", label: "MTD for ITSA £30k+", status: "April 2027", statusCol: "text-blue-400" },
                  { dot: "bg-purple-500", label: "MTD for ITSA under £30k", status: "TBC", statusCol: "text-purple-400" },
                  { dot: "bg-gray-500", label: "MTD for Corporation Tax", status: "Future — TBC", statusCol: "text-gray-400" },
                ].map(({ dot, label, status, statusCol }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
                    <span className="text-white/80 text-sm flex-1">{label}</span>
                    <span className={`text-xs font-semibold ${statusCol}`}>{status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <Award size={18} className="text-secondary shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs leading-relaxed">
                    FreeAgent is HMRC-recognised MTD-compatible software — included free with every Clever Accounts package
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── WHAT IS MTD ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">The Basics</p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                What is Making Tax Digital?
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                Making Tax Digital (MTD) is HMRC's multi-year programme to digitise the UK tax system. The core idea is simple: instead of filing everything in one annual return, businesses must keep digital records throughout the year and report to HMRC more frequently using approved software.
              </p>
              <p className="text-text-light leading-relaxed mb-5">
                For most sole traders, this means replacing the traditional self assessment tax return with <strong className="text-dark">four quarterly updates</strong> plus a <strong className="text-dark">final declaration</strong> at year end. The quarterly updates summarise your income and expenses for each three-month period — HMRC can then see your tax position in real time rather than waiting until January.
              </p>
              <p className="text-text-light leading-relaxed">
                The goal, according to HMRC, is to reduce errors, make tax easier to manage, and help businesses avoid unexpected year-end tax bills. In practice, it means you need HMRC-approved software and — ideally — a good accountant to manage it.
              </p>
            </div>

            <div className="space-y-4">
              {/* Old vs New */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={18} className="text-red-500" />
                  <span className="font-bold text-dark text-sm">The Old Way — Annual Self Assessment</span>
                </div>
                <ul className="space-y-2">
                  {[
                    "One annual return, filed by 31 January",
                    "Entire year's records compiled at year end",
                    "Easy to forget expenses or miss deductions",
                    "Year-end tax bill is often a surprise",
                    "Penalties for late filing by 31 January deadline",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-red-800">
                      <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="font-bold text-dark text-sm">The New Way — MTD Quarterly Reporting</span>
                </div>
                <ul className="space-y-2">
                  {[
                    "Four quarterly updates + final declaration",
                    "Digital records kept continuously throughout year",
                    "Real-time tax estimate — no year-end surprises",
                    "Easier to keep on top of expenses",
                    "HMRC-approved software handles submissions automatically",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-green-800">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-dark leading-relaxed">
                  MTD for VAT is already mandatory. MTD for Income Tax is the next major wave — affecting most sole traders and landlords from April 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUARTERLY WHAT IT MEANS ──────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Quarterly Reporting</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Four Updates a Year — Here's What That Looks Like
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Under MTD for ITSA, your tax year is split into four quarters. Each quarter you submit a summary of income and expenses. At the end of the year, a final declaration confirms everything.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quarterlySteps.map(({ period, dates, deadline, label }) => (
              <div key={period} className="bg-white border border-border rounded-2xl p-5 text-center shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-black text-lg flex items-center justify-center mx-auto mb-3">
                  {period}
                </div>
                <div className="font-bold text-dark text-sm mb-1">{label}</div>
                <div className="text-text-light text-xs mb-3">{dates}</div>
                <div className="text-xs font-semibold text-secondary">
                  Due: {deadline}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 flex gap-4 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <div className="font-bold text-dark mb-1">Plus a Final Declaration</div>
              <p className="text-text-light text-sm leading-relaxed">
                After the fourth quarter, you submit a final declaration (replacing the old SA return) by <strong className="text-dark">31 January</strong>. This confirms your total income, claims any allowances or reliefs, and finalises your tax liability for the year. With FreeAgent and your accountant managing the quarterly submissions, the final declaration becomes a formality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL TIMELINE ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-primary/15 blur-3xl animate-blob" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">Deadlines</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              The Full MTD Timeline
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              MTD is being rolled out in stages. Here's the full picture — what's already live, what's coming, and when.
            </p>
          </div>

          <div className="space-y-6">
            {timeline.map(({ status, label, date, title, who, description, affects, colour, badgeColour, dotColour }) => (
              <div key={title} className={`bg-white/[0.05] backdrop-blur-sm border-l-4 ${colour} border border-white/10 rounded-2xl p-7`}>
                <div className="flex flex-wrap items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${dotColour} shrink-0`} />
                    <span className={`text-xs font-bold uppercase tracking-widest border rounded-full px-3 py-1 ${badgeColour}`}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50 text-sm">
                    <Calendar size={14} />
                    {date}
                  </div>
                </div>
                <h3 className="text-white font-black text-xl mb-2">{title}</h3>
                <p className="text-primary-light text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Users size={14} />
                  {who}
                </p>
                <p className="text-white/65 text-sm leading-relaxed mb-4">{description}</p>
                <div className="flex flex-wrap gap-2">
                  {affects.map((a) => (
                    <span key={a} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full border border-white/10">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── HOW WE HELP ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Our Approach</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              How Clever Accounts Gets You<br />MTD-Ready
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              We don't just tell you about MTD — we handle it for you. Here's exactly what you get.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howWeHelp.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* FreeAgent Platinum callout */}
          <div className="mt-10 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-7 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0">
              <Award size={32} className="text-secondary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="font-black text-dark text-lg mb-1">FreeAgent Platinum Partner</div>
              <p className="text-text-light text-sm leading-relaxed">
                We're one of FreeAgent's highest-tier partners. FreeAgent is HMRC-recognised for MTD for VAT and MTD for Income Tax — and it's <strong className="text-dark">included free</strong> with every Clever Accounts package. No extra cost, no bridging software, no manual uploads.
              </p>
            </div>
            <Link href="/our-services/accounting-software" className="shrink-0 inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all whitespace-nowrap">
              Learn More <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CIS SECTION ──────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-bold mb-5">
                <HardHat size={16} />
                CIS / Construction
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                MTD for CIS<br />Subcontractors
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                If you work in construction under the Construction Industry Scheme (CIS), you're classed as self-employed — which means MTD for ITSA applies to you just as it does to any other sole trader, once your income exceeds the threshold.
              </p>
              <p className="text-text-light leading-relaxed mb-6">
                CIS adds a layer of complexity that makes good digital record-keeping even more important. Your contractor deducts tax at source (20% standard rate, 30% if you're not registered), and you need to track those deductions carefully to reclaim any overpayment at year end.
              </p>
              <ul className="space-y-3">
                {cisPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-text">
                    <CheckCircle2 size={17} className="text-green-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingDown size={20} />
                  </div>
                  <div className="font-bold text-dark">CIS Deduction Tracking</div>
                </div>
                <p className="text-text-light text-sm leading-relaxed">
                  FreeAgent tracks your CIS deductions suffered automatically. Your quarterly submissions will include the correct deduction figures, making your final declaration — and any tax refund — quick and accurate.
                </p>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <RefreshCw size={20} />
                  </div>
                  <div className="font-bold text-dark">Year-End CIS Reclaim</div>
                </div>
                <p className="text-text-light text-sm leading-relaxed">
                  Most CIS subcontractors overpay tax during the year — contractors deduct at source but the actual tax owed is often less. With clean digital records through FreeAgent, your year-end reclaim is handled efficiently by your dedicated accountant.
                </p>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="font-bold text-dark">Gross Payment Status</div>
                </div>
                <p className="text-text-light text-sm leading-relaxed">
                  Applying for gross payment status (so you receive payments without deduction) requires demonstrating good tax compliance. MTD-compliant digital records strengthen your application and make the process straightforward.
                </p>
              </div>

              <Link href="/sign-up" className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-4 rounded-xl hover:bg-primary/90 transition-all text-sm">
                Get CIS + MTD Support <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DON'T WAIT CALLOUT ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Clock size={16} />
            April 2026 is closer than you think
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Don't Leave MTD<br />Until the Last Minute
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            Businesses that switch to digital record-keeping early are better prepared, less stressed, and in a stronger tax position. Get set up now and let FreeAgent do the heavy lifting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get MTD Ready Today <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              <Phone size={20} /> Talk to an Expert
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {["Free FreeAgent included", "Dedicated accountant", "No setup fee", "MTD-compliant from day one"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-white/60" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Real Clients</p>
            <h2 className="text-3xl font-black text-dark mb-4">MTD Made Simple</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Phil Dawson",
                role: "Self-Employed Sole Trader",
                quote: "I was dreading MTD. My accountant at Clever Accounts set everything up on FreeAgent, and now the quarterly submissions just happen automatically. I barely notice it.",
                rating: 5,
              },
              {
                name: "Reece Williams",
                role: "CIS Subcontractor",
                quote: "As a CIS subbbie I wasn't even sure if MTD applied to me. Clever Accounts explained everything, got me on FreeAgent, and now I actually get more of my CIS deductions back at year end because the records are so clean.",
                rating: 5,
              },
              {
                name: "Natalie Forbes",
                role: "Landlord & Sole Trader",
                quote: "I have income from both self-employment and property, which puts me over the £50k threshold. My accountant makes sure both sources are correctly recorded each quarter. No stress.",
                rating: 5,
              },
            ].map(({ name, role, quote, rating }) => (
              <div key={name} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => <Star key={i} size={16} className="text-secondary fill-secondary" />)}
                </div>
                <p className="text-text-light text-sm leading-relaxed mb-4 italic">"{quote}"</p>
                <div className="border-t border-border pt-4">
                  <div className="font-bold text-dark text-sm">{name}</div>
                  <div className="text-text-light text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">FAQ</p>
            <h2 className="text-3xl font-black text-white mb-4">MTD Questions Answered</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <section className="bg-surface py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark mb-4">Ready to get MTD sorted?</h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">
            Dedicated accountant, free FreeAgent software, full MTD compliance from day one. From £32.50/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-all shadow-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/80 transition-all border border-border shadow-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
