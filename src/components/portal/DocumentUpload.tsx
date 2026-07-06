"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Upload,
  Paperclip,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

/**
 * Client → us document upload. Two-step so bytes go straight to Supabase
 * Storage (no serverless body-size limit):
 *   1. POST /api/portal/documents/upload  → signed slots
 *   2. upload each file to its signed URL
 *   3. POST /api/portal/documents/upload/complete → history + SF push
 */

const MAX_FILES = 10;
const MAX_FILE_MB = 25;
const ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,.gif,.heic,.heif,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.odt,.ods";

let sbClient: ReturnType<typeof createClient> | null = null;
function supa() {
  if (!sbClient) {
    sbClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return sbClient;
}

type Phase = "idle" | "working" | "done" | "error";

interface Slot {
  fileId: string;
  fileName: string;
  path: string;
  token: string;
  signedUrl: string;
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(kb / 1024 < 10 ? 1 : 0)} MB`;
}

export default function DocumentUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);

  function addFiles(incoming: FileList | File[]) {
    setError(null);
    const next = [...files];
    for (const f of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        setError(`You can send up to ${MAX_FILES} files at once.`);
        break;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`"${f.name}" is over the ${MAX_FILE_MB} MB limit.`);
        continue;
      }
      // De-dupe on name+size so a double-pick doesn't add twice.
      if (next.some((n) => n.name === f.name && n.size === f.size)) continue;
      next.push(f);
    }
    setFiles(next);
  }

  function removeFile(i: number) {
    setFiles(files.filter((_, idx) => idx !== i));
  }

  async function submit() {
    if (files.length === 0) {
      setError("Add at least one file to send.");
      return;
    }
    setPhase("working");
    setError(null);
    setProgress({ done: 0, total: files.length });

    try {
      // 1. register → signed slots
      const regRes = await fetch("/api/portal/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: note.trim() || null,
          files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
        }),
      });
      if (!regRes.ok) {
        const body = await regRes.json().catch(() => ({}));
        setError(body.message ?? "Couldn't start the upload — please try again.");
        setPhase("error");
        return;
      }
      const { uploadId, slots } = (await regRes.json()) as {
        uploadId: string;
        slots: Slot[];
      };

      // 2. upload each file straight to Storage via its signed URL
      const sb = supa();
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const file = files[i];
        const { error: upErr } = await sb.storage
          .from("portal-uploads")
          .uploadToSignedUrl(slot.path, slot.token, file, {
            contentType: file.type || undefined,
          });
        if (upErr) {
          setError(`Upload failed on "${file.name}". Please try again.`);
          setPhase("error");
          return;
        }
        setProgress({ done: i + 1, total: slots.length });
      }

      // 3. complete → SF push + history
      const doneRes = await fetch("/api/portal/documents/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId }),
      });
      if (!doneRes.ok) {
        const body = await doneRes.json().catch(() => ({}));
        setError(body.message ?? "Uploaded, but we couldn't finish — please refresh.");
        setPhase("error");
        return;
      }

      setPhase("done");
      setFiles([]);
      setNote("");
      // Refresh the server component so the new batch appears in the history.
      router.refresh();
      // Reset the success flash after a moment.
      setTimeout(() => setPhase("idle"), 4000);
    } catch {
      setError("Something went wrong — please try again.");
      setPhase("error");
    }
  }

  const busy = phase === "working";

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center gap-2.5 border-b border-neutral-100 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
          <Upload size={15} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-text">Send us a document</h2>
          <p className="text-xs text-text-light">
            Upload one or more files and tell us what they are.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
            dragging
              ? "border-orange-400 bg-orange-50/60"
              : "border-neutral-300 bg-neutral-50/50 hover:border-neutral-400"
          }`}
        >
          <Paperclip size={20} className="text-text-light" />
          <div className="text-sm font-medium text-text">
            Drag files here, or{" "}
            <span className="text-orange-600 underline">browse</span>
          </div>
          <div className="text-xs text-text-light">
            PDF, images, Word/Excel, CSV · up to {MAX_FILE_MB} MB each ·{" "}
            {MAX_FILES} max
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <ul className="space-y-1.5">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-3 py-2"
              >
                <FileText size={15} className="flex-shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-sm text-text">
                  {f.name}
                </span>
                <span className="flex-shrink-0 text-xs text-text-light">
                  {humanSize(f.size)}
                </span>
                {!busy && (
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="flex-shrink-0 rounded p-0.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                    aria-label={`Remove ${f.name}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Commentary */}
        <div>
          <label
            htmlFor="upload-note"
            className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-light"
          >
            What is this? (optional)
          </label>
          <textarea
            id="upload-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={busy}
            rows={2}
            maxLength={2000}
            placeholder="e.g. Bank statements for March, or my new photo ID"
            className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2 text-sm text-text outline-none transition focus:border-primary disabled:opacity-60"
          />
        </div>

        {/* Actions + status */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={busy || files.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-400 disabled:shadow-none"
          >
            {busy ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Sending
                {progress.total > 0 ? ` ${progress.done}/${progress.total}` : ""}…
              </>
            ) : (
              <>
                <Upload size={14} /> Send to us
              </>
            )}
          </button>

          {phase === "done" && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircle2 size={15} /> Sent — thank you
            </span>
          )}
          {error && (
            <span className="inline-flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle size={15} /> {error}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
