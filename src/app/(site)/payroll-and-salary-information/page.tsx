import {
  ArrowRight,
  PoundSterling,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  CheckCircle2,
  Phone,
  Info,
  MapPin,
  ShieldCheck,
  CalendarClock,
  Banknote,
} from "lucide-react";
import { getBrand } from "@/lib/brand";

// ── Salary illustration rows — 2026/27 tax year ───────────────
// Monthly figures for common director salary options. Employer's NI is shown
// both for a sole-director company (no Employment Allowance) and where the
// company can claim Employment Allowance / has a second employee. The annual
// saving is the Corporation Tax relief on the deductible salary + employer NI.
const salaryRows = [
  {
    salary: "£6,708",
    note: "State Pension qualifying year",
    gross: "£559.00",
    tax: "£0.00",
    ni: "£0.00",
    net: "£559.00",
    erNi: "£21.35",
    erNiEa: "£0.00",
    saveNoEa: "£1,067",
    saveEa: "£1,275",
  },
  {
    salary: "£9,096",
    note: "Secondary (employer) NI threshold",
    gross: "£758.00",
    tax: "£0.00",
    ni: "£0.00",
    net: "£758.00",
    erNi: "£51.20",
    erNiEa: "£0.00",
    saveNoEa: "£1,231",
    saveEa: "£1,728",
  },
  {
    salary: "£12,570",
    note: "Full personal allowance",
    gross: "£1,047.50",
    tax: "£0.00",
    ni: "£0.00",
    net: "£1,047.50",
    erNi: "£94.63",
    erNiEa: "£0.00",
    saveNoEa: "£1,469",
    saveEa: "£2,388",
  },
  {
    salary: "£15,000",
    note: "Above personal allowance",
    gross: "£1,250.00",
    tax: "£40.50",
    ni: "£16.20",
    net: "£1,193.30",
    erNi: "£125.00",
    erNiEa: "£0.00",
    saveNoEa: "£955",
    saveEa: "£2,170",
  },
];

// ── Payroll timeline ──────────────────────────────────────────
const timeline = [
  {
    date: "By 15 April 2026",
    title: "Confirm your salary instructions",
    description:
      "Reply to confirm the salary you'd like to take for 2026/27. Under HMRC's Real Time Information rules, no salary can be processed until we hear from you.",
    icon: CalendarClock,
  },
  {
    date: "By 25 April 2026",
    title: "First payroll processed",
    description:
      "Once confirmed, we run your first pay period of the new tax year and produce your payslip.",
    icon: Banknote,
  },
  {
    date: "By 30 April 2026",
    title: "First RTI submission to HMRC",
    description:
      "We send your Full Payment Submission (FPS) to HMRC on or before payday, keeping your PAYE scheme fully compliant.",
    icon: FileText,
  },
  {
    date: "Ongoing",
    title: "Monthly processing thereafter",
    description:
      "We process payroll and file RTI every month for the rest of the tax year — no further action needed unless your salary changes.",
    icon: Clock,
  },
];

// ── Key compliance topics ─────────────────────────────────────
const topics = [
  {
    icon: FileText,
    title: "Real Time Information (RTI)",
    body: "Every UK employer must report payroll to HMRC in real time — on or before each payday — using a Full Payment Submission. We handle this for you every month. Late or missed submissions can attract penalties of up to £100 per month, so it's important your salary is confirmed in good time.",
  },
  {
    icon: Users,
    title: "Pension auto-enrolment",
    body: "Employees earning more than £833 per month, aged between 22 and State Pension age, must be assessed and enrolled into a workplace pension each pay period. Sole directors with no other staff are usually exempt. We assess eligibility, handle enrolment, contributions and your declaration of compliance.",
  },
  {
    icon: ShieldCheck,
    title: "Employment Allowance",
    body: "Eligible businesses can reduce their employer's National Insurance bill by up to £10,500 a year through Employment Allowance. It isn't available to single-director companies with no other employees, but it's valuable once you take on staff — and we'll claim it for you where you qualify.",
  },
  {
    icon: Info,
    title: "Choosing the right salary",
    body: "The optimal salary depends on your wider income, state-benefit entitlement, IR35 status and whether the role is genuinely appropriate to the work performed. We review your specific circumstances each tax year and recommend the most tax-efficient figure — you don't need to work it out yourself.",
  },
];

// ── Wave SVG divider ──────────────────────────────────────────
function Wave({ fill }: { fill: string }) {
  return (
    <div className="leading-none" style={{ marginBottom: "-2px" }}>
      <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
        <path d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z" fill={fill} />
      </svg>
    </div>
  );
}

// ── Page component ────────────────────────────────────────────
export default async function PayrollAndSalaryInformationPage() {
  const brand = await getBrand();
  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — dark with animated blobs
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary-light rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <PoundSterling size={15} />
              2026/27 Tax Year
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Salary &amp; Payroll Information —{" "}
              <span className="text-gradient">Your 2026/27 Guide</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-4">
              The new tax year begins on 6 April 2026. This is your guide to taking a salary through your company — the most tax-efficient options, the payroll timeline, and what we need from you to get started.
            </p>
            <p className="text-white/60 leading-relaxed mb-10">
              With {brand.name}, your dedicated accountant runs your payroll, files RTI with HMRC and keeps you compliant every month. We just need you to confirm the salary you&apos;d like to take.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${brand.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary-dark transition-all shadow-lg"
              >
                <Phone size={20} /> {brand.phone}
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20"
              >
                Confirm my salary <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ACTION-REQUIRED CALLOUT
          ══════════════════════════════════════════ */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-dark mb-2">
                Action required — confirm your salary
              </h2>
              <p className="text-text-light leading-relaxed">
                HMRC&apos;s Real Time Information (RTI) rules require us to report each salary to HMRC on or before the day it&apos;s paid.{" "}
                <strong className="text-dark">If we do not receive confirmation from you, no salary will be processed</strong>{" "}
                — so please reply with your chosen salary by <strong className="text-dark">15 April 2026</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SALARY ILLUSTRATION TABLE
          ══════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Salary Options
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Common salary options for 2026/27
            </h2>
            <p className="text-text-light leading-relaxed">
              These are the salary levels most directors consider. The personal allowance for 2026/27 is £12,570, so a salary up to this level is generally free of income tax. All figures are monthly unless stated and are illustrative — your accountant will recommend the best option for your circumstances.
            </p>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="bg-dark text-white text-left">
                  <th className="px-4 py-4 font-bold">Annual salary</th>
                  <th className="px-4 py-4 font-bold">Gross / mo</th>
                  <th className="px-4 py-4 font-bold">Income tax</th>
                  <th className="px-4 py-4 font-bold">Employee NI</th>
                  <th className="px-4 py-4 font-bold">Net pay / mo</th>
                  <th className="px-4 py-4 font-bold">Employer NI</th>
                  <th className="px-4 py-4 font-bold">Employer NI<br /><span className="font-medium text-white/60 text-xs">with EA / staff</span></th>
                  <th className="px-4 py-4 font-bold">CT saving / yr<br /><span className="font-medium text-white/60 text-xs">no EA</span></th>
                  <th className="px-4 py-4 font-bold">CT saving / yr<br /><span className="font-medium text-white/60 text-xs">with EA</span></th>
                </tr>
              </thead>
              <tbody>
                {salaryRows.map((row, i) => (
                  <tr key={row.salary} className={i % 2 ? "bg-surface" : "bg-white"}>
                    <td className="px-4 py-4">
                      <div className="font-black text-dark">{row.salary}</div>
                      <div className="text-xs text-text-light">{row.note}</div>
                    </td>
                    <td className="px-4 py-4 text-text-light">{row.gross}</td>
                    <td className="px-4 py-4 text-text-light">{row.tax}</td>
                    <td className="px-4 py-4 text-text-light">{row.ni}</td>
                    <td className="px-4 py-4 font-bold text-dark">{row.net}</td>
                    <td className="px-4 py-4 text-text-light">{row.erNi}</td>
                    <td className="px-4 py-4 text-text-light">{row.erNiEa}</td>
                    <td className="px-4 py-4 text-primary font-semibold">{row.saveNoEa}</td>
                    <td className="px-4 py-4 text-primary font-semibold">{row.saveEa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-start gap-3 text-sm text-text-light">
            <Info size={16} className="flex-shrink-0 mt-0.5 text-primary" />
            <p>
              <strong className="text-dark">EA = Employment Allowance.</strong> The Corporation Tax saving reflects the relief on the salary and employer&apos;s NI as deductible business costs. Figures are illustrative for 2026/27 and assume the director has no other earnings. We&apos;ll confirm the exact numbers for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* Wave into dark timeline */}
      <Wave fill="#0F172A" />

      {/* ══════════════════════════════════════════
          PAYROLL TIMELINE — dark
          ══════════════════════════════════════════ */}
      <section className="bg-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              What Happens When
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Your payroll timeline
            </h2>
            <p className="text-white/60 leading-relaxed">
              Here&apos;s how the first pay run of the new tax year works once you&apos;ve confirmed your salary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {timeline.map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 text-secondary-light flex items-center justify-center">
                  <item.icon size={22} />
                </div>
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wide text-secondary-light mb-2">
                    {item.date}
                  </span>
                  <h3 className="font-black text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave back to white */}
      <Wave fill="#ffffff" />

      {/* ══════════════════════════════════════════
          KEY COMPLIANCE TOPICS — white
          ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              The Detail
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              What you need to know
            </h2>
            <p className="text-text-light leading-relaxed">
              The rules behind running a compliant payroll — all handled for you as part of your service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((t) => (
              <div
                key={t.title}
                className="bg-white border border-border rounded-2xl shadow-sm card-hover p-6 md:p-7"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <t.icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-dark">{t.title}</h3>
                </div>
                <p className="text-sm text-text-light leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into secondary CTA */}
      <div className="bg-white leading-none">
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,32 C360,56 1080,8 1440,32 L1440,56 L0,56 Z" className="fill-secondary" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          CTA — brand secondary
          ══════════════════════════════════════════ */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto mb-6">
            <PoundSterling size={32} />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to confirm your salary?
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-4 max-w-2xl mx-auto">
            Reply to your accountant or get in touch and we&apos;ll set up your 2026/27 payroll, file RTI with HMRC and keep you compliant every month.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-10 text-left">
            {[
              "Monthly payroll processed for you",
              "RTI filed with HMRC on time, every time",
              "Optimal salary recommended each tax year",
              "Pension auto-enrolment handled",
              "Payslips, P60s and P11Ds included",
              "Unlimited support from your accountant",
            ].map((point) => (
              <div key={point} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">{point}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-10 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-xl"
            >
              <Phone size={20} /> {brand.phone}
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/25 transition-all border border-white/30"
            >
              {brand.email} <ArrowRight size={20} />
            </a>
          </div>

          <div className="inline-flex items-center gap-2 text-white/70 text-sm">
            <MapPin size={15} />
            {brand.legalName} · {brand.postalAddress}
          </div>
        </div>
      </section>
    </>
  );
}
