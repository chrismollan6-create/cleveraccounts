/**
 * Tests for the derived financial figures shown on the dashboard.
 *
 * These numbers sit next to real, synced figures, so a wrong one is worse than
 * a missing one. What's pinned here is mostly the REFUSALS — the cases where
 * the honest answer is "don't show anything".
 *
 * Same convention as scopeDecision.test.ts — no runner is wired up, run direct:
 *   npx tsx src/lib/portal/financialsDerived.test.ts
 * Exits non-zero on the first failure.
 */
import {
  cumulativeThisPeriod,
  forecastPeriodEnd,
  latestMonthMovement,
  periodProgress,
} from "./financialsDerived";
import type { PortalFinancials, PortalFinancialsTrendPoint } from "./types";

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) console.log(`  ✓ ${name}`);
  else {
    console.error(`  ✘ ${name}`);
    failures++;
  }
}

function pt(month: string, netProfit: number): PortalFinancialsTrendPoint {
  return {
    month,
    label: month.slice(5),
    revenue: netProfit * 2,
    grossProfit: netProfit * 1.5,
    netProfit,
  };
}

function fin(over: Partial<PortalFinancials>): PortalFinancials {
  return {
    periodStart: "2025-07-01",
    periodEnd: "2026-06-30",
    asOf: "2026-05-31",
    revenue: 0,
    costOfSales: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    cashInBank: null,
    cashAsAt: null,
    estTaxSetAside: 0,
    taxRatePct: 19,
    unexplainedCount: null,
    ...over,
  };
}

// A full year to date: Jul 2025 → May 2026, £3,000/month.
const fullYear = Array.from({ length: 11 }, (_, i) => {
  const m = i + 7;
  return m <= 12 ? pt(`2025-${String(m).padStart(2, "0")}`, 3000)
                 : pt(`2026-${String(m - 12).padStart(2, "0")}`, 3000);
});

console.log("\ncumulativeThisPeriod");
{
  const pts = cumulativeThisPeriod(fin({ trend: fullYear }));
  check("accumulates month on month", pts[0].cumulative === 3000 && pts[2].cumulative === 9000);
  check("final cumulative is the year-to-date total", pts[pts.length - 1].cumulative === 33000);

  // The trend window straddles a year end: 3 months of LAST year in front.
  const straddling = [
    pt("2025-04", 9999), pt("2025-05", 9999), pt("2025-06", 9999),
    ...fullYear,
  ];
  const cut = cumulativeThisPeriod(fin({ trend: straddling }));
  check("drops months before the period start", cut.length === 11);
  check(
    "last year's profit never leaks into this year's total",
    cut[cut.length - 1].cumulative === 33000
  );

  check("empty trend yields no points", cumulativeThisPeriod(fin({ trend: [] })).length === 0);
  check("null financials yields no points", cumulativeThisPeriod(null).length === 0);
  check(
    "no period start keeps the whole window rather than dropping everything",
    cumulativeThisPeriod(fin({ periodStart: null, trend: fullYear })).length === 11
  );
}

console.log("\nforecastPeriodEnd");
{
  const f = forecastPeriodEnd(fin({ trend: fullYear }));
  check("projects the remaining month at the recent run rate", f?.value === 36000);
  check("reports profit booked so far", f?.toDate === 33000);
  check("averages over three months", f?.basisMonths === 3);
  check("knows how much of the period is left", f?.monthsRemaining === 1);

  check(
    "refuses with fewer than three months of history",
    forecastPeriodEnd(fin({ trend: [pt("2025-07", 3000), pt("2025-08", 3000)] })) === null
  );
  check(
    "refuses once the period has run out",
    forecastPeriodEnd(fin({ periodEnd: "2026-05-31", trend: fullYear })) === null
  );
  check(
    "refuses when there is no period end to project to",
    forecastPeriodEnd(fin({ periodEnd: null, trend: fullYear })) === null
  );
  // A loss-making run rate is a conversation, not a dashboard tile.
  const losing = [...fullYear.slice(0, 8), pt("2026-03", -4000), pt("2026-04", -4000), pt("2026-05", -4000)];
  check("refuses to project a loss", forecastPeriodEnd(fin({ trend: losing })) === null);
  check("refuses on null financials", forecastPeriodEnd(null) === null);
}

console.log("\nlatestMonthMovement");
{
  check("reads the newest month", latestMonthMovement(fin({ trend: fullYear }))?.netProfit === 3000);
  check("null on an empty trend", latestMonthMovement(fin({ trend: [] })) === null);
}

console.log("\nperiodProgress");
{
  const p = periodProgress(fin({ trend: fullYear }));
  check("counts elapsed months of the period", p?.elapsed === 11);
  check("counts the period length inclusively", p?.total === 12);
  check(
    "null without period dates",
    periodProgress(fin({ periodStart: null, trend: fullYear })) === null
  );
}

console.log(
  failures === 0
    ? "\nAll derived-financials assertions passed.\n"
    : `\n${failures} assertion(s) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
