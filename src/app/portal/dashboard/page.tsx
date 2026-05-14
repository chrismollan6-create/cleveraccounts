import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  Building2,
  Sparkles,
  ChevronRight,
  Receipt,
  CreditCard,
  Smartphone,
  Banknote,
  PenLine,
  HandHeart,
  Laptop,
  Coffee,
  PartyPopper,
  Lightbulb,
  TrendingUp,
  Upload,
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
  PortalTask,
} from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Dashboard — "Mercury bento" layout, ported live May 2026.
 *
 * Replaces the previous WelcomeBanner/StatsRow/NextActionCard composition with
 * a curated bento grid: hero next-step card with "what we'll cover" bullets +
 * inline time slots, ring chart for progress, rich stages card with
 * per-stage icons and durations, real-data tasks, activity feed, business
 * meta, and a Phase-2 documents teaser.
 *
 * Layout structure:
 *   ┌─────────────────────────────┬─────────────────────┐
 *   │ Hero next-step              │ Progress ring        │
 *   │ Stages (6 rows)             │ Accountant card      │
 *   │ Activity feed               │ Tasks                │
 *   │                             │ Documents coming up  │
 *   │                             │ Business meta        │
 *   └─────────────────────────────┴─────────────────────┘
 *
 * Photo: still initials (real SF photo needs an auth'd proxy fetch — TODO).
 */

const STAGE_META: Record<
  PortalStageKey | string,
  { icon: typeof Sparkles; tint: string; duration: string; gist: string }
> = {
  welcome: {
    icon: HandHeart,
    tint: "rose",
    duration: "20 min",
    gist: "Meet your accountant, share what your business does, hear how Clever works.",
  },
  main: {
    icon: Coffee,
    tint: "amber",
    duration: "45 min",
    gist: "Map the year ahead — VAT, salary, accounts dates, what you need from us.",
  },
  portal: {
    icon: Laptop,
    tint: "blue",
    duration: "30 min",
    gist: "Hands-on walk-through of expenses, invoices, salary, and bank feeds.",
  },
  checkin30: {
    icon: TrendingUp,
    tint: "emerald",
    duration: "20 min",
    gist: "Two-week check after portal training — make sure everything's clicked.",
  },
  checkin60: {
    icon: TrendingUp,
    tint: "emerald",
    duration: "20 min",
    gist: "Second check — close the loop on anything still fiddly.",
  },
  catchup: {
    icon: PartyPopper,
    tint: "violet",
    duration: "30 min",
    gist: "First quarterly review — your numbers, your goals, what to do next.",
  },
};

const TINT: Record<string, { bg: string; text: string; ring: string }> = {
  rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200" },
};

export default async function DashboardPage() {
  const [brand, portalUser, onboardingResult] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getOnboardingForCurrentUser(),
  ]);

  const firstName = portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  // Soft-block states
  if (portalUser && (portalUser.status === "disabled" || portalUser.status === "pending")) {
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
      metadata: { message: onboardingResult.message, status: onboardingResult.status },
    });
    return (
      <Shell>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-amber-900">
            We&apos;re having trouble loading your dashboard
          </h2>
          <p className="mt-2 text-sm text-amber-800">{onboardingResult.message}</p>
        </div>
      </Shell>
    );
  }

  const status = onboardingResult.data;

  if (!status) {
    return (
      <Shell>
        <div className="text-center py-16 max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-text">Hi {firstName ?? "there"}</h1>
          <p className="mt-3 text-text-light">
            Your onboarding hasn&apos;t started yet. We&apos;ll be in touch shortly.
          </p>
          <a
            href={`mailto:${brand.supportEmail}`}
            className="mt-6 inline-block text-primary font-semibold hover:text-primary-dark"
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
        accountantName={status.accountant.name ?? "your accountant"}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">{children}</div>;
}

function DashboardBody({
  status,
  firstName,
  accountantName,
}: {
  status: PortalOnboardingStatus;
  firstName: string | null;
  accountantName: string;
}) {
  const a = status.accountant;
  const completed = status.stages.filter((s) => s.state === "complete").length;
  const pct = Math.round((completed / status.totalStages) * 100);
  const due = status.currentStageDue ? new Date(status.currentStageDue) : null;
  const overdueDays =
    due && due.getTime() < Date.now()
      ? Math.floor((Date.now() - due.getTime()) / 86_400_000)
      : 0;
  const firstNameShort = accountantName.split(" ")[0];

  return (
    <>
      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {greetingForNow()}, {firstName ?? "there"}
          </h1>
          {status.accountName && (
            <span className="text-sm text-text-light">{status.accountName}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {!status.isComplete && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-text ring-1 ring-gray-200">
              <Lightbulb size={11} className="text-amber-500" />
              Stage {status.stageNumber} of {status.totalStages}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {firstNameShort} online
          </span>
        </div>
      </div>

      {/* 2-COL LAYOUT */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* LEFT MAIN */}
        <div className="space-y-4">
          <NextStepHero
            status={status}
            accountant={a}
            overdueDays={overdueDays}
            firstNameShort={firstNameShort}
          />
          <StagesCard
            stages={status.stages}
            calendlyUrl={a.calendlyUrl}
          />
          <ActivityFeed status={status} />
        </div>

        {/* RIGHT RAIL */}
        <div className="space-y-4">
          <ProgressRing pct={pct} completed={completed} total={status.totalStages} stages={status.stages} />
          <AccountantWidget accountant={a} />
          <TasksWidget tasks={status.tasks ?? []} />
          <DocumentsComingUp />
          <BusinessMeta status={status} />
        </div>
      </div>
    </>
  );
}

// ─── HERO NEXT-STEP ───────────────────────────────────────────────────────
function NextStepHero({
  status,
  accountant,
  overdueDays,
  firstNameShort,
}: {
  status: PortalOnboardingStatus;
  accountant: PortalAccountantInfo;
  overdueDays: number;
  firstNameShort: string;
}) {
  const meta = STAGE_META[status.currentStage];
  const bullets = bulletsForStage(status.currentStage);

  if (status.isComplete) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700" />
        <div className="p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <PartyPopper size={12} /> Onboarding complete
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            You&apos;re all set up.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-light">
            All six onboarding stages are done. Your accountant relationship is
            in routine mode — message anytime, book a call when you need one.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500" />
      <div className="relative p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
            <Sparkles size={12} className="text-blue-600" />
            Your next step · Stage {status.stageNumber}/{status.totalStages}
          </div>
          {overdueDays > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              <Clock size={11} /> {overdueDays} day{overdueDays === 1 ? "" : "s"} overdue
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl">
          {status.nextActionLabel} with {firstNameShort}.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-light">
          {meta?.duration ?? "30 min"} call.{" "}
          {meta?.gist ??
            "A hands-on session covering everything you need to know at this stage."}{" "}
          Until this is done, the rest of onboarding stays paused.
        </p>

        {/* What we'll cover */}
        {bullets && (
          <div className="mt-6 rounded-xl bg-blue-50/60 p-4 ring-1 ring-blue-100">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-900/70">
              What we&apos;ll cover
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {bullets.map((row, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-text">
                  <row.icon size={14} className="text-blue-600" strokeWidth={2.2} />
                  <span>{row.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {accountant.calendlyUrl ? (
            <a
              href={accountant.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Choose a time <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600/40 px-5 py-2.5 text-sm font-semibold text-white">
              Booking link coming
            </span>
          )}
          <Link
            href="/portal/messages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-light hover:text-text"
          >
            Or message {firstNameShort} <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Outcome */}
        <div className="mt-5 flex items-start gap-2.5 border-t border-gray-100 pt-4 text-sm">
          <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-500" strokeWidth={3} />
          <span className="text-text-light">
            <span className="font-semibold text-text">After this call</span>{" "}
            {outcomeForStage(status.currentStage)}
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── STAGES CARD ──────────────────────────────────────────────────────────
function StagesCard({
  stages,
  calendlyUrl,
}: {
  stages: PortalStageInfo[];
  calendlyUrl: string | null;
}) {
  const completed = stages.filter((s) => s.state === "complete").length;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">Your six stages</span>
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-text-light">
            {completed}/{stages.length}
          </span>
        </div>
      </div>
      <div>
        {stages.map((st) => {
          const meta = STAGE_META[st.key];
          if (!meta) return null;
          const tint = TINT[meta.tint];
          const Icon = meta.icon;
          const isCurrent = st.state === "current";
          const isComplete = st.state === "complete";

          return (
            <div
              key={st.key}
              className={`relative flex gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0 ${
                isCurrent ? "bg-blue-50/40" : ""
              }`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${
                  isComplete
                    ? "bg-emerald-500 text-white ring-emerald-600"
                    : isCurrent
                      ? `${tint.bg} ${tint.text} ${tint.ring}`
                      : "bg-gray-50 text-gray-300 ring-gray-200"
                }`}
              >
                {isComplete ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`text-sm font-semibold ${st.state === "upcoming" ? "text-text-light" : "text-text"}`}
                  >
                    {st.stageNumber}. {st.title}
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      isComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : isCurrent
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-text-light"
                    }`}
                  >
                    {isComplete ? "Done" : isCurrent ? "Now" : "Upcoming"}
                  </span>
                  <span className="ml-auto text-xs text-text-light">{meta.duration}</span>
                </div>
                <div className="mt-0.5 text-xs text-text-light">{meta.gist}</div>
                {isCurrent && calendlyUrl && (
                  <div className="mt-3">
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                    >
                      Book this <ArrowUpRight size={11} />
                    </a>
                  </div>
                )}
                {isComplete && st.completedDate && (
                  <div className="mt-1 text-xs text-emerald-600">
                    Completed {formatDate(st.completedDate)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────
function ActivityFeed({ status }: { status: PortalOnboardingStatus }) {
  const rows: { when: string; what: string; who: string; tint: string }[] = [];
  for (const st of status.stages) {
    if (st.state === "complete" && st.completedDate) {
      rows.push({
        when: formatDate(st.completedDate),
        what: `${st.title} completed`,
        who: status.accountant.name ?? "Your accountant",
        tint: "emerald",
      });
    }
  }
  if (status.joinedDate) {
    rows.push({
      when: formatDate(status.joinedDate),
      what: "Account created",
      who: "You signed up",
      tint: "neutral",
    });
  }
  rows.sort((a, b) => (a.when > b.when ? -1 : 1));

  if (rows.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm font-semibold text-text">Recent activity</span>
      </div>
      <ul className="divide-y divide-gray-100">
        {rows.slice(0, 6).map((row, i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-2.5">
            <span
              className={`h-2 w-2 flex-shrink-0 rounded-full ${
                row.tint === "emerald" ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
            <span className="w-28 flex-shrink-0 text-xs text-text-light">{row.when}</span>
            <span className="flex-1 text-sm text-text">{row.what}</span>
            <span className="text-xs text-text-light">{row.who}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── PROGRESS RING ────────────────────────────────────────────────────────
function ProgressRing({
  pct,
  completed,
  total,
  stages,
}: {
  pct: number;
  completed: number;
  total: number;
  stages: PortalStageInfo[];
}) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-light">
          Onboarding progress
        </span>
      </div>
      <div className="mt-3 flex items-center justify-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgb(229 229 229)" strokeWidth="10" />
            <defs>
              <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(34 197 94)" />
                <stop offset="100%" stopColor="rgb(59 130 246)" />
              </linearGradient>
            </defs>
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="url(#ringG)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold tracking-tight text-text">
              {pct}
              <span className="text-base text-text-light">%</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-light">
              complete
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-text">
          {completed} of {total} stages complete
        </div>
        <div className="text-xs text-text-light">
          {total - completed} to go
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {stages.map((st) => (
          <span
            key={st.key}
            className={`h-2 w-2 rounded-full ${
              st.state === "complete"
                ? "bg-emerald-500"
                : st.state === "current"
                  ? "bg-blue-500 ring-2 ring-blue-200"
                  : "bg-gray-200"
            }`}
            title={st.title}
          />
        ))}
      </div>
    </section>
  );
}

// ─── ACCOUNTANT WIDGET ────────────────────────────────────────────────────
function AccountantWidget({ accountant }: { accountant: PortalAccountantInfo }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-xs font-bold text-white">
            {initialsOf(accountant.name)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-text-light">Your accountant</div>
          <div className="text-sm font-semibold text-text">
            {accountant.name ?? "—"}
          </div>
        </div>
      </div>
      <div className="space-y-1.5 text-xs text-text-light">
        <div className="flex justify-between">
          <span>Replies typically</span>
          <span className="font-medium text-text">Within 2 hours</span>
        </div>
        <div className="flex justify-between">
          <span>Working hours</span>
          <span className="font-medium text-text">Mon–Fri, 9–5</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {accountant.calendlyUrl ? (
          <a
            href={accountant.calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-center text-xs font-medium text-white transition hover:bg-blue-700"
          >
            Book a call
          </a>
        ) : (
          <span className="rounded-md bg-blue-600/40 px-3 py-1.5 text-center text-xs font-medium text-white">
            Booking soon
          </span>
        )}
        <Link
          href="/portal/messages"
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-center text-xs font-medium text-text transition hover:border-gray-400"
        >
          Message
        </Link>
      </div>
    </section>
  );
}

// ─── TASKS WIDGET ─────────────────────────────────────────────────────────
function TasksWidget({ tasks }: { tasks: PortalTask[] }) {
  const active = tasks.filter((t) => t.state !== "complete");
  if (active.length === 0) return null;

  const needsYou = active.filter((t) => t.state !== "awaiting_us").length;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm font-semibold text-text">Tasks</span>
        {needsYou > 0 && (
          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
            {needsYou} need{needsYou === 1 ? "s" : ""} you
          </span>
        )}
      </div>
      <ul className="divide-y divide-gray-100">
        {active.map((t) => (
          <li key={t.key} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                t.state === "awaiting_us"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {t.key === "engagement_letter" ? <FileText size={14} /> : <ShieldCheck size={14} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-text">{t.title}</div>
              <div className="text-xs text-text-light">
                {t.state === "awaiting_us"
                  ? "Awaiting us · we'll send shortly"
                  : t.actionLabel ?? "Action required"}
              </div>
            </div>
            {t.actionUrl ? (
              <a href={t.actionUrl} className="text-text-light hover:text-text">
                <ChevronRight size={14} />
              </a>
            ) : (
              <ChevronRight size={14} className="text-gray-300" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── DOCUMENTS COMING UP (Phase 2 teaser) ────────────────────────────────
function DocumentsComingUp() {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Upload size={13} className="text-violet-500" />
          <span className="text-sm font-semibold text-text">Documents coming up</span>
        </div>
        <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-700">
          Soon
        </span>
      </div>
      <ul className="divide-y divide-gray-100">
        {[
          { t: "Photo ID", w: "Passport or driving licence" },
          { t: "Proof of address", w: "Bank statement or utility bill" },
          { t: "Last year's tax return", w: "Optional but useful" },
        ].map((d, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <FileText size={12} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-text">{d.t}</div>
              <div className="text-xs text-text-light">{d.w}</div>
            </div>
          </li>
        ))}
      </ul>
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
      <div className="mt-2 text-base font-semibold">{status.accountName ?? "—"}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        {status.joinedDate && (
          <div>
            <div className="text-white/50">With us since</div>
            <div className="mt-0.5 text-sm font-medium">{formatDate(status.joinedDate)}</div>
          </div>
        )}
        <div>
          <div className="text-white/50">Day</div>
          <div className="mt-0.5 text-sm font-medium">{status.daysSinceSignup}</div>
        </div>
        <div>
          <div className="text-white/50">Brand</div>
          <div className="mt-0.5 text-sm font-medium capitalize">{status.brand}</div>
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

function bulletsForStage(stage: PortalStageKey | string) {
  switch (stage) {
    case "welcome":
      return null;
    case "main":
      return [
        { icon: Banknote, label: "VAT — when you need to register" },
        { icon: PenLine, label: "Year-end & accounts dates" },
        { icon: CreditCard, label: "Salary & dividends strategy" },
        { icon: Receipt, label: "Bookkeeping cadence we'll use" },
        { icon: Smartphone, label: "What goes in the portal vs email" },
      ];
    case "portal":
      return [
        { icon: Receipt, label: "Logging expenses on the move" },
        { icon: PenLine, label: "Raising invoices to clients" },
        { icon: Banknote, label: "Paying yourself a salary" },
        { icon: CreditCard, label: "Connecting your bank feeds" },
        { icon: Smartphone, label: "Setting up the mobile app" },
      ];
    case "checkin30":
    case "checkin60":
      return null;
    case "catchup":
      return [
        { icon: Receipt, label: "Quarter's numbers" },
        { icon: PenLine, label: "Anything to clean up" },
        { icon: Banknote, label: "Plans for the next quarter" },
      ];
    default:
      return null;
  }
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

function initialsOf(name: string | null): string {
  if (!name) return "··";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
