"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  PhoneCall,
  X,
  PoundSterling,
  TrendingUp,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import PricingFAQ from "@/components/ui/PricingFAQ";
import RequestCallback from "@/components/ui/RequestCallback";
import ContractorCalculator from "@/components/ui/ContractorCalculator";
import WorkwellCisExtras from "./WorkwellCisExtras";

/** Normalised service-page content (CMS doc merged over fallback, de-Clevered). */
export type ServiceContent = {
  title: string;
  headline: string;
  description: string;
  price: string;
  features: string[];
  benefits: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
  stats?: { value: string; label: string }[];
  serviceCategories?: { title: string; items: string[] }[];
  guide?: { heading: string; intro?: string; points: string[] }[];
  testimonial?: { name: string; role: string; quote: string };
  sections?: {
    featuresEyebrow?: string;
    featuresHeading?: string;
    benefitsEyebrow?: string;
    benefitsHeading?: string;
    categoriesEyebrow?: string;
    categoriesHeading?: string;
    guideEyebrow?: string;
    guideHeading?: string;
    faqEyebrow?: string;
    faqHeading?: string;
    ctaHeading?: string;
    ctaBody?: string;
  };
};

const TINTS = [
  "bg-[#8db74e]/20 text-[#5f8a3e]",
  "bg-[#8db74e]/25 text-[#2f5560]",
  "bg-[#29484f]/12 text-[#29484f]",
];

/**
 * "Doing it yourself vs with us" comparison rows — the real decision a sole
 * trader (or any self-employed person) is weighing up: software cost, tax
 * saved, time saved, and the knowledge/compliance gap.
 */
const COMPARE = [
  {
    Icon: PoundSterling,
    dim: "Accounting software",
    diy: "Pay for FreeAgent yourself — that's £100s a year on top.",
    us: "FreeAgent included free, set up and ready to go.",
  },
  {
    Icon: TrendingUp,
    dim: "Tax savings",
    diy: "Easy to miss allowable expenses, reliefs and allowances.",
    us: "Proactive planning to claim every allowance — often saving more than we cost.",
  },
  {
    Icon: Clock,
    dim: "Your time",
    diy: "Evenings lost to receipts, spreadsheets and HMRC admin.",
    us: "We handle the books and filing, so you get your evenings back.",
  },
  {
    Icon: ShieldCheck,
    dim: "Knowledge & deadlines",
    diy: "MTD, National Insurance and filing dates — costly to get wrong.",
    us: "A named accountant keeps you compliant and filed on time, every time.",
  },
];

/** Final word of the headline in the Workwell lime→cyan→teal gradient. */
function gradientLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  const grad = "bg-gradient-to-r from-[#8db74e] via-[#8db74e] to-[#29484f] bg-clip-text text-transparent";
  if (words.length <= 1) return <span className={grad}>{text}</span>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className={grad}>{last}</span>
    </>
  );
}

/**
 * Workwell-branded service/audience page (sole trader, limited company, etc).
 * The layout/design lives here (code); the COPY comes from the brand-scoped
 * `servicePage` Sanity doc, falling back to de-Clevered legacy content so the
 * page looks right before it's authored in Studio.
 */
export default function WorkwellServicePage({ content, heroImage, variant = 0, slug }: { content: ServiceContent; heroImage?: string; variant?: number; slug?: string }) {
  const v = variant % 3;
  const brand = useBrand();
  const rating = brand.trustpilot?.rating ?? "4.6";
  const { title, headline, description, price, features, benefits, faqs, stats, serviceCategories, guide, testimonial, sections } = content;
  const s = sections ?? {};

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#eef4e2] via-[#f1f6e6] to-[#e4eed3]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-28 -right-20 w-[560px] h-[560px] rounded-full bg-[#8db74e]/40 blur-[110px]" />
          <div className="absolute top-10 right-1/3 w-[420px] h-[420px] rounded-full bg-[#8db74e]/40 blur-[110px]" />
          <div className="absolute -bottom-40 -left-24 w-[520px] h-[420px] rounded-full bg-[#29484f]/18 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: message */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur border border-white shadow-sm rounded-full pl-2 pr-4 py-1.5 text-sm text-[#29484f] font-semibold mb-6">
                <span className="flex items-center gap-0.5 bg-gradient-to-r from-[#8db74e]/20 to-[#8db74e]/20 rounded-full px-2 py-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span>Rated {rating} on Trustpilot</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-extrabold text-[#29484f] leading-[1.05] tracking-tight mb-5">
                {gradientLastWord(headline)}
              </h1>
              <p className="text-lg sm:text-xl text-[#5a6f74] leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5 rounded-xl shadow-lg shadow-[#8db74e]/30"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <RequestCallback
                  inline
                  label="Request a callback"
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#eef4e2] border border-[#8db74e]/40 text-[#29484f] font-semibold text-base px-6 py-3.5 rounded-xl transition-colors"
                />
              </div>

              <p className="text-[#6a7b80] text-sm mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#8db74e]" /> Free to set up</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#8db74e]" /> No minimum contract</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#8db74e]" /> Switch in minutes</span>
              </p>
            </div>

            {/* Right: a real, relatable client */}
            <div className="relative max-w-md mx-auto lg:max-w-none w-full">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#8db74e]/15 via-[#8db74e]/20 to-[#8db74e]/10 rounded-[2.5rem] blur-2xl hidden sm:block" />
              <div className="relative">
                <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-3 rounded-[2rem] bg-gradient-to-br from-[#8db74e]/40 to-[#8db74e]/40 hidden sm:block" />
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#29484f]/20 border-4 border-white">
                  <Image
                    src={heroImage || "/images/hero-accountant.jpg"}
                    alt={`${title} with Workwell`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                    priority
                  />
                </div>

                {price && (
                  <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white rounded-2xl px-5 py-3 shadow-xl border border-[#e4ecd6] -rotate-2 animate-float z-20">
                    <p className="text-[11px] text-[#6a7b80] font-medium">All-inclusive from</p>
                    <p className="text-xl font-extrabold text-[#29484f]">
                      £{price}<span className="text-xs font-semibold text-[#6a7b80]">/mo + VAT</span>
                    </p>
                  </div>
                )}

                <div className="absolute -top-4 -right-2 sm:-right-5 bg-[#8db74e] text-white rounded-2xl px-4 py-2.5 shadow-lg rotate-2 hidden sm:flex items-center gap-2.5 animate-float-delayed z-20">
                  <PhoneCall size={16} />
                  <div>
                    <p className="text-xs font-bold leading-tight">Your own accountant</p>
                    <p className="text-[11px] text-white/85">One call away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave fills into whatever follows: the dark stats band (when present)
            or the white section below — so there's no light/dark seam. */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-14">
            <path d="M0,60 C360,100 1080,10 1440,60 L1440,100 L0,100 Z" fill={stats && stats.length > 0 ? "#15282d" : "#ffffff"} />
          </svg>
        </div>
      </section>

      {/* ── Stats band (optional, dark) ───────────────────────────────── */}
      {stats && stats.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#15282d] to-[#1c333a] py-14">
          <div className="absolute -top-16 right-1/4 w-72 h-72 bg-[#8db74e]/12 rounded-full blur-3xl" />
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="block text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#e0e48e] to-[#8db74e] bg-clip-text text-transparent">
                    {s.value}
                  </span>
                  <p className="text-white/65 text-xs md:text-sm mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── What's included ───────────────────────────────────────────── */}
      {features && features.length > 0 && (
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">{s.featuresEyebrow || "Everything included"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
                {s.featuresHeading || `What you get with ${title}`}
              </h2>
            </div>
            {/* CSS columns auto-balance the bullets by height (and read
                top-to-bottom) rather than a row-flow grid that leaves the last
                column short with a gap. */}
            <div className={`mx-auto gap-x-8 ${v === 1 ? "max-w-4xl sm:columns-3" : "max-w-3xl sm:columns-2"}`}>
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3 break-inside-avoid mb-3.5">
                  <span className="w-6 h-6 rounded-full bg-[#8db74e]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} className="text-[#5f8a3e]" />
                  </span>
                  <span className="text-[#29484f] font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Key things to know (grounded; layout varies per page) ─────── */}
      {guide && guide.length > 0 && (() => {
        const gd = [
          { eyebrow: "The detail", heading: `${title}: what you need to know` },
          { eyebrow: "The essentials", heading: `Key things to know about ${title.toLowerCase()}` },
          { eyebrow: "Good to know", heading: `${title}, explained` },
        ][v];
        const Header = (
          <div className="text-center mb-12">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">{s.guideEyebrow || gd.eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">{s.guideHeading || gd.heading}</h2>
          </div>
        );
        const bullet = (pt: string, j: number) => (
          <li key={j} className="flex items-start gap-2.5 text-sm text-[#29484f] leading-relaxed">
            <CheckCircle2 size={15} className="text-[#5f8a3e] shrink-0 mt-0.5" />
            <span>{pt}</span>
          </li>
        );

        // Variant 1 — numbered white cards on a soft-green band
        if (v === 1) {
          return (
            <section className="bg-[#f4f8ec] py-20 md:py-24">
              <div className="max-w-4xl mx-auto px-4">
                {Header}
                <div className="space-y-5">
                  {guide.map((g, i) => (
                    <div key={g.heading} className="bg-white rounded-3xl border border-[#e4ecd6] p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.12)]">
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8db74e] to-[#8db74e] text-white font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-[#29484f] mb-1.5">{g.heading}</h3>
                          {g.intro && <p className="text-[#5a6f74] text-sm leading-relaxed mb-4">{g.intro}</p>}
                          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">{g.points.map(bullet)}</ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // Variant 2 — coloured left-border list in a narrow reading column
        if (v === 2) {
          return (
            <section className="bg-white pb-20 md:pb-24 -mt-4">
              <div className="max-w-3xl mx-auto px-4">
                {Header}
                <div className="space-y-7">
                  {guide.map((g, i) => (
                    <div key={g.heading} className={`border-l-4 pl-5 sm:pl-6 ${["border-[#8db74e]", "border-[#8db74e]", "border-[#29484f]"][i % 3]}`}>
                      <h3 className="text-xl font-bold text-[#29484f] mb-1.5">{g.heading}</h3>
                      {g.intro && <p className="text-[#5a6f74] text-sm leading-relaxed mb-3">{g.intro}</p>}
                      <ul className="space-y-2.5">{g.points.map(bullet)}</ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // Variant 0 — tinted icon cards, two columns
        return (
          <section className="bg-white pb-20 md:pb-24 -mt-4">
            <div className="max-w-6xl mx-auto px-4">
              {Header}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.map((g, i) => (
                  <div key={g.heading} className="bg-[#f8faf2] rounded-3xl p-7 border border-[#e4ecd6]">
                    <h3 className="text-lg md:text-xl font-bold text-[#29484f] mb-2.5 flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl ${TINTS[i % TINTS.length]} flex items-center justify-center shrink-0`}>
                        <CheckCircle2 size={18} />
                      </span>
                      {g.heading}
                    </h3>
                    {g.intro && <p className="text-[#5a6f74] text-sm leading-relaxed mb-4">{g.intro}</p>}
                    <ul className="space-y-2.5">{g.points.map(bullet)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Benefits ──────────────────────────────────────────────────── */}
      {benefits && benefits.length > 0 && (
        <section className="bg-[#f4f8ec] py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">{s.benefitsEyebrow || "Why us"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
                {s.benefitsHeading || "The difference a dedicated accountant makes"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={b.title}
                  className="bg-white rounded-3xl p-6 border border-[#e4ecd6] shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]"
                >
                  <span className={`w-11 h-11 rounded-2xl ${TINTS[i % TINTS.length]} flex items-center justify-center mb-4`}>
                    <CheckCircle2 size={20} />
                  </span>
                  <h3 className="text-lg font-bold text-[#29484f] mb-2">{b.title}</h3>
                  <p className="text-[#5a6f74] text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DIY vs done-for-you comparison ────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f3f8e8] via-white to-white py-20 md:py-24">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[680px] h-72 bg-[#8db74e]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">DIY vs done-for-you</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Going it alone vs having us in your corner
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              You can absolutely do your own books. Here&apos;s what actually changes when a
              dedicated accountant takes it off your plate.
            </p>
          </div>

          <div className="relative grid md:grid-cols-2 gap-5 lg:gap-12 max-w-5xl mx-auto items-stretch">
            {/* On your own — muted "loser" */}
            <div className="rounded-3xl border-2 border-[#e4ecd6] bg-[#f7f8f3] p-7 md:p-8">
              <div className="flex items-center gap-3 mb-7">
                <span className="w-11 h-11 rounded-2xl bg-[#d9846f]/15 text-[#c75f47] flex items-center justify-center">
                  <X size={22} strokeWidth={2.5} />
                </span>
                <h3 className="text-xl font-extrabold text-[#5a6f74]">Doing it yourself</h3>
              </div>
              <div className="divide-y divide-[#e4ecd6]">
                {COMPARE.map((row) => (
                  <div key={row.dim} className="flex gap-3.5 py-4 first:pt-0 last:pb-0 min-h-[96px]">
                    <span className="w-11 h-11 shrink-0 rounded-2xl bg-white border border-[#e4ecd6] text-[#9aa6a0] flex items-center justify-center mt-0.5">
                      <row.Icon size={19} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-[#465c61]">{row.dim}</p>
                        <X size={15} strokeWidth={3} className="text-[#d9846f] shrink-0" />
                      </div>
                      <p className="text-[#6a7b80] text-sm leading-relaxed mt-1">{row.diy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS badge */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-[#29484f] ring-4 ring-white shadow-xl items-center justify-center">
              <span className="text-sm font-extrabold tracking-wider text-[#e0e48e]">VS</span>
            </div>

            {/* With us — bold dark-teal winner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#29484f] via-[#29484f] to-[#16282d] p-7 md:p-8 shadow-2xl shadow-[#29484f]/40 ring-1 ring-[#8db74e]/40">
              <div className="absolute -top-12 -right-10 w-56 h-56 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-[#e0e48e]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-7 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-2xl bg-[#8db74e] text-white flex items-center justify-center shadow-lg shadow-[#8db74e]/30">
                      <CheckCircle2 size={22} strokeWidth={2.5} />
                    </span>
                    <h3 className="text-xl font-extrabold text-white whitespace-nowrap">With {brand.name.split(" ")[0]}</h3>
                  </div>
                  <span className="hidden sm:inline-flex shrink-0 rounded-full bg-[#e0e48e] text-[#29484f] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 shadow">
                    Recommended
                  </span>
                </div>
                <div className="divide-y divide-white/10">
                  {COMPARE.map((row) => (
                    <div key={row.dim} className="flex gap-3.5 py-4 first:pt-0 last:pb-0 min-h-[96px]">
                      <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#8db74e]/25 text-[#e0e48e] flex items-center justify-center mt-0.5">
                        <row.Icon size={19} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-white">{row.dim}</p>
                          <CheckCircle2 size={15} strokeWidth={3} className="text-[#bce26a] shrink-0" />
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mt-1">{row.us}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-line verdict — the powerful close */}
          <div className="relative overflow-hidden mt-10 md:mt-12 max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#29484f] via-[#29484f] to-[#16282d] p-8 md:p-11 ring-1 ring-[#8db74e]/40 shadow-2xl shadow-[#29484f]/40">
            <div className="absolute -top-16 right-0 w-72 h-72 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-[#e0e48e]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-7 text-center lg:text-left">
              <div>
                <p className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.18em] mb-3">The bottom line</p>
                <p className="text-white text-2xl md:text-[2rem] font-extrabold leading-[1.15] max-w-2xl">
                  Free software, more tax saved and your time back
                  {price ? (
                    <> — for just <span className="text-[#bce26a]">£{price}/mo</span>.</>
                  ) : (
                    <> — for one simple monthly fee.</>
                  )}
                </p>
                <p className="text-white/70 mt-3 text-sm md:text-base">
                  Most clients save more in tax and software than they pay us. Switching takes minutes.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="shrink-0 inline-flex items-center gap-2 bg-[#8db74e] hover:bg-[#7ba63f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/30 transition-colors"
              >
                Get started free <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slug-specific sections ────────────────────────────────────── */}
      {slug === "contractor-accountancy" && <ContractorCalculator />}
      {slug === "cis-accounting" && <WorkwellCisExtras />}

      {/* ── What we do (service categories, optional) ─────────────────── */}
      {serviceCategories && serviceCategories.length > 0 && (
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">{s.categoriesEyebrow || "What we handle"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">{s.categoriesHeading || "Everything, sorted"}</h2>
            </div>
            {/* Column count follows the card count so the last row isn't
                stranded: 6 cards → balanced 3×2, 4 cards → a single row of 4. */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${serviceCategories.length % 3 === 0 ? "lg:grid-cols-3 max-w-5xl mx-auto" : "lg:grid-cols-4"} gap-6`}>
              {serviceCategories.map((cat, i) => (
                <div key={cat.title} className="rounded-3xl border border-[#e4ecd6] overflow-hidden">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${["from-[#8db74e] to-[#e0e48e]", "from-[#8db74e] to-[#cde3a3]", "from-[#29484f] to-[#4a6a72]", "from-[#8db74e] to-[#8db74e]"][i % 4]}`} />
                  <div className="p-6">
                    <h3 className="text-base font-bold text-[#29484f] mb-4">{cat.title}</h3>
                    <ul className="space-y-2.5">
                      {cat.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm text-[#29484f]">
                          <CheckCircle2 size={15} className="text-[#5f8a3e] shrink-0 mt-0.5" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonial (optional) ────────────────────────────────────── */}
      {testimonial && testimonial.quote && (
        <section className="bg-[#f4f8ec] py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#e4ecd6] shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)] text-center">
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-[#29484f] italic leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="font-bold text-[#29484f]">{testimonial.name}</p>
              <p className="text-sm text-[#6a7b80]">{testimonial.role}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ (dark) ────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#15282d] to-[#1c333a] py-20 md:py-24">
          <div className="absolute -top-20 -right-16 w-80 h-80 bg-[#8db74e]/15 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#e0e48e] font-bold text-sm uppercase tracking-wider">{s.faqEyebrow || "Good to know"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">{s.faqHeading || "Questions, answered"}</h2>
            </div>
            <PricingFAQ faqs={faqs.map((f, i) => ({ _id: String(i), question: f.q, answer: f.a }))} />
          </div>
        </section>
      )}

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-[#1c333a] via-[#29484f] to-[#29484f] rounded-[2rem] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#8db74e]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-[#8db74e]/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
                {s.ctaHeading || `Ready to get ${title.toLowerCase()} sorted?`}
              </h2>
              <p className="text-white/75 text-lg mb-9 max-w-2xl mx-auto">
                {s.ctaBody ||
                  "A dedicated accountant, unlimited advice and free software — one simple monthly fee. Set up in minutes."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4 rounded-xl shadow-lg shadow-[#8db74e]/25">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <a
                  href={`tel:${brand.freephone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
                >
                  <PhoneCall size={18} /> Call {brand.freephone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
