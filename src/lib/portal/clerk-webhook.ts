import { fetchPortalApex } from "./salesforce";
import { getPortalDb, schema } from "./db/client";
import { eq, sql as drizzleSql } from "drizzle-orm";
import type { PortalBrand, PortalUserStatus } from "./db/schema";

/**
 * Clerk webhook event types we care about.
 *
 * Clerk delivers webhooks via Svix; payload shapes are documented at:
 * https://clerk.com/docs/integrations/webhooks/overview
 */

export type ClerkUserEvent = {
  type: "user.created" | "user.updated";
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
      verification: { status: string } | null;
    }>;
    primary_email_address_id: string | null;
  };
};

export type ClerkUserDeletedEvent = {
  type: "user.deleted";
  data: {
    id: string;
    deleted?: boolean;
  };
};

export type ClerkWebhookEvent = ClerkUserEvent | ClerkUserDeletedEvent;

/**
 * Pick the verified primary email from a Clerk user payload.
 * Returns null if no verified email is present.
 */
function pickPrimaryEmail(event: ClerkUserEvent): string | null {
  const primaryId = event.data.primary_email_address_id;
  const emails = event.data.email_addresses ?? [];
  const primary = primaryId
    ? emails.find((e) => e.id === primaryId)
    : emails[0];
  if (!primary) return null;
  if (primary.verification?.status !== "verified") return null;
  return primary.email_address.toLowerCase().trim();
}

/**
 * Apex /Portal/access response shape (from PortalAccessService.PortalUserMapping).
 */
interface AccessMapping {
  contactId: string;
  accountId: string;
  accountName: string | null;
  brand: PortalBrand;
  hasActiveWorkflow: boolean;
  email: string;
}

/**
 * Resolve a verified email against Salesforce. Returns mapping if there's a
 * matching Contact, or null when the email isn't on any active client account.
 */
async function resolveSfMapping(email: string): Promise<AccessMapping | null> {
  const result = await fetchPortalApex<AccessMapping>("/access", { email });
  if (result.ok === true) return result.data;
  // result.ok === false here — but TS needs explicit literal-comparison narrowing
  // because tsconfig has strict: false (no discriminated-union refinement on !result.ok).
  if (result.status === 404) return null;
  throw new Error(`SF access lookup failed: ${result.error} - ${result.message}`);
}

/**
 * Handle a user.created or user.updated event.
 * Upserts a row in portal.users. Status reflects whether the email maps to an
 * active SF Contact:
 *   - 'active'    — Contact found with an active onboarding workflow
 *   - 'pending'   — Contact found but their workflow is signed-off (long-standing client)
 *   - 'disabled'  — no Contact match; user sees the AccessGate page
 */
export async function handleUserCreatedOrUpdated(
  event: ClerkUserEvent
): Promise<{ status: PortalUserStatus; action: string }> {
  const email = pickPrimaryEmail(event);
  if (!email) {
    // No verified email yet — leave a placeholder row so we can update it
    // once Clerk verifies the address. Status 'disabled' means dashboard
    // shows the gate page until they verify.
    return { status: "disabled", action: "no_verified_email" };
  }

  const mapping = await resolveSfMapping(email);
  const db = getPortalDb();

  if (!mapping) {
    // No SF Contact match — soft-block. Insert/update a row so we have an
    // audit trail of who attempted to access.
    await db
      .insert(schema.users)
      .values({
        clerkUserId: event.data.id,
        contactSfId: "",
        accountSfId: "",
        brand: "clever", // best-guess default; updated on later events
        email,
        status: "disabled",
      })
      .onConflictDoUpdate({
        target: schema.users.clerkUserId,
        set: {
          email,
          status: "disabled",
        },
      });
    return { status: "disabled", action: "no_sf_match" };
  }

  const finalStatus: PortalUserStatus = mapping.hasActiveWorkflow
    ? "active"
    : "pending";

  await db
    .insert(schema.users)
    .values({
      clerkUserId: event.data.id,
      contactSfId: mapping.contactId,
      accountSfId: mapping.accountId,
      brand: mapping.brand,
      email,
      status: finalStatus,
    })
    .onConflictDoUpdate({
      target: schema.users.clerkUserId,
      set: {
        contactSfId: mapping.contactId,
        accountSfId: mapping.accountId,
        brand: mapping.brand,
        email,
        status: finalStatus,
      },
    });

  return { status: finalStatus, action: "linked" };
}

/**
 * Handle a user.deleted event. Marks the portal.users row as 'disabled'
 * rather than physically deleting — keeps the audit_log foreign references
 * intact for forensic queries.
 */
export async function handleUserDeleted(
  event: ClerkUserDeletedEvent
): Promise<{ action: string }> {
  const db = getPortalDb();
  await db
    .update(schema.users)
    .set({ status: "disabled" })
    .where(eq(schema.users.clerkUserId, event.data.id));
  return { action: "disabled" };
}

/**
 * Update the `last_seen_at` timestamp for a user. Called from middleware on
 * authenticated portal requests so we can show "last seen" in staff tools.
 * Cheap operation — single UPDATE by primary key.
 */
export async function touchLastSeen(clerkUserId: string): Promise<void> {
  const db = getPortalDb();
  await db
    .update(schema.users)
    .set({ lastSeenAt: drizzleSql`now()` })
    .where(eq(schema.users.clerkUserId, clerkUserId));
}
