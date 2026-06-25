import Image from "next/image";
import Link from "next/link";
import { Inter, Instrument_Serif } from "next/font/google";
import {
  ArrowRight,
  Calendar,
  Clock,
  Check,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

/**
 * Variant D3 — "Editorial".
 *
 * Reference: a private-bank / wealth dashboard with editorial polish.
 * Warm paper palette (cream/stone), refined Instrument Serif display type
 * paired with Inter for body, one restrained forest-green accent. A generous
 * single focal column carries the greeting, hero next-step (with an inline
 * time-slot picker), and the journey stages; a slim quiet right rail holds
 * the accountant and a couple of tasks. Calm, considered, premium, human —
 * software with editorial polish, not a magazine cover.
 *
 * Reference points: private-bank dashboards · Monocle · Stripe Press ·
 * Mercury's calmer moments · Notion 2026 · Fraunces/Tiempos editorial type.
 */
export default function PreviewD3() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  const slots = [
    { label: "Tue 14 May", time: "10:00", selected: false },
    { label: "Tue 14 May", time: "14:00", selected: true },
    { label: "Wed 15 May", time: "11:00", selected: false },
    { label: "Fri 17 May", time: "09:30", selected: false },
  ];

  return (
    <div className={`${body.className} min-h-screen bg-[#faf8f4] text-stone-800`}>
      <PreviewBadge label="Editorial" prev="d2" next="c1" />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 lg:py-20">
        {/* GREETING */}
        <header className="mb-12">
          <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">
            {s.accountName} · Clever Accounts
          </div>
          <h1
            className={`${display.className} text-5xl leading-[1.05] text-stone-900 sm:text-6xl`}
          >
            Good evening, {MOCK_FIRST_NAME}.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-500">
            You&apos;re settling in nicely — two stages done. There&apos;s one
            gentle thing left before you&apos;re fully up and running.
          </p>
        </header>

        {/* MAIN GRID — generous focal column + slim quiet rail */}
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* FOCAL COLUMN */}
          <main className="space-y-12">
            {/* HERO NEXT STEP */}
            <section className="rounded-2xl border border-stone-200/80 bg-white/80 p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-9">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-800/70">
                  Your next step
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-medium text-stone-500">
                  <Clock size={11} /> A nudge — it&apos;s been a little while
                </span>
              </div>

              <h2
                className={`${display.className} mt-5 text-4xl leading-tight text-stone-900 sm:text-5xl`}
              >
                {s.nextActionLabel}
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-stone-500">
                A relaxed 30-minute hands-on walk-through with Charlie —
                invoices, expenses, salary and bank feeds. By the end you&apos;ll
                feel completely at home in the portal.
              </p>

              {/* INLINE TIME-SLOT PICKER */}
              <div className="mt-7">
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
                  Pick a time
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {slots.map((slot) => (
                    <button
                      key={`${slot.label}-${slot.time}`}
                      className={`flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition ${
                        slot.selected
                          ? "border-emerald-800 bg-emerald-800 text-white shadow-sm"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-medium uppercase tracking-wide ${
                          slot.selected ? "text-emerald-100" : "text-stone-400"
                        }`}
                      >
                        {slot.label}
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {slot.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SINGLE PRIMARY CTA */}
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  Confirm Tue 14 May, 14:00
                  <ArrowRight size={16} />
                </Link>
                <button className="text-sm font-medium text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline">
                  See all times
                </button>
              </div>
            </section>

            {/* JOURNEY STAGES */}
            <section>
              <div className="mb-5 flex items-baseline justify-between">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">
                  Your onboarding journey
                </h3>
                <span className="text-xs text-stone-400">
                  Stage {s.stageNumber} of {s.totalStages}
                </span>
              </div>

              {/* ONE progress indicator — thin bar + pct */}
              <div className="mb-7 flex items-center gap-4">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-emerald-800"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`${display.className} text-2xl text-stone-900`}>
                  {pct}%
                </span>
              </div>

              <ol className="divide-y divide-stone-200/70 border-y border-stone-200/70">
                {s.stages.map((st) => (
                  <li
                    key={st.key}
                    className="flex items-center gap-4 py-4"
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        st.state === "complete"
                          ? "bg-emerald-800 text-white"
                          : st.state === "current"
                            ? "border border-emerald-800 text-emerald-900"
                            : "border border-stone-200 text-stone-400"
                      }`}
                    >
                      {st.state === "complete" ? (
                        <Check size={13} strokeWidth={2.5} />
                      ) : (
                        st.stageNumber
                      )}
                    </span>
                    <span
                      className={`flex-1 text-[15px] ${
                        st.state === "upcoming"
                          ? "text-stone-400"
                          : st.state === "current"
                            ? "font-semibold text-stone-900"
                            : "text-stone-600"
                      }`}
                    >
                      {st.title}
                    </span>
                    {st.state === "complete" && st.completedDate && (
                      <span className="text-xs text-stone-400">
                        {formatDate(st.completedDate)}
                      </span>
                    )}
                    {st.state === "current" && (
                      <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-800">
                        In progress
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </main>

          {/* QUIET RIGHT RAIL */}
          <aside className="space-y-10">
            {/* ACCOUNTANT */}
            <section>
              <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">
                Your accountant
              </div>
              <div className="flex items-center gap-4">
                {a.photoUrl && (
                  <Image
                    src={a.photoUrl}
                    width={56}
                    height={56}
                    alt={a.name ?? ""}
                    className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-1 ring-stone-200"
                  />
                )}
                <div className="min-w-0">
                  <div className={`${display.className} text-xl text-stone-900`}>
                    {a.name}
                  </div>
                  <div className="text-xs text-stone-500">
                    Replies in ~2 hours
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs leading-relaxed text-stone-400">
                Here Monday to Friday, 9 – 5.
              </div>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:border-stone-500">
                <MessageSquare size={14} /> Send a message
              </button>
            </section>

            {/* DIVIDER RULE */}
            <div className="border-t border-stone-200/70" />

            {/* TASKS */}
            <section>
              <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">
                A couple of things
              </div>
              <ul className="space-y-4">
                {s.tasks.map((t) => (
                  <li key={t.key} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        t.state === "awaiting_us"
                          ? "border border-stone-300"
                          : "border border-emerald-800/40 bg-emerald-50"
                      }`}
                    >
                      {t.state !== "awaiting_us" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-800" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-stone-900">
                        {t.title}
                      </div>
                      <div className="mt-0.5 text-xs leading-relaxed text-stone-500">
                        {t.state === "awaiting_us"
                          ? "We'll send this over — nothing needed from you yet."
                          : "A quick identity check via Credas. Worth doing today."}
                      </div>
                      {t.state !== "awaiting_us" && (
                        <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900">
                          {t.actionLabel ?? "Open"}
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* DIVIDER RULE */}
            <div className="border-t border-stone-200/70" />

            {/* CALL META */}
            <section className="flex items-center gap-2 text-xs text-stone-400">
              <Calendar size={13} />
              30-minute call · video or phone
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
    <div className="border-b border-stone-200 bg-white px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="font-mono font-semibold text-stone-700">
          Preview D3 · {label}
        </span>
        <div className="flex gap-3">
          <Link
            href={`/portal/preview/${prev}`}
            className="text-stone-600 underline"
          >
            ← {prev.toUpperCase()}
          </Link>
          <Link href="/portal/preview" className="text-stone-600 underline">
            index
          </Link>
          <Link
            href={`/portal/preview/${next}`}
            className="text-stone-600 underline"
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
