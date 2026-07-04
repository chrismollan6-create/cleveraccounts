/**
 * The staff view-as session cookie name — kept in its own dependency-free
 * module so the Edge middleware can reference it without pulling in
 * impersonation.ts (which imports node:crypto, unavailable in the Edge runtime).
 * The middleware only checks this cookie's PRESENCE to let a request through;
 * its signature is verified for real in withPortalScope (Node runtime).
 */
export const IMPERSONATION_COOKIE = "portal_view_as";
