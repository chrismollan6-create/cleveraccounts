import Image from "next/image";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import {
  Calendar,
  MessageSquare,
  Check,
  Mail,
  ShieldCheck,
  FileText,
  ChevronRight,
  CircleAlert,
  Activity,
  Briefcase,
  Hash,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const font = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

/**
 * Variant C3 — "Vercel dashboard" (data-dense app, no photo).
 *
 * Single-page-app density. Breadcrumb header, key-metric row, then sections
 * of useful information: next action, journey timeline, task list, activity
 * feed, business meta. Like opening Vercel's project page or Pitch's boards
 * view — packed with useful info, every pixel doing work.
 *
 * Accountant photo: 28px avatar chip in a status row. That's all.
 *
 * Reference points: vercel.com dashboard, linear.app issues view, pitch
 * boards, stripe atlas dashboard, planetscale console.
 */
export default function PreviewC3() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className={`${font.className} min-h-screen bg-white`}>
      <PreviewBadge variant="C3" label="Vercel dashboard" next="c1" prev="c2" />

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* BREADCRUMB HEADER — Vercel style */}
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="text-neutral-500">{s.accountName}</span>
          <ChevronRight size={12} className="text-neutral-300" />
          <span className="font-medium text-neutral-900">Onboarding</span>
        </div>
        <div className="flex items-end justify-between border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Hi {MOCK_FIRST_NAME}
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500">
              You&apos;re on Stage {s.stageNumber} of {s.totalStages} ·{" "}
              <span className="text-neutral-900">{s.stageTitle}</span>
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {a.photoUrl && (
              <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-2.5 py-1.5 ring-1 ring-neutral-200">
                <Image
                  src={a.photoUrl}
                  width={20}
                  height={20}
                  alt={a.name ?? ""}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <span className="text-xs text-neutral-700">
                  with <span className="font-medium text-neutral-900">{a.name}</span>
                </span>
              </div>
            )}
            <button className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800">
              Book training
            </button>
          </div>
        </div>

        {/* METRIC ROW — 4 KPIs but USEFUL ones */}
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-neutral-200 ring-1 ring-neutral-200 sm:grid-cols-4">
          <MetricCell label="Onboarding" value={`${pct}%`} sub={`${completed}/${s.totalStages} stages`} accent="emerald" />
          <MetricCell label="Days with us" value={String(s.daysSinceSignup)} sub="since 29 Mar" />
          <MetricCell label="Next call" value="Not booked" sub="36 days overdue" accent="amber" />
          <MetricCell label="Tasks open" value={String(s.tasks.filter(t => t.state !== "complete" && t.state !== "awaiting_us").length)} sub={`${s.tasks.filter(t => t.state === "awaiting_us").length} awaiting us`} />
        </div>

        {/* MAIN 2-COL LAYOUT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* NEXT ACTION — compact functional card */}
            <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <CircleAlert size={12} className="text-amber-500" />
                  <span className="text-xs font-medium text-neutral-900">
                    Action needed
                  </span>
                </div>
                <span className={`${mono.className} text-xs text-neutral-500`}>
                  STAGE_03
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-base font-semibold text-neutral-900">
                  {s.nextActionLabel}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  30-min walk-through covering invoices, expenses, salary. Pick a slot:
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {["Tue 14 · 10:00", "Tue 14 · 14:30", "Wed 15 · 11:00", "Fri 17 · 09:30"].map((slot) => (
                    <button
                      key={slot}
                      className="rounded border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  See all available times →
                </Link>
              </div>
            </section>

            {/* JOURNEY TIMELINE — horizontal stepper widget */}
            <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-2.5">
                <span className="text-xs font-medium text-neutral-900">
                  Onboarding journey
                </span>
                <span className={`${mono.className} text-xs text-neutral-500`}>
                  {completed} / {s.totalStages}
                </span>
              </div>
              <div className="px-6 pb-6 pt-8">
                <div className="relative">
                  <div className="absolute left-0 right-0 top-3 h-0.5 bg-neutral-100" />
                  <div
                    className="absolute left-0 top-3 h-0.5 bg-neutral-900 transition-all"
                    style={{ width: `${(completed / (s.totalStages - 1)) * 100}%` }}
                  />
                  <ol className="relative grid grid-cols-6 gap-2">
                    {s.stages.map((st) => (
                      <li key={st.key} className="text-center">
                        <div className="mx-auto flex justify-center">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-white ${
                              st.state === "complete"
                                ? "bg-neutral-900 text-white"
                                : st.state === "current"
                                  ? "border-2 border-neutral-900 bg-white text-neutral-900"
                                  : "border border-neutral-200 bg-white text-neutral-400"
                            }`}
                          >
                            {st.state === "complete" ? (
                              <Check size={11} strokeWidth={3} />
                            ) : (
                              st.stageNumber
                            )}
                          </span>
                        </div>
                        <div
                          className={`mt-2.5 text-xs font-medium ${st.state === "upcoming" ? "text-neutral-400" : "text-neutral-900"}`}
                        >
                          {st.title}
                        </div>
                        {st.state === "complete" && st.completedDate && (
                          <div className={`${mono.className} mt-0.5 text-[10px] text-neutral-400`}>
                            {formatDate(st.completedDate)}
                          </div>
                        )}
                        {st.state === "current" && (
                          <div className={`${mono.className} mt-0.5 text-[10px] font-semibold text-amber-600`}>
                            CURRENT
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* TASKS — real app list */}
            <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-2.5">
                <span className="text-xs font-medium text-neutral-900">Tasks</span>
                <span className={`${mono.className} text-xs text-neutral-500`}>
                  {s.tasks.length} TOTAL
                </span>
              </div>
              <ul className="divide-y divide-neutral-100">
                {s.tasks.map((t) => (
                  <li
                    key={t.key}
                    className="group flex items-center gap-3 px-4 py-3 hover:bg-neutral-50"
                  >
                    <div
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
                        t.state === "awaiting_us"
                          ? "bg-neutral-100 text-neutral-500"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.key === "engagement_letter" ? <FileText size={13} /> : <ShieldCheck size={13} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-neutral-900">{t.title}</div>
                      <div className="text-xs text-neutral-500">
                        {t.state === "awaiting_us"
                          ? "Awaiting Clever Accounts · we'll email shortly"
                          : "Check your email for the verification link"}
                      </div>
                    </div>
                    <span
                      className={`${mono.className} rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        t.state === "awaiting_us"
                          ? "bg-neutral-100 text-neutral-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.state === "awaiting_us" ? "PENDING_US" : "NEEDS_YOU"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ACTIVITY FEED — Linear-style */}
            <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-neutral-500" />
                  <span className="text-xs font-medium text-neutral-900">Activity</span>
                </div>
                <button className="text-xs text-neutral-500 hover:text-neutral-900">
                  View all
                </button>
              </div>
              <ul className="divide-y divide-neutral-100">
                {[
                  { when: "Today 14:32", what: "Identity verification email sent", who: "Credas" },
                  { when: "Yesterday 11:00", what: "Main onboarding call completed", who: "Charlie McAuley" },
                  { when: "30 Mar 10:00", what: "Welcome call completed", who: "Charlie McAuley" },
                  { when: "29 Mar 16:48", what: "Account created", who: "Self-signup" },
                ].map((row, i) => (
                  <li key={i} className="flex items-center gap-4 px-4 py-2.5">
                    <span className={`${mono.className} w-32 flex-shrink-0 text-xs text-neutral-400`}>
                      {row.when}
                    </span>
                    <span className="flex-1 text-sm text-neutral-900">{row.what}</span>
                    <span className="text-xs text-neutral-500">{row.who}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* RIGHT — narrow rail */}
          <aside className="space-y-4">
            {/* CONTACT — small compact card */}
            <section className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Get in touch
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                {a.photoUrl && (
                  <Image
                    src={a.photoUrl}
                    width={32}
                    height={32}
                    alt={a.name ?? ""}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-neutral-900">
                    {a.name}
                  </div>
                  <div className="truncate text-xs text-neutral-500">
                    Senior accountant
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <button className="flex w-full items-center justify-between rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={12} /> Book a call
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-900 transition hover:border-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare size={12} /> Send a message
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-900 transition hover:border-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={12} /> Email Charlie
                  </span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </section>

            {/* BUSINESS META — Vercel-style key/value list */}
            <section className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500">
                <Briefcase size={11} /> Business
              </div>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-500">Name</dt>
                  <dd className="font-medium text-neutral-900 text-right">
                    {s.accountName}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-500">Brand</dt>
                  <dd className="font-medium text-neutral-900">Clever Accounts</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-500">Joined</dt>
                  <dd className={`${mono.className} text-neutral-900`}>2026-03-29</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-500">Workflow</dt>
                  <dd className={`${mono.className} text-neutral-700`}>
                    <Hash size={9} className="inline" />027ApV
                  </dd>
                </div>
              </dl>
            </section>

            {/* HELP — quick links */}
            <section className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Quick links
              </div>
              <div className="space-y-1">
                {["Engagement letter FAQ", "Identity verification help", "Portal walkthrough video", "Contact support"].map((l) => (
                  <Link
                    key={l}
                    href="#"
                    className="flex items-center justify-between rounded px-2 py-1.5 text-xs text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <span>{l}</span>
                    <ChevronRight size={11} className="text-neutral-400" />
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "emerald" | "amber";
}) {
  const accentColor =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "amber"
        ? "text-amber-600"
        : "text-neutral-900";
  return (
    <div className="bg-white px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold tracking-tight ${accentColor}`}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-neutral-500">{sub}</div>}
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
    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs">
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
