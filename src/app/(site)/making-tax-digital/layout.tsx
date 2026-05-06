import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Making Tax Digital (MTD) — Are You Ready? | Clever Accounts",
  description:
    "Making Tax Digital is coming for sole traders, landlords, and CIS subcontractors. Find out what MTD means, who's affected, the key deadlines, and how Clever Accounts gets you ready — with free FreeAgent software included.",
};

const faqs = [
  {
    q: "What is Making Tax Digital?",
    a: "Making Tax Digital (MTD) is HMRC's programme to move the UK tax system to a fully digital basis. Instead of filing one annual tax return, businesses must keep digital records using approved software and submit updates to HMRC on a more frequent basis. MTD for VAT is already live. MTD for Income Tax (ITSA) starts April 2026 for those earning over £50,000.",
  },
  {
    q: "Does MTD apply to me as a sole trader?",
    a: "If your total income from self-employment and/or property exceeds £50,000 in a tax year, MTD for ITSA applies from April 2026. If it's between £30,000 and £50,000, it applies from April 2027. Below £30,000, the timeline is still being confirmed. Use your 2024/25 tax year income to assess whether you'll be caught from April 2026.",
  },
  {
    q: "What does 'quarterly reporting' actually mean?",
    a: "Instead of one annual self assessment return, you'll submit four quarterly updates to HMRC throughout the year — roughly every three months — showing your income and expenses. You then submit a final declaration after the tax year ends. Your dedicated accountant and FreeAgent handle all of this automatically.",
  },
  {
    q: "What happens if I'm not MTD-compliant by the deadline?",
    a: "HMRC will issue penalties for non-compliance. This includes penalties for not keeping digital records, not submitting quarterly updates, and for late submissions. The penalty system has been revised to a points-based approach — accumulate enough points and financial penalties follow. It's important to be set up ahead of the deadline.",
  },
  {
    q: "Does MTD apply to CIS subcontractors?",
    a: "Yes — CIS subcontractors are self-employed for tax purposes, so MTD for ITSA applies if their income meets the threshold. CIS deductions (suffered at source from contractors) will be tracked within your quarterly submissions, making year-end reclaims much simpler.",
  },
  {
    q: "Will I still need to do a self assessment tax return?",
    a: "The traditional annual self assessment tax return is replaced by four quarterly updates plus a final declaration under MTD for ITSA. The final declaration covers the same ground as a self assessment return but is simpler because your records have been maintained digitally throughout the year.",
  },
  {
    q: "Is FreeAgent really MTD-compliant?",
    a: "Yes — FreeAgent is an HMRC-recognised MTD-compatible software for both VAT and Income Tax. It submits directly to HMRC with no bridging software needed. We're a FreeAgent Platinum Partner and it's included free with every Clever Accounts package.",
  },
  {
    q: "I'm currently doing my own self assessment — what do I need to change?",
    a: "If you're in scope for MTD for ITSA, you'll need MTD-compatible software and to register for MTD with HMRC by your start date. We handle all of this as part of onboarding — set up your FreeAgent account, register you for MTD, and manage your quarterly submissions going forward.",
  },
  {
    q: "What if my income fluctuates and I might go above or below the threshold?",
    a: "The threshold is assessed based on your income in the previous tax year. If you go above the threshold in one year, you enter MTD and remain in it — you can't opt out if income later drops below the threshold, though HMRC has indicated some flexibility for exceptional circumstances.",
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
