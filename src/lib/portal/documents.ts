import { and, asc, desc, eq, count } from "drizzle-orm";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type { PortalDocument, PortalDocumentsBundle } from "./types";

/**
 * Documents — file exchange. "Shared with you" (downloadable: accounts, VAT
 * returns, payslips, signed EL) and "We need from you" (uploads: ID, proof of
 * address, last year's return).
 *
 * Cache-backed read. The actual file bytes are SF ContentVersions in prod —
 * download/upload wiring (a streaming proxy + multipart upload route) is a
 * follow-up; this surfaces the list + status.
 */

function toDto(r: typeof schema.documents.$inferSelect): PortalDocument {
  return {
    id: r.sfId,
    name: r.name,
    category: r.category,
    direction: r.direction,
    status: r.status,
    fileType: r.fileType,
    sizeLabel: r.sizeLabel,
    downloadUrl: r.downloadUrl,
    sharedAt:
      r.sharedAt instanceof Date ? r.sharedAt.toISOString() : (r.sharedAt ?? null),
    dueDate: r.dueDate,
  };
}

export async function getDocumentsForCurrentUser(): Promise<
  PortalScopeResult<PortalDocumentsBundle>
> {
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    const rows = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.accountSfId, accountSfId))
      .orderBy(desc(schema.documents.sharedAt), asc(schema.documents.dueDate));

    const shared = rows.filter((r) => r.direction === "shared").map(toDto);
    const requests = rows.filter((r) => r.direction === "request").map(toDto);

    await logPortalEventScoped(db, {
      action: "view_documents",
      clerkUserId,
      accountSfId,
      metadata: {
        shared: shared.length,
        requests: requests.length,
        source: "cache",
      },
    });

    return { shared, requests };
  });
}

export async function countOutstandingDocRequestsForCurrentUser(): Promise<
  PortalScopeResult<number>
> {
  return tryWithPortalScope(async ({ accountSfId, db }) => {
    const rows = await db
      .select({ n: count() })
      .from(schema.documents)
      .where(
        and(
          eq(schema.documents.accountSfId, accountSfId),
          eq(schema.documents.direction, "request"),
          eq(schema.documents.status, "requested")
        )
      );
    return Number(rows[0]?.n ?? 0);
  });
}
