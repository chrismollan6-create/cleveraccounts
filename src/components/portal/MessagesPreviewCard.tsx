import Link from "next/link";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import type { PortalMessage } from "@/lib/portal/types";

interface Props {
  /** Most recent messages, newest first. */
  messages: PortalMessage[];
}

/**
 * Dashboard preview card — shows the latest message at a glance with a
 * deep link into the full Messages page. Empty state encourages a first
 * conversation.
 */
export default function MessagesPreviewCard({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <Link
        href="/portal/messages"
        className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary/20 transition-all group"
      >
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MessageSquare size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text">Messages</h3>
            <p className="mt-1 text-xs text-text-light leading-relaxed">
              Start a conversation with your accountant — quick questions,
              document requests, anything at all.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:text-primary-dark">
              Open Messages
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  const latest = messages[0];
  const fromAccountant = !latest.isFromClient;
  const newCount = messages.filter((m) => !m.isFromClient).length;

  return (
    <Link
      href="/portal/messages"
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary/20 transition-all group overflow-hidden relative"
    >
      {fromAccountant && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={10} />
            New reply
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
            fromAccountant ? "bg-primary text-white" : "bg-primary/10 text-primary"
          }`}
        >
          <MessageSquare size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-text">Messages</h3>
            <span className="text-xs text-text-light/70 shrink-0">
              {formatShort(latest.sentAt)}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-text/90 truncate">
            {latest.fromName ?? (latest.isFromClient ? "You" : "Your accountant")}
            {latest.subject ? ` · ${latest.subject}` : ""}
          </p>
          <p className="mt-1 text-xs text-text-light line-clamp-2 leading-relaxed">
            {previewBody(latest.bodyText)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:text-primary-dark">
            {newCount > 1 ? `View all ${messages.length}` : "Open Messages"}
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function previewBody(md: string): string {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 120);
}

function formatShort(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
