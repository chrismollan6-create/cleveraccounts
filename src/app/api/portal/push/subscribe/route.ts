import { NextResponse } from "next/server";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getPortalDb, schema } from "@/lib/portal/db/client";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/push/subscribe
 *
 * Store the caller's Web Push subscription so we can notify their device even
 * when the portal is closed. Body = the PushSubscription JSON from
 * pushManager.subscribe(). Keyed per (clerkUserId, subscription) so re-subscribes
 * just refresh last_seen.
 */
export async function POST(req: Request) {
  const user = await getCurrentPortalUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let sub: { endpoint?: unknown; keys?: unknown };
  try {
    sub = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }
  if (!sub || typeof sub.endpoint !== "string" || typeof sub.keys !== "object" || sub.keys === null) {
    return NextResponse.json(
      { ok: false, error: "BAD_SUBSCRIPTION", message: "Expected a PushSubscription with endpoint + keys" },
      { status: 400 }
    );
  }

  const db = getPortalDb();
  const token = JSON.stringify(sub);
  const deviceName = (req.headers.get("user-agent") || "").slice(0, 120) || null;

  try {
    await db
      .insert(schema.pushTokens)
      .values({
        clerkUserId: user.clerkUserId,
        platform: "web",
        token,
        deviceName,
        lastSeen: new Date(),
      })
      .onConflictDoUpdate({
        target: [schema.pushTokens.clerkUserId, schema.pushTokens.token],
        set: { lastSeen: new Date(), deviceName },
      });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[push/subscribe] error:", sanitisedError(err));
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
