"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone, Star, Shield, Clock, Sparkles } from "lucide-react";
import { COMPANY } from "@/lib/constants";

// PPC landing page layout — no navigation, no distractions, single CTA
function LandingPageLayout({
  headline,
  subheadline,
  price,
  features,
  targetAudience,
  urgencyText,
  children,
}: {
  headline: string;
  subheadline: string;
  price: string;
  features: string[];
  targetAudience: string;
  urgencyText: string;
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
    // Also hide the top announcement bar
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
      {/* Minimal top bar — logo + phone only, NO navigation */}
      <div className="bg-white border-b border-border py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Clever Accounts" className="h-10 w-auto" />
          <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors">
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
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> No contract</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> Cancel anytime</span>
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

            {/* Right — sign up form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-border">
              <h2 className="text-xl font-bold text-dark mb-1">Get Started in 2 Minutes</h2>
              <p className="text-sm text-text-light mb-5">{urgencyText}</p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="First name" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  <input type="text" placeholder="Last name" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <input type="email" placeholder="Email address" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                <input type="tel" placeholder="Phone number" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 rounded-xl">
                  Get My Free Quote <ArrowRight size={18} />
                </button>
                <p className="text-xs text-text-light text-center flex items-center justify-center gap-1">
                  <Shield size={12} /> No spam. We&apos;ll call you within 2 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white py-12 border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark text-center mb-8">What&apos;s Included for £{price}/month</h2>
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

      {/* Optional extra content */}
      {children}

      {/* Social proof strip */}
      <section className="bg-surface py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-8">
            <div><span className="text-3xl font-black text-primary">10,000+</span><p className="text-xs text-text-light">Businesses Served</p></div>
            <div><span className="text-3xl font-black text-primary">20+</span><p className="text-xs text-text-light">Years Experience</p></div>
            <div><span className="text-3xl font-black text-primary">5.0★</span><p className="text-xs text-text-light">Average Rating</p></div>
            <div><span className="text-3xl font-black text-primary">£0</span><p className="text-xs text-text-light">Setup Fees</p></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-cta py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:shadow-xl transition-all">
              Sign Up Now <ArrowRight size={18} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
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
