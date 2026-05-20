import { clerkClient } from "@clerk/nextjs/server";

/**
 * Clerk Backend SDK wrapper that creates invitations and sign-in tokens
 * WITHOUT triggering Clerk's built-in email.
 *
 * Why this exists: Clerk's auto-sent emails are one-size-fits-all per
 * application. We have two brands (Clever and Workwell) sharing one Clerk
 * app, so a single Clerk-sent invitation email can't be brand-correct for
 * both. By passing `notify: false` here, we get the invitation URL back and
 * send the email ourselves via Resend with the right brand template — see
 * `portal-mailer.ts`.
 *
 * If you're tempted to call clerkClient.invitations.createInvitation()
 * directly anywhere else, DON'T. Use this wrapper so the no-notify policy
 * stays uniform across the codebase.
 */

interface InvitationInput {
  /** Email address to invite. Must match an existing SF Contact for portal access to work. */
  email: string;
  /** Brand the invite is for — drives email template selection downstream. */
  brand: "clever" | "workwell";
  /** First name to pre-fill on Clerk's sign-up form + use in the email greeting. */
  firstName?: string;
  /** Last name for completeness. */
  lastName?: string;
  /** SF Account id this invite is bound to — surfaced in public_metadata so
   *  the Clerk webhook can resolve the portal.users link row deterministically. */
  accountSfId?: string;
  /** SF Contact id of the invitee — for the same reason. */
  contactSfId?: string;
  /** Where to land the client after they accept. Defaults to /portal/activate
   *  which renders the journey + Clerk SignUp component once a ticket is present.
   *  Callers should pass an ABSOLUTE URL — a relative path resolves against
   *  Clerk's own FAPI domain and 404s. */
  redirectUrl?: string;
}

export interface CreatedInvitation {
  /** Clerk invitation id — useful for revocation later. */
  id: string;
  /** The URL the client clicks to redeem (already includes the __clerk_ticket). */
  url: string;
  /** Echoed back so the caller can log what was sent. */
  email: string;
  brand: "clever" | "workwell";
}

const DEFAULT_REDIRECT = "/portal/activate";

/**
 * Create a Clerk invitation, suppress Clerk's email, return the redemption URL.
 * The caller is responsible for emailing the URL to the client via our own
 * Resend-backed mailer.
 */
export async function createPortalInvitation(
  input: InvitationInput,
): Promise<CreatedInvitation> {
  const client = await clerkClient();

  const invitation = await client.invitations.createInvitation({
    emailAddress: input.email,
    // Critical: tells Clerk to NOT send its own email. We send our own
    // brand-correct email via Resend after this returns.
    notify: false,
    // Bind to our redirect target so the link lands on /portal/activate
    // with the __clerk_ticket query param.
    redirectUrl: input.redirectUrl ?? DEFAULT_REDIRECT,
    // Public metadata is readable by the user's Clerk session — fine for
    // identifiers but never for sensitive data. The webhook on user.created
    // uses these to write the portal.users link row immediately, without
    // needing to round-trip back to SF.
    publicMetadata: {
      brand: input.brand,
      ...(input.accountSfId && { accountSfId: input.accountSfId }),
      ...(input.contactSfId && { contactSfId: input.contactSfId }),
    },
  });

  if (!invitation.url) {
    throw new Error(
      `Clerk returned an invitation without a URL — check the Clerk dashboard for invitation ${invitation.id}`,
    );
  }

  return {
    id: invitation.id,
    url: invitation.url,
    email: input.email,
    brand: input.brand,
  };
}

/**
 * Create a Clerk sign-in token for a magic-link-style sign-in flow.
 *
 * Used when an already-registered client requests a sign-in link (e.g. from
 * the sign-in page's email form). Returns the URL we then email via Resend.
 *
 * NOTE: Sign-in tokens require the user to already exist as a Clerk user.
 * For new sign-ups, use `createPortalInvitation` instead.
 */
export async function createPortalSignInToken(
  clerkUserId: string,
  redirectUrl?: string,
): Promise<{ token: string; url: string }> {
  const client = await clerkClient();
  const result = await client.signInTokens.createSignInToken({
    userId: clerkUserId,
    expiresInSeconds: 600, // 10 minutes — same as Clerk's default magic-link TTL
  });

  // Clerk gives us the token; we build the URL with the same shape Clerk uses
  // so /portal/sign-in's Clerk component can pick up the ticket.
  const target = redirectUrl ?? "/portal/dashboard";
  const url = `${target}?__clerk_ticket=${result.token}`;

  return { token: result.token, url };
}

/**
 * Revoke an outstanding invitation (e.g. client asked us to cancel, or we
 * sent to the wrong email). Safe to call on already-revoked invitations.
 */
export async function revokePortalInvitation(invitationId: string): Promise<void> {
  const client = await clerkClient();
  await client.invitations.revokeInvitation(invitationId);
}
