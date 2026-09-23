import { notFound } from 'next/navigation';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import StateCard from '@/components/vat/StateCard';
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
    title: `Approve your VAT return`,
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
  // A Salesforce gateway timeout / 502 returns an HTML body, so res.json() would throw and drop the
  // client on Next's generic 500 instead of our branded error card. Parse defensively.
  try {
    const data = await res.json();
    return { status: res.status, data };
  } catch {
    return { status: res.status >= 400 ? res.status : 502, data: { error: 'We couldn’t load your VAT return just now. Please try again in a moment.' } };
  }
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
