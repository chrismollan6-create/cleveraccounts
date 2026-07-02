import {
  PoundSterling,
  TrendingUp,
  Wallet,
  Landmark,
  Receipt,
  Info,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getFinancialsForCurrentUser } from "@/lib/portal/financials";
import AccessGate from "@/components/portal/AccessGate";
import type { PortalFinancials } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Financials — an up-to-date P&L + money snapshot from FreeAgent (cached via
 * Salesforce). The "reason to log in": where the business stands, what's owed,
 * what to set aside. Matches the shared portal surface style.
 */
export default async function FinancialsPage() {
  const [brand, portalUser, result] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getFinancialsForCurrentUser(),
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

  const fin = result.ok ? result.data : null;

  return (
    <Wrap>
      <div className="mb-7 flex items-center gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
          <PoundSterling size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Your finances
          </h1>
          <p className="mt-0.5 text-sm text-text-light">
            An up-to-date snapshot of how your business is doing — straight from
            your bookkeeping.
          </p>
        </div>
      </div>

      {!fin ? (
        <EmptyState />
      ) : (
        <>
          <Snapshot fin={fin} />
          <ProfitLoss fin={fin} />
          <AsOf fin={fin} />
        </>
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

function EmptyState() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-md sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
        <Sparkles size={26} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-text">
        Your figures are on their way
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-light">
        We pull your numbers from your bookkeeping. As soon as your first set is
        ready, your live profit &amp; loss and money snapshot will appear here.
      </p>
    </div>
  );
}

// ─── MONEY SNAPSHOT ─────────────────────────────────────────────────────────
function Snapshot({ fin }: { fin: PortalFinancials }) {
  const profit = fin.netProfit ?? 0;
  const isLoss = profit < 0;
  return (
    <section className="mb-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={isLoss ? "Net loss (this period)" : "Net profit (this period)"}
          value={gbp(Math.abs(profit))}
          icon={isLoss ? ArrowDownRight : TrendingUp}
          tone={isLoss ? "amber" : "teal"}
          hero
        />
        <StatCard
          label={
            fin.cashInBank != null && fin.cashInBank < 0
              ? "Overdrawn"
              : "Cash in the bank"
          }
          value={fin.cashInBank != null ? gbp(fin.cashInBank) : "—"}
          icon={Wallet}
          tone={fin.cashInBank != null && fin.cashInBank < 0 ? "amber" : "teal"}
        />
        <StatCard
          label={`Set aside for tax (est. ${fin.taxRatePct}%)`}
          value={gbp(fin.estTaxSetAside)}
          icon={Landmark}
          tone="orange"
        />
        <StatCard
          label="Bookkeeping"
          value={
            fin.unexplainedCount == null
              ? "—"
              : fin.unexplainedCount === 0
                ? "All tidy"
                : `${fin.unexplainedCount} to explain`
          }
          icon={Receipt}
          tone={
            fin.unexplainedCount && fin.unexplainedCount > 0 ? "amber" : "teal"
          }
        />
      </div>
    </section>
  );
}

const TONES: Record<string, { chip: string; ring: string }> = {
  teal: { chip: "bg-[#1A7A9B]/10 text-[#1A7A9B]", ring: "" },
  orange: { chip: "bg-orange-50 text-orange-600", ring: "" },
  amber: { chip: "bg-amber-50 text-amber-600", ring: "" },
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  hero = false,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  tone: string;
  hero?: boolean;
}) {
  const t = TONES[tone] ?? TONES.teal;
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-md ${
        hero ? "border-[#1A7A9B]/30" : "border-neutral-200"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.chip}`}
      >
        <Icon size={17} />
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-text">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-text-light">{label}</div>
    </div>
  );
}

// ─── PROFIT & LOSS ──────────────────────────────────────────────────────────
function ProfitLoss({ fin }: { fin: PortalFinancials }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1A7A9B]/10 text-[#1A7A9B]">
          <TrendingUp size={14} />
        </span>
        <h2 className="text-sm font-semibold text-text">Profit &amp; loss</h2>
      </div>
      <dl className="divide-y divide-neutral-100">
        <Row label="Revenue" value={gbp(fin.revenue)} />
        <Row label="Cost of sales" value={`(${gbp(fin.costOfSales)})`} muted />
        <Row label="Gross profit" value={gbp(fin.grossProfit)} strong />
        <Row label="Expenses" value={`(${gbp(fin.expenses)})`} muted />
        <Row
          label={fin.netProfit < 0 ? "Net loss" : "Net profit"}
          value={gbp(Math.abs(fin.netProfit))}
          strong
          highlight
        />
      </dl>
    </section>
  );
}

function Row({
  label,
  value,
  strong = false,
  muted = false,
  highlight = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 py-3 ${
        highlight ? "bg-[#1A7A9B]/[0.04]" : ""
      }`}
    >
      <dt
        className={`text-sm ${
          strong ? "font-semibold text-text" : "text-text-light"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`text-sm tabular-nums ${
          strong ? "font-bold text-text" : muted ? "text-text-light" : "text-text"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

// ─── AS-OF + CAVEAT ─────────────────────────────────────────────────────────
function AsOf({ fin }: { fin: PortalFinancials }) {
  return (
    <div className="mt-4 flex flex-col gap-2 text-xs text-text-light sm:flex-row sm:items-center sm:justify-between">
      <span>
        {fin.periodStart && fin.periodEnd
          ? `Period ${formatDate(fin.periodStart)} – ${formatDate(fin.periodEnd)}. `
          : ""}
        {fin.asOf ? `Figures as of ${formatDate(fin.asOf)}.` : ""}
      </span>
      <span className="inline-flex items-start gap-1.5 rounded-lg bg-neutral-50 px-2.5 py-1.5">
        <Info size={12} className="mt-0.5 flex-shrink-0" />
        Tax set-aside is an estimate to guide you — your accountant confirms the
        exact figure.
      </span>
    </div>
  );
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function gbp(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
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
