import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions | Clever Accounts",
  description: "Clever Accounts terms and conditions of service.",
};

const sections = [
  {
    title: "1. About These Terms",
    content: `These terms and conditions govern your use of Clever Accounts' services and website. By signing up for our services or using our website, you agree to these terms. Please read them carefully.

Clever Accounts is a trading name of [Clever Accounts Ltd], registered in England and Wales. Registered office: ${COMPANY.offices[0].address}.`,
  },
  {
    title: "2. Our Services",
    content: `We provide online accounting and tax services to UK businesses, including but not limited to:
• Preparation and filing of self assessment tax returns
• Limited company accounting, including year-end accounts and corporation tax
• VAT return preparation and submission
• Payroll processing and RTI submissions
• IR35 assessments and contractor support
• Accounting software (FreeAgent) access
• Tax advice and planning

The specific services included in your package are set out in your engagement letter.`,
  },
  {
    title: "3. Fees and Payment",
    content: `Our fees are set out on our pricing page and in your engagement letter. Fees are charged monthly in advance by direct debit or card payment. We reserve the right to change our fees with 30 days' written notice. If you do not accept the new fees, you may cancel your subscription before the new fees take effect.

All prices shown exclude VAT, which will be added where applicable.`,
  },
  {
    title: "4. Your Responsibilities",
    content: `You are responsible for:
• Providing us with accurate, complete, and timely information to enable us to provide our services
• Notifying us promptly of any changes to your business or financial circumstances
• Reviewing and approving filings and returns before we submit them on your behalf
• Maintaining adequate records as required by HMRC and Companies House
• Notifying us if you receive any correspondence from HMRC or Companies House

We are not liable for errors or omissions in filings that result from inaccurate or incomplete information provided by you.`,
  },
  {
    title: "5. Cancellation",
    content: `You may cancel your subscription at any time by giving us 30 days' written notice. Notice can be given by email to ${COMPANY.email}. No cancellation fees apply. We do not offer refunds for partial months.

On cancellation, we will transfer your records to you or your new accountant and issue a disengagement letter within a reasonable timeframe.`,
  },
  {
    title: "6. Intellectual Property",
    content: `All content on our website, including text, images, logos, and software, is the property of Clever Accounts or our licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.`,
  },
  {
    title: "7. Limitation of Liability",
    content: `Our liability to you is limited to the fees paid by you in the 12 months preceding the claim. We are not liable for indirect, consequential, or economic losses. Nothing in these terms limits our liability for death or personal injury caused by negligence, or for fraud.

We hold professional indemnity insurance as required by our professional body.`,
  },
  {
    title: "8. Governing Law",
    content: `These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.`,
  },
  {
    title: "9. Changes to These Terms",
    content: `We may update these terms from time to time. We will give you at least 30 days' written notice of material changes. Continued use of our services after that date constitutes acceptance of the revised terms.`,
  },
  {
    title: "10. Contact",
    content: `If you have questions about these terms, please contact us at ${COMPANY.email} or ${COMPANY.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black text-white mb-3">Terms & Conditions</h1>
          <p className="text-white/60">Last updated: April 2026</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-10">
            {sections.map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-xl font-black text-dark mb-3">{title}</h2>
                <div className="text-text-light leading-relaxed whitespace-pre-line text-sm">{content}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-text-light text-sm">
              Questions? Contact us at{" "}
              <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">{COMPANY.email}</a>
              {" "}or{" "}
              <Link href="/contact" className="text-primary hover:underline">via our contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
