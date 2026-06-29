import {
  FileText,
  Percent,
  Banknote,
  PenLine,
  IdCard,
  Home,
  Upload,
  Download,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getDocumentsForCurrentUser } from "@/lib/portal/documents";
import { isSurfaceHidden } from "@/lib/portal/features";
import AccessGate from "@/components/portal/AccessGate";
import type { PortalDocument } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Documents — file exchange. "We need from you" (uploads) is prominent at top;
 * "Shared with you" (downloads) below. Cache-backed + Aurora style. Actual
 * file download/upload streaming is a follow-up (SF ContentVersion proxy).
 */
export default async function DocumentsPage() {
  if (isSurfaceHidden("/portal/documents")) redirect("/portal/dashboard");

  const [brand, portalUser, result] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getDocumentsForCurrentUser(),
  ]);

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Documents
          </h1>
          <p className="mt-0.5 text-sm text-text-light">
            Everything we&apos;ve shared with you — and anything we still need
            from you.
          </p>
        </div>
        {outstanding > 0 ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            <Upload size={12} /> {outstanding} needed from you
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={12} /> Nothing outstanding
          </span>
        )}
      </div>

      {shared.length === 0 && requests.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-text-light shadow-sm">
          No documents yet. Anything we prepare for you — or need from you —
          will appear here.
        </div>
      )}

      {/* WE NEED FROM YOU */}
      {requests.length > 0 && (
        <section className="mb-7">
          <SectionLabel>We need from you</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
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
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
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
    <div className="relative px-4 py-6 sm:px-6 lg:px-8 max-w-[1600px]">
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
          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
