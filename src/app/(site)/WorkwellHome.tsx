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
} from "lucide-react";
import { useBrand } from "@/lib/useBrand";
import TaxCalculator from "@/components/ui/TaxCalculator";
import PricingFAQ from "@/components/ui/PricingFAQ";
import RequestCallback from "@/components/ui/RequestCallback";
import WorkwellHero from "./WorkwellHero";
import type { CmsHomePage } from "./HomePageClient";

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

/**
 * Workwell homepage — a B2C, service-industry experience built from scratch for
 * sole traders, limited companies and contractors. Warm, plain-English, benefit
 * led. Reuses shared functional components (take-home calculator, FAQ).
 */
export default function WorkwellHome({ home, serviceTabs, faqs, promoBadges, trustBadge }: WorkwellHomeProps) {
  const brand = useBrand();
  const rating = brand.trustpilot?.rating ?? "4.6";
  const segments = serviceTabs.slice(0, 3);

  const benefits: { icon: ReactNode; title: string; desc: string }[] = [
    { icon: <UserCheck size={24} />, title: "A real accountant, on first-name terms", desc: "Not a call centre. One named expert who knows you and your business." },
    { icon: <Clock size={24} />, title: "Your tax, sorted and filed on time", desc: "Self Assessment, VAT, payroll, year-end — handled, with no last-minute panic." },
    { icon: <Wallet size={24} />, title: "Keep more of what you earn", desc: "Proactive, plain-English advice that makes sure you never overpay HMRC." },
    { icon: <Cpu size={24} />, title: "Free software, set up for you", desc: "Cloud accounting that shows your numbers in real time — we get you started." },
    { icon: <MessagesSquare size={24} />, title: "Unlimited advice, whenever", desc: "Call or email as often as you like. Questions answered by a human, fast." },
    { icon: <Repeat size={24} />, title: "Switch in minutes", desc: "Already with another accountant? We do the heavy lifting to move you over — free." },
  ];

  const steps = [
    { n: "1", title: "Tell us about you", desc: "Answer a few quick questions online — takes about two minutes." },
    { n: "2", title: "Meet your accountant", desc: "We match you with a dedicated expert for your line of work." },
    { n: "3", title: "Relax — we've got it", desc: "We handle the admin, deadlines and tax. You get on with business." },
  ];

  const heroPrice = segments[0]?.price ?? "42.50";

  return (
    <>
      <WorkwellHero home={home} trustBadge={trustBadge} />

      {/* ── Who are you? — segment picker, the B2C front door ─────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Built around you</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3">
              What kind of business are you?
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Pick where you fit and we&apos;ll show you exactly how we help — and what it costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {segments.map((seg) => (
              <Link
                key={seg.id}
                href={seg.href}
                className="group relative flex flex-col bg-[#f7faef] rounded-3xl p-8 border border-[#e4ecd6] hover:border-secondary hover:shadow-lg transition-all"
              >
                <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-secondary/20 group-hover:text-[#6f8052] transition-colors">
                  {seg.icon}
                </span>
                <h3 className="text-xl font-bold text-[#2c4a51] mb-2">{seg.label}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed mb-5 flex-1">
                  {SEGMENT_BLURB[seg.id] ?? seg.headline}
                </p>
                <ul className="space-y-2 mb-6">
                  {seg.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#3f565b]">
                      <CheckCircle2 size={15} className="text-[#6f8052] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-[#e4ecd6]">
                  <span className="text-sm text-[#6a7b80]">
                    from <span className="text-lg font-extrabold text-[#2c4a51]">£{seg.price}</span>/mo
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Explore <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reassurance — outcomes, not features ──────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <HeartHandshake size={16} /> Less admin, more you
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3">
              Everything sorted, nothing to worry about
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg">
              You didn&apos;t go into business to do paperwork. Here&apos;s what you get when we look after your accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-3xl p-7 border border-[#e4ecd6] shadow-sm">
                <span className="w-12 h-12 rounded-2xl bg-secondary/15 text-[#6f8052] flex items-center justify-center mb-4">
                  {b.icon}
                </span>
                <h3 className="text-lg font-bold text-[#2c4a51] mb-2">{b.title}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Take-home calculator — interactive engagement (reused) ─────── */}
      <section className="bg-white pt-20 md:pt-24">
        <div className="max-w-3xl mx-auto px-4 text-center mb-10">
          <span className="text-primary font-bold text-sm uppercase tracking-wider">Try it yourself</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3">
            See what you could take home
          </h2>
          <p className="text-[#5a6f74] mt-4 text-lg">
            Pop in your income and get a quick, no-strings estimate of your take-home pay.
          </p>
        </div>
        <TaxCalculator />
      </section>

      {/* ── How it works — reduce the friction ────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Getting started</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3">
              Up and running in minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-9 left-[18%] right-[18%] h-0.5 bg-secondary/30" />
            {steps.map((s) => (
              <div key={s.n} className="text-center relative z-10">
                <div className="w-18 h-18 mx-auto mb-6 rounded-3xl bg-white border border-[#e4ecd6] shadow-sm flex items-center justify-center">
                  <span className="w-12 h-12 rounded-2xl bg-primary text-white text-xl font-extrabold flex items-center justify-center">
                    {s.n}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#2c4a51] mb-2">{s.title}</h3>
                <p className="text-[#5a6f74] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof — Trustpilot + reassurance (no fabricated quotes) ─ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#243b40] to-[#32535a] py-20 md:py-24">
        <div className="absolute -top-20 -right-16 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
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
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-secondary" /> Qualified &amp; regulated</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-secondary" /> No tie-in contracts</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-secondary" /> Making Tax Digital ready</span>
          </div>
          <Link
            href={brand.trustpilot?.url ?? "/reviews"}
            target={brand.trustpilot?.url ? "_blank" : undefined}
            rel={brand.trustpilot?.url ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 bg-white text-[#2c4a51] font-bold px-6 py-3 rounded-xl hover:bg-[#eef4e2] transition-colors"
          >
            Read our reviews <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Pricing teaser — simple, honest ───────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#f7faef] rounded-[2rem] border border-[#e4ecd6] p-10 md:p-14 text-center">
            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Sparkles size={16} /> Simple, honest pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3 mb-2">
              One fixed monthly fee
            </h2>
            <p className="text-[#5a6f74] text-lg mb-6">
              Everything included. No setup fees, no surprises, cancel anytime.
            </p>
            <p className="text-5xl md:text-6xl font-extrabold text-[#2c4a51] mb-8">
              from £{heroPrice}<span className="text-xl font-semibold text-[#6a7b80]">/mo + VAT</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white border border-primary/20 text-primary font-semibold text-lg px-8 py-4 rounded-xl hover:bg-[#eef4e2] transition-colors"
              >
                See full pricing
              </Link>
            </div>
            {promoBadges[segments[0]?.label] && (
              <p className="mt-5 text-sm font-bold text-[#6f8052]">{promoBadges[segments[0].label]}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ — reduce objections (reused component) ────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Good to know</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3">
              Questions, answered
            </h2>
          </div>
          <PricingFAQ
            faqs={faqs.map((f, i) => ({ _id: String(i), question: f.q, answer: f.a }))}
          />
          <div className="text-center mt-10">
            <p className="text-[#5a6f74]">
              Still wondering about something?{" "}
              <Link href="/contact" className="text-primary font-semibold hover:underline">
                Talk to us &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA — warm close ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-[#2c4a51] to-[#32535a] rounded-[2rem] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to stop worrying about your accounts?
              </h2>
              <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
                Get a dedicated accountant, unlimited advice and free software — all for one simple monthly fee. Set up in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4 rounded-xl">
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
    </>
  );
}
