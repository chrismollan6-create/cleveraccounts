import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Check,
  Clock,
  ChevronRight,
  Sparkles,
  CircleDot,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const font = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant C1 — "Linear app".
 *
 * Reference: Linear's product app. Compact header bar with breadcrumb status,
 * sober greeting, then a sophisticated 2-column dashboard layout. Lots of
 * polish in spacing, typography hierarchy, hover states. Density-medium —
 * useful info on every screen, never feels empty. No hero photo, no magazine
 * type — this is software.
 *
 * Reference points: linear.app, vercel dashboard, height.app, notion 2026.
 */
export default function PreviewC1() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className={`${font.className} min-h-screen bg-[#fafafa]`}>
      <PreviewBadge variant="C1" label="Linear app" next="c2" prev="c" />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* HEADER BAR — compact app-style, not a magazine masthead */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              Good evening, {MOCK_FIRST_NAME}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
              <CircleDot size={10} /> Stage {s.stageNumber}/{s.totalStages}
            </span>
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-neutral-500 sm:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Encrypted · synced live
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Next action — compact, action-oriented, not theatrical */}
            <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Up next
                    </span>
                  </div>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Needs you
                  </span>
                </div>
              </div>
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                      {s.nextActionLabel}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">
                      A 30-minute walk-through covering invoices, expenses, and
                      salary. Pick a time that suits.
                    </p>
                  </div>
                  <Link
                    href={a.calendlyUrl ?? "#"}
                    className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                  >
                    Pick a time
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> ~30 min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} /> Times this week
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <AlertCircle size={12} className="text-amber-600" />
                    <span className="text-amber-700">36 days overdue</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Tasks — list view, real app style */}
            <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900">
                    Tasks
                  </span>
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
                    {s.tasks.length}
                  </span>
                </div>
                <button className="text-xs font-medium text-neutral-500 hover:text-neutral-900">
                  View all →
                </button>
              </div>
              <ul className="divide-y divide-neutral-100">
                {s.tasks.map((t) => (
                  <li
                    key={t.key}
                    className="group flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50"
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        t.state === "complete"
                          ? "bg-emerald-500 text-white"
                          : t.state === "awaiting_us"
                            ? "border-2 border-neutral-300"
                            : "border-2 border-amber-500 bg-amber-50"
                      }`}
                    >
                      {t.state === "complete" && (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">
                        {t.title}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {t.state === "awaiting_us"
                          ? "Awaiting Clever Accounts"
                          : t.description.slice(0, 60) + "…"}
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        t.state === "awaiting_us"
                          ? "bg-neutral-100 text-neutral-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {t.state === "awaiting_us" ? "Pending us" : "Needs you"}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600"
                    />
                  </li>
                ))}
              </ul>
            </section>

            {/* Activity feed — real app timeline */}
            <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-3">
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
                    color: "text-amber-500",
                  },
                  {
                    when: "Yesterday, 11:00",
                    what: "Main onboarding call completed",
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
                  {
                    when: "29 Mar, 16:48",
                    what: "Account created",
                    who: "You signed up",
                    icon: CircleDot,
                    color: "text-neutral-400",
                  },
                ].map((row, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-neutral-50"
                  >
                    <row.icon
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${row.color}`}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-neutral-900">{row.what}</div>
                      <div className="text-xs text-neutral-500">{row.who}</div>
                    </div>
                    <div className="text-xs text-neutral-400">{row.when}</div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6">
            {/* Accountant card — small refined widget */}
            <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="px-5 py-4">
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
                      Senior · Manchester
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-700">
                    <Calendar size={12} /> Book
                  </button>
                  <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 transition hover:border-neutral-400">
                    <MessageSquare size={12} /> Message
                  </button>
                </div>
              </div>
            </section>

            {/* Progress widget — compact stat card */}
            <section className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Onboarding
                </span>
                <span className="text-xs text-neutral-400">
                  {completed}/{s.totalStages}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-neutral-900">
                  {pct}
                </span>
                <span className="text-base text-neutral-400">%</span>
              </div>
              <div className="mt-3 flex gap-1">
                {s.stages.map((st) => (
                  <div
                    key={st.key}
                    className={`h-1 flex-1 rounded-full ${
                      st.state === "complete"
                        ? "bg-emerald-500"
                        : st.state === "current"
                          ? "bg-amber-500"
                          : "bg-neutral-200"
                    }`}
                    title={st.title}
                  />
                ))}
              </div>
            </section>

            {/* Journey stages — compact list */}
            <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-3">
                <span className="text-sm font-semibold text-neutral-900">
                  Stages
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
                          ? "bg-emerald-500 text-white"
                          : st.state === "current"
                            ? "border-2 border-amber-500 bg-amber-50 text-amber-700"
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
                      <span className="text-xs font-medium text-amber-600">
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
