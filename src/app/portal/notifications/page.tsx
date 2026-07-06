import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  BellOff,
  MessageSquare,
  CalendarClock,
  PenLine,
  ClipboardList,
  FileText,
  ArrowRight,
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import {
  listNotificationsForCurrentUser,
  markAllNotificationsRead,
} from "@/lib/portal/notifications";
import AccessGate from "@/components/portal/AccessGate";
import { isSurfaceHidden } from "@/lib/portal/features";
import type { PortalNotification } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Notifications inbox. Opening the page marks everything read (so the sidebar
 * bell badge clears), but the list still highlights what WAS unread on this
 * view. Action-required items are grouped up top; the rest sit under "Earlier".
 * A row only navigates when it has a real destination (a specific surface — not
 * the dashboard, which is just "home"); purely informational rows don't link.
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

const TYPE_META: Record<
  string,
  { icon: typeof Bell; tint: string; label: string; cta: string }
> = {
  message: {
    icon: MessageSquare,
    tint: "text-[#1A7A9B] bg-[#1A7A9B]/10",
    label: "Message",
    cta: "View message",
  },
  deadline: {
    icon: CalendarClock,
    tint: "text-amber-600 bg-amber-50",
    label: "Deadline",
    cta: "View deadline",
  },
  approval: {
    icon: PenLine,
    tint: "text-orange-600 bg-orange-50",
    label: "Approval",
    cta: "Review & approve",
  },
  request: {
    icon: ClipboardList,
    tint: "text-orange-600 bg-orange-50",
    label: "Request",
    cta: "View request",
  },
  document: {
    icon: FileText,
    tint: "text-violet-600 bg-violet-50",
    label: "Document",
    cta: "View document",
  },
  general: {
    icon: Bell,
    tint: "text-slate-500 bg-slate-100",
    label: "Update",
    cta: "View",
  },
};

/**
 * A row only links out when it points at a SPECIFIC surface. The dashboard is
 * "home", not a destination, so informational rows that carry `/portal/dashboard`
 * (or no href) render as plain, non-navigating cards.
 */
function destinationOf(n: PortalNotification): string | null {
  if (!n.href) return null;
  if (n.href === "/portal/dashboard" || n.href === "/portal") return null;
  return n.href;
}

function NotificationCard({ n }: { n: PortalNotification }) {
  const meta = TYPE_META[n.type] ?? TYPE_META.general;
  const Icon = meta.icon;
  const href = destinationOf(n);

  const card = (
    <div
      className={`group relative flex gap-3.5 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition ${
        href ? "cursor-pointer hover:border-[#1A7A9B]/40 hover:shadow-md" : ""
      } ${
        n.actionRequired
          ? "border-orange-200"
          : !n.read
            ? "border-[#1A7A9B]/25"
            : "border-neutral-200"
      }`}
    >
      {/* Left accent: orange for action-required, teal for unread FYIs. */}
      {(n.actionRequired || !n.read) && (
        <span
          className={`absolute inset-y-0 left-0 w-1 ${
            n.actionRequired ? "bg-orange-500" : "bg-[#1A7A9B]"
          }`}
        />
      )}

      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.tint}`}
      >
        <Icon size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[0.95rem] font-semibold leading-snug text-text">
              {n.title}
            </p>
            {!n.read && !n.actionRequired && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1A7A9B]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1A7A9B]">
                New
              </span>
            )}
            {n.actionRequired && (
              <span className="inline-flex items-center rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                Action needed
              </span>
            )}
          </div>
          <span className="flex-shrink-0 whitespace-nowrap pt-0.5 text-xs text-text-light">
            {formatRelative(n.createdAt)}
          </span>
        </div>

        {n.body && (
          <p className="mt-1 text-[0.85rem] leading-relaxed text-text-light">
            {n.body}
          </p>
        )}

        {href && (
          <span
            className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold ${
              n.actionRequired ? "text-orange-700" : "text-[#1A7A9B]"
            }`}
          >
            {meta.cta}
            <ArrowRight
              size={13}
              className="transition group-hover:translate-x-0.5"
            />
          </span>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
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

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
