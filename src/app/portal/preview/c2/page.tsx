import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Check,
  TrendingUp,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  Building2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const font = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant C2 — "Mercury bento" (real app, not magazine).
 *
 * Bento grid of FUNCTIONAL widgets. No hero portraits, no full-bleed photos —
 * the accountant photo is a 32px avatar inside a status widget. Each tile is
 * a self-contained piece of useful software: progress meter with sparkline,
 * pending tasks list, upcoming call slot, document tracker. Brand colour as
 * accent, not decoration.
 *
 * Reference points: Mercury Bank home, Ramp dashboard, Cron calendar app,
 * Notion home, Pitch boards.
 */
export default function PreviewC2() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className={`${font.className} min-h-screen bg-neutral-100`}>
      <PreviewBadge variant="C2" label="Mercury bento" next="c3" prev="c1" />

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* HEADER — compact app strip */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Good evening, {MOCK_FIRST_NAME}
            </h1>
            <span className="text-sm text-neutral-500">
              {s.accountName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="rounded-md bg-white px-2 py-1 ring-1 ring-neutral-200">
              Stage {s.stageNumber}/{s.totalStages}
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-200">
              ● Live
            </span>
          </div>
        </div>

        {/* BENTO GRID — functional widgets */}
        <div className="grid auto-rows-[minmax(0,auto)] grid-cols-12 gap-4">
          {/* NEXT-STEP — big functional card */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:col-span-8">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-sm font-semibold text-neutral-900">
                  Up next
                </span>
              </div>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                36 days overdue
              </span>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                    {s.nextActionLabel}
                  </h2>
                  <p className="mt-1.5 text-sm text-neutral-600">
                    A 30-min walk-through covering expenses, invoices, and
                    paying yourself. Charlie has Tue, Wed, and Fri this week.
                  </p>

                  {/* Inline time slot suggestions — feels like a real app */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Tue 14 May · 10:00", "Tue 14 May · 14:30", "Wed 15 May · 11:00", "Fri 17 May · 09:30"].map((slot) => (
                      <button
                        key={slot}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                      >
                        {slot}
                      </button>
                    ))}
                    <Link
                      href={a.calendlyUrl ?? "#"}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-900"
                    >
                      See all times →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROGRESS — stat card with bar chart */}
          <section className="col-span-12 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:col-span-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Onboarding
              </span>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-neutral-900">
                {pct}
              </span>
              <span className="text-lg text-neutral-400">%</span>
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">
              {completed} of {s.totalStages} stages done
            </div>
            {/* Mini bar chart */}
            <div className="mt-4 flex h-12 items-end gap-1">
              {s.stages.map((st, i) => (
                <div
                  key={st.key}
                  className="flex-1 rounded-sm transition hover:opacity-80"
                  style={{
                    height: `${(i + 1) * 14 + 20}%`,
                    backgroundColor:
                      st.state === "complete"
                        ? "rgb(16 185 129)"
                        : st.state === "current"
                          ? "rgb(245 158 11)"
                          : "rgb(229 229 229)",
                  }}
                  title={st.title}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
              <span>Welcome</span>
              <span>Catchup</span>
            </div>
          </section>

          {/* ACCOUNTANT WIDGET — small avatar, big actions */}
          <section className="col-span-12 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-6 md:col-span-4">
            <div className="mb-4 flex items-center gap-3">
              {a.photoUrl && (
                <Image
                  src={a.photoUrl}
                  width={40}
                  height={40}
                  alt={a.name ?? ""}
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-white"
                />
              )}
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
                <span>Clients</span>
                <span className="font-medium text-neutral-900">82</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-1.5">
              <button className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700">
                Book
              </button>
              <button className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:border-neutral-400">
                Message
              </button>
            </div>
          </section>

          {/* TASKS WIDGET — real list */}
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
                      {t.state === "awaiting_us" ? "Awaiting us" : "Check email"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* JOURNEY WIDGET — vertical mini-stepper */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:col-span-4">
            <div className="border-b border-neutral-100 px-4 py-3">
              <span className="text-sm font-semibold text-neutral-900">
                Stages
              </span>
            </div>
            <ol className="divide-y divide-neutral-100">
              {s.stages.map((st) => (
                <li key={st.key} className="flex items-center gap-3 px-4 py-2.5">
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
                    className={`flex-1 text-xs ${
                      st.state === "upcoming"
                        ? "text-neutral-400"
                        : st.state === "current"
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-700"
                    }`}
                  >
                    {st.title}
                  </span>
                  {st.state === "current" && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-amber-600">
                      Now
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* NEXT CALL WIDGET — empty-state with CTA */}
          <section className="col-span-12 rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-5 sm:col-span-6 md:col-span-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Calendar size={16} />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-neutral-500">
                  Next call
                </div>
                <div className="mt-0.5 text-sm font-medium text-neutral-900">
                  Nothing booked
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Book your portal training to keep onboarding moving.
                </p>
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
                >
                  Book a slot <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </section>

          {/* COMPANY WIDGET */}
          <section className="col-span-12 rounded-2xl bg-neutral-900 p-5 text-white shadow-sm sm:col-span-6 md:col-span-4">
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
            </div>
          </section>

          {/* ACTIVITY WIDGET — feeds bottom row */}
          <section className="col-span-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:col-span-4">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <span className="text-sm font-semibold text-neutral-900">
                Recent
              </span>
              <button className="text-xs text-neutral-500 hover:text-neutral-900">
                All →
              </button>
            </div>
            <ul className="divide-y divide-neutral-100">
              {[
                { when: "14:32", what: "ID verification email", who: "Credas" },
                { when: "Yesterday", what: "Main call done", who: "Charlie" },
                { when: "30 Mar", what: "Welcome call done", who: "Charlie" },
              ].map((row, i) => (
                <li key={i} className="px-4 py-2.5">
                  <div className="text-xs text-neutral-400">{row.when}</div>
                  <div className="text-sm text-neutral-900">{row.what}</div>
                  <div className="text-xs text-neutral-500">{row.who}</div>
                </li>
              ))}
            </ul>
          </section>
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
