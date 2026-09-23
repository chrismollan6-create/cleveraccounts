import { getBrand } from '@/lib/brand';
import StateCard from '@/components/vat/StateCard';
import type { BooksReadyDto } from '../[token]/page';
import VatBooksReadyClient from '../[token]/VatBooksReadyClient';

/**
 * Clickable walkthrough of the books-ready page, for demonstrating the VAT journey to the team.
 *   /vat-books-ready/preview              → the ask, with a working button
 *   /vat-books-ready/preview?state=done   → what a client sees coming back to a link they answered
 *
 * Sample data only, and `demo` means the button reaches its success state without calling
 * Salesforce — so it can be run through as many times as you like with nothing to undo. Follows
 * the same pattern as /insurance-sof/preview. Not linked from anywhere, and noindex.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Are your books ready? (preview)',
  robots: { index: false, follow: false },
};

const DTO: BooksReadyDto = {
  clientName: 'Acme Trading Ltd',
  periodStart: '2026-07-01',
  periodEnd: '2026-09-30',
  dueDate: '2026-11-07',
  alreadyConfirmed: false,
  freeAgentUrl: 'https://acmetrading.freeagent.com',
};

export default async function VatBooksReadyPreview({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const sp = await searchParams;
  const brand = await getBrand();

  // Coming back to a link they already answered — the page's own screen, not the client's.
  if (sp.state === 'done') {
    return (
      <StateCard
        variant="success"
        title="Thanks — your books are confirmed"
        body="You confirmed your records for this quarter were complete on 3 October 2026 at 10:12. We're preparing your VAT return and you'll get it back to approve — there's nothing else to do for now."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  return (
    <VatBooksReadyClient
      demo
      token="preview"
      dto={DTO}
      brandEmail={brand.email}
      brandPhone={brand.phone}
    />
  );
}
