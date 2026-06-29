import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  Check,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Video,
  Activity,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const font = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant D1 — "Aurora".
 *
 * Light, premium, modern SaaS. References: Stripe dashboard, Linear, Vercel,
 * Arc. White/neutral surface with a single restrained indigo accent and a
 * tasteful aurora glow on the hero card only. Fixes the live design's clutter:
 * progress shown ONCE, an inline booking slot-picker baked into the hero
 * (the #1 conversion action), one primary CTA per action, and a gentle nudge
 * tone instead of an alarming overdue banner.
 *
 * Static mockup — no "use client", no hooks. Slot pills are styled buttons
 * with one visually pre-selected.
 */
export default function PreviewD1() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  const slots = [
    { label: "Tue 14 May", time: "10:00" },
    { label: "Tue 14 May", time: "14:00" },
    { label: "Wed 15 May", time: "11:00" },
    { label: "Fri 17 May", time: "09:30" },
  ];
  const selectedSlot = 1; // visually pre-selected

  return (
    <div className={`${font.className} min-h-screen bg-[#fafafa] text-neutral-900`}>
      <PreviewBadge label="Aurora" prev="c3" next="d2" />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        {/* HEADER — compact app row: greeting + single small status */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              Good evening, {MOCK_FIRST_NAME}
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500">
              {s.accountName} · Clever Accounts
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <Sparkles size={12} /> Let&apos;s get this booked
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* HERO — "Up next" with inline slot picker + aurora glow */}
            <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {/* thin aurora top border */}
              <div className="h-1 w-full bg-gradient-to-r from-[#1A7A9B] via-[#2E8DAE] to-[#F97316]" />
              {/* faint blurred corner glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-10 h-44 w-44 rounded-full bg-orange-400/20 blur-3xl"
              />

              <div className="relative px-6 py-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Video size={15} />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Up next
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                  {s.nextActionLabel}
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral-600">
                  A 30-minute hands-on walk-through covering invoices, expenses,
                  salary and bank feeds. Pick a slot below — booking takes one
                  tap.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> 30 min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Video size={12} /> Video call
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} /> with {a.name}
                  </span>
                </div>

                {/* INLINE SLOT PICKER */}
                <div className="mt-5">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {slots.map((slot, i) => {
                      const isSel = i === selectedSlot;
                      return (
                        <button
                          key={`${slot.label}-${slot.time}`}
                          type="button"
                          className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition ${
                            isSel
                              ? "border-orange-600 bg-orange-50 ring-2 ring-orange-600/20"
                              : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          <span
                            className={`text-[11px] font-medium ${
                              isSel ? "text-orange-600" : "text-neutral-500"
                            }`}
                          >
                            {slot.label}
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              isSel ? "text-orange-700" : "text-neutral-900"
                            }`}
                          >
                            {slot.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={a.calendlyUrl ?? "#"}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-700"
                    >
                      Confirm Tue 14 May, 14:00
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      href={a.calendlyUrl ?? "#"}
                      className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
                    >
                      See all times →
                    </Link>
                  </div>
                </div>

                {/* warm one-liner from Charlie */}
                <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-neutral-50 px-3.5 py-3">
                  {a.photoUrl && (
                    <Image
                      src={a.photoUrl}
                      width={28}
                      height={28}
                      alt={a.name ?? ""}
                      className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                    />
                  )}
                  <p className="text-xs text-neutral-600">
                    <span className="font-medium text-neutral-900">
                      {a.name?.split(" ")[0]}:
                    </span>{" "}
                    &ldquo;Happy to walk you through everything — pick whatever
                    suits and I&apos;ll see you then.&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* TASKS — clean list, one action each */}
            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900">
                    Tasks
                  </span>
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
                    {s.tasks.length}
                  </span>
                </div>
                <span className="text-xs font-medium text-neutral-400">
                  View all
                </span>
              </div>
              <ul className="divide-y divide-neutral-100">
                {s.tasks.map((t) => {
                  const needsYou = t.state === "in_progress";
                  return (
                    <li
                      key={t.key}
                      className="group flex items-center gap-3 px-5 py-4 transition hover:bg-neutral-50"
                    >
                      <div
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                          needsYou
                            ? "border-2 border-orange-500 bg-orange-50"
                            : "border-2 border-neutral-300"
                        }`}
                      >
                        {needsYou && (
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-neutral-900">
                          {t.title}
                        </div>
                        <div className="truncate text-xs text-neutral-500">
                          {t.state === "awaiting_us"
                            ? "Awaiting Clever Accounts — no action needed"
                            : t.description}
                        </div>
                      </div>
                      {needsYou ? (
                        <span className="hidden rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 sm:inline">
                          Needs you
                        </span>
                      ) : (
                        <span className="hidden rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 sm:inline">
                          Pending us
                        </span>
                      )}
                      <ChevronRight
                        size={15}
                        className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600"
                      />
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* RECENT ACTIVITY — slim feed */}
            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3.5">
                <Activity size={14} className="text-neutral-400" />
                <span className="text-sm font-semibold text-neutral-900">
                  Recent activity
                </span>
              </div>
              <ul className="divide-y divide-neutral-100">
                {[
                  {
                    when: "Today, 14:32",
                    what: "Identity verification email sent",
                    who: "Credas",
                    icon: AlertCircle,
                    color: "text-orange-500",
                  },
                  {
                    when: "Yesterday, 11:00",
                    what: "Main call completed",
                    who: "Charlie McAuley",
                    icon: CheckCircle2,
                    color: "text-emerald-500",
                  },
                  {
                    when: "30 Mar, 10:00",
                    what: "Welcome call completed",
                    who: "Charlie McAuley",
                    icon: CheckCircle2,
                    color: "text-emerald-500",
                  },
                ].map((row, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-neutral-50"
                  >
                    <row.icon
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${row.color}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-neutral-900">{row.what}</div>
                      <div className="text-xs text-neutral-500">{row.who}</div>
                    </div>
                    <div className="flex-shrink-0 text-xs text-neutral-400">
                      {row.when}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* RIGHT RAIL */}
          <aside className="space-y-6">
            {/* Accountant chip */}
            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Your accountant
              </div>
              <div className="flex items-center gap-3">
                {a.photoUrl && (
                  <Image
                    src={a.photoUrl}
                    width={48}
                    height={48}
                    alt={a.name ?? ""}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-neutral-900">
                    {a.name}
                  </div>
                  <div className="truncate text-xs text-neutral-500">
                    Replies in ~2 hours · Mon–Fri 9–5
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-orange-700"
                >
                  <Calendar size={12} /> Book
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <MessageSquare size={12} /> Message
                </button>
              </div>
            </section>

            {/* Progress stat — shown ONCE */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Onboarding
                </span>
                <span className="text-xs text-neutral-400">
                  Stage {s.stageNumber} of {s.totalStages}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-neutral-900">
                  {pct}
                </span>
                <span className="text-base text-neutral-400">%</span>
                <span className="ml-auto text-xs text-neutral-500">
                  {completed} of {s.totalStages} done
                </span>
              </div>
              {/* slim segmented bar */}
              <div className="mt-3 flex gap-1">
                {s.stages.map((st) => (
                  <div
                    key={st.key}
                    title={st.title}
                    className={`h-1.5 flex-1 rounded-full ${
                      st.state === "complete"
                        ? "bg-[#1A7A9B]"
                        : st.state === "current"
                          ? "bg-orange-500"
                          : "bg-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2.5 text-xs text-neutral-500">
                You&apos;re on{" "}
                <span className="font-medium text-neutral-700">
                  {s.stageTitle}
                </span>
                .
              </p>
            </section>

            {/* Stages list — compact */}
            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-100 px-5 py-3.5">
                <span className="text-sm font-semibold text-neutral-900">
                  Your stages
                </span>
              </div>
              <ol className="divide-y divide-neutral-100">
                {s.stages.map((st) => (
                  <li
                    key={st.key}
                    className="flex items-center gap-3 px-5 py-2.5"
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        st.state === "complete"
                          ? "bg-[#1A7A9B] text-white"
                          : st.state === "current"
                            ? "border-2 border-orange-500 bg-orange-50 text-orange-700"
                            : "border border-neutral-200 bg-white text-neutral-400"
                      }`}
                    >
                      {st.state === "complete" ? (
                        <Check size={10} strokeWidth={3} />
                      ) : (
                        st.stageNumber
                      )}
                    </span>
                    <span
                      className={`flex-1 text-sm ${
                        st.state === "upcoming"
                          ? "text-neutral-400"
                          : st.state === "current"
                            ? "font-semibold text-neutral-900"
                            : "text-neutral-700"
                      }`}
                    >
                      {st.title}
                    </span>
                    {st.state === "complete" && st.completedDate && (
                      <span className="text-xs text-neutral-400">
                        {formatDate(st.completedDate)}
                      </span>
                    )}
                    {st.state === "current" && (
                      <span className="text-xs font-medium text-orange-600">
                        Now
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PreviewBadge({
  label,
  next,
  prev,
}: {
  label: string;
  next: string;
  prev: string;
}) {
  return (
    <div className="border-b border-neutral-200 bg-white px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="font-mono font-semibold text-neutral-700">
          Preview · {label}
        </span>
        <div className="flex gap-3">
          <Link
            href={`/portal/preview/${prev}`}
            className="text-neutral-600 underline"
          >
            ← {prev.toUpperCase()}
          </Link>
          <Link href="/portal/preview" className="text-neutral-600 underline">
            index
          </Link>
          <Link
            href={`/portal/preview/${next}`}
            className="text-neutral-600 underline"
          >
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
