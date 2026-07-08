import { NextResponse } from "next/server";
import { countUnreadNotificationsForCurrentUser } from "@/lib/portal/notifications";

/**
 * GET /api/portal/notifications/unread-count
 *
 * The current account's unread notification count. The native app calls this
 * on launch / foreground / background to keep the iOS app-icon badge in sync
 * with what's actually unread (so reading a notification clears the badge,
 * instead of it lingering until the next push). Fail-soft to 0.
 */
export async function GET() {
  try {
    const res = await countUnreadNotificationsForCurrentUser();
    return NextResponse.json({ count: res.ok ? res.data : 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
