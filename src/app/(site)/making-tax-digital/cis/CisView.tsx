"use client";
import Link from "next/link";
import { AlertTriangle, Phone, ArrowRight, CheckCircle2, ShieldCheck, Mail } from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import ReferralCta from "@/components/ReferralCta";

// Sparing "danger" red — a semantic alert (NOT orange, which reads as Clever
// branding). Everything else is Workwell brand (teal / green / cream).
const WARN = "#e5484d";
const WARN_SOFT = "#f6a5a5";

export default function CisView() {
  const brand = useBrand();
  const tel = `tel:${brand.freephone.replace(/\s/g, "")}`;
  const videoSrc = "/videos/mtd-cis.mp4";
  const videoPoster = "/videos/mtd-cis-poster.jpg";

  const chain = [
    { n: "Step 1", t: "No MTD set-up" },
    { n: "Step 2", t: "Can't file the normal way" },
    { n: "The result", t: "Refund frozen", last: true },
  ];

  const fixes = [
    "We register you with HMRC — it's not automatic, and that's our job.",
    "Your software's already set up — nothing to buy or learn.",
    "We file every quarterly update and your final return.",
    "Your CIS refund keeps coming, exactly as now.",
  ];

  return (
    <>
      {/* ── HERO — instant impact + video ────────────────────── */}
      <section className="relative overflow-hidden bg-dark pt-12 pb-14 md:pt-14 md:pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[360px] rounded-full blur-3xl" style={{ backgroundColor: `${WARN}1f` }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide mb-6"
            style={{ backgroundColor: `${WARN}22`, border: `1px solid ${WARN}59`, color: WARN_SOFT }}
          >
            <AlertTriangle size={15} /> CIS subcontractors — read this
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            No return.<br />
            <span style={{ color: WARN }}>No refund.</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-9 leading-relaxed">
            From April 2027, Making Tax Digital hits every CIS subbie turning over{" "}
            <strong className="text-white">£30k+</strong>. Miss it, and the refund you&rsquo;re owed gets{" "}
            <strong style={{ color: WARN_SOFT }}>stuck</strong>. Here&rsquo;s the 60-second version 👇
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

      {/* ── THE SCARE (light) ────────────────────────────────── */}
      <section className="bg-surface py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3" style={{ color: WARN }}>
            Ignore it, and here&rsquo;s the chain
          </p>
          <h2 className="text-center text-3xl md:text-5xl font-black text-dark mb-10 leading-tight">
            Your refund gets frozen.
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-9">
            {chain.map((c) => (
              <div
                key={c.t}
                className={`rounded-xl p-5 ${c.last ? "" : "bg-white border border-border shadow-sm"}`}
                style={c.last ? { backgroundColor: `${WARN}14`, border: `1px solid ${WARN}80` } : undefined}
              >
                <div
                  className={`text-xs font-bold uppercase tracking-wider mb-2 ${c.last ? "" : "text-text-light"}`}
                  style={c.last ? { color: WARN } : undefined}
                >
                  {c.n}
                </div>
                <div className={`text-lg font-bold ${c.last ? "" : "text-dark"}`} style={c.last ? { color: WARN } : undefined}>
                  {c.t}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-text text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            HMRC takes <strong className="text-dark">20%</strong> of your pay at source. Most subbies are owed money back —{" "}
            <strong style={{ color: WARN }}>often thousands</strong>. Miss MTD and it stays stuck until you&rsquo;re set up.
          </p>
          <p className="text-center text-text text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-5">
            <strong style={{ color: WARN }}>And there are penalties now</strong> — miss the new quarterly deadlines and HMRC racks up points, then fines.
          </p>
          <p className="text-center text-text-light text-sm mt-4">
            And that&rsquo;s <strong className="text-dark">£30k turnover — not profit</strong>. Nearly every subbie is over it.
          </p>
        </div>
      </section>

      {/* ── THE FIX (light) ──────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-secondary-dark text-sm font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={16} /> The easy way out
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-dark mb-4 leading-tight">
            Stay with Workwell. We&rsquo;ll sort the lot.
          </h2>
          <p className="text-text-light text-lg max-w-xl mx-auto mb-9">
            You don&rsquo;t need to register with HMRC, learn new software, or diarise a single deadline. That&rsquo;s all us — you carry on exactly as you are.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {fixes.map((t) => (
              <div key={t} className="flex items-start gap-3 bg-surface border border-border rounded-xl p-5">
                <CheckCircle2 size={20} className="text-secondary shrink-0 mt-0.5" />
                <span className="text-dark text-[15px] font-semibold leading-snug">{t}</span>
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
            Don&rsquo;t leave it in the drawer.
          </h2>
          <p className="text-white/85 text-lg mb-9 max-w-xl mx-auto font-medium">
            The subbies who sort it early won&rsquo;t feel a thing. Talk to us and we&rsquo;ll get you set up — long before it bites.
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
