import { and, eq, inArray } from "drizzle-orm";
import { getPortalDb, schema } from "./db/client";
import { sanitisedError } from "./log";
import type { PushPayload } from "./push";

/**
 * Native push via Firebase Cloud Messaging (FCM) — the iOS/Android counterpart
 * to web push (see push.ts). Device tokens live in portal.push_tokens with
 * platform='ios'|'android' (token = the FCM registration token, stored by
 * /api/portal/push/register-native). One Admin SDK fans out to both platforms.
 *
 * Credentials (set in Vercel, server-only):
 *   FIREBASE_SERVICE_ACCOUNT_JSON — the service-account JSON for the Firebase
 *   project, either raw JSON or base64-encoded. Absent → native push disabled
 *   (this module no-ops, exactly like web push without VAPID keys).
 */

type Messaging = import("firebase-admin/messaging").Messaging;

// undefined = not yet initialised; null = initialised but disabled (no creds).
let messaging: Messaging | null | undefined;

async function getMessaging(): Promise<Messaging | null> {
  if (messaging !== undefined) return messaging;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    messaging = null;
    return null;
  }
  try {
    const [{ initializeApp, getApps, cert }, { getMessaging: getMsg }] =
      await Promise.all([
        import("firebase-admin/app"),
        import("firebase-admin/messaging"),
      ]);
    const trimmed = raw.trim();
    const json = trimmed.startsWith("{")
      ? trimmed
      : Buffer.from(trimmed, "base64").toString("utf8");
    const creds = JSON.parse(json);
    const app = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert(creds) });
    messaging = getMsg(app);
  } catch (err) {
    console.error("[fcm] init failed:", sanitisedError(err));
    messaging = null;
  }
  return messaging;
}

/** True when FCM is configured (service-account present + valid). */
export async function fcmEnabled(): Promise<boolean> {
  return (await getMessaging()) !== null;
}

/** FCM error codes that mean the token is dead and should be pruned. */
const DEAD_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument",
]);

/**
 * Send a native push to every iOS/Android token held by the given Clerk users.
 * Dead tokens are pruned. Best-effort — never throws.
 */
export async function sendFcmToClerkUsers(
  clerkUserIds: string[],
  payload: PushPayload
): Promise<number> {
  const msg = await getMessaging();
  if (!msg || clerkUserIds.length === 0) return 0;
  const db = getPortalDb();

  const rows = await db
    .select()
    .from(schema.pushTokens)
    .where(
      and(
        inArray(schema.pushTokens.clerkUserId, clerkUserIds),
        inArray(schema.pushTokens.platform, ["ios", "android"])
      )
    );
  if (rows.length === 0) return 0;

  const url = payload.url ?? "/portal/notifications";
  const data: Record<string, string> = { url };
  if (payload.tag) data.tag = payload.tag;

  let sent = 0;
  const dead: number[] = [];

  // sendEachForMulticast caps at 500 tokens per call.
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    try {
      const res = await msg.sendEachForMulticast({
        tokens: chunk.map((r) => r.token),
        notification: { title: payload.title, body: payload.body ?? "" },
        data,
        apns: {
          payload: {
            aps: {
              sound: "default",
              "mutable-content": 1,
              ...(typeof payload.badge === "number" ? { badge: payload.badge } : {}),
            },
          },
        },
        android: {
          priority: "high",
          notification: { channelId: "default", defaultSound: true },
        },
      });
      res.responses.forEach((r, idx) => {
        if (r.success) {
          sent += 1;
        } else if (r.error && DEAD_TOKEN_CODES.has(r.error.code)) {
          dead.push(chunk[idx].id);
        } else if (r.error) {
          console.warn("[fcm] send failed:", r.error.code);
        }
      });
    } catch (err) {
      console.warn("[fcm] multicast failed:", sanitisedError(err));
    }
  }

  if (dead.length > 0) {
    await db
      .delete(schema.pushTokens)
      .where(inArray(schema.pushTokens.id, dead))
      .catch(() => {});
  }
  return sent;
}
