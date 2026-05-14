import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MessageSquare, Check } from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

/**
 * Variant A — "Linear minimal".
 *
 * Design language: monochrome with a single brand accent. Generous whitespace.
 * Single column, max-w-2xl. No KPI cards, no emojis, no decoration. Each
 * element earns its space — if it's not what-to-do-next or who's-helping-me,
 * it's collapsed below the fold.
 *
 * Reference points: Linear settings, Vercel project dashboard, Mercury Bank.
 */
export default function PreviewA() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <PreviewBadge variant="A" label="Linear minimal" />

      {/* Greeting — sober, no emoji */}
      <header className="mb-10">
        <p className="text-sm font-medium text-text-light">Good evening</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text">
          {MOCK_FIRST_NAME}
        </h1>
      </header>

      {/* Status line — one sentence, no chart, no card */}
      <p className="mb-10 text-base leading-relaxed text-text-light">
        You&apos;re on stage <span className="font-semibold text-text">{s.stageNumber} of {s.totalStages}</span>
        {" — "}
        <span className="font-semibold text-text">{s.stageTitle}</span>.{" "}
        {s.blockedOn === "client" && "There&apos;s one thing waiting on you."}
      </p>

      {/* Stage dots — visual proof of progress, six tiny circles */}
      <div className="mb-12 flex items-center gap-2">
        {s.stages.map((st) => (
          <div
            key={st.key}
            className={`h-2 flex-1 rounded-full ${
              st.state === "complete"
                ? "bg-primary"
                : st.state === "current"
                  ? "bg-primary/40"
                  : "bg-border"
            }`}
            title={`${st.title} — ${st.state}`}
          />
        ))}
      </div>

      {/* Next action — single hero block, brand-coloured outline only */}
      <div className="mb-12 rounded-2xl border border-primary/30 bg-white p-8">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
          Your next step
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-text">
          {s.nextActionLabel}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-text-light">
          Pick a time that suits you. It takes about 30 minutes — we&apos;ll walk you
          through everything you need to know about the portal.
        </p>
        <Link
          href={a.calendlyUrl ?? "#"}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Choose a time <ArrowRight size={16} />
        </Link>
      </div>

      {/* Accountant — real photo, name, two actions. No initials, no gradient. */}
      <section className="mb-12">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-light">
          Your accountant
        </h3>
        <div className="flex items-center gap-4">
          {a.photoUrl && (
            <Image
              src={a.photoUrl}
              width={64}
              height={64}
              alt={a.name ?? "Accountant"}
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <div className="font-semibold text-text">{a.name}</div>
            <div className="text-sm text-text-light">Senior accountant</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
            <Calendar size={14} /> Book a call
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
            <MessageSquare size={14} /> Send a message
          </button>
        </div>
      </section>

      {/* Journey — collapsed by default. <details> is the cheapest accordion. */}
      <details className="group rounded-xl border border-border bg-white open:bg-white">
        <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text">
          <span>Your full journey ({completed} of {s.totalStages} done)</span>
          <span className="text-text-light group-open:rotate-90 transition-transform">›</span>
        </summary>
        <ol className="border-t border-border px-5 py-4">
          {s.stages.map((st, i) => (
            <li
              key={st.key}
              className="flex items-start gap-3 py-2.5"
            >
              <div
                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                  st.state === "complete"
                    ? "bg-primary text-white"
                    : st.state === "current"
                      ? "border-2 border-primary bg-white"
                      : "border-2 border-border bg-white"
                }`}
              >
                {st.state === "complete" && <Check size={12} strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${st.state === "upcoming" ? "text-text-light" : "text-text"}`}>
                  {st.title}
                </div>
                {st.completedDate && (
                  <div className="text-xs text-text-light">Done {formatDate(st.completedDate)}</div>
                )}
                {st.state === "current" && st.isOverdue && (
                  <div className="text-xs text-orange-600">Overdue — book to keep things moving</div>
                )}
              </div>
              <div className="text-xs text-text-light">{i + 1}/{s.stages.length}</div>
            </li>
          ))}
        </ol>
      </details>

      {/* Footer — bare attribution */}
      <p className="mt-12 text-xs text-text-light">
        Encrypted &amp; secure portal · © 2026 Clever Accounts
      </p>
    </div>
  );
}

function PreviewBadge({ variant, label }: { variant: string; label: string }) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-xs">
      <span className="font-mono font-semibold text-orange-700">
        Preview {variant} · {label}
      </span>
      <div className="flex gap-2">
        <Link href="/portal/preview" className="text-orange-700 underline">
          back to index
        </Link>
        <Link href="/portal/preview/b" className="text-orange-700 underline">
          B →
        </Link>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
