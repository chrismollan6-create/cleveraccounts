import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  const flex = brand.id === "clever";
  return {
    title: `Contractor Accountant + IR35 Support — From £104.50/mo | ${brand.name}`,
    description: flex
      ? "Specialist contractor accounting with end-to-end IR35 support, contract reviews, and our unique Clever FLEX umbrella solution. Switch between PSC and umbrella seamlessly. From £104.50/month."
      : "Specialist contractor accounting with end-to-end IR35 support, contract reviews, and a flexible umbrella solution. Switch between PSC and umbrella seamlessly. From £104.50/month.",
    robots: { index: true, follow: true },
  };
}

const makeWhyUs = (flex: boolean): WhyUsItem[] => [
  {
    title: "Specialist IR35 Expertise",
    description:
      "IR35 is one of the most complex areas of contractor tax. Our specialist team has guided thousands of contractors through IR35 assessments, contract reviews, and HMRC enquiries.",
  },
  flex
    ? {
        title: "Clever FLEX — Unique to Us",
        description:
          "Our proprietary Clever FLEX solution lets you switch seamlessly between your personal service company (PSC) and an umbrella arrangement — so you're always in the right structure, whatever your contract.",
      }
    : {
        title: "Flexible Umbrella Switching",
        description:
          "Our umbrella solution lets you switch seamlessly between your personal service company (PSC) and an umbrella arrangement — so you're always in the right structure, whatever your contract.",
      },
  {
    title: "Contract Review Service",
    description:
      "Before you sign, we review your contract for IR35 indicators and advise on wording. We also assess working practices to build a robust outside-IR35 position.",
  },
  {
    title: "Full Limited Company Accounting",
    description:
      "Everything your PSC needs: year-end accounts, CT600, VAT, payroll, Companies House filings, and director self assessment — all in one monthly fee.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "IR35 Uncertainty",
    description:
      "An inside-IR35 determination can cost you tens of thousands in lost take-home pay. We help you understand your status and build the strongest possible outside-IR35 position.",
  },
  {
    title: "Switching Engagements",
    description:
      "Moving from one contract to another — especially across inside and outside IR35 — creates accounting and tax complexity. We manage every transition smoothly.",
  },
  {
    title: "Umbrella vs PSC Decisions",
    description:
      "Many contractors aren't sure whether to operate through their own company or an umbrella. We give you clear, impartial advice based on your specific contracts and circumstances.",
  },
];

const makeHowItWorks = (flex: boolean): HowItWorksStep[] => [
  {
    title: "Sign Up & Tell Us About Your Contract",
    description: "We'll assign you a specialist contractor accountant and review your current engagement immediately.",
  },
  {
    title: "IR35 Assessment & Advice",
    description: "We assess your contract and working practices, advise on your IR35 position, and review contract wording if needed.",
  },
  {
    title: "Ongoing Support for Every Contract",
    description: `As your contracts change, we're with you — new reviews, ${flex ? "Clever FLEX" : "umbrella"} switching, accounts, and tax all handled.`,
  },
];

const makeTestimonials = (brandName: string, flex: boolean): Testimonial[] => [
  {
    quote:
      `The IR35 landscape is terrifying if you don't have specialist support. ${brandName} reviewed my contract within 24 hours and gave me complete confidence in my outside position.`,
    name: "Rob F.",
    businessType: "IT Contractor (Outside IR35)",
  },
  {
    quote:
      `I've used three contractor accountants over the years. ${brandName} is the only one that proactively contacts me before contract renewals rather than waiting for me to ask.`,
    name: "Anita P.",
    businessType: "Project Management Contractor",
  },
  {
    quote: flex
      ? "Clever FLEX is a game changer. I had an inside IR35 contract and was able to switch to umbrella through them in one day. Seamless."
      : "The umbrella switching is a game changer. I had an inside IR35 contract and was able to switch to umbrella through them in one day. Seamless.",
    name: "Craig M.",
    businessType: "Engineering Contractor",
  },
];

const makeFaq = (flex: boolean): FAQItem[] => [
  {
    question: "What is IR35 and does it apply to me?",
    answer:
      "IR35 (the off-payroll working rules) determines whether a contractor working through a personal service company should be taxed as an employee. If you're caught inside IR35 your take-home pay drops significantly. We assess your specific contracts and working practices and advise on how to protect your outside-IR35 status.",
  },
  flex
    ? {
        question: "What is Clever FLEX?",
        answer:
          "Clever FLEX is our unique solution for contractors who have a mix of inside and outside IR35 engagements. It allows you to switch between operating through your own limited company (PSC) and an umbrella arrangement seamlessly — so you're always in the right structure for each contract.",
      }
    : {
        question: "Can I switch between a limited company and an umbrella?",
        answer:
          "Yes. Our umbrella solution is built for contractors who have a mix of inside and outside IR35 engagements. It allows you to switch between operating through your own limited company (PSC) and an umbrella arrangement seamlessly — so you're always in the right structure for each contract.",
      },
  {
    question: "Do you review contracts before I sign?",
    answer:
      "Yes — contract review is included. We review your contract for IR35 indicators and advise on wording changes that strengthen your outside position. We also assess working practices, which are just as important as the written contract.",
  },
  {
    question: "What's included in the accounting package?",
    answer:
      "Everything your PSC needs: specialist contractor accountant, year-end statutory accounts, CT600 corporation tax, VAT returns, director payroll, Companies House filings, director self assessment, free FreeAgent software, and unlimited advice.",
  },
  {
    question: "Can you help if I'm already inside IR35?",
    answer: flex
      ? "Yes. If you're inside IR35, we'll advise on the most tax-efficient way to operate, whether that's through an umbrella company via Clever FLEX, or structuring your company for a future outside engagement."
      : "Yes. If you're inside IR35, we'll advise on the most tax-efficient way to operate, whether that's through an umbrella company, or structuring your company for a future outside engagement.",
  },
];

export default async function ContractorLP() {
  const brand = await getBrand();
  const flex = brand.id === "clever";
  const whyUs = makeWhyUs(flex);
  const howItWorks = makeHowItWorks(flex);
  const testimonials = makeTestimonials(brand.name, flex);
  const faq = makeFaq(flex);
  return (
    <LandingPageLayout
      headline="Contractor Accounting With Full IR35 Support"
      subheadline={
        flex
          ? "End-to-end IR35 support, contract reviews, and our unique Clever FLEX solution. We're the specialist contractor accountant that keeps you compliant and maximises your take-home pay."
          : "End-to-end IR35 support, contract reviews, and a flexible umbrella solution. We're the specialist contractor accountant that keeps you compliant and maximises your take-home pay."
      }
      price="104.50"
      targetAudience="For Contractors & Freelancers"
      urgencyText={flex ? "2,000+ contractors trust us with their IR35" : "Contractors across the UK trust us with their IR35"}
      features={[
        "Specialist contractor accountant",
        "End-to-end IR35 support",
        "Contract reviews & assessments",
        flex ? "Clever FLEX umbrella solution" : "Flexible umbrella solution",
        "Seamless PSC/Umbrella switching",
        "Full limited company accounting",
        "Free FreeAgent accounting software",
        "Unlimited advice & support",
      ]}
      whyUs={whyUs}
      painPoints={painPoints}
      howItWorks={howItWorks}
      testimonials={testimonials}
      faq={faq}
    />
  );
}
