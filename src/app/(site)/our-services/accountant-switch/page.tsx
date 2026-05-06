"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Phone,
  Clock,
  ShieldCheck,
  Smile,
  ChevronDown,
  ChevronUp,
  Star,
  BadgeCheck,
  Zap,
  Users,
  FileText,
  TrendingDown,
  MessageCircle,
  Monitor,
  Award,
  AlertTriangle,
  RefreshCw,
  Building2,
  Laptop,
  HeartHandshake,
  CalendarClock,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

const faqs = [
  {
    q: "When is the right time to switch accountants?",
    a: "Any time of year — you don't have to wait until your year-end. Many of our new clients switch mid-year without any disruption. The best time to switch is as soon as you've decided you want better service. We'll handle the timing.",
  },
  {
    q: "Do I need to tell my old accountant I'm leaving?",
    a: "No — that's our job. Once you sign up, we send a professional disengagement letter to your previous accountant on your behalf and request your records. You don't have to have any awkward conversations.",
  },
  {
    q: "How long does the switch take?",
    a: "Typically 2–4 weeks from sign-up to fully transferred. We start providing your service immediately though — you're a client from day one, not after the transfer is complete.",
  },
  {
    q: "Will there be a gap in my accounting service?",
    a: "No. We begin work on your account from the moment you sign up. Any deadlines or tax obligations that fall during the transition are handled by us. There's no gap.",
  },
  {
    q: "What if my previous accountant delays sending my records?",
    a: "It happens occasionally. We chase on your behalf and apply professional pressure where needed. ICAEW and ACCA guidelines require accountants to transfer records promptly — if there's an unusual delay, we'll advise you on next steps.",
  },
  {
    q: "I'm locked into a contract with my accountant — can I still switch?",
    a: "Check the notice period in your engagement letter — most are 1–3 months. You can sign up with us now and we'll manage the transition timing around your exit date. You won't pay twice — we'll align our start date appropriately.",
  },
  {
    q: "What records will you need from my old accountant?",
    a: "We typically request: your last set of filed accounts, tax returns (self assessment or corporation tax), VAT records, payroll data, and any working papers relevant to your current year. We'll provide your old accountant with a standard handover list.",
  },
  {
    q: "Is there any cost to switching?",
    a: "None. We don't charge a setup fee or a switching fee. Your first month's fee is your first month's fee — nothing extra for the transition.",
  },
];

const whyLeave = [
  {
    icon: Clock,
    title: "Slow to respond",
    desc: "Emails go unanswered for days. Phone calls go to voicemail. You're left chasing for basic information about your own finances.",
    colour: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Missed deadlines",
    desc: "Late filing notices from HMRC. Penalties you shouldn't have received. A feeling that you're always the one keeping track of dates.",
    colour: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: FileText,
    title: "No proactive advice",
    desc: "You hear from them once a year — if that. No tax planning, no year-round guidance. Just a bill and a set of accounts.",
    colour: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: TrendingDown,
    title: "Paying too much tax",
    desc: "Without proactive planning, you're almost certainly not as tax-efficient as you could be. Every year that passes is money you won't get back.",
    colour: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Building2,
    title: "Traditional firm, traditional costs",
    desc: "Hourly billing. Unexpected invoices for 'additional work'. No fixed price, no certainty. The bill always seems higher than expected.",
    colour: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Laptop,
    title: "No decent software",
    desc: "Still getting PDFs or spreadsheets in the post. No real-time view of your finances. No app. No dashboard. No visibility.",
    colour: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

const comparisons = [
  {
    category: "Responsiveness",
    traditional: "Often 3–5 day response times",
    online_basic: "Ticket-based support, can be slow",
    clever: "Dedicated accountant, same-day response",
  },
  {
    category: "Advice",
    traditional: "Reactive — you ask, they answer",
    online_basic: "Very limited advice included",
    clever: "Proactive tax planning, unlimited advice",
  },
  {
    category: "Software",
    traditional: "Manual, PDFs, spreadsheets",
    online_basic: "Basic software sometimes included",
    clever: "FreeAgent included free (worth £29/mo)",
  },
  {
    category: "Pricing",
    traditional: "Hourly or unclear annual fee",
    online_basic: "Low monthly fee, limited scope",
    clever: "Fixed all-inclusive monthly price",
  },
  {
    category: "Dedicated Accountant",
    traditional: "Often rotates between staff",
    online_basic: "No dedicated accountant",
    clever: "Your own accountant who knows your business",
  },
  {
    category: "Year-end Accounts",
    traditional: "Included (often slow)",
    online_basic: "Often extra cost",
    clever: "Always included",
  },
  {
    category: "VAT Returns",
    traditional: "Usually extra",
    online_basic: "Often extra",
    clever: "Always included",
  },
  {
    category: "Payroll",
    traditional: "Usually extra",
    online_basic: "Often extra",
    clever: "Included (up to 2 employees)",
  },
  {
    category: "MTD Compliance",
    traditional: "Variable — many not ready",
    online_basic: "Basic MTD only",
    clever: "Full MTD support via FreeAgent",
  },
  {
    category: "Setup / Switch Fee",
    traditional: "Often charged",
    online_basic: "Usually none",
    clever: "None — ever",
  },
];

const whatsIncluded = [
  { icon: Users, text: "Dedicated accountant assigned from day one" },
  { icon: MessageCircle, text: "Unlimited phone and email support" },
  { icon: Monitor, text: "FreeAgent accounting software — free" },
  { icon: FileText, text: "Year-end accounts & corporation tax (Ltd)" },
  { icon: BadgeCheck, text: "Self assessment tax return" },
  { icon: TrendingDown, text: "Tax efficiency and dividend planning" },
  { icon: RefreshCw, text: "VAT returns submitted to HMRC" },
  { icon: CalendarClock, text: "All HMRC & Companies House deadlines managed" },
  { icon: Award, text: "No setup fee and no minimum contract" },
];

const testimonials = [
  {
    name: "Marcus Reid",
    role: "IT Contractor",
    quote: "I stayed with my old accountant for five years because switching felt like a faff. Clever Accounts handled the whole thing. Within 3 weeks I had a new accountant, FreeAgent set up, and saved £800 in the first year.",
    rating: 5,
  },
  {
    name: "Priya Shah",
    role: "Limited Company Director",
    quote: "My previous accountant barely contacted me. I signed up with Clever Accounts on a Thursday and had an introductory call with my new accountant by Monday. It was seamless.",
    rating: 5,
  },
  {
    name: "Tom Hartley",
    role: "Sole Trader / Consultant",
    quote: "I was with a local firm who charged me per letter, per call — it was ridiculous. Fixed price, dedicated accountant, free software. Should've switched years ago.",
    rating: 5,
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
        {open ? <ChevronUp size={20} className="text-primary-light shrink-0" /> : <ChevronDown size={20} className="text-white/50 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">{a}</div>
      )}
    </div>
  );
}

export default function SwitchAccountantPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Zap size={16} />
                Switch in as little as 2 weeks — we handle everything
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Time for a Better<br />
                <span className="text-gradient">Accountant?</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-6">
                Switching accountants feels like a big deal. It isn't. We've helped thousands of businesses make the move — we contact your old accountant, transfer your records, and get you set up. You don't lift a finger.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                And you benefit from day one — not after the paperwork clears.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
                  Switch Today — Free <ArrowRight size={20} />
                </Link>
                <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
                  <Phone size={20} /> {COMPANY.freephone}
                </a>
              </div>
            </div>

            {/* Stats panel */}
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/60 text-sm mb-6">What you get from day one</p>
              <div className="space-y-4">
                {whatsIncluded.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-white/85 text-sm">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-white/50 text-xs mb-1">All-inclusive from</div>
                <div className="text-white font-black text-2xl">£42.50<span className="text-white/50 text-base font-normal">/month</span></div>
                <div className="text-white/40 text-xs mt-0.5">No setup fee · No minimum contract</div>
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

      {/* ── WHY ARE THEY LEAVING ──────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Sound familiar?</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Signs It's Time to Switch
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Most people stay with a bad accountant longer than they should — out of loyalty, inertia, or not knowing it could be better. If any of these ring a bell, it's time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyLeave.map(({ icon: Icon, title, desc, colour, bg }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={24} className={colour} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">The Switch Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              We Handle the Whole Thing
            </h2>
            <p className="text-text-light max-w-xl mx-auto">
              You don't need to contact your old accountant. You don't need to chase paperwork. You just need to sign up.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-border z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  icon: Smile,
                  title: "You Sign Up",
                  desc: "Complete our online form in a few minutes. Tell us about your business and who your current accountant is.",
                  when: "Day 1",
                },
                {
                  step: "02",
                  icon: HeartHandshake,
                  title: "We Contact Them",
                  desc: "We send a professional disengagement letter and request your records directly. You don't need to say a word.",
                  when: "Days 1–3",
                },
                {
                  step: "03",
                  icon: RefreshCw,
                  title: "Records Transfer",
                  desc: "Your previous accounts, tax returns, and payroll data are transferred securely. We check everything is complete.",
                  when: "Weeks 1–3",
                },
                {
                  step: "04",
                  icon: ShieldCheck,
                  title: "You're Sorted",
                  desc: "Your dedicated accountant takes the reins. FreeAgent set up, onboarding call booked, deadlines tracked.",
                  when: "From day 1",
                },
              ].map(({ step, icon: Icon, title, desc, when }) => (
                <div key={step} className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-border shadow-sm flex flex-col items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-primary mb-0.5" />
                    <span className="text-xs font-bold text-primary">{step}</span>
                  </div>
                  <div className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">{when}</div>
                  <h3 className="font-bold text-dark mb-2">{title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefit starts immediately callout */}
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6 max-w-3xl mx-auto text-center">
            <Zap size={24} className="text-primary mx-auto mb-3" />
            <h3 className="font-bold text-dark mb-2">Your benefits start immediately — not after the transfer</h3>
            <p className="text-text-light text-sm max-w-xl mx-auto">
              The moment you sign up, you're a Clever Accounts client. Your dedicated accountant is assigned, FreeAgent is set up, and any upcoming deadlines are tracked. The records transfer runs in the background.
            </p>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-primary/15 blur-3xl animate-blob" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">The Comparison</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              How We Compare to<br />
              <span className="text-gradient">Traditional & Budget Accountants</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Traditional firms charge by the hour and disappear until year end. Budget online services cut corners and leave you without real support. Clever Accounts gives you both — expert service at a fixed, fair price.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/10">
                  <th className="text-left text-white/60 font-semibold px-6 py-4 rounded-tl-2xl w-1/4">Feature</th>
                  <th className="text-center text-white/60 font-semibold px-4 py-4 w-1/4">Traditional Accountant</th>
                  <th className="text-center text-white/60 font-semibold px-4 py-4 w-1/4">Budget Online</th>
                  <th className="text-center text-secondary font-bold px-4 py-4 rounded-tr-2xl w-1/4 bg-secondary/10">Clever Accounts</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(({ category, traditional, online_basic, clever }, i) => (
                  <tr key={category} className={i % 2 === 0 ? "bg-white/[0.03]" : ""}>
                    <td className="px-6 py-4 text-white/70 font-medium">{category}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle size={14} className="text-red-400 shrink-0" />
                        <span className="text-white/50 text-xs">{traditional}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle size={14} className="text-orange-400 shrink-0" />
                        <span className="text-white/50 text-xs">{online_basic}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center bg-secondary/5">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                        <span className="text-white/80 text-xs font-medium">{clever}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Real Switchers</p>
            <h2 className="text-3xl font-black text-dark mb-4">They Made the Move</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, rating }) => (
              <div key={name} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-secondary fill-secondary" />
                  ))}
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

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Stop putting it off.<br />Switch today.
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            No setup fee. No minimum contract. We handle the transfer from start to finish. Your dedicated accountant is ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Switch to Clever Accounts <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              <Phone size={20} /> Call {COMPANY.freephone}
            </a>
          </div>
          <p className="text-white/60 text-sm mt-6">Typically switched within 2–4 weeks · Benefits start from day one</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">FAQ</p>
            <h2 className="text-3xl font-black text-white mb-4">Switching Questions Answered</h2>
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

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="bg-surface py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark mb-4">Ready when you are.</h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">
            Join thousands of businesses who've already made the switch to smarter, more responsive accounting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-all shadow-lg">
              Start Your Switch <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold px-8 py-4 rounded-xl text-lg hover:bg-surface transition-all border border-border shadow-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
