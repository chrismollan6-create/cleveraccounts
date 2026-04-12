import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  Star,
  BadgeCheck,
  Users,
  Monitor,
  MessageCircle,
  TrendingDown,
  FileText,
  RefreshCw,
  Briefcase,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { getPricingPlans, getFAQs } from "@/sanity/queries";
import PricingFAQ from "@/components/ui/PricingFAQ";

export const metadata: Metadata = {
  title: "Accounting Pricing & Plans — From £32.50/month | Clever Accounts",
  description:
    "Simple, transparent accounting pricing. Sole Trader from £32.50/month, Limited Company & Contractor from £104.50/month. No setup fees, no minimum contract, free FreeAgent included.",
};

// Fallback data if CMS is empty
const fallbackPlans = [
  {
    _id: "1",
    name: "Sole Trader",
    subtitle: "Self-employed & freelancers",
    price: "32.50",
    popular: false,
    features: [
      "Dedicated accountant",
      "Self assessment tax return",
      "Unlimited phone & email support",
      "Free FreeAgent accounting software",
      "MTD ITSA compliant",
      "Expense tracking & mileage",
      "Tax efficiency advice",
      "Real-time financial dashboard",
      "Open banking integration",
    ],
    ctaText: "Get Started",
    ctaLink: "/sign-up",
  },
  {
    _id: "2",
    name: "Limited Company",
    subtitle: "Ltd directors & growing businesses",
    price: "104.50",
    popular: true,
    features: [
      "Everything in Sole Trader, plus:",
      "Year-end accounts & filing",
      "Corporation tax return (CT600)",
      "VAT returns (quarterly)",
      "Director payroll & PAYE",
      "Companies House filings",
      "Dividend advice & planning",
      "Confirmation statement",
      "Corporation tax planning",
    ],
    ctaText: "Get Started",
    ctaLink: "/sign-up",
  },
  {
    _id: "3",
    name: "Contractor",
    subtitle: "IR35 specialists & PSC contractors",
    price: "104.50",
    popular: false,
    features: [
      "Everything in Limited Company, plus:",
      "End-to-end IR35 support",
      "Contract reviews & assessments",
      "IR35 status determination letters",
      "Clever FLEX umbrella solution",
      "Seamless PSC/umbrella switching",
      "Inside/outside IR35 guidance",
      "Bespoke contractor tax advice",
    ],
    ctaText: "Get Started",
    ctaLink: "/sign-up",
  },
];

const fallbackFaqs = [
  { _id: "f1", question: "Are there any setup fees?", answer: "No. There are absolutely no setup fees when you join Clever Accounts. You can start enjoying pro-active accountancy support from day one, at no extra cost." },
  { _id: "f2", question: "Is there a minimum contract period?", answer: "No minimum contract, ever. You can cancel at any time. We want you to stay because we're brilliant — not because you're locked in." },
  { _id: "f3", question: "What's included in the monthly fee?", answer: "Everything. Your dedicated accountant, unlimited advice, all tax returns and filings, Companies House submissions, free FreeAgent accounting software, and a real-time financial dashboard. One fee, no surprises." },
  { _id: "f4", question: "Is FreeAgent really included for free?", answer: "Yes — completely free with every plan. FreeAgent normally costs up to £29/month direct. With Clever Accounts it's included at no extra charge. We're a FreeAgent Platinum Partner." },
  { _id: "f5", question: "Can I switch plans later?", answer: "Absolutely. If your business structure changes — say you move from sole trader to limited company — just speak to your accountant. We'll switch your plan and manage the transition for you." },
  { _id: "f6", question: "Do you offer bespoke pricing?", answer: "Yes. For businesses with more complex needs — multiple directors, larger payrolls, or international operations — we can put together a custom package. Get in touch for a quote." },
  { _id: "f7", question: "What happens when I sign up?", answer: "You'll be matched with a dedicated accountant within one business day. They'll book an onboarding call, set up your FreeAgent account, and handle any transfer from your previous accountant if needed." },
];

const universalFeatures = [
  { icon: Users, label: "Dedicated accountant" },
  { icon: MessageCircle, label: "Unlimited advice" },
  { icon: Monitor, label: "Free FreeAgent software" },
  { icon: BadgeCheck, label: "No setup fee" },
  { icon: ShieldCheck, label: "No minimum contract" },
  { icon: TrendingDown, label: "Tax efficiency advice" },
  { icon: FileText, label: "All HMRC filings" },
  { icon: RefreshCw, label: "Real-time dashboard" },
];

export const revalidate = 60;

export default async function PricingPage() {
  let plans = fallbackPlans;
  let faqs = fallbackFaqs;

  try {
    const cmsPlans = await getPricingPlans();
    if (cmsPlans && cmsPlans.length > 0) plans = cmsPlans;
  } catch (_e) { /* use fallback */ }

  try {
    const cmsFaqs = await getFAQs("pricing");
    if (cmsFaqs && cmsFaqs.length > 0) {
      faqs = cmsFaqs.map((f: { _id: string; question: string; answer: string }) => ({
        _id: f._id,
        question: f.question,
        answer: f.answer,
      }));
    }
  } catch (_e) { /* use fallback */ }

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
            <BadgeCheck size={16} className="text-green-400" />
            No setup fee · No minimum contract · Cancel anytime
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Simple,<br />
            <span className="text-gradient">Transparent Pricing</span>
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mx-auto mb-8">
            One fixed monthly fee. Everything included. No surprise invoices, no hourly billing, no hidden extras.
          </p>
          {/* Trust stars */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-secondary fill-secondary" />)}
          </div>
          <p className="text-white/50 text-sm">Rated 5 stars by thousands of UK businesses</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── PRICING CARDS ────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => {
              const icon = plan.name === "Sole Trader"
                ? <Users size={22} />
                : plan.name === "Contractor"
                ? <Briefcase size={22} />
                : <Building2 size={22} />;

              return (
                <div
                  key={plan._id}
                  className={`rounded-3xl relative overflow-visible card-hover ${
                    plan.popular
                      ? "bg-dark shadow-2xl border-2 border-primary"
                      : "bg-white border border-border shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan header */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? "bg-primary/30 text-primary-light" : "bg-primary/10 text-primary"}`}>
                      {icon}
                    </div>
                    <h3 className={`text-xl font-black mb-1 ${plan.popular ? "text-white" : "text-dark"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-6 ${plan.popular ? "text-white/60" : "text-text-light"}`}>
                      {plan.subtitle}
                    </p>

                    {/* Price */}
                    <div className="mb-1">
                      <span className={`text-5xl font-black ${plan.popular ? "text-white" : "text-dark"}`}>
                        £{plan.price}
                      </span>
                      <span className={`text-base ml-1 ${plan.popular ? "text-white/50" : "text-text-light"}`}>/month</span>
                    </div>
                    <p className={`text-xs mb-6 ${plan.popular ? "text-white/40" : "text-text-light/70"}`}>
                      + VAT where applicable
                    </p>

                    <Link
                      href={plan.ctaLink || "/sign-up"}
                      className={`block w-full text-center font-bold py-3.5 rounded-xl transition-all mb-8 ${
                        plan.popular
                          ? "bg-secondary text-white hover:bg-secondary/90 shadow-lg"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {plan.ctaText || "Get Started"}
                    </Link>

                    {/* Features */}
                    <ul className="space-y-3">
                      {(plan.features || []).map((feature: string) => (
                        <li key={feature} className={`flex items-start gap-2.5 text-sm ${plan.popular ? "text-white/80" : "text-text"}`}>
                          <CheckCircle2 size={17} className={`shrink-0 mt-0.5 ${plan.popular ? "text-green-400" : "text-green-500"}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-text-light">
            {["No setup fees", "No minimum contract", "Cancel anytime", "Free FreeAgent included", "Dedicated accountant"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S IN EVERY PLAN ─────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Every Plan</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What's Included as Standard
            </h2>
            <p className="text-text-light max-w-xl mx-auto">
              Regardless of which plan you choose, these are non-negotiables — included with every Clever Accounts package.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {universalFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white border border-border rounded-2xl p-5 text-center shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} />
                </div>
                <p className="font-semibold text-dark text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESPOKE CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">Complex Needs?</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Need a Bespoke Package?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
            Larger payrolls, multiple directors, international operations, or complex group structures? We put together custom packages for businesses with more involved requirements. Get in touch — no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
              Get a Custom Quote <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">FAQ</p>
            <h2 className="text-3xl font-black text-white mb-4">Pricing Questions Answered</h2>
          </div>
          <PricingFAQ faqs={faqs} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark mb-4">Ready to get started?</h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">
            Join 10,000+ UK businesses. Dedicated accountant, free software, all-inclusive price. No setup fee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
              Get Started Today <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold px-8 py-4 rounded-xl text-lg hover:bg-surface transition-all border border-border shadow-sm">
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
