import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  ShieldCheck,
  Clock,
  Building2,
  Sparkles,
  Video,
  Activity,
  Upload,
  HandHeart,
  Coffee,
  Laptop,
  TrendingUp,
  PartyPopper,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  PenLine,
  CalendarClock,
  FileText,
  CalendarDays,
  Percent,
  Landmark,
  PoundSterling,
  Wallet,
  Receipt,
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

export const dynamic = "force-dynamic";

/**
 * Dashboard — "Aurora" layout, ported live June 2026 (from preview D1).
 *
 * Design principles carried over from the D1 mock:
 *   · Say each thing ONCE — single progress indicator, no repeated stage chips.
 *   · Booking is the hero action — one clear orange CTA, not buried.
 *   · Brand dual-colour system — teal (#1A7A9B) for structure / "done",
 *     orange (#F97316→#EA580C) for the next action / CTAs.
 *   · Gentle nudge tone instead of an alarming "N days overdue" banner.
 *   · Real accountant photo when available (falls back to initials).
 *   · Quiet "Encrypted · synced live" trust line for confidence.
 *
 * The accountant lives in the persistent sidebar chip (PortalShell), so there
 * is deliberately NO right-rail accountant card here — avoids the triple-repeat
 * we had in the old bento layout.
 *
 *   ┌─────────────────────────────┬─────────────────────┐
 *   │ Hero next-step (book)       │ Progress (once)      │
 *   │ Tasks                       │ Your stages          │
 *   │ Recent activity             │ Documents coming up  │
 *   │                             │ Business meta        │
 *   └─────────────────────────────┴─────────────────────┘
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
            className="mt-6 inline-block font-semibold text-[#1A7A9B] hover:underline"
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
        firstName={firstName}
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
  firstName,
  actionItems,
  deadlines,
  financials,
  firmName,
}: {
  status: PortalOnboardingStatus;
  firstName: string | null;
  actionItems: PortalActionItem[];
  deadlines: PortalDeadline[];
  financials: PortalFinancials | null;
  firmName: string;
}) {
  const a = status.accountant;
  const accountantName = a.name ?? "your accountant";
  const firstNameShort = accountantName.split(" ")[0];

  return (
    <>
      {/* HEADER — greeting + business on the left, quiet trust line on the right */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-text">
            {greetingForNow()}, {firstName ?? "there"}
          </h1>
          {status.accountName && (
            <p className="mt-0.5 text-sm text-text-light">
              {status.accountName} · {firmName}
            </p>
          )}
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/60 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <ShieldCheck size={12} className="text-emerald-600" />
          Encrypted · synced live
        </span>
      </div>

      {/* HERO — the moment: book the next call, with your accountant */}
      <NextStepHero status={status} firstNameShort={firstNameShort} />

      {/* MONEY — the recurring "reason to log in": where the business stands */}
      <MoneyBand financials={financials} />

      {/* JOURNEY — the onboarding centrepiece */}
      <JourneyBand status={status} />

      {/* CONTENT — what needs you + what's coming up, with recent activity beside */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <NeedsYouPanel items={actionItems} secondary={!status.isComplete} />
          <DeadlinesCard deadlines={deadlines} />
        </div>
        <div className="space-y-5">
          <ActivityFeed status={status} />
        </div>
      </div>

      {/* EXPLORE — quick links */}
      <ExploreBand />

      {/* BUSINESS — full-width footer band, anchors the bottom edge */}
      <BusinessBand status={status} firmName={firmName} />
    </>
  );
}

// ─── MONEY BAND (financials headline) ───────────────────────────────────────
/**
 * The dashboard's money moment — leads with the numbers a business owner
 * actually logs in for: net profit, cash, tax to set aside, books health. The
 * full P&L is one click deeper on /portal/financials (same pattern as
 * deadlines → deadlines page). Renders nothing until FreeAgent data syncs.
 */
function MoneyBand({ financials: fin }: { financials: PortalFinancials | null }) {
  if (!fin || typeof fin.netProfit !== "number") return null;

  const isLoss = fin.netProfit < 0;
  const tiles: {
    label: string;
    value: string;
    icon: typeof PoundSterling;
    tint: string;
  }[] = [
    {
      label: isLoss ? "Net loss" : "Net profit",
      value: gbp(Math.abs(fin.netProfit)),
      icon: isLoss ? Activity : TrendingUp,
      tint: isLoss ? "bg-amber-50 text-amber-600" : "bg-[#1A7A9B]/10 text-[#1A7A9B]",
    },
    {
      label: fin.cashInBank != null && fin.cashInBank < 0 ? "Overdrawn" : "Cash in the bank",
      value: fin.cashInBank != null ? gbp(fin.cashInBank) : "—",
      icon: Wallet,
      tint:
        fin.cashInBank != null && fin.cashInBank < 0
          ? "bg-amber-50 text-amber-600"
          : "bg-emerald-50 text-emerald-600",
    },
    {
      label: `Set aside for tax (~${fin.taxRatePct}%)`,
      value: gbp(fin.estTaxSetAside),
      icon: Landmark,
      tint: "bg-orange-50 text-orange-600",
    },
    {
      label: "Bookkeeping",
      value:
        fin.unexplainedCount == null
          ? "—"
          : fin.unexplainedCount === 0
            ? "All tidy"
            : `${fin.unexplainedCount} to explain`,
      icon: Receipt,
      tint:
        fin.unexplainedCount && fin.unexplainedCount > 0
          ? "bg-amber-50 text-amber-600"
          : "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section className="mt-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1A7A9B]/10 text-[#1A7A9B]">
            <PoundSterling size={15} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text">
              Where your business stands
            </h2>
            {fin.asOf && (
              <p className="text-[11px] text-text-light">
                Figures as of {formatDate(fin.asOf)}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/portal/financials"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A7A9B] hover:underline"
        >
          Full P&amp;L <ArrowRight size={13} />
        </Link>
      </div>
      <div className="grid grid-cols-2 divide-neutral-100 sm:grid-cols-4 sm:divide-x">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <div
              key={i}
              className={`p-5 ${i < 2 ? "border-b sm:border-b-0" : ""} ${
                i % 2 === 1 ? "border-l sm:border-l-0" : ""
              } border-neutral-100`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.tint}`}
              >
                <Icon size={15} />
              </span>
              <div className="mt-2.5 text-xl font-bold tracking-tight text-text">
                {t.value}
              </div>
              <div className="mt-0.5 text-[11px] text-text-light">{t.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── DEADLINES (upcoming) ────────────────────────────────────────────────────
const DEADLINE_ICON: Record<string, typeof CalendarClock> = {
  accounts: FileText,
  confirmation_statement: Landmark,
  vat: Percent,
  self_assessment: FileText,
  corporation_tax: Landmark,
  payroll: CalendarDays,
};

function DeadlinesCard({ deadlines }: { deadlines: PortalDeadline[] }) {
  if (!deadlines || deadlines.length === 0) return null;
  // Soonest first; drop already-submitted; cap to 4.
  const upcoming = deadlines
    .filter((d) => d.status !== "submitted" && d.dueDate)
    .sort((x, y) => new Date(x.dueDate!).getTime() - new Date(y.dueDate!).getTime())
    .slice(0, 4);
  if (upcoming.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1A7A9B]/10 text-[#1A7A9B]">
            <CalendarClock size={14} />
          </span>
          <h2 className="text-sm font-semibold text-text">Upcoming deadlines</h2>
        </div>
        <Link
          href="/portal/deadlines"
          className="text-xs font-medium text-[#1A7A9B] hover:underline"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y divide-neutral-100">
        {upcoming.map((d) => {
          const Icon = DEADLINE_ICON[d.kind] ?? CalendarClock;
          const overdue = d.status === "overdue";
          const soon = d.status === "due_soon";
          return (
            <li key={d.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#1A7A9B]/10 text-[#1A7A9B]">
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-text">{d.title}</div>
                {d.periodLabel && (
                  <div className="truncate text-xs text-text-light">
                    {d.periodLabel}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <div
                  className={`text-xs font-semibold ${
                    overdue
                      ? "text-red-600"
                      : soon
                        ? "text-orange-600"
                        : "text-text"
                  }`}
                >
                  {d.dueDate ? formatDate(d.dueDate) : "—"}
                </div>
                {overdue ? (
                  <div className="text-[11px] font-medium text-red-600">
                    Overdue
                  </div>
                ) : (
                  typeof d.daysUntil === "number" &&
                  d.daysUntil >= 0 && (
                    <div className="text-[11px] text-text-light">
                      in {d.daysUntil} day{d.daysUntil === 1 ? "" : "s"}
                    </div>
                  )
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
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
    tint: "bg-[#1A7A9B]/12 text-[#1A7A9B]",
    hoverBorder: "hover:border-[#1A7A9B]/40",
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

// ─── NEEDS YOU (aggregated action hub) ──────────────────────────────────────
const ACTION_ICON: Record<string, typeof PenLine> = {
  approval: PenLine,
  document: Upload,
  deadline: CalendarClock,
  task: ShieldCheck,
};

// Colour-coded by type so the list has rhythm: approve=orange, verify=teal,
// upload=blue, deadline=amber.
const ACTION_TINT: Record<string, string> = {
  approval: "bg-orange-50 text-orange-600",
  task: "bg-[#1A7A9B]/10 text-[#1A7A9B]",
  document: "bg-blue-50 text-blue-600",
  deadline: "bg-amber-50 text-amber-600",
};

function NeedsYouPanel({
  items,
  secondary = false,
}: {
  items: PortalActionItem[];
  secondary?: boolean;
}) {
  if (!items || items.length === 0) return null;
  const overdue = items.filter((i) => i.urgency === "overdue").length;

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text">
            {secondary ? "Also needs you" : "Needs you"}
          </h2>
          <span
            className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
              secondary ? "bg-neutral-200 text-text" : "bg-orange-500 text-white"
            }`}
          >
            {items.length}
          </span>
        </div>
        {overdue > 0 && (
          <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
            {overdue} overdue
          </span>
        )}
      </div>
      <ul className="divide-y divide-neutral-100">
        {items.map((i) => {
          const Icon = ACTION_ICON[i.type] ?? AlertCircle;
          const tint = ACTION_TINT[i.type] ?? "bg-neutral-100 text-text-light";
          return (
            <li key={i.id}>
              <Link
                href={i.href}
                className="group flex items-center gap-3 px-5 py-3 transition hover:bg-neutral-50"
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tint}`}
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-text">{i.title}</div>
                  {i.detail && (
                    <div className="truncate text-xs text-text-light">
                      {i.detail}
                    </div>
                  )}
                </div>
                {i.dueDate && (
                  <span
                    className={`hidden flex-shrink-0 text-xs font-medium sm:inline ${
                      i.urgency === "overdue"
                        ? "text-red-600"
                        : i.urgency === "soon"
                          ? "text-orange-600"
                          : "text-text-light"
                    }`}
                  >
                    {i.urgency === "overdue"
                      ? "Overdue"
                      : `Due ${formatDate(i.dueDate)}`}
                  </span>
                )}
                <ArrowRight
                  size={15}
                  className="flex-shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── HERO NEXT-STEP ───────────────────────────────────────────────────────
function NextStepHero({
  status,
  firstNameShort,
}: {
  status: PortalOnboardingStatus;
  firstNameShort: string;
}) {
  const a = status.accountant;
  const meta = STAGE_META[status.currentStage];

  if (status.isComplete) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/70 shadow-lg">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-[#1A7A9B]/[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl"
        />
        <div className="relative p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/70 backdrop-blur">
            <PartyPopper size={13} /> Onboarding complete
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-[34px]">
            You&apos;re all set up. 🎉
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-light">
            All six onboarding stages are done. Your accountant relationship is
            in routine mode — message anytime, book a call when you need one.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-orange-100/80 shadow-lg">
      {/* warm brand gradient wash + soft glows — this is the page's one big moment */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/40 to-[#1A7A9B]/[0.07]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#1A7A9B]/15 blur-3xl"
      />

      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_248px] lg:items-center">
        {/* Content */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-orange-700 ring-1 ring-orange-200/70 backdrop-blur">
            <Video size={13} /> Up next
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-[34px]">
            {status.nextActionLabel}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-light">
            {meta?.gist ??
              "A hands-on session covering everything you need at this stage."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-text-light">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-orange-500" /> {meta?.duration ?? "30 min"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Video size={13} className="text-orange-500" /> Video call
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="text-orange-500" /> with {a.name ?? "your accountant"}
            </span>
          </div>

          {/* CTA — one tap to book */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {a.calendlyUrl ? (
              <Link
                href="/portal/appointments"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 hover:shadow-orange-500/40"
              >
                Choose a time <ArrowRight size={17} />
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500/40 px-6 py-3 text-base font-semibold text-white">
                Booking link coming
              </span>
            )}
            <Link
              href="/portal/messages"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-light transition hover:text-text"
            >
              Or message {firstNameShort} <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Warm, honest closer */}
          <p className="mt-5 flex items-start gap-2 text-xs text-text-light">
            <Check
              size={13}
              strokeWidth={3}
              className="mt-0.5 flex-shrink-0 text-emerald-500"
            />
            <span>
              <span className="font-medium text-text">After this call</span>{" "}
              {outcomeForStage(status.currentStage)}
            </span>
          </p>
        </div>

        {/* The human you're booking with */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur lg:flex-col lg:gap-2.5 lg:text-center">
          <div className="relative">
            <AccountantAvatar
              name={a.name}
              hasPhoto={Boolean(a.photoUrl)}
              sizeClass="h-16 w-16 lg:h-24 lg:w-24"
              textClass="text-xl"
            />
            <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-text-light">
              Your accountant
            </div>
            <div className="truncate text-sm font-semibold text-text">
              {a.name ?? "—"}
            </div>
            <div className="text-xs text-text-light">Replies in ~2 hours</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────
function ActivityFeed({ status }: { status: PortalOnboardingStatus }) {
  const rows: {
    iso: string;
    what: string;
    who: string;
    icon: typeof CheckCircle2;
    color: string;
  }[] = [];
  for (const st of status.stages) {
    if (st.state === "complete" && st.completedDate) {
      rows.push({
        iso: st.completedDate,
        what: `${st.title} completed`,
        who: status.accountant.name ?? "Your accountant",
        icon: CheckCircle2,
        color: "text-emerald-500",
      });
    }
  }
  if (status.joinedDate) {
    rows.push({
      iso: status.joinedDate,
      what: "Account created",
      who: "You signed up",
      icon: AlertCircle,
      color: "text-neutral-400",
    });
  }
  // Sort on the real date (newest first), not the formatted label — string
  // compare on "10 Apr 2026" vs "9 Apr 2026" would order them wrongly.
  rows.sort((x, y) => new Date(y.iso).getTime() - new Date(x.iso).getTime());
  if (rows.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1A7A9B]/10 text-[#1A7A9B]">
          <Activity size={14} />
        </span>
        <span className="text-sm font-semibold text-text">Recent activity</span>
      </div>
      <ul className="divide-y divide-neutral-100">
        {rows.slice(0, 6).map((row, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3.5">
            <row.icon
              size={14}
              className={`mt-0.5 flex-shrink-0 ${row.color}`}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-text">{row.what}</div>
              <div className="text-xs text-text-light">{row.who}</div>
            </div>
            <div className="flex-shrink-0 text-xs text-text-light">
              {formatDate(row.iso)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

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
          <div className="text-3xl font-bold leading-none text-[#1A7A9B]">
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
                          ? "bg-[#1A7A9B]"
                          : "bg-neutral-200"
                    }`}
                  />
                  <span
                    className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-[#1A7A9B] text-white shadow-sm shadow-[#1A7A9B]/30"
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
                          ? "bg-[#1A7A9B]"
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
      <div className="h-1 w-full bg-gradient-to-r from-[#1A7A9B] via-[#2E8DAE] to-[#F97316]" />
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

function greetingForNow() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function outcomeForStage(stage: PortalStageKey | string): string {
  switch (stage) {
    case "welcome":
      return "we'll have introduced ourselves and you'll know what comes next.";
    case "main":
      return "we'll have your year mapped — VAT, salary, dates — so nothing surprises you.";
    case "portal":
      return "you'll be running expenses, invoices and salary on your own — no spreadsheets, no late-night admin.";
    case "checkin30":
    case "checkin60":
      return "we'll have caught any teething issues early and you'll be fully comfortable.";
    case "catchup":
      return "you'll know exactly where your business stands and what to focus on next quarter.";
    default:
      return "you'll be a step closer to a fully-set-up business.";
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
