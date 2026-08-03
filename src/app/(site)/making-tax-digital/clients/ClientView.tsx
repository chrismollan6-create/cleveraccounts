"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
  Monitor,
  Calendar,
  RefreshCw,
  HardHat,
  Sparkles,
  Info,
  Mail,
  PlayCircle,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import { brandPossessive } from "@/lib/constants";

// ── MTD rollout — mirrors the public /making-tax-digital framing ──────────────
const timeline = [
  { label: "MTD for VAT", status: "Live now" },
  { label: "MTD for Income Tax — £50k+", status: "April 2026" },
  { label: "MTD for Income Tax — £30k+", status: "April 2027", highlight: true },
  { label: "MTD for Income Tax — £20k+", status: "April 2028" },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-dark">{q}</span>
        {open
          ? <ChevronUp size={20} className="text-primary shrink-0" />
          : <ChevronDown size={20} className="text-text-light shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-text-light leading-relaxed border-t border-border pt-4">{a}</div>
      )}
    </div>
  );
}

export default function ClientMtdView() {
  const brand = useBrand();
  const isWorkwell = brand.id === "workwell";
  const tel = `tel:${brand.freephone.replace(/\s/g, "")}`;

  // Brand-specific explainer video (landscape master lives in /public/videos).
  const videoSrc = isWorkwell ? "/videos/mtd-cis.mp4" : null;
  const videoPoster = isWorkwell ? "/videos/mtd-cis-poster.jpg" : undefined;

  // What we handle for every client — reassurance, not sales.
  const weHandle = [
    {
      icon: Monitor,
      title: "The software is already yours",
      desc: `FreeAgent — HMRC-recognised MTD software — is included with your ${brand.name} package. Nothing new to buy, install or learn.`,
    },
    {
      icon: RefreshCw,
      title: "We prepare every quarterly update",
      desc: "When quarterly reporting begins for you, we review your figures and submit each update to HMRC — then the final declaration that replaces your Self Assessment.",
    },
    {
      icon: Calendar,
      title: "We watch every deadline",
      desc: "Quarterly updates and the final declaration are tracked for you. You won't get a late-filing penalty because a date slipped — that's our job.",
    },
    {
      icon: ShieldCheck,
      title: "We'll tell you before it affects you",
      desc: "We know your figures. We'll be in touch ahead of your start date to confirm everything's in place — well before HMRC's deadline.",
    },
  ];

  // What happens next — the plain-English client steps.
  const steps = [
    {
      title: "Right now — nothing to do",
      desc: "Keep recording your income and expenses exactly as you do today. That's genuinely all we need from you for now.",
    },
    {
      title: "We check where you stand",
      desc: "We'll look at your figures and tell you if and when Making Tax Digital applies to you. You don't need to work the thresholds out yourself.",
    },
    {
      title: "We get you set up",
      desc: `Ahead of your start date, we'll register you for MTD and make sure your FreeAgent is ready. ${brandPossessive(brand)} team will confirm once it's all in place.`,
    },
    {
      title: "We file for you, every quarter",
      desc: "From your start date, we prepare and submit each quarterly update and your final declaration. You carry on as normal — we handle HMRC.",
    },
  ];

  // Client-facing FAQs — MSC-safe, no pricing promises.
  const faqs = [
    {
      q: "Do I need to do anything right now?",
      a: `No. If Making Tax Digital applies to you, we'll be in touch before your start date to confirm your set-up. In the meantime, keep recording your income and expenses as normal — that's all we need.`,
    },
    {
      q: "How will I know if MTD applies to me?",
      a: `It's based on your gross income from self-employment and property. We already have your figures, so we'll tell you exactly when — and if — you're brought in. You don't need to work it out yourself.`,
    },
    {
      q: "Will my quarterly updates be a lot of extra work?",
      a: `Not for you. A quarterly update is a short summary of your income and expenses for that three-month period — and ${brandPossessive(brand)} team prepares and submits it. You carry on recording as you do now.`,
    },
    {
      q: "Will it cost me more?",
      a: `Managing your Making Tax Digital submissions is part of the accountancy service we already provide. If anything about what your package covers ever changes, we'll always tell you well in advance — no surprises.`,
    },
    {
      q: "What if my income changes and I drop below the threshold?",
      a: `The rules around leaving MTD once you're in can be fiddly and depend on your figures over time. It's exactly the kind of thing we monitor for you — so if anything changes about your income, just let us know and we'll handle the rest.`,
    },
    ...(isWorkwell
      ? [{
          q: "I'm CIS and usually get a refund — is that at risk?",
          a: `Your refund comes from filing correctly, and under MTD you'll need to file the new way to claim it. Because we manage your submissions, your CIS deductions are tracked and your refund keeps flowing exactly as it does now.`,
        }]
      : []),
  ];

  return (
    <>
      {/* ── HERO (video-led) ─────────────────────────────────── */}
      <section id="video" className="relative overflow-hidden bg-dark pt-14 pb-16 md:pt-16 md:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-16 w-[440px] h-[440px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light rounded-full px-4 py-2 text-sm font-semibold mb-5">
            <Mail size={15} />
            An update for our clients
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 text-balance">
            Making Tax Digital is coming — <span className="text-gradient">and you're already covered.</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-8">
            {isWorkwell
              ? "From April 2027, the self-employed move to quarterly digital tax reporting. Here's the 60-second version — and what it means for you."
              : "HMRC is moving the self-employed and landlords to quarterly digital tax reporting. Here's the 60-second version — and what it means for you."}
          </p>

          {videoSrc ? (
            <video
              className="w-full rounded-2xl shadow-2xl border border-white/10 bg-black"
              controls
              preload="metadata"
              poster={videoPoster}
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser doesn't support embedded video.
            </video>
          ) : (
            <div className="w-full aspect-video rounded-2xl border border-white/10 bg-white/[0.04] flex flex-col items-center justify-center gap-3 text-white/50">
              <PlayCircle size={44} className="text-primary-light/60" />
              <span className="font-semibold">Your explainer video is on its way</span>
            </div>
          )}

          <p className="text-white/45 text-sm mt-5">Prefer to read? Everything's explained below.</p>
        </div>
      </section>

      {/* ── WHERE YOU STAND (reassurance strip) ──────────────── */}
      <section className="bg-surface py-9 md:py-11 border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            {[
              "Digital records — in FreeAgent already",
              "MTD software — included and set up",
              "Quarterly filing — handled by us",
              "Deadlines — tracked for you",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2.5">
                <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-dark text-sm font-medium leading-snug">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ───────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">The basics</p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                So, what is Making Tax Digital?
              </h2>
              <p className="text-text-light leading-relaxed mb-5">
                Making Tax Digital (MTD) means keeping your records digitally and sending HMRC a short online summary of your income and expenses <strong className="text-dark">every quarter</strong>, using compatible software — instead of one big tax return once a year.
              </p>
              <p className="text-text-light leading-relaxed mb-5">
                A <strong className="text-dark">final declaration</strong> at the end of the year replaces your Self Assessment. Each quarterly update is just a summary of that three-month period — not a full return.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-dark leading-relaxed">
                  Whether MTD applies to you depends on your gross income — <strong>turnover, not profit</strong>. We already have your figures, so we'll confirm your position for you.
                </p>
              </div>
            </div>

            {/* Rollout status */}
            <div className="bg-dark rounded-3xl p-7 shadow-xl">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">When it happens</p>
              <div className="space-y-1.5">
                {timeline.map(({ label, status, highlight }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${highlight ? "bg-secondary/15 border border-secondary/30" : ""}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${highlight ? "bg-secondary" : "bg-primary-light"}`} />
                    <span className={`text-sm flex-1 ${highlight ? "text-white font-semibold" : "text-white/70"}`}>{label}</span>
                    <span className={`text-xs font-bold ${highlight ? "text-secondary" : "text-white/50"}`}>{status}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 pt-5 border-t border-white/10 text-white/55 text-xs leading-relaxed">
                Dates and thresholds are set by HMRC and based on your income in the previous tax year. We track where you fall so you never have to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT MEANS FOR YOU (brand-adaptive) ───────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-bold mb-4">
              {isWorkwell ? <><HardHat size={16} /> CIS &amp; self-employed</> : <><Sparkles size={16} /> Sole traders &amp; landlords</>}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              {isWorkwell ? "What it means for you" : "Why it's not something to worry about"}
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              {isWorkwell
                ? "CIS subcontractors are self-employed, so MTD applies once your income passes the threshold — which most subbies do. Here's why you can relax."
                : "You already do the part that matters. MTD mostly changes how often things are filed, not how much you have to do."}
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <ul className="space-y-4">
              {(isWorkwell
                ? [
                    "You're almost certainly in scope — MTD is based on turnover (your gross invoices), not profit.",
                    "Your CIS deductions suffered at source are tracked in FreeAgent, so your year-end refund keeps flowing.",
                    "There's nothing to buy or set up — your software and submissions are part of what we already do.",
                    "The clients who get set up early won't feel the change at all. You're one of them.",
                  ]
                : [
                    "You already record your income and expenses in FreeAgent — that's the hard part, done all year round.",
                    "FreeAgent is HMRC-recognised MTD software, so it already speaks HMRC's language.",
                    "The only genuinely new step is submitting each quarter — and we do that for you.",
                    "No new tools, no new habits. You carry on exactly as you are.",
                  ]
              ).map((t) => (
                <li key={t} className="flex items-start gap-3 text-text">
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── WHAT WE HANDLE ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Your part stays simple</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What we handle for you
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Making Tax Digital is our job to manage, not yours to worry about. Here's exactly what that looks like.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weHandle.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-2">{title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS NEXT (steps) ────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Your next steps</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">What happens now</h2>
            <p className="text-text-light max-w-xl mx-auto">
              You don't have to lead this — we do. Here's how it plays out from here.
            </p>
          </div>
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5 bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="w-11 h-11 rounded-full bg-primary text-white font-black text-lg flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">{s.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CONTACT BAND ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Got a question? We're right here.
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            If anything about Making Tax Digital is on your mind — or your income has changed — just get in touch. That's the one thing that helps us keep you ahead of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={tel} className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
              <Phone size={20} /> {brand.freephone}
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
              Ask us a question <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-white/50 text-sm mt-8">— The {brand.name} team</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Your questions</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">Things clients ask us</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
          </div>
          <p className="text-center text-text-light text-sm mt-10 max-w-xl mx-auto">
            This page is a general guide for {brand.name} clients, not personal tax advice. For your own situation, speak to your accountant.
          </p>
        </div>
      </section>
    </>
  );
}
