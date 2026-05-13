import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Instrument_Serif } from "next/font/google";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"] });

/**
 * Index page for the portal-dashboard redesign mockups.
 *
 * Three groups now:
 *  · STUNNING (C1, C2, C3) — expanded concierge directions, full-design
 *  · CONCIERGE BASE (C)    — original concierge for reference
 *  · MINIMAL (A, B)        — too-plain alternatives, kept as comparison
 *
 * Once a direction is picked we'll port the chosen variant's components into
 * `src/components/portal/*` and replace the dashboard page.
 */

const STUNNING = [
  {
    slug: "c1",
    name: "Editorial",
    tag: "Magazine layout",
    summary:
      "Full-bleed portrait of Charlie hero, massive Instrument Serif headline, two-column body with drop caps and pull-quotes. Reads like a luxury hotel landing page.",
    references: "Hôtel Costes · Aesop · NYT Style",
    feels: ["Confident", "Considered", "Premium"],
  },
  {
    slug: "c2",
    name: "Bento mosaic",
    tag: "Apple-inspired",
    summary:
      "Asymmetric grid of cards in varying sizes. Hero CTA card spans 4 cols dark; accountant portrait spans 2 rows; bright tile for action-needed; calm tile for engagement letter. Mix of light, dark, and brand-gradient cards.",
    references: "apple.com/macbook-pro · notion · framer · cron · arc browser",
    feels: ["Modern", "Tactile", "Premium-tech"],
  },
  {
    slug: "c3",
    name: "Aurora glass",
    tag: "2026 fintech",
    summary:
      "Dark base with animated gradient mesh aurora behind everything. Glass cards (backdrop-blur). Big display type. Brand-coloured glows on hover. Status pill with pulse dot. Activity feed in 4-up.",
    references: "Linear · Vercel · Arc · Cron · Loom 2026 · Stripe Atlas",
    feels: ["Futuristic", "Technical", "High-design"],
  },
];

const REFERENCE = [
  { slug: "c", name: "Concierge base", note: "Original concierge — restrained" },
  { slug: "a", name: "Linear minimal", note: "Plain — for comparison" },
  { slug: "b", name: "Warm consumer", note: "Soft — for comparison" },
];

export default function PreviewIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/40">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Banner */}
        <div className="mb-8 rounded-lg border border-dashed border-amber-400/60 bg-amber-50/50 px-4 py-3 text-sm">
          <p className="font-mono font-semibold text-amber-800">
            Portal dashboard redesign — preview gallery
          </p>
          <p className="mt-1 text-amber-700/80">
            Mock data, no SF calls. Sign-in required to reach these routes.
            Pick a direction and we&apos;ll port it into the real dashboard.
          </p>
        </div>

        <header className="mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700">
            <Sparkles size={12} /> New — expanded directions
          </div>
          <h1
            className={`${display.className} text-5xl text-stone-900 sm:text-6xl`}
          >
            Three stunning directions.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-stone-600">
            Each takes the concierge feel of variant C and pushes it
            substantially harder — proper display typography, full-bleed
            photography, bento layouts, glassmorphism. Each is a complete
            visual identity, not a tweak.
          </p>
        </header>

        {/* STUNNING — big cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {STUNNING.map((v, idx) => (
            <Link
              key={v.slug}
              href={`/portal/preview/${v.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-stone-900 hover:shadow-2xl"
            >
              {/* Coloured corner accent */}
              <div
                className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity group-hover:opacity-100 ${
                  idx === 0
                    ? "bg-amber-500/30"
                    : idx === 1
                      ? "bg-blue-500/30"
                      : "bg-violet-500/30"
                } opacity-60`}
              />

              <div className="relative flex flex-1 flex-col">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-stone-900 px-2 py-0.5 text-xs font-bold text-white">
                    {v.slug.toUpperCase()}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-stone-500">
                    {v.tag}
                  </span>
                </div>

                <h2
                  className={`${display.className} text-3xl text-stone-900 group-hover:text-amber-700`}
                >
                  {v.name}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {v.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {v.feels.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-stone-200 px-2 py-0.5 text-xs text-stone-600"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <div className="text-xs uppercase tracking-wider text-stone-400">
                    Inspired by
                  </div>
                  <div className="mt-1 text-xs text-stone-600">{v.references}</div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                  <span className="text-sm font-semibold text-stone-900">
                    See it live
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-stone-400 transition group-hover:translate-x-1 group-hover:text-amber-700"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* REFERENCE — smaller */}
        <div className="mt-16">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Earlier drafts — for comparison
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {REFERENCE.map((v) => (
              <Link
                key={v.slug}
                href={`/portal/preview/${v.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white/60 px-5 py-4 transition hover:border-stone-400 hover:bg-white"
              >
                <div>
                  <div className="text-sm font-semibold text-stone-900 group-hover:text-stone-700">
                    {v.slug.toUpperCase()} — {v.name}
                  </div>
                  <div className="text-xs text-stone-500">{v.note}</div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-stone-400 transition group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <h4 className="text-sm font-semibold text-stone-900">
            What&apos;s real in these mockups
          </h4>
          <ul className="mt-2 space-y-1 text-xs text-stone-600">
            <li>
              · Charlie&apos;s photo is from Pravatar (placeholder face generator).
              Real version pulls from Salesforce <code className="rounded bg-stone-100 px-1.5 py-0.5">User.FullPhotoUrl</code>.
            </li>
            <li>
              · Display font: <strong>Instrument Serif</strong> (Google Fonts, free).
              Production may swap for Spectral, Tiempos, or Söhne.
            </li>
            <li>
              · No real SF / Postgres / Clerk calls — all hardcoded mock data
              so the previews load instantly.
            </li>
            <li>
              · The aurora gradient mesh in C3 is pure CSS (radial-gradient
              layers). Could be replaced with a Three.js shader for real motion.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
