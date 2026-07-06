/* Portal web-push service worker.
 * Shows a notification on `push` and deep-links into the portal on click.
 * Kept dependency-free and framework-agnostic so it works under any host. */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_e) {
    data = { title: "Clever Accounts", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Clever Accounts";
  const options = {
    body: data.body || "",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    tag: data.tag || undefined,
    renotify: !!data.tag,
    data: { url: data.url || "/portal/notifications" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/portal/notifications";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        // Focus an existing portal tab and navigate it, else open a new one.
        for (const w of wins) {
          if (w.url && w.url.indexOf("/portal") !== -1 && "focus" in w) {
            w.navigate(target);
            return w.focus();
          }
        }
        return self.clients.openWindow(target);
      })
  );
});

// Activate immediately on update so a new SW controls existing tabs.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
