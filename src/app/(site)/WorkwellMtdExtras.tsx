"use client";

import Link from "next/link";
import {
  FolderOpen,
  Send,
  FileCheck2,
  HardHat,
  Search,
  Settings,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/* ── What is MTD — the three obligations ──────────────────────── */
const MTD_WHAT = [
  { Icon: FolderOpen, title: "Keep digital records", desc: "Record income and expenses digitally using MTD-compatible software — no spreadsheets or shoeboxes." },
  { Icon: Send, title: "Send quarterly updates", desc: "Submit a summary of income and expenses to HMRC every three months, instead of one annual return." },
  { Icon: FileCheck2, title: "File a final declaration", desc: "Confirm your figures after the tax year ends to finalise your tax — this replaces the old Self Assessment." },
];

/* ── Timeline — who's captured and when ───────────────────────── */
const MTD_TIMELINE = [
  { date: "April 2026", dot: "£50k", threshold: "£50,000+", note: "Self-employed and landlords with qualifying income over £50,000 come in first." },
  { date: "April 2027", dot: "£30k", threshold: "£30,000+", note: "The threshold drops to £30,000 — many more sole traders and landlords." },
  { date: "April 2028", dot: "£20k", threshold: "£20,000+", note: "Drops again to £20,000 — by now most self-employed people are in scope." },
];

/* ── The quarterly cycle (standard periods) ───────────────────── */
const MTD_QUARTERS = [
  { q: "Quarter 1", period: "6 Apr – 5 Jul", due: "7 August" },
  { q: "Quarter 2", period: "6 Jul – 5 Oct", due: "7 November" },
  { q: "Quarter 3", period: "6 Oct – 5 Jan", due: "7 February" },
  { q: "Quarter 4", period: "6 Jan – 5 Apr", due: "7 May" },
];

/* ── What we do ───────────────────────────────────────────────── */
const MTD_WE_DO = [
  { Icon: Search, title: "Check if you're caught", desc: "We work out whether — and when — MTD applies to you based on your income, so there are no nasty surprises." },
  { Icon: Settings, title: "Set up the software", desc: "We get you onto FreeAgent (MTD-compatible) and set up your digital records properly from day one." },
  { Icon: Send, title: "Prepare & file your quarters", desc: "We prepare and submit each quarterly update to HMRC, on time, from your digital records." },
  { Icon: CalendarCheck, title: "Handle your final declaration", desc: "We finalise your year-end position and submit the final declaration that replaces Self Assessment." },
];

export default function WorkwellMtdExtras() {
  return (
    <>
      {/* ── What is MTD ──────────────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">The basics</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              What is Making Tax Digital?
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              MTD is HMRC&apos;s move to digital tax. Instead of one annual return, you keep digital
              records and report to HMRC through the year. MTD for VAT is already mandatory — MTD for
              Income Tax is now rolling out for the self-employed and landlords.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MTD_WHAT.map((m) => (
              <div key={m.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-4">
                  <m.Icon size={22} />
                </span>
                <h3 className="font-bold text-[#29484f] mb-1.5">{m.title}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline — who & when ────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">The timeline</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              When MTD applies — and to whom
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              It&apos;s based on your <em>qualifying income</em> — gross income from self-employment
              and property, before expenses. The threshold steps down each year.
            </p>
          </div>
          {/* Connected stepping-down timeline */}
          <div className="relative max-w-5xl mx-auto">
            {/* track line (desktop) — runs between the milestone nodes */}
            <div className="hidden md:block absolute left-[16.66%] right-[16.66%] top-[68px] h-1 rounded-full bg-gradient-to-r from-[#8db74e] via-[#8db74e] to-[#29484f]" />
            <div className="grid md:grid-cols-3 gap-y-8 gap-x-6">
              {MTD_TIMELINE.map((t) => (
                <div key={t.date} className="relative flex flex-col items-center text-center">
                  <p className="text-sm font-extrabold uppercase tracking-wider text-[#5f8a3e] mb-3">{t.date}</p>
                  <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-[#29484f] border-4 border-white shadow-lg shadow-[#29484f]/20 flex items-center justify-center">
                    <span className="font-extrabold text-lg text-[#e0e48e]">{t.dot}</span>
                  </div>
                  <div className="mt-5 w-full rounded-3xl border border-[#e4ecd6] bg-[#f4f8ec] p-5">
                    <p className="text-xl font-extrabold text-[#29484f]">{t.threshold}<span className="text-sm font-semibold text-[#6a7b80]"> income</span></p>
                    <p className="text-[#5a6f74] text-sm leading-relaxed mt-1.5">{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-[#6a7b80] text-sm mt-8 max-w-2xl mx-auto">
            VAT-registered? MTD for VAT already applies to you. Partnerships and companies follow in
            later phases. Contracting via your own limited company? Salary and dividends aren&apos;t
            &apos;qualifying income&apos; — but any sole-trade or rental income is.
          </p>
        </div>
      </section>

      {/* ── CIS subcontractors — you'll be caught too ────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#15282d] to-[#1c333a] py-16 md:py-20">
        <div className="absolute -top-16 right-1/4 w-72 h-72 bg-[#8db74e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-[#e0e48e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex items-center gap-4 shrink-0">
              <span className="w-16 h-16 rounded-2xl bg-[#8db74e] text-white flex items-center justify-center shadow-lg shadow-[#8db74e]/30">
                <HardHat size={32} />
              </span>
            </div>
            <div className="flex-1">
              <span className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.18em]">On CIS? Read this</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2 mb-4">
                CIS subcontractors — remember, you&apos;ll be caught too
              </h2>
              <ul className="space-y-3 text-white/80 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#bce26a] shrink-0 mt-1" />
                  <span>You&apos;re <strong className="text-white">self-employed</strong>, so you&apos;re squarely in scope for MTD for Income Tax — exactly like any other sole trader.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#bce26a] shrink-0 mt-1" />
                  <span>Your qualifying income is measured <strong className="text-white">gross — before the 20% or 30% CIS deduction</strong>. So you&apos;ll hit the £50k / £30k / £20k thresholds sooner than you might expect.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#bce26a] shrink-0 mt-1" />
                  <span>We handle your <strong className="text-white">CIS and MTD together</strong> — digital records, quarterly updates and your year-end reclaim, all in one place.</span>
                </li>
              </ul>
              <Link
                href="/cis-accounting"
                className="inline-flex items-center gap-2 mt-6 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                See our CIS accounting <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── The quarters ─────────────────────────────────────────── */}
      <section className="bg-[#f4f8ec] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">The quarterly cycle</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              The quarters that matter
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              Four updates a year, each due roughly a month after the quarter ends, then a final
              declaration. We track every date.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {MTD_QUARTERS.map((q) => (
              <div key={q.q} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#5f8a3e] mb-2">{q.q}</p>
                <p className="text-lg font-extrabold text-[#29484f] leading-tight">{q.period}</p>
                <p className="text-sm text-[#5a6f74] mt-2">Update due <span className="font-semibold text-[#29484f]">{q.due}</span></p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#5a6f74] text-sm mt-6">
            Plus a <strong className="text-[#29484f]">final declaration by 31 January</strong> after the
            tax year — this replaces your annual Self Assessment.
          </p>
        </div>
      </section>

      {/* ── What we do (MTD is an add-on service) ────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-[#5f8a3e] font-bold text-sm uppercase tracking-wider">How we help</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#29484f] mt-3">
              How we get you MTD-ready
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg max-w-2xl mx-auto">
              From working out whether you&apos;re caught to filing every quarter, we take the whole
              thing off your plate.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {MTD_WE_DO.map((m) => (
              <div key={m.title} className="rounded-3xl border border-[#e4ecd6] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)]">
                <span className="w-11 h-11 rounded-2xl bg-[#8db74e]/15 text-[#5f8a3e] flex items-center justify-center mb-4">
                  <m.Icon size={22} />
                </span>
                <h3 className="font-bold text-[#29484f] mb-1.5">{m.title}</h3>
                <p className="text-[#5a6f74] text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Add-on pricing note + CTA */}
          <div className="relative overflow-hidden mt-10 max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#29484f] via-[#29484f] to-[#16282d] p-8 md:p-10 ring-1 ring-[#8db74e]/40 shadow-2xl shadow-[#29484f]/40">
            <div className="absolute -top-16 right-0 w-72 h-72 bg-[#8db74e]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-7 text-center lg:text-left">
              <div>
                <p className="text-[#e0e48e] font-extrabold text-xs uppercase tracking-[0.18em] mb-3 flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles size={15} /> Clear, upfront pricing
                </p>
                <p className="text-white text-xl md:text-2xl font-extrabold leading-snug max-w-2xl">
                  MTD quarterly filing is an add-on to your monthly fee — and we&apos;ll quote it clearly
                  before you commit.
                </p>
                <p className="text-white/75 mt-3 text-sm md:text-base flex items-start gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={17} className="text-[#bce26a] shrink-0 mt-0.5" />
                  Your FreeAgent software is included free; the extra quarterly submissions are the only
                  added cost. No surprises.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="shrink-0 inline-flex items-center gap-2 bg-[#8db74e] hover:bg-[#7ba63f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#8db74e]/30 transition-colors"
              >
                Get an MTD quote <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
