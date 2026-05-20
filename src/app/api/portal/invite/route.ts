import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPortalInvitation } from "@/lib/clerk-sender";
import { sendPortalInvitation } from "@/lib/email/portal-mailer";

/**
 * POST /api/portal/invite
 *
 * Creates a Clerk invitation (without Clerk emailing) and sends our own
 * brand-correct invitation email via Resend. Called by:
 *   1. Salesforce Flow on New_Client_Workflow__c create (server-to-server)
 *   2. Manual support tooling (for resending a lost invite)
 *
 * Authentication: HMAC signature in `x-portal-invite-signature` header. Same
 * pattern as the Portal_Sync_Event__e webhook so SF has one HMAC secret to
 * manage. Anyone POSTing without a valid signature gets 401.
 *
 * Returns: { invitationId, emailMessageId } so the caller can log + revoke
 * if needed. Never exposes the invitation URL itself in the response — the
 * URL is for the client's inbox only.
 */

const BodySchema = z.object({
  email: z.string().email(),
  brand: z.enum(["clever", "workwell"]),
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
  accountantName: z.string().min(1).max(120).optional(),
  accountSfId: z.string().regex(/^[a-zA-Z0-9]{15,18}$/).optional(),
  contactSfId: z.string().regex(/^[a-zA-Z0-9]{15,18}$/).optional(),
});

export async function POST(request: NextRequest) {
  // ── HMAC verify ───────────────────────────────────────────────────────
  const secret = process.env.PORTAL_INVITE_HMAC_SECRET ?? process.env.PORTAL_SYNC_HMAC_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Invite endpoint not configured (missing HMAC secret)" },
      { status: 500 },
    );
  }
  const signature = request.headers.get("x-portal-invite-signature");
  const rawBody = await request.text();
  if (!signature || !(await verifyHmac(rawBody, signature, secret))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── Parse + validate ──────────────────────────────────────────────────
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(JSON.parse(rawBody));
  } catch (err) {
    return NextResponse.json(
      {
        error: "Invalid body",
        detail: err instanceof Error ? err.message : "unknown parse error",
      },
      { status: 400 },
    );
  }

  // ── Create Clerk invitation (no email) ────────────────────────────────
  // Clerk's invitation redirectUrl MUST be absolute — a relative path gets
  // resolved against Clerk's own FAPI domain (clerk.accounts.dev) and 404s.
  // Derive the origin from this request so it always points back at the same
  // deployment SF called (Vercel prod, branch alias, or my.* once DNS cuts).
  const origin = new URL(request.url).origin;
  const redirectUrl = `${origin}/portal/activate`;

  let invitation;
  try {
    invitation = await createPortalInvitation({
      email: body.email,
      brand: body.brand,
      firstName: body.firstName,
      lastName: body.lastName,
      accountSfId: body.accountSfId,
      contactSfId: body.contactSfId,
      redirectUrl,
    });
  } catch (err) {
    console.error("[/api/portal/invite] Clerk createInvitation failed", err);
    return NextResponse.json(
      {
        error: "Failed to create invitation",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 502 },
    );
  }

  // ── Send our branded email ────────────────────────────────────────────
  const sendResult = await sendPortalInvitation({
    to: body.email,
    brandId: body.brand,
    firstName: body.firstName ?? null,
    inviteUrl: invitation.url,
    accountantName: body.accountantName ?? null,
  });

  if (sendResult.ok === false) {
    // Clerk invitation exists but the email didn't send. The invitation will
    // expire naturally in 7 days; safer to surface the failure so SF can
    // retry or alert. We do NOT revoke automatically — a stuck email might
    // resolve and the user could still redeem.
    console.error(
      "[/api/portal/invite] Email send failed for invitation",
      invitation.id,
      sendResult.error,
    );
    return NextResponse.json(
      {
        invitationId: invitation.id,
        emailError: sendResult.error,
      },
      { status: 202 }, // accepted — invitation exists, email is the problem
    );
  }

  return NextResponse.json(
    {
      invitationId: invitation.id,
      emailMessageId: sendResult.messageId,
    },
    { status: 201 },
  );
}

// ─── HMAC helper ───────────────────────────────────────────────────────────
// Web Crypto API — works in Node and Edge runtimes equally.

async function verifyHmac(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sigBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(body),
    );
    const expected = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    // Constant-time compare — protects against timing attacks
    return timingSafeEqual(expected, signature);
  } catch {
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
