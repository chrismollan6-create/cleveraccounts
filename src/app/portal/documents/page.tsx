import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
  Percent,
  Banknote,
  PenLine,
  IdCard,
  Home,
  Upload,
  Download,
  CheckCircle2,
  Send,
  Clock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getDocumentsForCurrentUser } from "@/lib/portal/documents";
import { listUploadsForCurrentUser } from "@/lib/portal/uploads";
import { isSurfaceHidden } from "@/lib/portal/features";
import AccessGate from "@/components/portal/AccessGate";
import DocumentUpload from "@/components/portal/DocumentUpload";
import type { PortalDocument, PortalUpload } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Documents — file exchange. "We need from you" (uploads) is prominent at top;
 * "Shared with you" (downloads) below. Cache-backed + Aurora style. Actual
 * file download/upload streaming is a follow-up (SF ContentVersion proxy).
 */
export default async function DocumentsPage() {
  if (isSurfaceHidden("/portal/documents")) redirect("/portal/dashboard");

  const [brand, portalUser, result, uploadsRes] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getDocumentsForCurrentUser(),
    // Fail-soft: if migration 0009 (the upload tables) hasn't been applied yet,
    // this read would throw — degrade to an empty history rather than 500 the
    // whole Documents page.
    listUploadsForCurrentUser().catch(() => null),
  ]);
  const uploads = uploadsRes && uploadsRes.ok ? uploadsRes.data : [];

  const firstName =
    portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  if (
    portalUser &&
    (portalUser.status === "disabled" || portalUser.status === "pending")
  ) {
    return (
      <Wrap>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </Wrap>
    );
  }

  if (result.ok === false) {
    return (
      <Wrap>
        <div className="max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-800">
          We couldn&apos;t load your documents just now — try refreshing.
        </div>
      </Wrap>
    );
  }

  const { shared, requests } = result.data;
  const outstanding = requests.filter((r) => r.status === "requested").length;

  return (
    <Wrap>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
            <FileText size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Documents
            </h1>
            <p className="mt-0.5 text-sm text-text-light">
              Send us documents securely, and see everything you&apos;ve shared.
            </p>
          </div>
        </div>
        {outstanding > 0 && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            <Upload size={12} /> {outstanding} needed from you
          </span>
        )}
      </div>

      {/* SEND US A DOCUMENT — client → us uploads */}
      <div className="mb-7">
        <DocumentUpload />
      </div>

      {/* SENT TO US — upload history, grouped by day */}
      {uploads.length > 0 && (
        <section className="mb-7">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text-light">
              Sent to us
            </h2>
            <span className="text-xs text-text-light">
              {uploads.length} {uploads.length === 1 ? "document" : "documents"}{" "}
              sent
            </span>
          </div>
          <div className="space-y-5">
            {groupUploadsByDay(uploads).map((group) => (
              <div key={group.label}>
                <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-light/60">
                  {group.label}
                </div>
                <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
                  {group.items.map((u) => (
                    <UploadRow
                      key={u.id}
                      u={u}
                      isNewest={u.id === uploads[0].id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WE NEED FROM YOU */}
      {requests.length > 0 && (
        <section className="mb-7">
          <SectionLabel>We need from you</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
            <ul className="divide-y divide-neutral-100">
              {requests.map((d) => (
                <RequestRow key={d.id} d={d} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* SHARED WITH YOU */}
      {shared.length > 0 && (
        <section>
          <SectionLabel>Shared with you</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
            <ul className="divide-y divide-neutral-100">
              {shared.map((d) => (
                <SharedRow key={d.id} d={d} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-light">
      {children}
    </h2>
  );
}

const CATEGORY_ICON: Record<string, typeof FileText> = {
  accounts: FileText,
  vat: Percent,
  tax_return: FileText,
  payslip: Banknote,
  p60: FileText,
  engagement_letter: PenLine,
  identity: IdCard,
  proof_of_address: Home,
  other: FileText,
};

function RequestRow({ d }: { d: PortalDocument }) {
  const Icon = CATEGORY_ICON[d.category] ?? FileText;
  const received = d.status === "received";

  return (
    <li className="flex items-center gap-3 px-5 py-4">
      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
          received
            ? "bg-emerald-50 text-emerald-600"
            : "bg-orange-50 text-orange-600"
        }`}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text">{d.name}</div>
        <div className="mt-0.5 text-xs text-text-light">
          {received ? (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={12} /> Received
              {d.sharedAt ? ` ${formatDate(d.sharedAt)}` : ""}
            </span>
          ) : d.dueDate ? (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> Please send by{" "}
              <span className="font-medium text-text">{formatDate(d.dueDate)}</span>
            </span>
          ) : (
            "When you have a moment"
          )}
        </div>
      </div>
      {received ? (
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          Done
        </span>
      ) : (
        // Upload streaming to SF ContentVersion is the follow-up; button is the
        // affordance for the pilot.
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
        >
          <Upload size={14} /> Upload
        </button>
      )}
    </li>
  );
}

function SharedRow({ d }: { d: PortalDocument }) {
  const Icon = CATEGORY_ICON[d.category] ?? FileText;
  const meta = [d.fileType, d.sizeLabel, d.sharedAt ? `Shared ${formatDate(d.sharedAt)}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="group flex items-center gap-3 px-5 py-3.5 transition hover:bg-neutral-50">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-text">{d.name}</div>
        {meta && <div className="truncate text-xs text-text-light">{meta}</div>}
      </div>
      <a
        href={d.downloadUrl ?? "#"}
        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-text transition hover:border-neutral-400"
      >
        <Download size={14} /> Download
      </a>
    </li>
  );
}

function UploadRow({ u, isNewest }: { u: PortalUpload; isNewest?: boolean }) {
  return (
    <div className={`px-4 py-3 ${isNewest ? "upload-flash" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {u.note ? (
            <p className="text-sm font-medium text-text">{u.note}</p>
          ) : (
            <p className="text-sm italic text-text-light">No description added</p>
          )}
          <p className="mt-0.5 text-xs text-text-light">
            {formatTime(u.createdAt)}
            {u.files.length > 1 ? ` · ${u.files.length} files` : ""}
          </p>
        </div>
        <UploadStatus status={u.status} />
      </div>
      <ul className="mt-2 space-y-1">
        {u.files.map((f) => {
          const Icon = fileIcon(f.fileName);
          return (
            <li
              key={f.id}
              className="flex items-center gap-2.5 rounded-lg bg-neutral-50 px-2.5 py-1.5"
            >
              <Icon size={14} className="flex-shrink-0 text-[#1A7A9B]" />
              <span className="min-w-0 flex-1 truncate text-xs text-text">
                {f.fileName}
              </span>
              {f.sizeLabel && (
                <span className="flex-shrink-0 text-[11px] text-text-light">
                  {f.sizeLabel}
                </span>
              )}
              {f.downloadUrl && (
                <a
                  href={f.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-shrink-0 items-center gap-1 text-[11px] font-medium text-[#1A7A9B] hover:underline"
                >
                  <Download size={12} /> View
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Real, client-appropriate status. 'received' = in our portal, still landing in
// our system → "Processing"; 'pushed' = it's reached the team → "Delivered".
// Anything else (incl. a back-office push retry) stays reassuring: it's with us.
function UploadStatus({ status }: { status: string }) {
  if (status === "received") {
    return (
      <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        <Clock size={11} /> Processing
      </span>
    );
  }
  if (status === "pushed") {
    return (
      <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        <CheckCircle2 size={11} /> Delivered
      </span>
    );
  }
  return (
    <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
      <Send size={11} /> Sent
    </span>
  );
}

const SPREADSHEET_EXT = new Set(["csv", "xls", "xlsx", "ods"]);
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "heic", "heif"]);
const DOC_EXT = new Set(["pdf", "doc", "docx", "txt", "rtf", "odt"]);

function fileIcon(name: string): typeof FileText {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (SPREADSHEET_EXT.has(ext)) return FileSpreadsheet;
  if (IMAGE_EXT.has(ext)) return FileImage;
  if (DOC_EXT.has(ext)) return FileText;
  return FileIcon;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Group uploads (already newest-first) into consecutive Today/Yesterday/date buckets. */
function groupUploadsByDay(
  uploads: PortalUpload[]
): { label: string; items: PortalUpload[] }[] {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(new Date());
  const groups: { label: string; items: PortalUpload[] }[] = [];
  for (const u of uploads) {
    const d = new Date(u.createdAt);
    const diff = Math.round(
      (today.getTime() - startOfDay(d).getTime()) / 86_400_000
    );
    const label =
      diff <= 0
        ? "Today"
        : diff === 1
          ? "Yesterday"
          : d.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(u);
    else groups.push({ label, items: [u] });
  }
  return groups;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
