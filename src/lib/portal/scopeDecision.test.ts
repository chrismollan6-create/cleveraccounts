/**
 * Security regression net for the portal's IDOR chokepoint.
 *
 * decidePortalScope() is the single gate that decides whether a request can
 * see ANY account data, and for which account. These assertions pin its
 * behaviour so the Week-3 membership change (and anything after) can't quietly
 * widen access.
 *
 * No test runner is wired up in this repo — run directly:
 *   npx tsx src/lib/portal/scopeDecision.test.ts
 * Exits non-zero on the first failure.
 */
import { decidePortalScope } from "./scopeDecision";
import type { PortalUser } from "./auth";

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ✘ ${name}`);
    failures++;
  }
}

// A fully-authorised active user — the only shape that should ever be granted.
const activeUser: PortalUser = {
  clerkUserId: "user_active",
  email: "dir@example.com",
  firstName: "Dir",
  lastName: "Ector",
  accountSfId: "001AAA",
  contactSfId: "003BBB",
  brand: "clever",
  status: "active",
};

console.log("decidePortalScope — security decision table");

// ── Deny paths ──────────────────────────────────────────────────────────────
check("null user (not signed in) is denied", decidePortalScope(null).ok === false);
check(
  "null user reason = not_signed_in",
  !decidePortalScope(null).ok &&
    (decidePortalScope(null) as { reason: string }).reason === "not_signed_in"
);

const disabled = decidePortalScope({ ...activeUser, status: "disabled" });
check("disabled status is denied", disabled.ok === false);
check(
  "disabled reason = disabled",
  !disabled.ok && (disabled as { reason: string }).reason === "disabled"
);
// SECURITY: a disabled user carrying a populated account must NOT leak scope.
check(
  "disabled user with populated account yields NO scope",
  !("scope" in disabled)
);

const pending = decidePortalScope({ ...activeUser, status: "pending" });
check("pending status is denied", pending.ok === false);
check(
  "pending reason = pending",
  !pending.ok && (pending as { reason: string }).reason === "pending"
);

// Any status that isn't active/pending/disabled (e.g. a stale/unknown row).
const weird = decidePortalScope({
  ...activeUser,
  status: "provisioning" as unknown as PortalUser["status"],
});
check("unknown status is denied", weird.ok === false);
check(
  "unknown status reason = no_link_row",
  !weird.ok && (weird as { reason: string }).reason === "no_link_row"
);

// Active but incomplete link triples → missing_account (defensive).
for (const [label, patch] of [
  ["null accountSfId", { accountSfId: null }],
  ["empty accountSfId", { accountSfId: "" }],
  ["null contactSfId", { contactSfId: null }],
  ["null brand", { brand: null }],
] as const) {
  const d = decidePortalScope({ ...activeUser, ...patch } as PortalUser);
  check(
    `active + ${label} → missing_account`,
    !d.ok && (d as { reason: string }).reason === "missing_account"
  );
}

// ── Grant path ────────────────────────────────────────────────────────────────
const ok = decidePortalScope(activeUser);
check("fully active user is granted", ok.ok === true);
check(
  "granted scope carries the right account",
  ok.ok && ok.scope.accountSfId === "001AAA"
);
check(
  "granted scope carries the right contact",
  ok.ok && ok.scope.contactSfId === "003BBB"
);
check("granted scope carries brand", ok.ok && ok.scope.brand === "clever");
check(
  "granted scope carries clerk user id",
  ok.ok && ok.scope.clerkUserId === "user_active"
);

// Email null must coalesce to "" (never undefined leaking downstream).
const nullEmail = decidePortalScope({ ...activeUser, email: null });
check("null email coalesces to empty string", nullEmail.ok && nullEmail.scope.email === "");

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll scope-decision checks passed.");
