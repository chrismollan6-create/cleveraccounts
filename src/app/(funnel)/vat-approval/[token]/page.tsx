import { notFound } from 'next/navigation';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import type { VatBox, VatCheck, HousekeepingNote, VatMonth } from './summaryTypes';
import VatApprovalClient from './VatApprovalClient';

export interface VatApprovalDto {
  clientName?: string;
  periodStart?: string;      // yyyy-MM-dd
  periodEnd?: string;        // yyyy-MM-dd
  scheme?: string;           // e.g. "Standard Rated Scheme"
  basis?: string;            // "Invoice" | "Cash" | ...
  netVatDue?: number | null; // Box 5
  outcome?: string;          // "Pass" | "Refer" | "Fail"
  assuranceSummary?: string;
  checksRun?: number;
  flagged?: number;
  approvalStatus: 'Pending' | 'Approved' | 'Queried';
  approvedAt?: string | null;
  alreadyResponded: boolean;
  boxes: VatBox[];           // the 9 VAT return boxes
  checks: VatCheck[];
  housekeeping?: HousekeepingNote[];  // mis-allocations we corrected / flagged
  months?: VatMonth[];                // month-by-month figures for the quarter
  hasNoSalesMonth?: boolean;          // any month with nothing invoiced at all
  confirmIncomeNote?: string | null;  // sales well down on their norm — ask them to confirm
  reverseCharge?: ReverseCharge | null; // DEPRECATED — superseded by `groups`; kept one release
  groups?: FindingGroup[];             // checks that found something, each with its transactions
}

/** Over-claimed VAT on overseas suppliers — the one thing we ask the client to CHANGE. */
export interface ReverseCharge {
  totalVat: number;
  totalVatText: string;
  lines: ReverseChargeLine[];
  moreCount: number;
}

export interface ReverseChargeLine {
  txnDate?: string;
  payee?: string;
  amountText?: string;
  vatText?: string;
}

/** A check that flagged something, with the real transactions listed so the client can act. */
export interface FindingGroup {
  code: string;
  title: string;
  intro: string;                 // why we're asking
  action: string;                // what we'd like them to do
  totalVatText?: string | null;  // null when the group isn't about a VAT sum
  showVat: boolean;
  lines: FindingLine[];
  moreCount: number;
}

export interface FindingLine {
  txnDate?: string;
  payee?: string;
  amountText?: string;
  vatText?: string;
  note?: string | null;          // e.g. "Posted to Rent"
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Approve your VAT return | ${brand.name}`,
    description: `Review and approve your VAT return with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchApproval(
  token: string,
): Promise<{ status: number; data: VatApprovalDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/VATApproval?t=${encodeURIComponent(token)}`), {
    headers: { Authorization: `Bearer ${sfToken}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return { status: res.status, data };
}

function StateCard({
  title,
  body,
  variant,
  email,
  phone,
}: {
  title: string;
  body: string;
  variant: 'success' | 'warning' | 'error';
  email: string;
  phone: string;
}) {
  const Icon = variant === 'success' ? CheckCircle2 : variant === 'warning' ? AlertTriangle : AlertCircle;
  const colors =
    variant === 'success'
      ? 'text-emerald-600 bg-emerald-50'
      : variant === 'warning'
        ? 'text-amber-600 bg-amber-50'
        : 'text-rose-600 bg-rose-50';
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${colors}`}>
          <Icon size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">{title}</h1>
        <p className="text-text-light leading-relaxed mb-6">{body}</p>
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
          <span>Need help?</span>
          <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <a className="text-primary hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        </div>
      </div>
    </main>
  );
}

export default async function VatApprovalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const brand = await getBrand();

  if (!token || token.length < 10) notFound();

  const { status, data } = await fetchApproval(token);

  if (status === 404) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This approval link doesn't match an active VAT return. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we'll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <StateCard
        variant="error"
        title="Couldn't load your VAT return"
        body={'error' in data ? data.error : 'An unexpected error occurred. Please try refreshing, or get in touch if this keeps happening.'}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const dto = data as VatApprovalDto;

  if (dto.alreadyResponded) {
    if (dto.approvalStatus === 'Approved') {
      return (
        <StateCard
          variant="success"
          title="You've already approved this VAT return"
          body={
            dto.approvedAt
              ? `Approved on ${new Date(dto.approvedAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}. Thanks — there's nothing else you need to do.`
              : "Thanks — there's nothing else you need to do."
          }
          email={brand.email}
          phone={brand.phone}
        />
      );
    }
    // Queried: not a dead end. They may have come back precisely because they've fixed what we
    // flagged, so hand them the client with the "I've updated my books" button rather than a card.
    return (
      <VatApprovalClient
        token={token}
        dto={dto}
        brandEmail={brand.email}
        brandPhone={brand.phone}
        initialOutcome="queried"
      />
    );
  }

  return <VatApprovalClient token={token} dto={dto} brandEmail={brand.email} brandPhone={brand.phone} />;
}
