import { eq } from "drizzle-orm";
import { getPortalSalesforceToken, sfApex } from "@/lib/salesforce";
import { getPortalDb, schema } from "./db/client";
import { sanitisedError } from "./log";
import { reconcilePortalAccessByEmail } from "./clerk-webhook";
import { revokeClerkSessions } from "./clerk-sessions";

/**
 * Sync event handler — processes a single Portal_Sync_Event__e delivered
 * via the webhook. For UPSERT events, fetches the cacheable snapshot from
 * Apex /Portal/sync-snapshot then upserts into the matching portal.*
 * Postgres table. For DELETE events, removes the row.
 *
 * Idempotency: every UPSERT path uses Postgres ON CONFLICT DO UPDATE, so
 * receiving the same event twice is a no-op. Required because Salesforce
 * platform-event subscribers retry on transient failures.
 *
 * Forensic trail: every processed event writes one row to portal.sync_log
 * with status + latency. Powers the drift-detection cron (Stage 6).
 */

export type SyncOperation = "UPSERT" | "DELETE";

export interface SyncEventInput {
  objectType: string;
  recordId: string;
  operation: SyncOperation;
  /** Unix-seconds when SF dispatched the event — used for latency tracking. */
  eventTimestamp: number;
}

export type SyncEventResult =
  | { ok: true; action: "upserted" | "deleted" | "ignored_not_portal" }
  | { ok: false; code: string; message: string };

const ALLOWED_OBJECTS = new Set([
  "Account",
  "Contact",
  "Case",
  "EmailMessage",
  "Engagement_Letter__c",
  "New_Client_Workflow__c",
  "User",
  "CH_Company__c",
  "CH_Company_Officer__c",
]);

/**
 * Top-level entry point called by /api/portal/sync after signature verify.
 * Never throws — failures are logged + recorded in portal.sync_log + a
 * structured error returned to the caller.
 */
export async function processSyncEvent(input: SyncEventInput): Promise<SyncEventResult> {
  const startedAt = Date.now();
  const db = getPortalDb();

  if (!ALLOWED_OBJECTS.has(input.objectType)) {
    await logSync(db, input, "error", "objectType not in allowlist", startedAt);
    return { ok: false, code: "UNKNOWN_OBJECT", message: `objectType '${input.objectType}' not allowed` };
  }

  try {
    if (input.operation === "DELETE") {
      const removed = await deleteFromCache(input.objectType, input.recordId);
      await logSync(db, input, "success", null, startedAt, removed ? "deleted" : "ignored_not_portal");
      return { ok: true, action: removed ? "deleted" : "ignored_not_portal" };
    }

    // UPSERT path: fetch snapshot from Apex, upsert into Postgres
    const snapshot = await fetchSnapshot(input.objectType, input.recordId);
    if (snapshot === null) {
      // Snapshot 404 = treat as delete (record either gone or no longer
      // portal-visible — e.g. Case Origin changed off Portal)
      const removed = await deleteFromCache(input.objectType, input.recordId);
      await logSync(db, input, "success", null, startedAt, removed ? "deleted" : "ignored_not_portal");
      return { ok: true, action: removed ? "deleted" : "ignored_not_portal" };
    }

    await upsertCache(input.objectType, snapshot);
    await logSync(db, input, "success", null, startedAt, "upserted");
    return { ok: true, action: "upserted" };
  } catch (err) {
    const sErr = sanitisedError(err);
    const message = typeof sErr === "string" ? sErr : sErr.message;
    await logSync(db, input, "error", message, startedAt);
    return { ok: false, code: "PROCESS_FAILED", message };
  }
}

async function logSync(
  db: ReturnType<typeof getPortalDb>,
  input: SyncEventInput,
  status: "success" | "error",
  errorMessage: string | null,
  startedAt: number,
  // For pretty audit trail — what action ended up happening
  resolvedAction: "upserted" | "deleted" | "ignored_not_portal" | null = null
): Promise<void> {
  try {
    await db.insert(schema.syncLog).values({
      objectType: input.objectType,
      sfId: input.recordId,
      operation: resolvedAction
        ? resolvedAction.toUpperCase()
        : input.operation,
      status,
      errorMessage,
      latencyMs: Date.now() - startedAt,
    });
  } catch (err) {
    // Don't fail the sync just because the audit row failed
    console.error("[sync] failed to write sync_log row:", sanitisedError(err));
  }
}

/**
 * Call Apex /Portal/sync-snapshot. Returns the snapshot payload, or null
 * if SF says 404 (record gone or not portal-visible).
 */
async function fetchSnapshot(
  objectType: string,
  recordId: string
): Promise<Record<string, unknown> | null> {
  const token = await getPortalSalesforceToken();
  const url = new URL(sfApex("/Portal/sync-snapshot"));
  url.searchParams.set("objectType", objectType);
  url.searchParams.set("recordId", recordId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`sync-snapshot ${objectType}/${recordId} failed: HTTP ${res.status} — ${text.slice(0, 200)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

/** Per-objectType upsert. Maps the snapshot payload into the right portal.* table. */
async function upsertCache(objectType: string, s: Record<string, unknown>): Promise<void> {
  const db = getPortalDb();
  switch (objectType) {
    case "Account": {
      await db
        .insert(schema.accounts)
        .values({
          sfId: s.sfId as string,
          name: s.name as string,
          brand: s.brand as "clever" | "workwell",
          ownerSfId: (s.ownerSfId as string) ?? null,
          active: (s.active as boolean) ?? true,
          sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
          raw: s,
        })
        .onConflictDoUpdate({
          target: schema.accounts.sfId,
          set: {
            name: s.name as string,
            brand: s.brand as "clever" | "workwell",
            ownerSfId: (s.ownerSfId as string) ?? null,
            active: (s.active as boolean) ?? true,
            sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
            updatedAt: new Date(),
            raw: s,
          },
        });
      // Derive VAT + Corporation Tax deadlines from the account's due dates.
      await upsertDeadline(db, {
        sfId: `${s.sfId as string}:vat`,
        accountSfId: s.sfId as string,
        kind: "vat",
        title: "VAT return",
        dueDate: parseDate(s.vatDue),
        blockedOn: "us",
      });
      await upsertDeadline(db, {
        sfId: `${s.sfId as string}:ct`,
        accountSfId: s.sfId as string,
        kind: "corporation_tax",
        title: "Corporation Tax payment",
        dueDate: parseDate(s.corpTaxDue),
        blockedOn: "us",
      });
      return;
    }
    case "Contact": {
      await db
        .insert(schema.contacts)
        .values({
          sfId: s.sfId as string,
          accountSfId: s.accountSfId as string,
          email: (s.email as string) ?? null,
          firstName: (s.firstName as string) ?? null,
          lastName: (s.lastName as string) ?? null,
          phone: (s.phone as string) ?? null,
          isPrimary: (s.isPrimary as boolean) ?? false,
          sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
          raw: s,
        })
        .onConflictDoUpdate({
          target: schema.contacts.sfId,
          set: {
            accountSfId: s.accountSfId as string,
            email: (s.email as string) ?? null,
            firstName: (s.firstName as string) ?? null,
            lastName: (s.lastName as string) ?? null,
            phone: (s.phone as string) ?? null,
            isPrimary: (s.isPrimary as boolean) ?? false,
            sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
            updatedAt: new Date(),
            raw: s,
          },
        });
      // Propagate access changes (e.g. staff toggling Portal_Access__c) to any
      // portal user tied to this Contact — revoke/re-grant promptly instead of
      // waiting for the client's next Clerk event.
      await reconcileContactAccess(db, s);
      return;
    }
    case "Case": {
      await db
        .insert(schema.cases)
        .values({
          sfId: s.sfId as string,
          accountSfId: s.accountSfId as string,
          contactSfId: (s.contactSfId as string) ?? null,
          status: s.status as string,
          subject: (s.subject as string) ?? null,
          isClosed: (s.isClosed as boolean) ?? false,
          closedAt: parseTimestamp(s.closedAt),
          createdAt: parseTimestamp(s.createdAt) ?? new Date(),
          sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
          raw: s,
        })
        .onConflictDoUpdate({
          target: schema.cases.sfId,
          set: {
            accountSfId: s.accountSfId as string,
            contactSfId: (s.contactSfId as string) ?? null,
            status: s.status as string,
            subject: (s.subject as string) ?? null,
            isClosed: (s.isClosed as boolean) ?? false,
            closedAt: parseTimestamp(s.closedAt),
            sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
            updatedAt: new Date(),
            raw: s,
          },
        });
      return;
    }
    case "EmailMessage": {
      await db
        .insert(schema.emailMessages)
        .values({
          sfId: s.sfId as string,
          caseSfId: s.caseSfId as string,
          accountSfId: s.accountSfId as string,
          fromAddress: (s.fromAddress as string) ?? null,
          fromName: (s.fromName as string) ?? null,
          subject: (s.subject as string) ?? null,
          bodyText: (s.bodyText as string) ?? null,
          sentAt: parseTimestamp(s.sentAt) ?? new Date(),
          isFromClient: (s.isFromClient as boolean) ?? false,
          isPortalAuthored: (s.isPortalAuthored as boolean) ?? false,
          hideFromPortal: (s.hideFromPortal as boolean) ?? false,
          sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
          raw: s,
        })
        .onConflictDoUpdate({
          target: schema.emailMessages.sfId,
          set: {
            caseSfId: s.caseSfId as string,
            accountSfId: s.accountSfId as string,
            fromAddress: (s.fromAddress as string) ?? null,
            fromName: (s.fromName as string) ?? null,
            subject: (s.subject as string) ?? null,
            bodyText: (s.bodyText as string) ?? null,
            sentAt: parseTimestamp(s.sentAt) ?? new Date(),
            isFromClient: (s.isFromClient as boolean) ?? false,
            isPortalAuthored: (s.isPortalAuthored as boolean) ?? false,
            hideFromPortal: (s.hideFromPortal as boolean) ?? false,
            sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
            updatedAt: new Date(),
            raw: s,
          },
        });
      return;
    }
    case "Engagement_Letter__c": {
      await db
        .insert(schema.engagementLetters)
        .values({
          sfId: s.sfId as string,
          accountSfId: s.accountSfId as string,
          status: s.status as string,
          variant: (s.variant as string) ?? null,
          token: (s.token as string) ?? null,
          sentAt: parseTimestamp(s.sentAt),
          firstViewedAt: parseTimestamp(s.firstViewedAt),
          signedAt: parseTimestamp(s.signedAt),
          signerName: (s.signerName as string) ?? null,
          signerEmail: (s.signerEmail as string) ?? null,
          pdfReady: (s.pdfReady as boolean) ?? false,
          sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
          raw: s,
        })
        .onConflictDoUpdate({
          target: schema.engagementLetters.sfId,
          set: {
            accountSfId: s.accountSfId as string,
            status: s.status as string,
            variant: (s.variant as string) ?? null,
            token: (s.token as string) ?? null,
            sentAt: parseTimestamp(s.sentAt),
            firstViewedAt: parseTimestamp(s.firstViewedAt),
            signedAt: parseTimestamp(s.signedAt),
            signerName: (s.signerName as string) ?? null,
            signerEmail: (s.signerEmail as string) ?? null,
            pdfReady: (s.pdfReady as boolean) ?? false,
            sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
            updatedAt: new Date(),
            raw: s,
          },
        });
      return;
    }
    case "New_Client_Workflow__c": {
      // The Apex snapshot endpoint returns an envelope:
      //   { sfId, accountSfId, currentStage, ..., raw: <full PortalOnboardingStatus DTO> }
      // We use the envelope's flat fields for our explicit columns AND store
      // the nested DTO (s.raw) as the cache row's raw jsonb so reads can
      // unwrap it directly into PortalOnboardingStatus. Storing the whole
      // envelope as raw would double-wrap and the dashboard would see
      // undefined for stages/accountant/tasks.
      const dto = (s as { raw?: unknown }).raw ?? s;
      await db
        .insert(schema.workflows)
        .values({
          sfId: s.sfId as string,
          accountSfId: s.accountSfId as string,
          currentStage: s.currentStage as string,
          stageNumber: (s.stageNumber as number) ?? 1,
          blockedOn: (s.blockedOn as string) ?? "nobody",
          slaStatus: (s.slaStatus as string) ?? "on_track",
          signedOffAt: parseDate(s.signedOffAt),
          raw: dto as Record<string, unknown>,
        })
        .onConflictDoUpdate({
          target: schema.workflows.sfId,
          set: {
            accountSfId: s.accountSfId as string,
            currentStage: s.currentStage as string,
            stageNumber: (s.stageNumber as number) ?? 1,
            blockedOn: (s.blockedOn as string) ?? "nobody",
            slaStatus: (s.slaStatus as string) ?? "on_track",
            signedOffAt: parseDate(s.signedOffAt),
            updatedAt: new Date(),
            raw: dto as Record<string, unknown>,
          },
        });
      return;
    }
    case "User": {
      await db
        .insert(schema.accountants)
        .values({
          sfId: s.sfId as string,
          name: (s.name as string) ?? null,
          email: (s.email as string) ?? null,
          calendlySlug: (s.calendlySlug as string) ?? null,
          photoUrl: (s.photoUrl as string) ?? null,
          active: (s.active as boolean) ?? true,
          sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
          raw: s,
        })
        .onConflictDoUpdate({
          target: schema.accountants.sfId,
          set: {
            name: (s.name as string) ?? null,
            email: (s.email as string) ?? null,
            calendlySlug: (s.calendlySlug as string) ?? null,
            photoUrl: (s.photoUrl as string) ?? null,
            active: (s.active as boolean) ?? true,
            sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
            updatedAt: new Date(),
            raw: s,
          },
        });
      return;
    }
    case "CH_Company__c": {
      const vals = {
        sfId: s.sfId as string,
        accountSfId: s.accountSfId as string,
        companyNumber: (s.companyNumber as string) ?? null,
        companyName: (s.companyName as string) ?? null,
        status: (s.status as string) ?? null,
        statusDetail: (s.statusDetail as string) ?? null,
        companyType: (s.companyType as string) ?? null,
        dateOfCreation: parseDate(s.dateOfCreation),
        dateOfCessation: parseDate(s.dateOfCessation),
        regPremises: (s.regPremises as string) ?? null,
        regLine1: (s.regLine1 as string) ?? null,
        regLine2: (s.regLine2 as string) ?? null,
        regLocality: (s.regLocality as string) ?? null,
        regRegion: (s.regRegion as string) ?? null,
        regPostalCode: (s.regPostalCode as string) ?? null,
        regCountry: (s.regCountry as string) ?? null,
        sicCodes: (s.sicCodes as string) ?? null,
        accountsNextDue: parseDate(s.accountsNextDue),
        accountsLastMadeUp: parseDate(s.accountsLastMadeUp),
        accountsNextPeriodEnd: parseDate(s.accountsNextPeriodEnd),
        accountsOverdue: (s.accountsOverdue as boolean) ?? false,
        csNextDue: parseDate(s.csNextDue),
        csLastMadeUp: parseDate(s.csLastMadeUp),
        csOverdue: (s.csOverdue as boolean) ?? false,
        lastSynced: parseTimestamp(s.lastSynced),
        sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
        raw: s,
      };
      await db
        .insert(schema.companies)
        .values(vals)
        .onConflictDoUpdate({
          target: schema.companies.sfId,
          set: { ...vals, updatedAt: new Date() },
        });
      // Derive Companies House filing deadlines (annual accounts + CS).
      await upsertDeadline(db, {
        sfId: `${vals.sfId}:accounts`,
        accountSfId: vals.accountSfId,
        kind: "accounts",
        title: "Annual accounts",
        dueDate: vals.accountsNextDue,
        overdue: vals.accountsOverdue,
        blockedOn: "us",
      });
      await upsertDeadline(db, {
        sfId: `${vals.sfId}:cs`,
        accountSfId: vals.accountSfId,
        kind: "confirmation_statement",
        title: "Confirmation statement",
        dueDate: vals.csNextDue,
        overdue: vals.csOverdue,
        blockedOn: "us",
      });
      return;
    }
    case "CH_Company_Officer__c": {
      const vals = {
        sfId: s.sfId as string,
        accountSfId: s.accountSfId as string,
        companySfId: (s.companySfId as string) ?? null,
        name: (s.name as string) ?? null,
        officerRole: (s.officerRole as string) ?? null,
        appointedOn: parseDate(s.appointedOn),
        resignedOn: parseDate(s.resignedOn),
        monthOfBirth: (s.monthOfBirth as string) ?? null,
        yearOfBirth: (s.yearOfBirth as string) ?? null,
        occupation: (s.occupation as string) ?? null,
        nationality: (s.nationality as string) ?? null,
        countryOfResidence: (s.countryOfResidence as string) ?? null,
        addrPremises: (s.addrPremises as string) ?? null,
        addrLine1: (s.addrLine1 as string) ?? null,
        addrLine2: (s.addrLine2 as string) ?? null,
        addrLocality: (s.addrLocality as string) ?? null,
        addrRegion: (s.addrRegion as string) ?? null,
        addrPostalCode: (s.addrPostalCode as string) ?? null,
        addrCountry: (s.addrCountry as string) ?? null,
        idvVerifiedOn: parseDate(s.idvVerifiedOn),
        sfUpdatedAt: parseTimestamp(s.sfUpdatedAt),
        raw: s,
      };
      await db
        .insert(schema.officers)
        .values(vals)
        .onConflictDoUpdate({
          target: schema.officers.sfId,
          set: { ...vals, updatedAt: new Date() },
        });
      return;
    }
  }
}

/**
 * After a Contact syncs, re-check portal access for any user tied to it — this
 * is how staff unticking (or re-ticking) Contact.Portal_Access__c propagates
 * promptly, rather than waiting for the client's next Clerk event.
 *
 * Affected users = those who currently hold a membership for this Contact, OR
 * whose login email matches it (covers a newly-granted company). Each is
 * re-resolved through the shared access logic (which re-queries /access, now
 * gated on Portal_Access__c); a user left with no access at all is force-logged
 * out. Best-effort — never throws, so a reconcile hiccup can't fail the cache
 * upsert that already succeeded.
 */
async function reconcileContactAccess(
  db: ReturnType<typeof getPortalDb>,
  s: Record<string, unknown>
): Promise<void> {
  try {
    const contactSfId = s.sfId as string;
    const email = ((s.email as string) ?? "").toLowerCase().trim();

    const affected = new Set<string>();
    const byMembership = await db
      .select({ clerkUserId: schema.memberships.clerkUserId })
      .from(schema.memberships)
      .where(eq(schema.memberships.contactSfId, contactSfId));
    for (const r of byMembership) affected.add(r.clerkUserId);

    if (email) {
      const byEmail = await db
        .select({ clerkUserId: schema.users.clerkUserId })
        .from(schema.users)
        .where(eq(schema.users.email, email));
      for (const r of byEmail) affected.add(r.clerkUserId);
    }

    if (affected.size === 0) return;

    for (const clerkUserId of affected) {
      const rows = await db
        .select({
          email: schema.users.email,
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
        })
        .from(schema.users)
        .where(eq(schema.users.clerkUserId, clerkUserId))
        .limit(1);
      if (rows.length === 0) continue;
      const u = rows[0];

      const res = await reconcilePortalAccessByEmail(
        db,
        { clerkUserId, email: u.email, firstName: u.firstName, lastName: u.lastName },
        "sync"
      );

      // Fully revoked → sign them out. Their data is already denied on the next
      // request by the scope check; this actually ends the session.
      if (res.status === "disabled") {
        await revokeClerkSessions(clerkUserId);
      }
    }
  } catch (err) {
    console.error("[sync] reconcileContactAccess failed:", sanitisedError(err));
  }
}

/** Per-objectType DELETE. Returns true if a row was actually deleted. */
async function deleteFromCache(objectType: string, sfId: string): Promise<boolean> {
  const db = getPortalDb();
  const { eq } = await import("drizzle-orm");
  switch (objectType) {
    case "Account":
      return (await db.delete(schema.accounts).where(eq(schema.accounts.sfId, sfId))).length > 0;
    case "Contact":
      return (await db.delete(schema.contacts).where(eq(schema.contacts.sfId, sfId))).length > 0;
    case "Case":
      return (await db.delete(schema.cases).where(eq(schema.cases.sfId, sfId))).length > 0;
    case "EmailMessage":
      return (await db.delete(schema.emailMessages).where(eq(schema.emailMessages.sfId, sfId))).length > 0;
    case "Engagement_Letter__c":
      return (await db.delete(schema.engagementLetters).where(eq(schema.engagementLetters.sfId, sfId))).length > 0;
    case "New_Client_Workflow__c":
      return (await db.delete(schema.workflows).where(eq(schema.workflows.sfId, sfId))).length > 0;
    case "User":
      return (await db.delete(schema.accountants).where(eq(schema.accountants.sfId, sfId))).length > 0;
    case "CH_Company__c":
      return (await db.delete(schema.companies).where(eq(schema.companies.sfId, sfId))).length > 0;
    case "CH_Company_Officer__c":
      return (await db.delete(schema.officers).where(eq(schema.officers.sfId, sfId))).length > 0;
  }
  return false;
}

/** Parse SF ISO 8601 timestamp → Date, or null. */
function parseTimestamp(v: unknown): Date | null {
  if (!v) return null;
  if (typeof v !== "string") return null;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
}

/** Parse SF 'YYYY-MM-DD' date string → string passthrough (Drizzle handles). */
function parseDate(v: unknown): string | null {
  if (!v) return null;
  if (typeof v !== "string") return null;
  return v;
}

/** Derive a deadline status from its due date (+ an explicit overdue flag). */
function deriveDeadlineStatus(dueDate: string, overdue?: boolean): string {
  if (overdue) return "overdue";
  const d = new Date(dueDate);
  if (!Number.isFinite(d.getTime())) return "upcoming";
  const days = Math.round((d.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "overdue";
  if (days <= 30) return "due_soon";
  return "upcoming";
}

/**
 * Upsert (or clear) a DERIVED deadline row. Deadlines have no SObject of their
 * own — they're synthesised from CH + Account dates during those objects' sync,
 * keyed by a deterministic synthetic id (e.g. "<companyId>:accounts") so
 * re-sync is idempotent. A null due date removes the row (source date cleared).
 */
async function upsertDeadline(
  db: ReturnType<typeof getPortalDb>,
  p: {
    sfId: string;
    accountSfId: string;
    kind: string;
    title: string;
    dueDate: string | null;
    blockedOn: string;
    overdue?: boolean;
  }
): Promise<void> {
  const { eq } = await import("drizzle-orm");
  if (!p.dueDate) {
    await db.delete(schema.deadlines).where(eq(schema.deadlines.sfId, p.sfId));
    return;
  }
  const vals = {
    sfId: p.sfId,
    accountSfId: p.accountSfId,
    kind: p.kind,
    title: p.title,
    dueDate: p.dueDate,
    periodLabel: null,
    status: deriveDeadlineStatus(p.dueDate, p.overdue),
    blockedOn: p.blockedOn,
    updatedAt: new Date(),
  };
  await db
    .insert(schema.deadlines)
    .values(vals)
    .onConflictDoUpdate({ target: schema.deadlines.sfId, set: vals });
}
