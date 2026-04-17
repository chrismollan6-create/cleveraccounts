"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Phone, ChevronDown, HelpCircle,
  AlertCircle, XCircle, UserCheck, FileText, Shield, Clock, MessageSquare, Star,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const dynamic = "force-static";

const warningSignsStay = [
  "Emails answered the same or next business day, consistently",
  "Proactive contact ahead of key deadlines — you don't have to chase",
  "They know your business without you needing to remind them each time",
  "Named, dedicated contact — not a different person every call",
  "No surprise invoices for work you thought was included",
  "Software that gives you real-time visibility of your tax position",
];

const warningSignsSwitch = [
  "Regularly waiting more than 2 working days for a reply",
  "Errors on returns that you spotted yourself",
  "No advice beyond what you specifically ask for",
  "Can't tell you your approximate tax liability off the top of their head",
  "Unexpected charges for things like mortgage reference letters or VAT queries",
  "Missed filing deadlines or penalty notices",
];

const switchingSteps = [
  {
    n: "1",
    icon: UserCheck,
    title: "Sign up with your new accountant",
    body: "Do this first. Your new firm manages the rest of the transition on your behalf — you don't need to do anything with your old accountant first.",
  },
  {
    n: "2",
    icon: MessageSquare,
    title: "Notify your old accountant",
    body: "A brief email is sufficient. Something like: 'I am moving my accountancy to [new firm] with effect from [date]. Please direct all professional clearance correspondence to [email].' You are not obliged to give a reason.",
  },
  {
    n: "3",
    icon: Shield,
    title: "Professional clearance letter",
    body: "Your new accountant writes formally to your old one, requesting confirmation that there are no ethical issues and asking for the information needed to continue the engagement. Your old accountant is required to respond under ICAEW/ACCA professional ethics rules.",
  },
  {
    n: "4",
    icon: FileText,
    title: "Transfer of records",
    body: "Your previous year's accounts, CT600, Self Assessment, current year bookkeeping, payroll history, and VAT returns. Your new accountant collects these — most can be exported from FreeAgent in a few clicks.",
  },
  {
    n: "5",
    icon: Clock,
    title: "HMRC authorisation (64-8)",
    body: "Your new accountant will ask you to complete a 64-8 form (or the online equivalent) authorising HMRC to deal with them directly. This is straightforward and your new firm will guide you through it.",
  },
];

const concerns = [
  {
    concern: "I'm worried about losing my data",
    answer: "Your financial records belong to you — your old accountant must provide them. Most is exported directly from your accounting software (FreeAgent, Xero, QuickBooks). Your new accountant will collect everything via the professional clearance process.",
  },
  {
    concern: "I don't want to switch mid-year — should I wait?",
    answer: "No. Mid-year switches are completely routine and have no effect on your tax position or filing deadlines. Waiting until year-end means tolerating poor service for longer than you need to — and can sometimes create a crunch if your old accountant drags their feet on handover.",
  },
  {
    concern: "My old accountant knows a lot about my business",
    answer: "They do — but all of that knowledge is captured in your accounts, tax returns, and records, which transfer to your new firm. A good new accountant will review your full history before your first conversation. What you gain is someone who applies that knowledge proactively, rather than reactively.",
  },
  {
    concern: "I owe my old accountant money",
    answer: "Settle any outstanding invoices first where possible. Your old accountant can legally withhold some records until fees are paid (a 'lien'). If you dispute the amount, your new accountant can advise — but unpaid fees are the most common cause of delayed handovers.",
  },
  {
    concern: "Will it be disruptive during a busy period?",
    answer: "The switch itself requires very little from you — mostly signing the HMRC 64-8 form and exporting your bookkeeping records. The professional clearance process runs in the background. Most clients find it far less disruptive than they expected.",
  },
];

const faqs = [
  {
    q: "Can I switch accountants mid-year?",
    a: "Yes. You can switch at any point in the tax year — you do not need to wait until your year-end or the start of a new financial year. Your new accountant picks up exactly where your old one left off, with no gap in compliance or support.",
  },
  {
    q: "How long does switching accountants take?",
    a: "Most switches are complete within 3–6 weeks. The main timeline is governed by the professional clearance process — your old accountant is required to respond within a reasonable timeframe. The switch itself has no effect on your tax position or filing deadlines.",
  },
  {
    q: "Is there a cost to switch accountants?",
    a: "Switching to Clever Accounts is completely free — no setup fees, no transfer charges. Your old accountant may charge for any outstanding work not yet billed, but a new firm should never charge you to take you on.",
  },
  {
    q: "What is professional clearance and why does it matter?",
    a: "Professional clearance is a formal process governed by ICAEW and ACCA ethics rules. Your new accountant writes to your previous firm requesting confirmation that there are no outstanding ethical issues and asking for information needed to continue the engagement. Your old accountant is required to respond — this protects you and ensures continuity of records.",
  },
  {
    q: "Can my old accountant refuse to hand over my records?",
    a: "Your financial records belong to you and must be provided. Your old accountant can legitimately withhold working papers they created, and may not release records until outstanding fees are settled. If they're unresponsive, your new firm can escalate through professional channels.",
  },
  {
    q: "What are the signs I should switch accountants?",
    a: "Common warning signs: slow or no response to emails, errors on returns that you spotted yourself, no proactive advice, surprise invoices for work you thought was included, missed deadlines, and not knowing your tax position without checking.",
  },
  {
    q: "What records do I need to transfer?",
    a: "Your new accountant collects these via professional clearance, but having ready: your previous year's accounts and CT600, last Self Assessment return, current year bookkeeping export, payroll history for the current year, and VAT returns filed so far. Most of this comes out of FreeAgent in a few clicks.",
  },
  {
    q: "Will switching affect my tax position?",
    a: "No. Switching is purely administrative. Your tax liabilities, filing deadlines, and HMRC obligations are unchanged. Your new accountant simply takes over responsibility for managing them going forward.",
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

export default function SwitchingAccountantsPage() {
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
              Updated 17 April 2026 · 10 min read
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              How to Switch{" "}
              <span className="text-gradient">Accountants</span>{" "}
              UK (2026 Guide)
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl">
              Switching is simpler than you think. This guide covers when to switch, how the professional
              clearance process works, common concerns — and how to make sure your new firm is actually better than your old one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
              >
                Switch to Clever Accounts <ArrowRight size={22} />
              </Link>
              <a
                href="#how-to-switch"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-5 rounded-2xl text-lg hover:bg-white/10 transition-all"
              >
                See the steps
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> No setup fees</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> Switch at any time of year</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary" /> We handle the handover</span>
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
              "You can switch accountants at any point in the year — no need to wait until year-end.",
              "Your new accountant handles everything: the professional clearance letter, record transfer, and HMRC authorisation.",
              "Switching to Clever Accounts is free — no setup fees, no transfer charges.",
              "Most switches are complete within 3–6 weeks with no disruption to your compliance position.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-text text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Warning signs ─────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Should you <span className="text-gradient">switch</span>?
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              A good accountant should make your life easier, not add to your admin. Here&apos;s how to tell the difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 size={20} className="text-success" />
                <h3 className="font-bold text-dark">Signs your accountant is working well</h3>
              </div>
              <ul className="space-y-3">
                {warningSignsStay.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={15} className="text-success shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <XCircle size={20} className="text-red-500" />
                <h3 className="font-bold text-dark">Signs it&apos;s time to switch</h3>
              </div>
              <ul className="space-y-3">
                {warningSignsSwitch.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to switch ─────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24" id="how-to-switch">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              The <span className="text-gradient-teal">step-by-step</span> switching process
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              The whole process typically takes 3–6 weeks and requires very little from you.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {switchingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="flex gap-5 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-11 h-11 rounded-full bg-primary text-white font-black text-base flex items-center justify-center shadow-lg">
                      {step.n}
                    </div>
                    {step.n !== "5" && <div className="w-0.5 h-6 bg-primary/20 mt-2" />}
                  </div>
                  <div className="bg-white rounded-2xl border border-border p-6 flex-1 card-hover">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </div>
                      <h3 className="font-bold text-dark">{step.title}</h3>
                    </div>
                    <p className="text-text-light text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="max-w-3xl mx-auto mt-8 bg-dark rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm mb-1">What if my old accountant drags their feet?</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  If your old accountant fails to respond to a professional clearance request within a reasonable
                  time (typically 4 weeks), your new accountant can escalate through ICAEW or ACCA professional
                  conduct channels. HMRC authorisation can also proceed independently — your new firm can begin
                  working with HMRC directly once the 64-8 is in place, without waiting for full record transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Common concerns ───────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Common concerns <span className="text-gradient-teal">answered</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Most people who delay switching do so because of worries that turn out to be unfounded.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {concerns.map((c, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border p-6 card-hover">
                <h3 className="font-bold text-dark mb-2 text-sm">&ldquo;{c.concern}&rdquo;</h3>
                <p className="text-text-light text-sm leading-relaxed">{c.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What to look for ──────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What to look for in your <span className="text-gradient">next accountant</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Don&apos;t just escape a bad situation — make sure the next one is genuinely better.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: UserCheck, title: "Named, dedicated accountant", desc: "A specific person assigned to your account who knows your situation — not a call centre or ticket queue." },
              { icon: MessageSquare, title: "Clear response time commitment", desc: "Ask directly: 'If I email on a Tuesday morning, when will I hear back?' Same or next business day is the standard to hold them to." },
              { icon: FileText, title: "Everything included, in writing", desc: "Year-end accounts, CT600, VAT, payroll, Self Assessment, software — confirm exactly what's in the monthly fee and what triggers an additional charge." },
              { icon: Shield, title: "Specialist in your business type", desc: "A contractor accountant, a landlord accountant, and a small business accountant are different skills. Make sure they work with clients like you regularly." },
              { icon: Star, title: "Strong, recent reviews", desc: "Trustpilot reviews are the most reliable signal. Look for consistent patterns in recent reviews, not just the headline score — and check how they respond to negative ones." },
              { icon: Clock, title: "No minimum contract", desc: "A firm confident in their service doesn't need to lock you in. No minimum contract means you stay because you want to — not because leaving is painful." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-border p-6 card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-dark text-sm mb-2">{title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{desc}</p>
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
            Ready to make the switch?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            We handle everything — professional clearance, record transfer, HMRC authorisation. No setup fees. No disruption. Just better accounting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-secondary-dark font-bold px-8 py-4 rounded-2xl text-lg hover:bg-orange-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Switch Now — Free <ArrowRight size={20} />
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
