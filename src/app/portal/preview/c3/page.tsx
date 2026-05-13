import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Mail,
  Activity,
  Clock,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant C3 — "Aurora glass" (modern fintech).
 *
 * Dark base with an animated gradient-mesh "aurora" backdrop. Glass cards
 * (backdrop-blur + semi-transparent) layered over the mesh. Big display type.
 * Brand colour as glow accents. Feels like a 2026 fintech app — premium,
 * confident, technically interesting.
 *
 * Reference points: Linear's website, Vercel's marketing pages, Arc browser,
 * Cron's calendar, Loom 2026, Stripe Atlas.
 */
export default function PreviewC3() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className={`${body.className} relative min-h-screen overflow-hidden bg-[#0a0a0f] text-white`}>
      {/* ─── AURORA MESH BACKDROP ─── */}
      <div className="pointer-events-none fixed inset-0">
        {/* Layered radial gradients to fake a mesh gradient */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(at 20% 10%, hsl(220 90% 50% / 0.30) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(35 95% 55% / 0.20) 0px, transparent 50%), radial-gradient(at 60% 60%, hsl(280 80% 50% / 0.18) 0px, transparent 50%), radial-gradient(at 30% 90%, hsl(195 90% 55% / 0.20) 0px, transparent 50%)",
          }}
        />
        {/* Subtle noise / grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <PreviewBadge variant="C3" label="Aurora glass" next="c1" prev="c2" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* HEADER — minimal glass strip */}
        <header className="mb-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-stone-900">
              CA
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50">
                Clever Accounts
              </div>
              <div className="text-sm font-semibold">Client portal</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All systems normal
          </div>
        </header>

        {/* ─── HERO ─── */}
        <section className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
            Good evening
          </p>
          <h1
            className={`${display.className} text-6xl leading-[1.0] tracking-tight sm:text-7xl md:text-[120px]`}
          >
            {MOCK_FIRST_NAME}.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/65">
            You&apos;re on stage {s.stageNumber} of {s.totalStages}. Two done,
            four to go — and Charlie&apos;s waiting on one thing from you.
          </p>
        </section>

        {/* ─── PRIMARY GRID ─── */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {/* NEXT STEP — large glass card with glow */}
          <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-2xl md:col-span-2 md:row-span-2">
            {/* Glow */}
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl transition-all duration-700 group-hover:bg-amber-400/30" />

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200">
                  <Sparkles size={12} /> Your next step
                </div>
                <h2
                  className={`${display.className} max-w-xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl`}
                >
                  {s.nextActionLabel}.
                </h2>
                <p className="mt-5 max-w-lg text-base text-white/65">
                  A 30-minute walk-through where Charlie shows you how to log
                  expenses, raise invoices, and pay yourself. Once that&apos;s
                  in your toolbox, the rest is routine.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-4 text-sm font-semibold text-stone-900 transition"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Pick a time
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-amber-300 to-amber-500 transition-transform duration-500 group-hover/btn:translate-x-0" />
                </Link>
                <div className="inline-flex items-center gap-2 text-xs text-white/40">
                  <Clock size={12} /> 30 min · times available this week
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNTANT — portrait glass */}
          <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <div className="relative aspect-[4/5]">
              {a.photoUrl && (
                <Image
                  src={a.photoUrl.replace("300", "600")}
                  fill
                  alt={a.name ?? ""}
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
                <ShieldCheck size={10} /> Verified
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs uppercase tracking-wider text-white/70">
                  Your accountant
                </div>
                <div className={`${display.className} text-2xl leading-none`}>
                  {a.name}
                </div>
                <div className="mt-0.5 text-xs text-white/60">
                  Senior · Manchester · ACA
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-white/10">
              <button className="flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold text-white transition hover:bg-white/5">
                <Calendar size={12} /> Book
              </button>
              <button className="flex items-center justify-center gap-1.5 border-l border-white/10 py-3.5 text-xs font-semibold text-white transition hover:bg-white/5">
                <MessageSquare size={12} /> Message
              </button>
            </div>
          </div>

          {/* PROGRESS — glass with chart */}
          <div className="relative col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="relative">
              <div className="mb-1 text-xs uppercase tracking-wider text-white/50">
                Onboarding progress
              </div>
              <div className="flex items-baseline gap-2">
                <div
                  className={`${display.className} text-6xl text-white`}
                >
                  {pct}
                </div>
                <div className="text-2xl text-white/40">%</div>
              </div>
              <div className="mt-1 text-sm text-white/60">
                {completed} of {s.totalStages} steps complete
              </div>
              <div className="mt-5 flex gap-1">
                {s.stages.map((st) => (
                  <div
                    key={st.key}
                    className={`h-1.5 flex-1 rounded-full ${
                      st.state === "complete"
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                        : st.state === "current"
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECONDARY GRID ─── */}
        <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
          {/* JOURNEY TIMELINE — full width-ish */}
          <div className="col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:col-span-2">
            <div className="mb-5 flex items-baseline justify-between">
              <h3 className={`${display.className} text-3xl`}>
                Your journey
              </h3>
              <span className="text-xs uppercase tracking-wider text-white/40">
                6 stages
              </span>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-3 top-3 bottom-3 w-px bg-white/10" />
              <div
                className="absolute left-3 top-3 w-px bg-gradient-to-b from-emerald-400 to-amber-400"
                style={{ height: `${(completed / s.totalStages) * 100}%` }}
              />
              <ol className="space-y-4">
                {s.stages.map((st) => (
                  <li key={st.key} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-8 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        st.state === "complete"
                          ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                          : st.state === "current"
                            ? "border-2 border-amber-400 bg-[#0a0a0f] text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                            : "border border-white/20 bg-[#0a0a0f] text-white/40"
                      }`}
                    >
                      {st.state === "complete" ? (
                        <Check size={11} strokeWidth={3} />
                      ) : (
                        st.stageNumber
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div
                          className={`text-sm font-semibold ${st.state === "upcoming" ? "text-white/40" : "text-white"}`}
                        >
                          {st.title}
                        </div>
                        {st.state === "complete" && st.completedDate && (
                          <div className="text-xs text-emerald-400">
                            ✓ {formatDate(st.completedDate)}
                          </div>
                        )}
                        {st.state === "current" && (
                          <div className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                            Now
                          </div>
                        )}
                      </div>
                      {st.state === "current" && (
                        <div className="mt-0.5 text-xs text-white/50">
                          Pick a time with Charlie to move forward.
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* TASKS PANEL */}
          <div className="col-span-1 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h3 className={`${display.className} mb-5 text-3xl`}>
              Need attention
            </h3>
            <ul className="space-y-4">
              {s.tasks.map((t) => (
                <li
                  key={t.key}
                  className={`rounded-2xl border p-4 ${
                    t.state === "awaiting_us"
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-amber-300/30 bg-amber-300/[0.06]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                        t.state === "awaiting_us"
                          ? "bg-white/10 text-white/60"
                          : "bg-amber-400 text-stone-900"
                      }`}
                    >
                      {t.state === "awaiting_us" ? <Clock size={14} /> : <Mail size={14} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">
                        {t.title}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        {t.state === "awaiting_us"
                          ? "We'll send shortly — no action needed."
                          : t.description}
                      </div>
                      {t.actionLabel && t.state !== "awaiting_us" && (
                        <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200">
                          {t.actionLabel} <ArrowUpRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── ACTIVITY / RECENT — full-width strip ─── */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-white/50" />
              <h3 className="text-sm font-semibold">Recent activity</h3>
            </div>
            <button className="text-xs text-white/50 hover:text-white">
              View all →
            </button>
          </div>
          <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">
            {[
              { when: "Today", what: "ID verification email sent", who: "Credas", icon: ShieldCheck },
              { when: "Yesterday", what: "Main onboarding call done", who: "Charlie McAuley", icon: Check },
              { when: "30 Mar", what: "Welcome call done", who: "Charlie McAuley", icon: Check },
              { when: "29 Mar", what: "Account created", who: "You", icon: Zap },
            ].map((row, i) => (
              <div key={i} className="px-5 py-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                  <row.icon size={11} />
                  {row.when}
                </div>
                <div className="text-sm font-medium text-white">{row.what}</div>
                <div className="mt-0.5 text-xs text-white/50">{row.who}</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs uppercase tracking-[0.2em] text-white/30">
          Clever Accounts · Encrypted & secure portal · 2026
        </footer>
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
    <div className="relative border-b border-white/10 bg-black/40 px-4 py-2 text-xs backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="font-mono font-semibold text-amber-300">
          Preview {variant} · {label}
        </span>
        <div className="flex gap-3">
          <Link href={`/portal/preview/${prev}`} className="text-white/70 underline">
            ← {prev.toUpperCase()}
          </Link>
          <Link href="/portal/preview" className="text-white/70 underline">
            index
          </Link>
          <Link href={`/portal/preview/${next}`} className="text-white/70 underline">
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
