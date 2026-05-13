import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Check,
  Sparkles,
  TrendingUp,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  Building2,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Variant C2 — "Bento" (Apple-inspired mosaic).
 *
 * Asymmetric grid of cards in varying sizes — like Apple's product pages or
 * Notion's feature mosaics. Each tile is purposeful and beautifully designed.
 * Mix of light and dark cards in the same view creates rhythm.
 *
 * Reference points: apple.com/macbook-pro, notion.so/features, framer.com,
 * arc browser landing page, cron.com.
 */
export default function PreviewC2() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className={`${body.className} bg-neutral-100 min-h-screen`}>
      <PreviewBadge variant="C2" label="Bento mosaic" next="c3" prev="c1" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header — minimal, real estate goes to the tiles */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Good evening</p>
            <h1
              className={`${display.className} text-5xl text-neutral-900 sm:text-6xl`}
            >
              {MOCK_FIRST_NAME}
            </h1>
          </div>
          <div className="hidden text-right text-xs uppercase tracking-wider text-neutral-400 sm:block">
            Stage {s.stageNumber} of {s.totalStages}
            <div className="mt-1 font-semibold text-neutral-900">
              {s.stageTitle}
            </div>
          </div>
        </header>

        {/* ─── BENTO GRID ─── */}
        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5">
          {/* HERO TILE — next step. Spans full width, dark background */}
          <div className="group relative col-span-1 row-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-8 text-white shadow-xl sm:col-span-4 sm:p-10">
            {/* Soft glow */}
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  <Sparkles size={12} className="text-amber-300" />
                  Your next step
                </div>
                <h2
                  className={`${display.className} max-w-md text-4xl leading-[1.1] sm:text-5xl md:text-6xl`}
                >
                  {s.nextActionLabel}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
                  A 30-minute walk-through with Charlie covering everything
                  you&apos;ll touch day-to-day. Pick whatever time suits.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={a.calendlyUrl ?? "#"}
                  className="group/btn inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-amber-100"
                >
                  Pick a time
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </Link>
                <div className="inline-flex items-center gap-2 text-xs text-white/50">
                  <Clock size={12} /> About 30 minutes
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNTANT TILE — portrait. Spans 2 cols, 2 rows */}
          <div className="group relative col-span-1 row-span-2 overflow-hidden rounded-3xl bg-white shadow-md sm:col-span-2">
            <div className="absolute inset-0">
              {a.photoUrl && (
                <Image
                  src={a.photoUrl.replace("300", "600")}
                  fill
                  alt={a.name ?? ""}
                  sizes="(max-width: 640px) 100vw, 350px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            </div>
            <div className="relative flex h-full flex-col justify-end p-6 text-white">
              <div className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/80">
                <ShieldCheck size={12} /> Your accountant
              </div>
              <div
                className={`${display.className} text-3xl leading-none`}
              >
                {a.name}
              </div>
              <div className="mt-1 text-sm text-white/70">
                Senior accountant, Manchester
              </div>
              <div className="mt-5 flex gap-2">
                <button className="flex-1 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-stone-900 backdrop-blur transition hover:bg-white">
                  Book
                </button>
                <button className="flex-1 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* PROGRESS TILE — chart-ish, brand-coloured */}
          <div className="col-span-1 rounded-3xl bg-white p-6 shadow-md sm:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Onboarding
                </div>
                <div
                  className={`${display.className} mt-1 text-5xl text-neutral-900`}
                >
                  {pct}%
                </div>
                <div className="text-sm text-neutral-500">
                  {completed} of {s.totalStages} steps complete
                </div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-5 flex gap-1">
              {s.stages.map((st) => (
                <div
                  key={st.key}
                  className={`h-2 flex-1 rounded-full ${
                    st.state === "complete"
                      ? "bg-emerald-500"
                      : st.state === "current"
                        ? "bg-amber-400"
                        : "bg-neutral-200"
                  }`}
                  title={st.title}
                />
              ))}
            </div>
          </div>

          {/* ACTION-NEEDED TILE — needs you, urgent */}
          <div className="relative col-span-1 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-md sm:col-span-2">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                <Mail size={11} /> Needs you
              </div>
              <h3
                className={`${display.className} text-2xl leading-tight`}
              >
                Verify your identity
              </h3>
              <p className="mt-2 text-sm text-white/85">
                Two-minute selfie + photo ID via Credas. Check your inbox.
              </p>
              <button className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-700">
                Open email <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* ENGAGEMENT-LETTER TILE — calm, pending */}
          <div className="relative col-span-1 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:col-span-2">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={18} />
            </div>
            <h3
              className={`${display.className} text-2xl leading-tight text-neutral-900`}
            >
              Engagement letter
            </h3>
            <p className="mt-2 text-sm text-neutral-500">
              We&apos;re drafting your letter now. We&apos;ll email it for
              signing in the next day or two.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400">
              <Clock size={11} /> No action needed
            </div>
          </div>

          {/* JOURNEY TILE — vertical stepper, narrow */}
          <div className="col-span-1 row-span-2 rounded-3xl bg-white p-6 shadow-md sm:col-span-2">
            <div className="mb-5 flex items-baseline justify-between">
              <div
                className={`${display.className} text-2xl text-neutral-900`}
              >
                Your journey
              </div>
              <span className="text-xs text-neutral-400">
                6 stages
              </span>
            </div>
            <ol className="space-y-3.5">
              {s.stages.map((st) => (
                <li key={st.key} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      st.state === "complete"
                        ? "bg-emerald-500 text-white"
                        : st.state === "current"
                          ? "border-2 border-amber-500 bg-amber-50 text-amber-700"
                          : "border border-neutral-200 bg-neutral-50 text-neutral-400"
                    }`}
                  >
                    {st.state === "complete" ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      st.stageNumber
                    )}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div
                      className={`text-sm font-medium ${st.state === "upcoming" ? "text-neutral-400" : "text-neutral-900"}`}
                    >
                      {st.title}
                    </div>
                    {st.state === "complete" && st.completedDate && (
                      <div className="text-xs text-neutral-400">
                        Done {formatDate(st.completedDate)}
                      </div>
                    )}
                    {st.state === "current" && (
                      <div className="text-xs font-medium text-amber-600">
                        Up next
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* COMPANY TILE — your business */}
          <div className="col-span-1 rounded-3xl bg-neutral-900 p-6 text-white shadow-md sm:col-span-2">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Building2 size={18} />
            </div>
            <div className="text-xs uppercase tracking-wider text-white/60">
              Your business
            </div>
            <div
              className={`${display.className} mt-1 text-2xl leading-tight`}
            >
              {s.accountName}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-white/50">With us since</div>
                <div className="mt-0.5 font-semibold">29 Mar 2026</div>
              </div>
              <div>
                <div className="text-white/50">Days in</div>
                <div className="mt-0.5 font-semibold">{s.daysSinceSignup}</div>
              </div>
            </div>
          </div>

          {/* CONTACT TILE — quick actions */}
          <div className="col-span-1 rounded-3xl bg-white p-6 shadow-md sm:col-span-2">
            <div
              className={`${display.className} text-2xl text-neutral-900`}
            >
              Get in touch
            </div>
            <div className="mt-4 space-y-2">
              <button className="flex w-full items-center justify-between rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-700">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} /> Book a call
                </span>
                <ArrowUpRight size={14} />
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900">
                <span className="inline-flex items-center gap-2">
                  <MessageSquare size={14} /> Message
                </span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs uppercase tracking-wider text-neutral-400">
          Clever Accounts · Encrypted & secure portal
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
    <div className="border-b border-neutral-200 bg-white px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
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
