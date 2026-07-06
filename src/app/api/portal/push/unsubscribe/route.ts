import { NextResponse } from "next/server";
import { and, eq, like } from "drizzle-orm";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getPortalDb, schema } from "@/lib/portal/db/client";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/push/unsubscribe
 *
 * Remove the caller's push subscription. Body { endpoint } removes just that
 * device; an empty body removes all of this user's web subscriptions.
 */
export async function POST(req: Request) {
  const user = await getCurrentPortalUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let endpoint: string | null = null;
  try {
    const body = await req.json();
    if (body && typeof body.endpoint === "string") endpoint = body.endpoint;
  } catch {
    // empty/invalid body → remove all of this user's web subscriptions
  }

  const db = getPortalDb();
  try {
    if (endpoint) {
      await db
        .delete(schema.pushTokens)
        .where(
          and(
            eq(schema.pushTokens.clerkUserId, user.clerkUserId),
            eq(schema.pushTokens.platform, "web"),
            like(schema.pushTokens.token, `%${endpoint}%`)
          )
        );
    } else {
      await db
        .delete(schema.pushTokens)
        .where(
          and(
            eq(schema.pushTokens.clerkUserId, user.clerkUserId),
            eq(schema.pushTokens.platform, "web")
          )
        );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[push/unsubscribe] error:", sanitisedError(err));
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
