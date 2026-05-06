import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "VAT Returns — Handled Every Quarter | Clever Accounts",
  description:
    "Stress-free VAT compliance for UK businesses. Clever Accounts prepares and submits your quarterly VAT returns, handles MTD for VAT via FreeAgent, and advises on the right VAT scheme for your business. From £42.50/month.",
};

const faqs = [
  {
    q: "When do I need to register for VAT?",
    a: "You must register for VAT when your taxable turnover exceeds £90,000 in any rolling 12-month period (not just a calendar year). You must register within 30 days of the end of the month in which you crossed the threshold. You can also register voluntarily at any point if your turnover is below the threshold — which can be beneficial if you want to reclaim input VAT on purchases or appear more established to clients.",
  },
  {
    q: "What is MTD for VAT?",
    a: "Making Tax Digital (MTD) for VAT requires all VAT-registered businesses to keep digital records and submit VAT returns using HMRC-recognised software. It has been mandatory for all VAT-registered businesses since April 2022. FreeAgent — included free with every Clever Accounts package — is fully MTD-compliant and submits directly to HMRC with no bridging software required.",
  },
  {
    q: "What's the VAT flat rate scheme?",
    a: "The flat rate scheme (FRS) lets eligible businesses pay VAT as a fixed percentage of their gross (VAT-inclusive) turnover, rather than calculating the difference between output and input VAT on every transaction. The percentage varies by sector — for example, 14.5% for IT consultants. It's most beneficial for service businesses with low VAT-rated purchases. There's also a 1% first-year discount. Your accountant will calculate whether FRS saves you money before recommending it.",
  },
  {
    q: "What happens if I miss the VAT registration deadline?",
    a: "If you fail to register on time, HMRC can assess and charge backdated VAT from the date you should have registered — meaning you effectively owe VAT on sales you may have already collected without it. On top of that, HMRC can charge a penalty of between 5% and 15% of the net tax due, plus interest. The longer you delay, the larger the penalty. If you think you might have already passed the threshold, contact us immediately.",
  },
  {
    q: "Can I reclaim VAT on purchases before registration?",
    a: "Yes — you can reclaim input VAT on goods purchased up to 4 years before your VAT registration date, provided you still hold them when you register. For services, you can reclaim VAT on supplies received up to 6 months before registration. This can be a significant benefit if you've been investing in your business before registering. Your accountant will identify and claim everything you're entitled to.",
  },
  {
    q: "How often do I file VAT returns?",
    a: "Most VAT-registered businesses file quarterly returns — every three months. The filing and payment deadline is one month and seven days after the end of each VAT quarter. Some businesses on the Annual Accounting Scheme file just one return per year and make interim payments throughout. The exact quarters depend on the stagger group HMRC assigns to you at registration.",
  },
  {
    q: "What if HMRC investigates my VAT?",
    a: "HMRC conducts VAT compliance checks on businesses both randomly and where they spot discrepancies. If you're selected, HMRC will request access to your records, invoices, and VAT workings. With Clever Accounts, your accountant handles all correspondence with HMRC, prepares the required documentation from your FreeAgent records, and attends or participates in any inspection on your behalf.",
  },
  {
    q: "Should I register voluntarily below the threshold?",
    a: "It depends on your situation. Voluntary registration makes sense if you buy a lot of VAT-rated goods and want to reclaim input VAT, if your customers are VAT-registered businesses (who can reclaim your VAT anyway), or if you want to appear more established. It may not suit you if your customers are end consumers who can't reclaim VAT — as it effectively increases your prices by 20% unless you absorb the cost. Your accountant will help you weigh up the pros and cons.",
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
