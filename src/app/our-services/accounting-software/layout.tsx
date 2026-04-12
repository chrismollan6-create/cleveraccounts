import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Free FreeAgent Accounting Software — Platinum Partner | Clever Accounts",
  description: "Every Clever Accounts package includes free FreeAgent accounting software (worth £29/mo). We're a FreeAgent Platinum Partner. MTD compliant, open banking, invoicing and more.",
};

const faqs = [
  {
    q: "Is FreeAgent really free with my Clever Accounts package?",
    a: "Yes — completely free. FreeAgent normally costs £19–£29/month if you subscribe directly. With Clever Accounts, it's included at no extra charge with every package.",
  },
  {
    q: "What does 'FreeAgent Platinum Partner' mean?",
    a: "Platinum is FreeAgent's highest tier of accountancy partner status. It means we've met their standards for client volume, quality of service, and proficiency with the platform. You get priority support and access to features ahead of general release.",
  },
  {
    q: "Do I have to use FreeAgent, or can I stick with my existing software?",
    a: "We recommend FreeAgent — it's what we know best and it's free for you. But if you're already using Xero, QuickBooks, or Sage and prefer to stay on it, we can work with you. Just ask when you sign up.",
  },
  {
    q: "Does FreeAgent work with Making Tax Digital?",
    a: "Yes. FreeAgent is HMRC-recognised MTD-compatible software for both VAT and Income Tax. If MTD for ITSA applies to you (sole traders and landlords earning over £50k from April 2026), you'll already be prepared.",
  },
  {
    q: "What is MTD for Income Tax and do I need to worry about it?",
    a: "MTD for Income Tax Self Assessment (ITSA) requires self-employed individuals and landlords to submit quarterly digital updates to HMRC instead of one annual return. It starts April 2026 for those earning over £50,000. We'll guide you through it — FreeAgent handles the submissions automatically.",
  },
  {
    q: "Can I access FreeAgent on my phone?",
    a: "Yes — FreeAgent has full iOS and Android apps. You can create invoices, log expenses, snap receipts, and check your financial dashboard all from your phone.",
  },
  {
    q: "What happens to my FreeAgent account if I leave Clever Accounts?",
    a: "If you cancel your Clever Accounts subscription, you'll lose access to the free FreeAgent licence. You can either subscribe to FreeAgent directly, or export all your data to use elsewhere. All your historical data is always yours.",
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
