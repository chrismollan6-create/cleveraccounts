"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import RequestCallback from "@/components/ui/RequestCallback";
import type { CmsHomePage } from "./HomePageClient";

/** Wrap the final word of a headline in the brand gradient. */
function gradientLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return <span className="text-gradient">{text}</span>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="text-gradient">{last}</span>
    </>
  );
}

interface WorkwellHeroProps {
  home?: CmsHomePage | null;
  trustBadge: string;
}

/**
 * Workwell-specific homepage hero. Deliberately a different design language
 * from Clever's dark, corporate hero: light, bright and approachable to suit a
 * B2C audience of sole traders, limited companies and contractors. Copy comes
 * from the brand-scoped homePage Sanity doc, with Workwell-flavoured fallbacks.
 */
export default function WorkwellHero({ home, trustBadge }: WorkwellHeroProps) {
  const brand = useBrand();
  const rating = brand.trustpilot?.rating ?? "4.6";

  const included = [
    "Your own dedicated accountant",
    "Unlimited phone & email advice",
    "Free accounting software",
    "All your tax returns filed",
    "Proactive tax-saving advice",
  ];

  return (
    <section className="relative overflow-hidden bg-[#f4f8ec]">
      {/* Soft brand-tinted background flourishes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-[460px] h-[460px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-secondary animate-float opacity-60" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-primary animate-float-delayed opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: message ─────────────────────────────────────────── */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-primary/15 shadow-sm rounded-full px-4 py-2 text-sm text-primary font-semibold mb-7">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>{trustBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-extrabold text-[#2c4a51] leading-[1.07] tracking-tight mb-6">
              {home?.heroHeadline ? (
                gradientLastWord(home.heroHeadline)
              ) : (
                <>
                  Accounting that lets you get on with{" "}
                  <span className="text-gradient">business.</span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-[#5a6f74] leading-relaxed mb-8 max-w-xl">
              {home?.heroSubheadline ||
                "A dedicated accountant, unlimited advice and free software — all for one simple monthly fee. Built for the self-employed, limited companies and contractors."}
            </p>

            {/* Audience line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-9 text-sm font-semibold text-[#2c4a51]">
              {["Sole Traders", "Limited Companies", "Contractors"].map((a, i) => (
                <span key={a} className="inline-flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-secondary" />}
                  {a}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5 rounded-xl"
              >
                {home?.heroCTA || "Get Started"}
                <ArrowRight size={18} />
              </Link>
              <RequestCallback
                inline
                label="Request a callback"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#eef4e2] border border-primary/20 text-primary font-semibold text-base px-6 py-3.5 rounded-xl transition-colors"
              />
            </div>

            <p className="text-[#6a7b80] text-sm mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-secondary" /> Free to set up</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-secondary" /> No minimum contract</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-secondary" /> Switch in minutes</span>
            </p>
          </div>

          {/* ── Right: value card ─────────────────────────────────────── */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#2c4a51]/10 border border-[#e4ecd6]">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Sparkles size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Everything included</span>
              </div>
              <p className="text-2xl font-extrabold text-[#2c4a51] mb-6">
                One accountant. One simple fee.
              </p>

              <ul className="space-y-3.5 mb-7">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={15} className="text-[#6f8052]" />
                    </span>
                    <span className="text-[#3f565b] font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-end justify-between pt-6 border-t border-[#eef2e4]">
                <div>
                  <p className="text-xs text-[#6a7b80] font-medium">Plans from</p>
                  <p className="text-3xl font-extrabold text-[#2c4a51]">
                    £42.50
                    <span className="text-base font-semibold text-[#6a7b80]">/mo</span>
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:gap-2.5 transition-all"
                >
                  See pricing <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Floating "regulated" card */}
            <div className="absolute -top-4 -left-5 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#e4ecd6] hidden sm:flex items-center gap-2.5 animate-float">
              <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-primary" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#2c4a51] leading-tight">Qualified &amp; regulated</p>
                <p className="text-[11px] text-[#6a7b80]">Your accounts in safe hands</p>
              </div>
            </div>

            {/* Floating "Trustpilot" card */}
            <div className="absolute -bottom-5 -right-3 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#e4ecd6] hidden sm:block animate-float-delayed">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-bold text-[#2c4a51] ml-1">{rating}</span>
              </div>
              <p className="text-[11px] text-[#6a7b80] mt-0.5">Rated excellent on Trustpilot</p>
            </div>

            {/* Floating "callback" pill */}
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-primary text-white rounded-full px-4 py-2 shadow-lg hidden lg:flex items-center gap-2 animate-float">
              <PhoneCall size={14} />
              <span className="text-xs font-semibold">Talk to a real accountant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Soft wave divider into the next section */}
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0,60 C360,100 1080,10 1440,60 L1440,100 L0,100 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
