import { and, desc, eq, count } from "drizzle-orm";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type { PortalApproval } from "./types";

/**
 * Approvals — items awaiting the client's sign-off (MTD quarterly review, VAT
 * return, Self Assessment, year-end accounts). Cache-backed read; the approve
 * write flips the cached status optimistically.
 *
 * In PRODUCTION the approve action also writes to Salesforce (MTDApproval /
 * the relevant approval service) which then syncs the authoritative status
 * back into the cache. That SF write is a follow-up — locally the cache flip
 * is the source of truth for the demo.
 */

function toDto(r: typeof schema.approvals.$inferSelect): PortalApproval {
  return {
    id: r.sfId,
    kind: r.kind,
    title: r.title,
    periodLabel: r.periodLabel,
    status: r.status,
    summary: r.summary,
    amountLabel: r.amountLabel,
    dueDate: r.dueDate,
    approvedAt:
      r.approvedAt instanceof Date
        ? r.approvedAt.toISOString()
        : (r.approvedAt ?? null),
  };
}

export async function getApprovalsForCurrentUser(): Promise<
  PortalScopeResult<PortalApproval[]>
> {
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    const rows = await db
      .select()
      .from(schema.approvals)
      .where(eq(schema.approvals.accountSfId, accountSfId))
      .orderBy(desc(schema.approvals.updatedAt));

    await logPortalEventScoped(db, {
      action: "view_approvals",
      clerkUserId,
      accountSfId,
      metadata: { count: rows.length, source: "cache" },
    });

    return rows.map(toDto);
  });
}

export async function countPendingApprovalsForCurrentUser(): Promise<
  PortalScopeResult<number>
> {
  return tryWithPortalScope(async ({ accountSfId, db }) => {
    const rows = await db
      .select({ n: count() })
      .from(schema.approvals)
      .where(
        and(
          eq(schema.approvals.accountSfId, accountSfId),
          eq(schema.approvals.status, "pending")
        )
      );
    return Number(rows[0]?.n ?? 0);
  });
}

/**
 * Approve a pending item. Scoped to the caller's account (IDOR-safe: the
 * WHERE clause pins account_sf_id from the session, never a client value).
 * Returns the updated approval, or null if not found / not theirs / not pending.
 */
export async function approveForCurrentUser(
  approvalId: string
): Promise<PortalScopeResult<PortalApproval | null>> {
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    const updated = await db
      .update(schema.approvals)
      .set({ status: "approved", approvedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(schema.approvals.sfId, approvalId),
          eq(schema.approvals.accountSfId, accountSfId),
          eq(schema.approvals.status, "pending")
        )
      )
      .returning();

    if (updated.length === 0) return null;

    await logPortalEventScoped(db, {
      action: "approve_item",
      clerkUserId,
      accountSfId,
      target: approvalId,
      metadata: { kind: updated[0].kind },
    });

    return toDto(updated[0]);
  });
}
