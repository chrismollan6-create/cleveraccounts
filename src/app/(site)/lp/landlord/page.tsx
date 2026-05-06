import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "Landlord Accountant — From £42.50/mo | Clever Accounts",
  description:
    "Expert landlord accounting from just £42.50/month. Rental income tax, property expenses, self assessment, and Section 24 advice from a dedicated accountant. No setup fees. No contract.",
  robots: { index: true, follow: true },
};

const whyUs: WhyUsItem[] = [
  {
    title: "Specialist Landlord Tax Knowledge",
    description:
      "Property taxation is increasingly complex — Section 24 mortgage interest restrictions, capital gains tax, furnished holiday lettings, and more. We stay on top of every change so you don't have to.",
  },
  {
    title: "Maximise Your Allowable Expenses",
    description:
      "From repairs and maintenance to management fees, insurance, and travel — we ensure you claim every allowable property expense to reduce your rental income tax bill.",
  },
  {
    title: "Section 24 & Mortgage Relief Advice",
    description:
      "The mortgage interest restriction (Section 24) has significantly increased many landlords' tax bills. We advise on the most tax-efficient structure for your portfolio, including incorporation if appropriate.",
  },
  {
    title: "All-Inclusive Monthly Fee",
    description:
      "One fixed monthly fee covers your dedicated accountant, annual self assessment, rental income calculations, and unlimited advice. No surprises at year end.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "Section 24 Increasing Your Tax Bill",
    description:
      "Since the mortgage interest restriction was introduced, many landlords are paying significantly more tax. We help you understand the impact on your portfolio and explore legal ways to mitigate it.",
  },
  {
    title: "Complicated Self Assessment",
    description:
      "Rental income adds significant complexity to your self assessment — especially with multiple properties, joint ownership, or a mix of residential and commercial lettings. We handle all of it.",
  },
  {
    title: "Keeping Up With Legislative Changes",
    description:
      "Landlord tax rules change frequently. From capital gains tax rates to stamp duty surcharges and Making Tax Digital, we keep you informed and compliant.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    title: "Tell Us About Your Portfolio",
    description: "Sign up and share details of your properties. We'll match you with an accountant who specialises in residential lettings.",
  },
  {
    title: "We Analyse Your Tax Position",
    description: "We review your rental income, expenses, and mortgage costs to calculate your tax liability and identify savings.",
  },
  {
    title: "We File & Advise Year-Round",
    description: "We file your self assessment, advise on property acquisitions and disposals, and keep you updated on tax changes that affect landlords.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Section 24 was a real shock — I didn't realise how much extra tax I'd be paying. Clever Accounts restructured my portfolio and saved me thousands.",
    name: "Neil G.",
    businessType: "Residential Landlord (4 properties)",
  },
  {
    quote:
      "I used to dread self assessment with multiple properties. My accountant just sorts it — I get a message to say it's done. Couldn't be simpler.",
    name: "Janet W.",
    businessType: "Buy-to-Let Landlord",
  },
  {
    quote:
      "They spotted I'd been missing several legitimate expenses for years. The backlog repayment from HMRC more than paid for the first year's fees.",
    name: "Simon T.",
    businessType: "HMO Landlord",
  },
];

const faq: FAQItem[] = [
  {
    question: "Do I need to declare rental income to HMRC?",
    answer:
      "Yes — rental income must be declared on a self assessment tax return. This applies even if you only let one property. You pay income tax on your rental profit (income minus allowable expenses). We handle your self assessment as part of your monthly fee.",
  },
  {
    question: "What expenses can I offset against rental income?",
    answer:
      "Allowable expenses include: lettings agent fees, repairs and maintenance (not improvements), buildings and contents insurance, landlord licence fees, ground rent and service charges, council tax and utility bills (if you pay them), accountancy fees, and travel costs for property visits. Mortgage interest is now restricted under Section 24.",
  },
  {
    question: "What is Section 24 and how does it affect me?",
    answer:
      "Section 24 restricts the amount of mortgage interest you can deduct from rental income. Instead of deducting the full interest cost, you now receive a 20% tax credit. Higher-rate taxpayers are most affected. We can model the impact on your portfolio and advise on strategies including potential incorporation.",
  },
  {
    question: "Should I set up a limited company for my properties?",
    answer:
      "This depends on your circumstances — the number of properties, your income tax rate, long-term intentions, and financing arrangements. There are pros and cons, and stamp duty and capital gains implications to consider. We'll give you a clear, personalised analysis.",
  },
  {
    question: "Do you deal with capital gains tax when I sell a property?",
    answer:
      "Yes. When you sell a rental property you may be liable for capital gains tax and must report it to HMRC within 60 days of completion. We calculate your CGT liability, advise on available reliefs, and submit the report to HMRC.",
  },
];

export default function LandlordLP() {
  return (
    <LandingPageLayout
      headline="Landlord Accounting — From £42.50/month"
      subheadline="Specialist landlord accounting for buy-to-let and residential property. We handle rental income tax, self assessment, Section 24, and every expense claim — so your investment works harder."
      price="42.50"
      targetAudience="For Landlords & Property Investors"
      urgencyText="Join landlords across the UK who trust Clever Accounts"
      features={[
        "Dedicated accountant with landlord expertise",
        "Rental income & expense calculations",
        "Self assessment tax return filed for you",
        "Section 24 mortgage interest advice",
        "Capital gains tax on property sales",
        "Multiple property & HMO experience",
        "Unlimited phone & email advice",
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
