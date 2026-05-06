import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "UK Tax Deadlines 2025/26 — Key Dates for Your Diary | Clever Accounts",
  description:
    "Complete guide to UK tax deadlines for 2025/26: Self Assessment, Corporation Tax, VAT, PAYE, Companies House, and MTD. Never miss an HMRC deadline again — Clever Accounts handles it all.",
};

const faqs = [
  {
    q: "When is the self assessment tax return deadline?",
    a: "The online self assessment deadline is 31 January each year. Paper returns must be filed by 31 October. Any tax owed must also be paid by 31 January. If you're newly self-employed or have a new source of untaxed income, you must register with HMRC by 5 October following the end of the relevant tax year.",
  },
  {
    q: "When does Corporation Tax need to be paid?",
    a: "Corporation Tax must be paid no later than 9 months and 1 day after the end of your company's accounting period. The Corporation Tax return (CT600) must be filed with HMRC within 12 months of the accounting period end. These are separate deadlines — payment comes before the return.",
  },
  {
    q: "When is the VAT return deadline?",
    a: "VAT returns and payments are due one month and seven days after the end of each VAT quarter. For example, if your VAT quarter ends 31 March, the return and payment are due by 7 May. Under Making Tax Digital for VAT, all returns must be submitted digitally using HMRC-approved software.",
  },
  {
    q: "What are the PAYE deadlines?",
    a: "PAYE payments to HMRC are due by the 19th of each month (or 22nd if paying electronically) for the previous tax month. The tax month runs from the 6th to the 5th of the following month. Full Payment Submissions (FPS) must be made on or before each payday. The annual P60s must be issued to employees by 31 May.",
  },
  {
    q: "What happens if I miss a tax deadline?",
    a: "HMRC applies automatic penalties for late filing and late payment. For self assessment, an immediate £100 penalty applies on the day you miss the deadline, escalating to £10/day after 3 months and percentage surcharges after 6 and 12 months. For Corporation Tax, late filing penalties start at £100 and increase. Penalties can also include interest on unpaid amounts. Acting quickly reduces the overall cost.",
  },
  {
    q: "When must annual accounts be filed with Companies House?",
    a: "Private limited companies must file their annual accounts with Companies House within 9 months of their accounting reference date. For a new company, the deadline is 21 months from incorporation. Late filing results in automatic penalties ranging from £150 to £1,500 depending on how late the accounts are, doubling if the company files late in consecutive years.",
  },
  {
    q: "What are the MTD for Income Tax deadlines?",
    a: "Making Tax Digital for Income Tax (MTD for ITSA) requires quarterly digital updates to HMRC. The quarterly periods and deadlines are: Q1 (6 Apr–5 Jul) due 7 Aug; Q2 (6 Jul–5 Oct) due 7 Nov; Q3 (6 Oct–5 Jan) due 7 Feb; Q4 (6 Jan–5 Apr) due 7 May. A final declaration must be submitted by 31 January following the tax year end.",
  },
  {
    q: "How can I make sure I never miss a tax deadline?",
    a: "The simplest way is to use a dedicated accountant who manages all your deadlines for you. Clever Accounts monitors every filing and payment deadline for all clients, sends proactive reminders, and handles submissions on your behalf — so you never face a penalty for something that could have been avoided.",
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
