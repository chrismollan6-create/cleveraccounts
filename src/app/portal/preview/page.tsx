import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Index page for the three portal-dashboard redesign mockups.
 *
 * Each variant lives under `/portal/preview/[a|b|c]`. They share mock data
 * from `_mock.ts` so they render without SF / Postgres / Clerk dependencies
 * (Clerk auth is still required to reach this route — the previews aren't
 * publicly accessible).
 *
 * Once a direction is picked we'll port the chosen variant's components into
 * `src/components/portal/*` and replace the dashboard page.
 */

const VARIANTS = [
  {
    slug: "a",
    name: "Linear minimal",
    summary: "Single column, monochrome, no KPI cards. One thing per screen.",
    references: "Linear · Vercel · Mercury Bank",
    tradeoffs: [
      "Cleanest, lowest cognitive load",
      "Coldest — least personality",
      "Easiest to ship (closest to current components)",
    ],
  },
  {
    slug: "b",
    name: "Warm consumer",
    summary: "Gradient hero, illustrated stage motif, accountant photo prominent in a side rail.",
    references: "Monzo · Calendly · Notion onboarding",
    tradeoffs: [
      "Warmest, most personality",
      "Most decoration — risk of looking dated faster",
      "Needs one stage illustration per stage type",
    ],
  },
  {
    slug: "c",
    name: "Premium concierge",
    summary: "Editorial serif headings, big accountant photo, horizontal journey, activity feed.",
    references: "Mercury Bank · FT Wealth · Patreon creator",
    tradeoffs: [
      "Most distinctive — looks unlike any other accountancy portal",
      "Heaviest visual weight — Charlie's photo is a real photo (not generic stock)",
      "Needs a serif webfont and 4:5 photos of every accountant",
    ],
  },
];

export default function PreviewIndex() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 rounded-lg border border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-sm">
        <p className="font-mono font-semibold text-orange-700">
          Portal dashboard redesign — preview gallery
        </p>
        <p className="mt-1 text-orange-700/80">
          Each variant shows the dashboard reskinned. Mock data; no SF calls.
          Pick one and we&apos;ll port it into the real dashboard.
        </p>
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-text">
        Three directions
      </h1>
      <p className="mb-10 text-text-light">
        Click through to see each rendered. The current dashboard at{" "}
        <Link href="/dashboard" className="text-primary underline">
          /dashboard
        </Link>{" "}
        is the &ldquo;before&rdquo; for comparison.
      </p>

      <div className="space-y-4">
        {VARIANTS.map((v) => (
          <Link
            key={v.slug}
            href={`/portal/preview/${v.slug}`}
            className="group block rounded-2xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
                    {v.slug.toUpperCase()}
                  </span>
                  <h2 className="text-xl font-bold text-text group-hover:text-primary">
                    {v.name}
                  </h2>
                </div>
                <p className="mt-2 text-sm text-text-light">{v.summary}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-text-light">
                  Like: {v.references}
                </p>
                <ul className="mt-3 space-y-1">
                  {v.tradeoffs.map((t, i) => (
                    <li key={i} className="text-xs text-text-light">
                      · {t}
                    </li>
                  ))}
                </ul>
              </div>
              <ArrowRight
                size={20}
                className="mt-1 text-text-light transition group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-text-light">
        Tip: open three browser tabs side-by-side and compare. The Pravatar
        photo for Charlie is a placeholder; the real version pulls from
        Salesforce <code className="rounded bg-bg-soft px-1.5 py-0.5">User.FullPhotoUrl</code>.
      </p>
    </div>
  );
}
