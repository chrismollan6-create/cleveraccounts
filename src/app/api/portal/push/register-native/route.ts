import { NextResponse } from "next/server";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getPortalDb, schema } from "@/lib/portal/db/client";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/push/register-native
 *
 * Store the caller's native FCM registration token so the server can push to
 * their iOS/Android device even when the app is closed (see fcm.ts). Called by
 * NativePush on app launch + whenever the token rotates. Keyed per
 * (clerkUserId, token) so re-registrations just refresh last_seen.
 *
 * Body: { token: string, platform: "ios" | "android" }
 */
export async function POST(req: Request) {
  const user = await getCurrentPortalUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: { token?: unknown; platform?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const platform = body.platform === "ios" || body.platform === "android" ? body.platform : null;
  if (!token || !platform) {
    return NextResponse.json(
      { ok: false, error: "BAD_TOKEN", message: "Expected { token, platform: 'ios' | 'android' }" },
      { status: 400 }
    );
  }

  const db = getPortalDb();
  const deviceName = (req.headers.get("user-agent") || "").slice(0, 120) || null;

  try {
    await db
      .insert(schema.pushTokens)
      .values({
        clerkUserId: user.clerkUserId,
        platform,
        token,
        deviceName,
        lastSeen: new Date(),
      })
      .onConflictDoUpdate({
        target: [schema.pushTokens.clerkUserId, schema.pushTokens.token],
        set: { lastSeen: new Date(), platform, deviceName },
      });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[push/register-native] error:", sanitisedError(err));
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
