import { NextResponse } from "next/server";
import { Webhook } from "svix";
import {
  handleUserCreatedOrUpdated,
  handleUserDeleted,
  handleSessionEvent,
  type ClerkWebhookEvent,
} from "@/lib/portal/clerk-webhook";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/clerk-webhook
 *
 * Receives Clerk's user lifecycle events (user.created / user.updated /
 * user.deleted) and keeps the portal.users link table in sync.
 *
 * Security: Svix-signed payloads — we verify the signature with
 * `CLERK_WEBHOOK_SECRET` before processing. Unverified requests get 401.
 *
 * Configure in Clerk dashboard:
 *   Endpoint URL: https://<deploy-url>/api/portal/clerk-webhook
 *   Events: user.created, user.updated, user.deleted
 */
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "CONFIG", message: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Svix signature headers — Clerk sends `svix-id`, `svix-timestamp`, `svix-signature`
  const svixId = req.headers.get("svix-id");
  const svixTs = req.headers.get("svix-timestamp");
  const svixSig = req.headers.get("svix-signature");
  if (!svixId || !svixTs || !svixSig) {
    return NextResponse.json(
      { error: "MISSING_SIGNATURE", message: "Required Svix headers absent" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTs,
      "svix-signature": svixSig,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[clerk-webhook] signature verification failed:", sanitisedError(err));
    return NextResponse.json(
      { error: "INVALID_SIGNATURE", message: "Could not verify webhook signature" },
      { status: 401 }
    );
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const result = await handleUserCreatedOrUpdated(event);
      console.log(
        `[clerk-webhook] ${event.type} ${event.data.id} → ${result.status} (${result.action})`
      );
      return NextResponse.json({ ok: true, status: result.status, action: result.action });
    }

    if (event.type === "user.deleted") {
      const result = await handleUserDeleted(event);
      console.log(`[clerk-webhook] user.deleted ${event.data.id} → ${result.action}`);
      return NextResponse.json({ ok: true, action: result.action });
    }

    if (
      event.type === "session.created" ||
      event.type === "session.ended" ||
      event.type === "session.removed" ||
      event.type === "session.revoked"
    ) {
      const result = await handleSessionEvent(event);
      console.log(`[clerk-webhook] ${event.type} ${event.data.id} → ${result.action}`);
      return NextResponse.json({ ok: true, action: result.action });
    }

    // Other event types — just acknowledge so Svix doesn't retry forever
    console.log(`[clerk-webhook] ignored event type: ${(event as { type: string }).type}`);
    return NextResponse.json({ ok: true, action: "ignored" });
  } catch (err) {
    console.error("[clerk-webhook] handler failed:", sanitisedError(err));
    // Return 500 so Svix retries with backoff. Body is a generic code —
    // do NOT echo err.message because Svix logs request bodies and we
    // don't want PII landing there either.
    return NextResponse.json(
      {
        error: "HANDLER_FAILED",
        message: "Webhook handler errored — see server logs",
      },
      { status: 500 }
    );
  }
}
