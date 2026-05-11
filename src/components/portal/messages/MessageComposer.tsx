"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import type { PortalMessage, SendMessageResult } from "@/lib/portal/types";

interface Props {
  onOptimisticInsert: (pending: PortalMessage) => void;
  onSent: (result: SendMessageResult) => void;
}

const MAX_BODY_LENGTH = 10_000;

/**
 * Compose form for new messages. Optimistic UI — adds a placeholder message
 * to the list immediately, then replaces it with the server response on
 * success (or removes it + shows error on failure).
 *
 * Plain textarea with a "** = bold" hint — markdown is rendered when
 * messages display, but we don't show a fancy editor here. Keeps composer
 * lightweight, mobile-friendly.
 */
export default function MessageComposer({ onOptimisticInsert, onSent }: Props) {
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_BODY_LENGTH - body.length;
  const tooLong = remaining < 0;
  const canSend = body.trim().length > 0 && !tooLong && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setError(null);
    setSending(true);

    // Optimistic placeholder
    const optimisticId = `pending-${Date.now()}`;
    onOptimisticInsert({
      id: optimisticId,
      caseId: "pending",
      caseSubject: subject.trim() || null,
      caseStatus: "New",
      caseClosed: false,
      fromAddress: null,
      fromName: null,
      subject: subject.trim() || null,
      bodyText: body,
      sentAt: new Date().toISOString(),
      isFromClient: true,
      isPortalAuthored: true,
    });

    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          subject: subject.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Request failed: HTTP ${res.status}`);
      }

      const result: SendMessageResult = await res.json();
      onSent(result);
      setBody("");
      setSubject("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send — please retry");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 animate-fade-in-up"
    >
      <label className="block text-sm font-semibold text-text mb-3">
        Send a message
      </label>

      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject (optional)"
        maxLength={255}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all mb-3"
        disabled={sending}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Hi Sarah, quick question about my year-end accounts..."
        rows={4}
        maxLength={MAX_BODY_LENGTH + 100} // allow a bit over for paste, validate strictly
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all resize-y min-h-[100px]"
        disabled={sending}
      />

      {error && (
        <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-text-light">
          {tooLong ? (
            <span className="text-red-600 font-medium">
              {Math.abs(remaining)} chars over limit
            </span>
          ) : remaining < 1000 ? (
            <span className="text-amber-700">{remaining} chars remaining</span>
          ) : (
            <span>
              Supports <strong>**bold**</strong>, <em>*italic*</em>,{" "}
              <code className="px-1 bg-gray-100 rounded">[link](url)</code>, lists
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!canSend}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-dark hover:shadow-md transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={16} />
              Send message
            </>
          )}
        </button>
      </div>
    </form>
  );
}
