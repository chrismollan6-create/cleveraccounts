import { fetchPortalApex } from "./salesforce";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import type { PortalMessage, SendMessageResult } from "./types";

/**
 * Server-side helpers for the portal Messages feature. Always routed through
 * `withPortalScope()` so accountId/contactId are derived from the session —
 * there's no way for a caller to read or write to another user's Account.
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
    const result = await fetchPortalApex<PortalMessage[]>("/messages", {
      accountId: accountSfId,
      pageSize: String(effective),
    });
    if (result.ok === true) {
      // Audit the read so we can answer "did this user see message X?"
      await logPortalEventScoped(db, {
        action: "view_messages",
        clerkUserId,
        accountSfId,
        target: accountSfId,
        metadata: { count: result.data?.length ?? 0 },
      });
      return result.data ?? [];
    }
    throw new MessagesError(result.error, result.message, result.status);
  });
}

/**
 * Send a new portal message. Creates a Case if no open one exists for this
 * Account, then appends an EmailMessage to it. Returns the new message DTO
 * so the caller can optimistically render it without a follow-up fetch.
 *
 * Client-side validation should also enforce the length cap to fail fast,
 * but server-side is the source of truth.
 */
export async function sendMessageForCurrentUser(
  body: string,
  subject?: string
): Promise<PortalScopeResult<SendMessageResult>> {
  const trimmed = body.trim();
  if (!trimmed.length) {
    return {
      ok: false,
      reason: "missing_account", // closest existing reason; will refine later
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

  return tryWithPortalScope(async ({ accountSfId, contactSfId, db, clerkUserId }) => {
    const result = await fetchPortalApex<SendMessageResult>(
      "/messages",
      undefined,
      {
        method: "POST",
        body: {
          accountId: accountSfId,
          contactId: contactSfId,
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
