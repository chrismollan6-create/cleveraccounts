"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import RequestCallback from "@/components/ui/RequestCallback";
import type { CmsHomePage } from "./HomePageClient";

/** Wrap the final word of a headline in a vibrant lime→cyan→teal gradient. */
function gradientLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  const grad =
    "bg-gradient-to-r from-[#9cbf50] via-[#71c5d6] to-[#32535a] bg-clip-text text-transparent";
  if (words.length <= 1) return <span className={grad}>{text}</span>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className={grad}>{last}</span>
    </>
  );
}

interface WorkwellHeroProps {
  home?: CmsHomePage | null;
  trustBadge: string;
}

/**
 * Workwell homepage hero — bold, colourful, B2C. Uses the full Workwell palette
 * (lime / cyan / teal) over a soft mesh background with a layered card visual.
 * Floating chips are positioned OUTSIDE the card silhouette (above / below) so
 * they never obscure the card header, price or CTA.
 */
export default function WorkwellHero({ home, trustBadge }: WorkwellHeroProps) {
  const brand = useBrand();
  const rating = brand.trustpilot?.rating ?? "4.6";

  const included = [
    "Your own named accountant — not a call centre",
    "Unlimited advice, answered fast",
    "Free accounting software",
    "All your tax returns filed",
    "Proactive tax-saving advice",
  ];

  const audience: { label: string; tint: string }[] = [
    { label: "Sole Traders", tint: "bg-[#9cbf50]/25 text-[#566a33]" },
    { label: "Limited Companies", tint: "bg-[#71c5d6]/30 text-[#235c68]" },
    { label: "Contractors", tint: "bg-[#32535a]/15 text-[#2c4a51]" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eef4e2] via-[#f1f6e6] to-[#e4eed3]">
      {/* ── Vibrant mesh background ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-20 w-[640px] h-[640px] rounded-full bg-[#9cbf50]/45 blur-[110px]" />
        <div className="absolute top-8 right-1/3 w-[480px] h-[480px] rounded-full bg-[#71c5d6]/45 blur-[110px]" />
        <div className="absolute -bottom-44 left-1/4 w-[620px] h-[420px] rounded-full bg-[#32535a]/22 blur-[120px]" />
        <div className="absolute -bottom-40 -left-28 w-[560px] h-[560px] rounded-full bg-[#4d7079]/20 blur-[120px]" />
        <div className="absolute top-1/3 left-[8%] w-72 h-72 rounded-full bg-[#bdd289]/45 blur-[90px]" />
        <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-[#9cbf50] animate-float opacity-70" />
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 rounded-full bg-[#71c5d6] animate-float-delayed opacity-80" />
        <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-[#32535a] animate-float opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Left: message ─────────────────────────────────────────── */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur border border-white shadow-sm rounded-full pl-2 pr-4 py-1.5 text-sm text-[#2c4a51] font-semibold mb-7">
              <span className="flex items-center gap-0.5 bg-gradient-to-r from-[#9cbf50]/20 to-[#71c5d6]/20 rounded-full px-2 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span>{trustBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.4rem] font-extrabold text-[#2c4a51] leading-[1.05] tracking-tight mb-6">
              {home?.heroHeadline ? (
                gradientLastWord(home.heroHeadline)
              ) : (
                <>
                  An accountant who actually{" "}
                  <span className="bg-gradient-to-r from-[#9cbf50] via-[#71c5d6] to-[#32535a] bg-clip-text text-transparent">
                    answers.
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-[#5a6f74] leading-relaxed mb-7 max-w-xl">
              {home?.heroSubheadline ||
                "No call centres. No chasing for replies. Just a dedicated accountant who knows your business inside out — and everything handled for one simple monthly fee."}
            </p>

            {/* Audience — coloured chips */}
            <div className="flex flex-wrap items-center gap-2.5 mb-9">
              {audience.map((a) => (
                <span
                  key={a.label}
                  className={`inline-flex items-center gap-1.5 ${a.tint} rounded-full px-3.5 py-1.5 text-sm font-bold`}
                >
                  <CheckCircle2 size={14} />
                  {a.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5 rounded-xl shadow-lg shadow-[#9cbf50]/30"
              >
                {home?.heroCTA || "Get Started"}
                <ArrowRight size={18} />
              </Link>
              <RequestCallback
                inline
                label="Request a callback"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#eef4e2] border border-[#71c5d6]/40 text-[#2c4a51] font-semibold text-base px-6 py-3.5 rounded-xl transition-colors"
              />
            </div>

            <p className="text-[#6a7b80] text-sm mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#71c5d6]" /> Free to set up</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#9cbf50]" /> No minimum contract</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#71c5d6]" /> Switch in minutes</span>
            </p>

            {/* Human proof — reinforces the "we actually answer" promise */}
            <div className="flex items-center gap-3.5 mt-8">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white shadow-md shrink-0">
                <Image
                  src="/images/hero-accountant.jpg"
                  alt="Speak to a real accountant by phone"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-[#5a6f74] leading-snug">
                <span className="font-bold text-[#2c4a51]">Speak to a real person</span>
                <br />
                A named accountant on the line — never a call centre, never a bot.
              </p>
            </div>
          </div>

          {/* ── Right: layered card visual ────────────────────────────── */}
          <div className="relative lg:pl-4">
            {/* Decorative colour ring behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[118%] h-[118%] rounded-[3rem] bg-gradient-to-tr from-[#9cbf50]/10 via-[#71c5d6]/15 to-[#9cbf50]/10 blur-2xl hidden sm:block" />

            {/* card + tilted backdrop, dropped down to leave headroom for top chips */}
            <div className="relative mt-14 sm:mt-12">
              <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-3 rounded-[2rem] bg-gradient-to-br from-[#71c5d6]/40 to-[#9cbf50]/40 hidden sm:block" />

              <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-[#2c4a51]/15 border border-white overflow-hidden">
                {/* Gradient header strip */}
                <div className="bg-gradient-to-r from-[#32535a] via-[#3f6b73] to-[#71c5d6] px-7 py-5 flex items-center gap-2 text-white">
                  <Sparkles size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Everything included</span>
                </div>

                <div className="p-7">
                  <p className="text-2xl font-extrabold text-[#2c4a51] mb-6">
                    One accountant who actually replies.
                  </p>

                  <ul className="space-y-3.5 mb-7">
                    {included.map((item, i) => (
                      <li key={item} className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            i % 2 === 0 ? "bg-[#9cbf50]/20 text-[#6f8052]" : "bg-[#71c5d6]/25 text-[#2c6470]"
                          }`}
                        >
                          <CheckCircle2 size={15} />
                        </span>
                        <span className="text-[#3f565b] font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-end justify-between pt-6 border-t border-[#eef2e4]">
                    <div>
                      <p className="text-xs text-[#6a7b80] font-medium">Plans from</p>
                      <p className="text-3xl font-extrabold text-[#2c4a51]">
                        £42.50<span className="text-base font-semibold text-[#6a7b80]">/mo + VAT</span>
                      </p>
                    </div>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 bg-[#9cbf50]/15 text-[#5d7038] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#9cbf50]/25 transition-colors"
                    >
                      See pricing <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating chip — Trustpilot (above card, top-left) */}
            <div className="absolute top-0 left-2 sm:left-6 bg-white rounded-2xl px-4 py-2.5 shadow-xl border border-[#e4ecd6] -rotate-3 animate-float z-20">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-bold text-[#2c4a51] ml-1">{rating}</span>
              </div>
              <p className="text-[11px] text-[#6a7b80] mt-0.5">Excellent on Trustpilot</p>
            </div>

            {/* Floating chip — MTD ready (cyan, above card, top-right) */}
            <div className="absolute top-1 right-2 sm:right-4 bg-[#71c5d6] text-white rounded-2xl px-4 py-2.5 shadow-lg rotate-2 hidden sm:flex items-center gap-2.5 animate-float-delayed z-20">
              <FileCheck2 size={18} />
              <div>
                <p className="text-xs font-bold leading-tight">Making Tax Digital</p>
                <p className="text-[11px] text-white/85">Ready &amp; compliant</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Wave divider into the next (white) section */}
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0,60 C360,100 1080,10 1440,60 L1440,100 L0,100 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
