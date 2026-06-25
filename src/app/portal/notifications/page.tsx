import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  MessageSquare,
  CalendarClock,
  PenLine,
  ClipboardList,
  FileText,
  ChevronRight,
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
 * view. Each row deep-links into the relevant surface.
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

  // Clear the unread badge now that the inbox is open. The list above already
  // captured the read/unread state for this render.
  if (result.ok === true) {
    await markAllNotificationsRead();
  }

  // Float "action needed" items to the top (stable — keeps date order within
  // each group), so the things the client must DO never get buried under FYIs.
  const items =
    result.ok === true
      ? [...result.data].sort(
          (a, b) => Number(b.actionRequired) - Number(a.actionRequired)
        )
      : [];
  const actionCount = items.filter((n) => n.actionRequired).length;

  return (
    <Wrap>
      <div className="mb-7 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
            <Bell size={18} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Notifications
            </h1>
            <p className="text-sm text-text-light">
              Replies, deadlines and anything that needs you — in one place.
            </p>
          </div>
        </div>
        {actionCount > 0 && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            {actionCount} need{actionCount === 1 ? "s" : ""} action
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-text-light shadow-sm">
          You&apos;re all caught up. We&apos;ll let you know when something needs
          your attention.
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <ul className="divide-y divide-neutral-100">
            {items.map((n) => (
              <NotificationRow key={n.id} n={n} />
            ))}
          </ul>
        </section>
      )}
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-4 py-6 sm:px-6 lg:px-8 max-w-[1100px]">
      {children}
    </div>
  );
}

const TYPE_META: Record<
  string,
  { icon: typeof Bell; tint: string }
> = {
  message: { icon: MessageSquare, tint: "text-[#1A7A9B] bg-[#1A7A9B]/10" },
  deadline: { icon: CalendarClock, tint: "text-orange-600 bg-orange-50" },
  approval: { icon: PenLine, tint: "text-orange-600 bg-orange-50" },
  request: { icon: ClipboardList, tint: "text-orange-600 bg-orange-50" },
  document: { icon: FileText, tint: "text-violet-600 bg-violet-50" },
  general: { icon: Bell, tint: "text-text-light bg-neutral-100" },
};

function NotificationRow({ n }: { n: PortalNotification }) {
  const meta = TYPE_META[n.type] ?? TYPE_META.general;
  const Icon = meta.icon;

  const inner = (
    <div
      className={`group relative flex items-start gap-3 py-4 pl-6 pr-5 transition ${
        n.href ? "hover:bg-neutral-50" : ""
      } ${
        n.actionRequired
          ? "bg-orange-50/60"
          : !n.read
            ? "bg-orange-50/20"
            : ""
      }`}
    >
      {/* Action-required items get a bold left accent so they read as "do this". */}
      {n.actionRequired && (
        <span className="absolute inset-y-0 left-0 w-1 bg-orange-500" />
      )}
      <span
        className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${meta.tint}`}
      >
        <Icon size={15} />
        {!n.read && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <p
              className={`truncate text-sm ${
                n.read && !n.actionRequired
                  ? "font-medium text-text"
                  : "font-semibold text-text"
              }`}
            >
              {n.title}
            </p>
            {n.actionRequired && (
              <span className="flex-shrink-0 rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                Action needed
              </span>
            )}
          </div>
          <span className="flex-shrink-0 text-xs text-text-light">
            {formatRelative(n.createdAt)}
          </span>
        </div>
        {n.body && (
          <p className="mt-0.5 text-xs leading-relaxed text-text-light">
            {n.body}
          </p>
        )}
        {n.actionRequired && n.href && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
            Review &amp; approve
            <ChevronRight size={12} className="transition group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
      {n.href && !n.actionRequired && (
        <ChevronRight
          size={15}
          className="mt-0.5 flex-shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600"
        />
      )}
    </div>
  );

  return n.href ? (
    <li>
      <Link href={n.href}>{inner}</Link>
    </li>
  ) : (
    <li>{inner}</li>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
