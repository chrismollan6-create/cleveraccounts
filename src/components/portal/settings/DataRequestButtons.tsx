"use client";

import { useState, useTransition } from "react";
import { Download, Trash2, Check, Loader2 } from "lucide-react";
import {
  submitDataRequestAction,
  type DataRequestKind,
} from "@/app/portal/settings/actions";

/**
 * The two data-rights requests. Each is a single confirmed action — no modal,
 * no multi-step form — because the request itself is one sentence; the work
 * happens in the conversation that follows.
 */
export default function DataRequestButtons() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState<DataRequestKind | null>(null);
  const [busy, setBusy] = useState<DataRequestKind | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  function submit(kind: DataRequestKind) {
    setBusy(kind);
    setFailed(false);
    startTransition(async () => {
      const res = await submitDataRequestAction(kind);
      setBusy(null);
      setMessage(res.message);
      setFailed(!res.ok);
      if (res.ok) setSent(kind);
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Action
          kind="export"
          label="Request a copy of my data"
          icon={Download}
          sent={sent === "export"}
          busy={busy === "export" && pending}
          disabled={Boolean(busy)}
          onClick={submit}
        />
        <Action
          kind="erasure"
          label="Ask about erasing my data"
          icon={Trash2}
          sent={sent === "erasure"}
          busy={busy === "erasure" && pending}
          disabled={Boolean(busy)}
          onClick={submit}
        />
      </div>
      {message && (
        <p
          role="status"
          className={`mt-3 text-sm ${failed ? "text-amber-700" : "text-text-light"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

function Action({
  kind,
  label,
  icon: Icon,
  sent,
  busy,
  disabled,
  onClick,
}: {
  kind: DataRequestKind;
  label: string;
  icon: typeof Download;
  sent: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: (kind: DataRequestKind) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(kind)}
      disabled={disabled || sent}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-text transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {busy ? (
        <Loader2 size={15} className="animate-spin" />
      ) : sent ? (
        <Check size={15} className="text-emerald-600" />
      ) : (
        <Icon size={15} className="text-text-light" />
      )}
      {sent ? "Request sent" : label}
    </button>
  );
}
