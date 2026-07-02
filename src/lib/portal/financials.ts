import { cache } from "react";
import { eq } from "drizzle-orm";
import { tryWithPortalScope, type PortalScopeResult } from "./withAccountScope";
import { schema } from "./db/client";
import type { PortalFinancials } from "./types";

/**
 * Financials read — the up-to-date P&L + money snapshot.
 *
 * The figures are computed Salesforce-side (PortalFinancialsService) from
 * FreeAgent's trial balance + transaction summary, and cached inside the
 * Account sync snapshot at `portal.accounts.raw.financials`. So this is a
 * single-row read of the account row's jsonb — no extra table, no live SF call.
 *
 * Returns null when there's no trial balance yet (portal shows "not available").
 * Cached per-request so the dashboard tile + Financials page share one read.
 */
export const getFinancialsForCurrentUser = cache(async function (): Promise<
  PortalScopeResult<PortalFinancials | null>
> {
  return tryWithPortalScope(async ({ accountSfId, db }) => {
    const rows = await db
      .select({ raw: schema.accounts.raw })
      .from(schema.accounts)
      .where(eq(schema.accounts.sfId, accountSfId))
      .limit(1);
    if (rows.length === 0) return null;
    const raw = rows[0].raw as Record<string, unknown> | null;
    const fin = raw?.financials as PortalFinancials | null | undefined;
    // Guard against an empty/partial object — require the core P&L keys.
    if (!fin || typeof fin.netProfit !== "number") return null;
    return fin;
  });
});
