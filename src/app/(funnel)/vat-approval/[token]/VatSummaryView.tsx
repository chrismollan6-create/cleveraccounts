import type { VatApprovalDto } from './page';

function fmtMoney(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtDay(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Native, responsive presentation of the VAT return — the headline net VAT,
 * the 9-box return, and the assurance checks — rendered as HTML so it's
 * consistently on-brand and chrome-free across every client's browser.
 */
export default function VatSummaryView({ dto }: { dto: VatApprovalDto }) {
  const boxes = dto.boxes ?? [];
  const checks = dto.checks ?? [];
  const net = dto.netVatDue ?? null;
  const isReclaim = net != null && net < 0;
  const headlineLabel = isReclaim ? 'Net VAT to reclaim from HMRC' : 'Net VAT to pay to HMRC';
  const headlineValue = fmtMoney(net == null ? null : Math.abs(net));

  const meta = [dto.scheme, dto.basis ? `${dto.basis} basis` : null].filter(Boolean).join(' · ');

  return (
    <div className="space-y-6">
      {/* Headline — net VAT */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200">
        <span className="w-1.5 shrink-0 bg-primary" />
        <div className="flex-1 bg-primary/[0.03] px-5 py-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-light">
            {headlineLabel}
          </p>
          <p className={`mt-1.5 text-3xl font-bold tracking-tight ${isReclaim ? 'text-emerald-600' : 'text-text'}`}>
            {headlineValue}
          </p>
          <p className="mt-2 text-[13px] text-text-light">
            {fmtDay(dto.periodStart)} → {fmtDay(dto.periodEnd)}
            {meta ? ` · ${meta}` : ''}
          </p>
        </div>
      </div>

      {/* The 9-box VAT return */}
      {boxes.length > 0 && (
        <div>
          <SectionLabel>Your VAT return</SectionLabel>
          <div className="mt-2 rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white text-left">
                    <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide">Box</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide">Description</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {boxes.map((b, i) => (
                    <tr
                      key={b.num ?? i}
                      className={`border-t border-gray-100 ${b.emphasise ? 'bg-primary/[0.05]' : ''}`}
                    >
                      <td className={`px-4 py-2.5 whitespace-nowrap ${b.emphasise ? 'font-bold text-text' : 'font-medium text-text'}`}>
                        {b.num}
                      </td>
                      <td className={`px-4 py-2.5 ${b.emphasise ? 'font-semibold text-text' : 'text-text-light'}`}>
                        {b.label}
                      </td>
                      <td className={`px-4 py-2.5 text-right whitespace-nowrap ${b.emphasise ? 'font-bold text-text' : 'text-text-light'}`}>
                        {fmtMoney(b.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Assurance checks */}
      {checks.length > 0 && (
        <div>
          <SectionLabel>Assurance checks</SectionLabel>
          <p className="mt-2 text-[13px] text-text-light">
            {dto.checksRun ?? checks.length} check{(dto.checksRun ?? checks.length) === 1 ? '' : 's'} performed,{' '}
            {dto.flagged ?? checks.filter((c) => c.status === 'Flagged').length} flagged
          </p>
          <ul className="mt-2 rounded-lg border border-gray-200 divide-y divide-gray-100">
            {checks.map((c, i) => (
              <li key={`${c.title}-${i}`} className="flex items-start gap-3 px-4 py-3">
                <StatusPill status={c.status} />
                <div>
                  <p className="text-sm font-semibold text-text">{c.title}</p>
                  <p className="text-[13px] leading-relaxed text-text-light">{c.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: 'Clean' | 'Flagged' }) {
  const clean = status === 'Clean';
  return (
    <span
      className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
        clean ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
      }`}
    >
      {status}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="block h-[3px] w-6 rounded-full bg-primary" />
      <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-primary">{children}</h2>
    </div>
  );
}
