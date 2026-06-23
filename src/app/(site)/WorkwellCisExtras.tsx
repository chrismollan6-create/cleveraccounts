"use client";

import Link from "next/link";
import {
  UserCheck,
  Percent,
  ClipboardList,
  Receipt,
  BadgeCheck,
  FileText,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FolderOpen,
  Send,
  FileCheck2,
  Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   CIS — Contractor vs Subcontractor obligations
   (data mirrors the Clever CIS page so both brands stay in sync)
   ───────────────────────────────────────────────────────────── */
const CONTRACTOR_OBLIGATIONS = [
  {
    Icon: UserCheck,
    title: "Verify subcontractors",
    desc: "Before making a first payment, contractors must verify each subcontractor with HMRC to determine the correct deduction rate (0%, 20%, or 30%).",
  },
  {
    Icon: Percent,
    title: "Make CIS deductions",
    desc: "Deduct the correct percentage from each payment to a subcontractor (labour element only — materials are excluded from the deduction).",
  },
  {
    Icon: ClipboardList,
    title: "File monthly returns",
    desc: "Submit a CIS monthly return to HMRC by the 19th of each month detailing payments made and deductions taken in the previous tax month.",
  },
  {
    Icon: Receipt,
    title: "Issue payment & deduction statements",
    desc: "Provide each subcontractor with a payment and deduction statement within 14 days of the end of each tax month.",
  },
];

const SUBCONTRACTOR_OBLIGATIONS = [
  {
    Icon: BadgeCheck,
    title: "Register with HMRC for CIS",
    desc: "Register before work starts to ensure you're on the 20% standard rate rather than the 30% higher rate. We handle registration as part of onboarding.",
  },
  {
    Icon: FileText,
    title: "Provide your UTR to contractors",
    desc: "Your Unique Taxpayer Reference (UTR) is what contractors use to verify you with HMRC. Without it, they must deduct at 30%.",
  },
  {
    Icon: BarChart3,
    title: "Track deductions suffered",
    desc: "Keep records of every payment and deduction statement you receive. These deductions will be offset against your tax liability at year end.",
  },
  {
    Icon: TrendingDown,
    title: "Reclaim overpaid tax at year end",
    desc: "Most CIS subcontractors overpay tax during the year. Your self assessment return is where you reclaim the difference — we make sure you don't miss a penny.",
  },
];

function ObligationCard({
  eyebrow,
  title,
  subtitle,
  rows,
  footnote,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  rows: { Icon: typeof UserCheck; title: string; desc: string }[];
  footnote: { tone: "warn" | "good"; node: React.ReactNode };
}) {
  const warn = footnote.tone === "warn";
  return (
    <div className="flex flex-col rounded-3xl border border-[#e4ecd6] bg-white p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center shrink-0">
          {eyebrow === "Contractors" ? <ClipboardList size={22} /> : <BadgeCheck size={22} />}
        </span>
        <div>
          <h3 className="text-xl font-extrabold text-[#29484f] leading-tight">{title}</h3>
          <p className="text-[#6a7b80] text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="divide-y divide-[#e4ecd6] flex-1">
        {rows.map((r) => (
          <div key={r.title} className="flex gap-3.5 py-4 first:pt-0">
            <span className="w-10 h-10 shrink-0 rounded-xl bg-[#f4f8ec] border border-[#e4ecd6] text-[#5f8a3e] flex items-center justify-center mt-0.5">
              <r.Icon size={18} />
            </span>
            <div>
              <p className="font-bold text-[#29484f]">{r.title}</p>
              <p className="text-[#5a6f74] text-sm leading-relaxed mt-1">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`mt-6 rounded-2xl px-4 py-3.5 flex items-start gap-2.5 text-sm leading-relaxed ${
          warn
            ? "bg-[#d9846f]/10 ring-1 ring-[#d9846f]/20 text-[#8a5246]"
            : "bg-[#8db74e]/12 ring-1 ring-[#8db74e]/25 text-[#46622a]"
        }`}
      >
        {warn ? (
          <AlertTriangle size={17} className="text-[#c75f47] shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 size={17} className="text-[#5f8a3e] shrink-0 mt-0.5" />
        )}
        <span>{footnote.node}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MTD for CIS — timeline, responsibilities, need-to-know
   ───────────────────────────────────────────────────────────── */
const MTD_TIMELINE = [
  {
    date: "April 2026",
    threshold: "£50,000+",
    note: "MTD for Income Tax begins for self-employed income over £50k — this brings in most CIS subcontractors first.",
  },
  {
    date: "April 2027",
    threshold: "£30,000+",
    note: "The threshold drops to £30k, pulling more CIS workers into quarterly digital reporting.",
  },
  {
    date: "April 2028",
    threshold: "£20,000+",
    note: "The threshold drops again to £20k — by now almost every CIS subcontractor is included.",
  },
];

const MTD_RESPONSIBILITIES = [
  {
    Icon: FolderOpen,
    title: "Keep digital records",
    desc: "Record all income and CIS deductions digitally using MTD-compatible software — no more shoeboxes of statements.",
  },
  {
    Icon: Send,
    title: "Send quarterly updates",
    desc: "Submit a summary of your income and expenses to HMRC every three months, instead of one return a year.",
  },
  {
    Icon: FileCheck2,
    title: "File a final declaration",
    desc: "Confirm your figures after the tax year ends to finalise your tax — this replaces the old self assessment return.",
  },
];

export default function WorkwellCisExtras() {
  return (
    <>
      {/* ── Know your role: contractor vs subcontractor ──────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Know your role</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Contractors &amp; subcontractors — different obligations
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              CIS creates very different duties depending on whether you engage other workers or
              work under contract yourself. Many people in construction are both — we handle both sides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            <ObligationCard
              eyebrow="Contractors"
              title="Contractors"
              subtitle="Businesses that engage subcontractors"
              rows={CONTRACTOR_OBLIGATIONS}
              footnote={{
                tone: "warn",
                node: (
                  <>
                    <strong className="font-bold">Penalties start at £100</strong> for a late monthly
                    return, rising to £3,000 or more for persistent non-compliance. We file every
                    return on time.
                  </>
                ),
              }}
            />
            <ObligationCard
              eyebrow="Subcontractors"
              title="Subcontractors"
              subtitle="Individuals and businesses working under contract"
              rows={SUBCONTRACTOR_OBLIGATIONS}
              footnote={{
                tone: "good",
                node: (
                  <>
                    <strong className="font-bold">Most subcontractors overpay tax</strong> during the
                    year. We reclaim every penny you&apos;re owed through your self assessment return.
                  </>
                ),
              }}
            />
          </div>
        </div>
      </section>

      {/* ── MTD for CIS ──────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Making Tax Digital</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              MTD for CIS — what&apos;s changing, and when
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              CIS subcontractors are self-employed, so Making Tax Digital for Income Tax applies to
              you. Here&apos;s the timeline, what you&apos;ll need to do, and how we keep it effortless.
            </p>
          </div>

          {/* Timeline */}
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {MTD_TIMELINE.map((t, i) => (
              <div key={t.date} className="relative rounded-3xl border border-[#e4ecd6] bg-[#f4f8ec] p-6">
                <div className={`h-1.5 -mt-6 -mx-6 mb-5 rounded-t-3xl bg-gradient-to-r ${["from-[#8db74e] to-[#e0e48e]", "from-[#8db74e] to-[#cde3a3]", "from-[#29484f] to-[#4a6a72]"][i]}`} />
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#5f8a3e]">{t.date}</span>
                </div>
                <p className="text-2xl font-extrabold text-[#29484f] mb-2">
                  {t.threshold}<span className="text-sm font-semibold text-[#6a7b80]"> income</span>
                </p>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{t.note}</p>
              </div>
            ))}
          </div>

          {/* Responsibilities */}
          <h3 className="text-center text-lg font-extrabold text-[#29484f] mt-14 mb-7">What you&apos;ll need to do</h3>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MTD_RESPONSIBILITIES.map((r) => (
              <div key={r.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-4">
                  <r.Icon size={22} />
                </span>
                <h4 className="font-bold text-[#29484f] mb-2">{r.title}</h4>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* Need-to-know / FreeAgent */}
          <div className="relative overflow-hidden mt-12 max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#29484f] via-[#29484f] to-[#16282d] p-8 md:p-10 ring-1 ring-[#8db74e]/40 shadow-2xl shadow-[#29484f]/40">
            <div className="absolute -top-16 right-0 w-72 h-72 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-7 text-center lg:text-left">
              <div>
                <p className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.18em] mb-3 flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles size={15} /> The need-to-know
                </p>
                <p className="text-white text-xl md:text-2xl font-extrabold leading-snug max-w-2xl">
                  FreeAgent is included free and fully MTD-ready — tracking your CIS deductions and
                  keeping your records set up for quarterly digital reporting.
                </p>
                <p className="text-white/70 mt-3 text-sm md:text-base">
                  Real-time deduction tracking means faster, more accurate year-end reclaims. MTD
                  quarterly filing is available as an add-on — we&apos;ll quote it clearly.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="shrink-0 inline-flex items-center gap-2 bg-[#8db74e] hover:bg-[#7ba63f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/30 transition-colors"
              >
                Get MTD-ready <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
