"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Star, Phone, ChevronDown,
  Award, Users, TrendingUp, Headphones, Zap, Shield,
  FileText, BarChart2, Building2, MessageSquare, Calculator, Tag,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import type { ServicePageData } from "@/lib/service-page-data";

const BENEFIT_ICONS = [Award, TrendingUp, Shield, Headphones, Zap, Users];
const CATEGORY_ICONS = [FileText, BarChart2, Calculator, Building2, Shield, MessageSquare];

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

export default function ServicePageTemplate({ data, children, promoBadge }: { data: ServicePageData; children?: React.ReactNode; promoBadge?: string | null }) {
  const colCount = data.serviceCategories
    ? data.serviceCategories.length <= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
    : "";

  return (
    <>
      {/* ═══════════════════════════════════
          HERO
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark min-h-[60vh] flex items-center">
        {/* Background blobs + dots */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/15 animate-blob" />
          <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] bg-accent/8 animate-blob blob-shape-2" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 pattern-dots" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider mb-4 block">
                {data.title}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                {data.headline.split(" ").map((word, i, arr) =>
                  i === arr.length - 1
                    ? <span key={i} className="text-gradient">{word}</span>
                    : <span key={i}>{word} </span>
                )}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
                {data.description}
              </p>
              {promoBadge && (
                <div className="inline-flex items-center gap-1.5 bg-secondary/20 border border-secondary/40 text-secondary rounded-lg px-3 py-1.5 text-xs font-bold mb-6">
                  <Tag size={12} className="shrink-0" />
                  {promoBadge}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
                >
                  Get Started — £{data.price}/mo <ArrowRight size={22} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-5 rounded-2xl text-lg hover:bg-white/10 transition-all"
                >
                  View All Pricing
                </Link>
              </div>
              <p className="text-slate-500 text-sm mt-5 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> No minimum contract</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> Cancel anytime</span>
              </p>
            </div>

            {/* Right — image */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-accountant.jpg"
                  alt="Your dedicated accountant"
                  className="w-full h-[480px] object-cover"
                />
                {/* Overlay to blend with dark bg */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              </div>

              {/* Floating rating card */}
              <div className="absolute -top-4 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float z-10">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-black text-dark ml-1">5.0</span>
                </div>
                <p className="text-xs text-text-light">from 10,000+ happy clients</p>
              </div>

              {/* Floating "available" card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-5 py-4 shadow-xl animate-float-delayed z-10">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">CA</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark">Your accountant is ready</p>
                    <p className="text-xs text-text-light">Unlimited calls & emails included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave out */}
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
              { value: "10,000+", label: "Businesses Trust Us" },
              { value: "20+", label: "Years Experience" },
              { value: "£0", label: "Setup Fees" },
              { value: "5.0★", label: "Average Rating" },
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
          WHAT'S INCLUDED
          ═══════════════════════════════════ */}
      <section className="bg-white py-16 md:py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Everything Covered</span>
            <h2 className="text-3xl md:text-4xl font-black text-dark mt-3 mb-4">
              What&apos;s Included for <span className="text-gradient">£{data.price}/month</span>
            </h2>
            <p className="text-text-light max-w-xl mx-auto">No hidden costs, no extras. This is everything in your package.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {data.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border card-hover">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <span className="text-text font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          LIFESTYLE IMAGE — split section
          ═══════════════════════════════════ */}
      {data.lifestyleImage && (
        <section className="bg-white py-16 md:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.lifestyleImage.src}
                  alt={data.lifestyleImage.alt}
                  className="w-full h-[420px] object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider mb-4 block">The Clever Accounts Way</span>
                <h2 className="text-3xl md:text-4xl font-black text-dark mb-6 leading-tight">
                  {data.lifestyleImage.heading}
                </h2>
                <p className="text-lg text-text-light leading-relaxed mb-8">
                  {data.lifestyleImage.body}
                </p>
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 rounded-2xl"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          STATS — dark section
          ═══════════════════════════════════ */}
      {data.stats && (
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 gradient-dark" />
          <div className="absolute inset-0 pattern-dots opacity-5" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blob-shape animate-blob" />
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-primary font-bold text-sm uppercase tracking-wider">By the Numbers</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
                Why Clients Choose <span className="text-gradient">Clever Accounts</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {data.stats.map((s) => (
                <div key={s.value} className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
                  <div className="text-4xl font-black text-gradient mb-2">{s.value}</div>
                  <p className="text-sm text-white/50 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          WHY CHOOSE — light section
          ═══════════════════════════════════ */}
      <section className="gradient-warm-section py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Why Clever Accounts?</span>
            <h2 className="text-3xl md:text-4xl font-black text-dark mt-3">
              20+ Years. <span className="text-gradient">Still Getting Better.</span>
            </h2>
            <p className="text-text-light max-w-xl mx-auto mt-4">
              We&apos;ve been helping businesses like yours since before most accounting apps existed. Here&apos;s what makes us different.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.benefits.map((benefit, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
              return (
                <div key={benefit.title} className="bg-white rounded-2xl border border-border p-6 shadow-sm card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-dark mb-2">{benefit.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          LIFESTYLE IMAGE 2 — flipped
          ═══════════════════════════════════ */}
      {data.lifestyleImage2 && (
        <section className="bg-white py-16 md:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider mb-4 block">Built for You</span>
                <h2 className="text-3xl md:text-4xl font-black text-dark mb-6 leading-tight">
                  {data.lifestyleImage2.heading}
                </h2>
                <p className="text-lg text-text-light leading-relaxed mb-8">
                  {data.lifestyleImage2.body}
                </p>
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 rounded-2xl"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.lifestyleImage2.src}
                  alt={data.lifestyleImage2.alt}
                  className="w-full h-[420px] object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          SERVICE CATEGORIES — dark section
          ═══════════════════════════════════ */}
      {data.serviceCategories && (
        <section className="relative overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 gradient-dark" />
          <div className="absolute inset-0 pattern-dots opacity-5" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-primary/8 blob-shape-2 animate-blob" style={{ animationDelay: "2s" }} />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Full Service</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
                Everything We Handle <span className="text-gradient">For You</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mt-4">
                One fixed monthly fee covers all of this. Nothing is ever charged as an extra.
              </p>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${colCount} gap-4`}>
              {data.serviceCategories.map((cat, i) => {
                const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
                return (
                  <div key={cat.title} className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <h3 className="font-bold text-white">{cat.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                          <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wave out */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
              <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white" />
            </svg>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          EXTRA PAGE CONTENT (e.g. calculator)
          ═══════════════════════════════════ */}
      {children}

      {/* ═══════════════════════════════════
          PRICING CTA
          ═══════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="gradient-cta rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="relative">
              <p className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-2">{data.title}</p>
              <div className="text-6xl font-black text-white my-3">
                £{data.price}<span className="text-2xl text-white/60">/month</span>
              </div>
              <p className="text-white/75 mb-8">No setup fees. No minimum contract. Cancel anytime.</p>
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
            &ldquo;{data.testimonial.quote}&rdquo;
          </blockquote>
          <p className="font-bold text-dark">{data.testimonial.name}</p>
          <p className="text-sm text-text-light">{data.testimonial.role}</p>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FAQ — dark section
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Wave out */}
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
          <span className="text-primary font-bold text-sm uppercase tracking-wider">Ready?</span>
          <h2 className="text-3xl md:text-4xl font-black text-dark mt-3 mb-4">
            Join 10,000+ Businesses Who <span className="text-gradient">Trust Clever Accounts</span>
          </h2>
          <p className="text-text-light mb-10 max-w-xl mx-auto">
            Start today — no setup fees, no contract, and your dedicated accountant is ready to take over.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
            >
              Get Started <ArrowRight size={20} />
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
