import { clerkClient } from "@clerk/nextjs/server";
import { sanitisedError } from "./log";

/**
 * Force-logout: revoke every active Clerk session for a user.
 *
 * Called when a user's portal access is fully revoked (e.g. staff untick
 * Contact.Portal_Access__c and they have no other company left). The
 * server-side scope check already denies their data on the next request, but
 * revoking sessions actually signs them out rather than leaving them staring
 * at an AccessGate.
 *
 * Best-effort by design — a Clerk API hiccup must never fail the surrounding
 * sync. Returns the number of sessions revoked (0 on any error).
 */
export async function revokeClerkSessions(clerkUserId: string): Promise<number> {
  try {
    const client = await clerkClient();
    const { data: sessions } = await client.sessions.getSessionList({
      userId: clerkUserId,
      status: "active",
    });
    let revoked = 0;
    for (const s of sessions) {
      try {
        await client.sessions.revokeSession(s.id);
        revoked++;
      } catch (err) {
        console.error(
          `[clerk] revokeSession failed for session ${s.id}:`,
          sanitisedError(err)
        );
      }
    }
    return revoked;
  } catch (err) {
    console.error(
      `[clerk] revokeClerkSessions failed for user ${clerkUserId}:`,
      sanitisedError(err)
    );
    return 0;
  }
}
