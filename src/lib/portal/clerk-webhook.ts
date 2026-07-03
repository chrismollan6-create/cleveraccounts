import { fetchPortalApex } from "./salesforce";
import { getPortalDb, schema } from "./db/client";
import { eq, and, notInArray, sql as drizzleSql } from "drizzle-orm";
import type { PortalBrand, PortalUserStatus } from "./db/schema";
import { logPortalEvent } from "./audit";

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
    first_name: string | null;
    last_name: string | null;
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

export type ClerkSessionEvent = {
  type: "session.created" | "session.ended" | "session.removed" | "session.revoked";
  data: {
    id: string;             // session id (sess_...)
    user_id: string;        // clerk user id
    client_id?: string;
    status?: string;
    created_at?: number;
    last_active_at?: number;
    ended_at?: number;
  };
};

export type ClerkWebhookEvent = ClerkUserEvent | ClerkUserDeletedEvent | ClerkSessionEvent;

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
 * Apex /Portal/access mapping shape (PortalAccessService.PortalUserMapping) —
 * one company the email can access.
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
 * Full /Portal/access response: the `mappings` array plus the legacy top-level
 * fields of the primary mapping (kept for backward compat during rollout).
 */
interface AccessResponse extends AccessMapping {
  mappings?: AccessMapping[];
}

/**
 * Resolve a verified email against Salesforce to ALL companies it can access.
 * Returns an empty array when the email isn't on any client account.
 *
 * Prefers the `mappings` array; falls back to the legacy single-object shape so
 * this keeps working whether or not the SF side has been upgraded yet.
 */
async function resolveSfMappings(email: string): Promise<AccessMapping[]> {
  // Pre-auth: this lookup runs before the portal.users row exists, so we
  // can't yet sign a scope-carrying JWT. `null` scope skips the
  // X-Portal-Auth header — /access is the only endpoint that allows this.
  const result = await fetchPortalApex<AccessResponse>(null, "/access", { email });
  if (result.ok === true) {
    const data = result.data;
    if (Array.isArray(data.mappings) && data.mappings.length > 0) {
      return data.mappings;
    }
    // Legacy single-object response (pre-membership SF): synthesise a one-element
    // array from the top-level fields.
    if (data.accountId && data.contactId) {
      return [
        {
          contactId: data.contactId,
          accountId: data.accountId,
          accountName: data.accountName ?? null,
          brand: data.brand,
          hasActiveWorkflow: data.hasActiveWorkflow,
          email: data.email,
        },
      ];
    }
    return [];
  }
  // result.ok === false here — TS needs explicit literal-comparison narrowing
  // because tsconfig has strict: false (no discriminated-union refinement).
  if (result.status === 404) return [];
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
    await logPortalEvent({
      action: "user_signup",
      target: event.data.id,
      metadata: { result: "no_verified_email" },
      override: { clerkUserId: event.data.id },
    });
    return { status: "disabled", action: "no_verified_email" };
  }

  return reconcilePortalAccessByEmail(
    getPortalDb(),
    {
      clerkUserId: event.data.id,
      email,
      firstName: event.data.first_name,
      lastName: event.data.last_name,
    },
    "signup"
  );
}

/**
 * Re-resolve a portal user's access from Salesforce and persist it. Shared by:
 *   - the Clerk webhook (source 'signup' — a user.created/updated event), and
 *   - the Contact sync handler (source 'sync' — staff changed a Contact, e.g.
 *     unticked Portal_Access__c, so we must re-check who can see what).
 *
 * Because /Portal/access filters on Contact.Portal_Access__c, a revoked contact
 * simply drops out of the mapping set and reconciles to 'disabled'; re-granting
 * brings it back — both fall out of the normal resolution path, no special case.
 */
export async function reconcilePortalAccessByEmail(
  db: ReturnType<typeof getPortalDb>,
  identity: PortalIdentity,
  source: "signup" | "sync" = "signup"
): Promise<{ status: PortalUserStatus; action: string }> {
  const { clerkUserId, email, firstName, lastName } = identity;
  const mappings = await resolveSfMappings(email);

  if (mappings.length === 0) {
    // No SF Contact match (or all access revoked) — soft-block. Keep an
    // identity row for the audit trail, and disable every membership.
    await db
      .insert(schema.users)
      .values({
        clerkUserId,
        contactSfId: "",
        accountSfId: "",
        brand: "clever", // best-guess default; updated on later events
        email,
        firstName,
        lastName,
        status: "disabled",
      })
      .onConflictDoUpdate({
        target: schema.users.clerkUserId,
        set: { email, firstName, lastName, status: "disabled" },
      });
    await db
      .update(schema.memberships)
      .set({ status: "disabled", updatedAt: drizzleSql`now()` })
      .where(eq(schema.memberships.clerkUserId, clerkUserId));
    await logPortalEvent({
      action: source === "sync" ? "access_revoked" : "user_signup",
      target: clerkUserId,
      metadata: { result: "no_sf_match", email, source },
      override: { clerkUserId },
    });
    return { status: "disabled", action: "no_sf_match" };
  }

  const result = await syncMembershipsForUser(db, identity, mappings);

  await logPortalEvent({
    action: source === "sync" ? "access_reconciled" : "user_signup",
    target: clerkUserId,
    metadata: {
      result: "linked",
      email,
      companies: mappings.length,
      brand: result.activeBrand,
      activeAccountSfId: result.activeAccountSfId,
      source,
    },
    override: { clerkUserId, accountSfId: result.activeAccountSfId },
  });

  return {
    status: result.activeStatus,
    action: mappings.length > 1 ? "linked_multi" : "linked",
  };
}

/** Identity fields carried from the Clerk payload into the DB writes. */
export interface PortalIdentity {
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface MembershipSyncResult {
  activeAccountSfId: string;
  activeStatus: PortalUserStatus;
  activeBrand: PortalBrand;
  companies: number;
}

/**
 * Persist a user's company memberships from a resolved set of SF mappings.
 * Pure DB work (no Salesforce, no Clerk) so it's testable in isolation:
 *
 *   1. upsert one membership row per company (per-company status)
 *   2. disable memberships for companies that dropped out of the set
 *   3. resolve the active-account cursor (keep valid existing choice, else
 *      first active company, else primary)
 *   4. dual-write the legacy users.* columns to mirror the active membership
 *
 * `mappings` MUST be non-empty — the caller handles the soft-block case.
 */
export async function syncMembershipsForUser(
  db: ReturnType<typeof getPortalDb>,
  identity: PortalIdentity,
  mappings: AccessMapping[]
): Promise<MembershipSyncResult> {
  const { clerkUserId, email, firstName, lastName } = identity;

  // 1. Upsert one membership per mapped company. Status is per-company:
  //    'active' when it has a live onboarding workflow, else 'pending'.
  for (const m of mappings) {
    const status: PortalUserStatus = m.hasActiveWorkflow ? "active" : "pending";
    await db
      .insert(schema.memberships)
      .values({
        clerkUserId,
        accountSfId: m.accountId,
        contactSfId: m.contactId,
        brand: m.brand,
        status,
      })
      .onConflictDoUpdate({
        target: [schema.memberships.clerkUserId, schema.memberships.accountSfId],
        set: {
          contactSfId: m.contactId,
          brand: m.brand,
          status,
          updatedAt: drizzleSql`now()`,
        },
      });
  }

  // 2. Reconcile removals: disable any membership for a company no longer in
  //    the mapping set (Contact moved/removed in SF → revoke on next event).
  const keepAccountIds = mappings.map((m) => m.accountId);
  await db
    .update(schema.memberships)
    .set({ status: "disabled", updatedAt: drizzleSql`now()` })
    .where(
      and(
        eq(schema.memberships.clerkUserId, clerkUserId),
        notInArray(schema.memberships.accountSfId, keepAccountIds)
      )
    );

  // 3. Resolve the active-account cursor: keep the user's existing choice if
  //    it's still a valid mapping, else default to the first ACTIVE company
  //    (fallback: the primary/newest mapping).
  const existing = await db
    .select({ activeAccountSfId: schema.users.activeAccountSfId })
    .from(schema.users)
    .where(eq(schema.users.clerkUserId, clerkUserId))
    .limit(1);
  const primary = mappings.find((m) => m.hasActiveWorkflow) ?? mappings[0];
  const currentCursor = existing.length > 0 ? existing[0].activeAccountSfId : null;
  const cursorStillValid =
    currentCursor != null && mappings.some((m) => m.accountId === currentCursor);
  const activeAccountSfId = cursorStillValid ? currentCursor : primary.accountId;

  // 4. Dual-write the legacy users.* columns to mirror the ACTIVE membership
  //    so existing read paths (withPortalScope) keep working unchanged.
  const activeMapping =
    mappings.find((m) => m.accountId === activeAccountSfId) ?? primary;
  const activeStatus: PortalUserStatus = activeMapping.hasActiveWorkflow
    ? "active"
    : "pending";

  await db
    .insert(schema.users)
    .values({
      clerkUserId,
      contactSfId: activeMapping.contactId,
      accountSfId: activeMapping.accountId,
      brand: activeMapping.brand,
      email,
      firstName,
      lastName,
      status: activeStatus,
      activeAccountSfId,
    })
    .onConflictDoUpdate({
      target: schema.users.clerkUserId,
      set: {
        contactSfId: activeMapping.contactId,
        accountSfId: activeMapping.accountId,
        brand: activeMapping.brand,
        email,
        firstName,
        lastName,
        status: activeStatus,
        activeAccountSfId,
      },
    });

  return {
    activeAccountSfId,
    activeStatus,
    activeBrand: activeMapping.brand,
    companies: mappings.length,
  };
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
  await logPortalEvent({
    action: "user_deleted",
    target: event.data.id,
    override: { clerkUserId: event.data.id },
  });
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

/**
 * Handle session lifecycle events from Clerk. Each one becomes an audit_log
 * row. `session.created` also touches `last_seen_at` on the user row.
 *
 * Clerk fires four session events:
 *   - session.created  — fresh sign-in
 *   - session.ended    — natural logout (user clicks Sign Out)
 *   - session.removed  — session invalidated (browser cleared cookies, etc.)
 *   - session.revoked  — admin force-revoked
 */
export async function handleSessionEvent(
  event: ClerkSessionEvent
): Promise<{ action: string }> {
  const db = getPortalDb();
  const clerkUserId = event.data.user_id;

  // Pull the user's account id for the audit row (if mapped)
  const userRow = await db
    .select({ accountSfId: schema.users.accountSfId })
    .from(schema.users)
    .where(eq(schema.users.clerkUserId, clerkUserId))
    .limit(1);
  const accountSfId = userRow[0]?.accountSfId ?? null;

  if (event.type === "session.created") {
    await db
      .update(schema.users)
      .set({
        lastSeenAt: drizzleSql`now()`,
        // Stamp firstLoginAt on the first ever session — keep null afterwards
        firstLoginAt: drizzleSql`coalesce(${schema.users.firstLoginAt}, now())`,
      })
      .where(eq(schema.users.clerkUserId, clerkUserId));
  }

  await logPortalEvent({
    action: event.type, // 'session.created' | 'session.ended' | 'session.removed' | 'session.revoked'
    target: event.data.id,
    metadata: { client_id: event.data.client_id },
    override: { clerkUserId, accountSfId },
  });

  return { action: event.type };
}
