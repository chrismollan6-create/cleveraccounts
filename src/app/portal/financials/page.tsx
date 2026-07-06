import Link from "next/link";
import {
  PoundSterling,
  TrendingUp,
  Wallet,
  Landmark,
  Receipt,
  Info,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { headers } from "next/headers";
import { isNativeAppUA } from "@/lib/portal/native";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getFinancialsForCurrentUser } from "@/lib/portal/financials";
import AccessGate from "@/components/portal/AccessGate";
import type {
  PortalFinancials,
  PortalFinancialsTrendPoint,
  PortalMissedExpense,
} from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Financials — an up-to-date P&L + money snapshot from FreeAgent (cached via
 * Salesforce). The "reason to log in": where the business stands, what's owed,
 * what to set aside. Matches the shared portal surface style.
 */
export default async function FinancialsPage() {
  const [brand, portalUser, result, hdrs] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getFinancialsForCurrentUser(),
    headers(),
  ]);
  const isNativeApp = isNativeAppUA(hdrs.get("user-agent"));

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
      {!isNativeApp && (
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
      )}

      {!fin ? (
        <EmptyState />
      ) : (
        <>
          <Snapshot fin={fin} />
          <TrendSection trend={fin.trend ?? []} />
          <ProfitLoss fin={fin} />
          <MissedExpenses items={fin.missedExpenses ?? []} />
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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
  teal: { chip: "bg-primary/10 text-primary", ring: "" },
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
        hero ? "border-primary/30" : "border-neutral-200"
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
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
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
        highlight ? "bg-primary/[0.04]" : ""
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

// ─── TREND (month by month) ─────────────────────────────────────────────────
function TrendSection({ trend }: { trend: PortalFinancialsTrendPoint[] }) {
  if (!trend || trend.length === 0) return null;
  const max = Math.max(...trend.map((t) => Math.abs(t.netProfit)), 1);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BarChart3 size={14} />
        </span>
        <h2 className="text-sm font-semibold text-text">Month by month</h2>
        <span className="ml-auto text-xs text-text-light">Net profit</span>
      </div>

      {/* Bars — net profit per month */}
      <div className="px-5 pt-6">
        <div className="flex items-end gap-2 sm:gap-3" style={{ height: 132 }}>
          {trend.map((t) => {
            const loss = t.netProfit < 0;
            const h = Math.max(6, Math.round((Math.abs(t.netProfit) / max) * 104));
            return (
              <div
                key={t.month}
                className="flex flex-1 flex-col items-center justify-end"
              >
                <div
                  className={`mb-1 text-[10px] font-semibold ${
                    loss ? "text-amber-600" : "text-text"
                  }`}
                >
                  {gbpShort(t.netProfit)}
                </div>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    loss ? "bg-amber-400" : "bg-primary"
                  }`}
                  style={{ height: h }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 sm:gap-3">
          {trend.map((t) => (
            <div
              key={t.month}
              className="flex-1 text-center text-[11px] text-text-light"
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* Figures side by side */}
      <div className="mt-4 overflow-x-auto border-t border-neutral-100">
        <table className="w-full min-w-[520px] text-sm">
          <tbody className="divide-y divide-neutral-100">
            <TrendRow label="Revenue" pts={trend} pick={(t) => t.revenue} />
            <TrendRow
              label="Gross profit"
              pts={trend}
              pick={(t) => t.grossProfit}
            />
            <TrendRow
              label="Net profit"
              pts={trend}
              pick={(t) => t.netProfit}
              strong
            />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TrendRow({
  label,
  pts,
  pick,
  strong = false,
}: {
  label: string;
  pts: PortalFinancialsTrendPoint[];
  pick: (t: PortalFinancialsTrendPoint) => number;
  strong?: boolean;
}) {
  return (
    <tr>
      <td
        className={`sticky left-0 bg-white px-5 py-2.5 text-left text-xs ${
          strong ? "font-semibold text-text" : "text-text-light"
        }`}
      >
        {label}
      </td>
      {pts.map((t, i) => {
        const v = pick(t);
        const last = i === pts.length - 1;
        return (
          <td
            key={t.month}
            className={`px-3 py-2.5 text-right tabular-nums ${
              strong ? "font-semibold" : ""
            } ${v < 0 ? "text-amber-600" : "text-text"} ${
              last ? "bg-primary/[0.04]" : ""
            }`}
          >
            {gbp(v)}
          </td>
        );
      })}
    </tr>
  );
}

// ─── MISSED EXPENSES ("have you thought about…") ────────────────────────────
function MissedExpenses({ items }: { items: PortalMissedExpense[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-amber-200/70 bg-amber-50/40 shadow-md">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <Lightbulb size={16} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-text">
            Worth checking you&apos;re claiming
          </h2>
          <p className="text-[11px] text-text-light">
            Expenses businesses like yours often claim. If any apply to you,
            mention them to us — we&apos;ll take care of it.
          </p>
        </div>
      </div>
      <ul className="grid gap-px bg-amber-100/60 sm:grid-cols-2">
        {items.map((m) => (
          <li key={m.key} className="bg-[#FFFDF7] px-5 py-3">
            <div className="text-sm font-medium text-text">{m.title}</div>
            <div className="mt-0.5 text-xs text-text-light">{m.note}</div>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3">
        <Link
          href="/portal/messages"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
        >
          Ask your accountant <ArrowRight size={13} />
        </Link>
      </div>
    </section>
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

/** Compact currency for tight spots, e.g. "£9.8k" / "-£2k". */
function gbpShort(n: number): string {
  const a = Math.abs(n);
  const s =
    a >= 1000 ? `£${(a / 1000).toFixed(a >= 10000 ? 0 : 1)}k` : `£${Math.round(a)}`;
  return n < 0 ? `-${s}` : s;
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
