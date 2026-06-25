import {
  CheckCircle2,
  Percent,
  FileText,
  UserCheck,
  FileBarChart,
  PenLine,
  Clock,
  Coins,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getApprovalsForCurrentUser } from "@/lib/portal/approvals";
import { isSurfaceHidden } from "@/lib/portal/features";
import AccessGate from "@/components/portal/AccessGate";
import ApprovalActions from "@/components/portal/ApprovalActions";
import type { PortalApproval } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * Approvals — items awaiting the client's sign-off (MTD review, VAT, SA,
 * accounts). Pending items are prominent with an Approve action; actioned
 * items drop into a quiet history. Cache-backed + Aurora style.
 */
export default async function ApprovalsPage() {
  if (isSurfaceHidden("/portal/approvals")) redirect("/portal/dashboard");

  const [brand, portalUser, result] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getApprovalsForCurrentUser(),
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
          We couldn&apos;t load your approvals just now — try refreshing.
        </div>
      </Wrap>
    );
  }

  const approvals = result.data;
  const pending = approvals.filter((a) => a.status === "pending");
  const history = approvals.filter((a) => a.status !== "pending");

  return (
    <Wrap>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Approvals
          </h1>
          <p className="mt-0.5 text-sm text-text-light">
            Review and sign off what we&apos;ve prepared — so we can file it for
            you.
          </p>
        </div>
        {pending.length > 0 ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            <PenLine size={12} /> {pending.length} awaiting you
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={12} /> Nothing to approve
          </span>
        )}
      </div>

      {approvals.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-text-light shadow-sm">
          Nothing needs your approval right now. When we&apos;ve prepared a
          return or set of accounts, it&apos;ll appear here for sign-off.
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-7">
          <SectionLabel>Awaiting your approval</SectionLabel>
          <div className="grid gap-4 lg:grid-cols-2">
            {pending.map((a) => (
              <PendingCard key={a.id} a={a} />
            ))}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <SectionLabel>History</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <ul className="divide-y divide-neutral-100">
              {history.map((a) => (
                <HistoryRow key={a.id} a={a} />
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

const KIND_META: Record<string, { icon: typeof FileText; label: string }> = {
  mtd_review: { icon: FileBarChart, label: "MTD quarterly review" },
  vat: { icon: Percent, label: "VAT return" },
  self_assessment: { icon: UserCheck, label: "Self Assessment" },
  accounts: { icon: FileText, label: "Annual accounts" },
};

function PendingCard({ a }: { a: PortalApproval }) {
  const meta = KIND_META[a.kind] ?? { icon: FileText, label: "Approval" };
  const Icon = meta.icon;

  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/70 to-white p-5 shadow-sm">
      <span className="absolute inset-y-0 left-0 w-1.5 bg-orange-500" />
      <div className="flex items-start gap-3 pl-1.5">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-text">{a.title}</h3>
          {a.periodLabel && (
            <p className="text-xs text-text-light">{a.periodLabel}</p>
          )}

          {a.amountLabel && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-text ring-1 ring-orange-200">
              <Coins size={14} className="text-orange-500" />
              {a.amountLabel}
            </div>
          )}

          {a.summary && (
            <p className="mt-3 text-sm leading-relaxed text-text-light">
              {a.summary}
            </p>
          )}

          {a.dueDate && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-light">
              <Clock size={12} /> Please approve by{" "}
              <span className="font-medium text-text">
                {formatDate(a.dueDate)}
              </span>
            </div>
          )}

          <ApprovalActions id={a.id} />
        </div>
      </div>
    </section>
  );
}

function HistoryRow({ a }: { a: PortalApproval }) {
  const meta = KIND_META[a.kind] ?? { icon: FileText, label: "Approval" };
  const Icon = meta.icon;
  const approved = a.status === "approved";

  return (
    <li className="flex items-center gap-3 px-5 py-3.5">
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
          approved
            ? "bg-emerald-50 text-emerald-600"
            : "bg-neutral-100 text-text-light"
        }`}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-text">{a.title}</div>
        {a.periodLabel && (
          <div className="truncate text-xs text-text-light">{a.periodLabel}</div>
        )}
      </div>
      {approved ? (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          <CheckCircle2 size={12} />
          Approved{a.approvedAt ? ` ${formatDate(a.approvedAt)}` : ""}
        </span>
      ) : (
        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-text-light">
          Queried
        </span>
      )}
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
