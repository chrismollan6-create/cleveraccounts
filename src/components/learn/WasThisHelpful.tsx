"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, AlertCircle, Loader2 } from "lucide-react";

type Status = "idle" | "showing-followup" | "submitting" | "thanks" | "error";

/**
 * "Was this helpful?" widget. Two-step:
 *   1. User clicks 👍 or 👎 → fires the vote immediately
 *   2. After voting, an optional comment box appears for ~30s
 *   3. Comment submit creates a second feedback entry (with the same vote +
 *      a comment) — we keep these as separate records so the first vote
 *      counts even if the user navigates away before typing
 *
 * Storage in sessionStorage prevents double-voting on the same article in
 * the same session — not a hard rate limit, just a UX nicety.
 */
export default function WasThisHelpful({ articleId }: { articleId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [vote, setVote] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sessionKey = `learn-feedback-${articleId}`;

  async function send(helpful: boolean, commentText?: string) {
    try {
      const res = await fetch("/api/learn-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, helpful, comment: commentText }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return false;
    }
  }

  async function vote_(helpful: boolean) {
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      setStatus("thanks");
      return;
    }
    setVote(helpful);
    setStatus("submitting");
    const ok = await send(helpful);
    if (ok) {
      try { sessionStorage.setItem(sessionKey, "1"); } catch {}
      setStatus("showing-followup");
    } else {
      setStatus("error");
    }
  }

  async function submitComment() {
    if (!comment.trim()) {
      setStatus("thanks");
      return;
    }
    setStatus("submitting");
    if (vote === null) {
      setStatus("thanks");
      return;
    }
    const ok = await send(vote, comment.trim());
    setStatus(ok ? "thanks" : "error");
  }

  if (status === "thanks") {
    return (
      <div className="my-10 bg-green-500/5 border border-green-500/20 rounded-2xl p-5 text-center">
        <Check className="mx-auto text-green-600 mb-2" size={24} />
        <p className="font-semibold text-dark">Thanks for the feedback.</p>
        <p className="text-sm text-text-light mt-1">It helps us prioritise what to improve next.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="my-10 bg-red-500/5 border border-red-500/20 rounded-2xl p-5 text-center">
        <AlertCircle className="mx-auto text-red-600 mb-2" size={24} />
        <p className="font-semibold text-dark">Couldn&apos;t save that — sorry.</p>
        <p className="text-sm text-text-light mt-1">{error || "Please try again in a moment."}</p>
      </div>
    );
  }

  if (status === "showing-followup") {
    return (
      <div className="my-10 bg-surface/60 border border-border rounded-2xl p-5">
        <p className="font-semibold text-dark mb-2">
          Thanks. {vote ? "What did we get right?" : "What was missing or wrong?"}
        </p>
        <p className="text-sm text-text-light mb-3">Optional — but really useful for tightening this article.</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Type your feedback here…"
          className="w-full bg-white border border-border rounded-xl p-3 text-sm text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            type="button"
            onClick={() => setStatus("thanks")}
            className="text-sm text-text-light hover:text-dark px-3 py-2"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={submitComment}
            disabled={!comment.trim()}
            className="text-sm font-semibold bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 bg-surface/60 border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="font-semibold text-dark">Was this article helpful?</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => vote_(true)}
          disabled={status === "submitting"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          {status === "submitting" && vote === true ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ThumbsUp size={16} />
          )}
          <span className="text-sm font-medium">Yes</span>
        </button>
        <button
          type="button"
          onClick={() => vote_(false)}
          disabled={status === "submitting"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          {status === "submitting" && vote === false ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ThumbsDown size={16} />
          )}
          <span className="text-sm font-medium">No</span>
        </button>
      </div>
    </div>
  );
}
