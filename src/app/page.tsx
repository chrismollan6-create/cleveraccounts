"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Phone,
  User,
  Building2,
  Briefcase,
  Laptop,
  Home,
  Rocket,
  UserCheck,
  MessageCircle,
  Monitor,
  ShieldCheck,
  TrendingDown,
  FileCheck,
  BarChart3,
  ChevronRight,
  BadgePoundSterling,
  Sparkles,
  Calculator,
  Clock,
  HeadphonesIcon,
} from "lucide-react";
import { COMPANY, SERVICE_CATEGORIES, FEATURES, TESTIMONIALS } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  User: <User size={28} />,
  Building2: <Building2 size={28} />,
  Briefcase: <Briefcase size={28} />,
  Laptop: <Laptop size={28} />,
  Home: <Home size={28} />,
  Rocket: <Rocket size={28} />,
  UserCheck: <UserCheck size={24} />,
  MessageCircle: <MessageCircle size={24} />,
  Monitor: <Monitor size={24} />,
  BadgePoundSterling: <BadgePoundSterling size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  TrendingDown: <TrendingDown size={24} />,
  FileCheck: <FileCheck size={24} />,
  BarChart3: <BarChart3 size={24} />,
};

export default function HomePage() {
  return (
    <>
      {/* ───────── HERO SECTION ───────── */}
      <section className="relative overflow-hidden bg-dark min-h-[90vh] flex items-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/20 animate-blob" />
          <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-accent/10 animate-blob blob-shape-2" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/10 animate-blob blob-shape-3" style={{ animationDelay: "4s" }} />
          {/* Floating decorative shapes */}
          <div className="absolute top-20 right-1/3 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
          <div className="absolute top-40 right-1/4 w-3 h-3 bg-accent rounded-full animate-float-delayed opacity-40" />
          <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-primary-light rounded-full animate-float-slow opacity-50" />
          {/* Dot pattern */}
          <div className="absolute inset-0 pattern-dots" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm text-primary-light mb-6 border border-primary/30">
                <Sparkles size={16} className="text-primary" />
                Trusted by 10,000+ UK businesses
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                Online Accounting
                <br />
                <span className="text-gradient">Made Clever</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-lg">
                Expert accountancy for sole traders, limited companies &amp; contractors.
                One fee. Unlimited advice. Free software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg animate-pulse-glow"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-lg hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
                >
                  View Pricing
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-primary" />
                  No setup fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-primary" />
                  No minimum contract
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-primary" />
                  Cancel anytime
                </span>
              </div>
            </div>

            {/* Right: Illustration/Visual */}
            <div className="hidden lg:block relative animate-fade-in-right">
              {/* Main dashboard card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl animate-float">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Revenue</span>
                    <span className="text-primary font-bold text-lg">£47,250</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "75%" }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Tax Saved</span>
                    <span className="text-green-400 font-bold text-lg">£3,840</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: "60%" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {["Invoices", "Expenses", "Reports"].map((item) => (
                      <div key={item} className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-primary text-xl font-bold">{item === "Invoices" ? "24" : item === "Expenses" ? "£1.2k" : "3"}</div>
                        <div className="text-white/50 text-xs mt-1">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating notification card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-border animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">Tax Return Filed</p>
                    <p className="text-xs text-text-light">Submitted to HMRC</p>
                  </div>
                </div>
              </div>
              {/* Floating star card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-border animate-float-slow">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-dark">5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,70 L1440,120 L0,120 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ───────── TRUST BAR ───────── */}
      <section className="bg-white py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {[
              { value: "10,000+", label: "Businesses Served" },
              { value: "20+", label: "Years Experience" },
              { value: "£0", label: "Setup Fees" },
              { value: "5.0", label: "Star Rating", stars: true },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl md:text-4xl font-black text-gradient">{stat.value}</span>
                  {stat.stars && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm text-text-light font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SERVICES GRID ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3 mb-4">
              Accounting for <span className="text-gradient">Every Business</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Whether you&apos;re a sole trader, limited company or contractor — we have a tailored package for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {SERVICE_CATEGORIES.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group relative bg-white rounded-2xl p-8 card-glow overflow-hidden ${
                  i === 1 ? "border-2 border-primary shadow-lg" : "border border-border"
                }`}
              >
                {i === 1 && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    Popular
                  </div>
                )}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-sm text-text-light">
                    From <span className="text-2xl font-black text-dark">£{service.price}</span>/mo
                  </span>
                  <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Orange gradient background with wave */}
        <div className="absolute inset-0 gradient-cta" />
        <div className="absolute inset-0 pattern-dots opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-white/70 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Join 10,000+ businesses in just minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: <Calculator size={32} />,
                title: "Sign Up",
                description: "Choose your package and sign up in minutes. No setup fees, no paperwork.",
              },
              {
                step: "02",
                icon: <HeadphonesIcon size={32} />,
                title: "Get Your Accountant",
                description: "Matched with a dedicated accountant who specialises in your business type.",
              },
              {
                step: "03",
                icon: <Rocket size={32} />,
                title: "Focus on Business",
                description: "Relax knowing your accounts, tax returns and compliance are all sorted.",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-white/30" />
                )}
                <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm text-white flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-primary transition-all duration-300 border border-white/20 relative">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-primary text-xs font-black flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FEATURES GRID ───────── */}
      <section className="bg-white py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Clever Accounts</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3 mb-4">
              Everything You Need, <span className="text-gradient">One Fee</span>
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              No hidden costs. Just expert accounting support whenever you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`rounded-2xl p-6 text-center card-hover ${
                  i % 2 === 0 ? "bg-primary-50" : "bg-white border border-border"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-base font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── STATS COUNTER ───────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-dark" />
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blob-shape animate-blob" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 blob-shape-2 animate-blob" style={{ animationDelay: "3s" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "20+", label: "Years Experience", icon: <Clock size={28} /> },
              { value: "10,000+", label: "Businesses Served", icon: <Building2 size={28} /> },
              { value: "£0", label: "Setup Fees", icon: <BadgePoundSterling size={28} /> },
              { value: "5★", label: "Customer Rating", icon: <Star size={28} /> },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="gradient-warm-section py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3 mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border card-hover relative overflow-hidden"
              >
                {/* Orange accent top bar */}
                <div className="absolute top-0 left-0 w-full h-1 gradient-cta" />
                <div className="flex mb-4 mt-2">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text leading-relaxed mb-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">{testimonial.name}</p>
                    <p className="text-xs text-text-light">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-lg"
            >
              Read all reviews <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── PRICING PREVIEW ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3 mb-4">
              Simple, <span className="text-gradient">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              No hidden fees. No setup costs. No minimum contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Sole Trader */}
            <div className="bg-white border border-border rounded-2xl p-8 card-hover relative overflow-hidden">
              <h3 className="text-lg font-bold text-dark mb-1">Sole Trader</h3>
              <p className="text-sm text-text-light mb-6">Perfect for self-employed</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-dark">£32.50</span>
                <span className="text-text-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Dedicated accountant", "Self assessment tax return", "Unlimited advice", "Free accounting software", "MTD compliant"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center btn-secondary py-3 rounded-xl">
                Get Started
              </Link>
            </div>

            {/* Limited Company — Featured */}
            <div className="relative bg-white rounded-2xl p-8 card-glow overflow-hidden border-gradient">
              <div className="absolute top-0 left-0 w-full h-1.5 gradient-cta" />
              <div className="absolute -top-0 right-4 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-b-xl shadow-lg">
                Most Popular
              </div>
              <h3 className="text-lg font-bold text-dark mb-1 mt-2">Limited Company</h3>
              <p className="text-sm text-text-light mb-6">Full service for Ltd companies</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-dark">£104.50</span>
                <span className="text-text-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Sole Trader", "Year-end accounts & CT600", "VAT returns", "Payroll for directors", "Companies House filings", "Corporation tax planning"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center btn-primary py-3 rounded-xl">
                Get Started
              </Link>
            </div>

            {/* Contractor */}
            <div className="bg-white border border-border rounded-2xl p-8 card-hover relative overflow-hidden">
              <h3 className="text-lg font-bold text-dark mb-1">Contractor</h3>
              <p className="text-sm text-text-light mb-6">Specialist IR35 support</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-dark">£104.50</span>
                <span className="text-text-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Limited Co", "End-to-end IR35 support", "Contract reviews", "Clever FLEX umbrella", "Seamless PSC/Umbrella switch"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center btn-secondary py-3 rounded-xl">
                Get Started
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-lg"
            >
              See full pricing details <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── CTA BANNER ───────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-cta" />
        {/* Animated blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blob-shape animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 blob-shape-2 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 pattern-dots opacity-10" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Make Your<br />Accounting Clever?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join 10,000+ UK businesses. No setup fees, no minimum contract.
            Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-10 py-4 rounded-xl text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <Phone size={20} />
              Call Free: {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>

      {/* ───────── BLOG PREVIEW ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Blog</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mt-3 mb-4">
              Latest News &amp; <span className="text-gradient">Tips</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "MTD for Income Tax: What Sole Traders Need to Know", excerpt: "Making Tax Digital for Income Tax Self Assessment is coming. Here's everything you need to prepare.", category: "Tax", date: "March 2026" },
              { title: "IR35 in 2026: Latest Updates for Contractors", excerpt: "The IR35 landscape continues to evolve. We break down the latest changes and what they mean.", category: "IR35", date: "February 2026" },
              { title: "5 Tax-Saving Tips for Limited Company Directors", excerpt: "Maximise your tax efficiency as a limited company director with these five expert strategies.", category: "Tips", date: "January 2026" },
            ].map((post, i) => (
              <Link key={i} href="/blog" className="group bg-white border border-border rounded-2xl overflow-hidden card-hover">
                <div className="h-48 gradient-cta relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 pattern-dots opacity-20" />
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-black">
                    {post.category[0]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-text-light">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
