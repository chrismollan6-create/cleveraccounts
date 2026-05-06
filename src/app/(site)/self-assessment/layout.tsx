import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Self Assessment Tax Returns | Done For You | Clever Accounts",
  description:
    "Clever Accounts prepares and files your self assessment tax return to HMRC — accurately, on time, and with every allowable expense claimed. Dedicated accountant from £42.50/month. No setup fees.",
  keywords: [
    "self assessment",
    "self assessment tax return",
    "HMRC self assessment",
    "self assessment accountant",
    "self assessment filing",
    "sole trader tax return",
    "landlord self assessment",
    "31 January deadline",
    "self assessment UK",
  ],
  openGraph: {
    title: "Self Assessment Tax Return — Done For You | Clever Accounts",
    description:
      "Stop dreading the 31 January deadline. We prepare and file your self assessment tax return to HMRC. Dedicated accountant, all income sources covered, from £42.50/month.",
    type: "website",
  },
};

const faqs = [
  {
    q: "Do I need to do a self assessment tax return?",
    a: "You must complete a self assessment if you're self-employed with trading income over £1,000, a company director, a landlord, earning over £100,000 per year, receiving untaxed income above certain allowances (savings, dividends), or have foreign income. If you're unsure, HMRC has an online tool to check — or just ask us.",
  },
  {
    q: "What is the self assessment deadline?",
    a: "There are two main deadlines: 31 October for paper returns and 31 January for online returns. Both deadlines also apply to paying any tax owed. An automatic £100 penalty applies the moment you miss the 31 January deadline. We manage all deadlines for you so you'll never be late.",
  },
  {
    q: "What expenses can I claim on my self assessment?",
    a: "For self-employed individuals: office costs, travel and mileage, clothing (uniforms/protective gear), staff costs, materials, financial charges, advertising, and training. For landlords: mortgage interest (now a tax credit), letting agent fees, maintenance and repairs, insurance, and utilities. We review your specific situation to maximise every legitimate claim.",
  },
  {
    q: "What happens if I miss the self assessment deadline?",
    a: "An automatic £100 penalty applies immediately. After 3 months, an additional £10 per day charge is added (up to £900). After 6 months, a further 5% of the tax due (or £300 if greater). After 12 months, another 5% surcharge. Interest also accrues on unpaid tax from 31 January. It's always cheaper to file on time — or to use us so you never have to worry.",
  },
  {
    q: "What income do I need to declare on my self assessment?",
    a: "All untaxed income must be declared: self-employment profits, rental income, dividends above the £500 dividend allowance (2024/25), savings interest above the personal savings allowance, capital gains above the annual exempt amount, foreign income, and employment income if you earn over £100,000 (as your personal allowance is tapered). We ensure every source is captured correctly.",
  },
  {
    q: "How much will my tax bill be?",
    a: "Your bill depends on your total taxable income after deductions and allowances. Self-employed individuals pay income tax (20%, 40%, or 45% depending on the band) plus Class 4 National Insurance (6% on profits £12,570–£50,270, 2% above). Your dedicated accountant will calculate your liability in advance so there are no surprises, and advise on legal ways to reduce it.",
  },
  {
    q: "Can you complete self assessment returns for previous tax years?",
    a: "Yes — we regularly help clients catch up on outstanding returns. HMRC can accept late returns going back several years, and sometimes there are refunds to be claimed from earlier years where expenses were missed. We'll review your position, file any outstanding returns, and negotiate with HMRC where needed. Get in touch and we'll sort it out.",
  },
  {
    q: "What if I owe tax from previous years?",
    a: "HMRC will typically add interest and potentially surcharges to overdue tax, but penalties for non-payment can be reduced or disputed in some circumstances. The key is to get compliant as quickly as possible. We can file your outstanding returns, calculate exactly what you owe (including any overpayments that may reduce the balance), and liaise with HMRC on your behalf.",
  },
];

export default function SelfAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      {children}
    </>
  );
}
