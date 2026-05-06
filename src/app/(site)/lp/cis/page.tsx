import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "CIS Accountant for Construction Workers — From £49.95/mo | Clever Accounts",
  description:
    "Specialist CIS accounting for subbies and self-employed construction workers. CIS deduction reclaims, monthly returns, self assessment and unlimited advice. No setup fees. No contract.",
  robots: { index: true, follow: true },
};

const whyUs: WhyUsItem[] = [
  {
    title: "CIS Specialist Accountants",
    description:
      "The Construction Industry Scheme has its own rules, forms, and deadlines. Our accountants work with construction workers every day — we know CIS inside out.",
  },
  {
    title: "CIS Deduction Refunds",
    description:
      "If your contractor deducts 20% (or 30%) CIS tax from your payments, you may well be owed money back from HMRC. We calculate exactly what you're owed and reclaim it for you.",
  },
  {
    title: "Monthly CIS Returns Handled",
    description:
      "If you engage subbies yourself, you need to submit CIS monthly returns to HMRC. We handle these for you so you're never late and never liable for penalties.",
  },
  {
    title: "Gross Payment Status Advice",
    description:
      "Qualifying for gross payment status means you receive payments without deductions. We help you apply and maintain the compliance record needed to keep it.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "Over-Deducted CIS Tax",
    description:
      "Contractors often deduct too much CIS tax — especially if you have legitimate expenses HMRC doesn't know about. We identify your refund and reclaim it promptly.",
  },
  {
    title: "Late or Missed CIS Returns",
    description:
      "HMRC charges £100 per month for late CIS monthly returns. If you're a contractor paying subbies, these returns are non-negotiable. We file them on time, every time.",
  },
  {
    title: "Self Assessment Complexity",
    description:
      "CIS workers need to file a self assessment tax return each year, accounting for CIS deductions suffered. This needs to be done carefully to claim back what you're owed.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    title: "Sign Up & Tell Us About Your Work",
    description: "Tell us whether you're a subcontractor, contractor, or both. We'll assign a CIS specialist to your account.",
  },
  {
    title: "We Register & Reclaim",
    description: "We ensure you're registered correctly with HMRC under CIS, review your deduction history, and identify any refund due.",
  },
  {
    title: "Returns, Tax & Peace of Mind",
    description: "We handle monthly CIS returns, year-end self assessment, and keep you fully compliant — no fines, no surprises.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "I had no idea I was owed £3,800 back from HMRC in CIS deductions. Clever Accounts found it, claimed it, and I had the money in six weeks.",
    name: "Lee P.",
    businessType: "Self-Employed Electrician",
  },
  {
    quote:
      "As a small groundworks contractor I was always late with CIS returns. Since switching to Clever Accounts I haven't had a single penalty.",
    name: "Gary T.",
    businessType: "Groundworks Contractor",
  },
  {
    quote:
      "Finally an accountant who actually understands construction. They sorted out years of messy records and got me on gross payment status.",
    name: "Kevin S.",
    businessType: "Plumbing & Heating Engineer",
  },
];

const faq: FAQItem[] = [
  {
    question: "What is the Construction Industry Scheme (CIS)?",
    answer:
      "CIS is an HMRC scheme for the construction industry. Contractors must deduct money from subcontractor payments and pass it to HMRC as advance tax payments. The standard deduction rate is 20% for registered subbies and 30% for unregistered ones. We register you correctly and manage your deductions.",
  },
  {
    question: "Can I claim back CIS deductions?",
    answer:
      "Yes — if the CIS deductions withheld from you are more than your actual income tax and National Insurance liability, you're owed the difference back. Many construction workers get a significant refund each year. We calculate your exact position and reclaim the overpayment through your self assessment.",
  },
  {
    question: "Do I still need to file a self assessment as a CIS worker?",
    answer:
      "Yes. Even though CIS deductions are made throughout the year, you still need to file an annual self assessment return. This is how HMRC reconciles what you've paid against what you actually owe — and how any refund is calculated.",
  },
  {
    question: "What is gross payment status and how do I get it?",
    answer:
      "Gross payment status means contractors pay you in full without deducting CIS tax. You then pay tax directly to HMRC through self assessment. To qualify you need to meet HMRC's compliance, turnover, and business tests. We can help you apply and maintain the status.",
  },
  {
    question: "I'm a contractor who pays subbies — what do I need to do?",
    answer:
      "As a contractor you must: verify subbies with HMRC, deduct the correct CIS amount from payments, submit monthly CIS returns to HMRC by the 19th of each month, and issue payment and deduction statements to subbies. We handle all of this for you.",
  },
];

export default function CISLP() {
  return (
    <LandingPageLayout
      headline="CIS Accounting for Construction Workers"
      subheadline="We handle CIS deductions, monthly returns, tax reclaims, and self assessment — so you can focus on the job. Many construction workers get money back from HMRC each year. Let us find yours."
      price="49.95"
      targetAudience="For CIS Subbies & Construction Contractors"
      urgencyText="Join construction workers across the UK who trust Clever Accounts"
      features={[
        "Dedicated CIS specialist accountant",
        "CIS deduction reclaim from HMRC",
        "Monthly CIS returns filed on time",
        "Self assessment tax return included",
        "CIS registration & verification",
        "Gross payment status applications",
        "Unlimited phone & email advice",
        "HMRC correspondence handled",
      ]}
      whyUs={whyUs}
      painPoints={painPoints}
      howItWorks={howItWorks}
      testimonials={testimonials}
      faq={faq}
    />
  );
}
