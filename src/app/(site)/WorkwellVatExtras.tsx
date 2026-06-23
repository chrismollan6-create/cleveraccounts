"use client";

import Link from "next/link";
import {
  Receipt,
  CalendarClock,
  ArrowDownCircle,
  Sparkles,
  FileText,
  Percent,
  Banknote,
  CalendarDays,
  Clock,
  Ban,
  FileWarning,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

/* ── When you must register ───────────────────────────────────── */
const REGISTER_POINTS = [
  {
    Icon: CalendarClock,
    title: "The rolling 12-month test",
    desc: "Register if your taxable turnover goes over £90,000 across any rolling 12-month period — not your accounting year.",
  },
  {
    Icon: CalendarDays,
    title: "The next-30-days test",
    desc: "You must also register if you expect to exceed £90,000 in the next 30 days alone (e.g. winning one big contract).",
  },
  {
    Icon: Sparkles,
    title: "Voluntary registration",
    desc: "Below the threshold you can still register voluntarily to reclaim VAT on your costs — sometimes worth it.",
  },
  {
    Icon: ArrowDownCircle,
    title: "Deregistering",
    desc: "If turnover falls below £88,000 you can apply to deregister. We'll tell you whether it's worth it.",
  },
];

/* ── The main VAT schemes ─────────────────────────────────────── */
const VAT_SCHEMES = [
  {
    Icon: FileText,
    name: "Standard VAT",
    eligibility: "The default",
    desc: "Account for VAT by invoice date — reclaim VAT on purchases, charge it on sales, file each quarter.",
  },
  {
    Icon: Percent,
    name: "Flat Rate Scheme",
    eligibility: "Turnover ≤ £150,000",
    desc: "Pay a fixed percentage of gross sales instead of tracking VAT on every purchase. Simpler — but 'limited cost traders' pay 16.5%, so it isn't always cheaper.",
  },
  {
    Icon: Banknote,
    name: "Cash Accounting",
    eligibility: "Turnover ≤ £1.35m",
    desc: "Pay VAT only once your customers actually pay you — a real cash-flow help if your clients are slow.",
  },
  {
    Icon: CalendarDays,
    name: "Annual Accounting",
    eligibility: "Turnover ≤ £1.35m",
    desc: "Submit one return a year with regular advance payments — less admin and smoother budgeting.",
  },
];

/* ── Common VAT mistakes ──────────────────────────────────────── */
const VAT_MISTAKES = [
  {
    Icon: Clock,
    title: "Registering too late",
    desc: "Slip over £90,000 unnoticed and HMRC backdates your registration — you owe the VAT even if you never charged it to customers.",
  },
  {
    Icon: Ban,
    title: "Reclaiming what you can't",
    desc: "Client entertainment, personal purchases and most cars are blocked. Reclaiming them invites penalties and interest.",
  },
  {
    Icon: AlertTriangle,
    title: "The Flat Rate trap",
    desc: "The Flat Rate Scheme isn't automatically cheaper — limited-cost traders pay 16.5%, often more than standard VAT would have cost.",
  },
  {
    Icon: FileWarning,
    title: "Missing MTD deadlines",
    desc: "VAT is fully Making Tax Digital — returns must be filed from digital records, and the points-based penalty regime bites for late returns and payments.",
  },
];

export default function WorkwellVatExtras() {
  return (
    <>
      {/* ── When you must register ───────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Registration</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              When you must register for VAT
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Register too late and you still owe the VAT. Here&apos;s the threshold and the rules that
              catch people out.
            </p>
          </div>

          {/* Threshold hero figure */}
          <div className="max-w-5xl mx-auto mb-8 rounded-3xl bg-gradient-to-r from-[#29484f] via-[#29484f] to-[#16282d] p-7 md:p-9 ring-1 ring-[#8db74e]/40 shadow-2xl shadow-[#29484f]/30 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 rounded-2xl bg-[#8db74e]/20 text-[#e0e48e] flex items-center justify-center shrink-0">
                <Receipt size={28} />
              </span>
              <div>
                <p className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.16em] mb-1">VAT registration threshold</p>
                <p className="text-white font-extrabold text-3xl md:text-4xl leading-none">£90,000</p>
              </div>
            </div>
            <p className="text-white/75 text-sm max-w-xs">
              Taxable turnover, for both the 2025/26 and 2026/27 tax years. Deregistration threshold:
              <span className="text-white font-semibold"> £88,000</span>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {REGISTER_POINTS.map((p) => (
              <div key={p.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-4">
                  <p.Icon size={22} />
                </span>
                <h3 className="font-bold text-[#29484f] text-sm mb-1.5">{p.title}</h3>
                <p className="text-[#5a6f74] text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VAT schemes ──────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Pick the right scheme</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              The main VAT schemes
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              The scheme you choose changes your cash flow, admin and even how much VAT you pay. We
              pick the right one for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {VAT_SCHEMES.map((s, i) => (
              <div key={s.name} className="rounded-3xl border border-[#e4ecd6] overflow-hidden bg-white shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)] flex flex-col">
                <div className={`h-1.5 w-full bg-gradient-to-r ${["from-[#8db74e] to-[#e0e48e]", "from-[#8db74e] to-[#cde3a3]", "from-[#29484f] to-[#4a6a72]", "from-[#8db74e] to-[#8db74e]"][i]}`} />
                <div className="p-6 flex flex-col flex-1">
                  <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-4">
                    <s.Icon size={22} />
                  </span>
                  <h3 className="font-bold text-[#29484f]">{s.name}</h3>
                  <p className="text-[#5f8a3e] text-xs font-semibold mb-2.5">{s.eligibility}</p>
                  <p className="text-[#5a6f74] text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common VAT mistakes ──────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#c75f47] font-bold text-sm uppercase tracking-wider">Avoid these</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Common VAT mistakes
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              VAT is where small errors get expensive fast. These are the ones we see most — and stop
              before they happen.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {VAT_MISTAKES.map((m) => (
              <div key={m.title} className="flex gap-4 rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#d9846f]/12 text-[#c75f47] flex items-center justify-center">
                  <m.Icon size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-[#29484f] mb-1.5">{m.title}</h3>
                  <p className="text-[#5a6f74] text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/30"
            >
              Let us handle your VAT <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
