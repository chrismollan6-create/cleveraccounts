import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Handshake,
  MessageSquare,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import { getBrand } from "@/lib/brand";

// FreeAgent's own Co-Pilot programme page — used for the "what is Co-Pilot" link.
const COPILOT_URL = "https://www.freeagent.com/features/copilot/";

// Pricing — kept as constants so a rate change is a single edit.
const SOLE_TRADER_PRICE = "42.50";
const LTD_PRICE = "84.50";
const LTD_STANDARD_PRICE = "104.50";

// ── What each package includes ───────────────────────────────────
const soleTraderIncludes = [
  "Your own dedicated accountant",
  "Year-end sole trader accounts prepared & filed",
  "Self Assessment tax return filed with HMRC",
  "Bookkeeping reviews and proactive tax advice",
  "Free FreeAgent software included",
];

const limitedCompanyIncludes = [
  "Your own dedicated accountant",
  "Year-end accounts & corporation tax (CT600)",
  "Companies House confirmation statement filed",
  "Director payroll & Self Assessment included",
  "Free FreeAgent software included",
];

// ── Why FreeAgent users choose Clever Accounts ───────────────────
const whyUs = [
  {
    icon: Award,
    title: "FreeAgent Platinum Partner",
    desc: "The highest accreditation FreeAgent awards. Every one of our accountants is fully trained and certified on FreeAgent.",
  },
  {
    icon: Handshake,
    title: "On the Co-Pilot Panel",
    desc: "FreeAgent handpicked us as one of only a handful of accountancy firms it recommends directly to its own users.",
  },
  {
    icon: Clock,
    title: "One of Their Longest-Serving Partners",
    desc: "We've worked alongside FreeAgent for many years — one of the longest-standing accountancy partnerships they have.",
  },
  {
    icon: Users,
    title: "5,000+ FreeAgent Businesses",
    desc: "More than 5,000 sole traders and limited companies already run their accounting on FreeAgent with Clever Accounts.",
  },
];

// ── How taking over works ────────────────────────────────────────
const steps = [
  {
    num: "1",
    icon: Sparkles,
    title: "Choose Us in FreeAgent",
    desc: "Select Clever Accounts from the Co-Pilot panel inside your FreeAgent account and start an enquiry. That's the only step you need to take.",
  },
  {
    num: "2",
    icon: Handshake,
    title: "We Take Over Your Accounting",
    desc: "We become your accountant and link to your existing FreeAgent account as your Practice. We notify HMRC and, if you already have an accountant, handle a smooth handover for you.",
  },
  {
    num: "3",
    icon: BadgeCheck,
    title: "Nothing Changes in FreeAgent",
    desc: "You keep all your existing FreeAgent data, history and logins. The software you already know stays exactly the same — you simply gain a dedicated accountant behind it.",
  },
];

// ── FAQ ──────────────────────────────────────────────────────────
const faqs = [
  {
    q: "I'm a sole trader — what's included for £42.50+VAT?",
    a: "Everything a sole trader needs: your own dedicated accountant, year-end sole trader accounts, your Self Assessment tax return prepared and filed with HMRC, bookkeeping reviews, proactive tax advice, and FreeAgent software included free. One fixed monthly fee, with no setup costs.",
  },
  {
    q: "Who is the £84.50+VAT limited company rate for?",
    a: "It's an exclusive rate for non-VAT-registered limited companies who join Clever Accounts through FreeAgent. The vast majority of FreeAgent businesses we speak to aren't VAT registered, so we've built a package that reflects that — all the limited company accounting you need, without paying for VAT return work you don't.",
  },
  {
    q: "What if I'm VAT registered, or register later?",
    a: "If your business is VAT registered we'll quote our standard all-inclusive rate, which includes quarterly Making Tax Digital VAT returns. If you register for VAT after joining, we'll simply add VAT returns then — there are no penalties for switching, and no minimum contract.",
  },
  {
    q: "Will I lose my FreeAgent data if I switch to Clever Accounts?",
    a: "No. You keep your existing FreeAgent account, all its history, and your logins. We link to it as your accountancy Practice — the software is identical to what you use today. Nothing is migrated or lost.",
  },
  {
    q: "Do I still get FreeAgent for free?",
    a: "Yes. FreeAgent is included free for as long as you're a Clever Accounts client — there's no separate software subscription to pay. FreeAgent normally costs up to £33/month direct.",
  },
  {
    q: "Is there a setup fee or minimum contract?",
    a: "No setup fees and no minimum contract, ever. You stay with us because the service is good, not because you're locked in.",
  },
  {
    q: "How do I get started?",
    a: "If you use FreeAgent, you'll find Clever Accounts in the Co-Pilot panel inside your account — choose us there to start an enquiry. If you'd like to talk it through first, call our team and we'll happily answer any questions.",
  },
];

export default async function FreeAgentPage() {
  const brand = await getBrand();
  const telHref = `tel:${brand.freephone.replace(/\s/g, "")}`;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Award size={15} />
                FreeAgent Platinum Partner &amp; Co-Pilot Member
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                The Accountant{" "}
                <span className="text-gradient">FreeAgent Recommends</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Clever Accounts has worked hand in hand with FreeAgent for many
                years — as a Platinum Partner and a member of FreeAgent&apos;s
                Co-Pilot panel, the small group of accountancy firms FreeAgent
                recommends directly to its own users.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Over 5,000 businesses already run their books on FreeAgent with
                us, from sole traders to limited companies. Whichever way you
                work, we&apos;ll take over your accounting for one simple
                monthly fee.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                {[
                  { value: "5,000+", label: "FreeAgent businesses" },
                  { value: "Platinum", label: "FreeAgent partner status" },
                  { value: "20+", label: "Years of expertise" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-white">
                      {s.value}
                    </div>
                    <div className="text-white/50 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: pricing card */}
            <div className="bg-white rounded-3xl p-7 md:p-8 shadow-2xl border border-border">
              <div className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-bold mb-4">
                <Sparkles size={12} />
                FreeAgent Co-Pilot Pricing
              </div>
              <h2 className="text-xl font-black text-dark mb-1">
                All-Inclusive Accounting
              </h2>
              <p className="text-sm text-text-light mb-5">
                One fixed monthly fee, whichever way you work
              </p>

              {/* Sole trader tier */}
              <div className="flex items-center justify-between border border-border rounded-xl px-4 py-3 mb-3">
                <div>
                  <p className="font-bold text-dark text-sm">Sole Trader</p>
                  <p className="text-xs text-text-light">
                    All-inclusive accounting
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-dark">
                    £{SOLE_TRADER_PRICE}
                  </span>
                  <span className="text-xs text-text-light"> +VAT/mo</span>
                </div>
              </div>

              {/* Limited company tier — highlighted */}
              <div className="flex items-center justify-between bg-surface border border-secondary/40 rounded-xl px-4 py-3 mb-5">
                <div>
                  <p className="font-bold text-dark text-sm">
                    Limited Company
                  </p>
                  <p className="text-xs text-secondary-dark font-semibold">
                    Exclusive FreeAgent rate
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm text-text-light/60 line-through mr-1">
                    £{LTD_STANDARD_PRICE}
                  </span>
                  <span className="text-2xl font-black text-dark">
                    £{LTD_PRICE}
                  </span>
                  <span className="text-xs text-text-light"> +VAT/mo</span>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {[
                  "No setup fees — ever",
                  "FreeAgent software included free",
                  "Dedicated accountant from day one",
                  "No minimum contract",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2 text-sm text-text"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-success shrink-0"
                    />
                    {point}
                  </div>
                ))}
              </div>

              <div className="bg-surface border border-border rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-dark mb-0.5">
                  Already a FreeAgent user?
                </p>
                <p className="text-xs text-text-light">
                  Choose Clever Accounts from the Co-Pilot panel inside your
                  FreeAgent account — that&apos;s all it takes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-dark">
        <svg
          viewBox="0 0 1440 60"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── THE PARTNERSHIP ──────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: story */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                A Genuine FreeAgent Partnership
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
                Not Just a FreeAgent Accountant — One That FreeAgent Chose
              </h2>
              <p className="text-text/70 leading-relaxed mb-4">
                Plenty of accountants offer FreeAgent. Very few have the
                relationship with FreeAgent that Clever Accounts has. We&apos;re
                a <span className="font-semibold text-dark">Platinum
                Partner</span> — FreeAgent&apos;s highest accreditation — and
                one of the longest-serving accountancy partners FreeAgent has
                worked with.
              </p>
              <p className="text-text/70 leading-relaxed mb-4">
                That track record is why FreeAgent invited us onto its{" "}
                <span className="font-semibold text-dark">Co-Pilot
                panel</span>: a small, hand-selected group of accountancy firms
                FreeAgent recommends directly to its own users, right inside the
                FreeAgent app. It&apos;s an endorsement FreeAgent doesn&apos;t
                give lightly.
              </p>
              <p className="text-text/70 leading-relaxed mb-6">
                For you, that means an accountant who lives and breathes the
                software you already use — and a team FreeAgent itself trusts
                with its customers.
              </p>
              <a
                href={COPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
              >
                Learn about FreeAgent Co-Pilot <ArrowRight size={16} />
              </a>
            </div>

            {/* Right: badges */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 rounded-3xl p-8 text-center shadow-xl">
                <Award size={48} className="text-white mx-auto mb-4" />
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">
                  Official Status
                </p>
                <p className="text-white font-black text-2xl mb-1">
                  FreeAgent Platinum Partner
                </p>
                <p className="text-white/70 text-sm">
                  The highest accreditation awarded by FreeAgent
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Handshake, label: "Co-Pilot Panel Member" },
                  { icon: Clock, label: "One of the Longest-Serving" },
                  { icon: Users, label: "5,000+ FreeAgent Clients" },
                  { icon: Star, label: "Rated 4.7 on Trustpilot" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-white border border-border rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-semibold text-dark">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-white">
        <svg
          viewBox="0 0 1440 60"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z"
            fill="var(--color-surface, #f8f9fa)"
          />
        </svg>
      </div>

      {/* ── PRICING / THE OFFER ──────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Simple Pricing for FreeAgent Users
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              Sole Trader or Limited Company — One Fixed Monthly Fee
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              Whichever way you work, we look after everything for one
              all-inclusive monthly fee. And because most FreeAgent businesses
              we speak to aren&apos;t VAT registered, limited companies get an
              exclusive rate built around exactly that.
            </p>
          </div>

          {/* Pricing tiers */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            {/* Sole Trader */}
            <div className="bg-white border border-border rounded-3xl p-7 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <User size={24} />
              </div>
              <h3 className="text-xl font-black text-dark mb-1">Sole Trader</h3>
              <p className="text-sm text-text-light mb-5">
                All-inclusive accounting for sole traders
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black text-dark leading-none">
                  £{SOLE_TRADER_PRICE}
                </span>
                <span className="text-base text-text-light mb-1">
                  +VAT /mo
                </span>
              </div>
              <p className="text-xs text-text-light/70 mb-6">
                One fixed monthly fee, no setup costs
              </p>
              <ul className="space-y-2.5">
                {soleTraderIncludes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-text/80"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-success shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Limited Company — highlighted */}
            <div className="relative bg-white border-2 border-secondary rounded-3xl p-7 shadow-lg flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                EXCLUSIVE FREEAGENT RATE
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-black text-dark mb-1">
                Limited Company
              </h3>
              <p className="text-sm text-text-light mb-5">
                All-inclusive accounting for non-VAT-registered limited
                companies
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-2xl font-bold text-text-light/60 line-through decoration-2 mb-1">
                  £{LTD_STANDARD_PRICE}
                </span>
                <span className="text-5xl font-black text-dark leading-none">
                  £{LTD_PRICE}
                </span>
                <span className="text-base text-text-light mb-1">
                  +VAT /mo
                </span>
              </div>
              <p className="text-xs text-secondary-dark font-semibold mb-6">
                Save £240 a year vs our standard rate
              </p>
              <ul className="space-y-2.5">
                {limitedCompanyIncludes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-text/80"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-success shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-3 max-w-3xl mx-auto">
            <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-text/70 leading-relaxed">
              <span className="font-semibold text-dark">VAT registered?</span>{" "}
              The £{LTD_PRICE}+VAT limited company rate is for non-VAT-registered
              businesses. If you&apos;re VAT registered we&apos;ll quote our
              standard all-inclusive rate, which adds quarterly Making Tax
              Digital VAT returns — and if you register for VAT later, we simply
              add VAT returns then. No penalties, no minimum contract.
            </p>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-surface">
        <svg
          viewBox="0 0 1440 60"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Why FreeAgent Users Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              An Accountant Who Knows FreeAgent Inside Out
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              You&apos;ve already picked great software. Pair it with an
              accountant FreeAgent itself recommends.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-sm text-text/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-white">
        <svg
          viewBox="0 0 1440 60"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-dark py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
              Switching Is Effortless
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Keep Your FreeAgent. Gain a Dedicated Accountant.
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              There&apos;s no migration and no disruption. You carry on using
              the FreeAgent account you already have — we simply step in behind
              it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-white text-xs font-black flex items-center justify-center">
                    {num}
                  </div>
                </div>
                <h3 className="font-black text-white text-lg mb-3">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-dark">
        <svg
          viewBox="0 0 1440 60"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── TESTIMONIAL ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote size={40} className="text-primary/30 mx-auto mb-5" />
          <p className="text-xl md:text-2xl font-semibold text-dark leading-relaxed mb-6">
            &ldquo;I&apos;d used FreeAgent for years and loved it — I just
            needed an accountant who understood it as well as I did. Clever
            Accounts took over without me changing a thing. Same software, far
            less to worry about.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <p className="text-sm font-bold text-dark">James W.</p>
          <p className="text-xs text-text-light">
            Limited Company Director, FreeAgent user
          </p>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div className="bg-white">
        <svg
          viewBox="0 0 1440 60"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z"
            fill="var(--color-surface, #f8f9fa)"
          />
        </svg>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Good to Know
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-white border border-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-semibold text-dark hover:bg-surface transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {q}
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-90"
                  />
                </summary>
                <div className="px-5 pb-4 pt-1 text-sm text-text/70 leading-relaxed border-t border-border">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
            <Award size={40} className="text-white/80 mx-auto mb-4" />
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
              FreeAgent Co-Pilot Partner
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Put a Real Accountant Behind Your FreeAgent?
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Sole trader or limited company, if you use FreeAgent you&apos;ll
              find Clever Accounts in the{" "}
              <span className="font-bold">Co-Pilot panel</span> inside your
              account — start an enquiry there to get going. Got a question
              first? Our team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={COPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-4 rounded-xl border border-white/30 hover:bg-white/25 transition-all"
              >
                <MessageSquare size={20} />
                How FreeAgent Co-Pilot works
              </a>
              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
              >
                <Phone size={20} /> {brand.freephone}
              </a>
            </div>
            <p className="text-white/70 text-xs mt-6">
              Prefer to talk it through? Call us or{" "}
              <Link href="/contact" className="underline hover:text-white">
                send us a message
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
