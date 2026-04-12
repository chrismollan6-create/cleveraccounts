import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  AlertTriangle,
  Clock,
  FileText,
  Building2,
  Users,
  Zap,
  CheckCircle2,
  Phone,
  Info,
  TrendingUp,
  Receipt,
  Landmark,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── Self Assessment deadline rows ─────────────────────────────
const selfAssessmentDeadlines = [
  {
    date: "5 April",
    label: "Tax Year End",
    description: "The UK tax year ends. Income, expenses, and any taxable events up to this date fall within the current tax year.",
    urgency: "info",
  },
  {
    date: "5 October",
    label: "Register for Self Assessment",
    description: "Deadline to register with HMRC for Self Assessment if you became self-employed, a landlord, or otherwise need to file a return for the previous tax year.",
    urgency: "warning",
  },
  {
    date: "31 October",
    label: "Paper Tax Return Deadline",
    description: "Deadline to file your Self Assessment tax return on paper. Almost all taxpayers now file online — if you're still using paper, this is your cut-off.",
    urgency: "warning",
  },
  {
    date: "31 January",
    label: "Online Return + First Tax Payment",
    description: "Deadline to file your online Self Assessment return AND pay any tax owed for the previous tax year, plus your first payment on account for the current year.",
    urgency: "critical",
  },
  {
    date: "31 July",
    label: "Second Payment on Account",
    description: "Second payment on account due — typically half your previous year's tax bill, paid in advance towards the current year's liability.",
    urgency: "warning",
  },
];

// ── Corporation Tax deadline rows ─────────────────────────────
const corporationTaxDeadlines = [
  {
    trigger: "9 months + 1 day after year end",
    label: "Pay Corporation Tax",
    description: "Corporation Tax must be paid to HMRC no later than 9 months and 1 day after your company's accounting period ends.",
    urgency: "critical",
  },
  {
    trigger: "12 months after year end",
    label: "File CT600 Return",
    description: "Your Corporation Tax return (CT600) must be filed with HMRC within 12 months of your accounting period end. HMRC imposes penalties for late filing even if no tax is owed.",
    urgency: "warning",
  },
  {
    trigger: "Within 3 months of incorporation",
    label: "Register for Corporation Tax",
    description: "New companies must register for Corporation Tax within 3 months of starting to do business. HMRC will not notify you — it's your responsibility.",
    urgency: "info",
  },
];

// ── VAT quarters ──────────────────────────────────────────────
const vatQuarters = [
  { quarter: "Q1", period: "Jan – Mar", deadline: "7 May" },
  { quarter: "Q2", period: "Apr – Jun", deadline: "7 Aug" },
  { quarter: "Q3", period: "Jul – Sep", deadline: "7 Nov" },
  { quarter: "Q4", period: "Oct – Dec", deadline: "7 Feb" },
];

// ── PAYE & Payroll deadline rows ──────────────────────────────
const payeDeadlines = [
  {
    date: "19th of month",
    label: "Paper PAYE Payment",
    description: "Deadline to pay PAYE and National Insurance by cheque or postal order. Most employers use electronic payment and get 3 extra days.",
    urgency: "info",
  },
  {
    date: "22nd of month",
    label: "Electronic PAYE Payment",
    description: "Deadline to pay PAYE, National Insurance, and any Student Loan deductions electronically. Must have cleared HMRC's account by this date.",
    urgency: "warning",
  },
  {
    date: "On or before pay day",
    label: "Full Payment Submission (RTI)",
    description: "Under Real Time Information, you must submit a Full Payment Submission (FPS) to HMRC on or before each pay day — not monthly, but every time you pay someone.",
    urgency: "critical",
  },
  {
    date: "5 April (year end)",
    label: "P60s to Employees",
    description: "Deadline to issue P60 certificates to all employees still employed at the end of the tax year. Must be provided by 31 May following the tax year end.",
    urgency: "info",
  },
  {
    date: "6 July",
    label: "P11D Expenses & Benefits",
    description: "Deadline to report expenses and benefits in kind provided to employees and directors during the tax year (on P11D forms) to HMRC.",
    urgency: "warning",
  },
  {
    date: "19 July",
    label: "Class 1A NI on Benefits",
    description: "Deadline to pay Class 1A National Insurance contributions on expenses and benefits reported on P11D forms (22 July for electronic payment).",
    urgency: "warning",
  },
];

// ── Companies House deadline rows ─────────────────────────────
const companiesHouseDeadlines = [
  {
    trigger: "Within 14 days of review period end",
    label: "Confirmation Statement",
    description: "All UK companies must file a Confirmation Statement (previously Annual Return) confirming their registered details are up to date. Due within 14 days of the 12-month review period.",
    urgency: "warning",
  },
  {
    trigger: "9 months after year end",
    label: "Annual Accounts — Private Company",
    description: "Private limited companies must file their annual accounts with Companies House within 9 months of their accounting reference date. First accounts: 21 months from incorporation.",
    urgency: "critical",
  },
  {
    trigger: "6 months after year end",
    label: "Annual Accounts — Public Company",
    description: "Public limited companies (PLCs) must file annual accounts with Companies House within 6 months of their financial year end.",
    urgency: "critical",
  },
];

// ── MTD timeline ──────────────────────────────────────────────
const mtdTimeline = [
  {
    date: "Live Now",
    title: "MTD for VAT",
    description: "All VAT-registered businesses must keep digital records and file VAT returns using HMRC-recognised software. No exceptions. Paper returns are no longer accepted.",
    badge: "bg-green-500/15 text-green-400 border border-green-500/30",
    dot: "bg-green-500",
  },
  {
    date: "6 April 2026",
    title: "MTD for Income Tax — £50,000+",
    description: "Sole traders and landlords with combined income over £50,000 must use MTD-compatible software and submit quarterly updates to HMRC instead of an annual tax return.",
    badge: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    dot: "bg-orange-500",
  },
  {
    date: "6 April 2027",
    title: "MTD for Income Tax — £30,000+",
    description: "MTD for ITSA extends to self-employed individuals and landlords with combined income over £30,000. Quarterly digital reporting becomes mandatory for this group.",
    badge: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    dot: "bg-blue-500",
  },
  {
    date: "TBC",
    title: "MTD for Income Tax — Under £30,000",
    description: "HMRC has indicated MTD will eventually apply to all self-employed people and landlords, but the timeline for those under £30,000 is still under consultation.",
    badge: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    dot: "bg-purple-500",
  },
];

// ── Urgency badge helper ──────────────────────────────────────
function UrgencyBadge({ urgency }: { urgency: string }) {
  if (urgency === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
        <AlertTriangle size={11} />
        Important
      </span>
    );
  }
  if (urgency === "warning") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
        <Clock size={11} />
        Key Date
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary border border-primary/20">
      <Info size={11} />
      Note
    </span>
  );
}

// ── Wave SVG divider ──────────────────────────────────────────
function WaveDivider({ fromDark, flip = false }: { fromDark: boolean; flip?: boolean }) {
  const fill = fromDark ? "#F0F9FF" : "#0F172A";
  return (
    <div className={`leading-none ${flip ? "rotate-180" : ""}`} style={{ marginBottom: "-2px" }}>
      <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
        <path
          d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

function WaveDividerSurface({ fromDark }: { fromDark: boolean }) {
  const fill = fromDark ? "#ffffff" : "#0F172A";
  return (
    <div className="leading-none" style={{ marginBottom: "-2px" }}>
      <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
        <path
          d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ── Page component ────────────────────────────────────────────
export default function TaxDeadlinesPage() {
  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — dark with animated blobs
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-32">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary-light rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Calendar size={15} />
              2025/26 Tax Year
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              UK Tax Deadlines —{" "}
              <span className="text-gradient">Key Dates for Your Diary</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-4">
              Missing an HMRC deadline costs you money — £100 on day one, escalating fast. This is your complete reference for every Self Assessment, Corporation Tax, VAT, PAYE, Companies House, and MTD deadline in the UK.
            </p>
            <p className="text-white/60 leading-relaxed mb-10">
              With {COMPANY.name}, your dedicated accountant tracks every deadline for you. No surprises. No penalties. No stress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary-dark transition-all shadow-lg"
              >
                Never miss a deadline <ArrowRight size={20} />
              </Link>
              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20"
              >
                <Phone size={20} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>

        {/* Wave out of hero into white */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SELF ASSESSMENT — white bg
          ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section header */}
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Self Assessment
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Self Assessment Deadlines
            </h2>
            <p className="text-text-light leading-relaxed">
              If you&apos;re self-employed, a landlord, company director, or have complex income, you need to file a Self Assessment tax return. These are the key dates that apply to the 2024/25 tax year (due in the 2025/26 filing period).
            </p>
          </div>

          {/* Deadline cards */}
          <div className="space-y-4 mb-12">
            {selfAssessmentDeadlines.map((item) => (
              <div
                key={item.date}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6 flex flex-col sm:flex-row sm:items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Calendar size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-base font-black text-dark">{item.date}</span>
                    <span className="text-sm font-semibold text-text-light">—</span>
                    <span className="text-base font-bold text-dark">{item.label}</span>
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                  <p className="text-sm text-text-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Penalty callout */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark mb-3">Late Self Assessment Penalties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { trigger: "Day 1 late", penalty: "£100", note: "Applies even if no tax is owed" },
                    { trigger: "3+ months late", penalty: "£10/day", note: "Up to a maximum of £900 (90 days)" },
                    { trigger: "6+ months late", penalty: "5% of tax owed", note: "Plus a further 5% at 12 months" },
                  ].map((p) => (
                    <div key={p.trigger} className="bg-white rounded-xl p-4 border border-red-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-1">{p.trigger}</p>
                      <p className="text-xl font-black text-dark mb-1">{p.penalty}</p>
                      <p className="text-xs text-text-light">{p.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave into surface */}
      <div className="bg-white leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,24 C480,56 960,0 1440,24 L1440,56 L0,56 Z" fill="#F0F9FF" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          CORPORATION TAX — surface bg
          ══════════════════════════════════════════ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Corporation Tax
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Corporation Tax Deadlines
            </h2>
            <p className="text-text-light leading-relaxed">
              Corporation Tax deadlines for limited companies are tied to your company&apos;s accounting period end date — not the calendar year. Every company has its own unique set of deadlines.
            </p>
          </div>

          {/* Deadline cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {corporationTaxDeadlines.map((item) => (
              <div
                key={item.trigger}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{item.trigger}</p>
                  <h3 className="text-base font-black text-dark mb-2">{item.label}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Penalties note */}
          <div className="bg-white border border-border rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="font-black text-dark mb-2">Late CT600 Filing Penalties</h3>
              <p className="text-sm text-text-light leading-relaxed mb-3">
                HMRC charges automatic penalties for late Corporation Tax returns regardless of whether any tax is outstanding.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { delay: "1 day late", fine: "£100" },
                  { delay: "3 months late", fine: "Another £100" },
                  { delay: "6 months late", fine: "10% of unpaid tax" },
                  { delay: "12 months late", fine: "Further 10% of unpaid tax" },
                ].map((row) => (
                  <div key={row.delay} className="bg-orange-50 rounded-lg px-3 py-2 text-xs">
                    <span className="font-semibold text-dark">{row.delay}:</span>{" "}
                    <span className="text-orange-700 font-bold">{row.fine}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave into dark */}
      <div className="bg-surface leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,24 C480,0 960,56 1440,24 L1440,56 L0,56 Z" fill="#0F172A" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          VAT — dark bg
          ══════════════════════════════════════════ */}
      <section className="bg-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              VAT
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              VAT Deadlines
            </h2>
            <p className="text-white/70 leading-relaxed">
              Most VAT-registered businesses file quarterly. The submission and payment deadline is 1 month and 7 days after the end of your VAT quarter. Businesses pay using Direct Debit get an extra 3 days.
            </p>
          </div>

          {/* Standard quarters */}
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6">
              Standard VAT Quarter Deadlines
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vatQuarters.map((q) => (
                <div key={q.quarter} className="bg-white/[0.07] border border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-light mb-2">{q.quarter}</p>
                  <p className="text-sm text-white/70 mb-3">{q.period}</p>
                  <p className="text-xl font-black text-white">{q.deadline}</p>
                  <p className="text-xs text-white/40 mt-1">Submit &amp; pay by</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key VAT points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <Clock size={22} />,
                title: "Direct Debit Bonus",
                desc: "Businesses paying by Direct Debit benefit from an extra 3 days — HMRC collects automatically 3 working days after the standard deadline.",
              },
              {
                icon: <Receipt size={22} />,
                title: "Staggered Return Dates",
                desc: "Not all businesses have the same quarter ends. HMRC staggers them — yours depends on your VAT registration date and any agreed periods.",
              },
              {
                icon: <Zap size={22} />,
                title: "MTD for VAT — Mandatory",
                desc: "All VAT-registered businesses must file using MTD-compatible software. There are no paper VAT returns. No exceptions. FreeAgent handles this automatically.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.07] border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary-light flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Penalty note */}
          <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="font-black text-white mb-1">VAT Late Filing &amp; Payment Penalties</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                From January 2023, HMRC operates a new points-based penalty regime for late VAT returns. Accumulate points and financial penalties follow. Late payment interest accrues from the day after the due date at Bank of England base rate + 2.5%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave into white */}
      <div className="bg-dark leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          PAYE & PAYROLL — white bg
          ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              PAYE &amp; Payroll
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              PAYE &amp; Payroll Deadlines
            </h2>
            <p className="text-text-light leading-relaxed">
              If you employ anyone — including yourself as a company director — you&apos;re operating PAYE. These are the recurring deadlines you must hit every month and at year end.
            </p>
          </div>

          {/* Deadline cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payeDeadlines.map((item) => (
              <div
                key={item.date}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6 flex items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-black text-dark">{item.date}</span>
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                  <h3 className="font-bold text-dark mb-1">{item.label}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RTI note */}
          <div className="mt-10 bg-primary-50 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Info size={22} />
            </div>
            <div>
              <h3 className="font-black text-dark mb-1">Real Time Information (RTI)</h3>
              <p className="text-sm text-text-light leading-relaxed">
                Under RTI, every payroll run must be reported to HMRC via a Full Payment Submission (FPS) on or before the pay date. This applies even if the payment is a one-off or the amounts are below the tax and NI thresholds. Late FPS submissions attract penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave into surface */}
      <div className="bg-white leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,24 C480,56 960,0 1440,24 L1440,56 L0,56 Z" fill="#F0F9FF" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          COMPANIES HOUSE — surface bg
          ══════════════════════════════════════════ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Companies House
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Companies House Deadlines
            </h2>
            <p className="text-text-light leading-relaxed">
              Limited companies have obligations to Companies House that are separate from HMRC. Missing these deadlines results in automatic financial penalties — and persistent non-compliance can lead to your company being struck off.
            </p>
          </div>

          {/* Deadline cards */}
          <div className="space-y-4 mb-12">
            {companiesHouseDeadlines.map((item) => (
              <div
                key={item.trigger}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6 flex flex-col sm:flex-row sm:items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{item.trigger}</span>
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                  <h3 className="font-black text-dark mb-1">{item.label}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Late filing penalty escalator */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="font-black text-dark mb-1">Late Accounts Penalty — Private Companies</h3>
                <p className="text-sm text-text-light">Penalties escalate the longer you leave it. They double if you file late two years in a row.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { delay: "Up to 1 month", penalty: "£150" },
                { delay: "1–3 months", penalty: "£375" },
                { delay: "3–6 months", penalty: "£750" },
                { delay: "Over 6 months", penalty: "£1,500" },
                { delay: "Repeated late filing", penalty: "Doubled" },
              ].map((row) => (
                <div key={row.delay} className="bg-surface rounded-xl p-4 text-center">
                  <p className="text-xs text-text-light mb-2 leading-snug">{row.delay}</p>
                  <p className="text-lg font-black text-dark">{row.penalty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave into dark */}
      <div className="bg-surface leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,24 C480,0 960,56 1440,24 L1440,56 L0,56 Z" fill="#0F172A" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          MTD — dark bg
          ══════════════════════════════════════════ */}
      <section className="bg-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              Making Tax Digital
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              MTD Deadlines &amp; Rollout
            </h2>
            <p className="text-white/70 leading-relaxed">
              HMRC&apos;s Making Tax Digital programme is transforming how UK businesses report and pay tax. MTD for VAT is already live. MTD for Income Tax is coming fast. Here&apos;s what you need to know.
            </p>
          </div>

          {/* MTD timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10 hidden md:block" />

            <div className="space-y-6">
              {mtdTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-white/[0.07] border border-white/10 rounded-2xl p-6 md:pl-8 flex flex-col md:flex-row md:items-start gap-5"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4.5 top-8 w-3 h-3 rounded-full ${item.dot} hidden md:block ring-4 ring-dark`} />

                  <div className="flex-shrink-0 md:ml-6">
                    <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${item.badge}`}>
                      {item.date}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MTD CTA link */}
          <div className="mt-10 text-center">
            <Link
              href="/making-tax-digital"
              className="inline-flex items-center gap-2 text-primary-light font-semibold hover:text-white transition-colors underline underline-offset-4"
            >
              Read our full Making Tax Digital guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Wave into orange CTA */}
      <div className="bg-dark leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z" fill="#F97316" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          CTA — orange gradient
          ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto mb-6">
            <Landmark size={32} />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            We Handle All of This for You
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-4 max-w-2xl mx-auto">
            Every deadline above — Self Assessment, Corporation Tax, VAT, PAYE, Companies House, MTD — your dedicated {COMPANY.name} accountant tracks and manages them all. You focus on your business.
          </p>
          <p className="text-white/75 mb-10 max-w-xl mx-auto">
            No deadline surprises. No HMRC penalties. No stress. From £42.50/month with no setup fees and no minimum contract.
          </p>

          {/* What's included bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-10 text-left">
            {[
              "Dedicated accountant who knows your deadlines",
              "All HMRC returns prepared and filed",
              "Companies House filings handled",
              "Free FreeAgent accounting software",
              "MTD-compliant from day one",
              "Unlimited phone and email advice",
            ].map((point) => (
              <div key={point} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">{point}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-all shadow-xl"
            >
              Get Started Today <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/25 transition-all border border-white/30"
            >
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
