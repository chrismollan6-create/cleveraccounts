import { sql, inArray } from "drizzle-orm";
import { getPortalDb, schema } from "./db/client";

/**
 * Bulk notification sync — the write path for cohort broadcasts.
 *
 * A broadcast fans out to many clients at once. Rather than create one SF
 * Notification__c + one callout per client (which would blow governor/callout
 * limits at ~6,500 clients), the SF PortalBroadcastBatch pushes batches of
 * notification rows straight into portal.notifications via /api/portal/sync/bulk.
 *
 * These rows are CACHE-ONLY, keyed by a synthetic sf_id 'broadcast:{id}:{acct}'
 * (the same pattern as derived deadlines) — there's no per-client SObject. The
 * Notification_Broadcast__c record is the SF-side audit. read_at + created_at are
 * preserved on re-send so a client's read state is never reset.
 */

export interface BulkNotification {
  sfId: string;
  accountSfId: string;
  type: string;
  title: string;
  body?: string | null;
  href?: string | null;
  actionRequired?: boolean;
  createdAt?: string | null;
  sfUpdatedAt?: string | null;
}

export type BulkOperation = "UPSERT" | "DELETE";

/** Max rows accepted in a single bulk POST — bounds work + payload size. */
export const BULK_MAX = 1000;

function parseTs(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
}

/**
 * Upsert (or delete) a batch of notification rows. Returns the number of rows
 * processed. Upsert preserves read_at + created_at (content columns only), so a
 * re-sent broadcast updates wording without un-reading it for clients who saw it.
 */
export async function processBulkNotifications(
  items: BulkNotification[],
  operation: BulkOperation
): Promise<number> {
  const db = getPortalDb();
  if (!Array.isArray(items) || items.length === 0) return 0;

  if (operation === "DELETE") {
    const ids = items.map((i) => i.sfId).filter((s): s is string => !!s);
    if (ids.length === 0) return 0;
    const res = await db
      .delete(schema.notifications)
      .where(inArray(schema.notifications.sfId, ids));
    return res.length ?? ids.length;
  }

  const rows = items.map((i) => ({
    sfId: i.sfId,
    accountSfId: i.accountSfId,
    type: i.type,
    title: i.title,
    body: i.body ?? null,
    href: i.href ?? null,
    actionRequired: i.actionRequired ?? false,
    createdAt: parseTs(i.createdAt) ?? new Date(),
    sfUpdatedAt: parseTs(i.sfUpdatedAt),
  }));

  await db
    .insert(schema.notifications)
    .values(rows)
    .onConflictDoUpdate({
      target: schema.notifications.sfId,
      // Content only — read_at + created_at deliberately preserved.
      set: {
        accountSfId: sql`excluded.account_sf_id`,
        type: sql`excluded.type`,
        title: sql`excluded.title`,
        body: sql`excluded.body`,
        href: sql`excluded.href`,
        actionRequired: sql`excluded.action_required`,
        sfUpdatedAt: sql`excluded.sf_updated_at`,
      },
    });

  return rows.length;
}
