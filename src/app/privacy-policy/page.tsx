import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Clever Accounts",
  description: "Clever Accounts privacy policy — how we collect, use, and protect your personal data in accordance with UK GDPR.",
};

const sections = [
  {
    title: "Who We Are",
    content: `Clever Accounts is a trading name of [Clever Accounts Ltd], registered in England and Wales. Our registered office is at ${COMPANY.offices[0].address}. We are the data controller for the personal information we collect about you. You can contact us at ${COMPANY.email} or ${COMPANY.phone}.`,
  },
  {
    title: "What Information We Collect",
    content: `We collect information you provide directly to us, including:
• Name, email address, phone number, and business details when you sign up or contact us
• Financial information necessary to provide accounting services (income, expenses, tax records)
• Payment information (processed securely — we do not store card details)
• Communications you send us by email, phone, or through our website
• Information about how you use our website (via cookies — see our Cookie Policy)`,
  },
  {
    title: "How We Use Your Information",
    content: `We use your personal information to:
• Provide accounting and tax services to you
• Communicate with you about your account and our services
• Send HMRC filings, Companies House submissions, and other regulatory correspondence on your behalf
• Process payments for our services
• Improve our website and services
• Comply with our legal and regulatory obligations as accountants
• Send you relevant updates about changes to tax law or our services (you can opt out at any time)`,
  },
  {
    title: "Legal Basis for Processing",
    content: `We process your personal data on the following legal bases:
• Contract: Processing necessary to provide the accounting services you've signed up for
• Legal obligation: We are required to retain certain financial records under UK tax law and our professional obligations as accountants
• Legitimate interests: Improving our services, fraud prevention, and business communications
• Consent: Where you have opted in to marketing communications`,
  },
  {
    title: "Sharing Your Information",
    content: `We may share your personal information with:
• HMRC, Companies House, and other regulatory bodies as required to provide our services
• FreeAgent (our accounting software partner) to provide your software licence
• Our professional indemnity insurers where required
• Third-party service providers who help us operate our business (bound by confidentiality agreements)
• Law enforcement or regulatory bodies where required by law

We do not sell your personal data to third parties.`,
  },
  {
    title: "Data Retention",
    content: `We retain your personal information for as long as necessary to provide our services and comply with our legal obligations. HMRC requires us to retain financial records for a minimum of 6 years from the end of the relevant tax year. After this period, data is securely deleted.`,
  },
  {
    title: "Your Rights",
    content: `Under UK GDPR, you have the right to:
• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your personal data (subject to our legal obligations)
• Object to or restrict our processing of your data
• Data portability — receive your data in a structured, machine-readable format
• Withdraw consent where processing is based on consent

To exercise any of these rights, contact us at ${COMPANY.email}. We will respond within 30 days.`,
  },
  {
    title: "Cookies",
    content: `Our website uses cookies to improve your browsing experience and analyse site traffic. Essential cookies are required for the site to function. You can control non-essential cookies through your browser settings. For full details, see our Cookie Policy.`,
  },
  {
    title: "Security",
    content: `We take the security of your personal data seriously. We use industry-standard encryption, secure servers, and access controls to protect your information. Our staff are trained in data protection obligations. In the event of a data breach that poses a risk to your rights, we will notify you and the ICO as required by law.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this privacy policy from time to time. We will notify you of significant changes by email or by posting a notice on our website. The date of the latest revision is shown below.`,
  },
  {
    title: "Complaints",
    content: `If you have concerns about how we handle your personal data, please contact us first at ${COMPANY.email}. If you remain unsatisfied, you have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk or by calling 0303 123 1113.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
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
          <p className="text-text-light leading-relaxed mb-10">
            This privacy policy explains how Clever Accounts collects, uses, and protects your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
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
              Questions about this policy? Contact us at{" "}
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
