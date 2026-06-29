"use client";

import Link from "next/link";
import {
  Clock,
  AlertTriangle,
  FileText,
  TrendingDown,
  Building2,
  Laptop,
  CheckCircle2,
  Minus,
  UserPlus,
  PhoneOutgoing,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
  MessageCircle,
  Monitor,
  PoundSterling,
  UserCheck,
  FileCheck2,
  Receipt,
  ShieldCheck,
  Tag,
} from "lucide-react";

/* ── Why people switch — the hidden cost of staying put ───────── */
const WHY_LEAVE = [
  { Icon: Clock, title: "Slow to respond", desc: "Emails unanswered for days, calls to voicemail. You're left chasing for basic facts about your own finances." },
  { Icon: AlertTriangle, title: "Missed deadlines", desc: "Late-filing notices and penalties you should never have received — because you were the one keeping track of dates." },
  { Icon: FileText, title: "No proactive advice", desc: "You hear from them once a year, if that. No tax planning, no guidance — just a bill and a set of accounts." },
  { Icon: TrendingDown, title: "Paying too much tax", desc: "Without proactive planning you're almost certainly not as tax-efficient as you could be. Every year is money you won't get back." },
  { Icon: Building2, title: "Traditional firm, traditional costs", desc: "Hourly billing and surprise invoices for 'extra work'. No fixed price, no certainty — the bill's always higher than expected." },
  { Icon: Laptop, title: "No decent software", desc: "PDFs and spreadsheets in the post. No real-time view, no app, no dashboard — no visibility into your numbers." },
];

/* ── How we compare ───────────────────────────────────────────── */
const COMPARE_ROWS = [
  { Icon: Zap, category: "Responsiveness", traditional: "Often 3–5 day replies", online: "Ticket-based, can be slow", ww: "Dedicated accountant, same-day" },
  { Icon: MessageCircle, category: "Advice", traditional: "Reactive — you ask, they answer", online: "Very limited advice", ww: "Proactive planning, unlimited advice" },
  { Icon: Monitor, category: "Software", traditional: "Manual, PDFs, spreadsheets", online: "Basic, sometimes included", ww: "FreeAgent included free" },
  { Icon: PoundSterling, category: "Pricing", traditional: "Hourly or unclear annual fee", online: "Low fee, limited scope", ww: "Fixed all-inclusive monthly price" },
  { Icon: UserCheck, category: "Dedicated accountant", traditional: "Often rotates between staff", online: "None", ww: "Your own, who knows your business" },
  { Icon: FileCheck2, category: "Year-end accounts", traditional: "Included (often slow)", online: "Often extra", ww: "Always included" },
  { Icon: Receipt, category: "VAT returns", traditional: "Usually extra", online: "Often extra", ww: "Always included" },
  { Icon: ShieldCheck, category: "MTD compliance", traditional: "Variable — many not ready", online: "Basic only", ww: "Full MTD support via FreeAgent" },
  { Icon: Tag, category: "Setup / switch fee", traditional: "Often charged", online: "Usually none", ww: "None — ever" },
];

/* ── The seamless switch ──────────────────────────────────────── */
const SWITCH_STEPS = [
  { Icon: UserPlus, title: "1. Sign up", desc: "Tell us a few details and pick your package. Takes minutes — no commitment to your current year-end." },
  { Icon: PhoneOutgoing, title: "2. We contact your old accountant", desc: "We request professional clearance and your records on your behalf — you skip the awkward conversation entirely." },
  { Icon: RefreshCw, title: "3. We move everything across", desc: "Records transferred, FreeAgent set up, and every HMRC & Companies House deadline mapped so nothing slips." },
  { Icon: CheckCircle2, title: "4. You're up and running", desc: "Meet your dedicated accountant. Benefits start from day one — typically switched within 2–4 weeks." },
];

export default function WorkwellSwitchExtras() {
  return (
    <>
      {/* ── Why switch — the hidden cost of staying ──────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#c75f47] font-bold text-sm uppercase tracking-wider">Why switch?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              The hidden cost of staying put
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Most people stay with a so-so accountant because switching feels like hassle. But
              staying has a price — in penalties, missed tax savings and wasted hours.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {WHY_LEAVE.map((w) => (
              <div key={w.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 rounded-2xl bg-[#d9846f]/12 text-[#c75f47] flex items-center justify-center mb-4">
                  <w.Icon size={22} />
                </span>
                <h3 className="font-bold text-[#29484f] mb-1.5">{w.title}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison vs the alternatives ───────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">How we compare</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              Workwell vs the alternatives
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              How a dedicated online accountant stacks up against a traditional high-street firm and a
              bargain-basement online service.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto pb-2">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="p-4 align-bottom"></th>
                  <th className="p-4 pb-5 align-bottom text-center text-sm font-bold text-[#8a948f]">Traditional firm</th>
                  <th className="p-4 pb-5 align-bottom text-center text-sm font-bold text-[#8a948f]">Online basic</th>
                  <th className="p-0 align-bottom">
                    <div className="bg-[#29484f] rounded-t-2xl px-5 py-4 text-center shadow-lg shadow-[#29484f]/20">
                      <Crown size={20} className="mx-auto mb-1 text-[#e0e48e]" />
                      <span className="block font-extrabold text-white text-base leading-tight">Workwell</span>
                      <span className="block text-[10px] uppercase tracking-wider text-[#e0e48e] font-bold mt-0.5">Best value</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r, i) => {
                  const last = i === COMPARE_ROWS.length - 1;
                  return (
                    <tr key={r.category} className="group">
                      <td className="py-3.5 pr-4 border-b border-[#e4ecd6] align-middle">
                        <span className="flex items-center gap-2.5 font-bold text-[#29484f] text-sm">
                          <span className="w-8 h-8 rounded-lg bg-[#8db74e]/12 text-[#5f8a3e] flex items-center justify-center shrink-0">
                            <r.Icon size={16} />
                          </span>
                          {r.category}
                        </span>
                      </td>
                      <td className="p-3.5 border-b border-[#e4ecd6] text-sm text-[#8a948f] align-top">
                        <span className="flex items-start gap-1.5"><Minus size={14} className="text-[#c2c9be] shrink-0 mt-0.5" />{r.traditional}</span>
                      </td>
                      <td className="p-3.5 border-b border-[#e4ecd6] text-sm text-[#8a948f] align-top">
                        <span className="flex items-start gap-1.5"><Minus size={14} className="text-[#c2c9be] shrink-0 mt-0.5" />{r.online}</span>
                      </td>
                      <td className={`p-3.5 text-sm font-semibold text-[#29484f] align-top bg-[#8db74e]/[0.08] border-x-2 border-[#8db74e]/40 ${last ? "rounded-b-2xl border-b-2" : ""}`}>
                        <span className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#5f8a3e] shrink-0 mt-0.5" />{r.ww}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── The seamless switch ──────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              We handle the whole switch
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              You don&apos;t lift a finger — and there&apos;s no gap in your tax obligations. We move
              you across from start to finish.
            </p>
          </div>

          {/* Connected steps */}
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-[36px] h-1 rounded-full bg-gradient-to-r from-[#8db74e] to-[#29484f]" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SWITCH_STEPS.map((s) => (
                <div key={s.title} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-[#29484f] border-4 border-[#f4f8ec] shadow-lg shadow-[#29484f]/20 flex items-center justify-center text-[#e0e48e]">
                    <s.Icon size={28} />
                  </div>
                  <div className="mt-5 w-full rounded-3xl border border-[#e4ecd6] bg-white p-5 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                    <h3 className="font-bold text-[#29484f] text-sm mb-1.5">{s.title}</h3>
                    <p className="text-[#5a6f74] text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No-fee close */}
          <div className="relative overflow-hidden mt-10 max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#1c333a] via-[#29484f] to-[#29484f] p-8 md:p-10 ring-1 ring-[#8db74e]/40 shadow-2xl shadow-[#29484f]/40">
            <div className="absolute -top-16 right-0 w-72 h-72 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-7 text-center lg:text-left">
              <div>
                <p className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.18em] mb-3 flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles size={15} /> No reason to wait
                </p>
                <p className="text-white text-xl md:text-2xl font-extrabold leading-snug max-w-2xl">
                  No setup fee, no switching fee, no minimum contract — and no gap in your filing.
                </p>
                <p className="text-white/70 mt-3 text-sm md:text-base">
                  Locked into a contract? We&apos;ll still get you ready to move the moment you&apos;re free.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="shrink-0 inline-flex items-center gap-2 bg-[#8db74e] hover:bg-[#7ba63f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/30 transition-colors"
              >
                Start your switch <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
