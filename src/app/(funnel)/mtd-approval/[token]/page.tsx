import { notFound } from 'next/navigation';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import type { MtdSummaryData } from './summaryTypes';
import MtdApprovalClient from './MtdApprovalClient';

export interface MtdApprovalDto {
  brandId: 'clever' | 'workwell';
  brandName: string;
  clientName?: string;
  businessName?: string;
  quarter?: string;
  taxYear?: string;
  periodStart?: string;
  periodEnd?: string;
  totalIncome?: number | null;
  totalExpenses?: number | null;
  netProfit?: number | null;
  approvalStatus: 'Pending' | 'Approved' | 'Queried';
  approvedAt?: string | null;
  alreadyResponded: boolean;
  isExpired: boolean;
  summary?: MtdSummaryData | null;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Approve your quarterly figures | ${brand.name}`,
    description: `Review and approve your MTD quarterly summary with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchApproval(
  token: string,
): Promise<{ status: number; data: MtdApprovalDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/MTDApproval?t=${encodeURIComponent(token)}`), {
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

export default async function MtdApprovalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { token } = await params;
  // Staff preview (?preview=1): opened from the internal MTD manager so a reviewer
  // can see exactly what the client sees. The approve/query actions are disabled
  // client-side, and we skip the "already responded / expired" short-circuits below
  // so staff can always view the summary regardless of the client's response state.
  const preview = (await searchParams)?.preview === '1';
  const brand = await getBrand();

  if (!token || token.length < 10) notFound();

  const { status, data } = await fetchApproval(token);

  if (status === 404) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This approval link doesn't match an active quarterly summary. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we'll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <StateCard
        variant="error"
        title="Couldn't load your summary"
        body={'error' in data ? data.error : 'An unexpected error occurred. Please try refreshing, or get in touch if this keeps happening.'}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const dto = data as MtdApprovalDto;

  if (dto.isExpired && !preview) {
    return (
      <StateCard
        variant="warning"
        title="This approval link has expired"
        body={`For security, approval links expire after a fixed period. Please contact us at ${brand.email} or ${brand.phone} and we'll help you from there.`}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (dto.alreadyResponded && !preview) {
    if (dto.approvalStatus === 'Approved') {
      return (
        <StateCard
          variant="success"
          title="You've already approved these figures"
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
    return (
      <StateCard
        variant="warning"
        title="Thanks — we're looking into your query"
        body="You've flagged a query on this quarter and your accountant has been notified. We'll be in touch. You don't need to do anything else for now."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  return <MtdApprovalClient token={token} dto={dto} brandEmail={brand.email} brandPhone={brand.phone} preview={preview} />;
}
