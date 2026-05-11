"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import type { PortalMessage, PortalEngagementLetter, SendMessageResult } from "@/lib/portal/types";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import EngagementLetterInline from "./EngagementLetterInline";
import MessagesEmptyState from "./MessagesEmptyState";

interface Props {
  initialMessages: PortalMessage[];
  initialEngagementLetter: PortalEngagementLetter | null;
  currentUserFirstName: string;
  brandName: string;
}

/**
 * Top-level Messages page client component.
 *
 * Owns:
 *   - SWR polling for the messages list (10s when tab visible, paused
 *     when hidden via the Page Visibility API)
 *   - Optimistic insert when the user sends a new message
 *   - Coordinating Composer + List + EL card
 *
 * Hydrated from server-fetched `initialMessages` so the first paint is
 * instant; SWR takes over from the first poll.
 */
export default function MessagesView({
  initialMessages,
  initialEngagementLetter,
  currentUserFirstName,
  brandName,
}: Props) {
  const [tabVisible, setTabVisible] = useState(true);
  const [optimisticPending, setOptimisticPending] = useState<PortalMessage[]>([]);

  // Track tab visibility so we don't poll in background tabs
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

  // Drop any optimistic message that's now confirmed in the real list
  useEffect(() => {
    if (!data) return;
    setOptimisticPending((pending) =>
      pending.filter(
        (p) => !data.some((m) => m.id === p.id || (m.bodyText === p.bodyText && m.isFromClient))
      )
    );
  }, [data]);

  // Merge optimistic + real, dedupe by id, newest first
  const allMessages = mergeAndDedupe(data ?? [], optimisticPending);

  const onSent = useCallback(
    (result: SendMessageResult) => {
      // Replace optimistic placeholder with the real returned message,
      // then trigger a revalidate so other clients/devices see it too.
      setOptimisticPending([]);
      mutate(
        (current) => {
          const next = [result.message, ...(current ?? [])];
          // Dedupe by id (in case revalidate already raced ahead)
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

  const showEmpty = allMessages.length === 0 && !initialEngagementLetter;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column: Composer + Messages list */}
      <div className="lg:col-span-2 space-y-6">
        <MessageComposer
          onOptimisticInsert={onOptimisticInsert}
          onSent={onSent}
        />

        {initialEngagementLetter && (
          <EngagementLetterInline letter={initialEngagementLetter} />
        )}

        {showEmpty ? (
          <MessagesEmptyState firstName={currentUserFirstName} brandName={brandName} />
        ) : (
          <MessageList
            messages={allMessages}
            isRefreshing={isValidating}
          />
        )}
      </div>

      {/* Right column: helper / context */}
      <div className="space-y-4">
        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
            How this works
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-text-light">
            <li className="flex gap-2">
              <span className="text-primary font-bold">·</span>
              <span>
                Send your accountant a message — it lands in their Salesforce
                queue as a Case.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">·</span>
              <span>
                Replies arrive here within a few seconds — keep this tab open
                and you&apos;ll see them appear.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">·</span>
              <span>
                For urgent matters, give us a call — the number is in your
                portal footer.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">·</span>
              <span>
                You can use simple <strong>**markdown**</strong>: bold,{" "}
                <em>*italic*</em>, [links](url), and dash-prefixed lists.
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
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
  // Newest first
  return out.sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}
