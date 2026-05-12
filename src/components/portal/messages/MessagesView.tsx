"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { MessageSquare, Sparkles } from "lucide-react";
import type {
  PortalMessage,
  PortalEngagementLetter,
  SendMessageResult,
  PortalAccountantInfo,
} from "@/lib/portal/types";
import MessageComposer from "./MessageComposer";
import MessageThread from "./MessageThread";
import EngagementLetterInline from "./EngagementLetterInline";
import MessagesEmptyState from "./MessagesEmptyState";
import MessagesSidePanel from "./MessagesSidePanel";

interface Props {
  initialMessages: PortalMessage[];
  initialEngagementLetter: PortalEngagementLetter | null;
  accountant: PortalAccountantInfo | null;
  currentUserFirstName: string;
  brandName: string;
}

/**
 * Top-level Messages page client view.
 *
 * Layout: two-column (composer + conversation | accountant sidebar).
 * Conversation is rendered chat-style: accountant left, client right.
 * SWR polls /api/portal/messages every 10s when the tab is visible.
 */
export default function MessagesView({
  initialMessages,
  initialEngagementLetter,
  accountant,
  currentUserFirstName,
  brandName,
}: Props) {
  const [tabVisible, setTabVisible] = useState(true);
  const [optimisticPending, setOptimisticPending] = useState<PortalMessage[]>([]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    setTabVisible(!document.hidden);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const { data, mutate, isValidating } = useSWR<PortalMessage[]>(
    "/api/portal/messages",
    fetcher,
    {
      fallbackData: initialMessages,
      refreshInterval: tabVisible ? 10_000 : 0,
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    }
  );

  useEffect(() => {
    if (!data) return;
    setOptimisticPending((pending) =>
      pending.filter(
        (p) => !data.some((m) => m.id === p.id || (m.bodyText === p.bodyText && m.isFromClient))
      )
    );
  }, [data]);

  const allMessages = mergeAndDedupe(data ?? [], optimisticPending);

  const onSent = useCallback(
    (result: SendMessageResult) => {
      setOptimisticPending([]);
      mutate(
        (current) => {
          const next = [result.message, ...(current ?? [])];
          const seen = new Set<string>();
          return next.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
        },
        { revalidate: true }
      );
    },
    [mutate]
  );

  const onOptimisticInsert = useCallback((pending: PortalMessage) => {
    setOptimisticPending((prev) => [pending, ...prev]);
  }, []);

  // Only the unsigned-EL card renders in the main column now; a signed EL
  // lives in the sidebar. So "empty" = no messages AND no unsigned EL to act on.
  const hasUnsignedEl =
    initialEngagementLetter && initialEngagementLetter.status !== "Signed";
  const showEmpty = allMessages.length === 0 && !hasUnsignedEl;
  const accountantFirstName = accountant?.name?.split(" ")?.[0] ?? null;

  return (
    <>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageSquare size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Messages
            </h1>
            <p className="text-sm text-text-light">
              {accountantFirstName
                ? `Your direct line to ${accountantFirstName} at ${brandName}.`
                : `Your direct line to your accountant at ${brandName}.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Composer + Conversation */}
        <div className="lg:col-span-2 space-y-6">
          <MessageComposer
            accountantFirstName={accountantFirstName}
            onOptimisticInsert={onOptimisticInsert}
            onSent={onSent}
          />

          {initialEngagementLetter && (
            <EngagementLetterInline letter={initialEngagementLetter} />
          )}

          {showEmpty ? (
            <MessagesEmptyState
              firstName={currentUserFirstName}
              brandName={brandName}
              accountantFirstName={accountantFirstName}
            />
          ) : (
            <MessageThread
              messages={allMessages}
              isRefreshing={isValidating}
              accountant={accountant}
            />
          )}
        </div>

        {/* Right column: Accountant + tips */}
        <div className="lg:col-span-1">
          <MessagesSidePanel
            accountant={accountant}
            brandName={brandName}
            engagementLetter={initialEngagementLetter}
          />
        </div>
      </div>

      {/* Status announcer for assistive tech */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {isValidating ? "Checking for new messages…" : null}
      </div>

      {/* Subtle real-time indicator (top-right floating, only when polling fires) */}
      {isValidating && (
        <div className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs text-text-light animate-fade-in">
          <Sparkles size={12} className="text-primary animate-pulse" />
          Checking for new messages…
        </div>
      )}
    </>
  );
}

async function fetcher(url: string): Promise<PortalMessage[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function mergeAndDedupe(
  real: PortalMessage[],
  optimistic: PortalMessage[]
): PortalMessage[] {
  const seen = new Set<string>();
  const out: PortalMessage[] = [];
  for (const m of [...optimistic, ...real]) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
  }
  return out.sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}
