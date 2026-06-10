import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `Payroll Services — RTI, P60s & Auto-Enrolment | ${brand.name}`,
    description:
      "Monthly payroll processing for UK limited companies and small businesses. RTI submissions, payslips, P60s, P11Ds and pension auto-enrolment — all handled by your dedicated accountant. Included in our Limited Company package.",
  };
}

const faqs = [
  {
    q: "Is payroll included in my Clever Accounts package?",
    a: "Yes — for our Limited Company package (from £104.50/month), payroll for directors and one employee is included as standard. Additional employees are added at a small per-employee monthly cost. Sole traders without employees don't need payroll, so it's only added on if you take on staff.",
  },
  {
    q: "What's the optimal salary for a limited company director in 2025/26?",
    a: "Most directors with no other employment income should take a salary at the secondary NI threshold (£9,100/year for 2025/26 if you're the only employee, or up to £12,570 if you can claim Employment Allowance with at least one other employee). Above that, dividends are usually more tax-efficient. We assess your specific situation and recommend the right number — and we update it each tax year.",
  },
  {
    q: "Do I need to run payroll if I only pay myself dividends?",
    a: "If you're a sole director taking only dividends with no salary, you technically don't need a PAYE scheme — but most directors take a small salary alongside dividends to use the personal allowance, NI threshold, and maintain a state pension qualifying year. Even £1 of salary requires a registered PAYE scheme and monthly RTI submissions to HMRC.",
  },
  {
    q: "How does pension auto-enrolment work for a small company?",
    a: "Every UK employer must assess employees against the auto-enrolment criteria each pay period and enrol qualifying staff into a workplace pension scheme. Even a single-director company is an 'employer' for these rules, though sole directors are usually exempt. We handle assessment, enrolment, contributions, declarations of compliance, and the three-yearly re-enrolment exercise.",
  },
  {
    q: "Can I pay myself a bonus or one-off?",
    a: "Yes — bonuses can be processed through payroll any time. They're treated as salary for tax purposes (income tax + employee/employer NI), so they're usually less efficient than dividends. We model the tax impact before processing so you know exactly what it costs.",
  },
  {
    q: "What happens if I take on my first employee?",
    a: "Tell us before the first day. We'll register the PAYE scheme if you don't already have one, set up the employee's tax code and pension assessment, draft a basic employment contract template if you need one, and run the first pay run on schedule. Auto-enrolment duties begin from day one of employment.",
  },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const brand = await getBrand();
  const swap = (s: string) => s.replaceAll("Clever Accounts", brand.name);
  const swappedFaqs = faqs.map((f) => ({ q: swap(f.q), a: swap(f.a) }));
  return (
    <>
      <FAQPageJsonLd faqs={swappedFaqs} />
      {children}
    </>
  );
}
