import { and, eq, ne } from "drizzle-orm";
import { getPortalDb, schema } from "./db/client";
import { getCurrentPortalUser } from "./auth";
import type { PortalBrand, PortalUserStatus } from "./db/schema";

/**
 * The set of companies a single portal login can access, and helpers for
 * switching between them. The account switcher (PortalShell) reads
 * listMyCompanies(); the setActiveAccount server action (actions.ts) uses
 * resolveSwitchTarget() as its authorization gate.
 */

export interface PortalCompany {
  accountSfId: string;
  name: string;
  brand: PortalBrand;
  status: PortalUserStatus;
  /** True for the company currently in scope (the active cursor). */
  isActive: boolean;
}

/**
 * List the current user's companies (non-disabled memberships), newest-created
 * first, with the active one flagged. Empty when signed-out or unlinked. The
 * UI shows a switcher only when this returns more than one.
 */
export async function listMyCompanies(): Promise<PortalCompany[]> {
  const user = await getCurrentPortalUser();
  if (!user || !user.clerkUserId) return [];

  const db = getPortalDb();
  const rows = await db
    .select({
      accountSfId: schema.memberships.accountSfId,
      status: schema.memberships.status,
      brand: schema.memberships.brand,
      name: schema.accounts.name,
      createdAt: schema.memberships.createdAt,
    })
    .from(schema.memberships)
    .leftJoin(schema.accounts, eq(schema.accounts.sfId, schema.memberships.accountSfId))
    .where(
      and(
        eq(schema.memberships.clerkUserId, user.clerkUserId),
        ne(schema.memberships.status, "disabled")
      )
    );

  return rows
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    .map((r) => ({
      accountSfId: r.accountSfId,
      // Account name comes from the cache; fall back gracefully if a
      // membership exists before its account row has synced.
      name: r.name ?? "Your company",
      brand: r.brand,
      status: r.status,
      // The active company is whichever the legacy users.* columns mirror
      // (dual-write keeps user.accountSfId pointed at the active membership).
      isActive: r.accountSfId === user.accountSfId,
    }));
}

export type SwitchResolution =
  | { ok: true; membership: typeof schema.memberships.$inferSelect }
  | { ok: false; reason: "not_a_member" | "disabled" };

/**
 * Authorization gate for switching accounts — the security boundary.
 *
 * Returns the target membership ONLY if the given clerk user holds a
 * non-disabled membership for that account. The incoming accountSfId is
 * untrusted input (it comes from the client), so this is the sole check that
 * stops a user from scoping themselves into a company they don't belong to.
 * Kept separate from the server action so it can be unit-tested directly.
 */
export async function resolveSwitchTarget(
  db: ReturnType<typeof getPortalDb>,
  clerkUserId: string,
  accountSfId: string
): Promise<SwitchResolution> {
  const rows = await db
    .select()
    .from(schema.memberships)
    .where(
      and(
        eq(schema.memberships.clerkUserId, clerkUserId),
        eq(schema.memberships.accountSfId, accountSfId)
      )
    )
    .limit(1);

  const m = rows[0];
  if (!m) return { ok: false, reason: "not_a_member" };
  if (m.status === "disabled") return { ok: false, reason: "disabled" };
  return { ok: true, membership: m };
}
