import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "Startup Accountant — From £104.50/mo | Clever Accounts",
  description:
    "Expert accounting for startups and new limited companies from £104.50/month. Company formation, first accounts, director payroll, VAT, and a dedicated accountant who grows with your business. No setup fees.",
  robots: { index: true, follow: true },
};

const whyUs: WhyUsItem[] = [
  {
    title: "We Know the Startup Journey",
    description:
      "From incorporation to first invoice, first employee, and first HMRC deadline — we've guided thousands of founders through every stage. You're in safe hands from day one.",
  },
  {
    title: "Proactive, Not Reactive",
    description:
      "Most accountants wait for you to ask questions. We flag what's coming — upcoming deadlines, tax-saving opportunities, and decisions you need to make before they become problems.",
  },
  {
    title: "Scale Without Switching",
    description:
      "Whether you're a solo founder or growing a team, our packages scale with you. Add payroll, VAT, or R&D tax relief as your business grows — all with the same accountant.",
  },
  {
    title: "Free FreeAgent Software Included",
    description:
      "Track your startup's finances in real time. Raise invoices, record expenses, monitor cash flow, and see your corporation tax forecast — all linked to your accountant.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "Not Knowing What You Don't Know",
    description:
      "First-time founders often don't know what financial obligations they have or when. We map out exactly what's required — Companies House, HMRC, VAT, payroll — and handle all of it.",
  },
  {
    title: "Overpaying Tax in the Early Years",
    description:
      "Startups have access to reliefs many founders don't know about — R&D tax credits, Entrepreneurs' Relief, EIS/SEIS for investors. We make sure you claim everything available.",
  },
  {
    title: "Getting Director Pay Wrong",
    description:
      "How you pay yourself as a founder — salary vs dividends — has a significant tax impact. Getting it wrong from the start is costly. We structure it optimally from day one.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    title: "Sign Up & Tell Us About Your Startup",
    description: "New company or already trading? Either way, we'll assign a dedicated startup accountant and get you set up quickly.",
  },
  {
    title: "We Handle All the Compliance",
    description: "HMRC registration, VAT, payroll, Companies House — we handle the admin so you can focus on building your business.",
  },
  {
    title: "Grow With Confidence",
    description: "Year-end accounts, corporation tax, investment-ready financials — we're your finance partner as you scale.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Starting a company is overwhelming enough without worrying about HMRC. Clever Accounts took the entire financial side off my plate from day one. I can't recommend them enough.",
    name: "Natasha B.",
    businessType: "SaaS Startup Founder",
  },
  {
    quote:
      "They structured my salary and dividends from day one and flagged R&D tax relief I didn't know I could claim. First year in business and I already feel like I have a proper finance team.",
    name: "Olusegun A.",
    businessType: "Tech Startup Director",
  },
  {
    quote:
      "Switched from doing it myself after my first Companies House filing went wrong. Clever Accounts cleaned it all up and I've had zero issues since.",
    name: "Laura M.",
    businessType: "E-commerce Startup",
  },
];

const faq: FAQItem[] = [
  {
    question: "Do I need an accountant for my new limited company?",
    answer:
      "Legally you don't, but practically it's almost always worth it from the start. The compliance requirements for a limited company — CT600, Companies House filings, PAYE, VAT — are significant, and mistakes are expensive to fix. Most founders find that the tax savings and penalty avoidance more than cover the cost.",
  },
  {
    question: "What does a startup need to do after incorporating?",
    answer:
      "After incorporating you need to: register with HMRC for corporation tax within 3 months of trading, set up PAYE if you're paying a salary, register for VAT if turnover will exceed £90,000, file annual accounts with Companies House, and submit a CT600 corporation tax return. We handle all of this.",
  },
  {
    question: "Can I claim R&D tax credits as a startup?",
    answer:
      "If your startup is working on innovative products, processes, or software — even if it's not 'research' in the traditional sense — you may qualify for R&D tax relief. This can result in a cash repayment from HMRC or a reduction in your corporation tax bill. We assess your eligibility as part of your package.",
  },
  {
    question: "How should I pay myself as a startup founder?",
    answer:
      "Most founder-directors benefit from a low salary (up to the NI threshold) combined with dividends. This minimises your income tax and National Insurance. The optimal split depends on your company's profit, your personal circumstances, and whether you have other income. We model this for you each tax year.",
  },
  {
    question: "What if I need to raise investment — can you help with financials?",
    answer:
      "Yes. We prepare management accounts, financial forecasts, and investor-ready financial summaries. We can also advise on SEIS and EIS schemes, which offer significant tax reliefs to investors in qualifying startups — a major selling point when fundraising.",
  },
];

export default function StartupLP() {
  return (
    <LandingPageLayout
      headline="Startup Accounting — From £104.50/month"
      subheadline="Build your business, not your admin. We handle every financial obligation from incorporation onwards — corporation tax, VAT, payroll, and investor-ready accounts — so you can focus on growth."
      price="104.50"
      targetAudience="For Startups & New Limited Companies"
      urgencyText="Trusted by startups and founders across the UK"
      features={[
        "Dedicated startup accountant",
        "Company formation support",
        "Year-end accounts & CT600",
        "Director salary & dividend planning",
        "VAT registration & quarterly returns",
        "R&D tax relief assessment",
        "Free FreeAgent accounting software",
        "Unlimited phone & email advice",
      ]}
      whyUs={whyUs}
      painPoints={painPoints}
      howItWorks={howItWorks}
      testimonials={testimonials}
      faq={faq}
    />
  );
}
