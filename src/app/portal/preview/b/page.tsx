import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  Check,
  Sparkles,
  ShieldCheck,
  FileText,
  Mail,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

/**
 * Variant B — "Warm consumer".
 *
 * Design language: soft gradients, illustrated stage motif, brand-coloured
 * warmth. Two-column at md+: primary content left, accountant + tasks rail
 * right. Warmer copy tone ("Here's where you're up to"), real photos, more
 * visual personality.
 *
 * Reference points: Monzo app, Calendly booking flow, Notion onboarding,
 * Patreon creator dashboard.
 */
export default function PreviewB() {
  const s = MOCK_STATUS;
  const a = s.accountant;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <PreviewBadge variant="B" label="Warm consumer" />

      {/* Hero strip with gentle gradient backdrop */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-white to-secondary/5 px-6 py-8 sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles size={14} /> Stage {s.stageNumber} of {s.totalStages}
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Hi {MOCK_FIRST_NAME}, here&apos;s where you&apos;re up to.
          </h1>
          <p className="max-w-xl text-base text-text-light">
            You&apos;ve done your welcome and main calls — nice work. One thing left
            before we can get you fully set up on the portal.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT — primary column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Next-action card with illustration */}
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="grid sm:grid-cols-[1fr_180px]">
              <div className="p-6 sm:p-8">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Calendar size={12} /> Your next step
                </div>
                <h2 className="mb-2 text-xl font-bold text-text sm:text-2xl">
                  {s.nextActionLabel}
                </h2>
                <p className="mb-5 text-sm leading-relaxed text-text-light">
                  A 30-minute walkthrough of the bits you&apos;ll actually use day to
                  day — receipts, invoices, salary. Pick whatever time works for you.
                </p>
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Choose a time <ArrowRight size={16} />
                </Link>
              </div>
              {/* Illustrated stage motif — pure SVG so no asset needed */}
              <div className="hidden items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10 p-6 sm:flex">
                <PortalLearningSvg />
              </div>
            </div>
          </div>

          {/* Journey timeline — visual roadmap, never collapsed */}
          <div className="rounded-3xl border border-border bg-white p-6 sm:p-8">
            <h3 className="mb-1 text-lg font-bold text-text">Your onboarding</h3>
            <p className="mb-6 text-sm text-text-light">
              Six steps to get you fully set up. Two down, four to go.
            </p>
            <ol className="relative ml-3 border-l-2 border-border">
              {s.stages.map((st) => (
                <li key={st.key} className="relative mb-6 ml-6 last:mb-0">
                  <span
                    className={`absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white ${
                      st.state === "complete"
                        ? "bg-primary text-white"
                        : st.state === "current"
                          ? "bg-secondary text-white"
                          : "bg-bg-soft text-text-light"
                    }`}
                  >
                    {st.state === "complete" ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <span className="text-xs font-bold">{st.stageNumber}</span>
                    )}
                  </span>
                  <div className={st.state === "upcoming" ? "opacity-60" : ""}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold text-text">{st.title}</h4>
                      {st.state === "complete" && (
                        <span className="text-xs font-medium text-primary">
                          ✓ Done {formatDate(st.completedDate ?? "")}
                        </span>
                      )}
                      {st.state === "current" && st.isOverdue && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                          Needs you
                        </span>
                      )}
                    </div>
                    {st.state === "current" && (
                      <p className="mt-1 text-xs text-text-light">
                        Pick a time to keep things moving.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* RIGHT — rail */}
        <aside className="space-y-6">
          {/* Accountant card — photo prominent */}
          <div className="overflow-hidden rounded-3xl border border-border bg-white">
            <div className="relative h-24 bg-gradient-to-br from-primary to-primary-dark">
              <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
                <ShieldCheck size={12} /> Verified
              </div>
            </div>
            <div className="-mt-12 px-6 pb-6 text-center">
              {a.photoUrl && (
                <Image
                  src={a.photoUrl}
                  width={96}
                  height={96}
                  alt={a.name ?? "Accountant"}
                  className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                />
              )}
              <div className="mt-3 text-xs font-medium uppercase tracking-wider text-text-light">
                Your accountant
              </div>
              <div className="mt-1 text-lg font-bold text-text">{a.name}</div>
              <div className="text-sm text-text-light">at Clever Accounts</div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark">
                  <Calendar size={13} /> Book
                </button>
                <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-bg-soft px-3 py-2 text-xs font-semibold text-text transition hover:bg-bg">
                  <MessageSquare size={13} /> Message
                </button>
              </div>
            </div>
          </div>

          {/* Things to know — soft formal tasks */}
          <div className="rounded-3xl border border-border bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-text">Things to know</h3>
            <ul className="space-y-3">
              {s.tasks.map((t) => (
                <li key={t.key} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                      t.state === "awaiting_us"
                        ? "bg-blue-50 text-blue-600"
                        : t.isUrgent
                          ? "bg-orange-50 text-orange-600"
                          : "bg-bg-soft text-text-light"
                    }`}
                  >
                    {t.key === "engagement_letter" ? <FileText size={14} /> : <ShieldCheck size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text">{t.title}</div>
                    {t.state === "awaiting_us" ? (
                      <div className="mt-0.5 text-xs text-text-light">
                        We&apos;ll email this shortly · no action needed
                      </div>
                    ) : t.actionLabel ? (
                      <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Mail size={11} /> {t.actionLabel}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PortalLearningSvg() {
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32" fill="none" aria-hidden>
      {/* Laptop body */}
      <rect x="18" y="38" width="84" height="52" rx="4" fill="#fff" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
      <rect x="22" y="42" width="76" height="42" rx="2" fill="currentColor" className="text-primary/10" />
      <rect x="10" y="90" width="100" height="6" rx="3" fill="currentColor" className="text-primary/30" />
      {/* Chart on screen */}
      <path d="M28 78 L40 64 L52 72 L64 56 L76 60 L88 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" fill="none" />
      <circle cx="88" cy="50" r="3" fill="currentColor" className="text-secondary" />
      {/* Speech ping */}
      <circle cx="95" cy="28" r="14" fill="currentColor" className="text-secondary/15" />
      <circle cx="95" cy="28" r="6" fill="currentColor" className="text-secondary" />
    </svg>
  );
}

function PreviewBadge({ variant, label }: { variant: string; label: string }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-xs">
      <span className="font-mono font-semibold text-orange-700">
        Preview {variant} · {label}
      </span>
      <div className="flex gap-2">
        <Link href="/portal/preview/a" className="text-orange-700 underline">
          ← A
        </Link>
        <Link href="/portal/preview" className="text-orange-700 underline">
          back
        </Link>
        <Link href="/portal/preview/c" className="text-orange-700 underline">
          C →
        </Link>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
