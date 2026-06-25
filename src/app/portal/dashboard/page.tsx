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
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { logPortalEvent } from "@/lib/portal/audit";
import {
  getOnboardingForCurrentUser,
  isOnboardingError,
} from "@/lib/portal/onboarding";
import AccessGate from "@/components/portal/AccessGate";
import type {
  PortalOnboardingStatus,
  PortalStageInfo,
  PortalStageKey,
  PortalAccountantInfo,
  PortalActionItem,
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
  const [brand, portalUser, onboardingResult, actionItems] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getOnboardingForCurrentUser(),
    getActionItemsForCurrentUser(),
  ]);

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

  return (
    <Shell>
      <DashboardBody
        status={status}
        firstName={firstName}
        actionItems={actionItems}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Faint brand wash — teal top-left, orange top-right */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{
          background:
            "radial-gradient(55% 100% at 25% 0%, rgb(26 122 155 / 0.05) 0%, transparent 70%), radial-gradient(55% 100% at 85% 0%, rgb(249 115 22 / 0.05) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* Left-aligned (no mx-auto) so the content hugs the sidebar instead of
          floating centred with a dead gap on a wide screen. Capped at 1600px
          for line-length readability on ultrawide displays. */}
      <div className="relative max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

function DashboardBody({
  status,
  firstName,
  actionItems,
}: {
  status: PortalOnboardingStatus;
  firstName: string | null;
  actionItems: PortalActionItem[];
}) {
  const a = status.accountant;
  const accountantName = a.name ?? "your accountant";
  const firstNameShort = accountantName.split(" ")[0];

  return (
    <>
      {/* HEADER — greeting + business on the left, quiet trust line on the right */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {greetingForNow()}, {firstName ?? "there"}
          </h1>
          {status.accountName && (
            <p className="mt-0.5 text-sm text-text-light">
              {status.accountName} · Clever Accounts
            </p>
          )}
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 text-xs text-text-light">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <ShieldCheck size={12} className="text-emerald-600" />
          Encrypted · synced live
        </span>
      </div>

      {/* 2-COL LAYOUT */}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* LEFT MAIN — onboarding "Up next" leads; everything else is the
            quieter "Also needs you" list beneath it. Once onboarding completes,
            the hero becomes the "all set" card and this panel reverts to the
            primary "Needs you" lead (secondary=false). */}
        <div className="space-y-5">
          <NextStepHero status={status} firstNameShort={firstNameShort} />
          <NeedsYouPanel items={actionItems} secondary={!status.isComplete} />
          <ActivityFeed status={status} />
        </div>

        {/* RIGHT RAIL */}
        <div className="space-y-5">
          <AccountantCard accountant={status.accountant} />
          <ProgressCard status={status} />
          <StagesCard stages={status.stages} />
          <BusinessMeta status={status} />
        </div>
      </div>
    </>
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
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
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
      <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
        <div className="p-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <PartyPopper size={12} /> Onboarding complete
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            You&apos;re all set up.
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
    <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* brand teal→orange hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1A7A9B] via-[#2E8DAE] to-[#F97316]" />
      {/* faint orange corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-10 h-44 w-44 rounded-full bg-orange-400/15 blur-3xl"
      />

      <div className="relative px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Video size={15} />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-text-light">
            Up next
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text">
          {status.nextActionLabel}
        </h2>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-light">
          {meta?.gist ??
            "A hands-on session covering everything you need at this stage."}{" "}
          Booking takes one tap.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-light">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {meta?.duration ?? "30 min"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Video size={12} /> Video call
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} /> with {a.name ?? "your accountant"}
          </span>
        </div>

        {/* CTA — one tap to book */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {a.calendlyUrl ? (
            <a
              href={a.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Choose a time <ArrowRight size={15} />
            </a>
          ) : (
            <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/40 px-5 py-2.5 text-sm font-semibold text-white">
              Booking link coming
            </span>
          )}
          <Link
            href="/portal/messages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-light transition hover:text-text"
          >
            Or message {firstNameShort} <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Warm, honest closer — what you walk away with */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-neutral-50 px-3.5 py-3">
          <Check
            size={14}
            strokeWidth={3}
            className="mt-0.5 flex-shrink-0 text-emerald-500"
          />
          <p className="text-xs text-text-light">
            <span className="font-medium text-text">After this call</span>{" "}
            {outcomeForStage(status.currentStage)}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────
function ActivityFeed({ status }: { status: PortalOnboardingStatus }) {
  const rows: {
    when: string;
    what: string;
    who: string;
    icon: typeof CheckCircle2;
    color: string;
  }[] = [];
  for (const st of status.stages) {
    if (st.state === "complete" && st.completedDate) {
      rows.push({
        when: formatDate(st.completedDate),
        what: `${st.title} completed`,
        who: status.accountant.name ?? "Your accountant",
        icon: CheckCircle2,
        color: "text-emerald-500",
      });
    }
  }
  if (status.joinedDate) {
    rows.push({
      when: formatDate(status.joinedDate),
      what: "Account created",
      who: "You signed up",
      icon: AlertCircle,
      color: "text-neutral-400",
    });
  }
  rows.sort((x, y) => (x.when > y.when ? -1 : 1));
  if (rows.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3.5">
        <Activity size={14} className="text-neutral-400" />
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
              {row.when}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── ACCOUNTANT CARD ────────────────────────────────────────────────────────
function AccountantCard({ accountant }: { accountant: PortalAccountantInfo }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-text-light">
        Your accountant
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <AccountantAvatar
            name={accountant.name}
            hasPhoto={Boolean(accountant.photoUrl)}
            sizeClass="h-11 w-11"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-text">
            {accountant.name ?? "—"}
          </div>
          <div className="truncate text-xs text-text-light">
            Replies in ~2 hours · Mon–Fri 9–5
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {accountant.calendlyUrl ? (
          <a
            href={accountant.calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-orange-600"
          >
            <Calendar size={12} /> Book
          </a>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-500/40 px-3 py-2 text-xs font-medium text-white">
            <Calendar size={12} /> Book
          </span>
        )}
        <Link
          href="/portal/messages"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-text transition hover:border-neutral-400"
        >
          <MessageSquare size={12} /> Message
        </Link>
      </div>
    </section>
  );
}

// ─── PROGRESS (shown ONCE) ──────────────────────────────────────────────────
function ProgressCard({ status }: { status: PortalOnboardingStatus }) {
  const completed = status.stages.filter((s) => s.state === "complete").length;
  const pct = Math.round((completed / status.totalStages) * 100);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-text-light">
          Onboarding
        </span>
        <span className="text-xs text-text-light">
          Stage {status.stageNumber} of {status.totalStages}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-text">{pct}</span>
        <span className="text-base text-text-light">%</span>
        <span className="ml-auto text-xs text-text-light">
          {completed} of {status.totalStages} done
        </span>
      </div>
      {/* slim segmented bar — teal done, orange now */}
      <div className="mt-3 flex gap-1">
        {status.stages.map((st) => (
          <div
            key={st.key}
            title={st.title}
            className={`h-1.5 flex-1 rounded-full ${
              st.state === "complete"
                ? "bg-[#1A7A9B]"
                : st.state === "current"
                  ? "bg-orange-500"
                  : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
      {!status.isComplete && (
        <p className="mt-2.5 text-xs text-text-light">
          You&apos;re on{" "}
          <span className="font-medium text-text">{status.stageTitle}</span>.
        </p>
      )}
    </section>
  );
}

// ─── STAGES LIST ────────────────────────────────────────────────────────────
function StagesCard({ stages }: { stages: PortalStageInfo[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-3.5">
        <span className="text-sm font-semibold text-text">Your stages</span>
      </div>
      <ol className="divide-y divide-neutral-100">
        {stages.map((st) => {
          const isComplete = st.state === "complete";
          const isCurrent = st.state === "current";
          return (
            <li key={st.key} className="flex items-center gap-3 px-5 py-2.5">
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isComplete
                    ? "bg-[#1A7A9B] text-white"
                    : isCurrent
                      ? "border-2 border-orange-500 bg-orange-50 text-orange-700"
                      : "border border-neutral-200 bg-white text-neutral-400"
                }`}
              >
                {isComplete ? (
                  <Check size={10} strokeWidth={3} />
                ) : (
                  st.stageNumber
                )}
              </span>
              <span
                className={`flex-1 text-sm ${
                  st.state === "upcoming"
                    ? "text-text-light"
                    : isCurrent
                      ? "font-semibold text-text"
                      : "text-text"
                }`}
              >
                {st.title}
              </span>
              {isComplete && st.completedDate && (
                <span className="text-xs text-text-light">
                  {formatDate(st.completedDate)}
                </span>
              )}
              {isCurrent && (
                <span className="text-xs font-medium text-orange-600">Now</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ─── BUSINESS META ────────────────────────────────────────────────────────
function BusinessMeta({ status }: { status: PortalOnboardingStatus }) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 text-white shadow-md">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
        <Building2 size={12} /> Your business
      </div>
      <div className="mt-2 text-base font-semibold">
        {status.accountName ?? "—"}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        {status.joinedDate && (
          <div>
            <div className="text-white/50">With us since</div>
            <div className="mt-0.5 text-sm font-medium">
              {formatDate(status.joinedDate)}
            </div>
          </div>
        )}
        <div>
          <div className="text-white/50">Day</div>
          <div className="mt-0.5 text-sm font-medium">
            {status.daysSinceSignup}
          </div>
        </div>
        <div>
          <div className="text-white/50">Brand</div>
          <div className="mt-0.5 text-sm font-medium capitalize">
            {status.brand}
          </div>
        </div>
      </div>
    </section>
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
