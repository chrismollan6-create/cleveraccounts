"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronDown,
  ChevronUp,
  Check,
  CircleDot,
  User,
  RefreshCw,
} from "lucide-react";
import type { PortalMessage } from "@/lib/portal/types";

interface Props {
  messages: PortalMessage[];
  isRefreshing: boolean;
}

/**
 * Inbox-style list of messages. Newest first. Click a row to expand inline
 * and render the full markdown body. Closed Cases get a quiet "Resolved"
 * marker.
 */
export default function MessageList({ messages, isRefreshing }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text">Recent messages</h2>
          <p className="mt-0.5 text-xs text-text-light">
            {messages.length} {messages.length === 1 ? "message" : "messages"} ·
            updates every 10 seconds
          </p>
        </div>
        {isRefreshing && (
          <div
            className="text-text-light/60 animate-spin"
            aria-label="refreshing"
            title="Refreshing"
          >
            <RefreshCw size={14} />
          </div>
        )}
      </div>

      <ol className="divide-y divide-gray-50">
        {messages.map((msg) => (
          <MessageRow
            key={msg.id}
            message={msg}
            expanded={expandedId === msg.id}
            onToggle={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
          />
        ))}
      </ol>
    </div>
  );
}

function MessageRow({
  message,
  expanded,
  onToggle,
}: {
  message: PortalMessage;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isPending = message.id.startsWith("pending-");
  const displayName = message.isFromClient
    ? "You"
    : message.fromName ?? message.fromAddress ?? "Your accountant";

  return (
    <li className={isPending ? "opacity-60" : ""}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors group"
      >
        <div className="flex items-start gap-3">
          {/* Avatar dot */}
          <div
            className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold ${
              message.isFromClient
                ? "bg-secondary/10 text-secondary-dark"
                : "bg-primary/10 text-primary"
            }`}
          >
            {message.isFromClient ? (
              <User size={15} />
            ) : (
              initials(displayName)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-semibold text-text">
                {displayName}
              </span>
              <time className="text-xs text-text-light/80 shrink-0">
                {formatRelative(message.sentAt)}
              </time>
              {message.caseClosed && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                  <Check size={10} strokeWidth={3} />
                  Resolved
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-light">
                  <CircleDot size={10} />
                  Sending…
                </span>
              )}
            </div>
            {message.subject && (
              <p className="mt-0.5 text-sm font-medium text-text/90 truncate">
                {message.subject}
              </p>
            )}
            {!expanded && (
              <p className="mt-1 text-sm text-text-light line-clamp-1">
                {previewBody(message.bodyText)}
              </p>
            )}
          </div>

          <div className="shrink-0 text-text-light/40 group-hover:text-text-light/80 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 sm:px-6 pb-5 -mt-1">
          <div className="ml-12 prose prose-sm max-w-none text-text">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary hover:text-primary-dark underline underline-offset-2"
                  />
                ),
                code: ({ ...props }) => (
                  <code className="px-1 py-0.5 bg-gray-100 rounded text-xs" {...props} />
                ),
              }}
            >
              {message.bodyText}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </li>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function previewBody(md: string): string {
  // Strip markdown formatting for the preview line
  return md
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 140);
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
