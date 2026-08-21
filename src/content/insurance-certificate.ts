/**
 * Data + helpers for the insurance Verification Certificate PDF
 * (Caunce O'Hara / Markel block policy). Rendered by
 * components/insurance/InsuranceCertificate.tsx and turned into a PDF by
 * /api/insurance-certificate/pdf via headless Chrome.
 *
 * Only the company name and the period start vary per client; the policy
 * number and period end are fixed on the block policy (Salesforce passes
 * them so a renewal is a one-place change on the SF side).
 */
export interface InsuranceCertData {
  kind: 'insurance-cert';
  company: string;
  startDate: string; // ISO yyyy-mm-dd (period of insurance start)
  policyNumber: string;
  periodEnd: string; // ISO yyyy-mm-dd (fixed block period end)
}

export function isInsuranceCert(v: unknown): v is InsuranceCertData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return (
    d.kind === 'insurance-cert' &&
    typeof d.company === 'string' &&
    typeof d.startDate === 'string' &&
    typeof d.policyNumber === 'string' &&
    typeof d.periodEnd === 'string'
  );
}

/** "07th May 2026" — plain string (for the success page). */
export function formatCertDate(iso: string): string {
  const p = certDateParts(iso);
  return p.dd ? `${p.dd}${p.suffix} ${p.rest}` : '';
}

/** Parts of a certificate date — "07" + "th" (superscript) + "May 2026". */
export function certDateParts(iso: string): { dd: string; suffix: string; rest: string } {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return { dd: '', suffix: '', rest: '' };
  const day = d.getUTCDate();
  const suffix =
    day >= 11 && day <= 13
      ? 'th'
      : day % 10 === 1
        ? 'st'
        : day % 10 === 2
          ? 'nd'
          : day % 10 === 3
            ? 'rd'
            : 'th';
  const dd = String(day).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
  return { dd, suffix, rest: `${month} ${d.getUTCFullYear()}` };
}

/**
 * Fixed block-policy values (same for every client; change once at annual renewal).
 * Also used by the success page's cover summary.
 */
export const BLOCK_POLICY_NUMBER = 'SC1930C200AR/I/11271627';
export const BLOCK_PERIOD_END = '2027-05-06';

/**
 * Build the certificate payload. Salesforce owns the policy year — a client
 * already on the policy is covered for the year in force, not since the day
 * they joined — so pass its dates through when they are given. The constants
 * are only the fallback for sample renders and older callers.
 */
export function buildCertFromClient(
  company: string,
  startDate: string,
  periodEnd?: string,
  policyNumber?: string,
): InsuranceCertData {
  return {
    kind: 'insurance-cert',
    company,
    startDate,
    policyNumber: policyNumber || BLOCK_POLICY_NUMBER,
    periodEnd: periodEnd || BLOCK_PERIOD_END,
  };
}

export function buildSampleCert(): InsuranceCertData {
  return buildCertFromClient('SOF Portal Test Ltd', '2026-08-07');
}
