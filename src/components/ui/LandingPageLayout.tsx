"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Phone, Star, Shield, Sparkles,
  ChevronDown, Award, Users, TrendingUp, Headphones, Zap, Clock, AlertCircle,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export interface WhyUsItem {
  title: string;
  description: string;
}

export interface PainPointItem {
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  businessType: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

const WHY_US_ICONS = [Award, TrendingUp, Zap, Headphones, Users, Shield];
const PAIN_ICONS = [Clock, AlertCircle, Shield];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-dark hover:bg-surface transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {item.question}
            <ChevronDown
              size={18}
              className={`shrink-0 ml-3 text-primary transition-transform ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 pt-3 text-sm text-text-light leading-relaxed border-t border-border bg-surface">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Landing page layout — no navigation, no distractions, single CTA
function LandingPageLayout({
  headline,
  subheadline,
  price,
  features,
  targetAudience,
  urgencyText,
  whyUs,
  painPoints,
  howItWorks,
  testimonials,
  faq,
  children,
}: {
  headline: string;
  subheadline: string;
  price: string;
  features: string[];
  targetAudience: string;
  urgencyText?: string;
  whyUs?: WhyUsItem[];
  painPoints?: PainPointItem[];
  howItWorks?: HowItWorksStep[];
  testimonials?: Testimonial[];
  faq?: FAQItem[];
  children?: React.ReactNode;
}) {
  // Hide the main site header and footer on landing pages
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const nav = header?.closest("header")?.parentElement?.querySelector(".bg-dark");
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    if (nav) (nav as HTMLElement).style.display = "none";
    const topBar = document.querySelector("body > div.bg-dark");
    if (topBar) (topBar as HTMLElement).style.display = "none";

    return () => {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
      if (nav) (nav as HTMLElement).style.display = "";
      if (topBar) (topBar as HTMLElement).style.display = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal top bar — logo + phone only */}
      <div className="bg-white border-b border-border py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Clever Accounts" className="h-10 w-auto" />
          <a
            href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors"
          >
            <Phone size={16} className="text-secondary" />
            Call Free: {COMPANY.freephone}
          </a>
        </div>
      </div>

      {/* Hero — tight, focused */}
      <section className="bg-gradient-to-b from-[#F0F9FF] to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-4">
                <Sparkles size={12} />
                {targetAudience}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-dark leading-tight mb-4">
                {headline}
              </h1>
              <p className="text-lg text-text-light leading-relaxed mb-6">
                {subheadline}
              </p>
              <div className="flex flex-wrap gap-3 mb-6 text-sm text-text-light">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary" /> No setup fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary" /> No contract
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary" /> Cancel anytime
                </span>
              </div>
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4 rounded-xl animate-pulse-glow"
              >
                Get Started Now — From £{price}/mo <ArrowRight size={20} />
              </Link>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-text-light">Rated 5/5 by 10,000+ businesses</span>
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-border">
              <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1 text-xs font-bold text-secondary mb-3">
                From £{price}/month — all-inclusive
              </div>
              <h2 className="text-xl font-bold text-dark mb-2">Ready to switch?</h2>
              <p className="text-sm text-text-light mb-5">
                {urgencyText || "Join thousands of businesses who trust Clever Accounts."}
              </p>
              <div className="space-y-2 mb-6">
                {[
                  "No setup fees — ever",
                  "No long-term contract",
                  "Dedicated accountant from day one",
                  "Switch your details over in minutes",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-text">
                    <CheckCircle2 size={15} className="text-primary shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
              <Link
                href="/sign-up"
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 rounded-xl"
              >
                Get Started Now <ArrowRight size={18} />
              </Link>
              <p className="text-xs text-text-light text-center flex items-center justify-center gap-1 mt-3">
                <Shield size={12} /> Takes 2 minutes. No card required upfront.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What&apos;s Included */}
      <section className="bg-white py-12 border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark text-center mb-8">
            What&apos;s Included for £{price}/month
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <span className="text-text text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Clever Accounts */}
      {whyUs && whyUs.length > 0 && (
        <section className="bg-surface py-14 border-t border-border">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">
                Why Choose Clever Accounts?
              </h2>
              <p className="text-text-light max-w-xl mx-auto">
                We&apos;ve been helping {targetAudience.toLowerCase()} for over 20 years. Here&apos;s what makes us different.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyUs.map((item, i) => {
                const Icon = WHY_US_ICONS[i % WHY_US_ICONS.length];
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-sm card-hover">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-text-light leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Common challenges */}
      {painPoints && painPoints.length > 0 && (
        <section className="bg-white py-14 border-t border-border">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">
                Common Challenges We Solve
              </h2>
              <p className="text-text-light max-w-xl mx-auto">
                Sound familiar? We take care of all of this for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {painPoints.map((item, i) => {
                const Icon = PAIN_ICONS[i % PAIN_ICONS.length];
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-sm card-hover">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-text-light leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {howItWorks && howItWorks.length > 0 && (
        <section className="bg-gradient-to-b from-[#F0F9FF] to-white py-14 border-t border-border">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">How It Works</h2>
              <p className="text-text-light">Getting started is simple — we do the heavy lifting.</p>
            </div>
            <div className="flex flex-col md:flex-row items-start">
              {howItWorks.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center px-4 relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-black text-xl flex items-center justify-center mb-4 z-10">
                    {i + 1}
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-border" />
                  )}
                  <h3 className="font-bold text-dark mb-1">{step.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-white py-14 border-t border-border">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-surface rounded-2xl p-6 border border-border">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-text leading-relaxed mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-bold text-dark text-sm">{t.name}</p>
                    <p className="text-xs text-text-light">{t.businessType}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Optional extra content */}
      {children}

      {/* Social proof strip */}
      <section className="bg-surface py-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <span className="text-3xl font-black text-primary">10,000+</span>
              <p className="text-xs text-text-light">Businesses Served</p>
            </div>
            <div>
              <span className="text-3xl font-black text-primary">20+</span>
              <p className="text-xs text-text-light">Years Experience</p>
            </div>
            <div>
              <span className="text-3xl font-black text-primary">5.0★</span>
              <p className="text-xs text-text-light">Average Rating</p>
            </div>
            <div>
              <span className="text-3xl font-black text-primary">£0</span>
              <p className="text-xs text-text-light">Setup Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section className="bg-white py-14 border-t border-border">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion items={faq} />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="gradient-cta py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:shadow-xl transition-all"
            >
              Sign Up Now <ArrowRight size={18} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              <Phone size={18} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-dark text-white py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Clever Accounts Ltd</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPageLayout;
