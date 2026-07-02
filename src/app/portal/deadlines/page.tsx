import {
  CalendarClock,
  FileText,
  ClipboardCheck,
  Percent,
  Landmark,
  Banknote,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getDeadlinesForCurrentUser } from "@/lib/portal/deadlines";
import AccessGate from "@/components/portal/AccessGate";
import type { PortalDeadline } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Deadlines hub. Strong hierarchy: a prominent "Needs your attention" zone for
 * anything blocked on the client (overdue / due-soon to approve), then a quiet
 * "Coming up" list for everything we're handling. Cache-backed + Aurora style.
 */
export default async function DeadlinesPage() {
  const [brand, portalUser, result] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getDeadlinesForCurrentUser(),
  ]);

  const firstName =
    portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  if (
    portalUser &&
    (portalUser.status === "disabled" || portalUser.status === "pending")
  ) {
    return (
      <Wrap>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </Wrap>
    );
  }

  if (result.ok === false) {
    return (
      <Wrap>
        <div className="max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-800">
          We couldn&apos;t load your deadlines just now — try refreshing.
        </div>
      </Wrap>
    );
  }

  const deadlines = result.data;
  const actionNow = deadlines.filter(
    (d) =>
      d.status !== "submitted" &&
      (d.status === "overdue" ||
        (d.status === "due_soon" && d.blockedOn === "client"))
  );
  const actionIds = new Set(actionNow.map((d) => d.id));
  const comingUp = deadlines.filter(
    (d) => d.status !== "submitted" && !actionIds.has(d.id)
  );
  const done = deadlines.filter((d) => d.status === "submitted");

  return (
    <Wrap>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
            <CalendarClock size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Deadlines
            </h1>
            <p className="mt-0.5 text-sm text-text-light">
              Everything you need to file or approve — and exactly when
              it&apos;s due.
            </p>
          </div>
        </div>
        {actionNow.length > 0 ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            <AlertTriangle size={12} /> {actionNow.length} need
            {actionNow.length === 1 ? "s" : ""} you
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={12} /> Nothing needs you right now
          </span>
        )}
      </div>

      {deadlines.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-text-light shadow-md">
          No upcoming deadlines on record. We&apos;ll surface them here as your
          filing dates approach.
        </div>
      )}

      {/* NEEDS YOU — prominent */}
      {actionNow.length > 0 && (
        <section className="mb-7">
          <SectionLabel>Needs your attention</SectionLabel>
          <div className="grid gap-4 lg:grid-cols-2">
            {actionNow.map((d) => (
              <ActionCard key={d.id} d={d} />
            ))}
          </div>
        </section>
      )}

      {/* COMING UP — quiet list */}
      {(comingUp.length > 0 || done.length > 0) && (
        <section>
          <SectionLabel>Coming up</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
            <ul className="divide-y divide-neutral-100">
              {comingUp.map((d) => (
                <ComingUpRow key={d.id} d={d} />
              ))}
              {done.map((d) => (
                <ComingUpRow key={d.id} d={d} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-light">
      {children}
    </h2>
  );
}

const KIND_META: Record<string, { icon: typeof FileText; label: string }> = {
  accounts: { icon: FileText, label: "Annual accounts" },
  confirmation_statement: { icon: ClipboardCheck, label: "Confirmation statement" },
  vat: { icon: Percent, label: "VAT return" },
  self_assessment: { icon: UserCheck, label: "Self Assessment" },
  corporation_tax: { icon: Landmark, label: "Corporation Tax" },
  payroll: { icon: Banknote, label: "Payroll / RTI" },
};

// ─── ACTION CARD (prominent) ────────────────────────────────────────────────
function ActionCard({ d }: { d: PortalDeadline }) {
  const meta = KIND_META[d.kind] ?? { icon: CalendarClock, label: "Filing" };
  const Icon = meta.icon;

  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/70 to-white p-5 shadow-md">
      <span className="absolute inset-y-0 left-0 w-1.5 bg-orange-500" />
      <div className="flex items-start gap-3 pl-1.5">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text">{d.title}</h3>
              {d.periodLabel && (
                <p className="text-xs text-text-light">{d.periodLabel}</p>
              )}
            </div>
            <Countdown days={d.daysUntil} submitted={false} prominent />
          </div>

          <p className="mt-2 text-sm text-text">
            <span className="font-medium text-orange-700">Needs you</span> —
            review &amp; approve so we can file{" "}
            {d.dueDate ? `by ${formatDate(d.dueDate)}` : "on time"}.
          </p>

          <div className="mt-4">
            <Link
              href="/portal/approvals"
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
            >
              Review &amp; approve <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COMING-UP ROW (quiet) ──────────────────────────────────────────────────
function ComingUpRow({ d }: { d: PortalDeadline }) {
  const meta = KIND_META[d.kind] ?? { icon: CalendarClock, label: "Filing" };
  const Icon = meta.icon;
  const submitted = d.status === "submitted";

  return (
    <li className="flex items-center gap-3 px-5 py-3.5">
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
          submitted
            ? "bg-emerald-50 text-emerald-600"
            : "bg-[#1A7A9B]/10 text-[#1A7A9B]"
        }`}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-text">{d.title}</div>
        {d.periodLabel && (
          <div className="truncate text-xs text-text-light">{d.periodLabel}</div>
        )}
      </div>
      <div className="hidden text-right sm:block">
        <div className="text-sm text-text">
          {d.dueDate ? formatDate(d.dueDate) : "—"}
        </div>
        <Countdown days={d.daysUntil} submitted={submitted} />
      </div>
      <span
        className={`hidden flex-shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium md:inline ${
          submitted
            ? "bg-emerald-50 text-emerald-700"
            : d.blockedOn === "client"
              ? "bg-neutral-100 text-text-light"
              : "bg-[#1A7A9B]/10 text-[#1A7A9B]"
        }`}
      >
        {submitted
          ? "Filed"
          : d.blockedOn === "client"
            ? "You'll review nearer the time"
            : "We'll handle it"}
      </span>
    </li>
  );
}

function Countdown({
  days,
  submitted,
  prominent = false,
}: {
  days: number | null;
  submitted: boolean;
  prominent?: boolean;
}) {
  if (submitted) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <CheckCircle2 size={12} /> Filed
      </span>
    );
  }
  if (days == null) return null;

  const base = prominent ? "text-sm font-bold" : "text-xs font-semibold";
  if (days < 0) {
    return (
      <span className={`${base} text-red-600`}>
        {Math.abs(days)}d overdue
      </span>
    );
  }
  if (days === 0) {
    return <span className={`${base} text-orange-600`}>Due today</span>;
  }
  return (
    <span className={`${base} ${days <= 30 ? "text-orange-600" : "text-text-light"}`}>
      in {days} day{days === 1 ? "" : "s"}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
