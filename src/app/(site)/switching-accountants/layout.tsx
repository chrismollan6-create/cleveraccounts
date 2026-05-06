import type { Metadata } from "next";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "How to Switch Accountants UK (2026 Guide) | Clever Accounts",
  description:
    "Thinking of switching accountants? Our step-by-step guide covers when to switch, how the professional clearance process works, what to look for in a new firm, and common concerns answered. Updated April 2026.",
  keywords: [
    "switch accountant UK",
    "how to switch accountants",
    "change accountant UK",
    "switching accountants mid-year",
    "professional clearance accountant",
    "leave my accountant",
    "new accountant UK",
    "switch to Clever Accounts",
  ],
  openGraph: {
    title: "How to Switch Accountants UK (2026 Guide)",
    description:
      "Step-by-step guide to switching accountants in the UK. Professional clearance, mid-year switching, what to look for — and how Clever Accounts makes it free and seamless.",
    type: "article",
  },
  alternates: {
    canonical: "https://cleveraccounts.com/switching-accountants",
  },
};

const faqs = [
  {
    q: "Can I switch accountants mid-year?",
    a: "Yes. You can switch at any point in the tax year — you do not need to wait until your year-end or the start of a new financial year. Your new accountant picks up exactly where your old one left off, with no gap in compliance or support.",
  },
  {
    q: "How long does switching accountants take?",
    a: "Most switches are complete within 3–6 weeks. The main timeline is governed by the professional clearance process — your old accountant is required to respond within a reasonable timeframe. The switch itself has no effect on your tax position or filing deadlines.",
  },
  {
    q: "Is there a cost to switch accountants?",
    a: "Switching to Clever Accounts is completely free — no setup fees, no transfer charges. Your old accountant may charge for producing final records or outstanding work not yet billed, but a new firm should never charge you to take you on.",
  },
  {
    q: "What is professional clearance and why does it matter?",
    a: "Professional clearance is a formal process governed by ICAEW and ACCA ethics rules. When you appoint a new accountant, they write to your previous firm requesting confirmation that there are no outstanding ethical issues and asking for any information needed to continue the engagement. Your old accountant is required to respond — this protects you and ensures continuity of records.",
  },
  {
    q: "Can my old accountant refuse to hand over my records?",
    a: "Your financial records — accounts, tax returns, payroll history — belong to you, and your old accountant must provide them. They can legitimately withhold working papers they created themselves, and they may not release records until outstanding fees are settled. If your old accountant is unresponsive, your new firm can escalate through professional channels.",
  },
  {
    q: "What if I owe my old accountant money?",
    a: "Your old accountant can withhold some records until outstanding invoices are paid — this is called a lien. It's worth settling any outstanding balance before initiating the switch to avoid delays. If you dispute the fees, your new accountant can advise on the best approach.",
  },
  {
    q: "What records do I need to transfer to my new accountant?",
    a: "Your new accountant will collect these via the professional clearance process, but you can speed things up by having ready: your previous year's accounts and Corporation Tax return, your last Self Assessment return, current year bookkeeping (FreeAgent or spreadsheet export), payroll history for the current year, and VAT returns filed so far.",
  },
  {
    q: "Will switching accountants affect my tax position?",
    a: "No. Switching is purely an administrative process. Your tax liabilities, filing deadlines, and HMRC obligations are unchanged. Your new accountant simply takes over responsibility for managing them going forward.",
  },
  {
    q: "What are the signs I should switch accountants?",
    a: "Common warning signs: slow or no response to emails (more than 2 working days regularly), errors on returns that you spotted yourself, no proactive advice — just reactive filing, not knowing your day rate or dividend position off the top of their head, surprise invoices for work you thought was included, and missed deadlines.",
  },
  {
    q: "What should I look for in a new accountant?",
    a: "For limited company owners and contractors: a named accountant assigned to your account, clear confirmation of what's included in the monthly fee, response time commitment (same or next business day), accounting software included (FreeAgent or Xero), and no hidden charges for things like IR35 reviews or mortgage reference letters.",
  },
];

export default function SwitchingAccountantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Switch Accountant", url: "/our-services/accountant-switch" },
          { name: "How to Switch Accountants Guide", url: "/switching-accountants" },
        ]}
      />
      {children}
    </>
  );
}
