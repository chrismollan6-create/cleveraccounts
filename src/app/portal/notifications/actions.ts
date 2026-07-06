"use server";

import { markNotificationRead } from "@/lib/portal/notifications";

/**
 * Mark one notification read — called from NotificationCard when the client
 * taps it (inbox behaviour). Fire-and-forget from the client; failures are
 * swallowed there since the row will simply stay unread and can be tapped again.
 */
export async function markNotificationReadAction(id: string): Promise<void> {
  await markNotificationRead(id);
}
