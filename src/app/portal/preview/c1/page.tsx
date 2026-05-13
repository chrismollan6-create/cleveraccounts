import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  PhoneCall,
  Award,
  MapPin,
} from "lucide-react";
import { MOCK_STATUS, MOCK_FIRST_NAME } from "../_mock";

const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

/**
 * Variant C1 — "Editorial".
 *
 * Magazine layout. Full-bleed hero portrait of the accountant overlaid with
 * a massive Instrument Serif headline. Two-column body, pull-quotes, restrained
 * monochrome with brand accents. Reads like a luxury hotel landing page, not
 * a SaaS dashboard.
 *
 * Reference points: Hôtel Costes, Aesop, The New York Times Style, Mercury
 * Wealth, The Continuum (FT).
 */
export default function PreviewC1() {
  const s = MOCK_STATUS;
  const a = s.accountant;
  const completed = s.stages.filter((st) => st.state === "complete").length;
  const pct = Math.round((completed / s.totalStages) * 100);

  return (
    <div className={`${body.className} bg-stone-50`}>
      <PreviewBadge variant="C1" label="Editorial" next="c2" prev="c" />

      {/* ─── HERO ── full-bleed portrait with magazine-style overlay ─── */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[820px] w-full overflow-hidden bg-stone-900">
        {a.photoUrl && (
          <Image
            src={a.photoUrl.replace("300", "1200")}
            alt={a.name ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_top] opacity-90"
          />
        )}
        {/* Diagonal gradient — dark left → transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/85 via-stone-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/80" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-12 sm:px-10 sm:py-16">
          {/* Top bar — editorial masthead */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-white" />
              <span className="text-xs uppercase tracking-[0.35em]">
                Clever Accounts · Your Portal
              </span>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/70">
              13 May 2026
            </div>
          </div>

          {/* Bottom — the actual content */}
          <div className="max-w-3xl text-white">
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/80">
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                Stage {s.stageNumber} / {s.totalStages}
              </span>
              <span>Portal Training</span>
            </div>
            <h1
              className={`${display.className} text-6xl leading-[1.05] tracking-tight sm:text-7xl md:text-[88px]`}
            >
              Good evening,
              <br />
              <span className="italic text-amber-100">{MOCK_FIRST_NAME}.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Charlie has set aside time this week to walk you through the
              portal. Pick whichever slot suits you — the rest looks after
              itself.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={a.calendlyUrl ?? "#"}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-amber-50"
              >
                Choose a time with Charlie
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                <MessageSquare size={15} /> Send him a message
              </button>
            </div>
          </div>
        </div>

        {/* Accountant chip — bottom right of hero */}
        <div className="absolute bottom-12 right-12 hidden items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-xl md:flex">
          {a.photoUrl && (
            <Image
              src={a.photoUrl}
              width={44}
              height={44}
              alt=""
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/30"
            />
          )}
          <div className="text-white">
            <div className="text-xs uppercase tracking-wider text-white/70">
              Your accountant
            </div>
            <div className="text-sm font-semibold">{a.name}</div>
          </div>
        </div>
      </section>

      {/* ─── BODY — magazine-style two columns + sidebar ─── */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* Left — narrative */}
          <article>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-700">
              The story so far
            </p>
            <h2
              className={`${display.className} mb-8 text-5xl leading-[1.05] text-stone-900 sm:text-6xl`}
            >
              You&apos;re a third of the way there.
            </h2>

            <div className="grid gap-8 text-stone-700 sm:grid-cols-2">
              <p className="text-lg leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:leading-[0.85] first-letter:text-amber-700">
                You signed up on{" "}
                <span className="font-semibold text-stone-900">29 March</span>{" "}
                and we&apos;ve since had two onboarding calls together. The
                welcome call was to get the basics straight; the main call to
                map out exactly how your business runs and what you need from
                us.
              </p>
              <p className="text-lg leading-relaxed">
                Next up is portal training — about 30 minutes with Charlie
                showing you how to log expenses, raise invoices, and pay
                yourself a salary. Once that&apos;s in your toolbox the rest is
                routine.
              </p>
            </div>

            {/* Pull quote */}
            <figure className="my-16 border-l-4 border-amber-700 pl-8">
              <blockquote
                className={`${display.className} text-3xl leading-tight text-stone-900`}
              >
                &ldquo;I look after about 80 clients. I&apos;ll know your
                business by name within a fortnight — that&apos;s the
                promise.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-stone-500">
                — {a.name}, your accountant
              </figcaption>
            </figure>

            {/* Stage timeline as elegant horizontal */}
            <div>
              <h3
                className={`${display.className} mb-6 text-3xl text-stone-900`}
              >
                Your journey
              </h3>
              <div className="relative">
                <div className="absolute left-0 right-0 top-4 h-px bg-stone-200" />
                <div
                  className="absolute left-0 top-4 h-px bg-amber-700"
                  style={{ width: `${(completed / (s.totalStages - 1)) * 100}%` }}
                />
                <ol className="relative grid grid-cols-6 gap-1">
                  {s.stages.map((st) => (
                    <li key={st.key} className="text-center">
                      <div className="mx-auto flex justify-center">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            st.state === "complete"
                              ? "bg-amber-700 text-white"
                              : st.state === "current"
                                ? "border-2 border-amber-700 bg-stone-50 text-amber-700"
                                : "border border-stone-300 bg-stone-50 text-stone-400"
                          }`}
                        >
                          {st.stageNumber}
                        </span>
                      </div>
                      <div
                        className={`mt-3 text-xs font-medium ${st.state === "upcoming" ? "text-stone-400" : "text-stone-700"}`}
                      >
                        {st.title}
                      </div>
                      {st.state === "complete" && st.completedDate && (
                        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-stone-400">
                          {formatDate(st.completedDate)}
                        </div>
                      )}
                      {st.state === "current" && (
                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                          You are here
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>

          {/* Right — sidebar — about Charlie + status */}
          <aside className="space-y-10 lg:sticky lg:top-8 lg:self-start">
            {/* Charlie's "card" — like a press credit */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">
                About Charlie
              </p>
              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-2">
                  <Award size={14} className="mt-1 text-amber-700" />
                  <span>ACA-qualified · 7 years at Clever</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-1 text-amber-700" />
                  <span>Based in Manchester · works UK-wide</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="mt-1 text-amber-700" />
                  <span>Mon–Fri, 9–5 · usually replies same day</span>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">
                Currently
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <div className="text-stone-700">
                    Awaiting your engagement letter signature
                  </div>
                  <div className="text-xs text-stone-400">We&apos;ll send shortly</div>
                </li>
                <li>
                  <div className="text-amber-700">
                    Identity verification — needs you
                  </div>
                  <div className="text-xs text-stone-500">Check your email</div>
                </li>
              </ul>
            </div>

            <div className="border-t border-stone-200 pt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">
                Get in touch
              </p>
              <div className="space-y-2">
                <button className="flex w-full items-center justify-between rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-700">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={14} /> Book a call
                  </span>
                  <ArrowUpRight size={14} />
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-amber-700 hover:text-amber-700">
                  <span className="inline-flex items-center gap-2">
                    <MessageSquare size={14} /> Message
                  </span>
                  <ArrowUpRight size={14} />
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-amber-700 hover:text-amber-700">
                  <span className="inline-flex items-center gap-2">
                    <PhoneCall size={14} /> Callback
                  </span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer line */}
      <footer className="border-t border-stone-200 px-6 py-8 text-center text-xs uppercase tracking-[0.2em] text-stone-400">
        Clever Accounts · Established 2015 · Encrypted & secure portal
      </footer>
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
    <div className="border-b border-stone-200 bg-stone-100 px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="font-mono font-semibold text-stone-700">
          Preview {variant} · {label}
        </span>
        <div className="flex gap-3">
          <Link href={`/portal/preview/${prev}`} className="text-stone-600 underline">
            ← {prev.toUpperCase()}
          </Link>
          <Link href="/portal/preview" className="text-stone-600 underline">
            index
          </Link>
          <Link href={`/portal/preview/${next}`} className="text-stone-600 underline">
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
