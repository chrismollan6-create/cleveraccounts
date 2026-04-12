"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Star, Phone, ShieldCheck, FileSearch,
  ArrowLeftRight, Scale, ChevronDown, AlertTriangle, TrendingUp,
  Sparkles, BadgeCheck, XCircle, Building2, Users,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import ContractorCalculator from "@/components/ui/ContractorCalculator";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-white hover:bg-white/5 transition-colors"
      >
        {q}
        <ChevronDown size={18} className={`shrink-0 ml-3 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-3 text-sm text-white/60 leading-relaxed border-t border-white/10 bg-white/[0.03]">
          {a}
        </div>
      )}
    </div>
  );
}

const faqs = [
  { q: "What is IR35?", a: "IR35 (the off-payroll working rules) is HMRC legislation that determines whether a contractor working through a personal service company (PSC) should be taxed as an employee. If HMRC considers you to be working 'inside IR35', your income is subject to income tax and National Insurance as if you were an employee — significantly reducing your take-home pay." },
  { q: "Who decides my IR35 status?", a: "For public sector and medium/large private sector clients, the end client (your hirer) is responsible for issuing a Status Determination Statement (SDS). For small private sector clients, the PSC contractor makes their own determination. In either case, we help you understand your position and challenge incorrect determinations." },
  { q: "What is a Status Determination Statement (SDS)?", a: "An SDS is the written determination your client must issue when they decide your IR35 status. They must also pass it to any agency in the chain. If the determination is wrong, you have a right to challenge it through the client's formal disagreement process. We help you draft challenges." },
  { q: "What are the key tests for IR35?", a: "HMRC looks at three primary factors: Substitution (can you send someone else to do the work?), Control (how much does the client control how, when and where you work?), and Mutuality of Obligation (is the client obliged to offer work and are you obliged to accept it?). Secondary factors include financial risk, equipment provision, and integration into the client's organisation. We assess all of these." },
  { q: "What is Clever FLEX?", a: "Clever FLEX is our unique solution that lets contractors switch seamlessly between operating through their own PSC (outside IR35) and an umbrella company (inside IR35) without changing accountant, changing bank accounts, or going through a new onboarding process. It's designed for contractors whose status changes between engagements." },
  { q: "Can I challenge an inside IR35 determination?", a: "Yes. If your client issues an SDS that you believe is wrong, you have the right to raise a formal disagreement. Your client must respond within 45 days. We help you build the case — reviewing your working practices, the contract wording, and the CEST assessment — and draft the formal challenge on your behalf." },
  { q: "What happens if I'm investigated by HMRC?", a: "HMRC IR35 investigations can cover up to 6 years of back tax. Having proper contract reviews, accurate SDS records, and documented working practices is critical. We ensure all of this is in place from the start, and support you through any HMRC enquiry." },
  { q: "Does IR35 affect sole traders?", a: "IR35 applies to contractors who operate through a personal service company (PSC/limited company). Sole traders are generally not affected by IR35 — they are assessed differently by HMRC. If you're unsure of your structure, speak to us." },
];

export default function IR35Page() {
  return (
    <>
      {/* ═══════════════════════════════════
          HERO
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark min-h-[65vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/15 animate-blob" />
          <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] bg-accent/8 animate-blob blob-shape-2" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 pattern-dots" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-full px-4 py-2 text-sm text-primary mb-6">
                <ShieldCheck size={14} />
                <span>Specialist IR35 Support for Contractors</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                IR35 Doesn&apos;t Have to Be <span className="text-gradient">Scary.</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
                We review your contracts, assess your working practices, and give you a clear written IR35 opinion — so you know exactly where you stand and can focus on contracting, not compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
                >
                  Get IR35 Support <ArrowRight size={22} />
                </Link>
                <a
                  href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-5 rounded-2xl text-lg hover:bg-white/10 transition-all"
                >
                  <Phone size={20} /> Speak to an Expert
                </a>
              </div>
              <p className="text-slate-500 text-sm mt-5 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> Written IR35 opinion</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> 24hr turnaround</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> Included in your monthly fee</span>
              </p>
            </div>

            {/* Right — stats panel */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <p className="text-white/50 text-sm uppercase tracking-wider mb-6">IR35 at a glance</p>
                <div className="space-y-4">
                  {[
                    { label: "Outside IR35 take-home (£500/day)", value: "~£75,000/yr", sub: "Via your own PSC", colour: "from-primary to-blue-400" },
                    { label: "Inside IR35 take-home (£500/day)", value: "~£58,000/yr", sub: "Via umbrella company", colour: "from-red-500 to-orange-400" },
                    { label: "Potential annual difference", value: "~£17,000", sub: "More in your pocket outside IR35", colour: "from-secondary to-yellow-400" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${item.colour} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 text-xs">{item.label}</p>
                        <p className={`text-xl font-black bg-gradient-to-r ${item.colour} bg-clip-text text-transparent`}>{item.value}</p>
                        <p className="text-white/40 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/25 text-xs mt-4">Based on 220 working days. Illustrative only — use our calculator below.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TRUST BAR
          ═══════════════════════════════════ */}
      <section className="bg-white pt-4 pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {[
              { value: "2,000+", label: "Contractors Supported" },
              { value: "24hr", label: "Contract Review Turnaround" },
              { value: "20+", label: "Years IR35 Expertise" },
              { value: "£0", label: "Setup Fees" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <span className="text-3xl font-black text-gradient">{s.value}</span>
                <p className="text-xs text-text-light mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          INSIDE VS OUTSIDE — the big explainer
          ═══════════════════════════════════ */}
      <section className="bg-white py-16 md:py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">The Core Question</span>
            <h2 className="text-3xl md:text-4xl font-black text-dark mt-3">
              Inside vs Outside IR35 — <span className="text-gradient">What's the Difference?</span>
            </h2>
            <p className="text-text-light max-w-2xl mx-auto mt-4">
              Your IR35 status is the single biggest factor in how much take-home pay you keep as a contractor. Here's what each means.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Outside IR35 */}
            <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <BadgeCheck size={26} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-dark">Outside IR35</h3>
                  <p className="text-sm text-primary font-semibold">More take-home. More flexibility.</p>
                </div>
              </div>
              <p className="text-text-light leading-relaxed mb-6">
                You are considered genuinely self-employed. You operate through your own limited company (PSC), take a low salary and dividends, and pay corporation tax — resulting in significantly higher take-home pay.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Pay corporation tax (19–25%) + dividend tax",
                  "Keep significantly more of your day rate",
                  "Claim business expenses against profit",
                  "Full control over salary/dividend split",
                  "Retain money in your company for growth",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-white rounded-2xl p-4 border border-primary/20">
                <p className="text-xs text-text-light mb-1">Estimated take-home at £500/day</p>
                <p className="text-3xl font-black text-primary">~£75,000<span className="text-lg text-text-light font-normal">/yr</span></p>
              </div>
            </div>

            {/* Inside IR35 */}
            <div className="rounded-3xl border-2 border-border bg-surface p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <XCircle size={26} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-dark">Inside IR35</h3>
                  <p className="text-sm text-red-500 font-semibold">Taxed like an employee. Without the benefits.</p>
                </div>
              </div>
              <p className="text-text-light leading-relaxed mb-6">
                HMRC deems you to be effectively an employee of your client. Your income is subject to full income tax and National Insurance — employer NI is deducted from your contract value before you even receive it.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Pay full income tax + employee NI",
                  "Employer NI deducted from your contract rate",
                  "Cannot claim most business expenses",
                  "No dividend option — salary only",
                  "No employment rights (holiday, sick pay etc.)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-white rounded-2xl p-4 border border-border">
                <p className="text-xs text-text-light mb-1">Estimated take-home at £500/day</p>
                <p className="text-3xl font-black text-dark">~£58,000<span className="text-lg text-text-light font-normal">/yr</span></p>
              </div>
            </div>
          </div>

          {/* Difference callout */}
          <div className="max-w-5xl mx-auto mt-6">
            <div className="gradient-cta rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="relative flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <TrendingUp size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white/80 text-sm">At £500/day, operating outside IR35 means approximately</p>
                  <p className="text-3xl font-black text-white">£17,000 more per year in your pocket</p>
                  <p className="text-white/70 text-sm">That&apos;s why getting your IR35 status right matters so much.</p>
                </div>
                <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-6 py-3 rounded-xl whitespace-nowrap shrink-0">
                  Protect Your Status <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          THE 3 TESTS — dark section
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blob-shape animate-blob" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">How HMRC Decides</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              The Three Key IR35 <span className="text-gradient">Tests</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto mt-4">
              HMRC uses these factors to determine whether a contractor is genuinely self-employed or effectively an employee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                number: "01",
                title: "Substitution",
                subtitle: "Can you send someone else?",
                description: "If you have a genuine, unfettered right to send a substitute to do the work — and your client cannot refuse — this points strongly to outside IR35. The substitution clause must be real, not just written into the contract.",
                outside: "You can send a qualified substitute without client approval",
                inside: "The client requires you personally to do the work",
              },
              {
                number: "02",
                title: "Control",
                subtitle: "Who controls how you work?",
                description: "Outside IR35, you control how, when and where you do the work. Inside IR35, the client dictates your hours, location, methods and day-to-day activities — just like an employee.",
                outside: "You decide how and when to deliver the work",
                inside: "Client controls your working hours, location and methods",
              },
              {
                number: "03",
                title: "Mutuality of Obligation",
                subtitle: "Are you obliged to accept work?",
                description: "Outside IR35, there is no obligation on the client to offer work or on you to accept it beyond the current contract. Inside IR35, there is an expectation of ongoing work — like an employment relationship.",
                outside: "No obligation beyond the current contract scope",
                inside: "Ongoing expectation of work — employment-like relationship",
              },
            ].map((test) => (
              <div key={test.number} className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-black text-gradient">{test.number}</span>
                  <div>
                    <h3 className="font-black text-white">{test.title}</h3>
                    <p className="text-primary text-xs font-semibold">{test.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">{test.description}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-primary/10 rounded-xl p-3">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-white/70"><span className="text-primary font-semibold">Outside: </span>{test.outside}</p>
                  </div>
                  <div className="flex items-start gap-2 bg-red-500/10 rounded-xl p-3">
                    <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/70"><span className="text-red-400 font-semibold">Inside: </span>{test.inside}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-6 text-center">
              <Sparkles size={20} className="text-primary mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Working practices matter as much as the contract</p>
              <p className="text-white/50 text-sm">HMRC looks at the reality of how you work, not just what&apos;s written. We review both your contract wording AND your actual working arrangements.</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════
          WHAT WE DO — services grid
          ═══════════════════════════════════ */}
      <section className="gradient-warm-section py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Our IR35 Service</span>
            <h2 className="text-3xl md:text-4xl font-black text-dark mt-3">
              Everything You Need to <span className="text-gradient">Stay Compliant</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                Icon: FileSearch,
                title: "Contract Reviews",
                items: ["Written IR35 opinion within 24hrs", "Contract wording recommendations", "Red flag identification", "Covers all contract types & sectors"],
              },
              {
                Icon: Scale,
                title: "Working Practice Assessment",
                items: ["Review of actual day-to-day working", "Substitution evidence guidance", "Control & MOO assessment", "Documented for HMRC if needed"],
              },
              {
                Icon: ShieldCheck,
                title: "Status Determination Support",
                items: ["CEST tool guidance & review", "SDS challenge drafting", "Client negotiation support", "Formal disagreement process help"],
              },
              {
                Icon: ArrowLeftRight,
                title: "Clever FLEX",
                items: ["Seamless PSC to umbrella switching", "No new accountant or onboarding", "Inside IR35 umbrella payroll", "Switch back when status changes"],
              },
              {
                Icon: Building2,
                title: "PSC Accounting",
                items: ["Year-end accounts & CT600", "Quarterly VAT returns", "Director payroll & dividends", "Companies House filings"],
              },
              {
                Icon: Users,
                title: "HMRC Enquiry Support",
                items: ["Full representation in IR35 enquiries", "Historic contract defence", "Up to 6 years protection", "Expert correspondence handling"],
              },
            ].map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-border shadow-sm card-hover p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <cat.Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-dark">{cat.title}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-light">
                      <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CALCULATOR
          ═══════════════════════════════════ */}
      <ContractorCalculator />

      {/* ═══════════════════════════════════
          CLEVER FLEX — spotlight
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary/10 blob-shape animate-blob" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-2 text-sm text-secondary mb-6">
                <Sparkles size={14} /> Unique to Clever Accounts
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Introducing <span className="text-gradient">Clever FLEX</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                The reality of modern contracting is that your IR35 status can change from one engagement to the next. Clever FLEX is our solution — letting you switch between operating through your PSC (outside IR35) and our umbrella company (inside IR35) without any disruption.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Outside IR35 contract?", body: "Operate through your PSC. Maximum take-home, full tax efficiency." },
                  { title: "Inside IR35 contract?", body: "Switch to Clever FLEX umbrella in one step. Same accountant, same team." },
                  { title: "Status changes again?", body: "Switch back to PSC instantly. No new onboarding, no hassle." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/[0.06] rounded-2xl p-4 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-white/50">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <p className="text-white/50 text-sm uppercase tracking-wider mb-6">Clever FLEX includes</p>
              <ul className="space-y-4">
                {[
                  "Seamless PSC / umbrella switching",
                  "No new accountant onboarding",
                  "Umbrella PAYE payroll processing",
                  "PSC accounting fully maintained",
                  "Written IR35 contract reviews included",
                  "One dedicated accountant throughout",
                  "Unlimited advice across all contracts",
                  "Full limited company accounting",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="btn-primary w-full mt-8 inline-flex items-center justify-center gap-2 text-lg py-4 rounded-xl"
              >
                Get Clever FLEX <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PRICING
          ═══════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="gradient-cta rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="relative">
              <p className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-2">All-Inclusive Contractor Accounting + IR35</p>
              <div className="text-6xl font-black text-white my-3">
                £104.50<span className="text-2xl text-white/60">/month</span>
              </div>
              <p className="text-white/75 mb-8">Full contractor accounting + end-to-end IR35 support + Clever FLEX. No extras, ever.</p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-10 py-4 rounded-2xl text-lg hover:shadow-2xl transition-all"
              >
                Get Started Today <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TESTIMONIAL
          ═══════════════════════════════════ */}
      <section className="gradient-warm-section py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={22} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-2xl font-bold text-dark leading-relaxed mb-6">
            &ldquo;I had an inside IR35 determination from a client that I was sure was wrong. Clever Accounts reviewed my working practices, drafted the formal challenge, and it was overturned within three weeks. Saved me over £18,000 a year.&rdquo;
          </blockquote>
          <p className="font-bold text-dark">Rob Fletcher</p>
          <p className="text-sm text-text-light">Senior IT Contractor — Outside IR35</p>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FAQ
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">IR35 Explained</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Your IR35 Questions <span className="text-gradient">Answered</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════
          BOTTOM CTA
          ═══════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-primary font-bold text-sm uppercase tracking-wider">Don&apos;t Leave It to Chance</span>
          <h2 className="text-3xl md:text-4xl font-black text-dark mt-3 mb-4">
            Get a Clear IR35 Opinion <span className="text-gradient">Today</span>
          </h2>
          <p className="text-text-light mb-10 max-w-xl mx-auto">
            A wrong IR35 determination could cost you tens of thousands. Get it right from the start with a specialist contractor accountant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
            >
              Get IR35 Support <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-border text-dark font-semibold px-8 py-5 rounded-2xl text-lg hover:border-primary hover:text-primary transition-all"
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
