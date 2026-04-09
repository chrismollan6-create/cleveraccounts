"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Phone,
  User,
  Building2,
  Briefcase,
  Clock,
  AlertTriangle,
  Calculator,
  PoundSterling,
  FileX2,
  HeadphonesIcon,
  Rocket,
  ChevronRight,
  BadgePoundSterling,
  Shield,
  Zap,
  BarChart3,
  MessageCircle,
  Sparkles,
  Play,
  Quote,
} from "lucide-react";
import { COMPANY, TESTIMONIALS } from "@/lib/constants";

/* ────────────────────────────────────────
   SERVICE TAB DATA
   ──────────────────────────────────────── */
const serviceTabs = [
  {
    id: "sole-trader",
    label: "Sole Trader",
    icon: <User size={20} />,
    headline: "Hassle-free accounting for the self-employed",
    price: "32.50",
    features: [
      "Dedicated sole trader accountant",
      "Self assessment tax return filed",
      "Unlimited phone & email advice",
      "Free FreeAgent software",
      "Expense tracking & mileage",
      "MTD compliant from day one",
    ],
    href: "/sole-trader",
    stat: "Average £1,200 tax saved per year",
  },
  {
    id: "limited-company",
    label: "Limited Company",
    icon: <Building2 size={20} />,
    headline: "Complete accounting for your limited company",
    price: "104.50",
    features: [
      "Year-end accounts & CT600",
      "VAT returns (quarterly)",
      "Payroll for directors & staff",
      "Companies House filings",
      "Corporation tax planning",
      "Free FreeAgent software",
    ],
    href: "/limited-company",
    stat: "Average £3,800 tax saved per year",
  },
  {
    id: "contractor",
    label: "Contractor",
    icon: <Briefcase size={20} />,
    headline: "Specialist IR35 support for contractors",
    price: "104.50",
    features: [
      "End-to-end IR35 support",
      "Contract reviews & assessments",
      "Clever FLEX umbrella solution",
      "Seamless PSC/Umbrella switch",
      "Full limited company accounting",
      "Bespoke contracting advice",
    ],
    href: "/contractor-accountancy",
    stat: "IR35 compliant across all contracts",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("limited-company");
  const activeService = serviceTabs.find((t) => t.id === activeTab)!;

  return (
    <>
      {/* ═══════════════════════════════════════
          HERO — Bold, clear, one CTA
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark min-h-[92vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-primary/15 animate-blob" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-accent/8 animate-blob blob-shape-2" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary rounded-full animate-float opacity-50" />
          <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-primary-light rounded-full animate-float-delayed opacity-40" />
          <div className="absolute inset-0 pattern-dots" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Message */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-full px-4 py-2 text-sm text-primary mb-8">
                <Sparkles size={14} />
                <span>Rated 5/5 by 10,000+ UK businesses</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Stop Worrying
                <br />
                About Your
                <br />
                <span className="text-gradient">Accounts.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
                Your own dedicated accountant, unlimited advice, and free software — all for one fixed monthly fee. No surprises. Ever.
              </p>

              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-5 rounded-2xl animate-pulse-glow"
              >
                Get Started — It&apos;s Free to Set Up
                <ArrowRight size={22} />
              </Link>

              <p className="text-slate-500 text-sm mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" /> Cancel anytime</span>
              </p>
            </div>

            {/* Right — People-first visual */}
            <div className="hidden lg:block relative">
              {/* Accountant team card */}
              <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <p className="text-white/50 text-sm uppercase tracking-wider mb-6">Your Dedicated Team</p>
                {/* Accountant profiles */}
                <div className="space-y-4">
                  {[
                    { name: "Sarah Johnson", role: "Your Dedicated Accountant", speciality: "Sole Trader Specialist", initials: "SJ", color: "from-primary to-orange-400" },
                    { name: "Michael Chen", role: "Tax Planning Expert", speciality: "Limited Company & IR35", initials: "MC", color: "from-accent to-purple-400" },
                    { name: "Emma Williams", role: "Payroll & VAT Manager", speciality: "Contractor Specialist", initials: "EW", color: "from-emerald-500 to-teal-400" },
                  ].map((person, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-all">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${person.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                        {person.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{person.name}</p>
                        <p className="text-primary text-sm">{person.role}</p>
                        <p className="text-white/40 text-xs">{person.speciality}</p>
                      </div>
                      <div className="shrink-0">
                        <Phone size={16} className="text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-white/10 text-center">
                  <p className="text-white/40 text-xs">Unlimited calls &amp; emails included</p>
                  <p className="text-white text-sm font-semibold mt-1">Always just a phone call away</p>
                </div>
              </div>

              {/* Floating "online now" card */}
              <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl p-4 shadow-xl animate-float-delayed z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm">SJ</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark">Sarah is available</p>
                    <p className="text-xs text-text-light">Your accountant is online</p>
                  </div>
                </div>
              </div>

              {/* Floating star card */}
              <div className="absolute -top-2 -right-4 bg-white rounded-2xl p-3 shadow-xl animate-float z-10">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-bold text-dark ml-1">5.0</span>
                </div>
                <p className="text-xs text-text-light mt-1">from 10,000+ reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full h-auto">
            <path d="M0,50 C480,100 960,0 1440,50 L1440,100 L0,100 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR — Real social proof
          ═══════════════════════════════════════ */}
      <section className="bg-white pt-6 pb-12">
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

      {/* ═══════════════════════════════════════
          THE PROBLEM — Emotional connection
          ═══════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Sound Familiar?</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
              Running a Business Is Hard Enough
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Clock size={32} />,
                title: "Wasting Weekends on Spreadsheets?",
                description: "You started a business to do what you love — not to spend evenings wrestling with receipts and tax codes.",
                color: "bg-red-50 text-red-500",
              },
              {
                icon: <AlertTriangle size={32} />,
                title: "Worried About Missing Deadlines?",
                description: "HMRC penalties, late filing fees, forgotten VAT returns — the stress of compliance keeps you up at night.",
                color: "bg-amber-50 text-amber-500",
              },
              {
                icon: <PoundSterling size={32} />,
                title: "Overpaying Tax Unnecessarily?",
                description: "Without expert advice, you're almost certainly paying more tax than you need to. Most sole traders overpay by £1,000+.",
                color: "bg-orange-50 text-primary",
              },
            ].map((pain) => (
              <div key={pain.title} className="text-center p-8 rounded-3xl bg-white border border-border card-hover">
                <div className={`w-16 h-16 rounded-2xl ${pain.color} flex items-center justify-center mx-auto mb-5`}>
                  {pain.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{pain.title}</h3>
                <p className="text-text-light leading-relaxed">{pain.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <div className="inline-flex items-center gap-3 bg-primary/10 rounded-2xl px-8 py-4 border border-primary/20">
              <Sparkles size={20} className="text-primary" />
              <span className="text-lg font-bold text-dark">
                We fix all of this — for <span className="text-gradient">one simple monthly fee</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICE SELECTOR — Interactive "I'm a..."
          ═══════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 blob-shape animate-blob" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Tailored For You</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
              I&apos;m a...
            </h2>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10 gap-1">
              {serviceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                {activeService.headline}
              </h3>
              <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-2 text-primary text-sm font-bold mb-8 border border-primary/30">
                <BarChart3 size={16} />
                {activeService.stat}
              </div>
              <ul className="space-y-4 mb-10">
                {activeService.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                    <span className="text-lg">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                  Get Started — £{activeService.price}/mo <ArrowRight size={20} />
                </Link>
                <Link href={activeService.href} className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white font-semibold text-lg transition-colors">
                  Learn more <ChevronRight size={18} />
                </Link>
              </div>
            </div>

            {/* Pricing visual */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center">
                <p className="text-white/50 text-sm uppercase tracking-wider mb-2">All-inclusive from</p>
                <div className="text-7xl font-black text-white mb-1">
                  £{activeService.price}
                </div>
                <p className="text-white/50 text-lg mb-8">/month + VAT</p>
                <div className="space-y-3 text-left">
                  {["Dedicated accountant", "Unlimited advice", "Free software", "No setup fees", "Cancel anytime"].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-white/70 bg-white/5 rounded-xl px-4 py-3">
                      <CheckCircle2 size={16} className="text-primary" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/sign-up" className="btn-primary w-full mt-8 inline-flex items-center justify-center gap-2 text-lg py-4 rounded-xl">
                  Start Now <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Simple 3-step
          ═══════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
              Up and Running in <span className="text-gradient">Minutes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            {[
              { step: "01", icon: <Calculator size={28} />, title: "Pick Your Plan", desc: "Choose sole trader, limited company, or contractor. Sign up online in 2 minutes." },
              { step: "02", icon: <HeadphonesIcon size={28} />, title: "Meet Your Accountant", desc: "Matched with a named, dedicated accountant who specialises in your business type." },
              { step: "03", icon: <Rocket size={28} />, title: "You're Sorted", desc: "Your accountant handles everything. Focus on your business, not your books." },
            ].map((item, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 relative card-hover">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-cta text-white text-xs font-black flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-text-light leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MEET YOUR ACCOUNTANT — Human/service focus
          ═══════════════════════════════════════ */}
      <section className="gradient-warm-section py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Real People, Real Support</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
              Meet Your <span className="text-gradient">Dedicated Accountant</span>
            </h2>
            <p className="text-lg text-text-light mt-4 max-w-2xl mx-auto">
              You&apos;re not a ticket number. You get a named accountant who knows your business personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Sole Trader Specialist",
                experience: "12 years experience",
                initials: "SJ",
                gradient: "from-primary to-orange-400",
                quote: "I love helping sole traders keep more of what they earn. It's personal for me — I started as a sole trader myself.",
                specialities: ["Self Assessment", "MTD", "Expense Planning"],
              },
              {
                name: "Michael Chen",
                role: "Limited Company Expert",
                experience: "15 years experience",
                initials: "MC",
                gradient: "from-accent to-purple-400",
                quote: "My job is to make sure your limited company is as tax-efficient as possible. I'm proactive — I don't wait for you to ask.",
                specialities: ["Corporation Tax", "VAT", "Payroll"],
              },
              {
                name: "Emma Williams",
                role: "Contractor & IR35 Specialist",
                experience: "10 years experience",
                initials: "EW",
                gradient: "from-emerald-500 to-teal-400",
                quote: "Contractors face unique challenges. I review every contract, manage your IR35 status, and make Clever FLEX seamless.",
                specialities: ["IR35", "Contract Reviews", "Clever FLEX"],
              },
            ].map((person) => (
              <div key={person.name} className="bg-white rounded-3xl p-8 border border-border card-glow text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${person.gradient} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 relative`}>
                  {person.initials}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white" />
                </div>
                <h3 className="text-xl font-bold text-dark">{person.name}</h3>
                <p className="text-primary font-semibold text-sm">{person.role}</p>
                <p className="text-text-light text-xs mb-4">{person.experience}</p>
                <p className="text-text text-sm italic leading-relaxed mb-5">
                  &ldquo;{person.quote}&rdquo;
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {person.specialities.map((s) => (
                    <span key={s} className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-text-light mb-4">
              Plus a full support team behind them — payroll managers, tax planners, and admin support.
            </p>
            <Link href="/about-us" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-dark transition-colors">
              Meet the full team <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VALUE COMPARISON — vs doing it yourself
          ═══════════════════════════════════════ */}
      <section className="gradient-warm-section py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">The Smart Choice</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
              What Does <span className="text-gradient">DIY Accounting</span> Really Cost?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DIY column */}
            <div className="bg-white rounded-3xl p-8 border border-red-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-400" />
              <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <FileX2 size={24} className="text-red-400" />
                Doing It Yourself
              </h3>
              <ul className="space-y-4">
                {[
                  { text: "10+ hours/month on bookkeeping", bad: true },
                  { text: "Risk of HMRC penalties (avg £400)", bad: true },
                  { text: "Overpaying tax by £1,000+/year", bad: true },
                  { text: "No expert advice when you need it", bad: true },
                  { text: "Software costs £15-50/month extra", bad: true },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <span className="text-text">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-text-light text-sm">True cost:</p>
                <p className="text-3xl font-black text-red-500">£200+/month</p>
                <p className="text-xs text-text-light">in time, penalties & overpaid tax</p>
              </div>
            </div>

            {/* Clever Accounts column */}
            <div className="bg-white rounded-3xl p-8 border-2 border-primary relative overflow-hidden shadow-lg orange-glow">
              <div className="absolute top-0 left-0 w-full h-1.5 gradient-cta" />
              <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <Shield size={24} className="text-primary" />
                With Clever Accounts
              </h3>
              <ul className="space-y-4">
                {[
                  "Dedicated accountant does it all",
                  "Never miss a deadline — guaranteed",
                  "Proactive tax planning saves you £1,000+",
                  "Unlimited advice, call anytime",
                  "Free FreeAgent software included",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-text font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-primary/20">
                <p className="text-text-light text-sm">All-inclusive from:</p>
                <p className="text-3xl font-black text-gradient">£32.50/month</p>
                <p className="text-xs text-text-light">Everything included. No extras.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CLIENT SPOTLIGHT — Featured story
          ═══════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Real People, Real Results</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
              Don&apos;t Take Our Word for It
            </h2>
          </div>

          {/* Featured client story */}
          <div className="bg-primary-50 rounded-3xl p-8 md:p-12 mb-12 max-w-5xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blob-shape" />
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-3 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-3xl font-black mx-auto mb-3">
                  SM
                </div>
                <h3 className="text-lg font-bold text-dark">Sarah Mitchell</h3>
                <p className="text-primary text-sm font-semibold">Sole Trader</p>
                <p className="text-text-light text-xs">Freelance Copywriter</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="md:col-span-9">
                <Quote size={36} className="text-primary/20 mb-3" />
                <p className="text-lg text-dark leading-relaxed mb-4">
                  &ldquo;Before Clever Accounts, I was spending every Sunday doing my books. Now my accountant Sarah handles everything. She even spotted £1,400 in expenses I didn&apos;t know I could claim. <strong className="text-primary">The service paid for itself three times over in the first year.</strong>&rdquo;
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2 bg-white rounded-full px-4 py-2 font-semibold">
                    <CheckCircle2 size={16} className="text-primary" /> £1,400 extra tax savings
                  </span>
                  <span className="flex items-center gap-2 bg-white rounded-full px-4 py-2 font-semibold">
                    <Clock size={16} className="text-primary" /> 10+ hours/month saved
                  </span>
                  <span className="flex items-center gap-2 bg-white rounded-full px-4 py-2 font-semibold">
                    <Shield size={16} className="text-primary" /> Zero missed deadlines
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => {
              const gradients = ["from-primary to-orange-400", "from-accent to-purple-400", "from-emerald-500 to-teal-400", "from-blue-500 to-indigo-400"];
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border card-glow relative">
                  <Quote size={32} className="text-primary/10 absolute top-4 right-4" />
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-text leading-relaxed mb-5 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradients[i % 4]} flex items-center justify-center text-white text-xs font-black`}>
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dark">{t.name}</p>
                      <p className="text-xs text-text-light">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/reviews" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-dark transition-colors">
              Read all 10,000+ reviews <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT'S INCLUDED — Quick feature scan
          ═══════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-cta" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 blob-shape animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 blob-shape-3 animate-blob" style={{ animationDelay: "4s" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Everything Included
            </h2>
            <p className="text-white/70 mt-3 text-lg">One fee. No surprises. No add-ons.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: <User size={22} />, label: "Dedicated Accountant" },
              { icon: <MessageCircle size={22} />, label: "Unlimited Advice" },
              { icon: <BarChart3 size={22} />, label: "Free Software" },
              { icon: <BadgePoundSterling size={22} />, label: "£0 Setup Fees" },
              { icon: <Shield size={22} />, label: "No Contract" },
              { icon: <FileX2 size={22} />, label: "All Filings Done" },
              { icon: <Zap size={22} />, label: "Tax Planning" },
              { icon: <Phone size={22} />, label: "Phone Support" },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10 hover:bg-white/15 transition-all">
                <div className="text-white mb-2 flex justify-center">{f.icon}</div>
                <p className="text-white text-sm font-semibold">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA — One clear action
          ═══════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark mb-6 leading-tight">
            Ready to Make Your
            <br />
            Accounting <span className="text-gradient">Clever?</span>
          </h2>
          <p className="text-xl text-text-light mb-10 max-w-2xl mx-auto">
            Join 10,000+ UK businesses. Set up in 2 minutes.
            No setup fees. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center justify-center gap-2 text-xl px-12 py-5 rounded-2xl"
            >
              Get Started Free <ArrowRight size={22} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-dark text-white font-bold px-8 py-5 rounded-2xl text-lg hover:bg-secondary transition-all"
            >
              <Phone size={20} />
              Call {COMPANY.freephone}
            </a>
          </div>
          <p className="text-text-light text-sm mt-6">
            Or email us at <a href={`mailto:${COMPANY.email}`} className="text-primary font-semibold hover:text-primary-dark">{COMPANY.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
