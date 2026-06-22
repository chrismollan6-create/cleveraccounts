/**
 * Data shape for the MTD client-summary PDF. Keep in sync with the
 * Salesforce-side MtdSummaryPdfService.buildPayload — anything you add here
 * needs adding there too.
 */

export type MtdBrandId = 'clever' | 'workwell';

export interface MtdSummaryTotals {
  totalIncome: number | null;
  totalExpenses: number | null;
  netProfit: number | null;
}

export interface MtdMonthRow {
  monthEnd: string | null; // 'yyyy-MM-dd'
  income: number | null;
  expense: number | null;
  profit: number | null;
}

export interface MtdSummaryData {
  kind: 'mtd';
  brandId: MtdBrandId;
  brandName: string;
  isDraft: boolean;

  client: {
    name: string;
    businessName?: string | null;
  };

  period: {
    quarter?: string | null;
    taxYear?: string | null;
    startDate: string; // 'yyyy-MM-dd'
    endDate: string;   // 'yyyy-MM-dd'
  };

  totals: MtdSummaryTotals;
  monthly: MtdMonthRow[];

  verdict?: string | null;       // Pass / Refer / Fail (deterministic)
  humanVerdict?: string | null;  // Approved / etc.
  preparedAt: string;             // ISO datetime
}

const sampleClever: MtdSummaryData = {
  kind: 'mtd',
  brandId: 'clever',
  brandName: 'Clever Accounts',
  isDraft: true,
  client: { name: 'Megabites Sandwich Bar / Catering', businessName: 'Megabites' },
  period: {
    quarter: 'Q1',
    taxYear: '26/27',
    startDate: '2026-04-06',
    endDate: '2026-07-05',
  },
  totals: {
    totalIncome: 14214.42,
    totalExpenses: 504.59,
    netProfit: 13709.83,
  },
  monthly: [
    { monthEnd: '2026-05-05', income: 7817.59, expense: 354.87, profit: 7462.72 },
    { monthEnd: '2026-06-05', income: 6396.83, expense: 149.72, profit: 6247.11 },
    { monthEnd: '2026-07-05', income: 0, expense: 0, profit: 0 },
  ],
  verdict: 'Pass',
  humanVerdict: null,
  preparedAt: '2026-06-22T13:00:00Z',
};

const sampleWorkwell: MtdSummaryData = {
  ...sampleClever,
  brandId: 'workwell',
  brandName: 'Workwell Accountancy',
  client: { name: 'Jake Dennison T/a Pendle Plumbing and Heating', businessName: 'Pendle Plumbing' },
};

export function buildSampleData(brand: MtdBrandId): MtdSummaryData {
  return brand === 'workwell' ? sampleWorkwell : sampleClever;
}
