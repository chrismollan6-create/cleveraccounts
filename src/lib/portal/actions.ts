"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getPortalDb, schema } from "./db/client";
import { getCurrentPortalUser } from "./auth";
import { resolveSwitchTarget } from "./memberships";
import { getImpersonationSession } from "./impersonation";
import { logPortalEvent } from "./audit";

export type SwitchAccountResult =
  | { ok: true }
  | { ok: false; error: "not_signed_in" | "forbidden" };

/**
 * Switch the active company for the signed-in user.
 *
 * SECURITY: the accountSfId comes from the client and is untrusted. It is only
 * honoured if resolveSwitchTarget confirms the caller holds a live membership
 * for it — a forged/stale id is rejected and audited. On success we move the
 * cursor AND mirror the legacy users.* columns to the chosen membership, so the
 * existing withPortalScope read path scopes to the new company on the very next
 * request (no change to the IDOR chokepoint itself).
 */
export async function setActiveAccount(
  accountSfId: string
): Promise<SwitchAccountResult> {
  // A staff view-as session must never switch accounts (it's read-only, and
  // the target account is fixed by the impersonation token).
  if (await getImpersonationSession()) return { ok: false, error: "forbidden" };

  const user = await getCurrentPortalUser();
  if (!user || !user.clerkUserId) return { ok: false, error: "not_signed_in" };

  const db = getPortalDb();
  const resolution = await resolveSwitchTarget(db, user.clerkUserId, accountSfId);

  if (resolution.ok === false) {
    await logPortalEvent({
      action: "switch_account_denied",
      target: accountSfId,
      metadata: { reason: resolution.reason },
      override: { clerkUserId: user.clerkUserId },
    });
    return { ok: false, error: "forbidden" };
  }

  const m = resolution.membership;
  await db
    .update(schema.users)
    .set({
      activeAccountSfId: m.accountSfId,
      // Dual-write mirror — keeps withPortalScope correct without touching it.
      accountSfId: m.accountSfId,
      contactSfId: m.contactSfId,
      brand: m.brand,
      status: m.status,
    })
    .where(eq(schema.users.clerkUserId, user.clerkUserId));

  await logPortalEvent({
    action: "switch_account",
    target: m.accountSfId,
    metadata: { from: user.accountSfId },
    override: { clerkUserId: user.clerkUserId, accountSfId: m.accountSfId },
  });

  // Re-render the whole portal subtree so every surface reflects the new scope.
  revalidatePath("/portal", "layout");
  return { ok: true };
}
