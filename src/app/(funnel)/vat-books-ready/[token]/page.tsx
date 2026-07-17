import { notFound } from 'next/navigation';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import VatBooksReadyClient from './VatBooksReadyClient';

export interface BooksReadyDto {
  clientName?: string;
  periodStart?: string;   // yyyy-MM-dd
  periodEnd?: string;     // yyyy-MM-dd
  dueDate?: string;       // yyyy-MM-dd
  alreadyConfirmed: boolean;
  confirmedAt?: string | null;
  confirmedBy?: string | null;   // "Client", or the staff member who did it for them
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Are your books ready? | ${brand.name}`,
    description: `Confirm your records are complete so ${brand.name} can prepare your VAT return.`,
    robots: { index: false, follow: false },
  };
}

async function fetchBooksReady(
  token: string,
): Promise<{ status: number; data: BooksReadyDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/VATBooksReady?t=${encodeURIComponent(token)}`), {
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

export default async function VatBooksReadyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const brand = await getBrand();

  if (!token || token.length < 10) notFound();

  const { status, data } = await fetchBooksReady(token);

  if (status === 404) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This link doesn't match an active VAT period. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we'll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <StateCard
        variant="error"
        title="Couldn't load your VAT period"
        body={'error' in data ? data.error : 'An unexpected error occurred. Please try refreshing, or get in touch if this keeps happening.'}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const dto = data as BooksReadyDto;

  // Returning to a link they (or we) already answered — say so rather than ask twice.
  if (dto.alreadyConfirmed) {
    const when = dto.confirmedAt
      ? ` on ${new Date(dto.confirmedAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}`
      : '';
    const byUs = dto.confirmedBy && dto.confirmedBy !== 'Client';
    return (
      <StateCard
        variant="success"
        title="Thanks — your books are confirmed"
        body={
          byUs
            ? `Your accountant confirmed your records for this quarter were complete${when}. We're preparing your VAT return and you'll get it back to approve. If something's still missing, tell us and we'll pick it up.`
            : `You confirmed your records for this quarter were complete${when}. We're preparing your VAT return and you'll get it back to approve — there's nothing else to do for now.`
        }
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  return (
    <VatBooksReadyClient
      token={token}
      dto={dto}
      brandEmail={brand.email}
      brandPhone={brand.phone}
    />
  );
}
