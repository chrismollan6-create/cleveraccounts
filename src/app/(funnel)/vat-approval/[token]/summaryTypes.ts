/**
 * Local copy of the VAT approval shape the approve page needs.
 *
 * The page only consumes the subset of the VATApproval payload it renders, so
 * we type it locally and stay self-contained (mirrors the MTD approach).
 */

export interface VatBox {
  num: number;
  label: string;
  value: number | null;
  emphasise: boolean;
}

export interface VatCheck {
  title: string;
  status: 'Clean' | 'Flagged';
  description: string;
  flagged: number;
}

/**
 * One month of the quarter, in figures. A quarter total hides an income gap — a client who
 * invoiced nothing for two months looks identical to one who simply had a quieter quarter.
 * Only the client can say which it is, so we show them the months and let them decline.
 */
export interface VatMonth {
  month: string;      // "2026-05"
  label: string;      // "May 26"
  sales: number;
  salesVat: number;
  purchases: number;
  noSales: boolean;   // £0 invoiced — the thing worth their attention
}

/** A mis-allocation note — either corrected by us, or flagged for the client to check. */
export interface HousekeepingNote {
  fixed: boolean;
  txnDate?: string | null;
  payee?: string | null;
  amountText?: string | null;
  fromCategory?: string | null;
  toCategory?: string | null;
}
