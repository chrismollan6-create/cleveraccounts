"use server";

import { sendMessageForCurrentUser } from "@/lib/portal/messages";
import { logPortalEvent } from "@/lib/portal/audit";

/**
 * Data-rights requests (UK GDPR Art. 15 access / Art. 17 erasure).
 *
 * Deliberately NOT a silent mailto: the request goes down the same channel as
 * every other client message, so it lands in the accountant's inbox with an
 * audit row behind it. That gives the firm a dated, attributable record of
 * when the request was made — which is the part that matters when the one-month
 * statutory clock is being counted.
 *
 * Erasure is a conversation rather than a button because an accountancy
 * practice has a statutory duty to retain records (Companies Act / HMRC, six
 * years), so "delete everything" is never unconditionally true. Saying so
 * honestly beats a Delete button that quietly doesn't.
 */

export type DataRequestKind = "export" | "erasure";

const SUBJECTS: Record<DataRequestKind, string> = {
  export: "Data request — copy of my information",
  erasure: "Data request — erasure",
};

const BODIES: Record<DataRequestKind, string> = {
  export:
    "I'd like a copy of the personal information you hold about me, under " +
    "my right of access (UK GDPR Article 15). Please confirm when I can " +
    "expect it.",
  erasure:
    "I'd like to ask you to erase the personal information you hold about " +
    "me, under UK GDPR Article 17. I understand some records must be kept " +
    "to meet your statutory obligations — please tell me what can be " +
    "erased and what has to be retained, and for how long.",
};

export async function submitDataRequestAction(
  kind: DataRequestKind
): Promise<{ ok: boolean; message: string }> {
  if (kind !== "export" && kind !== "erasure") {
    return { ok: false, message: "Unknown request type." };
  }

  const result = await sendMessageForCurrentUser(BODIES[kind], SUBJECTS[kind]);

  if (!result.ok) {
    // `in` rather than reading result.reason directly: this repo compiles with
    // tsconfig `strict: false`, under which `if (!result.ok)` does NOT narrow
    // the union (same reason scopeDecision.ts declares its fields on both
    // arms). The `in` operator narrows regardless.
    const reason = "reason" in result ? result.reason : null;
    void logPortalEvent({
      action: "data_request_failed",
      target: kind,
      metadata: { reason },
    });
    return {
      ok: false,
      message:
        reason === "read_only"
          ? "This is a read-only view, so the request wasn't sent."
          : "We couldn't send that just now. Please message your accountant directly.",
    };
  }

  void logPortalEvent({ action: "data_request_sent", target: kind });

  return {
    ok: true,
    message:
      kind === "export"
        ? "Request sent. Your accountant will confirm when your copy is ready — we have one month to respond."
        : "Request sent. Your accountant will come back to you on what can be erased and what we're required to keep.",
  };
}
