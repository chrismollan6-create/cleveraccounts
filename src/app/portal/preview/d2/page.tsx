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
  CheckCircle2,
  CircleDot,
  ShieldCheck,
  Video,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const font = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant D2 — "Midnight".
 *
 * Deep near-black premium dashboard. Glassmorphism cards (bg-white/[0.04],
 * hairline borders, backdrop-blur), a single restrained emerald→teal gradient
 * accent used only for the primary CTA + progress ring, and a faint radial glow.
 *
 * Reference points: Raycast, Vercel dark dashboard, Linear dark, Arc, Family.
 *
 * Uncluttered fixes: ONE progress ring (no repeated stage chips), an INLINE
 * time-slot picker inside the next-step card, ONE primary CTA per action, and
 * a calm "gentle nudge" framing instead of an alarming red overdue error.
 */
export default function PreviewD2() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  // Progress ring geometry
  const R = 34;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  const slots = [
    { label: "Tue 14 May", time: "10:00" },
    { label: "Tue 14 May", time: "14:00", selected: true },
    { label: "Wed 15 May", time: "11:00" },
    { label: "Fri 17 May", time: "09:30" },
  ];

  return (
    <div
      className={`${font.className} relative min-h-screen overflow-hidden bg-[#0a0a0b] text-zinc-100`}
    >
      {/* Faint radial glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 75% -10%, rgba(16,185,129,0.10), transparent 60%), radial-gradient(50rem 40rem at 0% 110%, rgba(20,184,166,0.07), transparent 55%)",
        }}
      />

      <PreviewBadge variant="D2" label="Midnight" next="d3" prev="d1" />

      <div className="relative mx-auto max-w-6xl px-6 py-9">
        {/* HEADER — compact greeting + single status */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Good evening, {MOCK_FIRST_NAME}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {s.accountName} · Clever Accounts
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Encrypted · synced live
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* HERO next-step card with inline slot picker */}
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              {/* gradient edge glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"
              />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-emerald-300/90">
                    <Sparkles size={13} /> Up next
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-400">
                    <Clock size={11} /> A gentle nudge — was due 7 Apr
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-50">
                  {s.nextActionLabel}
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-zinc-400">
                  A relaxed 30-minute hands-on walk-through of invoices,
                  expenses, salary and bank feeds — so the portal feels like
                  second nature.
                </p>

                {/* Inline time-slot picker */}
                <div className="mt-5">
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <Calendar size={12} /> Pick a time
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot, i) => (
                      <button
                        key={i}
                        className={`group flex flex-col items-start rounded-xl border px-3.5 py-2 text-left transition ${
                          slot.selected
                            ? "border-transparent bg-gradient-to-br from-emerald-500/90 to-teal-500/90 text-white shadow-[0_0_24px_-6px_rgba(16,185,129,0.6)] ring-1 ring-emerald-300/40"
                            : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        <span
                          className={`text-[11px] ${slot.selected ? "text-emerald-50/90" : "text-zinc-500"}`}
                        >
                          {slot.label}
                        </span>
                        <span className="text-sm font-semibold tabular-nums">
                          {slot.time}
                        </span>
                      </button>
                    ))}
                    <Link
                      href={a.calendlyUrl ?? "#"}
                      className="flex items-center rounded-xl border border-dashed border-white/15 px-3.5 py-2 text-xs font-medium text-zinc-400 transition hover:border-white/30 hover:text-zinc-200"
                    >
                      See all times
                    </Link>
                  </div>
                </div>

                {/* ONE primary CTA */}
                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    {a.photoUrl && (
                      <Image
                        src={a.photoUrl}
                        width={28}
                        height={28}
                        alt={a.name ?? ""}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-white/15"
                      />
                    )}
                    <p className="text-xs text-zinc-400">
                      <span className="text-zinc-200">{a.name}:</span> “Looking
                      forward to showing you around — it’s quick, promise.”
                    </p>
                  </div>
                  <Link
                    href={a.calendlyUrl ?? "#"}
                    className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(16,185,129,0.7)] transition hover:brightness-110"
                  >
                    Confirm Tue 14 May, 14:00
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </section>

            {/* TASKS */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100">
                    Tasks
                  </span>
                  <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-xs font-medium text-zinc-400">
                    {s.tasks.length}
                  </span>
                </div>
                <button className="text-xs font-medium text-zinc-500 transition hover:text-zinc-200">
                  View all →
                </button>
              </div>
              <ul className="divide-y divide-white/[0.06]">
                {s.tasks.map((t) => (
                  <li
                    key={t.key}
                    className="group flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        t.state === "complete"
                          ? "bg-emerald-500 text-white"
                          : t.state === "awaiting_us"
                            ? "border-2 border-white/15"
                            : "border-2 border-emerald-400/60 bg-emerald-500/10"
                      }`}
                    >
                      {t.state === "complete" && (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-zinc-100">
                        {t.title}
                      </div>
                      <div className="truncate text-xs text-zinc-500">
                        {t.state === "awaiting_us"
                          ? "Awaiting Clever Accounts"
                          : t.description}
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
                        t.state === "awaiting_us"
                          ? "bg-white/[0.06] text-zinc-400"
                          : "bg-emerald-500/15 text-emerald-300"
                      }`}
                    >
                      {t.state === "awaiting_us" ? "Pending us" : "Needs you"}
                    </span>
                    <ChevronRight
                      size={14}
                      className="flex-shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300"
                    />
                  </li>
                ))}
              </ul>
            </section>

            {/* ACTIVITY FEED — slim */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="border-b border-white/10 px-5 py-3.5">
                <span className="text-sm font-semibold text-zinc-100">
                  Recent activity
                </span>
              </div>
              <ul className="divide-y divide-white/[0.06]">
                {[
                  {
                    when: "Today, 14:32",
                    what: "Identity verification email sent",
                    who: "Credas",
                    icon: ShieldCheck,
                    color: "text-emerald-300",
                  },
                  {
                    when: "Yesterday, 11:00",
                    what: "Main onboarding call completed",
                    who: "Charlie McAuley",
                    icon: CheckCircle2,
                    color: "text-emerald-400",
                  },
                  {
                    when: "30 Mar, 10:00",
                    what: "Welcome call completed",
                    who: "Charlie McAuley",
                    icon: CheckCircle2,
                    color: "text-emerald-400",
                  },
                  {
                    when: "29 Mar, 16:48",
                    what: "Account created",
                    who: "You signed up",
                    icon: CircleDot,
                    color: "text-zinc-500",
                  },
                ].map((row, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 px-5 py-3 transition hover:bg-white/[0.03]"
                  >
                    <row.icon
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${row.color}`}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-200">{row.what}</div>
                      <div className="text-xs text-zinc-500">{row.who}</div>
                    </div>
                    <div className="text-xs text-zinc-600">{row.when}</div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-5">
            {/* ACCOUNTANT chip */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Your accountant
              </div>
              <div className="flex items-center gap-3">
                {a.photoUrl && (
                  <Image
                    src={a.photoUrl}
                    width={52}
                    height={52}
                    alt={a.name ?? ""}
                    className="h-13 w-13 flex-shrink-0 rounded-full object-cover ring-2 ring-emerald-400/30"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-zinc-100">
                    {a.name}
                  </div>
                  <div className="truncate text-xs text-zinc-500">
                    Replies in ~2h · Mon–Fri 9–5
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_22px_-8px_rgba(16,185,129,0.7)] transition hover:brightness-110">
                  <Video size={12} /> Book
                </button>
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.06]">
                  <MessageSquare size={12} /> Message
                </button>
              </div>
            </section>

            {/* PROGRESS RING — the single progress indicator */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Onboarding
              </div>
              <div className="flex items-center gap-5">
                <div className="relative h-[88px] w-[88px] flex-shrink-0">
                  <svg
                    viewBox="0 0 80 80"
                    className="h-full w-full -rotate-90"
                  >
                    <defs>
                      <linearGradient id="d2grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="40"
                      cy="40"
                      r={R}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={R}
                      fill="none"
                      stroke="url(#d2grad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={`${dash} ${C}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold tracking-tight text-zinc-50">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-100">
                    Stage {s.stageNumber} of {s.totalStages}
                  </div>
                  <div className="text-sm text-zinc-400">{s.stageTitle}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {completed} of {s.totalStages} steps done
                  </div>
                </div>
              </div>
            </section>

            {/* STAGES list — compact */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="border-b border-white/10 px-5 py-3.5">
                <span className="text-sm font-semibold text-zinc-100">
                  Stages
                </span>
              </div>
              <ol className="divide-y divide-white/[0.06]">
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
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white ring-2 ring-emerald-400/30"
                            : "border border-white/15 bg-transparent text-zinc-500"
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
                          ? "text-zinc-500"
                          : st.state === "current"
                            ? "font-semibold text-zinc-100"
                            : "text-zinc-300"
                      }`}
                    >
                      {st.title}
                    </span>
                    {st.state === "complete" && st.completedDate && (
                      <span className="text-xs text-zinc-600">
                        {formatDate(st.completedDate)}
                      </span>
                    )}
                    {st.state === "current" && (
                      <span className="text-xs font-medium text-emerald-300">
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
    <div className="relative border-b border-white/10 bg-black/40 px-4 py-2 text-xs backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="font-mono font-semibold text-zinc-400">
          Preview {variant} · {label}
        </span>
        <div className="flex gap-3">
          <Link
            href={`/portal/preview/${prev}`}
            className="text-zinc-500 underline transition hover:text-zinc-200"
          >
            ← {prev.toUpperCase()}
          </Link>
          <Link
            href="/portal/preview"
            className="text-zinc-500 underline transition hover:text-zinc-200"
          >
            index
          </Link>
          <Link
            href={`/portal/preview/${next}`}
            className="text-zinc-500 underline transition hover:text-zinc-200"
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
