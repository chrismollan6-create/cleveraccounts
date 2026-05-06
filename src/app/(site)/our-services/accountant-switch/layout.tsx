import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Switch Accountant — Seamless Transfer, Benefits From Day One | Clever Accounts",
  description: "Switching accountants is easier than you think. We contact your old accountant, transfer your records, and you benefit immediately. No setup fee, no hassle.",
};

const faqs = [
  {
    q: "When is the right time to switch accountants?",
    a: "Any time of year — you don't have to wait until your year-end. Many of our new clients switch mid-year without any disruption. The best time to switch is as soon as you've decided you want better service. We'll handle the timing.",
  },
  {
    q: "Do I need to tell my old accountant I'm leaving?",
    a: "No — that's our job. Once you sign up, we send a professional disengagement letter to your previous accountant on your behalf and request your records. You don't have to have any awkward conversations.",
  },
  {
    q: "How long does the switch take?",
    a: "Typically 2–4 weeks from sign-up to fully transferred. We start providing your service immediately though — you're a client from day one, not after the transfer is complete.",
  },
  {
    q: "Will there be a gap in my accounting service?",
    a: "No. We begin work on your account from the moment you sign up. Any deadlines or tax obligations that fall during the transition are handled by us. There's no gap.",
  },
  {
    q: "What if my previous accountant delays sending my records?",
    a: "It happens occasionally. We chase on your behalf and apply professional pressure where needed. ICAEW and ACCA guidelines require accountants to transfer records promptly — if there's an unusual delay, we'll advise you on next steps.",
  },
  {
    q: "I'm locked into a contract with my accountant — can I still switch?",
    a: "Check the notice period in your engagement letter — most are 1–3 months. You can sign up with us now and we'll manage the transition timing around your exit date. You won't pay twice — we'll align our start date appropriately.",
  },
  {
    q: "What records will you need from my old accountant?",
    a: "We typically request: your last set of filed accounts, tax returns (self assessment or corporation tax), VAT records, payroll data, and any working papers relevant to your current year. We'll provide your old accountant with a standard handover list.",
  },
  {
    q: "Is there any cost to switching?",
    a: "None. We don't charge a setup fee or a switching fee. Your first month's fee is your first month's fee — nothing extra for the transition.",
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
