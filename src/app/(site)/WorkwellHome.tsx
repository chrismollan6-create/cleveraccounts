"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  PhoneCall,
  Clock,
  Wallet,
  HeartHandshake,
  ShieldCheck,
  Cpu,
  MessagesSquare,
  Repeat,
  UserCheck,
  Sparkles,
  ChevronRight,
  Gift,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import TaxCalculator from "@/components/ui/TaxCalculator";
import PricingFAQ from "@/components/ui/PricingFAQ";
import RequestCallback from "@/components/ui/RequestCallback";
import StickyFloatingCTA from "@/components/ui/StickyFloatingCTA";
import WorkwellHero from "./WorkwellHero";
import type { CmsHomePage } from "./HomePageClient";
import { SHOWCASE_SECTORS } from "@/lib/sectors";

type ServiceTab = {
  id: string;
  label: string;
  icon: ReactNode;
  headline: string;
  price: string;
  features: string[];
  href: string;
  stat: string;
};

interface WorkwellHomeProps {
  home?: CmsHomePage | null;
  serviceTabs: ServiceTab[];
  faqs: { q: string; a: string }[];
  promoBadges: Record<string, string>;
  trustBadge: string;
}

/** One-liner shown on each "who are you?" segment card. */
const SEGMENT_BLURB: Record<string, string> = {
  "sole-trader": "Self-employed and keeping it simple. We file your Self Assessment and keep HMRC happy.",
  "limited-company": "Running a company? We handle the accounts, tax and payroll so you can run the business.",
  contractor: "Inside or outside IR35, we keep you compliant and tax-efficient on every contract.",
};

/** Per-segment accent — lime, cyan, teal — so the picker is colourful. */
const SEGMENT_ACCENT = [
  { bar: "from-[#8db74e] to-[#e0e48e]", chip: "bg-[#8db74e]/20 text-[#5f8a3e]", hover: "hover:border-[#8db74e]", link: "text-[#5f8a3e]" },
  { bar: "from-[#8db74e] to-[#cde3a3]", chip: "bg-[#8db74e]/25 text-[#2f5560]", hover: "hover:border-[#8db74e]", link: "text-[#2f5560]" },
  { bar: "from-[#29484f] to-[#4a6a72]", chip: "bg-[#29484f]/12 text-[#29484f]", hover: "hover:border-[#29484f]", link: "text-[#29484f]" },
];

/** Alternating icon tints used across the benefit grid. */
const TINTS = [
  "bg-[#8db74e]/20 text-[#5f8a3e]",
  "bg-[#8db74e]/25 text-[#2f5560]",
  "bg-[#29484f]/12 text-[#29484f]",
];

/**
 * Pill tints that pop on the dark sector band. Cycled so adjacent sectors are
 * visually distinct — lime, green, teal and neutral rather than two near-equal
 * greens.
 */
const DARK_TINTS = [
  "bg-[#e0e48e]/15 text-[#e0e48e] border border-[#e0e48e]/35",
  "bg-[#8db74e]/20 text-[#a5d06a] border border-[#8db74e]/40",
  "bg-[#4a6a72]/35 text-[#cde3a3] border border-[#4a6a72]/60",
  "bg-white/[0.07] text-white/80 border border-white/15",
];

/** Soft fade on the marquee edges. */
const MARQUEE_MASK = {
  maskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
} as const;

/**
 * Workwell homepage — a bold, colourful, B2C service-industry experience for
 * sole traders, limited companies and contractors. Warm, plain-English, benefit
 * led, using the full lime / cyan / teal palette. Reuses shared functional
 * components (take-home calculator, FAQ).
 */
export default function WorkwellHome({ home, serviceTabs, faqs, promoBadges, trustBadge }: WorkwellHomeProps) {
  const brand = useBrand();
  const rating = brand.trustpilot?.rating ?? "4.6";
  const segments = serviceTabs.slice(0, 3);
  const sectorHalf = Math.ceil(SHOWCASE_SECTORS.length / 2);
  const sectorsA = SHOWCASE_SECTORS.slice(0, sectorHalf);
  const sectorsB = SHOWCASE_SECTORS.slice(sectorHalf);

  const benefits: { icon: ReactNode; title: string; desc: string }[] = [
    { icon: <UserCheck size={24} />, title: "A real accountant, on first-name terms", desc: "Not a call centre. One named expert who knows you and your business." },
    { icon: <Clock size={24} />, title: "Your tax, sorted and filed on time", desc: "Self Assessment, VAT, payroll, year-end — handled, with no last-minute panic." },
    { icon: <Wallet size={24} />, title: "Keep more of what you earn", desc: "Proactive, plain-English advice that makes sure you never overpay HMRC." },
    { icon: <Cpu size={24} />, title: "Free software, set up for you", desc: "Cloud accounting that shows your numbers in real time — we get you started." },
    { icon: <MessagesSquare size={24} />, title: "Unlimited advice, whenever", desc: "Call or email as often as you like. Questions answered by a human, fast." },
    { icon: <Repeat size={24} />, title: "Switch in minutes", desc: "Already with another accountant? We do the heavy lifting to move you over — free." },
  ];

  const steps = [
    { n: "1", title: "Tell us about you", desc: "Answer a few quick questions online — takes about two minutes.", grad: "from-[#8db74e] to-[#5f8a3e]" },
    { n: "2", title: "Meet your accountant", desc: "We match you with a dedicated expert for your line of work.", grad: "from-[#8db74e] to-[#8db74e]" },
    { n: "3", title: "Relax — we've got it", desc: "We handle the admin, deadlines and tax. You get on with business.", grad: "from-[#29484f] to-[#4a6a72]" },
  ];

  const heroPrice = segments[0]?.price ?? "42.50";

  return (
    <>
      <WorkwellHero home={home} trustBadge={trustBadge} />

      {/* ── Refer a friend — inset rounded card on white so it flows ──── */}
      <section className="bg-white pt-5 pb-0 md:pt-7">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8db74e] via-[#5f8a3e] to-[#29484f] shadow-xl shadow-[#29484f]/15">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 right-1/4 w-48 h-48 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative px-6 py-6 md:px-8 md:py-7">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-[#e0e48e]/40 rounded-2xl blur-md" />
                    <div className="relative w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
                      <Gift size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-white font-black text-lg leading-tight tracking-tight">
                      Refer a friend — earn up to{" "}
                      <span className="text-[#eef3d6] underline decoration-[#e0e48e]/70 decoration-2 underline-offset-2">£250</span>
                    </p>
                    <p className="text-white/85 text-sm mt-0.5">
                      Know someone who needs an accountant? You both benefit.
                    </p>
                  </div>
                </div>
                <Link
                  href="/refer-a-friend"
                  className="group inline-flex items-center gap-2 bg-white text-[#29484f] font-bold px-6 py-3 rounded-xl text-sm shadow-lg hover:shadow-xl hover:bg-[#eef4e2] transition-all whitespace-nowrap"
                >
                  Find out more
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who are you? — colourful segment picker, the B2C front door ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Built around you</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#29484f] mt-3">
              What kind of business are you?
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Pick where you fit and we&apos;ll show you exactly how we help — and what it costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {segments.map((seg, i) => {
              const a = SEGMENT_ACCENT[i % SEGMENT_ACCENT.length];
              return (
                <Link
                  key={seg.id}
                  href={seg.href}
                  className={`group relative flex flex-col bg-white rounded-3xl border border-[#e4ecd6] ${a.hover} hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden`}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${a.bar}`} />
                  <div className="p-8 flex flex-col flex-1">
                    <span className={`w-14 h-14 rounded-2xl ${a.chip} flex items-center justify-center mb-5`}>
                      {seg.icon}
                    </span>
                    <h3 className="text-xl font-bold text-[#29484f] mb-2">{seg.label}</h3>
                    <p className="text-[#5a6f74] text-sm leading-relaxed mb-5">
                      {SEGMENT_BLURB[seg.id] ?? seg.headline}
                    </p>
                    <ul className="space-y-2.5 mb-6">
                      {seg.features.slice(0, 6).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-[#29484f]">
                          <CheckCircle2 size={15} className="text-[#5f8a3e] shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#e4ecd6]">
                      <span className="text-sm text-[#6a7b80]">
                        from <span className="text-lg font-extrabold text-[#29484f]">£{seg.price}</span>/mo + VAT
                      </span>
                      <span className={`inline-flex items-center gap-1 ${a.link} font-bold text-sm group-hover:gap-2 transition-all`}>
                        Explore <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Sector breadth — dark band so the colourful pills pop ─────── */}
      <section className="relative bg-gradient-to-br from-[#15282d] to-[#1c333a] py-16 md:py-20 overflow-hidden">
        <div className="absolute -top-16 left-1/4 w-72 h-72 bg-[#8db74e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-72 h-72 bg-[#8db74e]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center mb-10">
          <span className="text-[#e0e48e] font-bold text-sm uppercase tracking-wider">Whatever you do</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
            We work with all sorts of businesses
          </h2>
          <p className="text-white/65 mt-3 text-lg">
            From trades to tech, salons to startups — chances are we already look after someone just like you.
          </p>
        </div>

        {/* Keyframes shipped inline so the animation never depends on a
            cached external stylesheet. */}
        <style>{`
          @keyframes ww-marq-l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes ww-marq-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        `}</style>
        <div className="relative space-y-4">
          <div className="overflow-hidden" style={MARQUEE_MASK}>
            <div className="flex gap-3 w-max" style={{ animation: "ww-marq-l 28s linear infinite" }}>
              {[...sectorsA, ...sectorsA].map((s, i) => (
                <span
                  key={`a-${i}`}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold ${DARK_TINTS[i % DARK_TINTS.length]}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden" style={MARQUEE_MASK}>
            <div className="flex gap-3 w-max" style={{ animation: "ww-marq-r 28s linear infinite" }}>
              {[...sectorsB, ...sectorsB].map((s, i) => (
                <span
                  key={`b-${i}`}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold ${DARK_TINTS[(i + 1) % DARK_TINTS.length]}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="relative text-center mt-10 text-white font-bold text-lg">
          …and{" "}
          <span className="bg-gradient-to-r from-[#e0e48e] to-[#8db74e] bg-clip-text text-transparent">
            200+ more
          </span>{" "}
          sectors
        </p>
      </section>

      {/* ── Reassurance — outcomes, not features ──────────────────────── */}
      <section className="relative bg-white py-20 md:py-28 overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#8db74e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#8db74e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">
              <HeartHandshake size={16} /> Less admin, more you
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#29484f] mt-3">
              Everything sorted, nothing to worry about
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg">
              You didn&apos;t go into business to do paperwork. Here&apos;s what you get when we look after your accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="bg-white rounded-3xl p-7 border border-[#e4ecd6] shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)] hover:shadow-[0_16px_40px_-12px_rgba(44,74,81,0.28)] hover:-translate-y-1 transition-all"
              >
                <span className={`w-12 h-12 rounded-2xl ${TINTS[i % TINTS.length]} flex items-center justify-center mb-4`}>
                  {b.icon}
                </span>
                <h3 className="text-lg font-bold text-[#29484f] mb-2">{b.title}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Take-home calculator (reused; has its own heading) ────────── */}
      <TaxCalculator />

      {/* ── How it works — dark band, flows into the dark social-proof ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#15282d] to-[#1c333a] py-20 md:py-28">
        <div className="absolute -top-16 left-1/3 w-72 h-72 bg-[#8db74e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#e0e48e] font-bold text-sm uppercase tracking-wider">Getting started</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
              Up and running in minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-9 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-[#8db74e] via-[#8db74e] to-[#8db74e] opacity-50" />
            {steps.map((s) => (
              <div key={s.n} className="text-center relative z-10">
                <div className="w-18 h-18 mx-auto mb-6 rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.grad} text-white text-xl font-extrabold flex items-center justify-center`}>
                    {s.n}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/65 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof — vertical gradient (top edge uniform #1c333a)
          so it joins the How-it-works band above with no seam. ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1c333a] via-[#29484f] to-[#29484f] py-20 md:py-24">
        <div className="absolute top-16 -right-16 w-80 h-80 bg-[#8db74e]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-[#8db74e]/15 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={22} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-white text-2xl font-extrabold ml-2">{rating}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Trusted by self-employed people across the UK
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Real, named accountants. Honest pricing. No call centres and no jargon — just people who genuinely have your back.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/85 text-sm font-semibold mb-10">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#8db74e]" /> Qualified &amp; regulated</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#8db74e]" /> No tie-in contracts</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#8db74e]" /> Making Tax Digital ready</span>
          </div>
          <Link
            href={brand.trustpilot?.url ?? "/reviews"}
            target={brand.trustpilot?.url ? "_blank" : undefined}
            rel={brand.trustpilot?.url ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 bg-white text-[#29484f] font-bold px-6 py-3 rounded-xl hover:bg-[#eef4e2] transition-colors"
          >
            Read our reviews <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Pricing teaser — simple, honest, with colour ──────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-br from-[#8db74e] via-[#8db74e] to-[#29484f] shadow-xl shadow-[#29484f]/10">
            <div className="rounded-[calc(2rem-2px)] bg-white p-10 md:p-14 text-center">
              <span className="inline-flex items-center gap-2 text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">
                <Sparkles size={16} /> Simple, honest pricing
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#29484f] mt-3 mb-2">
                One fixed monthly fee
              </h2>
              <p className="text-[#5a6f74] text-lg mb-6">
                Everything included. No setup fees, no surprises, cancel anytime.
              </p>
              <p className="text-5xl md:text-6xl font-extrabold mb-8">
                <span className="bg-gradient-to-r from-[#8db74e] via-[#8db74e] to-[#29484f] bg-clip-text text-transparent">
                  from £{heroPrice}
                </span>
                <span className="text-xl font-semibold text-[#6a7b80]">/mo + VAT</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/25">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-[#8db74e]/40 text-[#29484f] font-semibold text-lg px-8 py-4 rounded-xl hover:bg-[#eef4e2] transition-colors"
                >
                  See full pricing
                </Link>
              </div>
              {promoBadges[segments[0]?.label] && (
                <p className="mt-5 text-sm font-bold text-[#5f8a3e]">{promoBadges[segments[0].label]}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ — dark section so the reused PricingFAQ (white text) reads ─ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#15282d] to-[#1c333a] py-20 md:py-28">
        <div className="absolute -top-20 -right-16 w-80 h-80 bg-[#8db74e]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-[#8db74e]/12 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#e0e48e] font-bold text-sm uppercase tracking-wider">Good to know</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
              Questions, answered
            </h2>
          </div>
          <PricingFAQ
            faqs={faqs.map((f, i) => ({ _id: String(i), question: f.q, answer: f.a }))}
          />
          <div className="text-center mt-10">
            <p className="text-white/60">
              Still wondering about something?{" "}
              <Link href="/contact" className="text-[#8db74e] font-semibold hover:underline">
                Talk to us &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA — warm close ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-[#1c333a] via-[#29484f] to-[#29484f] rounded-[2rem] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#8db74e]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-[#8db74e]/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to stop worrying about your accounts?
              </h2>
              <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
                Get a dedicated accountant, unlimited advice and free software — all for one simple monthly fee. Set up in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4 rounded-xl shadow-lg shadow-[#8db74e]/25">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <RequestCallback
                  inline
                  label="Request a callback"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
                />
              </div>
              <a
                href={`tel:${brand.freephone.replace(/\s/g, "")}`}
                className="mt-6 inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors"
              >
                <PhoneCall size={18} /> Or call us free on {brand.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyFloatingCTA freephone={brand.freephone} />
    </>
  );
}
