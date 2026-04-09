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
      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-white/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/90 mb-6">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              Trusted by 10,000+ UK businesses for over 20 years
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Online Accounting
              <br />
              <span className="text-primary-light">Made Clever</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8 max-w-2xl">
              Expert accountancy services for sole traders, limited companies, contractors &amp; freelancers.
              One fixed monthly fee. Unlimited advice. Free accounting software included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
              >
                Get Started Today
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary-light" />
                No setup fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary-light" />
                No minimum contract
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary-light" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── TRUST BAR ───────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-text-light">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium">5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-2xl font-bold text-primary">10,000+</span>
              Businesses Served
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-2xl font-bold text-primary">20+</span>
              Years Experience
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-2xl font-bold text-primary">£0</span>
              Setup Fees
            </div>
          </div>
        </div>
      </section>

      {/* ───────── SERVICES GRID ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Accounting Services for Every Business
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Whether you&apos;re a sole trader, limited company or contractor &mdash; we have a tailored accounting package for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group bg-white border border-border rounded-2xl p-8 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-light">
                    From <span className="text-lg font-bold text-primary">£{service.price}</span>/mo
                  </span>
                  <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/our-services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              View all services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Getting Started Is Easy
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Join 10,000+ businesses in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Choose the package that suits your business and sign up in minutes. No setup fees.",
              },
              {
                step: "2",
                title: "Get Your Accountant",
                description: "You'll be matched with a dedicated accountant who specialises in your business type.",
              },
              {
                step: "3",
                title: "Focus on Business",
                description: "Relax knowing your accounts, tax returns and compliance are all taken care of.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full gradient-cta text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                )}
                <h3 className="text-xl font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-md"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FEATURES GRID ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Everything You Need, One Monthly Fee
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              No hidden costs, no surprises. Just expert accounting support whenever you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
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
      <section className="gradient-cta py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "20+", label: "Years Experience" },
              { value: "10,000+", label: "Businesses Served" },
              { value: "£0", label: "Setup Fees" },
              { value: "5★", label: "Customer Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Join thousands of happy businesses who trust Clever Accounts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border card-hover"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text leading-relaxed mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-dark">{testimonial.name}</p>
                  <p className="text-xs text-text-light">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              Read all reviews <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── PRICING PREVIEW ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              No hidden fees. No setup costs. No minimum contract. Just great accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Sole Trader */}
            <div className="bg-white border border-border rounded-2xl p-8 card-hover">
              <h3 className="text-lg font-bold text-dark mb-1">Sole Trader</h3>
              <p className="text-sm text-text-light mb-4">Perfect for self-employed</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-dark">£32.50</span>
                <span className="text-text-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Dedicated accountant",
                  "Self assessment tax return",
                  "Unlimited advice",
                  "Free accounting software",
                  "MTD compliant",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Limited Company — Featured */}
            <div className="bg-white border-2 border-primary rounded-2xl p-8 card-hover relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">Limited Company</h3>
              <p className="text-sm text-text-light mb-4">Full service for Ltd companies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-dark">£104.50</span>
                <span className="text-text-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Sole Trader",
                  "Year-end accounts & CT600",
                  "VAT returns",
                  "Payroll for directors",
                  "Companies House filings",
                  "Corporation tax planning",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Contractor */}
            <div className="bg-white border border-border rounded-2xl p-8 card-hover">
              <h3 className="text-lg font-bold text-dark mb-1">Contractor</h3>
              <p className="text-sm text-text-light mb-4">Specialist IR35 support</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-dark">£104.50</span>
                <span className="text-text-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Limited Co",
                  "End-to-end IR35 support",
                  "Contract reviews",
                  "Clever FLEX umbrella",
                  "Seamless PSC/Umbrella switch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              See full pricing details <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── CTA BANNER ───────── */}
      <section className="gradient-hero py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make Your Accounting Clever?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join 10,000+ UK businesses who trust Clever Accounts. No setup fees, no minimum contract.
            Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Latest Accounting News &amp; Tips
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Stay up to date with the latest tax news, business tips and accounting advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "MTD for Income Tax: What Sole Traders Need to Know",
                excerpt: "Making Tax Digital for Income Tax Self Assessment is coming. Here's everything you need to prepare your business.",
                category: "Tax",
                date: "March 2026",
              },
              {
                title: "IR35 in 2026: Latest Updates for Contractors",
                excerpt: "The IR35 landscape continues to evolve. We break down the latest changes and what they mean for your contracts.",
                category: "IR35",
                date: "February 2026",
              },
              {
                title: "5 Tax-Saving Tips for Limited Company Directors",
                excerpt: "Maximise your tax efficiency as a limited company director with these five expert strategies.",
                category: "Business Tips",
                date: "January 2026",
              },
            ].map((post, i) => (
              <Link
                key={i}
                href="/blog"
                className="group bg-white border border-border rounded-2xl overflow-hidden card-hover"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center text-white text-2xl font-bold">
                    {post.category[0]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-text-light">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-light leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              View all articles <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
