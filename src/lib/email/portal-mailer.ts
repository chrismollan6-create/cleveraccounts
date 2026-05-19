import { Resend } from "resend";
import { render } from "@react-email/components";
import { BRANDS, type BrandId } from "@/lib/constants";
import PortalInvitationEmail, {
  type PortalInvitationEmailProps,
} from "./templates/portal-invitation";
import PortalMagicLinkEmail, {
  type PortalMagicLinkEmailProps,
} from "./templates/portal-magic-link";
import PortalOtpEmail, {
  type PortalOtpEmailProps,
} from "./templates/portal-otp";

/**
 * Single mailer for every portal-related email. Picks the right brand
 * template, renders to HTML+plain-text, sends via Resend.
 *
 * All portal email sends MUST go through here so:
 *   1. Brand resolution is centralised (one place to add Workwell-specific
 *      treatments later, e.g. different signature or compliance footer)
 *   2. From-address is consistent (per-brand senderEmail from BRANDS)
 *   3. Logging is consistent (one place to ship to BetterStack / Axiom)
 *   4. Failure handling is consistent (Resend errors don't leak into the
 *      Apex / Clerk-webhook call sites)
 *
 * The Resend SDK is lazily initialised so the module imports cleanly in
 * environments without RESEND_API_KEY set (e.g. CI without prod secrets).
 */

export type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

let _resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!_resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error(
        "RESEND_API_KEY not set — Resend mailer cannot send. " +
          "Set this in Vercel env vars and locally in .env.local.",
      );
    }
    _resendClient = new Resend(key);
  }
  return _resendClient;
}

interface SendArgs {
  to: string;
  brandId: BrandId;
  /** From-name shown to recipient. Defaults to brand display name. */
  fromName?: string;
}

// ─── Invitation ────────────────────────────────────────────────────────────

export async function sendPortalInvitation(
  args: SendArgs & Omit<PortalInvitationEmailProps, "brand">,
): Promise<SendResult> {  // explicit return type so discriminated union narrows in callers
  const brand = BRANDS[args.brandId];
  const subject = `You're invited to your ${brand.name} portal`;
  const html = await render(
    PortalInvitationEmail({
      brand,
      firstName: args.firstName,
      inviteUrl: args.inviteUrl,
      accountantName: args.accountantName,
    }),
  );
  const text = plaintextInvitation(brand.name, args.firstName, args.inviteUrl);
  return send({
    to: args.to,
    from: `${args.fromName ?? brand.name} <${brand.senderEmail}>`,
    subject,
    html,
    text,
    tags: [
      { name: "type", value: "portal_invitation" },
      { name: "brand", value: brand.id },
    ],
  });
}

// ─── Magic link ────────────────────────────────────────────────────────────

export async function sendPortalMagicLink(
  args: SendArgs & Omit<PortalMagicLinkEmailProps, "brand">,
): Promise<SendResult> {
  const brand = BRANDS[args.brandId];
  const subject = `Sign in to your ${brand.name} portal`;
  const html = await render(
    PortalMagicLinkEmail({
      brand,
      firstName: args.firstName,
      signInUrl: args.signInUrl,
      requestContext: args.requestContext,
    }),
  );
  const text = plaintextMagicLink(brand.name, args.firstName, args.signInUrl);
  return send({
    to: args.to,
    from: `${args.fromName ?? brand.name} <${brand.senderEmail}>`,
    subject,
    html,
    text,
    tags: [
      { name: "type", value: "portal_magic_link" },
      { name: "brand", value: brand.id },
    ],
  });
}

// ─── OTP code ──────────────────────────────────────────────────────────────

export async function sendPortalOtp(
  args: SendArgs & Omit<PortalOtpEmailProps, "brand">,
): Promise<SendResult> {
  const brand = BRANDS[args.brandId];
  const subject = `Your ${brand.name} sign-in code: ${args.code}`;
  const html = await render(
    PortalOtpEmail({
      brand,
      firstName: args.firstName,
      code: args.code,
    }),
  );
  const text = plaintextOtp(brand.name, args.firstName, args.code);
  return send({
    to: args.to,
    from: `${args.fromName ?? brand.name} <${brand.senderEmail}>`,
    subject,
    html,
    text,
    tags: [
      { name: "type", value: "portal_otp" },
      { name: "brand", value: brand.id },
    ],
  });
}

// ─── Low-level send ────────────────────────────────────────────────────────

interface RawSendArgs {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  tags: { name: string; value: string }[];
}

async function send(args: RawSendArgs): Promise<SendResult> {
  try {
    const result = await getResendClient().emails.send({
      to: args.to,
      from: args.from,
      subject: args.subject,
      html: args.html,
      text: args.text,
      tags: args.tags,
    });
    if (result.error) {
      console.error("[portal-mailer] Resend error", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, messageId: result.data?.id ?? "" };
  } catch (err) {
    console.error("[portal-mailer] send threw", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown send failure",
    };
  }
}

// ─── Plain-text fallbacks ──────────────────────────────────────────────────
// Every email client supports text/plain. Spam scoring favours emails that
// include both. These are deliberately terse — the HTML is the polished one.

function plaintextInvitation(
  brandName: string,
  firstName: string | null,
  url: string,
): string {
  const name = firstName ?? "there";
  return `Hi ${name},

Your ${brandName} client portal is ready. Setup takes about 90 seconds.

Set up your access: ${url}

This link works for the next 7 days. If you weren't expecting this email, you can safely ignore it.

— Your accountancy team`;
}

function plaintextMagicLink(
  brandName: string,
  firstName: string | null,
  url: string,
): string {
  const name = firstName ?? "there";
  return `Hi ${name},

Sign in to your ${brandName} portal:

${url}

This link works for the next 10 minutes. If you didn't request it, you can safely ignore this email.

— Your accountancy team`;
}

function plaintextOtp(
  brandName: string,
  firstName: string | null,
  code: string,
): string {
  const name = firstName ?? "there";
  return `Hi ${name},

Your ${brandName} sign-in code:

${code}

The code expires in 10 minutes and can only be used once.

If you didn't try to sign in, you can safely ignore this email.

— Your accountancy team`;
}
