"use client";

import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Home,
  Building2,
  Globe,
  PiggyBank,
  UserPlus,
  FileText,
  Calculator,
  CalendarClock,
  Clock,
  Receipt,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

/* ── Who needs to file a Self Assessment ──────────────────────── */
const WHO_NEEDS_TO_FILE = [
  { Icon: Briefcase, title: "Self-employed", desc: "Sole traders with trading income over £1,000 in the tax year." },
  { Icon: TrendingUp, title: "High earners", desc: "Anyone with income over £100,000, regardless of employment status." },
  { Icon: Home, title: "Landlords", desc: "Anyone receiving rental income from property in the UK or abroad." },
  { Icon: Building2, title: "Company directors", desc: "Directors who receive income (e.g. dividends) outside PAYE." },
  { Icon: Globe, title: "Foreign income", desc: "UK residents with income from overseas sources or foreign assets." },
  { Icon: PiggyBank, title: "Untaxed income", desc: "Savings interest, dividends or other untaxed income above your allowances." },
];

/* ── Key deadlines (2025/26) ──────────────────────────────────── */
const DEADLINES = [
  {
    date: "5 Oct",
    label: "Register for Self Assessment",
    desc: "Register with HMRC if it's your first return. Miss this and you risk penalties before you've even filed.",
    Icon: UserPlus,
    accent: "from-[#8db74e] to-[#e0e48e]",
    critical: false,
  },
  {
    date: "31 Oct",
    label: "Paper return deadline",
    desc: "The deadline if you file on paper. Most people file online — it's simpler and buys three more months.",
    Icon: FileText,
    accent: "from-[#8db74e] to-[#cde3a3]",
    critical: false,
  },
  {
    date: "31 Jan",
    label: "Online filing + payment",
    desc: "The big one: online returns filed, any tax owed paid, plus your first payment on account for next year.",
    Icon: Calculator,
    accent: "from-[#c75f47] to-[#d9846f]",
    critical: true,
  },
  {
    date: "31 Jul",
    label: "Second payment on account",
    desc: "If HMRC has set payments on account, the second instalment is due — we'll tell you exactly what to pay.",
    Icon: CalendarClock,
    accent: "from-[#29484f] to-[#4a6a72]",
    critical: false,
  },
];

/* ── Common mistakes ──────────────────────────────────────────── */
const COMMON_MISTAKES = [
  { Icon: Clock, title: "Missing the deadline", desc: "An automatic £100 penalty hits the moment you miss 31 January — even if you owe nothing. It escalates fast: £10/day after 3 months, then 5% surcharges at 6 and 12 months." },
  { Icon: Receipt, title: "Forgetting expenses", desc: "Home office, mileage, subscriptions, equipment — missed allowable expenses mean paying more tax than you need to. We claim everything you're entitled to." },
  { Icon: Calculator, title: "Wrong income figures", desc: "Leaving out a source — rental income, savings interest, dividends, a side gig — is a common error that triggers HMRC enquiries and inaccuracy penalties." },
  { Icon: AlertTriangle, title: "Registering too late", desc: "Newly self-employed or with a new income source? You must register by 5 October after the tax year ends — late registration carries its own penalty." },
];

export default function WorkwellSaExtras() {
  return (
    <>
      {/* ── Who needs to file ────────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Do you need to file?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Who needs to complete a Self Assessment?
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              If any of these sound like you, HMRC expects a tax return. Not sure? That&apos;s exactly
              what we&apos;re here to check.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {WHO_NEEDS_TO_FILE.map((w) => (
              <div key={w.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-4">
                  <w.Icon size={22} />
                </span>
                <h3 className="font-bold text-[#29484f] mb-1.5">{w.title}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deadlines ────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">Key dates</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Self Assessment deadlines
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Miss any of these and HMRC applies automatic penalties — even if you owe nothing. We
              track every date for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {DEADLINES.map((d) => (
              <div
                key={d.date}
                className={`relative rounded-3xl border bg-[#f4f8ec] p-6 ${
                  d.critical ? "border-[#d9846f]/40 ring-1 ring-[#d9846f]/20" : "border-[#e4ecd6]"
                }`}
              >
                <div className={`h-1.5 -mt-6 -mx-6 mb-5 rounded-t-3xl bg-gradient-to-r ${d.accent}`} />
                {d.critical && (
                  <span className="absolute top-4 right-4 rounded-full bg-[#c75f47] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1">
                    Don&apos;t miss
                  </span>
                )}
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${d.critical ? "bg-[#d9846f]/15 text-[#c75f47]" : "bg-[#8db74e]/15 text-[#5f8a3e]"}`}>
                  <d.Icon size={20} />
                </span>
                <p className="text-2xl font-extrabold text-[#29484f] leading-none">{d.date}</p>
                <p className="text-sm font-bold text-[#29484f] mt-1.5 mb-2">{d.label}</p>
                <p className="text-[#5a6f74] text-xs leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common mistakes ──────────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#c75f47] font-bold text-sm uppercase tracking-wider">Avoid these</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Common Self Assessment mistakes
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              The slips that cost people money every year — all of them avoidable with a dedicated
              accountant in your corner.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {COMMON_MISTAKES.map((m) => (
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
              Let us handle your return <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
