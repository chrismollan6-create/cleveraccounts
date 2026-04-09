import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone, HelpCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { getPricingPlans, getFAQs } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description:
    "Simple, transparent accounting pricing. Sole Trader from £32.50/month, Limited Company from £104.50/month. No setup fees, no minimum contract.",
};

// Fallback data if CMS is empty
const fallbackPlans = [
  {
    _id: "1",
    name: "Sole Trader",
    subtitle: "Perfect for self-employed individuals",
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
    ],
    ctaText: "Get Started",
    ctaLink: "/sign-up",
  },
  {
    _id: "2",
    name: "Limited Company",
    subtitle: "Complete service for Ltd companies",
    price: "104.50",
    popular: true,
    features: [
      "Everything in Sole Trader, plus:",
      "Year-end accounts preparation",
      "Corporation tax return (CT600)",
      "VAT returns (quarterly)",
      "Payroll for directors & staff",
      "Companies House annual filings",
      "Corporation tax planning",
      "Dividend advice & planning",
      "Confirmation statement",
      "Free FreeAgent accounting software",
    ],
    ctaText: "Get Started",
    ctaLink: "/sign-up",
  },
  {
    _id: "3",
    name: "Contractor",
    subtitle: "Specialist IR35 & contracting support",
    price: "104.50",
    popular: false,
    features: [
      "Everything in Limited Company, plus:",
      "End-to-end IR35 support",
      "Contract reviews & assessments",
      "Clever FLEX umbrella solution",
      "Seamless PSC/Umbrella switching",
      "IR35 status determination",
      "Bespoke contractor advice",
      "Inside/outside IR35 guidance",
    ],
    ctaText: "Get Started",
    ctaLink: "/sign-up",
  },
];

const fallbackFaqs = [
  { _id: "f1", question: "Are there any setup fees?", answer: "No. There are absolutely no setup fees when you join Clever Accounts. You can start enjoying pro-active accountancy support immediately." },
  { _id: "f2", question: "Is there a minimum contract period?", answer: "No. We don't impose any minimum contract periods. You can cancel at any time — stay because you want to, not because you have to." },
  { _id: "f3", question: "What's included in the monthly fee?", answer: "Everything! Your dedicated accountant, unlimited advice, all tax returns and filings, free accounting software, and real-time financial dashboard. One fee covers it all." },
  { _id: "f4", question: "Can I switch plans later?", answer: "Absolutely. If your business needs change, you can upgrade or change your plan at any time. Just speak to your dedicated accountant." },
  { _id: "f5", question: "Do you offer bespoke pricing?", answer: "Yes. For businesses with more complex needs, we offer fully bespoke pricing packages tailored to your requirements. Get in touch to discuss." },
];

export const revalidate = 60; // Revalidate every 60 seconds

export default async function PricingPage() {
  let plans = fallbackPlans;
  let faqs = fallbackFaqs;

  try {
    const cmsPlans = await getPricingPlans();
    if (cmsPlans && cmsPlans.length > 0) plans = cmsPlans;
  } catch (e) { /* use fallback */ }

  try {
    const cmsFaqs = await getFAQs("pricing");
    if (cmsFaqs && cmsFaqs.length > 0) {
      faqs = cmsFaqs.map((f: { _id: string; question: string; answer: string }) => ({
        _id: f._id,
        question: f.question,
        answer: f.answer,
      }));
    }
  } catch (e) { /* use fallback */ }

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            No hidden fees. No setup costs. No minimum contract. Choose the plan that suits your business.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-white py-16 md:py-24 -mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`rounded-2xl p-8 card-hover relative ${
                  plan.popular
                    ? "border-2 border-primary shadow-xl bg-white"
                    : "border border-border bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-cta text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-dark mb-1">{plan.name}</h3>
                <p className="text-sm text-text-light mb-6">{plan.subtitle}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black text-dark">£{plan.price}</span>
                  <span className="text-text-light text-lg">/month</span>
                </div>
                <p className="text-xs text-text-light mb-6">+ VAT where applicable</p>
                <Link
                  href={plan.ctaLink || "/sign-up"}
                  className={`block w-full text-center font-semibold py-3.5 rounded-xl transition-colors mb-8 ${
                    plan.popular
                      ? "btn-primary !shadow-none"
                      : "btn-secondary"
                  }`}
                >
                  {plan.ctaText || "Get Started"}
                </Link>
                <ul className="space-y-3">
                  {(plan.features || []).map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text">
                      <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-text-light">
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> No setup fees</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> No minimum contract</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Cancel anytime</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Free accounting software</span>
          </div>
        </div>
      </section>

      {/* Bespoke pricing CTA */}
      <section className="bg-surface py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">Need a Bespoke Package?</h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">
            For businesses with more complex requirements, we offer fully customised pricing. Talk to our team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 btn-secondary">
              Get a Custom Quote <ArrowRight size={18} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-primary hover:text-white transition-colors">
              <Phone size={18} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Pricing FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq._id} className="border border-border rounded-xl p-6">
                <h3 className="flex items-start gap-3 text-base font-semibold text-dark mb-2">
                  <HelpCircle size={20} className="text-primary shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-sm text-text-light leading-relaxed ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="gradient-cta py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">Join 10,000+ UK businesses. No setup fees, cancel anytime.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:shadow-xl transition-all">
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
