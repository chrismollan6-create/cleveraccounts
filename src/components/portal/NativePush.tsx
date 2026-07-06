"use client";

import { useEffect } from "react";

/**
 * Native push registration — runs only inside the Capacitor app.
 *
 * Reaches the @capacitor-firebase/messaging plugin through the injected
 * `window.Capacitor.Plugins.FirebaseMessaging` global (same approach as the
 * tab-bar haptics) so the web bundle never has to import the Capacitor package.
 * On launch it asks permission, grabs the FCM token, registers it with the
 * portal (/api/portal/push/register-native), re-registers on token rotation,
 * and deep-links notification taps to the stored url.
 */

interface PluginListener {
  remove?: () => void;
}
interface FirebaseMessagingPlugin {
  requestPermissions: () => Promise<{ receive: string }>;
  getToken: () => Promise<{ token: string }>;
  addListener: (
    event: string,
    cb: (data: unknown) => void
  ) => Promise<PluginListener>;
}
interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: { FirebaseMessaging?: FirebaseMessagingPlugin };
}

export default function NativePush() {
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    const FM = cap.Plugins?.FirebaseMessaging;
    if (!FM) return;
    const platform = cap.getPlatform?.() === "android" ? "android" : "ios";

    const register = async (token: string) => {
      if (!token) return;
      try {
        await fetch("/api/portal/push/register-native", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, platform }),
        });
      } catch {
        /* best-effort — the app re-registers next launch */
      }
    };

    let tokenListener: PluginListener | undefined;
    let tapListener: PluginListener | undefined;
    let cancelled = false;

    (async () => {
      try {
        const perm = await FM.requestPermissions();
        if (perm.receive !== "granted" || cancelled) return;

        const { token } = await FM.getToken();
        if (!cancelled) await register(token);

        tokenListener = await FM.addListener("tokenReceived", (data) => {
          const t = (data as { token?: string })?.token;
          if (t) void register(t);
        });

        tapListener = await FM.addListener("notificationActionPerformed", (data) => {
          const url = (data as { notification?: { data?: { url?: string } } })
            ?.notification?.data?.url;
          if (typeof url === "string" && url.startsWith("/")) {
            window.location.assign(url);
          }
        });
      } catch {
        /* plugin missing / permission flow errored — ignore */
      }
    })();

    return () => {
      cancelled = true;
      tokenListener?.remove?.();
      tapListener?.remove?.();
    };
  }, []);

  return null;
}
