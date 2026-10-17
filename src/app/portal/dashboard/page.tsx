import Link from "next/link";
import {
  ArrowRight,
  Check,
  Building2,
  Sparkles,
  HandHeart,
  Coffee,
  Laptop,
  TrendingUp,
  PartyPopper,
  MessageSquare,
  CalendarClock,
  FileText,
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { logPortalEvent } from "@/lib/portal/audit";
import {
  getOnboardingForCurrentUser,
  isOnboardingError,
} from "@/lib/portal/onboarding";
import { getDeadlinesForCurrentUser } from "@/lib/portal/deadlines";
import { getFinancialsForCurrentUser } from "@/lib/portal/financials";
import { headers } from "next/headers";
import { isNativeAppUA } from "@/lib/portal/native";
import NativeHome from "@/components/portal/native/NativeHome";
import AccessGate from "@/components/portal/AccessGate";
import type {
  PortalOnboardingStatus,
  PortalStageKey,
  PortalActionItem,
  PortalDeadline,
  PortalFinancials,
} from "@/lib/portal/types";
import AccountantAvatar from "@/components/portal/AccountantAvatar";
import { getActionItemsForCurrentUser } from "@/lib/portal/actionItems";
import {
  cumulativeThisPeriod,
  forecastPeriodEnd,
  latestMonthMovement,
  periodProgress,
  type CumulativePoint,
} from "@/lib/portal/financialsDerived";

export const dynamic = "force-dynamic";

/**
 * Dashboard — "Aurora" layout, ported live June 2026 (from preview D1),
 * re-disciplined October 2026 after the layout drifted off its own rules.
 *
 * The rules, restated because they were stated once and then broken:
 *
 *   · SAY EACH THING ONCE. The accountant lives in the persistent sidebar
 *     chip and NOWHERE else on this page — a hero accountant card put three
 *     of them on one screen. Onboarding progress is stated by JourneyBand
 *     here and the sidebar suppresses its own copy on this route.
 *   · ORANGE MEANS "THIS NEEDS YOU". It is the next-action CTA and the
 *     current stage marker, and nothing else. Counts, badges and structure
 *     use teal (#1A7A9B) or neutral. An accent that marks everything marks
 *     nothing.
 *   · DESIGN THE SETTLED STATE FIRST. Most clients are years past
 *     onboarding, so anything onboarding-shaped — the hero, the journey
 *     band — must disappear entirely when complete rather than turn into a
 *     permanent congratulation.
 *   · No trust badges. Assurance is a sessions list in Settings, not a pill.
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ Greeting                                      │
 *   │ Hero next-step  ← only while one exists       │
 *   │ Money band      ← the reason to log in        │
 *   │ Journey         ← only during onboarding      │
 *   │ Needs you / Deadlines   │ Recent activity     │
 *   │ Explore · Business                            │
 *   └──────────────────────────────────────────────┘
 */

const STAGE_META: Record<
  PortalStageKey | string,
  { icon: typeof Sparkles; duration: string; gist: string }
> = {
  welcome: {
    icon: HandHeart,
    duration: "20 min",
    gist: "Meet your accountant, share what your business does, hear how Clever works.",
  },
  main: {
    icon: Coffee,
    duration: "45 min",
    gist: "Map the year ahead — VAT, salary, accounts dates, what you need from us.",
  },
  portal: {
    icon: Laptop,
    duration: "30 min",
    gist: "Hands-on walk-through of expenses, invoices, salary, and bank feeds.",
  },
  checkin30: {
    icon: TrendingUp,
    duration: "20 min",
    gist: "Two-week check after portal training — make sure everything's clicked.",
  },
  checkin60: {
    icon: TrendingUp,
    duration: "20 min",
    gist: "Second check — close the loop on anything still fiddly.",
  },
  catchup: {
    icon: PartyPopper,
    duration: "30 min",
    gist: "First quarterly review — your numbers, your goals, what to do next.",
  },
};

export default async function DashboardPage() {
  const [
    brand,
    portalUser,
    onboardingResult,
    actionItems,
    deadlinesRes,
    financialsRes,
    hdrs,
  ] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getOnboardingForCurrentUser(),
    getActionItemsForCurrentUser(),
    // Fail-soft — the dashboard never breaks over a deadlines read.
    getDeadlinesForCurrentUser().catch(() => null),
    getFinancialsForCurrentUser().catch(() => null),
    headers(),
  ]);
  // Running inside the Capacitor app → the immersive native Home, not the
  // web dashboard. Same data, different presentation (PortalShell drops its
  // title header for this route so the hero bleeds under the status bar).
  const isNativeApp = isNativeAppUA(hdrs.get("user-agent"));
  const deadlines =
    deadlinesRes && deadlinesRes.ok ? deadlinesRes.data : [];
  const financials =
    financialsRes && financialsRes.ok ? financialsRes.data : null;

  const firstName =
    portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  // Soft-block states
  if (
    portalUser &&
    (portalUser.status === "disabled" || portalUser.status === "pending")
  ) {
    void logPortalEvent({
      action: "access_gate_shown",
      target: portalUser.status,
      metadata: { email: portalUser.email },
    });
    return (
      <Shell>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </Shell>
    );
  }

  if (isOnboardingError(onboardingResult)) {
    void logPortalEvent({
      action: "dashboard_load_error",
      target: onboardingResult.error,
      metadata: {
        message: onboardingResult.message,
        status: onboardingResult.status,
      },
    });
    return (
      <Shell>
        <div className="max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-amber-900">
            We&apos;re having trouble loading your dashboard
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            {onboardingResult.message}
          </p>
        </div>
      </Shell>
    );
  }

  const status = onboardingResult.data;

  if (!status) {
    return (
      <Shell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="text-3xl font-bold text-text">
            Hi {firstName ?? "there"}
          </h1>
          <p className="mt-3 text-text-light">
            Your onboarding hasn&apos;t started yet. We&apos;ll be in touch
            shortly.
          </p>
          <a
            href={`mailto:${brand.supportEmail}`}
            className="mt-6 inline-block font-semibold text-primary hover:underline"
          >
            {brand.supportEmail}
          </a>
        </div>
      </Shell>
    );
  }

  void logPortalEvent({
    action: "view_dashboard",
    target: status.accountId,
    metadata: {
      currentStage: status.currentStage,
      stageNumber: status.stageNumber,
      blockedOn: status.blockedOn,
    },
  });

  // Native app → full-bleed immersive Home (no web Shell wash / max-width cap).
  if (isNativeApp) {
    return (
      <NativeHome
        brand={brand}
        status={status}
        firstName={firstName}
        firmName={brand.name}
        deadlines={deadlines}
        financials={financials}
      />
    );
  }

  return (
    <Shell>
      <DashboardBody
        status={status}
        actionItems={actionItems}
        deadlines={deadlines}
        financials={financials}
        firmName={brand.name}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Faint brand wash — teal top-left, orange top-right */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem]"
        style={{
          background:
            "radial-gradient(50% 100% at 22% 0%, rgb(26 122 155 / 0.07) 0%, transparent 68%), radial-gradient(52% 100% at 88% 0%, rgb(249 115 22 / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* Centred + capped so the content reads as a deliberate column rather
          than clinging to the sidebar with a dead gap on wide screens. */}
      <div className="relative mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

function DashboardBody({
  status,
  actionItems,
  deadlines,
  financials,
  firmName,
}: {
  status: PortalOnboardingStatus;
  actionItems: PortalActionItem[];
  deadlines: PortalDeadline[];
  financials: PortalFinancials | null;
  firmName: string;
}) {
  return (
    <>
      {/* MONEY leads. Not a greeting, not a booking banner — the figures are
          what a client opens the portal for, and everything that needs them is
          a row in the table below rather than a slab above it. */}
      <MoneySection financials={financials} />

      {/* ONE table: everything with a status and a due date, whether it's
          waiting on the client or on us. Replaces the old split of a "Needs
          you" card plus a separate "Coming up" card plus an activity feed —
          three panels answering one question. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_296px]">
        <NeedsAttentionTable
          items={actionItems}
          deadlines={deadlines}
          status={status}
        />
        <div className="flex flex-col gap-6">
          <AccountantRailCard status={status} />
          <ComingUpRail deadlines={deadlines} />
        </div>
      </div>

      {/* Onboarding detail sits BELOW the working surface. It matters for the
          first few weeks and never again; it shouldn't own the top of the
          screen for the years afterwards. */}
      {!status.isComplete && <JourneyBand status={status} />}

      <ExploreBand />
      <BusinessBand status={status} firmName={firmName} />
    </>
  );
}

// ─── NEEDS YOUR ATTENTION (single table) ─────────────────────────────────────

interface AttentionRow {
  id: string;
  title: string;
  detail: string | null;
  href: string;
  /** Short status chip. */
  status: string;
  /** True when the client has to do something — tints the row. */
  needsClient: boolean;
  dueLabel: string;
  action: string;
  primary?: boolean;
}

function dueLabelFor(iso: string | null, daysUntil: number | null): string {
  if (!iso) return "—";
  if (daysUntil != null && daysUntil < 0) return formatDate(iso);
  return formatDate(iso);
}

/**
 * Every open obligation in one fixed-layout table — 48px rows, status in the
 * middle, due date, one action per row. Rows waiting on the client are tinted
 * and counted in the header, so urgency is carried in place instead of being
 * duplicated into a banner above the table.
 *
 * The onboarding next step (book the welcome call) is folded in as the first
 * row rather than rendered as a full-width hero, so there is exactly one list
 * of things to do on this page.
 */
function NeedsAttentionTable({
  items,
  deadlines,
  status,
}: {
  items: PortalActionItem[];
  deadlines: PortalDeadline[];
  status: PortalOnboardingStatus;
}) {
  const rows: AttentionRow[] = [];

  // 1. The onboarding step, when there is one and it's on the client.
  if (!status.isComplete && status.nextActionLabel && status.blockedOn === "client") {
    rows.push({
      id: "onboarding",
      title: status.nextActionLabel,
      detail: `With ${status.accountant.name ?? "your accountant"}`,
      href: status.accountant.calendlyUrl ? "/portal/appointments" : "/portal/messages",
      status: "Book a time",
      needsClient: true,
      dueLabel: "—",
      action: "Choose a time",
      primary: true,
    });
  }

  // 2. Everything blocked on the client.
  for (const i of items) {
    rows.push({
      id: i.id,
      title: i.title,
      detail: i.detail,
      href: i.href,
      status: i.urgency === "overdue" ? "Overdue" : "Waiting on you",
      needsClient: true,
      dueLabel: dueLabelFor(i.dueDate, null),
      action: i.type === "approval" ? "Review" : "Open",
      primary: rows.length === 0,
    });
  }

  // 3. Deadlines we're handling — so the client can see the whole picture
  //    rather than only their own homework. Skip ones already listed above.
  const seen = new Set(rows.map((r) => r.title.toLowerCase()));
  for (const d of deadlines) {
    if (d.status === "submitted" || d.status === "filed") continue;
    if (seen.has(d.title.toLowerCase())) continue;
    if (d.blockedOn === "client") continue; // already covered by actionItems
    rows.push({
      id: d.id,
      title: d.title,
      detail: d.periodLabel,
      href: "/portal/deadlines",
      status: "With us",
      needsClient: false,
      dueLabel: dueLabelFor(d.dueDate, d.daysUntil),
      action: "View",
    });
  }

  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex h-[46px] items-center border-b border-neutral-100 px-5">
          <h2 className="text-[13.5px] font-semibold text-text">Needs your attention</h2>
        </div>
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-text">Nothing needs you</p>
          <p className="mt-1 text-[13px] text-text-light">
            Everything on your account is with us. We&apos;ll let you know the
            moment that changes.
          </p>
        </div>
      </section>
    );
  }

  const waiting = rows.filter((r) => r.needsClient).length;

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex h-[46px] items-center gap-2.5 border-b border-neutral-100 px-5">
        <h2 className="text-[13.5px] font-semibold text-text">Needs your attention</h2>
        {waiting > 0 && (
          <span className="text-xs text-text-light">
            {waiting} waiting on you
          </span>
        )}
        <span className="flex-1" />
        <Link
          href="/portal/deadlines"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col />
            <col className="w-[136px]" />
            <col className="w-[116px]" />
            <col className="w-[104px]" />
          </colgroup>
          <thead>
            <tr>
              <th className="h-[34px] px-5 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-text-light">
                Item
              </th>
              <th className="h-[34px] px-3 text-center text-[11px] font-semibold uppercase tracking-[0.07em] text-text-light">
                Status
              </th>
              <th className="h-[34px] px-3 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-text-light">
                Due
              </th>
              <th className="h-[34px] px-5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className={`border-t border-neutral-100 ${
                  r.needsClient ? "bg-orange-50/40" : "hover:bg-neutral-50"
                }`}
              >
                <td className="h-12 overflow-hidden px-5">
                  <span className="block truncate text-[13.5px] font-semibold leading-tight text-text">
                    {r.title}
                  </span>
                  {r.detail && (
                    <span className="block truncate text-[11.5px] leading-tight text-text-light">
                      {r.detail}
                    </span>
                  )}
                </td>
                <td className="h-12 px-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-[3px] text-[11.5px] font-semibold ${
                      r.needsClient
                        ? "bg-orange-100/70 text-orange-800 ring-1 ring-inset ring-orange-200"
                        : "bg-neutral-100 text-text-light"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="h-12 whitespace-nowrap px-3 text-[13px] text-text">
                  {r.dueLabel}
                </td>
                <td className="h-12 px-5 text-right">
                  <Link
                    href={r.href}
                    className={`inline-flex h-[26px] items-center rounded-lg px-2.5 text-xs font-semibold transition ${
                      r.primary
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "border border-neutral-200 text-text hover:border-neutral-400"
                    }`}
                  >
                    {r.action}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── RAIL ────────────────────────────────────────────────────────────────────

function AccountantRailCard({ status }: { status: PortalOnboardingStatus }) {
  const a = status.accountant;
  if (!a?.name) return null;
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <AccountantAvatar
          name={a.name}
          hasPhoto={Boolean(a.photoUrl)}
          sizeClass="h-9 w-9"
          textClass="text-xs"
        />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-text">{a.name}</div>
          <div className="truncate text-[11.5px] text-text-light">
            Your accountant · replies in ~2h
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href="/portal/appointments"
          className="flex h-[30px] flex-1 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary-dark"
        >
          Book a call
        </Link>
        <Link
          href="/portal/messages"
          className="flex h-[30px] flex-1 items-center justify-center rounded-lg border border-neutral-200 text-xs font-semibold text-text transition hover:border-neutral-400"
        >
          Message
        </Link>
      </div>
    </section>
  );
}

/** The next few dates, as a date-block list. Read-only context, not a to-do. */
function ComingUpRail({ deadlines }: { deadlines: PortalDeadline[] }) {
  const upcoming = deadlines
    .filter((d) => d.dueDate && d.status !== "submitted" && d.status !== "filed")
    .filter((d) => (d.daysUntil ?? 0) >= 0)
    .sort((x, y) => (x.daysUntil ?? 0) - (y.daysUntil ?? 0))
    .slice(0, 4);
  if (upcoming.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex h-[46px] items-center border-b border-neutral-100 px-5">
        <h2 className="text-[13.5px] font-semibold text-text">Coming up</h2>
      </div>
      <ul className="py-1.5">
        {upcoming.map((d) => {
          const dt = d.dueDate ? new Date(d.dueDate) : null;
          return (
            <li key={d.id} className="flex items-center gap-3 px-5 py-2.5">
              <span className="w-[34px] flex-none text-center">
                <span className="block text-[15px] font-bold leading-tight text-text tabular-nums">
                  {dt ? String(dt.getDate()).padStart(2, "0") : "—"}
                </span>
                <span className="block text-[10.5px] uppercase tracking-wide text-text-light">
                  {dt ? dt.toLocaleDateString("en-GB", { month: "short" }) : ""}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-text">
                  {d.title}
                </span>
                <span className="block truncate text-[11.5px] text-text-light">
                  {d.periodLabel ? `${d.periodLabel} · ` : ""}
                  {d.blockedOn === "client" ? "needs you" : "with us"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * MONEY — the lead figure, the one chart, and a uniform KPI strip.
 *
 * Rebuilt Oct 2026 against published dashboard conventions. Three rules it is
 * now held to, each of which the previous version broke:
 *
 *   · ONE visual for the section. A captioned cumulative chart next to the
 *     lead figure. The KPI cards carry no sparklines, because cash has no
 *     monthly series behind it and a strip where one card has a chart and the
 *     next has a sentence has no rhythm.
 *   · EVERY card has the identical shape — label, figure, one line of
 *     context — so the row reads as a set rather than as four leftovers.
 *   · NOTHING is shown that can't be derived honestly. There is no
 *     year-on-year comparison here, because the trend window is 12 months and
 *     a prior year isn't in it. See financialsDerived.ts.
 *
 * Renders nothing at all until FreeAgent data syncs.
 */
function MoneySection({ financials: fin }: { financials: PortalFinancials | null }) {
  if (!fin || typeof fin.netProfit !== "number") return null;

  const isLoss = fin.netProfit < 0;
  const series = cumulativeThisPeriod(fin);
  const forecast = forecastPeriodEnd(fin);
  const progress = periodProgress(fin);
  const lastMonth = latestMonthMovement(fin);
  const stale = isStale(fin.asOf);

  const cards: { label: string; value: string; note: string; tag?: string; href?: string }[] = [
    {
      label: fin.cashInBank != null && fin.cashInBank < 0 ? "Overdrawn" : "Cash at bank",
      value: fin.cashInBank != null ? gbp(fin.cashInBank) : "—",
      note: fin.cashAsAt ? `As at ${formatDate(fin.cashAsAt)}` : "Not yet synced",
    },
    {
      label: "Set aside for tax",
      value: gbp(fin.estTaxSetAside),
      note: `Indicative, at ${fin.taxRatePct}%`,
    },
    {
      label: "Invoiced",
      value: gbp(fin.revenue),
      note: progress
        ? `Across ${progress.elapsed} month${progress.elapsed === 1 ? "" : "s"}`
        : "This period",
    },
  ];

  // Only when the run rate can honestly support it — see forecastPeriodEnd.
  if (forecast) {
    cards.push({
      label: "On track to finish at",
      value: gbp(forecast.value),
      note: `At the last ${forecast.basisMonths} months' rate`,
      tag: "Forecast",
    });
  }

  if (fin.unexplainedCount && fin.unexplainedCount > 0) {
    cards.push({
      label: "Bookkeeping",
      value: `${fin.unexplainedCount} to explain`,
      note: "Waiting on you",
      href: "/portal/financials",
    });
  }

  return (
    <section className="mt-5">
      {/* LEAD — the one figure, and the one chart, with no card around them.
          Whitespace and type weight do the grouping. */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[13px] font-medium text-text-light">
            {isLoss ? "Net loss" : "Net profit"}
            {fin.periodEnd ? ` · year to ${formatDate(fin.periodEnd)}` : ""}
          </p>
          <div className="mt-1 text-[40px] font-bold leading-none tracking-[-0.04em] text-text tabular-nums">
            {gbp(Math.abs(fin.netProfit))}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-text-light">
            {lastMonth && (
              <>
                <span className="tabular-nums">
                  {lastMonth.netProfit >= 0 ? "+" : "−"}
                  {gbp(Math.abs(lastMonth.netProfit))} in {lastMonth.label}
                </span>
                <span className="text-neutral-300">·</span>
              </>
            )}
            {progress && (
              <span className="tabular-nums">
                {progress.elapsed} of {progress.total} months
              </span>
            )}
            {stale && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="text-amber-700">waiting on newer bookkeeping</span>
              </>
            )}
          </div>
        </div>

        {series.length > 1 && (
          <CumulativeChart points={series} isLoss={isLoss} />
        )}
      </div>

      {/* KPI STRIP — identical shape in every card. */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-medium text-text-light">{c.label}</span>
                {c.tag && (
                  <span className="rounded bg-primary/10 px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-primary">
                    {c.tag}
                  </span>
                )}
              </div>
              <div className="mt-1.5 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-text tabular-nums">
                {c.value}
              </div>
              <div className="mt-2 flex h-[18px] items-center gap-1 text-[13px] text-text-light">
                {c.note}
                {c.href && <ArrowRight size={13} className="text-primary" />}
              </div>
            </>
          );
          const cls =
            "rounded-xl border border-neutral-200 bg-white p-4 " +
            (c.tag ? "ring-1 ring-primary/40 " : "");
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${cls} transition hover:border-neutral-400`}>
              {inner}
            </Link>
          ) : (
            <div key={c.label} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <Link
          href="/portal/financials"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Full profit &amp; loss <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}

/**
 * The section's single visual: profit accumulating across the accounting
 * period. Captioned with its end value and an axis, because an uncaptioned
 * line next to a number is decoration rather than information.
 */
function CumulativeChart({
  points,
  isLoss,
}: {
  points: CumulativePoint[];
  isLoss: boolean;
}) {
  const W = 268;
  const H = 56;
  const vals = points.map((p) => p.cumulative);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const span = max - min || 1;
  const step = points.length > 1 ? W / (points.length - 1) : W;
  const path = points
    .map((p, i) => `${(i * step).toFixed(1)},${(H - ((p.cumulative - min) / span) * H).toFixed(1)}`)
    .join(" ");
  const lastX = (points.length - 1) * step;
  const lastY = H - ((vals[vals.length - 1] - min) / span) * H;

  return (
    <div className="w-[268px] shrink-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[11px] text-text-light">
        <span>Cumulative {isLoss ? "position" : "profit"}</span>
        <b className="text-[12px] font-semibold text-text tabular-nums">
          {gbp(vals[vals.length - 1])}
        </b>
      </div>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        role="img"
        aria-label={`Cumulative ${isLoss ? "position" : "profit"} by month, ${points[0].label} to ${points[points.length - 1].label}`}
      >
        <polyline
          points={path}
          stroke="currentColor"
          className="text-primary"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastX} cy={lastY} r="2.8" className="fill-primary" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-text-light">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}



// ─── EXPLORE (quick links) ───────────────────────────────────────────────────
const EXPLORE: {
  href: string;
  icon: typeof FileText;
  title: string;
  sub: string;
  tint: string;
  hoverBorder: string;
}[] = [
  {
    href: "/portal/deadlines",
    icon: CalendarClock,
    title: "Deadlines",
    sub: "See what's due and when",
    tint: "bg-amber-100/70 text-amber-600",
    hoverBorder: "hover:border-amber-300",
  },
  {
    href: "/portal/documents",
    icon: FileText,
    title: "Documents",
    sub: "Send us files, get yours",
    tint: "bg-primary/12 text-primary",
    hoverBorder: "hover:border-primary/40",
  },
  {
    href: "/portal/details",
    icon: Building2,
    title: "Your details",
    sub: "Company & Companies House",
    tint: "bg-indigo-100/70 text-indigo-600",
    hoverBorder: "hover:border-indigo-300",
  },
  {
    href: "/portal/messages",
    icon: MessageSquare,
    title: "Messages",
    sub: "Talk to your accountant",
    tint: "bg-orange-100/70 text-orange-600",
    hoverBorder: "hover:border-orange-300",
  },
];

function ExploreBand() {
  return (
    <div className="mt-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-light">
        Explore your portal
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EXPLORE.map((e) => {
          const Icon = e.icon;
          return (
            <Link
              key={e.href}
              href={e.href}
              className={`group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${e.hoverBorder}`}
            >
              <span
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${e.tint}`}
              >
                <Icon size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-text">{e.title}</div>
                <div className="truncate text-xs text-text-light">{e.sub}</div>
              </div>
              <ArrowRight
                size={15}
                className="flex-shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}




// ─── HERO NEXT-STEP ───────────────────────────────────────────────────────

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────

// ─── JOURNEY (onboarding centrepiece) ───────────────────────────────────────
function JourneyBand({ status }: { status: PortalOnboardingStatus }) {
  const completed = status.stages.filter((s) => s.state === "complete").length;
  const pct = Math.round((completed / status.totalStages) * 100);

  return (
    <section className="mt-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-md sm:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-light">
            Your onboarding journey
          </div>
          <div className="mt-1 text-xl font-bold tracking-tight text-text">
            {status.isComplete ? (
              <>You&apos;re all set up 🎉</>
            ) : (
              <>
                You&apos;re on{" "}
                <span className="text-orange-600">{status.stageTitle}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold leading-none text-primary">
            {pct}
            <span className="text-lg">%</span>
          </div>
          <div className="mt-0.5 text-xs text-text-light">
            {completed} of {status.totalStages} done
          </div>
        </div>
      </div>

      {/* Stepped path — icon per stage, connectors, the current node pulses */}
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[580px] items-start">
          {status.stages.map((st, i) => {
            const done = st.state === "complete";
            const now = st.state === "current";
            const Icon = STAGE_META[st.key]?.icon ?? Sparkles;
            const isFirst = i === 0;
            const isLast = i === status.stages.length - 1;
            return (
              <div key={st.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span
                    className={`h-0.5 flex-1 rounded ${
                      isFirst
                        ? "opacity-0"
                        : done || now
                          ? "bg-primary"
                          : "bg-neutral-200"
                    }`}
                  />
                  <span
                    className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : now
                          ? "border-2 border-orange-500 bg-orange-50 text-orange-600"
                          : "border-2 border-neutral-200 bg-white text-neutral-400"
                    }`}
                  >
                    {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                    {now && (
                      <span className="absolute inset-[-3px] animate-ping rounded-full ring-2 ring-orange-400/50" />
                    )}
                  </span>
                  <span
                    className={`h-0.5 flex-1 rounded ${
                      isLast
                        ? "opacity-0"
                        : done
                          ? "bg-primary"
                          : "bg-neutral-200"
                    }`}
                  />
                </div>
                <div
                  className={`mt-2.5 px-1 text-center text-xs leading-tight ${
                    now
                      ? "font-semibold text-text"
                      : done
                        ? "text-text"
                        : "text-text-light"
                  }`}
                >
                  {st.title}
                </div>
                {done && st.completedDate ? (
                  <div className="mt-0.5 text-[10px] text-text-light">
                    {formatDate(st.completedDate)}
                  </div>
                ) : now ? (
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                    Now
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── BUSINESS BAND (full-width footer anchor) ───────────────────────────────
function BusinessBand({
  status,
  firmName,
}: {
  status: PortalOnboardingStatus;
  firmName: string;
}) {
  const day = daysSince(status.joinedDate) ?? status.daysSinceSignup;
  return (
    <section className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white shadow-lg">
      {/* brand teal→orange hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-[#2E8DAE] to-[#F97316]" />
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Building2 size={20} className="text-white/90" />
          </span>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/50">
              Your business
            </div>
            <div className="text-lg font-semibold">
              {status.accountName ?? "—"}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 sm:gap-10">
          <Stat
            label="With us since"
            value={status.joinedDate ? formatDate(status.joinedDate) : "—"}
          />
          <Stat label="Day" value={String(day)} />
          <Stat label="Brand" value={firmName} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-white/45">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-white/95">{value}</div>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────



function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Financial figures older than ~6 weeks. The trial-balance sync runs monthly,
 * so a 45-day threshold flags "a sync was missed / the books aren't current"
 * without crying stale at a normal month-end gap.
 */
const STALE_FINANCIALS_DAYS = 45;

function isStale(iso: string | null): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return (Date.now() - t) / 86_400_000 > STALE_FINANCIALS_DAYS;
}

function gbp(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

/**
 * Whole days since an ISO date, computed live at render. The cached
 * `daysSinceSignup` from the Apex snapshot freezes at sync time (it would show
 * e.g. "Day 44" weeks after the fact), so we recompute from `joinedDate` here.
 * Returns null on a missing/invalid date so the caller can fall back.
 */
function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso);
  if (isNaN(then.getTime())) return null;
  const a = new Date();
  a.setHours(0, 0, 0, 0);
  then.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((a.getTime() - then.getTime()) / 86_400_000));
}
