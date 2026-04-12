import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "Freelancer Accountant — From £32.50/mo | Clever Accounts",
  description:
    "Expert accounting for freelancers from just £32.50/month. Self assessment, invoicing, expense tracking, and unlimited advice from a dedicated accountant. No setup fees. No contract.",
  robots: { index: true, follow: true },
};

const whyUs: WhyUsItem[] = [
  {
    title: "Built for Freelancers",
    description:
      "Whether you're a designer, developer, writer, photographer, or consultant — we understand freelance income, irregular earnings, and the expenses that are unique to your industry.",
  },
  {
    title: "Your Own Dedicated Accountant",
    description:
      "A real person who knows your business, available by phone or email whenever you need them. Unlimited advice is included — no extra charges for a quick question.",
  },
  {
    title: "Invoicing & Expense Tracking Sorted",
    description:
      "Free FreeAgent software is included. Raise professional invoices, photograph receipts on your phone, and track mileage — all in one place, synced with your accountant.",
  },
  {
    title: "Tax You Don't Have to Think About",
    description:
      "We calculate and file your self assessment tax return every year. We also give you a tax forecast so you're never caught short when the bill arrives.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "Irregular Income & Cash Flow",
    description:
      "Feast-or-famine income makes it hard to know how much to set aside for tax. We give you a running tax estimate throughout the year so you're always prepared.",
  },
  {
    title: "Not Knowing What You Can Claim",
    description:
      "Home office, equipment, software subscriptions, professional development, travel — most freelancers miss legitimate deductions. We make sure you claim every penny you're entitled to.",
  },
  {
    title: "Self Assessment Dread",
    description:
      "The January 31st deadline catches thousands of freelancers off guard every year. We handle your tax return and file it on time — no stress, no last-minute panic.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    title: "Sign Up in 2 Minutes",
    description: "Tell us about your freelance work and we'll match you with a dedicated accountant who understands your industry.",
  },
  {
    title: "We Sort Out Your Finances",
    description: "We register you with HMRC, set up your FreeAgent account, and review your income and expenses from day one.",
  },
  {
    title: "File, Save, Repeat",
    description: "Your accountant files your annual tax return, advises on savings, and is on hand throughout the year for any questions.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "As a freelance developer I had no idea how much to save for tax. My Clever Accounts accountant set up a simple system and I've never been caught short since.",
    name: "Alex B.",
    businessType: "Freelance Web Developer",
  },
  {
    quote:
      "I was doing my own self assessment and getting it wrong every year. Switched to Clever Accounts and immediately got a refund from HMRC for over-payments. Brilliant.",
    name: "Charlotte D.",
    businessType: "Freelance Copywriter",
  },
  {
    quote:
      "Really friendly and knowledgeable. They explained everything clearly and I feel completely on top of my finances for the first time.",
    name: "Marcus L.",
    businessType: "Freelance Photographer",
  },
];

const faq: FAQItem[] = [
  {
    question: "What's the difference between a freelancer and a sole trader?",
    answer:
      "Legally, freelancers operating as self-employed individuals are sole traders. Both file a self assessment tax return each year. Some freelancers choose to incorporate as a limited company if their income is high enough — we'll advise you on the right structure for your earnings.",
  },
  {
    question: "Do you handle self assessment for freelancers?",
    answer:
      "Yes — preparing and filing your annual self assessment tax return is included in your monthly fee. We collect your income and expense information, calculate your tax liability, and submit it to HMRC before the deadline.",
  },
  {
    question: "What can I claim as a freelancer?",
    answer:
      "Common freelancer deductions include: home office costs (a proportion of rent/mortgage, utilities, broadband), equipment and software, professional subscriptions, phone costs (business proportion), travel to clients, marketing and advertising, and professional development courses.",
  },
  {
    question: "How do I pay myself as a freelancer?",
    answer:
      "As a sole trader freelancer, all your business profit is your income — there's no distinction between business and personal money. You'll pay income tax and National Insurance on your profits via self assessment. We'll help you plan your finances to avoid surprises.",
  },
  {
    question: "Should I register for VAT as a freelancer?",
    answer:
      "You must register for VAT if your taxable turnover exceeds £90,000 in a rolling 12-month period. Some freelancers choose to register voluntarily. We'll advise you on the pros and cons based on your clients and income level.",
  },
];

export default function FreelancerLP() {
  return (
    <LandingPageLayout
      headline="Freelancer Accounting — From £32.50/month"
      subheadline="Your own dedicated accountant handles self assessment, expense tracking, and tax planning — so you can focus on the work you love, not the paperwork."
      price="32.50"
      targetAudience="For Freelancers & Self-Employed"
      urgencyText="Thousands of freelancers trust Clever Accounts"
      features={[
        "Your own dedicated accountant",
        "Self assessment tax return filed for you",
        "Unlimited phone & email advice",
        "Free FreeAgent accounting software",
        "Invoice creation & expense tracking",
        "Tax forecast so you're never caught short",
        "HMRC registration & correspondence",
        "MTD for Income Tax compliant",
      ]}
      whyUs={whyUs}
      painPoints={painPoints}
      howItWorks={howItWorks}
      testimonials={testimonials}
      faq={faq}
    />
  );
}
