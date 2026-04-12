"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Award,
  Smartphone,
  BarChart3,
  FileText,
  CreditCard,
  Building,
  Zap,
  ChevronDown,
  ChevronUp,
  Receipt,
  Clock,
  Shield,
  TrendingDown,
  Users,
  Globe,
  RefreshCw,
  AlertCircle,
  Calendar,
  BadgeCheck,
} from "lucide-react";

const freeagentFeatures = [
  { icon: FileText, title: "Professional Invoicing", desc: "Create and send branded invoices in seconds. Automatic payment reminders, recurring invoices, and real-time payment status." },
  { icon: Receipt, title: "Expense Tracking", desc: "Snap receipts on your phone and log expenses on the go. Mileage tracking built in. Never miss a tax-deductible expense again." },
  { icon: Building, title: "Open Banking", desc: "Connect with 25+ UK banks including Barclays, HSBC, Lloyds, and Starling. Transactions imported and categorised automatically." },
  { icon: BarChart3, title: "Real-Time Dashboard", desc: "Your profit, tax position, cash flow, and upcoming bills — all visible at a glance. Know exactly where you stand, always." },
  { icon: Smartphone, title: "iOS & Android App", desc: "Full-featured mobile app so you can manage your finances from anywhere. Perfect for contractors and sole traders on the move." },
  { icon: Zap, title: "MTD Compliant", desc: "Fully HMRC-recognised and Making Tax Digital compatible. Submit VAT returns directly to HMRC with one click." },
  { icon: TrendingDown, title: "Tax Estimates", desc: "FreeAgent calculates your corporation tax, self assessment, or VAT in real time as you work — no nasty surprises at year end." },
  { icon: RefreshCw, title: "Payroll Integration", desc: "Run payroll directly within FreeAgent. RTI submissions to HMRC handled automatically. Auto-enrolment pension support included." },
  { icon: Globe, title: "Multi-Currency", desc: "Invoice international clients in their local currency. Foreign exchange gains and losses handled automatically." },
];

const mtdTimeline = [
  {
    status: "live",
    label: "Already Live",
    title: "MTD for VAT",
    date: "April 2022",
    who: "All VAT-registered businesses",
    detail: "All VAT-registered businesses must now keep digital records and file VAT returns using MTD-compatible software. FreeAgent handles this with direct HMRC submission — no bridging software needed.",
    colour: "bg-green-500",
  },
  {
    status: "soon",
    label: "Coming April 2026",
    title: "MTD for Income Tax (£50k+)",
    date: "April 2026",
    who: "Sole traders & landlords with income over £50,000",
    detail: "If your combined income from self-employment and property exceeds £50,000, you'll need to submit quarterly updates to HMRC digitally using MTD-compatible software — replacing the traditional annual self assessment.",
    colour: "bg-orange-500",
  },
  {
    status: "upcoming",
    label: "Coming April 2027",
    title: "MTD for Income Tax (£30k+)",
    date: "April 2027",
    who: "Sole traders & landlords with income over £30,000",
    detail: "From April 2027, MTD for ITSA extends to those earning over £30,000. With Clever Accounts and FreeAgent, you'll already be set up — no scramble to switch software or processes.",
    colour: "bg-blue-500",
  },
  {
    status: "future",
    label: "Future",
    title: "MTD for Corporation Tax",
    date: "TBC",
    who: "Limited companies",
    detail: "HMRC has confirmed MTD will eventually extend to corporation tax. The exact timeline is still being consulted on, but FreeAgent is expected to be fully compliant well in advance. We'll keep you informed.",
    colour: "bg-purple-500",
  },
];

const otherSoftware = [
  {
    name: "Xero",
    logo: null,
    description: "A popular choice for growing businesses with complex needs. We support Xero clients fully — if you're already on Xero and don't want to switch, we work with you.",
    tags: ["Limited Companies", "Growing Businesses", "Multi-user"],
  },
  {
    name: "QuickBooks",
    logo: null,
    description: "Well-known across the UK and US, QuickBooks suits a wide range of businesses. If you prefer QuickBooks, our accountants are experienced with it.",
    tags: ["Sole Traders", "Retail", "Ecommerce"],
  },
  {
    name: "Sage",
    logo: null,
    description: "A stalwart of UK accounting with strong payroll features. We can work with Sage users, particularly those in construction or with larger payrolls.",
    tags: ["CIS", "Payroll-heavy", "Established Businesses"],
  },
];

const faqs = [
  {
    q: "Is FreeAgent really free with my Clever Accounts package?",
    a: "Yes — completely free. FreeAgent normally costs £19–£29/month if you subscribe directly. With Clever Accounts, it's included at no extra charge with every package.",
  },
  {
    q: "What does 'FreeAgent Platinum Partner' mean?",
    a: "Platinum is FreeAgent's highest tier of accountancy partner status. It means we've met their standards for client volume, quality of service, and proficiency with the platform. You get priority support and access to features ahead of general release.",
  },
  {
    q: "Do I have to use FreeAgent, or can I stick with my existing software?",
    a: "We recommend FreeAgent — it's what we know best and it's free for you. But if you're already using Xero, QuickBooks, or Sage and prefer to stay on it, we can work with you. Just ask when you sign up.",
  },
  {
    q: "Does FreeAgent work with Making Tax Digital?",
    a: "Yes. FreeAgent is HMRC-recognised MTD-compatible software for both VAT and Income Tax. If MTD for ITSA applies to you (sole traders and landlords earning over £50k from April 2026), you'll already be prepared.",
  },
  {
    q: "What is MTD for Income Tax and do I need to worry about it?",
    a: "MTD for Income Tax Self Assessment (ITSA) requires self-employed individuals and landlords to submit quarterly digital updates to HMRC instead of one annual return. It starts April 2026 for those earning over £50,000. We'll guide you through it — FreeAgent handles the submissions automatically.",
  },
  {
    q: "Can I access FreeAgent on my phone?",
    a: "Yes — FreeAgent has full iOS and Android apps. You can create invoices, log expenses, snap receipts, and check your financial dashboard all from your phone.",
  },
  {
    q: "What happens to my FreeAgent account if I leave Clever Accounts?",
    a: "If you cancel your Clever Accounts subscription, you'll lose access to the free FreeAgent licence. You can either subscribe to FreeAgent directly, or export all your data to use elsewhere. All your historical data is always yours.",
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
        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function AccountingSoftwarePage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div>
              {/* Platinum badge */}
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Award size={16} />
                FreeAgent Platinum Partner
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Award-Winning<br />
                <span className="text-gradient">Accounting Software</span><br />
                Included Free
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Every Clever Accounts package includes FreeAgent — the UK's leading small business accounting software — at no extra cost. Valued at up to £29/month, it's yours free as long as you're a client.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["MTD Compliant", "HMRC Recognised", "Open Banking", "Free on Mobile"].map((t) => (
                  <span key={t} className="bg-white/10 text-white/90 text-sm px-3 py-1.5 rounded-full border border-white/20">{t}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Right panel */}
            <div className="relative">
              <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl">
                {/* Platinum status display */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                    <Award size={32} className="text-secondary" />
                  </div>
                  <div>
                    <div className="text-white font-black text-xl">FreeAgent</div>
                    <div className="text-secondary font-semibold text-sm">Platinum Partner Status</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="text-secondary fill-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "Free FreeAgent licence included",
                    "Priority partner support",
                    "MTD-ready from day one",
                    "HMRC-recognised software",
                    "Dedicated accountant + software",
                    "No hidden charges, ever",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                      <span className="text-white/85 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <div className="text-white/50 text-sm">Software value included</div>
                  <div className="text-secondary font-black text-2xl">£0/month</div>
                  <div className="text-white/50 text-xs">(normally up to £29/mo direct)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── PLATINUM PARTNER SECTION ───────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Official Partner</p>
              <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight mb-5">
                We're a FreeAgent<br /><span className="text-primary">Platinum Partner</span>
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                Platinum is FreeAgent's highest tier of accountancy partner status. It's awarded to firms that demonstrate exceptional client volume, platform expertise, and quality of service. We've held Platinum status for years — which means you get more.
              </p>
              <div className="space-y-4">
                {[
                  { icon: BadgeCheck, title: "Priority Access", desc: "Our clients benefit from priority support and early access to new FreeAgent features before general release." },
                  { icon: Users, title: "Dedicated FreeAgent Support", desc: "Direct line to FreeAgent's accountant team. If there's ever a software question, we have the fastest route to an answer." },
                  { icon: Shield, title: "Certified Expertise", desc: "Our accountants are FreeAgent-certified. We don't just set you up and leave — we show you how to get the most from it." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-dark text-sm mb-0.5">{title}</div>
                      <div className="text-text-light text-sm leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-dark flex items-center justify-center">
              <Image
                src="/images/hero-accountant.jpg"
                alt="Clever Accounts FreeAgent Platinum Partner"
                fill
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                    <Award size={20} className="text-secondary" />
                  </div>
                  <div>
                    <div className="text-dark font-black text-sm">Platinum Partner Status</div>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-secondary fill-secondary" />)}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-text-light">FreeAgent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREEAGENT FEATURES GRID ─────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">What You Get</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Everything You Need to<br />Run Your Business
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              FreeAgent covers every corner of your finances. Here's what's included with your free licence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeagentFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MTD SECTION ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-primary/15 blur-3xl animate-blob" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">HMRC Requirement</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Making Tax Digital —<br />
              <span className="text-gradient">Are You Ready?</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              HMRC is rolling out Making Tax Digital (MTD) across all tax types. It's not optional — it's a legal requirement. Here's what's already live, what's coming, and how we'll keep you compliant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {mtdTimeline.map(({ status, label, title, date, who, detail, colour }) => (
              <div key={title} className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-2xl p-6 card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-3 h-3 rounded-full ${colour} mt-1.5 shrink-0`} />
                  <div className="flex-1">
                    <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${status === "live" ? "text-green-400" : status === "soon" ? "text-orange-400" : status === "upcoming" ? "text-blue-400" : "text-purple-400"}`}>
                      {label}
                    </div>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-white/50" />
                      <span className="text-white/60 text-sm">{date}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-7">
                  <div className="text-primary-light text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Users size={14} />
                    {who}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* MTD callout */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-6 flex gap-4 items-start">
            <AlertCircle size={24} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-bold mb-1">Don't leave it until the last minute</div>
              <p className="text-white/70 text-sm leading-relaxed">
                Many businesses are leaving MTD preparation too late. With Clever Accounts and FreeAgent, you're MTD-ready from day one — digital records, quarterly submissions, and HMRC connectivity all handled for you. If MTD for ITSA is on the horizon for you, talk to us now.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-secondary font-semibold text-sm mt-3 hover:underline">
                Speak to an MTD expert <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── OTHER SOFTWARE ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Flexibility</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Prefer a Different Platform?<br />We Work With That Too.
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              FreeAgent is our primary recommendation and included free — but if you're already using another platform and don't want to switch, we'll work with you on it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {otherSoftware.map(({ name, description, tags }) => (
              <div key={name} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4 border border-border">
                  <span className="font-black text-dark text-sm">{name.slice(0, 2)}</span>
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{name}</h3>
                <p className="text-text-light text-sm leading-relaxed mb-4">{description}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="text-xs bg-surface border border-border text-text-light px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-dark mb-2">Already on different software? No problem.</h3>
            <p className="text-text-light text-sm max-w-xl mx-auto">
              Let us know what you're using when you sign up. Our onboarding team will assess whether to migrate you to FreeAgent (usually the right move) or integrate with your existing platform.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Award size={16} />
            FreeAgent Platinum Partner
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Software + Accountant.<br />All In. From £32.50/month.
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            FreeAgent included free. No setup fee. No minimum contract. A dedicated accountant who knows your business from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              Compare Plans
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            {["No setup fee", "No minimum contract", "Cancel anytime", "Free FreeAgent licence"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-white/70" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
      <section className="bg-surface py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark mb-4">Ready to get started?</h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">
            Join thousands of sole traders, contractors, and limited companies who've made the switch to Clever Accounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-all shadow-lg">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold px-8 py-4 rounded-xl text-lg hover:bg-surface transition-all border border-border shadow-sm">
              Speak to an Accountant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
