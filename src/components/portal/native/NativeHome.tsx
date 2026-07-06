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
  HandHeart,
  Coffee,
  Laptop,
  TrendingUp,
  PartyPopper,
  MessageSquare,
  CalendarClock,
  FileText,
  Landmark,
  Percent,
  CalendarDays,
  PoundSterling,
  Wallet,
  Receipt,
  Activity,
} from "lucide-react";
import type { BrandConfig } from "@/lib/constants";
import type {
  PortalOnboardingStatus,
  PortalStageKey,
  PortalDeadline,
  PortalFinancials,
} from "@/lib/portal/types";

/**
 * NativeHome — the "rich-vibrant" Home screen rendered only inside the
 * Capacitor app (html[data-native]). Web keeps the DashboardBody layout in
 * page.tsx untouched.
 *
 * Everything colour is driven from `brand.colors` so Workwell inherits the
 * exact same layout with its own palette (dark-teal hero + green action) —
 * one code path, two brands. See mobile/HANDOFF.md.
 *
 *   ┌───────────────────────────┐
 *   │ immersive brand hero      │  greeting · business · live
 *   │  ┌─────────────────────┐  │
 *   │  │ Up next (book call) │  │  straddles the hero seam
 *   │  └─────────────────────┘  │
 *   │  money stat cards         │  the reason to log in
 *   │  onboarding journey       │  ring + stepper
 *   │  upcoming deadlines       │
 *   │  explore                  │
 *   └───────────────────────────┘
 */

const STAGE_META: Record<
  PortalStageKey | string,
  { icon: typeof Sparkles; duration: string; gist: string }
> = {
  welcome: {
    icon: HandHeart,
    duration: "20 min",
    gist: "Meet your accountant, share what your business does, hear how it works.",
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

const DEADLINE_ICON: Record<string, typeof CalendarClock> = {
  accounts: FileText,
  confirmation_statement: Landmark,
  vat: Percent,
  self_assessment: FileText,
  corporation_tax: Landmark,
  payroll: CalendarDays,
};

const EXPLORE: {
  href: string;
  icon: typeof FileText;
  title: string;
  sub: string;
  action?: boolean;
}[] = [
  { href: "/portal/deadlines", icon: CalendarClock, title: "Deadlines", sub: "What's due" },
  { href: "/portal/documents", icon: FileText, title: "Documents", sub: "Send & get" },
  { href: "/portal/details", icon: Building2, title: "Your details", sub: "Company info" },
  { href: "/portal/messages", icon: MessageSquare, title: "Messages", sub: "Talk to us", action: true },
];

export default function NativeHome({
  brand,
  status,
  firstName,
  firmName,
  deadlines,
  financials,
}: {
  brand: BrandConfig;
  status: PortalOnboardingStatus;
  firstName: string | null;
  firmName: string;
  deadlines: PortalDeadline[];
  financials: PortalFinancials | null;
}) {
  const c = brand.colors;
  const a = status.accountant;
  const accountantFirst = (a.name ?? "your accountant").split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: c.surface }}>
      {/* ── IMMERSIVE HERO — bleeds up under the status bar ───────────── */}
      <header
        className="relative px-5 pb-[70px] text-white"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 14px)",
          background: `radial-gradient(90% 78% at 85% -5%, ${withAlpha(
            c.secondary,
            0.3,
          )} 0%, transparent 55%), linear-gradient(165deg, ${c.primary} 0%, ${c.primaryDark} 100%)`,
        }}
      >
        <div className="mt-4">
          <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-tight">
            {greetingForNow()},<br />
            {firstName ?? "there"}
          </h1>
          {status.accountName && (
            <p className="mt-2 text-[13.5px] font-medium text-white/75">
              {status.accountName}
            </p>
          )}
        </div>
        <span className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11.5px] font-semibold backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
          <ShieldCheck size={12} />
          Encrypted · synced live
        </span>
      </header>

      {/* ── CONTENT — the up-next card straddles the hero seam ────────── */}
      <div className="relative z-10 -mt-14 space-y-5 px-4 pb-8">
        <UpNext status={status} accountantFirst={accountantFirst} c={c} />
        <NativeMoney financials={financials} c={c} />
        <Journey status={status} c={c} />
        <Deadlines deadlines={deadlines} c={c} />
        <Explore c={c} />
      </div>
    </div>
  );
}

// ── UP NEXT (book the call) ──────────────────────────────────────────────
function UpNext({
  status,
  accountantFirst,
  c,
}: {
  status: PortalOnboardingStatus;
  accountantFirst: string;
  c: BrandConfig["colors"];
}) {
  const a = status.accountant;

  if (status.isComplete) {
    return (
      <section
        className="relative overflow-hidden rounded-[26px] p-6 text-white shadow-xl"
        style={{ background: `linear-gradient(150deg, ${c.primary}, ${c.primaryDark})` }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/22 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider">
          <PartyPopper size={13} /> All set up
        </span>
        <h2 className="mt-3.5 text-[23px] font-extrabold leading-tight tracking-tight">
          You&apos;re all set up 🎉
        </h2>
        <p className="mt-2 max-w-[27ch] text-[13px] leading-relaxed text-white/85">
          Your accountant relationship is in routine mode — message anytime, book a
          call when you need one.
        </p>
      </section>
    );
  }

  const meta = STAGE_META[status.currentStage];
  return (
    <section
      className="relative overflow-hidden rounded-[26px] p-5 text-white shadow-xl"
      style={{
        background: `linear-gradient(150deg, ${c.secondary} 0%, ${c.secondaryDark} 100%)`,
        boxShadow: `0 22px 42px -18px ${withAlpha(c.secondaryDark, 0.6)}`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,.3), transparent 65%)" }}
      />
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/22 px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.09em]">
        <Video size={13} /> Up next
      </span>
      <h2 className="mt-3 max-w-[15ch] text-[22px] font-extrabold leading-[1.12] tracking-tight">
        {status.nextActionLabel}
      </h2>
      <p className="mt-1.5 max-w-[28ch] text-[12.5px] leading-relaxed text-white/90">
        {meta?.gist ?? "A hands-on session covering everything you need at this stage."}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[11.5px] font-semibold text-white/95">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} /> {meta?.duration ?? "30 min"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Video size={13} /> Video call
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} /> {a.name ?? "your accountant"}
        </span>
      </div>

      {a.calendlyUrl ? (
        <Link
          href="/portal/appointments"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-3.5 text-[15px] font-extrabold tracking-tight shadow-md"
          style={{ color: c.secondaryDark }}
        >
          Choose a time <ArrowRight size={17} />
        </Link>
      ) : (
        <span className="mt-4 flex w-full items-center justify-center rounded-[14px] bg-white/40 py-3.5 text-[15px] font-extrabold text-white">
          Booking link coming
        </span>
      )}
      <Link
        href="/portal/messages"
        className="mt-3 flex items-center gap-1.5 px-0.5 text-[12.5px] font-semibold text-white/95"
      >
        Or message {accountantFirst} <ArrowUpRight size={13} />
      </Link>
    </section>
  );
}

// ── MONEY — bold saturated stat cards ────────────────────────────────────
function NativeMoney({
  financials: fin,
  c,
}: {
  financials: PortalFinancials | null;
  c: BrandConfig["colors"];
}) {
  if (!fin || typeof fin.netProfit !== "number") return null;

  const isLoss = fin.netProfit < 0;
  const cashLow = fin.cashInBank != null && fin.cashInBank < 0;
  const needsBooks = (fin.unexplainedCount ?? 0) > 0;

  // Semantic status colours (brand-independent) — used only where a figure
  // signals something (loss, overdrawn, books to tidy). Everything else stays
  // ink on white so the money row reads calm, not a rainbow.
  const AMBER = "#d97706";
  const RED = "#dc2626";
  const EMERALD = "#0f9d6b";

  const cards: {
    label: string;
    value: string;
    icon: typeof PoundSterling;
    chip: string;
    valueColor: string;
  }[] = [
    {
      label: isLoss ? "Net loss" : "Net profit",
      value: gbp(Math.abs(fin.netProfit)),
      icon: isLoss ? Activity : TrendingUp,
      chip: isLoss ? AMBER : c.primary,
      valueColor: isLoss ? AMBER : c.text,
    },
    {
      label: cashLow ? "Overdrawn" : "Cash in the bank",
      value: fin.cashInBank != null ? gbp(fin.cashInBank) : "—",
      icon: Wallet,
      chip: cashLow ? RED : EMERALD,
      valueColor: cashLow ? RED : c.text,
    },
    {
      label: `Set aside for tax · ~${fin.taxRatePct}%`,
      value: gbp(fin.estTaxSetAside),
      icon: Landmark,
      chip: c.secondaryDark,
      valueColor: c.text,
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
      chip: needsBooks ? AMBER : EMERALD,
      valueColor: needsBooks ? AMBER : c.text,
    },
  ];

  return (
    <section>
      <SectionHead c={c} title="Where your business stands" href="/portal/financials" cta="Full P&L" />
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="flex min-h-[104px] flex-col justify-between rounded-[20px] bg-white p-4 shadow-[0_10px_26px_-18px_rgba(13,37,48,.4),0_0_0_1px_rgba(13,37,48,.05)]"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-[10px]"
                style={{ background: withAlpha(card.chip, 0.12), color: card.chip }}
              >
                <Icon size={16} />
              </span>
              <div>
                <div
                  className="text-[22px] font-extrabold tracking-tight [font-variant-numeric:tabular-nums]"
                  style={{ color: card.valueColor }}
                >
                  {card.value}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold" style={{ color: c.textLight }}>
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── JOURNEY — ring + stepper ─────────────────────────────────────────────
function Journey({
  status,
  c,
}: {
  status: PortalOnboardingStatus;
  c: BrandConfig["colors"];
}) {
  const completed = status.stages.filter((s) => s.state === "complete").length;
  const pct = Math.round((completed / status.totalStages) * 100);
  const R = 28;
  const CIRC = 2 * Math.PI * R;

  return (
    <section className="rounded-[24px] bg-white p-[18px] shadow-[0_10px_26px_-18px_rgba(13,37,48,.4),0_0_0_1px_rgba(13,37,48,.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.13em]" style={{ color: c.textLight }}>
            Your onboarding journey
          </div>
          <div className="mt-1 text-[17px] font-extrabold tracking-tight" style={{ color: c.text }}>
            {status.isComplete ? (
              <>You&apos;re all set up 🎉</>
            ) : (
              <>
                You&apos;re on{" "}
                <span style={{ color: c.secondaryDark }}>{status.stageTitle}</span>
              </>
            )}
          </div>
        </div>
        <div className="relative h-[56px] w-[56px] flex-none">
          <svg width="56" height="56" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="#e2eaed" strokeWidth="7" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke={c.primary}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - pct / 100)}
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <b className="text-[16px] font-extrabold tracking-tight" style={{ color: c.primary }}>
              {pct}%
            </b>
            <span className="-mt-0.5 text-[8px] font-semibold" style={{ color: c.textLight }}>
              {completed} of {status.totalStages}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex overflow-x-auto pb-1">
        <div className="flex min-w-[300px] flex-1">
          {status.stages.map((st, i) => {
            const done = st.state === "complete";
            const now = st.state === "current";
            const Icon = STAGE_META[st.key]?.icon ?? Sparkles;
            const isFirst = i === 0;
            const isLast = i === status.stages.length - 1;
            return (
              <div key={st.key} className="relative flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span
                    className="h-[3px] flex-1 rounded"
                    style={{
                      background: isFirst ? "transparent" : done || now ? c.primary : "#e2eaed",
                    }}
                  />
                  <span
                    className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full"
                    style={
                      done
                        ? { background: c.primary, color: "#fff" }
                        : now
                          ? { border: `2.5px solid ${c.secondary}`, color: c.secondary, background: withAlpha(c.secondary, 0.1) }
                          : { border: "2px solid #e2eaed", color: "#a9bcc3", background: "#fff" }
                    }
                  >
                    {done ? <Check size={17} strokeWidth={3} /> : <Icon size={17} />}
                  </span>
                  <span
                    className="h-[3px] flex-1 rounded"
                    style={{ background: isLast ? "transparent" : done ? c.primary : "#e2eaed" }}
                  />
                </div>
                <div
                  className="mt-2 px-0.5 text-center text-[10.5px] leading-tight"
                  style={{ color: now || done ? c.text : c.textLight, fontWeight: now ? 700 : 500 }}
                >
                  {st.title}
                </div>
                {now && (
                  <div className="mt-0.5 text-[8.5px] font-extrabold uppercase tracking-wide" style={{ color: c.secondaryDark }}>
                    Now
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── DEADLINES ────────────────────────────────────────────────────────────
function Deadlines({
  deadlines,
  c,
}: {
  deadlines: PortalDeadline[];
  c: BrandConfig["colors"];
}) {
  const upcoming = (deadlines ?? [])
    .filter((d) => d.status !== "submitted" && d.dueDate)
    .sort((x, y) => new Date(x.dueDate!).getTime() - new Date(y.dueDate!).getTime())
    .slice(0, 4);
  if (upcoming.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_26px_-18px_rgba(13,37,48,.4),0_0_0_1px_rgba(13,37,48,.05)]">
      <div className="flex items-center justify-between border-b border-neutral-100 px-[17px] py-[15px]">
        <div className="flex items-center gap-2.5 text-[13.5px] font-bold" style={{ color: c.text }}>
          <span
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            style={{ background: withAlpha(c.primary, 0.12), color: c.primary }}
          >
            <CalendarClock size={14} />
          </span>
          Upcoming deadlines
        </div>
        <Link href="/portal/deadlines" className="text-[12px] font-bold" style={{ color: c.primary }}>
          View all
        </Link>
      </div>
      <ul>
        {upcoming.map((d) => {
          const Icon = DEADLINE_ICON[d.kind] ?? CalendarClock;
          const overdue = d.status === "overdue";
          const soon = d.status === "due_soon";
          return (
            <li key={d.id} className="flex items-center gap-3 border-b border-neutral-100 px-[17px] py-3.5 last:border-b-0">
              <span
                className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
                style={{ background: withAlpha(c.primary, 0.1), color: c.primary }}
              >
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold" style={{ color: c.text }}>
                  {d.title}
                </div>
                {d.periodLabel && (
                  <div className="truncate text-[11.5px]" style={{ color: c.textLight }}>
                    {d.periodLabel}
                  </div>
                )}
              </div>
              <div className="flex-none text-right">
                <div
                  className="text-[12.5px] font-bold"
                  style={{ color: overdue ? "#dc2626" : soon ? c.secondaryDark : c.text }}
                >
                  {d.dueDate ? formatDate(d.dueDate) : "—"}
                </div>
                {overdue ? (
                  <div className="text-[10.5px] font-semibold text-red-600">Overdue</div>
                ) : (
                  typeof d.daysUntil === "number" &&
                  d.daysUntil >= 0 && (
                    <div className="text-[10.5px]" style={{ color: c.textLight }}>
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

// ── EXPLORE ──────────────────────────────────────────────────────────────
function Explore({ c }: { c: BrandConfig["colors"] }) {
  return (
    <section>
      <SectionHead c={c} title="Explore your portal" />
      <div className="grid grid-cols-2 gap-2.5">
        {EXPLORE.map((e) => {
          const Icon = e.icon;
          const tint = e.action
            ? { background: withAlpha(c.secondary, 0.18), color: c.secondaryDark }
            : { background: withAlpha(c.primary, 0.12), color: c.primary };
          return (
            <Link
              key={e.href}
              href={e.href}
              className="flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-[0_8px_20px_-16px_rgba(13,37,48,.4),0_0_0_1px_rgba(13,37,48,.05)]"
            >
              <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-xl" style={tint}>
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <div className="text-[12.5px] font-bold" style={{ color: c.text }}>
                  {e.title}
                </div>
                <div className="truncate text-[10.5px]" style={{ color: c.textLight }}>
                  {e.sub}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SectionHead({
  c,
  title,
  href,
  cta,
}: {
  c: BrandConfig["colors"];
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: c.textLight }}>
        {title}
      </h2>
      {href && cta && (
        <Link href={href} className="inline-flex items-center gap-1 text-[12px] font-bold" style={{ color: c.primary }}>
          {cta} <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}

// ── HELPERS ──────────────────────────────────────────────────────────────
function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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

/** #RRGGBB → rgba() so brand hexes can be used at partial opacity in gradients. */
function withAlpha(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
