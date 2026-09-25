import { getBrand } from '@/lib/brand';
import type { QuerySection } from '../[token]/page';
import VatQueriesClient from '../[token]/VatQueriesClient';

/**
 * Clickable walkthrough of the client-query page — the one a client lands on when their VAT return
 * has questions on it rather than being ready to approve.
 *
 * Sample data, and `demo` means answering the sections reaches the real thank-you screen without
 * calling Salesforce, so it can be run through repeatedly with nothing to undo. Same pattern as
 * /vat-books-ready/preview and /vat-approval/preview. Not linked anywhere, and noindex.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'A few things to check (preview)',
  robots: { index: false, follow: false },
};

const SECTIONS: QuerySection[] = [
  {
    code: 'TXN_UNEXPLAINED',
    title: 'Unexplained bank transactions in the period',
    txnCount: 22,
    instruction:
      'There are 22 bank items we can’t see an explanation for. Anything unexplained is missing from your VAT return, so these need categorising in FreeAgent before we can finish it.',
    excluded: false,
    canConfirm: false,
    responseStatus: null,
    responseNote: null,
    lines: [
      { txnDate: '2026-07-08', payee: 'CARD PAYMENT 4417', amountText: '£248.00' },
      { txnDate: '2026-08-15', payee: 'TRANSFER OUT', amountText: '£1,100.00' },
    ],
  },
  {
    code: 'TXN_VAT_ON_EXEMPT',
    title: 'VAT reclaimed on costs that don’t usually carry it',
    txnCount: 3,
    instruction:
      'These are insurance and bank charges, which don’t normally carry VAT. Please check the invoices — if they show no VAT, correcting them in FreeAgent will put it right and we’ll re-check. If they do show VAT, just tell us and we’ll leave them as they are.',
    excluded: false,
    responseStatus: null,
    responseNote: null,
    lines: [
      { txnDate: '2026-07-14', payee: 'HISCOX INSURANCE', amountText: '£412.00', vatText: '£68.67' },
      { txnDate: '2026-08-02', payee: 'BARCLAYS BANK CHARGES', amountText: '£28.50', vatText: '£4.75' },
      { txnDate: '2026-09-11', payee: 'AXA BUSINESS COVER', amountText: '£196.20', vatText: '£32.70' },
    ],
  },
  {
    code: 'TXN_MISPOST',
    title: 'Costs that might be in the wrong place',
    txnCount: 2,
    instruction:
      'These look like they may be filed under the wrong category. It doesn’t usually change the VAT, so it won’t hold anything up — but if you’d like them moved, tell us and we’ll sort it.',
    excluded: false,
    informational: true,
    meaning:
      'These look like they may be filed under a different category to where they usually belong. It doesn’t change your VAT, so it won’t hold anything up.',
    responseStatus: null,
    responseNote: null,
    lines: [
      { txnDate: '2026-07-22', payee: 'SCREWFIX DIRECT', amountText: '£86.40', vatText: '£14.40', note: 'Filed under Rent — looks more like Equipment' },
      { txnDate: '2026-08-19', payee: 'THE THREE HORSESHOES', amountText: '£54.20', vatText: '£9.03', note: 'Filed under Telephone — looks more like Entertaining' },
    ],
  },
];

export default async function VatQueriesPreview() {
  const brand = await getBrand();
  return (
    <VatQueriesClient
      demo
      token="preview"
      clientName="Acme Trading Ltd"
      period="1 July 2026 to 30 September 2026"
      dueDate="7 November 2026"
      sections={SECTIONS}
      brandEmail={brand.email}
      brandPhone={brand.phone}
    />
  );
}
