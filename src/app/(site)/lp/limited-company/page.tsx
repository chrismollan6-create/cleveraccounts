import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";
import { FileText, BarChart2, Users, Building2, ShieldCheck, MessageSquare, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Limited Company Accountant — From £104.50/mo | Clever Accounts",
  description:
    "Complete limited company accounting from £104.50/month. Year-end accounts, CT600, VAT, payroll, Companies House filings and a dedicated accountant who knows your business. No setup fees.",
  robots: { index: true, follow: true },
};

const whyUs: WhyUsItem[] = [
  {
    title: "Full Company Secretarial Service",
    description:
      "We handle Companies House annual filings, confirmation statements, and all statutory obligations — so you stay compliant without lifting a finger.",
  },
  {
    title: "All Taxes Under One Roof",
    description:
      "Corporation tax (CT600), VAT returns, PAYE payroll, and director self assessment — all included in one fixed monthly fee with no hidden extras.",
  },
  {
    title: "Free FreeAgent Software",
    description:
      "Every client gets FreeAgent accounting software included free of charge. Raise invoices, track expenses, and see your corporation tax liability in real time.",
  },
  {
    title: "Proactive Tax Planning",
    description:
      "We advise on the optimal salary/dividend split for directors, R&D tax relief, and other reliefs to minimise your corporation tax bill — not just report it.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "Missing Statutory Deadlines",
    description:
      "Companies House and HMRC impose automatic fines for late accounts and CT600 returns. We track every deadline and file well ahead of time on your behalf.",
  },
  {
    title: "Director Salary & Dividend Complexity",
    description:
      "Getting the salary/dividend split wrong costs directors thousands in unnecessary tax. We model the most tax-efficient structure for your circumstances.",
  },
  {
    title: "Growing Compliance Burden",
    description:
      "VAT, payroll, Making Tax Digital, auto-enrolment — the compliance workload for limited companies keeps growing. We manage all of it so you don't have to.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    title: "Sign Up Online",
    description: "Tell us about your company and we'll match you with a dedicated limited company accountant.",
  },
  {
    title: "We Handle the Transition",
    description: "We contact your previous accountant for a handover, notify HMRC, and set up your FreeAgent account.",
  },
  {
    title: "Ongoing Support Included",
    description: "Monthly bookkeeping reviews, quarterly VAT returns, year-end accounts — we do it all and keep you informed.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Switched from a high-street accountant and halved our fees whilst getting a far more proactive service. The salary/dividend advice alone saved us thousands.",
    name: "David R.",
    businessType: "Marketing Agency Director",
  },
  {
    quote:
      "I was drowning in compliance — VAT, payroll, Companies House. Clever Accounts took the lot. I actually enjoy running my business again.",
    name: "Priya S.",
    businessType: "Ltd Company Consultant",
  },
  {
    quote:
      "My accountant flagged R&D tax relief I didn't know I qualified for. That was a five-figure repayment from HMRC. Absolutely invaluable.",
    name: "Tom H.",
    businessType: "Software Development Ltd",
  },
];

const faq: FAQItem[] = [
  {
    question: "What's included in the limited company accounting package?",
    answer:
      "Everything your company needs: a dedicated accountant, year-end statutory accounts, CT600 corporation tax return, quarterly VAT returns, monthly payroll for directors and staff, Companies House confirmation statement, director self assessment, free FreeAgent software, and unlimited phone and email support.",
  },
  {
    question: "Do you handle VAT registration and returns?",
    answer:
      "Yes — we handle VAT registration with HMRC, prepare and submit your quarterly VAT returns under Making Tax Digital, and advise on the right VAT scheme for your business (standard, flat rate, cash accounting).",
  },
  {
    question: "How should I pay myself as a director?",
    answer:
      "Most directors benefit from taking a low salary (up to the National Insurance threshold) combined with dividends. This is typically the most tax-efficient structure. Your dedicated accountant will model the optimal split for your specific situation each tax year.",
  },
  {
    question: "Can you take over from my existing accountant?",
    answer:
      "Yes. We manage the entire handover process — we contact your previous accountant for your company's financial records, inform HMRC of the change of agent, and make the switch seamless for you.",
  },
  {
    question: "Do you handle payroll for employees as well as directors?",
    answer:
      "Yes. Payroll for directors and employees is included in your monthly fee. We process payroll, submit RTI reports to HMRC, handle auto-enrolment pension duties, and provide payslips.",
  },
];

const statsSection = (
  <section className="bg-dark py-14">
    <div className="max-w-5xl mx-auto px-4">
      <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">Why directors choose Clever Accounts</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "3,000+", label: "Directors switched to us this year", colour: "from-primary to-blue-400" },
          { value: "6", label: "Tax obligations covered in one fixed fee", colour: "from-secondary to-emerald-400" },
          { value: "£0", label: "Setup fees — ever", colour: "from-amber-500 to-yellow-400" },
          { value: "20+", label: "Years of limited company expertise", colour: "from-purple-500 to-pink-400" },
        ].map((s) => (
          <div key={s.value} className={`rounded-2xl bg-gradient-to-br ${s.colour} p-px`}>
            <div className="rounded-2xl bg-dark h-full p-5 text-center">
              <div className={`text-4xl font-black bg-gradient-to-br ${s.colour} bg-clip-text text-transparent mb-2`}>{s.value}</div>
              <p className="text-xs text-slate-400 leading-snug">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const servicesGrid = (
  <section className="bg-white py-14 border-t border-border">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">Every Obligation. One Monthly Fee.</h2>
        <p className="text-text-light max-w-xl mx-auto">Here&apos;s exactly what we handle for your limited company — nothing is ever charged as an extra.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { Icon: FileText, title: "Annual Accounts & Corporation Tax", items: ["Statutory year-end accounts", "CT600 corporation tax return", "Deferred tax & accruals", "Filed with HMRC & Companies House"] },
          { Icon: BarChart2, title: "VAT", items: ["Quarterly VAT returns (MTD)", "VAT scheme selection advice", "VAT registration handled", "Input tax reclaim optimised"] },
          { Icon: Users, title: "Payroll & Director Pay", items: ["Monthly payroll processing", "RTI submissions to HMRC", "Optimal salary/dividend advice", "Auto-enrolment managed"] },
          { Icon: Building2, title: "Companies House & Compliance", items: ["Confirmation statement filed", "Director self assessment", "Registered office service", "Company secretarial support"] },
          { Icon: ShieldCheck, title: "Tax Planning", items: ["Corporation tax minimisation", "R&D tax relief assessment", "Investment & growth planning", "Year-round proactive advice"] },
          { Icon: MessageSquare, title: "Day-to-Day Support", items: ["Dedicated accountant by name", "Unlimited calls & emails", "Free FreeAgent software", "Real-time financial dashboards"] },
        ].map((cat) => (
          <div key={cat.title} className="bg-white rounded-2xl border border-border shadow-sm card-hover p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <cat.Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-dark">{cat.title}</h3>
            </div>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text-light">
                  <CheckCircle2 size={13} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function LimitedCompanyLP() {
  return (
    <LandingPageLayout
      headline="Limited Company Accounting — Everything Included"
      subheadline="Year-end accounts, corporation tax, VAT, payroll, and a dedicated accountant who proactively saves you money. One fixed monthly fee — no surprises."
      price="104.50"
      targetAudience="For Limited Company Directors"
      urgencyText="3,000+ directors switched to us this year"
      features={[
        "Dedicated limited company accountant",
        "Year-end accounts & CT600 filed",
        "Quarterly VAT returns (MTD compliant)",
        "Payroll for directors & staff",
        "Companies House annual filings",
        "Corporation tax planning & advice",
        "Free FreeAgent accounting software",
        "Unlimited phone & email support",
      ]}
      whyUs={whyUs}
      painPoints={painPoints}
      howItWorks={howItWorks}
      testimonials={testimonials}
      faq={faq}
    >
      {statsSection}
      {servicesGrid}
    </LandingPageLayout>
  );
}
