import { getBrand } from '@/lib/brand';
import StateCard from '@/components/vat/StateCard';
import type { VatApprovalDto } from '../[token]/page';
import VatApprovalClient from '../[token]/VatApprovalClient';

/**
 * Clickable walkthrough of the approval page, for demonstrating the VAT journey to the team.
 *   /vat-approval/preview              → a return with things to look at before approving
 *   /vat-approval/preview?state=clean  → nothing flagged, straight to approve
 *   /vat-approval/preview?state=done   → coming back to one they already approved
 *
 * Sample data only, and `demo` means Approve / Raise a query / I've updated my books all reach
 * their real success state without calling Salesforce — so it can be run through as many times as
 * you like with nothing to undo. Not linked from anywhere, and noindex.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Approve your VAT return (preview)',
  robots: { index: false, follow: false },
};

const BOXES = [
  { num: 1, label: 'VAT due on sales and other outputs', value: 8420.6, emphasise: false },
  { num: 2, label: 'VAT due on acquisitions from Northern Ireland', value: 0, emphasise: false },
  { num: 3, label: 'Total VAT due', value: 8420.6, emphasise: true },
  { num: 4, label: 'VAT reclaimed on purchases', value: 1937.15, emphasise: false },
  { num: 5, label: 'Net VAT to pay HMRC', value: 6483.45, emphasise: true },
  { num: 6, label: 'Total value of sales, excluding VAT', value: 42103, emphasise: false },
  { num: 7, label: 'Total value of purchases, excluding VAT', value: 14680, emphasise: false },
  { num: 8, label: 'Supplies to Northern Ireland', value: 0, emphasise: false },
  { num: 9, label: 'Acquisitions from Northern Ireland', value: 0, emphasise: false },
];

const MONTHS = [
  { month: '2026-07', label: 'Jul 26', sales: 18200, salesVat: 3640, purchases: 5210, noSales: false },
  { month: '2026-08', label: 'Aug 26', sales: 9450, salesVat: 1890, purchases: 4870, noSales: false },
  { month: '2026-09', label: 'Sep 26', sales: 14453, salesVat: 2890.6, purchases: 4600, noSales: false },
];

function baseDto(): VatApprovalDto {
  return {
    clientName: 'Acme Trading Ltd',
    periodStart: '2026-07-01',
    periodEnd: '2026-09-30',
    scheme: 'Standard Rated Scheme',
    basis: 'Invoice',
    netVatDue: 6483.45,
    outcome: 'Pass',
    assuranceSummary:
      'The return reconciles to the bookkeeping and the figures are in line with previous quarters. Two items are worth a look before you approve, neither of which changes the amount payable.',
    checksRun: 34,
    flagged: 1,
    approvalStatus: 'Pending',
    alreadyResponded: false,
    reviewerNote:
      'Sales are down on last quarter because the Ryder contract ended in July — the figures are right.',
    boxes: BOXES,
    months: MONTHS,
    hasNoSalesMonth: false,
    checks: [
      { title: 'VAT return reconciliation', status: 'Clean', description: 'The return agrees to the bookkeeping for the period.', flagged: 0 },
      { title: 'Output VAT rate', status: 'Clean', description: 'Output VAT is 20.0% of sales, in line with previous quarters.', flagged: 0 },
      { title: 'Duplicate transactions', status: 'Clean', description: 'No duplicate payments found in the period.', flagged: 0 },
      { title: 'Unexplained transactions', status: 'Clean', description: 'Every bank transaction in the period has been explained.', flagged: 0 },
      { title: 'Bank feed health', status: 'Clean', description: 'All bank feeds imported throughout the period.', flagged: 0 },
      { title: 'Overseas suppliers', status: 'Flagged', description: 'VAT reclaimed on suppliers that may be billing from outside the UK.', flagged: 2 },
    ],
    groups: [
      {
        code: 'TXN_RC_OVERCLAIM',
        title: 'VAT reclaimed on an overseas supplier',
        intro:
          'These suppliers look like they bill from outside the UK. If there was no UK VAT on the invoice, the VAT reclaimed here needs to come off.',
        action: 'Please check the invoices and tell us if either of these did not charge UK VAT.',
        totalVatText: '£118.44',
        showVat: true,
        moreCount: 0,
        lines: [
          { txnDate: '2026-08-14', payee: 'ADOBE SYSTEMS SOFTWARE IRELAND', amountText: '£479.76', vatText: '£79.96', note: 'Posted to Software' },
          { txnDate: '2026-09-02', payee: 'AWS EMEA LUXEMBOURG', amountText: '£230.88', vatText: '£38.48', note: 'Posted to Computer costs' },
        ],
      },
    ],
    housekeeping: [
      { fixed: true, txnDate: '2026-07-22', payee: 'SCREWFIX DIRECT', amountText: '£86.40', fromCategory: 'Rent', toCategory: 'Equipment' },
      { fixed: false, txnDate: '2026-09-11', payee: 'THE THREE HORSESHOES', amountText: '£54.20', fromCategory: 'Telephone', toCategory: 'Entertaining' },
    ],
  };
}

export default async function VatApprovalPreview({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const sp = await searchParams;
  const brand = await getBrand();

  if (sp.state === 'done') {
    return (
      <StateCard
        variant="success"
        title="You've already approved this VAT return"
        body="Approved on 12 October 2026 at 14:28. Thanks — there's nothing else you need to do."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const dto = baseDto();
  if (sp.state === 'clean') {
    dto.flagged = 0;
    dto.groups = [];
    dto.housekeeping = [];
    dto.checks = dto.checks.map((c) => ({ ...c, status: 'Clean' as const, flagged: 0 }));
    dto.assuranceSummary =
      'The return reconciles to the bookkeeping and the figures are in line with previous quarters. Nothing needs your attention before approving.';
  }

  return (
    <VatApprovalClient
      demo
      token="preview"
      dto={dto}
      brandEmail={brand.email}
      brandPhone={brand.phone}
    />
  );
}
