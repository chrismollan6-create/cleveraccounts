import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `Salary & Payroll Information 2026/27 | ${brand.name}`,
    description: `Your 2026/27 tax-year guide to taking a salary through your company — tax-efficient salary options, the payroll timeline, RTI, pension auto-enrolment and Employment Allowance. ${brand.name} runs your payroll and files RTI with HMRC every month.`,
    alternates: { canonical: "/payroll-and-salary-information" },
  };
}

const faqs = (brandName: string) => [
  {
    q: "What salary should I take from my company in 2026/27?",
    a: `Most directors take a salary up to the personal allowance of £12,570, which is free of income tax, with the rest of their income drawn as dividends. The exact optimal figure depends on whether you have other earnings, your National Insurance position, and whether your company can claim Employment Allowance. ${brandName} reviews your circumstances each tax year and recommends the most tax-efficient salary for you.`,
  },
  {
    q: "Why do I have to confirm my salary before payroll is run?",
    a: `Under HMRC's Real Time Information (RTI) rules, every salary must be reported to HMRC on or before the day it is paid. We cannot process or report a salary we haven't been instructed to pay, so if we don't receive confirmation from you, no salary will be processed. Please confirm your 2026/27 salary by 15 April 2026.`,
  },
  {
    q: "What is RTI and what happens if a submission is late?",
    a: "Real Time Information (RTI) is HMRC's system for reporting payroll. Employers must send a Full Payment Submission on or before each payday. Late or missing submissions can attract penalties of up to £100 per month, plus interest. We file your RTI on time every month as part of your service.",
  },
  {
    q: "Does pension auto-enrolment apply to me?",
    a: "Auto-enrolment applies to employees earning more than £833 per month who are aged between 22 and State Pension age — they must be assessed and enrolled into a workplace pension each pay period. Sole directors with no other staff are usually exempt. We handle assessment, enrolment, contributions and your declaration of compliance.",
  },
  {
    q: "What is the Employment Allowance?",
    a: "Employment Allowance lets eligible businesses reduce their employer's National Insurance bill by up to £10,500 a year. It isn't available to single-director companies with no other employees, but it becomes valuable once you take on staff. We claim it on your behalf where you qualify.",
  },
  {
    q: "When does the first payroll of the new tax year run?",
    a: "The 2026/27 tax year starts on 6 April 2026. Once you've confirmed your salary (by 15 April 2026), we process your first payroll by 25 April 2026 and send your first RTI submission to HMRC by 30 April 2026, then process monthly thereafter.",
  },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const brand = await getBrand();
  return (
    <>
      <FAQPageJsonLd faqs={faqs(brand.name)} />
      {children}
    </>
  );
}
