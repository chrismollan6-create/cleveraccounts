import { desc, eq, and, ne } from "drizzle-orm";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type { PortalEngagementLetter } from "./types";

/**
 * Server-side helpers for portal Engagement Letter viewing.
 *
 * Stage 3E rewire (2026-05-12): reads from portal.engagement_letters
 * Postgres cache instead of fetchPortalApex. ~10x latency reduction.
 *
 * In-portal SIGNING (still SF-direct) lands in the next deploy —
 * PortalRestService.handleEngagementLetterSign currently returns 501.
 * The public token-based signing flow at /engagement-letter/[token]
 * is the workaround the portal UI links to today.
 */

export async function getEngagementLetterForCurrentUser(): Promise<
  PortalScopeResult<PortalEngagementLetter | null>
> {
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    // Most recent non-cancelled, non-superseded EL for this account.
    // The portal.engagement_letters_account_status_idx index supports
    // this filter+sort efficiently.
    const rows = await db
      .select({
        id: schema.engagementLetters.sfId,
        status: schema.engagementLetters.status,
        variant: schema.engagementLetters.variant,
        sentAt: schema.engagementLetters.sentAt,
        signedAt: schema.engagementLetters.signedAt,
        signerName: schema.engagementLetters.signerName,
        token: schema.engagementLetters.token,
        pdfReady: schema.engagementLetters.pdfReady,
      })
      .from(schema.engagementLetters)
      .where(
        and(
          eq(schema.engagementLetters.accountSfId, accountSfId),
          ne(schema.engagementLetters.status, "Cancelled"),
          ne(schema.engagementLetters.status, "Superseded")
        )
      )
      .orderBy(desc(schema.engagementLetters.sentAt))
      .limit(1);

    if (rows.length === 0) {
      await logPortalEventScoped(db, {
        action: "view_engagement_letter",
        clerkUserId,
        accountSfId,
        metadata: { found: false, source: "cache" },
      });
      return null;
    }

    const r = rows[0];
    await logPortalEventScoped(db, {
      action: "view_engagement_letter",
      clerkUserId,
      accountSfId,
      target: r.id,
      metadata: { status: r.status, found: true, source: "cache" },
    });

    return {
      id: r.id,
      // Cast status to the discriminated union — Apex serialises one of
      // 'Sent' | 'Viewed' | 'Signed' | 'Cancelled' | 'Superseded'; we've
      // filtered out the last two via the WHERE clause above.
      status: r.status as PortalEngagementLetter["status"],
      variant: r.variant ?? "",
      sentDate:
        r.sentAt instanceof Date ? r.sentAt.toISOString() : (r.sentAt ?? null),
      signedDate:
        r.signedAt instanceof Date
          ? r.signedAt.toISOString()
          : (r.signedAt ?? null),
      signerName: r.signerName,
      token: r.token,
      pdfReady: r.pdfReady,
    };
  });
}
