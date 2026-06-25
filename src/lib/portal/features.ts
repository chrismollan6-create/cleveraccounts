/**
 * Portal feature flags.
 *
 * During the access-gated production pilot, surfaces whose Salesforce→cache
 * sync isn't built yet are hidden so real clients never see empty/seeded pages.
 * Enabled by setting `PORTAL_PILOT_MODE=true` in the production Vercel env;
 * left unset in dev/preview so the full feature set stays visible for building
 * and demos.
 *
 * Decision (2026-06-25): Documents + Notifications + Approvals are deferred for
 * the pilot. Documents has no SF source model yet; Notifications are
 * event-generated and not yet wired; and the MTD approval-state fields
 * (Client_Approval__c, Approval_Token__c, …) aren't in production yet, so the
 * Approvals page would be empty. CH details + Deadlines DO get real sync, so
 * they stay visible.
 */
export const PILOT_MODE = process.env.PORTAL_PILOT_MODE === "true";

/** Nav hrefs / surfaces suppressed while PILOT_MODE is on. */
const PILOT_HIDDEN_HREFS = new Set<string>([
  "/portal/documents",
  "/portal/notifications",
  "/portal/approvals",
]);

/** True when a surface should be hidden in the current environment. */
export function isSurfaceHidden(href: string): boolean {
  return PILOT_MODE && PILOT_HIDDEN_HREFS.has(href);
}
