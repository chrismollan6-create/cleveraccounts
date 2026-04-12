"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Globe,
  Package,
  CreditCard,
  Receipt,
  Building2,
  BookOpen,
  FileText,
  Monitor,
  TrendingUp,
  Star,
  AlertCircle,
  Layers,
  RefreshCw,
  Users,
  BadgeCheck,
  Store,
  Truck,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── Challenges ────────────────────────────────────────────────
const challenges = [
  {
    icon: Receipt,
    title: "Platform Fees & Reconciliation",
    desc: "Amazon, eBay and Etsy deduct fees, advertising costs, and fulfilment charges before paying you. Reconciling net payouts with your actual sales figures is time-consuming and error-prone without an accountant who knows how.",
  },
  {
    icon: Globe,
    title: "International VAT (OSS / IOSS)",
    desc: "Selling to EU customers? The One Stop Shop (OSS) and Import One Stop Shop (IOSS) schemes change how you account for VAT on cross-border sales. Get it wrong and you face penalties in multiple countries.",
  },
  {
    icon: Package,
    title: "Inventory & Stock Accounting",
    desc: "Stock is an asset, not an immediate expense. Understanding how to value inventory, account for write-offs, and calculate cost of goods sold (COGS) accurately is crucial for accurate profit figures.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Processors",
    desc: "PayPal, Stripe, Klarna, Amazon Pay — each has its own settlement schedule, fees, and reporting format. Pulling this together into clean accounts requires specialist knowledge.",
  },
  {
    icon: ShoppingCart,
    title: "VAT on Digital Services",
    desc: "If you sell digital products or services to consumers in the UK or EU, specific VAT rules apply depending on where your customer is located. These rules are different from physical goods.",
  },
  {
    icon: Building2,
    title: "Sole Trader or Limited Company?",
    desc: "When your online shop starts growing, operating as a sole trader may no longer be the most tax-efficient structure. Knowing when and how to incorporate can save significant tax.",
  },
];

// ── What we handle ────────────────────────────────────────────
const whatWeHandle = [
  {
    icon: BookOpen,
    title: "Full Bookkeeping & Reconciliation",
    desc: "We reconcile your platform payouts — Amazon, eBay, Etsy, Shopify — matching each settlement against your actual sales, fees, and returns. Clean books, every month.",
  },
  {
    icon: FileText,
    title: "VAT Registration & Returns",
    desc: "We advise on when you need to register (£90,000 threshold), the right VAT scheme for your business (Flat Rate vs Standard), and submit your quarterly returns on time.",
  },
  {
    icon: Globe,
    title: "International VAT Compliance",
    desc: "Selling to EU customers? We handle OSS and IOSS registration, returns, and compliance so you stay legal across all EU member states from a single UK registration.",
  },
  {
    icon: Package,
    title: "Inventory Accounting",
    desc: "Correct stock valuation using FIFO or weighted average cost, COGS calculations, write-offs for damaged or unsold stock, and accurate gross profit reporting.",
  },
  {
    icon: TrendingUp,
    title: "Self Assessment or CT600",
    desc: "Whether you're a sole trader filing self assessment or a limited company needing corporation tax returns (CT600), we handle all annual filings and make sure you're tax-efficient.",
  },
  {
    icon: Monitor,
    title: "FreeAgent Setup & Training",
    desc: "We set up your FreeAgent account specifically for ecommerce, including bank connections, Stripe/PayPal feeds where available, and train you on recording sales and expenses correctly.",
  },
];

// ── Platform cards ────────────────────────────────────────────
const platforms = [
  {
    name: "Amazon",
    icon: Store,
    colour: "border-yellow-400/30 bg-yellow-400/5",
    iconColour: "text-yellow-400",
    points: [
      "Settlement reports and net payout reconciliation",
      "Amazon FBA storage fees and fulfilment cost allocation",
      "Amazon Advertising spend as allowable expense",
      "VAT invoice requirements for B2B sales",
      "Amazon VAT Calculation Service interactions",
    ],
  },
  {
    name: "eBay",
    icon: ShoppingCart,
    colour: "border-blue-400/30 bg-blue-400/5",
    iconColour: "text-blue-400",
    points: [
      "Final value fees, listing fees, and promoted listing costs",
      "eBay Managed Payments settlement reconciliation",
      "Part-time seller vs trading status determination",
      "International sales and import VAT implications",
      "Business vs private seller classification for HMRC",
    ],
  },
  {
    name: "Etsy",
    icon: Package,
    colour: "border-orange-400/30 bg-orange-400/5",
    iconColour: "text-orange-400",
    points: [
      "Etsy transaction fees, listing fees, and Etsy Ads",
      "Pattern subscription and off-site ads deductions",
      "Etsy Payments deposit reconciliation",
      "Handmade seller allowable expenses (materials, tools, postage)",
      "When hobby selling becomes a taxable trade",
    ],
  },
  {
    name: "Shopify",
    icon: Layers,
    colour: "border-green-400/30 bg-green-400/5",
    iconColour: "text-green-400",
    points: [
      "Shopify Payments and third-party gateway reconciliation",
      "Subscription costs as allowable business expense",
      "Shopify Capital repayments — not a traditional loan",
      "Multi-currency transactions and exchange rate handling",
      "Inventory sync between Shopify and your accounts",
    ],
  },
];

// ── VAT section points ────────────────────────────────────────
const vatPoints = [
  {
    title: "UK VAT Registration",
    desc: "You must register for VAT once your taxable turnover exceeds £90,000 in any rolling 12-month period. For online sellers this threshold can creep up quickly. We monitor your turnover and advise exactly when to register.",
  },
  {
    title: "EU One Stop Shop (OSS)",
    desc: "If you sell physical goods to consumers in EU countries and your EU sales exceed €10,000 per year, you must account for VAT in each customer's country. The OSS scheme lets you do this through a single registration in one EU country rather than registering in each individually.",
  },
  {
    title: "Import One Stop Shop (IOSS)",
    desc: "Selling goods worth up to €150 to EU consumers from the UK? IOSS lets you collect and remit EU VAT at point of sale, rather than having your customer pay import VAT on delivery. This significantly improves customer experience and conversion rates.",
  },
  {
    title: "Distance Selling — Pre-Brexit Rules",
    desc: "Before Brexit, distance selling thresholds applied per country. Post-Brexit, UK sellers are treated as non-EU businesses. Sales from the UK to EU consumers are exports (zero-rated in the UK) but subject to VAT in the destination country — handled via OSS or IOSS.",
  },
  {
    title: "VAT on Digital Services",
    desc: "If you sell digital products — ebooks, software, online courses, digital downloads — VAT rules differ from physical goods. In the UK, digital services are subject to VAT at the standard rate. When selling to EU consumers, VAT is charged at the rate of the customer's country.",
  },
  {
    title: "Flat Rate VAT Scheme",
    desc: "Many ecommerce businesses benefit from the Flat Rate VAT Scheme — you charge VAT at 20% but pay HMRC a lower fixed percentage. Whether this is beneficial depends on your margins and the sector rate that applies to your business. We'll calculate whether it saves you money.",
  },
];

// ── Sole trader vs Ltd ────────────────────────────────────────
const structurePoints = [
  {
    structure: "Sole Trader",
    best: "Turnover under £50,000–60,000",
    pros: ["Simpler administration", "Lower accountancy costs", "Losses offset against other income", "Immediate access to all profits"],
    cons: ["Pay 20–45% income tax on all profits", "Class 2 & 4 National Insurance on profits", "Personal liability for business debts", "Less tax planning flexibility"],
  },
  {
    structure: "Limited Company",
    best: "Turnover above £50,000–60,000",
    pros: ["Corporation tax at 19–25% on profits", "Draw salary + dividends tax-efficiently", "Limited liability protection", "Enhanced credibility with suppliers"],
    cons: ["More filing obligations (Companies House, CT600)", "Higher accountancy fees", "Director duties and responsibilities", "Dividends taxed as personal income"],
  },
];

// ── Testimonials ─────────────────────────────────────────────
const testimonials = [
  {
    name: "Rachel Owens",
    role: "Amazon FBA Seller",
    quote:
      "I was drowning in Amazon settlement reports and had no idea what my actual profit was. Clever Accounts sorted everything — they reconcile my monthly payouts, handle my VAT returns, and have saved me a fortune in tax through smart advice.",
    rating: 5,
  },
  {
    name: "Tom Brightwell",
    role: "Etsy & eBay Seller",
    quote:
      "When my Etsy shop took off I had no idea I was heading towards the VAT threshold. My accountant at Clever Accounts spotted it early, registered me for VAT, and handled the whole thing. Couldn't be more relieved.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Shopify Store Owner",
    quote:
      "Selling to EU customers after Brexit was a nightmare until Clever Accounts sorted my OSS registration. Now my international VAT is handled automatically and I can focus on growing my business rather than worrying about compliance.",
    rating: 5,
  },
];

// ── FAQ ───────────────────────────────────────────────────────
const faqs = [
  {
    q: "Do I need an accountant for my online shop?",
    a: "Once your online selling is generating a regular income, an accountant becomes essential rather than optional. You need to correctly declare your income on a self assessment tax return, stay on top of the VAT threshold, account for platform fees and inventory correctly, and navigate complex rules like international VAT. Getting any of these wrong can result in HMRC penalties — a good accountant pays for itself several times over.",
  },
  {
    q: "What is OSS and IOSS VAT?",
    a: "OSS (One Stop Shop) is an EU VAT scheme for sellers of physical goods to EU consumers. If your EU sales exceed €10,000 per year, you must charge VAT at the rate of each customer's country. OSS lets you handle all EU VAT via a single registration in one EU member state rather than registering in each country individually. IOSS (Import One Stop Shop) applies to goods worth under €150 imported from outside the EU — it lets you collect and remit VAT at checkout so customers don't face unexpected import charges on delivery.",
  },
  {
    q: "Is accounting different for Amazon vs Etsy?",
    a: "Yes, significantly. Amazon has a complex settlement structure — it nets off FBA storage fees, referral fees, advertising costs, returns, and loan repayments before paying you. Reconciling Amazon payouts requires experience. Etsy is simpler but still has its own fee structure (transaction fees, listing fees, off-site ad fees) and different payment timing. Both platforms require platform-specific knowledge to account for correctly.",
  },
  {
    q: "When should I register for VAT as an online seller?",
    a: "You must register for VAT once your taxable UK turnover exceeds £90,000 in any rolling 12-month period. For most ecommerce sellers this means total sales, not profit. Note that sales to EU consumers may also trigger VAT obligations in the EU (via OSS) once your EU-wide sales exceed €10,000 per year — this is a separate obligation from UK VAT registration. We monitor both thresholds for all our ecommerce clients.",
  },
  {
    q: "Can I claim stock as a business expense?",
    a: "Not directly as an expense in the period you buy it — stock is an asset. You claim the cost of stock as an expense when it is sold (this is your 'cost of goods sold'). Stock remaining at the end of your accounting year must be valued and included in your balance sheet. Getting this wrong distorts your profit figures and can under or over-state your tax liability. We make sure your inventory accounting is handled correctly.",
  },
  {
    q: "How do I account for platform fees?",
    a: "Platform fees (Amazon referral fees, eBay final value fees, Etsy transaction fees, Shopify subscription, Stripe/PayPal fees) are all allowable business expenses deducted from your profit before tax. The tricky part is that most platforms deduct these fees before paying you, so your bank statement shows net receipts rather than gross sales. Your accounts must show gross sales on one side and the fees as expenses on the other — not just the net amount received.",
  },
  {
    q: "What about PayPal and Stripe payments?",
    a: "Both PayPal and Stripe are allowable business expenses for their fees, and their settlements should be reconciled against your sales records. FreeAgent, included free with Clever Accounts, has bank feed connections for Stripe and can import PayPal data, making reconciliation much easier. We set this up for you as part of onboarding so your records stay accurate throughout the year.",
  },
  {
    q: "Should I be a sole trader or limited company for my ecommerce business?",
    a: "For most online sellers starting out, sole trader status is fine and simpler. Once your profit (not turnover) consistently exceeds around £30,000–40,000 per year, a limited company structure typically becomes more tax-efficient — corporation tax at 19–25% on profits vs income tax at 20–45%. There are additional costs and filing obligations for a limited company, so the decision should be made with proper advice. We can model both options for you based on your actual figures.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white">{q}</span>
        {open ? (
          <ChevronUp size={20} className="text-primary-light shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-white/50 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function EcommerceAccountingPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <ShoppingCart size={15} />
                Ecommerce &amp; Online Sellers
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Accounting for{" "}
                <span className="text-gradient">Online Sellers</span> &amp;
                Ecommerce Businesses
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Running an online shop comes with accounting challenges most
                high-street accountants simply don&apos;t understand — complex
                VAT rules, inventory accounting, platform fee reconciliation,
                and international sales.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Clever Accounts specialises in ecommerce businesses. We handle
                everything from Amazon payout reconciliation and OSS/IOSS VAT
                compliance to self assessment and corporation tax — so you can
                focus on growing your shop.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <a
                  href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20"
                >
                  <Phone size={20} /> {COMPANY.freephone}
                </a>
              </div>
            </div>

            {/* Glassmorphism panel */}
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">
                We Work With
              </p>
              <div className="space-y-4">
                {[
                  { name: "Amazon", detail: "FBA & FBM sellers, VAT Calculation Service" },
                  { name: "eBay", detail: "Managed Payments, business & private sellers" },
                  { name: "Etsy", detail: "Handmade, vintage & digital products" },
                  { name: "Shopify", detail: "DTC stores, multi-currency, Shopify Payments" },
                  { name: "WooCommerce", detail: "Self-hosted stores, custom payment gateways" },
                ].map(({ name, detail }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-sm">{name}</span>
                      <span className="text-white/50 text-xs ml-2">{detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-start gap-3">
                <BadgeCheck size={18} className="text-secondary shrink-0 mt-0.5" />
                <p className="text-white/60 text-xs leading-relaxed">
                  FreeAgent accounting software included free with every package
                </p>
              </div>
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

      {/* ── CHALLENGES ───────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              The Complexity
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Why Ecommerce Accounting Is Different
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              Online selling creates accounting challenges that standard
              accountants aren&apos;t equipped for. Here&apos;s what makes it
              complex.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{title}</h3>
                <p className="text-text/70 leading-relaxed text-sm">{desc}</p>
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

      {/* ── WHAT WE HANDLE ───────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Our Service
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What We Handle for Ecommerce Businesses
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              A complete accounting service built around the realities of
              selling online — from day-to-day bookkeeping to annual tax returns.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeHandle.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{title}</h3>
                <p className="text-text/70 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-surface">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ── PLATFORM SUPPORT ─────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              Platform Expertise
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              We Know Your Platform Inside Out
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Each platform has unique accounting complexities. Our accountants
              understand the specifics of each one.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {platforms.map(({ name, icon: Icon, colour, iconColour, points }) => (
              <div
                key={name}
                className={`border rounded-2xl p-6 ${colour}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Icon size={24} className={iconColour} />
                  <h3 className="text-white font-bold text-xl">{name}</h3>
                </div>
                <ul className="space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-white/40 shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── UK / INTERNATIONAL VAT ────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              VAT for Online Sellers
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              UK &amp; International VAT — Explained
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              VAT for ecommerce sellers is among the most complex areas of UK
              tax. Here&apos;s what you need to know.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {vatPoints.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl shadow-sm p-6 card-hover"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-dark mb-2">{title}</h3>
                    <p className="text-text/70 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <ShieldCheck size={28} className="text-primary shrink-0" />
            <div>
              <p className="font-bold text-dark mb-1">
                Not sure if OSS or IOSS applies to you?
              </p>
              <p className="text-text/70 text-sm">
                Call our team on{" "}
                <a
                  href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {COMPANY.freephone}
                </a>{" "}
                for a free no-obligation conversation about your international
                VAT position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="var(--color-surface, #f8f9fa)" />
        </svg>
      </div>

      {/* ── SOLE TRADER VS LTD ───────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Business Structure
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Sole Trader or Limited Company for Ecommerce?
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              The right structure depends on your profit level, growth plans, and
              appetite for administration. Here&apos;s a straight comparison.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {structurePoints.map(({ structure, best, pros, cons }) => (
              <div
                key={structure}
                className="bg-white border border-border rounded-2xl shadow-sm p-7"
              >
                <h3 className="text-xl font-black text-dark mb-1">{structure}</h3>
                <p className="text-sm text-primary font-semibold mb-5">
                  Best for: {best}
                </p>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-text/50 mb-3">
                    Advantages
                  </p>
                  <ul className="space-y-2">
                    {pros.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-text/80">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-text/50 mb-3">
                    Considerations
                  </p>
                  <ul className="space-y-2">
                    {cons.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-warning shrink-0 mt-0.5" />
                        <span className="text-sm text-text/80">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-text/60 mt-6">
            Not sure which is right for you?{" "}
            <Link href="/sign-up" className="text-primary font-semibold hover:underline">
              Speak to an accountant free
            </Link>{" "}
            — we&apos;ll model both options based on your figures.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              Client Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ecommerce Sellers Love Clever Accounts
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, rating }) => (
              <div
                key={name}
                className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed text-sm mb-5 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-white/50 text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-dark">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ecommerce Accounting Questions Answered
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ORANGE CTA ───────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
              Get Started Today
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Specialist Accounting for Your Online Shop
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of ecommerce sellers who trust Clever Accounts to
              handle their bookkeeping, VAT, and tax returns. FreeAgent software
              included free.
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

      {/* ── BOTTOM CTA BAR ───────────────────────────────────── */}
      <section className="bg-surface py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-dark mb-1">
              Already selling online? Switch to an accountant who gets it.
            </h3>
            <p className="text-text/70 text-sm">
              No setup fees. No minimum contract. Switching is straightforward —
              we handle the whole process.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              href="/our-services/accountant-switch"
              className="inline-flex items-center gap-2 bg-white border border-border text-dark font-semibold px-6 py-3 rounded-xl hover:bg-surface transition-all"
            >
              Switch Accountant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
