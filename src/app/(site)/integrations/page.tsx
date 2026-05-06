import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Award,
  Monitor,
  Smartphone,
  BarChart3,
  FileText,
  CreditCard,
  Zap,
  RefreshCw,
  Users,
  Building,
  Receipt,
  Globe,
  TrendingDown,
  ShieldCheck,
  Link2,
  Settings,
  BadgeCheck,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── FreeAgent features ────────────────────────────────────────
const freeagentFeatures = [
  {
    icon: FileText,
    title: "Professional Invoicing",
    desc: "Create and send branded invoices in seconds. Automatic payment reminders, recurring invoices, and real-time payment status — all from your browser or the app.",
  },
  {
    icon: Receipt,
    title: "Expense Tracking",
    desc: "Snap receipts on your phone and log expenses on the go. Mileage tracking built in. Never miss a tax-deductible expense again.",
  },
  {
    icon: Building,
    title: "Open Banking",
    desc: "Connect your UK bank and transactions import and categorise automatically. No more manual data entry — your books stay up to date in real time.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    desc: "Your profit, tax position, cash flow, and upcoming bills — all visible at a glance on your desktop or phone. Know exactly where you stand, always.",
  },
  {
    icon: Smartphone,
    title: "iOS & Android App",
    desc: "Full-featured mobile app for contractors, sole traders, and business owners on the move. Raise invoices, snap receipts, and check your dashboard anywhere.",
  },
  {
    icon: Zap,
    title: "MTD Compliant",
    desc: "HMRC-recognised MTD-compatible software. Submit VAT returns directly to HMRC with one click — no bridging software, no manual uploads. Income Tax MTD ready for 2026.",
  },
  {
    icon: TrendingDown,
    title: "Real-Time Tax Estimates",
    desc: "FreeAgent calculates your corporation tax, self assessment liability, or VAT in real time as you record transactions — no nasty surprises at year end.",
  },
  {
    icon: RefreshCw,
    title: "Payroll Integration",
    desc: "Run payroll directly within FreeAgent. RTI submissions to HMRC handled automatically. Auto-enrolment pension support included.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    desc: "Invoice international clients in their local currency. Foreign exchange gains and losses handled automatically. Ideal for exporters and online sellers.",
  },
];

// ── Open banking banks ────────────────────────────────────────
const banks = [
  { name: "Barclays", type: "High Street" },
  { name: "HSBC", type: "High Street" },
  { name: "Lloyds Bank", type: "High Street" },
  { name: "NatWest", type: "High Street" },
  { name: "Santander", type: "High Street" },
  { name: "Halifax", type: "High Street" },
  { name: "Starling Bank", type: "Digital" },
  { name: "Monzo Business", type: "Digital" },
  { name: "Metro Bank", type: "Challenger" },
  { name: "Tide", type: "Business" },
];

// ── Other software ────────────────────────────────────────────
const otherSoftware = [
  {
    name: "Xero",
    suits: "Growing businesses, multi-user teams, ecommerce",
    desc: "A popular choice for businesses with more complex needs. If you're already on Xero and don't want to switch, we work with you seamlessly. Our accountants are Xero-certified and experienced across all plan types.",
    tags: ["Limited Companies", "Growing Businesses", "Multi-user Teams"],
  },
  {
    name: "QuickBooks",
    suits: "Sole traders, retail, ecommerce sellers",
    desc: "Well-known across the UK and US, QuickBooks suits a wide range of businesses. If you prefer QuickBooks, our accountants are experienced with it — including QuickBooks Online and Desktop versions.",
    tags: ["Sole Traders", "Retail", "Ecommerce"],
  },
  {
    name: "Sage",
    suits: "CIS contractors, construction, larger payrolls",
    desc: "A stalwart of UK accounting with strong payroll and CIS features. We support Sage users — particularly those in construction, with CIS obligations, or who have larger payrolls requiring dedicated payroll software.",
    tags: ["CIS Contractors", "Payroll-Heavy", "Established Businesses"],
  },
];

// ── MTD connections ───────────────────────────────────────────
const mtdConnections = [
  {
    icon: Zap,
    title: "MTD for VAT — Live Now",
    status: "bg-green-500",
    statusLabel: "Active",
    desc: "FreeAgent submits your VAT returns directly to HMRC in real time. No bridging software. No manual uploads. Fully MTD for VAT compliant since 2019.",
  },
  {
    icon: FileText,
    title: "MTD for Income Tax — April 2026",
    status: "bg-orange-500",
    statusLabel: "Coming April 2026",
    desc: "Sole traders and landlords with income over £50,000 must submit quarterly updates from April 2026. FreeAgent handles all four quarterly submissions plus the final declaration automatically.",
  },
  {
    icon: BarChart3,
    title: "MTD for Corporation Tax — Future",
    status: "bg-purple-500",
    statusLabel: "Future",
    desc: "MTD for Corporation Tax is on HMRC's roadmap. FreeAgent is expected to be compliant ahead of any deadline. We'll proactively update all clients when dates are confirmed.",
  },
  {
    icon: ShieldCheck,
    title: "HMRC Direct Connection",
    status: "bg-blue-500",
    statusLabel: "No Bridging Software",
    desc: "FreeAgent connects directly to HMRC's Making Tax Digital API. There's no need for bridging software, CSV exports, or manual entry — everything flows directly from your records to HMRC.",
  },
];

// ── Onboarding steps ──────────────────────────────────────────
const steps = [
  {
    num: "01",
    icon: Users,
    title: "Sign Up with Clever Accounts",
    desc: "Choose your package and complete sign-up online in minutes. No setup fee, no minimum contract. Your dedicated accountant is assigned immediately.",
  },
  {
    num: "02",
    icon: Settings,
    title: "We Set Up Your FreeAgent",
    desc: "We configure your FreeAgent account for your specific business type — sole trader, limited company, landlord, or contractor. Chart of accounts, VAT settings, payroll if needed — all done for you.",
  },
  {
    num: "03",
    icon: Link2,
    title: "Connect Your Bank",
    desc: "Open banking connects your UK bank account to FreeAgent in under two minutes. Transactions import automatically from day one. Your accountant reviews and categorises anything that needs attention.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Monitor size={15} />
              Software &amp; Integrations
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Accounting Software &amp;{" "}
              <span className="text-gradient">Integrations</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              Every Clever Accounts client gets FreeAgent — award-winning
              accounting software — included free with their package. Connect
              your bank, submit VAT returns directly to HMRC, and manage your
              finances in real time.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              Already using Xero, QuickBooks, or Sage? No problem — our
              accountants work with all major platforms and you don&apos;t need
              to switch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20"
              >
                <Phone size={20} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── FREEAGENT PLATINUM PARTNER ───────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                FreeAgent Platinum Partner
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
                FreeAgent — Included Free with Every Package
              </h2>
              <p className="text-text/70 leading-relaxed mb-6">
                Clever Accounts is a FreeAgent Platinum Partner — the highest
                accreditation FreeAgent awards. This means our accountants are
                fully trained and certified on FreeAgent, and we&apos;re
                recognised as one of the UK&apos;s leading FreeAgent
                practices.
              </p>
              <p className="text-text/70 leading-relaxed mb-6">
                FreeAgent normally costs up to £19/month. With Clever Accounts,
                it&apos;s completely free — included as standard in every
                package, for as long as you&apos;re a client.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "FreeAgent included free — no additional software costs",
                  "Set up and configured by your dedicated accountant",
                  "Open banking connections to 25+ UK banks",
                  "Direct MTD submission to HMRC — no bridging software",
                  "Real-time tax estimates updated as you work",
                  "Full mobile app for iOS and Android",
                  "Unlimited invoices, expenses, and payroll runs",
                  "Retain access to FreeAgent as long as you&apos;re a client",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                    <span className="text-text/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all"
              >
                Get FreeAgent Free <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right: award badge + highlights */}
            <div className="space-y-5">
              {/* Platinum badge */}
              <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 rounded-3xl p-8 text-center shadow-xl">
                <Award size={48} className="text-white mx-auto mb-4" />
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">
                  Official Status
                </p>
                <p className="text-white font-black text-2xl mb-1">
                  FreeAgent Platinum Partner
                </p>
                <p className="text-white/70 text-sm">
                  The highest accreditation awarded by FreeAgent
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Monitor, label: "Browser & Desktop" },
                  { icon: Smartphone, label: "iOS & Android App" },
                  { icon: Zap, label: "MTD Ready" },
                  { icon: RefreshCw, label: "Open Banking" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-white border border-border rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-semibold text-dark">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-3">
                <BadgeCheck size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-text/70 leading-relaxed">
                  <span className="font-semibold text-dark">
                    Already using FreeAgent?
                  </span>{" "}
                  If you&apos;re on FreeAgent with another accountant, switching
                  to Clever Accounts is straightforward — we take over as your
                  Practice and you keep all your existing data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREEAGENT FEATURES GRID ───────────────────────────── */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-dark mb-2">
              Everything FreeAgent Does
            </h3>
            <p className="text-text/70 max-w-xl mx-auto">
              FreeAgent is a full-featured accounting platform — not just
              bookkeeping software. Here&apos;s what&apos;s included.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {freeagentFeatures.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-5"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-dark mb-1">{title}</h4>
                <p className="text-text/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="var(--color-surface, #f8f9fa)" />
        </svg>
      </div>

      {/* ── OPEN BANKING ─────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Open Banking
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Connect Your Bank — Transactions Import Automatically
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              FreeAgent&apos;s open banking integration connects directly to
              your UK bank account. Every transaction imports automatically,
              ready for your accountant to review and categorise.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
            {banks.map(({ name, type }) => (
              <div
                key={name}
                className="bg-white border border-border rounded-2xl p-4 flex flex-col items-center text-center shadow-sm card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Building size={18} />
                </div>
                <p className="font-semibold text-dark text-sm">{name}</p>
                <p className="text-xs text-text/50 mt-1">{type}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: RefreshCw,
                title: "Automatic Import",
                desc: "Transactions pull in from your bank daily — or in real time with supported banks. No more exporting CSVs or manually entering bank statements.",
              },
              {
                icon: BarChart3,
                title: "Smart Categorisation",
                desc: "FreeAgent learns your spending patterns and categorises recurring transactions automatically. Your accountant reviews anything unusual each month.",
              },
              {
                icon: ShieldCheck,
                title: "Read-Only Access",
                desc: "Open banking provides read-only access to your transactions. No one can initiate payments — it&apos;s purely for importing transaction data securely.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-text/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-surface">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── OTHER SOFTWARE ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Software Flexibility
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              We Also Support Xero, QuickBooks &amp; Sage
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              While FreeAgent is our recommended platform (and included free),
              we don&apos;t insist you switch. If you&apos;re already using
              other software and prefer to stay, our accountants are experienced
              across all major platforms.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {otherSoftware.map(({ name, suits, desc, tags }) => (
              <div
                key={name}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6"
              >
                <h3 className="text-xl font-black text-dark mb-1">{name}</h3>
                <p className="text-sm text-primary font-semibold mb-4">
                  Best for: {suits}
                </p>
                <p className="text-text/70 text-sm leading-relaxed mb-5">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-text/60 mt-8">
            Not sure which software is right for you?{" "}
            <Link href="/sign-up" className="text-primary font-semibold hover:underline">
              Speak to our team
            </Link>{" "}
            and we&apos;ll recommend the best fit for your business.
          </p>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ── MTD-READY ────────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              Making Tax Digital
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              MTD-Ready Integrations — Direct HMRC Connection
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              FreeAgent connects directly to HMRC&apos;s MTD API. No bridging
              software, no CSV exports, no manual submissions. Everything flows
              automatically.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mtdConnections.map(({ icon: Icon, title, status, statusLabel, desc }) => (
              <div
                key={title}
                className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-white">{title}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status}`} />
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/making-tax-digital"
              className="inline-flex items-center gap-2 text-primary-light font-semibold hover:underline text-sm"
            >
              Read our full Making Tax Digital guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="var(--color-surface, #f8f9fa)" />
        </svg>
      </div>

      {/* ── INTEGRATION PROCESS ──────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Getting Started
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Up and Running in Three Steps
            </h2>
            <p className="text-lg text-text/70 max-w-xl mx-auto">
              From sign-up to fully connected accounts in under an hour. No
              technical knowledge needed — we handle the setup.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-white text-xs font-black flex items-center justify-center">
                    {num.slice(-1)}
                  </div>
                </div>
                <h3 className="font-black text-dark text-lg mb-3">{title}</h3>
                <p className="text-text/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORANGE CTA ───────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
            <Award size={40} className="text-white/80 mx-auto mb-4" />
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
              FreeAgent Platinum Partner
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Get All of This Free with Clever Accounts
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              FreeAgent included free. Open banking. MTD-ready. Dedicated
              accountant. No setup fees. No minimum contract. Join{" "}
              {COMPANY.stats.businesses.toLocaleString()}+ businesses already
              with Clever Accounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/25 transition-all border border-white/30"
              >
                <Phone size={20} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
