import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  UserPlus,
  Users,
  PartyPopper,
  CheckCircle2,
  Phone,
  Star,
  Monitor,
  MessageCircle,
  BadgeCheck,
  ShieldCheck,
  Clock,
  Zap,
  CalendarCheck,
  FileText,
  TrendingDown,
  RefreshCw,
  HeartHandshake,
  BarChart3,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works — 3 Simple Steps | Clever Accounts",
  description:
    "Getting started with Clever Accounts takes minutes. Sign up, get matched with a dedicated accountant, then focus on your business. Everything else is handled for you.",
};

const steps = [
  {
    step: "01",
    icon: UserPlus,
    label: "Getting Started",
    title: "Sign Up in Minutes",
    description:
      "Choose the plan that fits your business — Sole Trader, Limited Company, or Contractor. Our online sign-up takes just a few minutes. No paperwork, no lengthy forms, no setup fees.",
    points: [
      "Fixed-fee transparent pricing from £32.50/month",
      "No minimum contract — cancel anytime",
      "Immediate access to your online dashboard",
      "Free FreeAgent accounting software activated instantly",
    ],
    colour: "from-primary/20 to-primary/5",
    accent: "text-primary",
    accentBg: "bg-primary/10",
  },
  {
    step: "02",
    icon: Users,
    label: "Your Accountant",
    title: "Meet Your Dedicated Accountant",
    description:
      "Within one working day, you're matched with a dedicated accountant who specialises in your type of business. They'll get to know you, your goals, and your finances — and stay with you for the long haul.",
    points: [
      "Matched to a specialist in your business type",
      "Onboarding call booked within 24 hours",
      "Available by phone and email — no call centres",
      "Proactive advice, not just year-end number crunching",
    ],
    colour: "from-secondary/20 to-secondary/5",
    accent: "text-secondary",
    accentBg: "bg-secondary/10",
  },
  {
    step: "03",
    icon: PartyPopper,
    label: "Sit Back",
    title: "We Handle Everything",
    description:
      "From the moment you're set up, your accountant takes care of your accounts, tax returns, VAT, payroll, and all HMRC and Companies House filings. You focus on your business — we handle the rest.",
    points: [
      "All deadlines tracked and submissions handled",
      "Quarterly check-ins and proactive tax planning",
      "Real-time financial dashboard on any device",
      "Unlimited advice whenever you need it",
    ],
    colour: "from-green-500/20 to-green-500/5",
    accent: "text-green-500",
    accentBg: "bg-green-500/10",
  },
];

const included = [
  { icon: Users, text: "Dedicated accountant" },
  { icon: MessageCircle, text: "Unlimited advice" },
  { icon: Monitor, text: "Free FreeAgent software" },
  { icon: FileText, text: "All tax returns filed" },
  { icon: RefreshCw, text: "VAT returns" },
  { icon: CalendarCheck, text: "Deadlines managed" },
  { icon: TrendingDown, text: "Tax planning" },
  { icon: BarChart3, text: "Real-time dashboard" },
  { icon: BadgeCheck, text: "No setup fee" },
  { icon: ShieldCheck, text: "No minimum contract" },
];

const timeline = [
  { when: "Day 1", title: "Sign up online", desc: "Choose your plan and complete our simple sign-up form." },
  { when: "Within 24 hrs", title: "Accountant assigned", desc: "Your dedicated accountant is matched and will reach out to book your welcome call." },
  { when: "Week 1", title: "Onboarding call", desc: "Your accountant gets to know your business, sets up FreeAgent, and captures any outstanding deadlines." },
  { when: "Ongoing", title: "Everything handled", desc: "Accounts, tax returns, VAT, payroll, and proactive advice — all taken care of month after month." },
];

const testimonials = [
  {
    name: "James Cooper",
    role: "IT Contractor",
    quote: "Signed up on a Monday, had an introductory call with my accountant by Wednesday. Within two weeks everything was in order. The onboarding was smoother than I expected.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Sole Trader",
    quote: "I was anxious about switching from my old accountant. Clever Accounts handled the whole transfer — I didn't have to say a word to my previous firm.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Limited Company Director",
    quote: "The sign-up took about 8 minutes. My accountant called me the next morning. I don't know why I waited so long.",
    rating: 5,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Zap size={15} className="text-secondary" />
            Up and running in as little as 24 hours
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Three Steps to<br />
            <span className="text-gradient">Brilliant Accounting</span>
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mx-auto mb-8">
            No complicated onboarding. No piles of paperwork. Just sign up, meet your accountant, and get back to running your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── THREE STEPS ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-24">
            {steps.map(({ step, icon: Icon, label, title, description, points, colour, accent, accentBg }, i) => (
              <div
                key={step}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {/* Visual panel */}
                <div className={`bg-gradient-to-br ${colour} rounded-3xl p-10 flex flex-col items-center justify-center text-center aspect-square max-w-md mx-auto w-full`}>
                  <div className={`w-20 h-20 rounded-2xl ${accentBg} flex items-center justify-center mb-6`}>
                    <Icon size={40} className={accent} />
                  </div>
                  <div className={`text-7xl font-black ${accent} opacity-20 leading-none mb-2`}>{step}</div>
                  <div className={`text-sm font-bold uppercase tracking-widest ${accent}`}>{label}</div>
                </div>

                {/* Copy */}
                <div>
                  <div className={`inline-flex items-center gap-2 ${accentBg} ${accent} rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest mb-4`}>
                    Step {step}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">{title}</h2>
                  <p className="text-text-light leading-relaxed mb-6 text-lg">{description}</p>
                  <ul className="space-y-3">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-text">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Timeline</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">What Happens When</h2>
            <p className="text-text-light max-w-xl mx-auto">
              From signing up to fully sorted — here's what the first few weeks look like.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-[3.25rem] top-6 bottom-6 w-0.5 bg-border" />

            <div className="space-y-6">
              {timeline.map(({ when, title, desc }, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-[104px] h-[40px] rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center text-center leading-tight px-2">
                      {when}
                    </div>
                  </div>
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex-1 card-hover">
                    <div className="font-bold text-dark mb-1">{title}</div>
                    <div className="text-text-light text-sm leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">All Inclusive</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Everything's Included.<br />
              <span className="text-gradient">No Extras, No Surprises.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              One fixed monthly fee covers all of this. No hourly billing, no surprise invoices.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {included.map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-light flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} />
                </div>
                <p className="text-white/80 text-xs font-semibold">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Real Clients</p>
            <h2 className="text-3xl font-black text-dark mb-4">Hear From People Who've Done It</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, rating }) => (
              <div key={name} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-text-light text-sm leading-relaxed mb-4 italic">"{quote}"</p>
                <div className="border-t border-border pt-4">
                  <div className="font-bold text-dark text-sm">{name}</div>
                  <div className="text-text-light text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <HeartHandshake size={16} />
            Dedicated accountant assigned within 24 hours
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Join 10,000+ UK businesses. Sign up in minutes — your accountant does the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get Started — Free <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {["No setup fee", "No minimum contract", "Cancel anytime"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-white/60" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
