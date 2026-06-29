/**
 * Local copy of the MTD summary shape the approve page needs.
 *
 * Deliberately NOT imported from `@/content/mtd-summary` — that module lives on
 * the MTD-PDF branch (main) and isn't present here, which broke the build. The
 * approve page only consumes a subset of the payload, so we type it locally and
 * stay self-contained.
 */

export interface MtdSummaryTotals {
  totalIncome?: number | null;
  totalExpenses?: number | null;
  netProfit?: number | null;
}

export interface MtdMonthRow {
  monthEnd?: string | null;
  income?: number | null;
  expense?: number | null;
  profit?: number | null;
}

export interface MtdSummaryIssue {
  title: string;
  detail: string;
}

export interface MtdSummaryData {
  totals?: MtdSummaryTotals;
  monthly?: MtdMonthRow[];
  issues?: MtdSummaryIssue[];
  /** Client-facing fact-based narrative (AI). */
  financialSummary?: string | null;
}
