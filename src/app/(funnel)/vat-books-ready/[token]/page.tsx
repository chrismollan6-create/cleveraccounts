import { notFound } from 'next/navigation';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import StateCard from '@/components/vat/StateCard';
import VatBooksReadyClient from './VatBooksReadyClient';

export interface BooksReadyDto {
  clientName?: string;
  periodStart?: string;   // yyyy-MM-dd
  periodEnd?: string;     // yyyy-MM-dd
  dueDate?: string;       // yyyy-MM-dd
  alreadyConfirmed: boolean;
  confirmedAt?: string | null;
  confirmedBy?: string | null;   // "Client", or the staff member who did it for them
  freeAgentUrl?: string | null;  // their own FreeAgent; null for clients we hold no subdomain for
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Are your books ready?`,
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
  // Defensive parse — a Salesforce 502/timeout returns HTML, which would throw here and drop the
  // client on Next's generic error page instead of the branded StateCard below.
  try {
    const data = await res.json();
    return { status: res.status, data };
  } catch {
    return { status: res.status >= 400 ? res.status : 502, data: { error: 'We couldn’t load this just now. Please try again in a moment.' } };
  }
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
