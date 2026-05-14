import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Check,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  Building2,
  Sparkles,
  ChevronRight,
  Receipt,
  CreditCard,
  Smartphone,
  Banknote,
  PenLine,
  HandHeart,
  Laptop,
  Coffee,
  PartyPopper,
  Lightbulb,
  TrendingUp,
  Upload,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const font = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant C2 — "Mercury bento v2".
 *
 * User feedback on v1:
 *  1. Bar chart was meaningless decoration   → replaced with SVG ring/donut
 *  2. Lacked colour                           → brand-blue gradient hero,
 *                                               coloured icon backgrounds,
 *                                               accent stripes
 *  3. Stages widget felt thin                 → richer card: icon per stage,
 *                                               current stage expanded with
 *                                               description + duration
 *  4. Hero needed more context                → 5-bullet "what we'll cover",
 *                                               outcome panel, Charlie's note
 *
 * Plus zing additions:
 *  · Charlie online indicator (pulsing dot)
 *  · Smart-suggest pill on the hero
 *  · Velocity stat ("week 7 of 12, on track")
 *  · Documents-coming-up widget (Phase 2 teaser)
 *  · First-name copy throughout
 */

const STAGE_META: Record<
  string,
  { icon: typeof Sparkles; tint: string; duration: string; gist: string }
> = {
  welcome: {
    icon: HandHeart,
    tint: "rose",
    duration: "20 min",
    gist: "Meet Charlie, share what your business does, hear how Clever works.",
  },
  main: {
    icon: Coffee,
    tint: "amber",
    duration: "45 min",
    gist: "Map the year ahead — VAT, salary, accounts dates, what you need from us.",
  },
  portal: {
    icon: Laptop,
    tint: "blue",
    duration: "30 min",
    gist: "Hands-on walkthrough of expenses, invoices, salary, and bank feeds.",
  },
  checkin30: {
    icon: TrendingUp,
    tint: "emerald",
    duration: "20 min",
    gist: "Two-week check after portal training — make sure everything's clicked.",
  },
  checkin60: {
    icon: TrendingUp,
    tint: "emerald",
    duration: "20 min",
    gist: "Second check — close the loop on anything that's still fiddly.",
  },
  catchup: {
    icon: PartyPopper,
    tint: "violet",
    duration: "30 min",
    gist: "First quarterly review — your numbers, your goals, what to do next.",
  },
};

const TINT: Record<string, { bg: string; text: string; ring: string }> = {
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    ring: "ring-rose-200" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    ring: "ring-blue-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-200" },
};

export default function PreviewC2() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);
  const currentStage = s.stages.find((st) => st.state === "current");
  const currentMeta = currentStage ? STAGE_META[currentStage.key] : null;

  return (
    <div className={`${font.className} min-h-screen bg-neutral-100`}>
      <PreviewBadge variant="C2" label="Mercury bento" next="c3" prev="c1" />

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Good evening, {MOCK_FIRST_NAME}
            </h1>
            <span className="text-sm text-neutral-500">
              {s.accountName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-neutral-700 ring-1 ring-neutral-200">
              <Lightbulb size={11} className="text-amber-500" />
              Week 7 of 12 · on track
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Charlie online
            </span>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-12 gap-4">
          {/* ─── HERO NEXT-STEP — wide, colourful, contextual ─── */}
          <section className="relative col-span-12 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-md md:col-span-8">
            {/* Soft glows */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

            {/* Soft pattern of dots */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative p-7">
              {/* Top row */}
              <div className="mb-5 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  <Sparkles size={12} className="text-amber-300" />
                  Your next step · Stage {s.stageNumber}/{s.totalStages}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-300/30">
                  <Clock size={11} /> 36 days overdue
                </span>
              </div>

              {/* Title + why */}
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Book your portal training with Charlie.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
                A 30-minute hands-on walk-through that turns the portal from
                something you have an account on into something you actually
                use. Until this is done, the rest of onboarding stays paused.
              </p>

              {/* What we'll cover — 5 bullets */}
              <div className="mt-6 rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/70">
                  What we&apos;ll cover
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[
                    { icon: Receipt, label: "Logging expenses on the move" },
                    { icon: PenLine, label: "Raising invoices to clients" },
                    { icon: Banknote, label: "Paying yourself a salary" },
                    { icon: CreditCard, label: "Connecting your bank feeds" },
                    { icon: Smartphone, label: "Setting up the mobile app" },
                  ].map((row, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <row.icon
                        size={14}
                        className="text-cyan-300"
                        strokeWidth={2.2}
                      />
                      <span>{row.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charlie note */}
              {a.photoUrl && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] p-3">
                  <Image
                    src={a.photoUrl}
                    width={32}
                    height={32}
                    alt={a.name ?? ""}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div className="flex-1 text-sm">
                    <span className="font-semibold">{a.name?.split(" ")[0]}:</span>{" "}
                    <span className="text-white/85">
                      &ldquo;I&apos;ll record it so you can rewatch any bit
                      later. Most people get everything in one go.&rdquo;
                    </span>
                  </div>
                </div>
              )}

              {/* Smart-suggest pill */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-300/15 px-3 py-1.5 text-xs text-amber-100 ring-1 ring-amber-300/25">
                <Sparkles size={12} className="text-amber-300" />
                Most small businesses pick Tuesday afternoons. Charlie has
                2pm Tue 14 available.
              </div>

              {/* Time slot buttons */}
              <div className="mt-5">
                <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/70">
                  Pick a time
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { d: "Tue 14 May", t: "10:00" },
                    { d: "Tue 14 May", t: "14:00", suggest: true },
                    { d: "Wed 15 May", t: "11:00" },
                    { d: "Fri 17 May", t: "09:30" },
                  ].map((slot, i) => (
                    <button
                      key={i}
                      className={`relative rounded-lg border px-3.5 py-2 text-xs font-medium backdrop-blur transition ${
                        slot.suggest
                          ? "border-amber-300/60 bg-amber-300/15 text-amber-100 hover:bg-amber-300/25"
                          : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <span className="block opacity-70">{slot.d}</span>
                      <span className="block font-semibold">{slot.t}</span>
                      {slot.suggest && (
                        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-300 text-[8px] font-bold text-amber-900">
                          ★
                        </span>
                      )}
                    </button>
                  ))}
                  <Link
                    href={a.calendlyUrl ?? "#"}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-white/30 bg-transparent px-3 py-2 text-xs font-medium text-white/80 hover:border-white hover:text-white"
                  >
                    See all times <ArrowUpRight size={11} />
                  </Link>
                </div>
              </div>

              {/* Outcome panel */}
              <div className="mt-5 flex items-start gap-2.5 border-t border-white/15 pt-4 text-sm">
                <Check
                  size={14}
                  className="mt-0.5 flex-shrink-0 text-emerald-300"
                  strokeWidth={3}
                />
                <span className="text-white/80">
                  <span className="font-semibold text-white">After this call</span>{" "}
                  you&apos;ll be running expenses, invoices and salary on your
                  own — no spreadsheets, no late-night admin.
                </span>
              </div>
            </div>
          </section>

          {/* ─── PROGRESS — RING/DONUT chart, no bar chart ─── */}
          <section className="col-span-12 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:col-span-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Onboarding progress
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700">
                <TrendingUp size={10} /> +1 this week
              </span>
            </div>

            {/* Ring */}
            <div className="mt-3 flex items-center justify-center">
              <Ring pct={pct} />
            </div>

            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-neutral-900">
                {completed} of {s.totalStages} stages complete
              </div>
              <div className="text-xs text-neutral-500">
                4 to go · est. 8 weeks
              </div>
            </div>

            {/* Stage dots beneath */}
            <div className="mt-4 flex justify-center gap-1.5">
              {s.stages.map((st) => (
                <span
                  key={st.key}
                  className={`h-2 w-2 rounded-full ${
                    st.state === "complete"
                      ? "bg-emerald-500"
                      : st.state === "current"
                        ? "bg-blue-500 ring-2 ring-blue-200"
                        : "bg-neutral-200"
                  }`}
                  title={st.title}
                />
              ))}
            </div>
          </section>

          {/* ─── STAGES — richer widget, icons + current expanded ─── */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:col-span-8">
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">
                  Your six stages
                </span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
                  {completed}/{s.totalStages}
                </span>
              </div>
              <button className="text-xs font-medium text-neutral-500 hover:text-neutral-900">
                What happens in each? →
              </button>
            </div>

            <div>
              {s.stages.map((st) => {
                const meta = STAGE_META[st.key];
                if (!meta) return null;
                const tint = TINT[meta.tint];
                const Icon = meta.icon;
                const isCurrent = st.state === "current";
                const isComplete = st.state === "complete";

                return (
                  <div
                    key={st.key}
                    className={`relative flex gap-4 border-b border-neutral-100 px-5 py-4 last:border-b-0 ${
                      isCurrent ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* Stage icon tile */}
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${
                        isComplete
                          ? "bg-emerald-500 text-white ring-emerald-600"
                          : isCurrent
                            ? `${tint.bg} ${tint.text} ${tint.ring}`
                            : "bg-neutral-50 text-neutral-300 ring-neutral-200"
                      }`}
                    >
                      {isComplete ? (
                        <Check size={20} strokeWidth={3} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-sm font-semibold ${st.state === "upcoming" ? "text-neutral-500" : "text-neutral-900"}`}
                        >
                          {st.stageNumber}. {st.title}
                        </div>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            isComplete
                              ? "bg-emerald-100 text-emerald-700"
                              : isCurrent
                                ? "bg-blue-100 text-blue-700"
                                : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {isComplete
                            ? "Done"
                            : isCurrent
                              ? "Now"
                              : "Upcoming"}
                        </span>
                        <span className="ml-auto text-xs text-neutral-500">
                          {meta.duration}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-600">
                        {meta.gist}
                      </div>

                      {/* Current-stage expanded detail */}
                      {isCurrent && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Link
                            href={a.calendlyUrl ?? "#"}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                          >
                            Book this <ArrowUpRight size={11} />
                          </Link>
                          <span className="text-xs text-neutral-500">
                            Or pick a slot from the card above
                          </span>
                        </div>
                      )}

                      {/* Completed-stage date */}
                      {isComplete && st.completedDate && (
                        <div className="mt-1 text-xs text-emerald-600">
                          Completed {formatDate(st.completedDate)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── ACCOUNTANT — small avatar, stats, big actions ─── */}
          <section className="relative col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-6 md:col-span-4">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="mb-4 flex items-center gap-3">
              <div className="relative">
                {a.photoUrl && (
                  <Image
                    src={a.photoUrl}
                    width={40}
                    height={40}
                    alt={a.name ?? ""}
                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-white"
                  />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-neutral-500">
                  Your accountant
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  {a.name}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Replies typically</span>
                <span className="font-medium text-neutral-900">Within 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Working hours</span>
                <span className="font-medium text-neutral-900">Mon–Fri, 9–5</span>
              </div>
              <div className="flex justify-between">
                <span>Clients looked after</span>
                <span className="font-medium text-neutral-900">82</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-1.5">
              <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700">
                Book Charlie
              </button>
              <button className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:border-neutral-400">
                Message
              </button>
            </div>
          </section>

          {/* ─── TASKS ─── */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:col-span-6 md:col-span-4">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <span className="text-sm font-semibold text-neutral-900">Tasks</span>
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                1 needs you
              </span>
            </div>
            <ul className="divide-y divide-neutral-100">
              {s.tasks.map((t) => (
                <li
                  key={t.key}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50"
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      t.state === "awaiting_us"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {t.key === "engagement_letter" ? <FileText size={14} /> : <ShieldCheck size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-neutral-900">
                      {t.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {t.state === "awaiting_us"
                        ? "We'll send it shortly"
                        : "Check your email"}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-neutral-300" />
                </li>
              ))}
            </ul>
          </section>

          {/* ─── DOCUMENTS COMING UP (Phase 2 teaser) ─── */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:col-span-4">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Upload size={13} className="text-violet-500" />
                <span className="text-sm font-semibold text-neutral-900">
                  Documents coming up
                </span>
              </div>
              <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-700">
                Soon
              </span>
            </div>
            <ul className="divide-y divide-neutral-100">
              {[
                { t: "Photo ID", w: "Passport or driving licence" },
                { t: "Proof of address", w: "Bank statement or utility bill" },
                { t: "Last year's tax return", w: "Optional but useful" },
              ].map((d, i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <FileText size={12} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-neutral-900">{d.t}</div>
                    <div className="text-xs text-neutral-500">{d.w}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ─── ACTIVITY ─── */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:col-span-8">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <span className="text-sm font-semibold text-neutral-900">
                Recent activity
              </span>
              <button className="text-xs text-neutral-500 hover:text-neutral-900">
                All →
              </button>
            </div>
            <ul className="divide-y divide-neutral-100">
              {[
                { when: "Today, 14:32", what: "Identity verification email sent", who: "Credas", tint: "amber" },
                { when: "Yesterday, 11:00", what: "Main onboarding call completed", who: "Charlie", tint: "emerald" },
                { when: "30 Mar, 10:00", what: "Welcome call completed", who: "Charlie", tint: "emerald" },
                { when: "29 Mar, 16:48", what: "Account created", who: "You signed up", tint: "neutral" },
              ].map((row, i) => (
                <li key={i} className="flex items-center gap-4 px-4 py-2.5">
                  <span
                    className={`h-2 w-2 flex-shrink-0 rounded-full ${
                      row.tint === "amber"
                        ? "bg-amber-500"
                        : row.tint === "emerald"
                          ? "bg-emerald-500"
                          : "bg-neutral-300"
                    }`}
                  />
                  <span className="w-32 flex-shrink-0 text-xs text-neutral-500">
                    {row.when}
                  </span>
                  <span className="flex-1 text-sm text-neutral-900">{row.what}</span>
                  <span className="text-xs text-neutral-500">{row.who}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ─── BUSINESS META ─── */}
          <section className="col-span-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 text-white shadow-md md:col-span-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
              <Building2 size={12} /> Your business
            </div>
            <div className="mt-2 text-base font-semibold">{s.accountName}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-white/50">With us since</div>
                <div className="mt-0.5 text-sm font-medium">29 Mar 2026</div>
              </div>
              <div>
                <div className="text-white/50">Day</div>
                <div className="mt-0.5 text-sm font-medium">{s.daysSinceSignup}</div>
              </div>
              <div>
                <div className="text-white/50">Brand</div>
                <div className="mt-0.5 text-sm font-medium">Clever</div>
              </div>
              <div>
                <div className="text-white/50">Plan</div>
                <div className="mt-0.5 text-sm font-medium">Ltd Co</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/** SVG ring/donut chart — animates a stroke-dashoffset on render. */
function Ring({ pct }: { pct: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        {/* Track */}
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgb(229 229 229)"
          strokeWidth="10"
        />
        {/* Filled portion — gradient */}
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(34 197 94)" />
            <stop offset="100%" stopColor="rgb(59 130 246)" />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#ringG)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold tracking-tight text-neutral-900">
          {pct}
          <span className="text-base text-neutral-400">%</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          complete
        </div>
      </div>
    </div>
  );
}

function PreviewBadge({
  variant,
  label,
  next,
  prev,
}: {
  variant: string;
  label: string;
  next: string;
  prev: string;
}) {
  return (
    <div className="border-b border-neutral-200 bg-white px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="font-mono font-semibold text-neutral-700">
          Preview {variant} · {label}
        </span>
        <div className="flex gap-3">
          <Link href={`/portal/preview/${prev}`} className="text-neutral-600 underline">
            ← {prev.toUpperCase()}
          </Link>
          <Link href="/portal/preview" className="text-neutral-600 underline">
            index
          </Link>
          <Link href={`/portal/preview/${next}`} className="text-neutral-600 underline">
            {next.toUpperCase()} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
