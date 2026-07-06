import { redirect } from "next/navigation";
import { Bell, BellOff } from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import {
  listNotificationsForCurrentUser,
  markAllNotificationsRead,
} from "@/lib/portal/notifications";
import AccessGate from "@/components/portal/AccessGate";
import NotificationCard from "@/components/portal/notifications/NotificationCard";
import { isSurfaceHidden } from "@/lib/portal/features";

export const dynamic = "force-dynamic";

/**
 * Notifications inbox. Opening the page marks everything read (so the sidebar
 * bell badge clears), but the list still highlights what WAS unread on this
 * view. Action-required items are grouped up top; the rest sit under "Earlier".
 * Each card carries one contextual, type-driven action (see NotificationCard).
 */
export default async function NotificationsPage() {
  if (isSurfaceHidden("/portal/notifications")) redirect("/portal/dashboard");

  const [brand, portalUser, result] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    listNotificationsForCurrentUser(50),
  ]);

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

  // Snapshot read/unread BEFORE we clear the badge, so this render can still
  // highlight what was unread.
  const items = result.ok === true ? result.data : [];
  if (result.ok === true) {
    await markAllNotificationsRead();
  }

  const actionItems = items.filter((n) => n.actionRequired);
  const restItems = items.filter((n) => !n.actionRequired);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <Wrap>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A7A9B] to-[#155f79] text-white shadow-sm shadow-[#1A7A9B]/20">
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
          <span className="mt-1 inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[#1A7A9B]/10 px-3 py-1 text-xs font-semibold text-[#1A7A9B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A7A9B]" />
            {unreadCount} new
          </span>
        )}
      </div>

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
