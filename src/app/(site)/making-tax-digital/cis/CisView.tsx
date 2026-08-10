"use client";
import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2, ShieldCheck, Mail, Sparkles } from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import ReferralCta from "@/components/ReferralCta";

export default function CisView() {
  const brand = useBrand();
  const tel = `tel:${brand.freephone.replace(/\s/g, "")}`;
  const videoSrc = "/videos/mtd-cis.mp4";
  const videoPoster = "/videos/mtd-cis-poster.jpg";

  // Calm, factual "what's actually changing" — no catastrophe framing.
  const facts = [
    { n: "What it is", t: "HMRC going digital. A few quick quarterly check-ins instead of one big yearly return." },
    { n: "What changes for you", t: "Honestly? Almost nothing. Same work, same pay, same CIS refund." },
    { n: "Who & when", t: "CIS subbies over £30k turnover, from April 2027. That&rsquo;s turnover, not profit." },
  ];

  const fixes = [
    "We register you with HMRC — it&rsquo;s not automatic, and it&rsquo;s our job, not yours.",
    "Your software&rsquo;s already set up — nothing to buy, nothing to learn.",
    "We file every quarterly update and your final return, on time, every time.",
    "Your CIS refund keeps coming, exactly as it does now.",
  ];

  return (
    <>
      {/* ── HERO — reassurance first ──────────────────────────── */}
      <section className="relative overflow-hidden bg-dark pt-12 pb-14 md:pt-14 md:pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[360px] rounded-full bg-secondary/20 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide mb-6 bg-white/10 border border-white/20 text-white/90">
            <Sparkles size={15} /> CIS subcontractors — the honest version
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
            Making Tax Digital?<br />
            <span className="text-primary">You won&rsquo;t lift a finger.</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-9 leading-relaxed">
            You&rsquo;ve probably heard MTD is coming and it sounds like a headache. It really isn&rsquo;t — not with us.
            We handle the lot; you carry on exactly as you are. Here&rsquo;s the 60-second version 👇
          </p>

          <video
            className="w-full rounded-2xl shadow-2xl border border-white/10 bg-black"
            controls
            preload="metadata"
            poster={videoPoster}
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser doesn&rsquo;t support embedded video.
          </video>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" style={{ fill: "var(--color-surface)" }} />
          </svg>
        </div>
      </section>

      {/* ── WHAT'S ACTUALLY CHANGING (calm, factual) ─────────── */}
      <section className="bg-surface py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3 text-secondary-dark">
            No jargon, no scaremongering
          </p>
          <h2 className="text-center text-3xl md:text-5xl font-black text-dark mb-10 leading-tight">
            What&rsquo;s actually changing?
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-9">
            {facts.map((c) => (
              <div key={c.n} className="rounded-xl p-5 bg-white border border-border shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-secondary-dark">
                  {c.n}
                </div>
                <div className="text-[15px] font-semibold text-dark leading-snug" dangerouslySetInnerHTML={{ __html: c.t }} />
              </div>
            ))}
          </div>
          <p className="text-center text-text text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            That&rsquo;s the whole story. The only people who hit trouble are the ones who ignore it completely —
            and staying with us means <strong className="text-dark">you never have to think about it.</strong>
          </p>
        </div>
      </section>

      {/* ── THE FIX (light) ──────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-secondary-dark text-sm font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={16} /> What you actually have to do
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-dark mb-4 leading-tight">
            Stay with Workwell. We&rsquo;ll sort the lot.
          </h2>
          <p className="text-text-light text-lg max-w-xl mx-auto mb-9">
            No registering with HMRC, no new software to learn, not a single deadline to diarise. That&rsquo;s all us —
            you carry on exactly as you are.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {fixes.map((t) => (
              <div key={t} className="flex items-start gap-3 bg-surface border border-border rounded-xl p-5">
                <CheckCircle2 size={20} className="text-secondary shrink-0 mt-0.5" />
                <span className="text-dark text-[15px] font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: t }} />
              </div>
            ))}
          </div>
          <div className="mt-6 inline-flex items-start gap-2.5 bg-surface border border-border rounded-2xl px-5 py-3 text-sm text-text text-left max-w-xl">
            <Mail size={17} className="text-secondary-dark shrink-0 mt-0.5" />
            <span>Had a letter from HMRC about Making Tax Digital? Don&rsquo;t worry — just forward it to us and we&rsquo;ll take it from there.</span>
          </div>
        </div>
      </section>

      <ReferralCta tone="cis" />

      {/* ── CTA — deep Workwell green close ──────────────────── */}
      <section
        className="relative overflow-hidden py-16 md:py-20 text-center"
        style={{ background: "linear-gradient(135deg, #4f7a35 0%, #37592a 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-black/10 blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            One quick chat and it&rsquo;s handled.
          </h2>
          <p className="text-white/85 text-lg mb-9 max-w-xl mx-auto font-medium">
            No pressure, no jargon — just tell us you&rsquo;re a CIS subbie and we&rsquo;ll make sure you&rsquo;re set up
            long before April 2027. You genuinely won&rsquo;t feel a thing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={tel} className="inline-flex items-center justify-center gap-2 bg-white text-dark font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-xl">
              <Phone size={20} /> {brand.freephone}
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/25 transition-all border border-white/40">
              Ask us a question <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-white/65 text-sm mt-8">
            General guide for {brand.name} clients, not personal tax advice.
          </p>
        </div>
      </section>
    </>
  );
}
