import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "CIS Accounting — Construction Industry Scheme Specialists | Clever Accounts",
  description:
    "Expert CIS accounting for contractors and subcontractors. We handle CIS registration, monthly returns, subcontractor verification, year-end tax reclaims, and gross payment status applications. Fixed monthly fee, dedicated accountant.",
};

const faqs = [
  {
    q: "What is the Construction Industry Scheme?",
    a: "The Construction Industry Scheme (CIS) is an HMRC scheme that sets out rules for how contractors in the construction industry must handle payments to subcontractors. Contractors are required to deduct tax at source from payments to subcontractors and pass those deductions to HMRC. The scheme covers most construction work on buildings and infrastructure in the UK.",
  },
  {
    q: "Do I need to register for CIS as a subcontractor?",
    a: "You are not legally required to register for CIS as a subcontractor, but it is strongly advisable. If you are not registered and cannot be verified by HMRC, contractors must deduct tax at 30% from your payments rather than the standard 20%. Registering takes only a few minutes and immediately reduces the deduction rate applied to your earnings.",
  },
  {
    q: "What's the difference between 20% and 30% deductions?",
    a: "The 20% standard rate applies to subcontractors who are registered with HMRC for CIS and can be verified. The 30% higher rate applies when HMRC cannot verify the subcontractor — usually because they are not registered or the details don't match records. On a £1,000 payment, the difference is £100. Over a year this adds up significantly, and registering for CIS is the straightforward solution.",
  },
  {
    q: "How do I reclaim overpaid CIS tax?",
    a: "CIS tax deducted from your payments is credited against your income tax and National Insurance liability via your self assessment tax return. If more has been deducted than you actually owe in tax, HMRC will repay the difference. Many CIS subcontractors — particularly those with lower incomes or significant allowable expenses — receive a refund. We prepare your self assessment return and ensure every deduction is accounted for.",
  },
  {
    q: "What is gross payment status and how do I get it?",
    a: "Gross payment status (GPS) means HMRC will allow a subcontractor to receive their full payment from contractors without any CIS deduction being made. To qualify, you must pass three tests: a business test (genuine construction business), a turnover test (minimum construction turnover), and a compliance test (all tax affairs up to date for the past 12 months). We assess your eligibility and handle the application on your behalf.",
  },
  {
    q: "I'm a contractor — what are my monthly obligations?",
    a: "As a CIS contractor you must: verify each new subcontractor with HMRC before making a first payment; make the correct deduction (0%, 20%, or 30%) from all payments to subcontractors; file a CIS monthly return by the 19th of each month detailing all payments and deductions; and provide each subcontractor with a payment and deduction statement within 14 days of the end of the tax month. Failure to meet these obligations results in penalties.",
  },
  {
    q: "Does MTD apply to CIS subcontractors?",
    a: "Yes. CIS subcontractors are classed as self-employed, so Making Tax Digital for Income Tax (MTD for ITSA) applies to them in the same way as any other sole trader. From April 2026, CIS workers with income over £50,000 must keep digital records and submit quarterly updates to HMRC. From April 2027, the threshold drops to £30,000. FreeAgent — included free with Clever Accounts — is fully MTD-compatible and handles all submissions automatically.",
  },
  {
    q: "Can CIS subcontractors claim expenses?",
    a: "Yes — CIS subcontractors can claim allowable business expenses against their self-employment income, which reduces the profit on which tax is calculated. Typical claimable expenses include tools, equipment, work clothing (PPE and specialist items), vehicle costs for business journeys, phone costs, insurance, and accountancy fees. Materials are generally excluded from CIS deductions in any case, but keeping good records of all expenses is key to minimising your tax bill.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      {children}
    </>
  );
}
