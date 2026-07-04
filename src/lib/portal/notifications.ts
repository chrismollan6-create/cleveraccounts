import { and, desc, eq, isNull, count } from "drizzle-orm";
import {
  tryWithPortalScope,
  assertWritable,
  type PortalScopeResult,
} from "./withAccountScope";
import { schema } from "./db/client";
import type { PortalNotification } from "./types";

/**
 * Notifications — the retention backbone. Every actionable event becomes a
 * row in portal.notifications, deep-linking into the relevant surface. Drives
 * the sidebar bell badge + the /portal/notifications inbox.
 *
 * Reads/writes go through withPortalScope (same IDOR chokepoint). Rows are
 * raised server-side when events happen (deadline approaching, reply received,
 * item to approve, etc.) — for the demo they're seeded.
 */

export async function listNotificationsForCurrentUser(
  limit: number = 30
): Promise<PortalScopeResult<PortalNotification[]>> {
  const effective = Math.min(Math.max(1, limit), 100);
  return tryWithPortalScope(async ({ accountSfId, db }) => {
    const rows = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.accountSfId, accountSfId))
      .orderBy(desc(schema.notifications.createdAt))
      .limit(effective);

    return rows.map((r) => ({
      id: String(r.id),
      type: r.type,
      title: r.title,
      body: r.body,
      href: r.href,
      actionRequired: r.actionRequired,
      read: r.readAt != null,
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : String(r.createdAt),
    }));
  });
}

export async function countUnreadNotificationsForCurrentUser(): Promise<
  PortalScopeResult<number>
> {
  return tryWithPortalScope(async ({ accountSfId, db }) => {
    const rows = await db
      .select({ n: count() })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.accountSfId, accountSfId),
          isNull(schema.notifications.readAt)
        )
      );
    return Number(rows[0]?.n ?? 0);
  });
}

/**
 * Mark all of the current user's notifications as read. Called when the inbox
 * page is opened so the bell badge clears. Idempotent.
 */
export async function markAllNotificationsRead(): Promise<
  PortalScopeResult<number>
> {
  return tryWithPortalScope(async (scope) => {
    assertWritable(scope); // staff view-as must not mutate the client's read state
    const { accountSfId, db } = scope;
    const updated = await db
      .update(schema.notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(schema.notifications.accountSfId, accountSfId),
          isNull(schema.notifications.readAt)
        )
      )
      .returning({ id: schema.notifications.id });
    return updated.length;
  });
}
