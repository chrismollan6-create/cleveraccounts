import { headers } from 'next/headers';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import DirectDebitClient from './DirectDebitClient';

/**
 * Public Direct Debit sign-up page.
 *
 * Staff raise a request against a client in Salesforce; the client follows the
 * tokenised link here, enters their bank details, and we create the customer
 * and mandate in DDCMS. See DDRequestService.cls.
 */

export interface DDRequestDto {
  status: 'Sent' | 'Viewed' | 'Completed' | 'Failed' | 'Expired' | 'Cancelled';
  clientName?: string;
  recipientName?: string;
  brand?: string;
  reference?: string;
  expired?: boolean;
  completed?: boolean;
  /** Prefilled from the client record — the payer confirms rather than retypes. */
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  town?: string;
  postCode?: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Set up your Direct Debit | ${brand.name}`,
    robots: { index: false, follow: false },
  };
}

async function load(token: string): Promise<DDRequestDto | null> {
  try {
    const sfToken = await getSalesforceToken();
    const res = await fetch(sfApex(`/DDRequest?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as DDRequestDto;
  } catch (err) {
    console.error('direct-debit page load error:', err);
    return null;
  }
}

/** Best-effort view tracking; never allowed to block the page. */
async function recordView(token: string) {
  try {
    const headerList = await headers();
    const sfToken = await getSalesforceToken();
    await fetch(sfApex(`/DDRequest/view?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': headerList.get('x-forwarded-for') ?? 'unknown',
        'X-Original-User-Agent': headerList.get('user-agent') ?? 'unknown',
      },
      body: '{}',
      cache: 'no-store',
    });
  } catch {
    // Deliberately swallowed.
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</div>
    </main>
  );
}

export default async function DirectDebitPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const brand = await getBrand();
  const dto = await load(token);

  if (!dto) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-slate-900">This link isn&apos;t valid</h1>
        <p className="mt-3 text-slate-600">
          We couldn&apos;t find this Direct Debit request. It may have been cancelled, or the link may
          have been copied incompletely. Please get in touch and we&apos;ll send you a new one.
        </p>
        <p className="mt-4 text-slate-600">
          <a className="font-medium text-slate-900 underline" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>
        </p>
      </Shell>
    );
  }

  if (dto.completed) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-slate-900">Your Direct Debit is already set up</h1>
        <p className="mt-3 text-slate-600">
          There&apos;s nothing more to do — we have your Direct Debit instruction on file. If you think
          this is wrong, please contact us at{' '}
          <a className="font-medium text-slate-900 underline" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>
          .
        </p>
      </Shell>
    );
  }

  if (dto.expired) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-slate-900">This link has expired</h1>
        <p className="mt-3 text-slate-600">
          For security, Direct Debit links expire after a while. Email us and we&apos;ll send a fresh
          one straight over.
        </p>
        <p className="mt-4 text-slate-600">
          <a className="font-medium text-slate-900 underline" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>
        </p>
      </Shell>
    );
  }

  await recordView(token);

  return (
    <DirectDebitClient
      token={token}
      dto={dto}
      brandName={brand.name}
      brandEmail={brand.email}
      brandPhone={brand.phone}
    />
  );
}
