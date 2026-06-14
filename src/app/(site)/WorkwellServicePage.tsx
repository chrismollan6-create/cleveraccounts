"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  PhoneCall,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import PricingFAQ from "@/components/ui/PricingFAQ";
import RequestCallback from "@/components/ui/RequestCallback";

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
  "bg-[#9cbf50]/20 text-[#6f8052]",
  "bg-[#71c5d6]/25 text-[#2c6470]",
  "bg-[#32535a]/12 text-[#2c4a51]",
];

/** Final word of the headline in the Workwell lime→cyan→teal gradient. */
function gradientLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  const grad = "bg-gradient-to-r from-[#9cbf50] via-[#71c5d6] to-[#32535a] bg-clip-text text-transparent";
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
export default function WorkwellServicePage({ content, heroImage, variant = 0 }: { content: ServiceContent; heroImage?: string; variant?: number }) {
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
          <div className="absolute -top-28 -right-20 w-[560px] h-[560px] rounded-full bg-[#9cbf50]/40 blur-[110px]" />
          <div className="absolute top-10 right-1/3 w-[420px] h-[420px] rounded-full bg-[#71c5d6]/40 blur-[110px]" />
          <div className="absolute -bottom-40 -left-24 w-[520px] h-[420px] rounded-full bg-[#32535a]/18 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: message */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur border border-white shadow-sm rounded-full pl-2 pr-4 py-1.5 text-sm text-[#2c4a51] font-semibold mb-6">
                <span className="flex items-center gap-0.5 bg-gradient-to-r from-[#9cbf50]/20 to-[#71c5d6]/20 rounded-full px-2 py-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span>Rated {rating} on Trustpilot</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-extrabold text-[#2c4a51] leading-[1.05] tracking-tight mb-5">
                {gradientLastWord(headline)}
              </h1>
              <p className="text-lg sm:text-xl text-[#5a6f74] leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5 rounded-xl shadow-lg shadow-[#9cbf50]/30"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <RequestCallback
                  inline
                  label="Request a callback"
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#eef4e2] border border-[#71c5d6]/40 text-[#2c4a51] font-semibold text-base px-6 py-3.5 rounded-xl transition-colors"
                />
              </div>

              <p className="text-[#6a7b80] text-sm mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#71c5d6]" /> Free to set up</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#9cbf50]" /> No minimum contract</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#71c5d6]" /> Switch in minutes</span>
              </p>
            </div>

            {/* Right: a real, relatable client */}
            <div className="relative max-w-md mx-auto lg:max-w-none w-full">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#9cbf50]/15 via-[#71c5d6]/20 to-[#9cbf50]/10 rounded-[2.5rem] blur-2xl hidden sm:block" />
              <div className="relative">
                <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-3 rounded-[2rem] bg-gradient-to-br from-[#71c5d6]/40 to-[#9cbf50]/40 hidden sm:block" />
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#2c4a51]/20 border-4 border-white">
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
                    <p className="text-xl font-extrabold text-[#2c4a51]">
                      £{price}<span className="text-xs font-semibold text-[#6a7b80]">/mo + VAT</span>
                    </p>
                  </div>
                )}

                <div className="absolute -top-4 -right-2 sm:-right-5 bg-[#71c5d6] text-white rounded-2xl px-4 py-2.5 shadow-lg rotate-2 hidden sm:flex items-center gap-2.5 animate-float-delayed z-20">
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

        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-14">
            <path d="M0,60 C360,100 1080,10 1440,60 L1440,100 L0,100 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Stats band (optional, dark) ───────────────────────────────── */}
      {stats && stats.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2426] to-[#243b40] py-14">
          <div className="absolute -top-16 right-1/4 w-72 h-72 bg-[#9cbf50]/12 rounded-full blur-3xl" />
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="block text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#9cbf50] to-[#71c5d6] bg-clip-text text-transparent">
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
              <span className="text-[#6f8052] font-bold text-sm uppercase tracking-wider">{s.featuresEyebrow || "Everything included"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2c4a51] mt-3">
                {s.featuresHeading || `What you get with ${title}`}
              </h2>
            </div>
            <div className={`grid grid-cols-1 gap-x-8 gap-y-3.5 mx-auto ${v === 1 ? "sm:grid-cols-3 max-w-4xl" : "sm:grid-cols-2 max-w-3xl"}`}>
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#9cbf50]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} className="text-[#6f8052]" />
                  </span>
                  <span className="text-[#3f565b] font-medium">{f}</span>
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
            <span className="text-[#6f8052] font-bold text-sm uppercase tracking-wider">{s.guideEyebrow || gd.eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2c4a51] mt-3">{s.guideHeading || gd.heading}</h2>
          </div>
        );
        const bullet = (pt: string, j: number) => (
          <li key={j} className="flex items-start gap-2.5 text-sm text-[#3f565b] leading-relaxed">
            <CheckCircle2 size={15} className="text-[#6f8052] shrink-0 mt-0.5" />
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
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9cbf50] to-[#71c5d6] text-white font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-[#2c4a51] mb-1.5">{g.heading}</h3>
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
                    <div key={g.heading} className={`border-l-4 pl-5 sm:pl-6 ${["border-[#9cbf50]", "border-[#71c5d6]", "border-[#32535a]"][i % 3]}`}>
                      <h3 className="text-xl font-bold text-[#2c4a51] mb-1.5">{g.heading}</h3>
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
                    <h3 className="text-lg md:text-xl font-bold text-[#2c4a51] mb-2.5 flex items-center gap-3">
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
              <span className="text-[#6f8052] font-bold text-sm uppercase tracking-wider">{s.benefitsEyebrow || "Why us"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2c4a51] mt-3">
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
                  <h3 className="text-lg font-bold text-[#2c4a51] mb-2">{b.title}</h3>
                  <p className="text-[#5a6f74] text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── What we do (service categories, optional) ─────────────────── */}
      {serviceCategories && serviceCategories.length > 0 && (
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#6f8052] font-bold text-sm uppercase tracking-wider">{s.categoriesEyebrow || "What we handle"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2c4a51] mt-3">{s.categoriesHeading || "Everything, sorted"}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceCategories.map((cat, i) => (
                <div key={cat.title} className="rounded-3xl border border-[#e4ecd6] overflow-hidden">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${["from-[#9cbf50] to-[#bdd289]", "from-[#71c5d6] to-[#a5dde8]", "from-[#32535a] to-[#4d7079]", "from-[#9cbf50] to-[#71c5d6]"][i % 4]}`} />
                  <div className="p-6">
                    <h3 className="text-base font-bold text-[#2c4a51] mb-4">{cat.title}</h3>
                    <ul className="space-y-2.5">
                      {cat.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm text-[#3f565b]">
                          <CheckCircle2 size={15} className="text-[#6f8052] shrink-0 mt-0.5" />
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
              <p className="text-lg md:text-xl text-[#3f565b] italic leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="font-bold text-[#2c4a51]">{testimonial.name}</p>
              <p className="text-sm text-[#6a7b80]">{testimonial.role}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ (dark) ────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2426] to-[#243b40] py-20 md:py-24">
          <div className="absolute -top-20 -right-16 w-80 h-80 bg-[#71c5d6]/15 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#9cbf50] font-bold text-sm uppercase tracking-wider">{s.faqEyebrow || "Good to know"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">{s.faqHeading || "Questions, answered"}</h2>
            </div>
            <PricingFAQ faqs={faqs.map((f, i) => ({ _id: String(i), question: f.q, answer: f.a }))} />
          </div>
        </section>
      )}

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-[#243b40] via-[#2c4a51] to-[#32535a] rounded-[2rem] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#9cbf50]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-[#71c5d6]/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
                {s.ctaHeading || `Ready to get ${title.toLowerCase()} sorted?`}
              </h2>
              <p className="text-white/75 text-lg mb-9 max-w-2xl mx-auto">
                {s.ctaBody ||
                  "A dedicated accountant, unlimited advice and free software — one simple monthly fee. Set up in minutes."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4 rounded-xl shadow-lg shadow-[#9cbf50]/25">
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
