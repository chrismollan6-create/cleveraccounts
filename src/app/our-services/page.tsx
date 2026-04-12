import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, ChevronRight, User, Building2, Briefcase, Home, Rocket,
  CheckCircle2, HardHat, ShoppingCart, Phone, Star, Zap, Shield, HeadphonesIcon,
  BadgePoundSterling, Monitor, FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Online Accounting Services UK — All Packages | Clever Accounts",
  description:
    "Online accounting services for sole traders, limited companies, contractors, landlords, CIS & more. Dedicated accountant, free FreeAgent software, from £42.50/month. No setup fees.",
};

const services = [
  {
    icon: User,
    title: "Sole Trader",
    subtitle: "Self-employed & freelancers",
    description: "Stop worrying about your accounts. Your dedicated accountant handles your self assessment, expenses and tax — so you can focus on the work you love.",
    price: "42.50",
    href: "/sole-trader",
    colour: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500",
    tag: null,
  },
  {
    icon: Building2,
    title: "Limited Company",
    subtitle: "Ltd directors & growing businesses",
    description: "Year-end accounts, corporation tax, VAT, payroll — all handled. One fixed monthly fee, one dedicated accountant, zero surprises.",
    price: "104.50",
    href: "/limited-company",
    colour: "bg-primary/10 text-primary group-hover:bg-primary",
    tag: "Most Popular",
  },
  {
    icon: Briefcase,
    title: "Contractor",
    subtitle: "PSC & umbrella contractors",
    description: "IR35 keeping you up at night? Don't let it. Our specialist contractor accountants know exactly how to protect you — and our Clever FLEX solution means you can switch between PSC and umbrella seamlessly.",
    price: "104.50",
    href: "/contractor-accountancy",
    colour: "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500",
    tag: "IR35 Specialists",
  },
  {
    icon: Home,
    title: "Landlord",
    subtitle: "Property investors & landlords",
    description: "Rental income, allowable expenses, mortgage interest — property tax is complex. We make it simple, keeping you compliant and as tax-efficient as possible.",
    price: "42.50",
    href: "/landlord-accounting",
    colour: "bg-green-500/10 text-green-600 group-hover:bg-green-500",
    tag: null,
  },
  {
    icon: HardHat,
    title: "CIS / Construction",
    subtitle: "Contractors & subcontractors",
    description: "CIS deductions, monthly returns, tax rebates — it's a lot to keep on top of. We handle everything, and make sure you're never paying more than you owe.",
    price: "42.50",
    href: "/cis-accounting",
    colour: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500",
    tag: null,
  },
  {
    icon: Rocket,
    title: "Startup",
    subtitle: "New businesses & entrepreneurs",
    description: "Get your business off to the best start. From company formation to your first accounts, we're with you from day one — no jargon, just solid advice.",
    price: "104.50",
    href: "/accounting-for-startups",
    colour: "bg-secondary/10 text-secondary group-hover:bg-secondary",
    tag: null,
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce",
    subtitle: "Online sellers & retailers",
    description: "Selling on Amazon, Shopify or Etsy? We understand the complexities of ecommerce accounting — VAT, OSS/IOSS, marketplace fees and all.",
    price: "104.50",
    href: "/ecommerce-accounting",
    colour: "bg-pink-500/10 text-pink-600 group-hover:bg-pink-500",
    tag: null,
  },
];

const included = [
  { icon: HeadphonesIcon, label: "Dedicated accountant", desc: "Your own named accountant who knows your business" },
  { icon: Phone, label: "Unlimited advice", desc: "Call or email as often as you need, no extra charge" },
  { icon: Monitor, label: "Free FreeAgent software", desc: "Award-winning software included with every package" },
  { icon: BadgePoundSterling, label: "No setup fees", desc: "Get started immediately with zero upfront costs" },
  { icon: Shield, label: "No minimum contract", desc: "Cancel anytime — stay because you want to" },
  { icon: Zap, label: "Real-time dashboard", desc: "Track your finances on any device, anytime" },
  { icon: FileCheck, label: "All filings & submissions", desc: "HMRC, Companies House, VAT — all handled for you" },
  { icon: CheckCircle2, label: "Tax efficiency advice", desc: "Proactive planning so you keep more of what you earn" },
];

const specialists = [
  { title: "Accounting Software", desc: "Free FreeAgent — rated the UK's #1 accounting software for small businesses.", href: "/our-services/accounting-software", tag: "Platinum Partner" },
  { title: "Switch Accountant", desc: "Already have an accountant? Switching to us is painless. We handle the transfer and you don't lose a day.", href: "/our-services/accountant-switch", tag: "We Handle Everything" },
  { title: "IR35 Specialist", desc: "The most complex area of contractor tax. Our specialists know it inside out.", href: "/contractor-accountants/ir35", tag: "Contractors" },
  { title: "Making Tax Digital", desc: "MTD is coming for everyone. We'll make sure you're ready — and compliant from day one.", href: "/making-tax-digital", tag: "From April 2026" },
  { title: "Self Assessment", desc: "Stressed about your tax return? Hand it over. We'll file it accurately and on time.", href: "/self-assessment", tag: "Sole Traders" },
  { title: "VAT Returns", desc: "We prepare and submit your VAT returns, and keep you on the right scheme for your business.", href: "/vat-returns", tag: "All Packages" },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-4">What We Do</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Accounting That Works<br />
            <span className="text-gradient">For Your Business</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            One fixed monthly fee. Your own dedicated accountant. Free software. No setup costs, no minimum contract — just straightforward, expert accounting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg">
              Get Started Today <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
              View Pricing
            </Link>
          </div>
          {/* Social proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-secondary text-secondary" />)}</div>
              <span>4.7 on Trustpilot</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white/60 text-sm">10,000+ businesses</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white/60 text-sm">20+ years experience</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── SERVICE CARDS ────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">Find Your Package</h2>
            <p className="text-text-light max-w-xl mx-auto">Every package includes a dedicated accountant, free software and unlimited support. Pick the one that fits your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group relative bg-white border border-border rounded-2xl p-8 card-hover flex flex-col"
                >
                  {service.tag && (
                    <span className="absolute top-5 right-5 text-xs font-bold bg-secondary/10 text-secondary px-2.5 py-1 rounded-full">
                      {service.tag}
                    </span>
                  )}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:text-white ${service.colour}`}>
                    <Icon size={26} />
                  </div>
                  <div className="mb-1">
                    <h2 className="text-xl font-black text-dark group-hover:text-primary transition-colors">{service.title}</h2>
                    <p className="text-xs text-text-light font-medium mt-0.5">{service.subtitle}</p>
                  </div>
                  <p className="text-text-light text-sm leading-relaxed my-4 flex-1">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <span className="text-sm text-text-light">From <span className="text-xl font-black text-primary">£{service.price}</span><span className="text-xs">/mo</span></span>
                    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more <ChevronRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">Every Package</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Everything Included.<br />No Hidden Extras.</h2>
            <p className="text-white/60 max-w-xl mx-auto">You shouldn't have to pay extra every time you pick up the phone. With Clever Accounts, everything is included in your monthly fee.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {included.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-light flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <p className="text-white font-bold text-sm mb-1">{label}</p>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALIST SERVICES ──────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">More From Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">Specialist Services</h2>
            <p className="text-text-light max-w-xl mx-auto">Beyond the core packages, we offer a range of specialist services to handle the complex stuff.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialists.map((s) => (
              <Link key={s.href} href={s.href} className="group bg-white border border-border rounded-2xl p-6 card-hover flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-black text-dark group-hover:text-primary transition-colors">{s.title}</h3>
                  <span className="text-xs font-bold bg-primary/8 text-primary px-2 py-0.5 rounded-full shrink-0 ml-2">{s.tag}</span>
                </div>
                <p className="text-sm text-text-light leading-relaxed flex-1">{s.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 mt-4 group-hover:gap-2 transition-all">
                  Find out more <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Not Sure Which Package?</h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Give us a call — we'll point you in the right direction. No sales pitch, just honest advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get Started <ArrowRight size={20} />
            </Link>
            <a href="tel:01135188800" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              <Phone size={20} />
              0113 518 8800
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
