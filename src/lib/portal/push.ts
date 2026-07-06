import webpush from "web-push";
import { and, eq, inArray, count, isNull } from "drizzle-orm";
import { getPortalDb, schema } from "./db/client";
import { sanitisedError } from "./log";
import { sendFcmToClerkUsers } from "./fcm";

/**
 * Web push — delivers a portal notification to a client's browser/device even
 * when the portal isn't open. Subscriptions live in portal.push_tokens
 * (platform='web', token = the full PushSubscription JSON). This is the same
 * `lib/push.ts` seam the future Capacitor/FCM app will implement for native.
 *
 * VAPID keys come from env (set in Vercel):
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY  — also read client-side to subscribe
 *   VAPID_PRIVATE_KEY             — server only
 *   VAPID_SUBJECT                 — mailto: contact (optional; defaulted)
 */

export interface PushPayload {
  title: string;
  body?: string | null;
  /** Relative portal URL to open on click. */
  url?: string | null;
  /** Coalesces repeat notifications on the device. */
  tag?: string | null;
  /** iOS app-icon badge count (native push only). */
  badge?: number;
}

let configured: boolean | null = null;

/** Configure VAPID once. Returns false when keys aren't set (push disabled). */
function ensureConfigured(): boolean {
  if (configured !== null) return configured;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    configured = false;
    return false;
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:portal@cleveraccounts.com",
    pub,
    priv
  );
  configured = true;
  return true;
}

/** True when web push is configured (keys present). */
export function pushEnabled(): boolean {
  return ensureConfigured();
}

/**
 * Send a push to every device held by the given Clerk users — web (browser)
 * AND native (iOS/Android via FCM). Each channel is independent: web sends when
 * VAPID is configured, native when Firebase is (see fcm.ts). Dead tokens are
 * pruned. Best-effort: never throws.
 */
export async function sendPushToClerkUsers(
  clerkUserIds: string[],
  payload: PushPayload
): Promise<number> {
  if (clerkUserIds.length === 0) return 0;

  const [web, native] = await Promise.all([
    sendWebPushToClerkUsers(clerkUserIds, payload),
    sendFcmToClerkUsers(clerkUserIds, payload).catch(() => 0),
  ]);
  return web + native;
}

/** Web-push (browser) leg of sendPushToClerkUsers. Prunes expired subs. */
async function sendWebPushToClerkUsers(
  clerkUserIds: string[],
  payload: PushPayload
): Promise<number> {
  if (!ensureConfigured()) return 0;
  const db = getPortalDb();

  const tokens = await db
    .select()
    .from(schema.pushTokens)
    .where(
      and(
        inArray(schema.pushTokens.clerkUserId, clerkUserIds),
        eq(schema.pushTokens.platform, "web")
      )
    );
  if (tokens.length === 0) return 0;

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body ?? "",
    url: payload.url ?? "/portal/notifications",
    tag: payload.tag ?? undefined,
  });

  let sent = 0;
  await Promise.allSettled(
    tokens.map(async (t) => {
      try {
        const subscription = JSON.parse(t.token) as webpush.PushSubscription;
        await webpush.sendNotification(subscription, body);
        sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          // Subscription gone — prune it so we stop trying.
          await db
            .delete(schema.pushTokens)
            .where(eq(schema.pushTokens.id, t.id))
            .catch(() => {});
        } else {
          console.warn("[push] send failed:", sanitisedError(err));
        }
      }
    })
  );
  return sent;
}

/**
 * Send a push to everyone with portal access to an Account (membership or
 * legacy single-account link). Used when a per-client notification is created.
 */
export async function sendPushToAccount(
  accountSfId: string,
  payload: PushPayload
): Promise<number> {
  // Web/native config is checked per-channel inside sendPushToClerkUsers, so
  // native still fires when web (VAPID) is off and vice-versa.
  if (!accountSfId) return 0;
  const db = getPortalDb();

  const [members, legacy] = await Promise.all([
    db
      .select({ clerkUserId: schema.memberships.clerkUserId })
      .from(schema.memberships)
      .where(eq(schema.memberships.accountSfId, accountSfId)),
    db
      .select({ clerkUserId: schema.users.clerkUserId })
      .from(schema.users)
      .where(eq(schema.users.accountSfId, accountSfId)),
  ]);

  const ids = Array.from(
    new Set([
      ...members.map((m) => m.clerkUserId),
      ...legacy.map((l) => l.clerkUserId),
    ])
  );
  if (ids.length === 0) return 0;

  // iOS app-icon badge = the account's total unread notifications, so the red
  // dot on the app icon matches the inbox. Fail-soft to no badge.
  let badge = payload.badge;
  if (badge === undefined) {
    try {
      const [row] = await db
        .select({ n: count() })
        .from(schema.notifications)
        .where(
          and(
            eq(schema.notifications.accountSfId, accountSfId),
            isNull(schema.notifications.readAt)
          )
        );
      badge = Number(row?.n ?? 0);
    } catch {
      /* no badge */
    }
  }

  return sendPushToClerkUsers(ids, { ...payload, badge });
}
