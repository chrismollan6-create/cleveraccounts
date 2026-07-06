import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Bell, BellOff } from "lucide-react";
import { isNativeAppUA } from "@/lib/portal/native";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { listNotificationsForCurrentUser } from "@/lib/portal/notifications";
import AccessGate from "@/components/portal/AccessGate";
import NotificationCard from "@/components/portal/notifications/NotificationCard";
import EnableNotifications from "@/components/portal/notifications/EnableNotifications";
import { isSurfaceHidden } from "@/lib/portal/features";

export const dynamic = "force-dynamic";

/**
 * Notifications inbox. Inbox behaviour: rows stay unread (tinted, bold, "New")
 * until the client taps a card, which marks just that one read (NotificationCard
 * → markNotificationReadAction). Action-required items are grouped up top; the
 * rest sit under "Earlier". Each card carries one contextual, type-driven action.
 */
export default async function NotificationsPage() {
  if (isSurfaceHidden("/portal/notifications")) redirect("/portal/dashboard");

  const [brand, portalUser, result, hdrs] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    listNotificationsForCurrentUser(50),
    headers(),
  ]);
  // In the app, PortalShell already renders the big "Notifications" title, so
  // the in-page header would double up — drop it and let the list breathe.
  const isNativeApp = isNativeAppUA(hdrs.get("user-agent"));

  const firstName =
    portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  if (
    portalUser &&
    (portalUser.status === "disabled" || portalUser.status === "pending")
  ) {
    return (
      <Wrap>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </Wrap>
    );
  }

  // Inbox behaviour: DON'T clear everything on open — each row stays unread
  // until the client taps it (NotificationCard → markNotificationReadAction).
  const items = result.ok === true ? result.data : [];

  const actionItems = items.filter((n) => n.actionRequired);
  const restItems = items.filter((n) => !n.actionRequired);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <Wrap>
      {/* ── Header — web only; the native shell shows the big title itself ─ */}
      {!isNativeApp && (
        <div className="mb-8 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-sm shadow-primary/20">
              <Bell size={19} />
            </span>
            <div>
              <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-text">
                Notifications
              </h1>
              <p className="mt-0.5 text-sm text-text-light">
                Replies, deadlines and anything that needs you — in one place.
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="mt-1 inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {unreadCount} new
            </span>
          )}
        </div>
      )}

      <EnableNotifications />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {actionItems.length > 0 && (
            <Group
              label="Needs your attention"
              hint={`${actionItems.length} item${actionItems.length === 1 ? "" : "s"}`}
            >
              {actionItems.map((n) => (
                <NotificationCard key={n.id} n={n} />
              ))}
            </Group>
          )}
          {restItems.length > 0 && (
            <Group label={actionItems.length > 0 ? "Earlier" : "Recent"}>
              {restItems.map((n) => (
                <NotificationCard key={n.id} n={n} />
              ))}
            </Group>
          )}
        </div>
      )}
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[820px] px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function Group({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-light">
          {label}
        </h2>
        {hint && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
            {hint}
          </span>
        )}
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
        <BellOff size={24} />
      </span>
      <p className="text-base font-semibold text-text">You&apos;re all caught up</p>
      <p className="mt-1 max-w-xs text-sm text-text-light">
        We&apos;ll let you know here as soon as something needs your attention —
        a reply, an approval or an upcoming deadline.
      </p>
    </div>
  );
}
