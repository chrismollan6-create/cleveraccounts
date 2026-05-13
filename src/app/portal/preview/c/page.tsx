import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

/**
 * Variant C — "Premium concierge".
 *
 * Design language: editorial typography, restrained palette, big photo of
 * the accountant, journey as a horizontal stepper not a vertical list. Feels
 * less like an app dashboard and more like a curated relationship page.
 *
 * Reference points: Mercury Bank, FT Wealth, Patreon creator dashboard,
 * Pitch decks. The tone is "you have a relationship with a person", not
 * "here is your kanban board".
 */
export default function PreviewC() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <PreviewBadge variant="C" label="Premium concierge" />

      {/* Editorial header — serif greeting, sans body */}
      <header className="mb-12 border-b border-border pb-12">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-text-light">
          Tuesday, 13 May 2026 · Clever Accounts
        </div>
        <h1 className="mt-4 font-serif text-5xl font-medium tracking-tight text-text sm:text-6xl">
          Good evening, {MOCK_FIRST_NAME}.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-light">
          Two of your six onboarding steps are complete. Charlie has one thing
          they&apos;d like you to do next — picking a time for your portal training.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        {/* MAIN COLUMN */}
        <main className="space-y-12">
          {/* Next action — calm card, generous padding */}
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-medium text-text">
                Your next step
              </h2>
              <span className="text-xs font-medium uppercase tracking-wider text-text-light">
                Stage {s.stageNumber} / {s.totalStages}
              </span>
            </div>
            <div className="rounded-2xl bg-dark p-10 text-white">
              <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-serif text-3xl font-medium leading-tight">
                    {s.nextActionLabel}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                    A 30-minute walkthrough where we show you how to invoice
                    clients, log receipts, and pay yourself. Charlie will run
                    you through everything.
                  </p>
                </div>
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="group inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:bg-secondary hover:text-white"
                >
                  Pick a time
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Horizontal journey — visual roadmap, not a vertical list */}
          <section>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-medium text-text">
                Your onboarding journey
              </h2>
              <span className="text-xs font-medium uppercase tracking-wider text-text-light">
                {pct}% complete
              </span>
            </div>
            <div className="relative">
              {/* Horizontal track line */}
              <div className="absolute left-0 right-0 top-5 h-px bg-border" />
              <div
                className="absolute left-0 top-5 h-px bg-primary transition-all"
                style={{ width: `${(completed / (s.totalStages - 1)) * 100}%` }}
              />
              <ol className="relative grid grid-cols-6 gap-2">
                {s.stages.map((st) => (
                  <li key={st.key} className="text-center">
                    <div className="mx-auto flex items-center justify-center">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          st.state === "complete"
                            ? "border-primary bg-primary text-white"
                            : st.state === "current"
                              ? "border-primary bg-white text-primary"
                              : "border-border bg-white text-text-light"
                        }`}
                      >
                        <span className="text-xs font-bold">{st.stageNumber}</span>
                      </span>
                    </div>
                    <div className="mt-3 text-xs font-medium text-text">{st.title}</div>
                    {st.state === "complete" && st.completedDate && (
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-light">
                        {formatDate(st.completedDate)}
                      </div>
                    )}
                    {st.state === "current" && (
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Now
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Updates feed — what's happening on your side */}
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-medium text-text">Recent activity</h2>
              <Link href="#" className="text-xs font-medium text-primary hover:underline">
                See all
              </Link>
            </div>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-white">
              {[
                { when: "Today", what: "Identity verification email sent", who: "Credas" },
                { when: "Yesterday", what: "Main onboarding call completed", who: "Charlie McAuley" },
                { when: "30 Mar", what: "Welcome call completed", who: "Charlie McAuley" },
                { when: "29 Mar", what: "Account created", who: "You" },
              ].map((row, i) => (
                <li key={i} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-text">{row.what}</div>
                    <div className="text-xs text-text-light">{row.who}</div>
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider text-text-light">
                    {row.when}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {/* SIDE COLUMN — Charlie, big photo, contact options */}
        <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
          <section>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-light">
              Your accountant
            </h3>
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              {a.photoUrl && (
                <div className="relative aspect-[4/5]">
                  <Image
                    src={a.photoUrl}
                    fill
                    alt={a.name ?? "Accountant"}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="font-serif text-xl font-medium text-text">{a.name}</div>
                <div className="text-xs uppercase tracking-wider text-text-light">
                  Senior accountant · Joined 2021
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-light">
                  &ldquo;I look after about 80 clients across IT contractors and
                  small consultancies. Drop me a message any time.&rdquo;
                </p>

                <div className="mt-5 space-y-2">
                  <button className="group flex w-full items-center justify-between rounded-xl bg-dark px-4 py-3 text-sm font-medium text-white transition hover:bg-primary">
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={14} /> Book a call
                    </span>
                    <ChevronRight size={14} className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                  <button className="group flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
                    <span className="inline-flex items-center gap-2">
                      <MessageSquare size={14} /> Send a message
                    </span>
                    <ChevronRight size={14} className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                  <button className="group flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
                    <span className="inline-flex items-center gap-2">
                      <PhoneCall size={14} /> Request a callback
                    </span>
                    <ChevronRight size={14} className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-bg-soft p-5">
            <h3 className="font-serif text-base font-medium text-text">
              Awaiting Clever Accounts
            </h3>
            <ul className="mt-3 space-y-2">
              {s.tasks
                .filter((t) => t.state === "awaiting_us")
                .map((t) => (
                  <li key={t.key} className="text-sm text-text-light">
                    · {t.title}
                  </li>
                ))}
            </ul>
            <h3 className="mt-5 font-serif text-base font-medium text-text">
              Awaiting you
            </h3>
            <ul className="mt-3 space-y-2">
              {s.tasks
                .filter((t) => t.state !== "awaiting_us" && t.state !== "complete")
                .map((t) => (
                  <li key={t.key} className="text-sm text-text-light">
                    · {t.title}
                    {t.actionLabel && (
                      <span className="ml-1 text-primary">— {t.actionLabel}</span>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>
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
        <Link href="/portal/preview/b" className="text-orange-700 underline">
          ← B
        </Link>
        <Link href="/portal/preview" className="text-orange-700 underline">
          back
        </Link>
        <Link href="/portal/preview/a" className="text-orange-700 underline">
          A →
        </Link>
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
