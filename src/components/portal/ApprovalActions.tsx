"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, MessageSquare, Loader2, AlertCircle } from "lucide-react";

/**
 * Approve / query actions for a pending approval. Approve is a two-step
 * confirm — the first click reveals a "Confirm approval" panel restating
 * exactly what's being signed off, because approving files a statutory return
 * (VAT / SA / accounts) and shouldn't be a one-tap, accidental action. The
 * confirm POSTs to the scoped API route then refreshes the server component so
 * the card flips to its approved state. "Ask a question" deep-links to Messages.
 */
export default function ApprovalActions({
  id,
  title,
  amountLabel,
  messagesHref = "/portal/messages",
}: {
  id: string;
  title?: string;
  amountLabel?: string | null;
  messagesHref?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "confirm" | "working" | "error">(
    "idle"
  );

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

  // Confirmation panel — restates what's being approved before the write.
  if (state === "confirm" || state === "working") {
    return (
      <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50/60 p-3.5">
        <p className="text-sm text-text">
          Approve{" "}
          <span className="font-semibold">{title ?? "this item"}</span>
          {amountLabel ? (
            <>
              {" "}
              (<span className="font-semibold">{amountLabel}</span>)
            </>
          ) : null}
          ? Once you approve, we&apos;ll file it on your behalf — this can&apos;t
          be undone here.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
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
                <Check size={15} strokeWidth={2.5} /> Yes, approve
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setState("idle")}
            disabled={state === "working"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-text transition hover:border-neutral-400 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={() => setState("confirm")}
        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
      >
        <Check size={15} strokeWidth={2.5} /> Approve
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
