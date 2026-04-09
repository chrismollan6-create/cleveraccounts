import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { getFAQs } from "@/sanity/queries";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Clever Accounts online accounting services, pricing, software, and more.",
};

const fallbackCategories: Record<string, { q: string; a: string }[]> = {
  "Getting Started": [
    { q: "How do I sign up?", a: "Simply choose your plan on our pricing page and complete the short sign-up form. You'll be matched with your dedicated accountant within 24 hours." },
    { q: "Are there any setup fees?", a: "No. There are absolutely no setup fees. You start paying your monthly fee from the date you sign up." },
    { q: "Is there a minimum contract?", a: "No. You can cancel at any time. We believe you should stay because you want to, not because you're locked in." },
    { q: "How quickly can I get started?", a: "You can sign up in minutes. Your dedicated accountant will typically be in touch within 24 hours to get you set up." },
  ],
  "Services & Support": [
    { q: "What's included in the monthly fee?", a: "Everything: your dedicated accountant, unlimited advice, all tax returns and filings, free FreeAgent accounting software, real-time dashboard, and open banking." },
    { q: "Do I get a dedicated accountant?", a: "Yes. Every client is matched with a named, dedicated accountant who specialises in their business type. They're your main point of contact for everything." },
    { q: "Is the advice really unlimited?", a: "Absolutely. Call or email your accountant as often as you need. There are no limits and no extra charges for support." },
    { q: "What accounting software do you use?", a: "We include free FreeAgent accounting software with every package. It's cloud-based, intuitive, and lets you manage invoices, expenses and banking on any device." },
  ],
  "Pricing & Billing": [
    { q: "How much does it cost?", a: "Sole Trader packages start from £32.50/month. Limited Company and Contractor packages start from £104.50/month. All prices are plus VAT." },
    { q: "Are there any hidden fees?", a: "None whatsoever. The monthly fee covers everything. No surprise charges for phone calls, tax returns, or additional advice." },
    { q: "How do I pay?", a: "Monthly by Direct Debit. Simple, automatic, and hassle-free." },
    { q: "Can I change my plan?", a: "Yes. If your circumstances change, you can upgrade or switch plans at any time. Just speak to your accountant." },
  ],
  "Switching to Us": [
    { q: "Can I switch from my current accountant?", a: "Absolutely. We make switching easy and handle everything. We'll contact your previous accountant and manage the entire transition for you." },
    { q: "Is there a cost to switch?", a: "No. Switching to Clever Accounts is completely free. There are no setup fees or transfer charges." },
    { q: "How long does switching take?", a: "Most switches are completed within 2-4 weeks. You can start using our software immediately while we handle the handover in the background." },
    { q: "Will there be any disruption?", a: "No. We ensure a seamless transition with no gap in your accounting support. Your new accountant takes over right where your old one left off." },
  ],
};

const categoryLabels: Record<string, string> = {
  "getting-started": "Getting Started",
  "pricing": "Pricing & Billing",
  "services": "Services & Support",
  "switching": "Switching to Us",
  "sole-trader": "Sole Trader",
  "limited-company": "Limited Company",
  "contractor": "Contractor / IR35",
  "vat": "VAT",
  "payroll": "Payroll",
  "software": "Software",
};

export const revalidate = 60;

export default async function FAQPage() {
  // Try CMS first
  let faqsByCategory: Record<string, { q: string; a: string }[]> = {};
  let usingCMS = false;

  try {
    const cmsFaqs = await getFAQs();
    if (cmsFaqs && cmsFaqs.length > 0) {
      usingCMS = true;
      for (const faq of cmsFaqs) {
        const label = categoryLabels[faq.category] || faq.category;
        if (!faqsByCategory[label]) faqsByCategory[label] = [];
        faqsByCategory[label].push({ q: faq.question, a: faq.answer });
      }
    }
  } catch (e) { /* use fallback */ }

  if (!usingCMS) {
    faqsByCategory = fallbackCategories;
  }

  // Flatten for JSON-LD
  const allFaqs = Object.values(faqsByCategory).flat();

  return (
    <>
      <FAQPageJsonLd faqs={allFaqs} />

      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Find answers to common questions about our accounting services.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 space-y-16">
          {Object.entries(faqsByCategory).map(([category, faqs]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-dark mb-6">{category}</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-xl p-6">
                    <h3 className="flex items-start gap-3 text-base font-semibold text-dark mb-2">
                      <HelpCircle size={20} className="text-primary shrink-0 mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-sm text-text-light leading-relaxed ml-8">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="gradient-cta py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-white/80 mb-8">Our team is happy to help. Get in touch today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:shadow-xl transition-all">
              Contact Us <ArrowRight size={20} />
            </Link>
            <Link href="/sign-up" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
