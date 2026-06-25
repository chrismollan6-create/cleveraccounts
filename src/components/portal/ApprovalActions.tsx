"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, MessageSquare, Loader2, AlertCircle } from "lucide-react";

/**
 * Approve / query actions for a pending approval. Approve POSTs to the
 * scoped API route then refreshes the server component so the card flips to
 * its approved state. "Ask a question" deep-links to Messages.
 */
export default function ApprovalActions({
  id,
  messagesHref = "/portal/messages",
}: {
  id: string;
  messagesHref?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  async function approve() {
    setState("working");
    try {
      const res = await fetch("/api/portal/approvals/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      router.refresh();
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={approve}
        disabled={state === "working"}
        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-60"
      >
        {state === "working" ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Approving…
          </>
        ) : (
          <>
            <Check size={15} strokeWidth={2.5} /> Approve
          </>
        )}
      </button>
      <Link
        href={messagesHref}
        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-text transition hover:border-neutral-400"
      >
        <MessageSquare size={14} /> Ask a question
      </Link>
      {state === "error" && (
        <span className="inline-flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={12} /> Couldn&apos;t approve — try again
        </span>
      )}
    </div>
  );
}
