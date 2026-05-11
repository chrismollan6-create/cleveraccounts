import { fetchPortalApex } from "./salesforce";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import type { PortalEngagementLetter } from "./types";

/**
 * Server-side helpers for portal Engagement Letter viewing + signing.
 * Phase D scope: GET the active EL for the user's Account. Sign-in-portal
 * lands in the next deploy (PortalRestService.handleEngagementLetterSign
 * currently returns 501 NOT_IMPLEMENTED).
 *
 * The public token-based signing flow at /engagement-letter/[token] keeps
 * working — we link to that from the portal until in-portal signing lands.
 */

export async function getEngagementLetterForCurrentUser(): Promise<
  PortalScopeResult<PortalEngagementLetter | null>
> {
  return tryWithPortalScope(async ({ accountSfId, contactSfId, brand, db, clerkUserId }) => {
    const result = await fetchPortalApex<PortalEngagementLetter>(
      { clerkUserId, accountId: accountSfId, contactId: contactSfId, brand },
      "/engagement-letter"
    );

    // 404 from Apex = no EL on file. Surface as ok with null data so the
    // UI can render an "we'll send your engagement letter shortly" state.
    if (result.ok === false) {
      if (result.status === 404 && result.error === "NOT_FOUND") {
        await logPortalEventScoped(db, {
          action: "view_engagement_letter",
          clerkUserId,
          accountSfId,
          metadata: { found: false },
        });
        return null;
      }
      throw new Error(`EL fetch failed: ${result.error} - ${result.message}`);
    }

    await logPortalEventScoped(db, {
      action: "view_engagement_letter",
      clerkUserId,
      accountSfId,
      target: result.data.id,
      metadata: { status: result.data.status, found: true },
    });
    return result.data;
  });
}
