"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, BellOff, Loader2 } from "lucide-react";

/**
 * "Turn on notifications" control — registers the service worker, requests
 * permission, subscribes to Web Push, and stores the subscription server-side.
 * Renders nothing when push isn't supported or VAPID isn't configured.
 */

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalised = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalised);
  // Back with an explicit ArrayBuffer so the type is Uint8Array<ArrayBuffer>,
  // which applicationServerKey (BufferSource) requires.
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type State = "loading" | "unsupported" | "default" | "granted" | "denied";

export default function EnableNotifications() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (
      !VAPID_PUBLIC ||
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    if (Notification.permission === "granted") {
      // Confirm we actually hold a live subscription.
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => reg?.pushManager.getSubscription())
        .then((sub) => setState(sub ? "granted" : "default"))
        .catch(() => setState("default"));
      return;
    }
    setState("default");
  }, []);

  async function enable() {
    if (!VAPID_PUBLIC) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "denied" : "default");
        return;
      }
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
        }));
      const res = await fetch("/api/portal/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setState(res.ok ? "granted" : "default");
    } catch {
      setState("default");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/portal/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("default");
    } catch {
      /* leave state as-is */
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading" || state === "unsupported") return null;

  if (state === "granted") {
    return (
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2.5 text-sm text-text">
          <BellRing size={16} className="text-primary" />
          <span>Push notifications are on for this device.</span>
        </div>
        <button
          type="button"
          onClick={disable}
          disabled={busy}
          className="text-xs font-semibold text-text-light hover:text-text disabled:opacity-50"
        >
          Turn off
        </button>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-text-light">
        <BellOff size={16} className="flex-shrink-0" />
        <span>
          Notifications are blocked for this site. Enable them in your browser&apos;s
          site settings to get alerts.
        </span>
      </div>
    );
  }

  // default — offer to enable
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <Bell size={17} className="mt-0.5 flex-shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-text">Get notified instantly</p>
          <p className="text-xs text-text-light">
            Turn on push to hear about replies, approvals and deadlines even when
            the portal is closed.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={enable}
        disabled={busy}
        className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} />}
        Turn on notifications
      </button>
    </div>
  );
}
