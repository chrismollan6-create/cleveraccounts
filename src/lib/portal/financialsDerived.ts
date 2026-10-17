import type { PortalFinancials, PortalFinancialsTrendPoint } from "./types";

/**
 * Derived financial figures — the comparisons and projections the dashboard
 * shows, computed from data the portal ALREADY holds.
 *
 * Deliberately pure and infra-free (no DB, no Clerk, no Salesforce), the same
 * way scopeDecision.ts is, so every edge case can be unit-tested without
 * standing anything up. Everything here is derived from
 * `PortalFinancials.trend` — the 12 months of P&L MOVEMENT that
 * PortalFinancialsService already builds from FreeAgent trial balances.
 *
 * What is NOT here, and why:
 *   · Year-on-year comparison. The trend window is 12 months, so there is no
 *     prior-year month to compare against. Faking it from a partial window
 *     would put a wrong number next to a real one, which is worse than showing
 *     nothing. It needs a backend change (a second trial-balance window) and
 *     is deliberately absent until then.
 *
 * Every function returns null rather than a zero or a guess when the data
 * can't support an honest answer. The dashboard renders nothing in that case.
 */

/** A month of the current accounting period, with its running total. */
export interface CumulativePoint {
  month: string;
  label: string;
  /** This month's movement. */
  netProfit: number;
  /** Running total from the start of the accounting period. */
  cumulative: number;
}

/** "YYYY-MM" for an ISO date string, or null if unparseable. */
function monthKey(iso: string | null): string | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  return m ? `${m[1]}-${m[2]}` : null;
}

/** Whole months from `from` to `to` inclusive of neither end — i.e. the gap. */
function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

/**
 * The months of `trend` that fall inside the CURRENT accounting period, with a
 * running total. Everything the lead chart needs.
 *
 * The trend window can straddle a year end (it's the last 12 calendar months,
 * not the last 12 months of this year), so months before `periodStart` are
 * dropped — otherwise the cumulative line would carry last year's profit into
 * this year's total.
 */
export function cumulativeThisPeriod(
  fin: PortalFinancials | null
): CumulativePoint[] {
  const trend = fin?.trend;
  if (!trend || trend.length === 0) return [];
  const start = monthKey(fin?.periodStart ?? null);

  const inPeriod: PortalFinancialsTrendPoint[] = start
    ? trend.filter((t) => t.month >= start)
    : trend;

  let running = 0;
  return inPeriod.map((t) => {
    const n = typeof t.netProfit === "number" ? t.netProfit : 0;
    running += n;
    return { month: t.month, label: t.label, netProfit: n, cumulative: running };
  });
}

/** The most recent month's profit movement, or null when there's no trend. */
export function latestMonthMovement(
  fin: PortalFinancials | null
): { label: string; netProfit: number } | null {
  const trend = fin?.trend;
  if (!trend || trend.length === 0) return null;
  const last = trend[trend.length - 1];
  if (typeof last?.netProfit !== "number") return null;
  return { label: last.label, netProfit: last.netProfit };
}

export interface Forecast {
  /** Projected profit at the period end. */
  value: number;
  /** Profit booked so far this period. */
  toDate: number;
  /** How many months the run-rate averages over (3, or fewer if that's all there is). */
  basisMonths: number;
  /** Months still to run in the period. */
  monthsRemaining: number;
}

/** Minimum months of history before a run-rate means anything. */
const MIN_BASIS_MONTHS = 3;

/**
 * Projects the period-end profit from a recent run rate.
 *
 * Deliberately conservative about when it will answer at all:
 *   · needs a period end to project to,
 *   · needs at least MIN_BASIS_MONTHS of movement to average,
 *   · returns null once the period is over (nothing left to project),
 *   · returns null if the run rate is negative — "on track to finish at a
 *     loss" is a conversation for an accountant to have with a client, not a
 *     number for a dashboard tile to announce.
 *
 * The caller must label the result as a forecast. It is arithmetic on three
 * months, not a prediction.
 */
export function forecastPeriodEnd(fin: PortalFinancials | null): Forecast | null {
  const points = cumulativeThisPeriod(fin);
  if (points.length === 0) return null;

  const endKey = monthKey(fin?.periodEnd ?? null);
  const lastKey = points[points.length - 1].month;
  if (!endKey) return null;

  const monthsRemaining = monthsBetween(lastKey, endKey);
  if (monthsRemaining <= 0) return null;

  const basis = points.slice(-MIN_BASIS_MONTHS);
  if (basis.length < MIN_BASIS_MONTHS) return null;

  const runRate = basis.reduce((n, p) => n + p.netProfit, 0) / basis.length;
  if (runRate <= 0) return null;

  const toDate = points[points.length - 1].cumulative;
  return {
    value: Math.round(toDate + runRate * monthsRemaining),
    toDate,
    basisMonths: basis.length,
    monthsRemaining,
  };
}

/** "11 of 12 months" — how far through the period the figures run. */
export function periodProgress(
  fin: PortalFinancials | null
): { elapsed: number; total: number } | null {
  const startKey = monthKey(fin?.periodStart ?? null);
  const endKey = monthKey(fin?.periodEnd ?? null);
  if (!startKey || !endKey) return null;
  const total = monthsBetween(startKey, endKey) + 1;
  if (total <= 0) return null;
  const points = cumulativeThisPeriod(fin);
  const elapsed = Math.min(points.length, total);
  if (elapsed <= 0) return null;
  return { elapsed, total };
}
