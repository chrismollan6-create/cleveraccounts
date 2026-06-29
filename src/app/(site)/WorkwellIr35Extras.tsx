"use client";

import Link from "next/link";
import {
  BadgeCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Repeat,
  SlidersHorizontal,
  Link2,
  PoundSterling,
  Wrench,
  Building2,
  Briefcase,
  Info,
  ShieldCheck,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Inside vs Outside IR35
   Tax treatment grounded to the 2025/26 off-payroll rules.
   ───────────────────────────────────────────────────────────── */
const OUTSIDE_POINTS = [
  "Pay corporation tax (19–25%) then dividend tax",
  "Keep significantly more of your day rate",
  "Claim genuine business expenses against profit",
  "Control your own salary / dividend split",
  "Retain profit in the company for growth",
];

const INSIDE_POINTS = [
  "Full income tax + employee National Insurance",
  "Employer NI taken from your contract value first",
  "Can't claim most business expenses",
  "Salary only — no dividend option",
  "No employment rights (holiday, sick pay, etc.)",
];

/* ─────────────────────────────────────────────────────────────
   The IR35 status tests
   ───────────────────────────────────────────────────────────── */
const PRIMARY_TESTS = [
  {
    no: "01",
    Icon: Repeat,
    title: "Substitution",
    subtitle: "Can you send someone else?",
    desc: "A genuine, unfettered right to send a qualified substitute — one the client can't refuse — points strongly to outside IR35. The clause has to be real, not just words in the contract.",
    outside: "You can send a substitute without client approval",
    inside: "The client requires you, personally, to do the work",
  },
  {
    no: "02",
    Icon: SlidersHorizontal,
    title: "Control",
    subtitle: "Who controls how you work?",
    desc: "Outside IR35 you decide how, when and where the work gets done. Inside IR35 the client dictates your hours, location and methods — just like an employee.",
    outside: "You decide how and when to deliver the work",
    inside: "Client sets your hours, location and methods",
  },
  {
    no: "03",
    Icon: Link2,
    title: "Mutuality of obligation",
    subtitle: "Must work be offered and accepted?",
    desc: "Outside IR35 there's no obligation on the client to offer further work, or on you to accept it, beyond the current contract. An ongoing expectation of work looks employment-like.",
    outside: "No obligation beyond the current contract",
    inside: "Ongoing expectation of work, like a job",
  },
];

const SECONDARY_FACTORS = [
  { Icon: PoundSterling, title: "Financial risk", desc: "You risk your own money — fixing defects at your own cost and investing in the business." },
  { Icon: Wrench, title: "Equipment", desc: "You provide your own core equipment and tools rather than relying on the client's." },
  { Icon: Building2, title: "Part & parcel", desc: "You're not embedded in the client's org — no line management, perks or fixed role." },
  { Icon: Briefcase, title: "In business on your own account", desc: "You're free to take other clients, market your services and run a genuine business." },
];

export default function WorkwellIr35Extras() {
  return (
    <>
      {/* ── Inside vs Outside IR35 ────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">The core question</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Inside vs outside IR35 — what it means for you
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Your IR35 status is the single biggest factor in your take-home pay. Here&apos;s the
              difference — and you can see your own numbers in the calculator below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Outside */}
            <div className="flex flex-col rounded-3xl border-2 border-[#8db74e]/40 bg-white p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-12 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center shrink-0">
                  <BadgeCheck size={26} />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-[#29484f] leading-tight">Outside IR35</h3>
                  <p className="text-sm text-[#5f8a3e] font-semibold">More take-home, more flexibility</p>
                </div>
              </div>
              <p className="text-[#5a6f74] leading-relaxed mb-5">
                You&apos;re genuinely self-employed. You work through your own limited company (PSC),
                take a low salary plus dividends and pay corporation tax — keeping much more of your
                day rate.
              </p>
              <ul className="space-y-2.5 mt-auto">
                {OUTSIDE_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-[#29484f]">
                    <CheckCircle2 size={16} className="text-[#5f8a3e] shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Inside */}
            <div className="flex flex-col rounded-3xl border-2 border-[#d9846f]/30 bg-white p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-12 rounded-2xl bg-[#d9846f]/15 text-[#c75f47] flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-[#29484f] leading-tight">Inside IR35</h3>
                  <p className="text-sm text-[#c75f47] font-semibold">Taxed like an employee</p>
                </div>
              </div>
              <p className="text-[#5a6f74] leading-relaxed mb-5">
                HMRC treats you as an employee of your client. Your income is taxed through PAYE with
                full income tax and National Insurance — and employer NI comes out of your contract
                value before you&apos;re paid.
              </p>
              <ul className="space-y-2.5 mt-auto">
                {INSIDE_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-[#29484f]">
                    <AlertTriangle size={15} className="text-[#d9846f] shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Who decides — grounded note */}
          <div className="max-w-5xl mx-auto mt-6 rounded-2xl bg-white border border-[#e4ecd6] px-5 py-4 flex items-start gap-3">
            <span className="w-9 h-9 shrink-0 rounded-xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mt-0.5">
              <Info size={18} />
            </span>
            <p className="text-sm text-[#5a6f74] leading-relaxed">
              <strong className="text-[#29484f]">Who decides your status?</strong> For medium and
              large clients, the off-payroll rules make the <em>client</em> responsible for your
              status determination (SDS). For small clients it stays with your own company — and from
              April 2025 the small-company thresholds rose (turnover up to £15m, balance sheet up to
              £7.5m, up to 50 employees), so more contractors now self-determine again. Either way, we
              assess your position and back it up.
            </p>
          </div>
        </div>
      </section>

      {/* ── The IR35 tests ───────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">How status is decided</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              The key IR35 tests
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              It&apos;s your <em>actual working practices</em> that count — not just the contract.
              HMRC weighs these factors to decide whether you&apos;re really in business or effectively
              employed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRIMARY_TESTS.map((t) => (
              <div key={t.no} className="rounded-3xl border border-[#e4ecd6] bg-[#f4f8ec] p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center shrink-0">
                    <t.Icon size={22} />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-[#29484f] leading-tight">{t.title}</h3>
                    <p className="text-[#5f8a3e] text-xs font-semibold">{t.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-[#5a6f74] leading-relaxed mb-4">{t.desc}</p>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-start gap-2 bg-[#8db74e]/12 rounded-xl p-3">
                    <CheckCircle2 size={15} className="text-[#5f8a3e] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#46622a] font-medium">{t.outside}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#d9846f]/10 rounded-xl p-3">
                    <AlertTriangle size={15} className="text-[#c75f47] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#8a5246] font-medium">{t.inside}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary factors */}
          <h3 className="text-center text-lg font-extrabold text-[#29484f] mt-14 mb-7">
            And the factors that tip a borderline case
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {SECONDARY_FACTORS.map((f) => (
              <div key={f.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-5 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.14)]">
                <span className="w-10 h-10 rounded-xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-3">
                  <f.Icon size={19} />
                </span>
                <h4 className="font-bold text-[#29484f] text-sm mb-1.5">{f.title}</h4>
                <p className="text-[#5a6f74] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CEST / SDS note + CTA */}
          <div className="relative overflow-hidden mt-12 max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#29484f] via-[#29484f] to-[#16282d] p-8 md:p-10 ring-1 ring-[#8db74e]/40 shadow-2xl shadow-[#29484f]/40">
            <div className="absolute -top-16 right-0 w-72 h-72 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-7 text-center lg:text-left">
              <div>
                <p className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.18em] mb-3 flex items-center gap-2 justify-center lg:justify-start">
                  <ShieldCheck size={15} /> Get it right, and defend it
                </p>
                <p className="text-white text-xl md:text-2xl font-extrabold leading-snug max-w-2xl">
                  HMRC&apos;s CEST tool and your contract aren&apos;t enough on their own — your
                  working practices decide it.
                </p>
                <p className="text-white/70 mt-3 text-sm md:text-base">
                  We review your contract and day-to-day reality, and if a client&apos;s determination
                  is wrong you have 45 days to challenge it — we draft the case for you.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="shrink-0 inline-flex items-center gap-2 bg-[#8db74e] hover:bg-[#7ba63f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/30 transition-colors"
              >
                Protect your status <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
