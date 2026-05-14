"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, CircleDot, RefreshCw } from "lucide-react";
import type { PortalMessage, PortalAccountantInfo } from "@/lib/portal/types";

interface Props {
  messages: PortalMessage[];
  isRefreshing: boolean;
  accountant: PortalAccountantInfo | null;
}

/**
 * Chat-bubble conversation view. Renders messages in reverse-chronological
 * order with day dividers, distinct left (accountant) / right (client)
 * alignment, and inline markdown.
 *
 * Email signatures and quoted-reply tails on inbound messages are stripped
 * server-side via `cleanMessageBody` — clients see just the conversational
 * content, not the staff's "Kind regards, …" boilerplate.
 */
export default function MessageThread({ messages, isRefreshing, accountant }: Props) {
  // Group consecutive messages by day for date dividers
  const grouped = groupByDay(messages);

  return (
    <section
      aria-label="Conversation"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Conversation header */}
      <header className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gradient-to-b from-white to-surface/30">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-text">Conversation</h2>
          <span className="text-xs text-text-light/70">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        </div>
        <div className="text-xs text-text-light/60 flex items-center gap-2">
          <span className={isRefreshing ? "text-primary" : "opacity-0"}>
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
          </span>
          <span>Live · refreshes every 10s</span>
        </div>
      </header>

      <ol className="px-3 sm:px-5 py-4 space-y-4">
        {grouped.map((group) => (
          <li key={group.dayLabel}>
            {/* Day divider */}
            <div className="flex items-center justify-center my-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-text-light/60">
                {group.dayLabel}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <ul className="space-y-3">
              {group.messages.map((msg) => (
                <li key={msg.id}>
                  <Bubble message={msg} accountant={accountant} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Bubble({
  message,
  accountant,
}: {
  message: PortalMessage;
  accountant: PortalAccountantInfo | null;
}) {
  const isClient = message.isFromClient;
  const isPending = message.id.startsWith("pending-");
  const cleanBody = cleanMessageBody(message.bodyText, isClient);
  const displayName = isClient
    ? "You"
    : accountant?.name ?? message.fromName ?? "Your accountant";

  return (
    <div
      className={`flex items-end gap-2.5 ${
        isClient ? "flex-row-reverse" : "flex-row"
      } ${isPending ? "opacity-60" : ""}`}
    >
      {/* Avatar */}
      <Avatar isClient={isClient} accountant={accountant} fallback={displayName} />

      {/* Bubble + meta */}
      <div
        className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[70%] ${
          isClient ? "items-end" : "items-start"
        }`}
      >
        {/* Optional subject line on first/different subjects */}
        {message.subject &&
          message.subject !== "Portal message" &&
          !message.subject.startsWith("Portal — ") && (
            <p
              className={`text-[11px] font-medium text-text-light px-1 ${
                isClient ? "text-right" : "text-left"
              }`}
            >
              {message.subject}
            </p>
          )}

        <div
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isClient
              ? "bg-primary text-white rounded-br-sm"
              : "bg-gray-50 text-text rounded-bl-sm border border-gray-100"
          }`}
        >
          <div
            className={`prose prose-sm max-w-none ${
              isClient
                ? "prose-invert prose-a:text-white prose-a:underline prose-strong:text-white"
                : "prose-a:text-primary prose-a:underline-offset-2"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, ...props }) => (
                  <a
                    {...props}
                    href={safeLinkHref(href)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  />
                ),
                code: ({ ...props }) => (
                  <code
                    className={`px-1 py-0.5 rounded text-xs ${
                      isClient ? "bg-white/15" : "bg-gray-100"
                    }`}
                    {...props}
                  />
                ),
                p: ({ ...props }) => <p className="my-0" {...props} />,
              }}
            >
              {cleanBody}
            </ReactMarkdown>
          </div>
        </div>

        {/* Meta row */}
        <div
          className={`flex items-center gap-1.5 px-1 text-[11px] text-text-light/70 ${
            isClient ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="font-medium">{displayName}</span>
          <span>·</span>
          <time>{formatRelative(message.sentAt)}</time>
          {message.caseClosed && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-600">
                <Check size={10} strokeWidth={3} />
                Resolved
              </span>
            </>
          )}
          {isPending && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5 text-text-light">
                <CircleDot size={10} />
                Sending…
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({
  isClient,
  accountant,
  fallback,
}: {
  isClient: boolean;
  accountant: PortalAccountantInfo | null;
  fallback: string;
}) {
  if (isClient) {
    return (
      <div className="h-9 w-9 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm">
        {initials(fallback)}
      </div>
    );
  }

  if (accountant?.photoUrl) {
    return (
      <Image
        src={accountant.photoUrl}
        alt={accountant.name ?? "Accountant"}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm object-cover bg-gray-100 shrink-0"
        unoptimized
      />
    );
  }

  return (
    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-light to-primary-dark text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm">
      {initials(fallback)}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

interface DayGroup {
  dayLabel: string;
  messages: PortalMessage[];
}

function groupByDay(messages: PortalMessage[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const m of messages) {
    const label = dayLabel(m.sentAt);
    const last = groups[groups.length - 1];
    if (last && last.dayLabel === label) {
      last.messages.push(m);
    } else {
      groups.push({ dayLabel: label, messages: [m] });
    }
  }
  return groups;
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Earlier";
  const now = new Date();
  const ymdMatch =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (ymdMatch) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  ) {
    return "Yesterday";
  }

  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return d.toLocaleDateString("en-GB", { weekday: "long" });
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: d.getFullYear() === now.getFullYear() ? undefined : "numeric" });
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Whitelist of URL schemes safe to render in chat-message links.
 *
 * Threat: a compromised staff account could send `[click](javascript:…)` and
 * render an XSS payload as a real link. React itself blocks `javascript:`
 * in href and warns at runtime, but other schemes (`data:`, `vbscript:`,
 * weird unicode variants of `javascript`) slip through and a future React
 * upgrade could relax that behaviour. Defence-in-depth: validate scheme
 * before render.
 *
 * Permitted: http(s), mailto, tel, in-document fragments (#…), relative paths.
 * Everything else (including bare `javascript:` and `data:` URIs) collapses
 * to "#" so the link is harmless if clicked.
 */
function safeLinkHref(href: string | undefined): string {
  if (!href) return "#";
  const trimmed = href.trim();
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed;
  // Reject anything with an unusual scheme — only allow our explicit list.
  // Regex anchored to the start so leading whitespace / control chars can't
  // bypass it. Comparison is case-insensitive (`JAVASCRIPT:` is also unsafe).
  if (/^(https?|mailto|tel):/i.test(trimmed)) return trimmed;
  return "#";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Strip common email-signature patterns from inbound messages so portal
 * clients see the conversational content rather than staff sign-offs.
 *
 * - Multi-line sign-offs: "Kind regards", "Best", "Thanks", "Yours sincerely"
 * - Standard `--` signature delimiter
 * - Quoted-reply tails: lines starting with `>` or "On … wrote:" history
 * - Company footers / disclaimers after the sign-off (caught by above)
 *
 * Client-authored messages are returned unchanged.
 */
function cleanMessageBody(body: string, isFromClient: boolean): string {
  if (isFromClient || !body) return body ?? "";

  let s = body;

  // 1. Cut quoted-reply tail at "On <date>, <name> wrote:" or "From: …" headers
  const replyHeaderMatch =
    s.match(/^On .+ wrote:\s*$/im) || s.match(/^From:.+$/im) || s.match(/^_+ Original Message _+$/im);
  if (replyHeaderMatch?.index !== undefined) {
    s = s.substring(0, replyHeaderMatch.index).trim();
  }

  // 2. Cut at standard signature delimiter `-- ` (with trailing space) or `--`
  const sigDelim = s.match(/\n--\s*\n/);
  if (sigDelim?.index !== undefined) {
    s = s.substring(0, sigDelim.index).trim();
  }

  // 3. Cut at sign-off phrases at start of a line (most common)
  const signOffs = [
    /^(kind regards?|best regards?|best wishes|warm regards?|many thanks|thanks(?:\s+again)?|cheers|yours sincerely|yours faithfully|regards|all the best)[,!.]?\s*$/im,
  ];
  for (const pattern of signOffs) {
    const m = s.match(pattern);
    if (m?.index !== undefined) {
      s = s.substring(0, m.index).trim();
      break;
    }
  }

  // 4. Catch inline "Kind regards Chris Mollan ..." (no newline) — anything
  //    after the sign-off phrase + a name + 1-2 lines is signature.
  const inlineSig = s.match(/\b(kind regards?|best regards?|cheers|thanks|regards|yours sincerely)[,]?\s+[A-Z][a-z]+/i);
  if (inlineSig?.index !== undefined) {
    s = s.substring(0, inlineSig.index).trim();
  }

  // 5. Strip Salesforce/Outlook tracking marker that sometimes appears
  s = s.replace(/^ref:[A-Za-z0-9:_-]+:ref$/gm, "");

  // 6. Final trim
  return s.trim();
}
