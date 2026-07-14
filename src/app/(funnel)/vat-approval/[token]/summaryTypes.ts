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

/** A mis-allocation note — either corrected by us, or flagged for the client to check. */
export interface HousekeepingNote {
  fixed: boolean;
  txnDate?: string | null;
  payee?: string | null;
  amountText?: string | null;
  fromCategory?: string | null;
  toCategory?: string | null;
}
