import { desc, eq, and } from "drizzle-orm";
import { fetchPortalApex } from "./salesforce";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type { PortalMessage, SendMessageResult } from "./types";

/**
 * Server-side helpers for the portal Messages feature.
 *
 * Stage 3E rewire (2026-05-12):
 * - **Reads** (listMessagesForCurrentUser) now query the Postgres cache
 *   (portal.email_messages joined to portal.cases). Latency drops from
 *   ~500-1000ms (SF API) to <50ms (Supabase EU). 2-5s lag from SF write
 *   to portal-visible is acceptable per the original requirements.
 * - **Writes** (sendMessageForCurrentUser) still POST to Apex /Portal/messages
 *   — needs to land in SF immediately for staff visibility in the Case
 *   record. The Apex side then publishes a Portal_Sync_Event__e for the
 *   new EmailMessage which the cache picks up within seconds (so the
 *   user sees their own message via the read-cache path on the next poll).
 *
 * Both paths still flow through `withPortalScope()` — the IDOR chokepoint
 * is unchanged; only the data source for reads moves.
 */

const MAX_BODY_LENGTH = 10_000;

/**
 * List portal-visible messages for the current user's Account.
 * Default page size 50, max 200.
 */
export async function listMessagesForCurrentUser(
  pageSize: number = 50
): Promise<PortalScopeResult<PortalMessage[]>> {
  const effective = Math.min(Math.max(1, pageSize), 200);
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    // Cache read: join email_messages → cases on caseSfId so we can
    // surface caseSubject + caseClosed in the same DTO shape the UI
    // already consumes. Filter on accountSfId (which is denormalised
    // onto email_messages for this very reason).
    const rows = await db
      .select({
        // EmailMessage columns
        id: schema.emailMessages.sfId,
        caseId: schema.emailMessages.caseSfId,
        fromAddress: schema.emailMessages.fromAddress,
        fromName: schema.emailMessages.fromName,
        subject: schema.emailMessages.subject,
        bodyText: schema.emailMessages.bodyText,
        sentAt: schema.emailMessages.sentAt,
        isFromClient: schema.emailMessages.isFromClient,
        isPortalAuthored: schema.emailMessages.isPortalAuthored,
        hideFromPortal: schema.emailMessages.hideFromPortal,
        // Joined Case columns
        caseSubject: schema.cases.subject,
        caseStatus: schema.cases.status,
        caseClosed: schema.cases.isClosed,
      })
      .from(schema.emailMessages)
      .leftJoin(
        schema.cases,
        eq(schema.emailMessages.caseSfId, schema.cases.sfId)
      )
      .where(
        and(
          eq(schema.emailMessages.accountSfId, accountSfId),
          eq(schema.emailMessages.hideFromPortal, false)
        )
      )
      .orderBy(desc(schema.emailMessages.sentAt))
      .limit(effective);

    const messages: PortalMessage[] = rows.map((r) => ({
      id: r.id,
      caseId: r.caseId,
      caseSubject: r.caseSubject,
      caseStatus: r.caseStatus,
      caseClosed: r.caseClosed ?? false,
      fromAddress: r.fromAddress,
      fromName: r.fromName,
      subject: r.subject,
      bodyText: r.bodyText ?? "",
      sentAt:
        r.sentAt instanceof Date
          ? r.sentAt.toISOString()
          : String(r.sentAt),
      isFromClient: r.isFromClient,
      isPortalAuthored: r.isPortalAuthored,
    }));

    await logPortalEventScoped(db, {
      action: "view_messages",
      clerkUserId,
      accountSfId,
      target: accountSfId,
      metadata: { count: messages.length, source: "cache" },
    });

    return messages;
  });
}

/**
 * Send a new portal message. Writes through SF (POST /Portal/messages) so
 * staff sees the message in their inbox / Case feed immediately. The cache
 * picks up the new EmailMessage via Portal_Sync_Event__e within seconds.
 *
 * Returns the optimistic DTO from the SF response — the client renders
 * this immediately while the next poll pulls the cache-synced version.
 */
export async function sendMessageForCurrentUser(
  body: string,
  subject?: string
): Promise<PortalScopeResult<SendMessageResult>> {
  const trimmed = body.trim();
  if (!trimmed.length) {
    return {
      ok: false,
      reason: "missing_account",
      user: null,
    };
  }
  if (trimmed.length > MAX_BODY_LENGTH) {
    return {
      ok: false,
      reason: "missing_account",
      user: null,
    };
  }

  return tryWithPortalScope(async ({ accountSfId, contactSfId, brand, db, clerkUserId }) => {
    const result = await fetchPortalApex<SendMessageResult>(
      { clerkUserId, accountId: accountSfId, contactId: contactSfId, brand },
      "/messages",
      undefined,
      {
        method: "POST",
        body: {
          body: trimmed,
          subject: subject ?? null,
        },
      }
    );

    if (result.ok === true) {
      await logPortalEventScoped(db, {
        action: "send_message",
        clerkUserId,
        accountSfId,
        target: result.data.caseId,
        metadata: {
          bodyLength: trimmed.length,
          newCase: result.data.newCase,
          emailMessageId: result.data.emailMessageId,
        },
      });
      return result.data;
    }

    throw new MessagesError(result.error, result.message, result.status);
  });
}

/**
 * Local error type so route handlers can distinguish "SF said no" from
 * "scope denied" without inspecting strings.
 */
export class MessagesError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "MessagesError";
  }
}
