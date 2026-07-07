"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markNotificationReadAction } from "@/app/portal/notifications/actions";
import {
  Bell,
  MessageSquare,
  CalendarClock,
  PenLine,
  ClipboardList,
  FileText,
  Reply,
  Upload,
  Building2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import type { PortalNotification } from "@/lib/portal/types";

/**
 * A single notification card. Client component so the body can expand for long
 * messages. Each card surfaces ONE contextual, type-driven action (Reply,
 * Upload, View…) rather than making the whole row a blanket link — so an
 * informational notification just informs, and an actionable one has an obvious
 * button. The action target respects a specific stored href, falling back to the
 * type's home surface; purely informational rows (general with no real
 * destination) get no button.
 */

const TYPE_META: Record<
  string,
  { icon: typeof Bell; tint: string }
> = {
  message: { icon: MessageSquare, tint: "text-primary bg-primary/10" },
  deadline: { icon: CalendarClock, tint: "text-amber-600 bg-amber-50" },
  approval: { icon: PenLine, tint: "text-orange-600 bg-orange-50" },
  request: { icon: ClipboardList, tint: "text-orange-600 bg-orange-50" },
  document: { icon: FileText, tint: "text-violet-600 bg-violet-50" },
  general: { icon: Bell, tint: "text-slate-500 bg-slate-100" },
};

/** A row links out only to a SPECIFIC surface — the dashboard is "home", not a destination. */
function destinationOf(n: PortalNotification): string | null {
  if (!n.href) return null;
  if (n.href === "/portal/dashboard" || n.href === "/portal") return null;
  return n.href;
}

type Action = { label: string; href: string; icon: typeof Bell };

/** The one contextual action for a notification, by type (href respects a specific stored target). */
function actionFor(n: PortalNotification): Action | null {
  const dest = destinationOf(n);
  switch (n.type) {
    case "message":
      return { label: "Reply", href: dest ?? "/portal/messages", icon: Reply };
    case "deadline":
      return { label: "View deadline", href: dest ?? "/portal/deadlines", icon: CalendarClock };
    case "approval":
      return { label: "Review & approve", href: dest ?? "/portal/approvals", icon: PenLine };
    case "request":
      return { label: "Send document", href: dest ?? "/portal/documents", icon: Upload };
    case "document":
      return { label: "Upload document", href: dest ?? "/portal/documents", icon: Upload };
    case "general":
    default:
      if (!dest) return null;
      if (dest.startsWith("/portal/details"))
        return { label: "View company details", href: dest, icon: Building2 };
      return { label: "View", href: dest, icon: ArrowRight };
  }
}

export default function NotificationCard({ n }: { n: PortalNotification }) {
  const [expanded, setExpanded] = useState(false);
  const [read, setRead] = useState(n.read);
  const [, startTransition] = useTransition();
  const meta = TYPE_META[n.type] ?? TYPE_META.general;
  const Icon = meta.icon;
  const action = actionFor(n);
  const showUnread = !read;
  // Inbox rows are collapsed by default (title + one-line preview); tapping
  // opens the full message + its action. Expandable when there's a body or an
  // action to reveal.
  const expandable = Boolean(n.body) || Boolean(action);

  // Inbox behaviour: tapping the card reads it (optimistic) and opens the body.
  function markRead() {
    if (read) return;
    setRead(true);
    startTransition(() => {
      markNotificationReadAction(n.id).catch(() => {
        // Row stays unread server-side; nothing to undo visually mid-session.
      });
    });
  }

  function onOpen() {
    markRead();
    if (expandable) setExpanded((v) => !v);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expandable ? expanded : undefined}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group relative flex cursor-pointer gap-3.5 overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        n.actionRequired
          ? "border-orange-200 bg-orange-50/50"
          : showUnread
            ? "border-emerald-200 bg-white shadow-md shadow-emerald-500/10"
            : "border-neutral-200 bg-white"
      }`}
    >
      {(n.actionRequired || showUnread) && (
        <span
          className={`absolute inset-y-0 left-0 w-1 ${
            n.actionRequired ? "bg-orange-500" : "bg-emerald-500"
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
            <p
              className={`text-[0.95rem] leading-snug text-text ${
                showUnread ? "font-bold" : "font-semibold"
              }`}
            >
              {n.title}
            </p>
            {showUnread && !n.actionRequired && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                New
              </span>
            )}
            {n.actionRequired && (
              <span className="inline-flex items-center rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                Action needed
              </span>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 pt-0.5">
            <span className="whitespace-nowrap text-xs text-text-light">
              {formatRelative(n.createdAt)}
            </span>
            {showUnread && (
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" aria-label="Unread" />
            )}
            {expandable && (
              <ChevronDown
                size={15}
                className={`text-text-light/50 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </div>

        {n.body && (
          <p
            className={`mt-1 text-[0.85rem] leading-relaxed text-text-light ${
              expanded ? "" : "line-clamp-1"
            }`}
          >
            {n.body}
          </p>
        )}

        {expanded && action && (
          <div className="mt-3">
            <Link
              href={action.href}
              onClick={(e) => {
                e.stopPropagation();
                markRead();
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                n.actionRequired
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "border border-primary/30 text-primary hover:bg-primary/5"
              }`}
            >
              <action.icon size={13} />
              {action.label}
            </Link>
          </div>
        )}
      </div>
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
