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

export function buildSampleCert(): InsuranceCertData {
  return {
    kind: 'insurance-cert',
    company: 'SOF Portal Test Ltd',
    startDate: '2026-08-07',
    policyNumber: 'SC1930C200AR/I/11271627',
    periodEnd: '2027-05-06',
  };
}
