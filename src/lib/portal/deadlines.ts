import { asc, eq } from "drizzle-orm";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type { PortalDeadline } from "./types";

/**
 * Upcoming statutory + filing deadlines for the signed-in user's Account.
 * Cache-backed (portal.deadlines), scoped via withPortalScope.
 *
 * Aggregates Companies House dates (accounts / confirmation statement) plus
 * VAT, Self Assessment, Corporation Tax and payroll from Salesforce. The SF→
 * cache sync for these is a follow-up; seeded for the demo.
 */

function daysUntil(due: string | null): number | null {
  if (!due) return null;
  const d = new Date(due);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export async function getDeadlinesForCurrentUser(): Promise<
  PortalScopeResult<PortalDeadline[]>
> {
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    const rows = await db
      .select()
      .from(schema.deadlines)
      .where(eq(schema.deadlines.accountSfId, accountSfId))
      .orderBy(asc(schema.deadlines.dueDate));

    const list: PortalDeadline[] = rows.map((r) => ({
      id: r.sfId,
      kind: r.kind,
      title: r.title,
      dueDate: r.dueDate,
      periodLabel: r.periodLabel,
      status: r.status,
      blockedOn: r.blockedOn,
      daysUntil: daysUntil(r.dueDate),
    }));

    await logPortalEventScoped(db, {
      action: "view_deadlines",
      clerkUserId,
      accountSfId,
      metadata: { count: list.length, source: "cache" },
    });

    return list;
  });
}
