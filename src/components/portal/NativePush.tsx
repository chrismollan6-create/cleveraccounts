"use client";

import { useEffect } from "react";

/**
 * Native-app glue — runs only inside the Capacitor app. Two jobs:
 *  1. Register the device's FCM token for push (via the injected
 *     window.Capacitor.Plugins.FirebaseMessaging global), and deep-link taps.
 *  2. Keep the iOS app-icon badge in sync with the real unread-notification
 *     count on launch / foreground / background — so reading a notification
 *     clears the badge instead of it lingering until the next push.
 */

interface PluginListener {
  remove?: () => void;
}
interface FirebaseMessagingPlugin {
  requestPermissions: () => Promise<{ receive: string }>;
  getToken: () => Promise<{ token: string }>;
  addListener: (event: string, cb: (data: unknown) => void) => Promise<PluginListener>;
}
interface BadgePlugin {
  set: (options: { count: number }) => Promise<void>;
  clear: () => Promise<void>;
}
interface AppPlugin {
  addListener: (event: string, cb: (data: unknown) => void) => Promise<PluginListener>;
}
interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: {
    FirebaseMessaging?: FirebaseMessagingPlugin;
    Badge?: BadgePlugin;
    App?: AppPlugin;
  };
}

export default function NativePush() {
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    const platform = cap.getPlatform?.() === "android" ? "android" : "ios";
    const FM = cap.Plugins?.FirebaseMessaging;
    const Badge = cap.Plugins?.Badge;
    const App = cap.Plugins?.App;

    let cancelled = false;
    const listeners: PluginListener[] = [];

    // ── Badge sync — set the app-icon badge to the real unread count ────────
    const syncBadge = async () => {
      if (!Badge) return;
      try {
        const res = await fetch("/api/portal/notifications/unread-count", {
          cache: "no-store",
        });
        const { count } = (await res.json()) as { count?: number };
        if (typeof count === "number") {
          if (count > 0) await Badge.set({ count });
          else await Badge.clear();
        }
      } catch {
        /* best-effort */
      }
    };

    // ── FCM token registration ──────────────────────────────────────────────
    const register = async (token: string) => {
      if (!token) return;
      try {
        await fetch("/api/portal/push/register-native", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, platform }),
        });
      } catch {
        /* best-effort — re-registers next launch */
      }
    };

    (async () => {
      // Keep the badge honest on launch + whenever the app comes to / leaves
      // the foreground (that's when the home-screen badge actually matters).
      void syncBadge();
      if (App) {
        listeners.push(await App.addListener("resume", () => void syncBadge()));
        listeners.push(await App.addListener("pause", () => void syncBadge()));
      }

      if (!FM) return;
      try {
        const perm = await FM.requestPermissions();
        if (perm.receive !== "granted" || cancelled) return;
        const { token } = await FM.getToken();
        if (!cancelled) await register(token);
        listeners.push(
          await FM.addListener("tokenReceived", (data) => {
            const t = (data as { token?: string })?.token;
            if (t) void register(t);
          })
        );
        listeners.push(
          await FM.addListener("notificationActionPerformed", (data) => {
            const url = (data as { notification?: { data?: { url?: string } } })
              ?.notification?.data?.url;
            if (typeof url === "string" && url.startsWith("/")) {
              window.location.assign(url);
            }
          })
        );
      } catch {
        /* plugin missing / permission flow errored — ignore */
      }
    })();

    return () => {
      cancelled = true;
      listeners.forEach((l) => l?.remove?.());
    };
  }, []);

  return null;
}
