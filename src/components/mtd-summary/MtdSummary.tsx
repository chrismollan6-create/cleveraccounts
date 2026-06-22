/**
 * MtdSummary — one-page branded PDF body. A4, fits on a single sheet.
 *
 * Renders into the (pdf) route segment, which has its own minimal layout. The
 * outer @page CSS in the layout fixes A4 size. Headless Chrome screenshots
 * this and returns the PDF bytes.
 *
 * Brand-aware via inline data-brand wrapper so colours pick up the right
 * tokens from globals.css ([data-brand="workwell"] overrides).
 */

import type { MtdSummaryData } from '@/content/mtd-summary';

function fmtMoney(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtMonthShort(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function MtdSummary({ data }: { data: MtdSummaryData }) {
  const periodLabel = `${data.period.quarter ? data.period.quarter + ' ' : ''}${
    data.period.taxYear ?? ''
  }`.trim();
  const periodDates = `${fmtDateLong(data.period.startDate)} → ${fmtDateLong(data.period.endDate)}`;

  return (
    <div
      data-brand={data.brandId}
      style={{
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: '#1f2937',
        padding: '24mm 18mm',
        fontSize: '11pt',
        lineHeight: 1.45,
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--color-primary, #1A7A9B)',
          paddingBottom: '8mm',
          marginBottom: '8mm',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '9pt',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6b7280',
              marginBottom: '2mm',
            }}
          >
            Quarterly MTD return — {data.isDraft ? 'Draft for review' : 'Submitted'}
          </div>
          <h1 style={{ fontSize: '20pt', margin: 0, color: '#0f172a' }}>
            {data.client.businessName || data.client.name}
          </h1>
          {data.client.businessName && data.client.name !== data.client.businessName && (
            <div style={{ color: '#6b7280', marginTop: '1mm' }}>{data.client.name}</div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '10pt' }}>
            <strong>{periodLabel || 'Period'}</strong> · {periodDates}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '9pt', color: '#6b7280' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/brand/${data.brandId}/logo.png`}
            alt={data.brandName}
            style={{ height: '14mm', width: 'auto', marginBottom: '2mm' }}
          />
          <div>Prepared {fmtDateLong(data.preparedAt)}</div>
        </div>
      </header>

      {/* Hero numbers */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6mm',
          marginBottom: '8mm',
        }}
      >
        <Tile label="Total income" value={fmtMoney(data.totals.totalIncome)} />
        <Tile label="Total expenses" value={fmtMoney(data.totals.totalExpenses)} />
        <Tile label="Net profit" value={fmtMoney(data.totals.netProfit)} emphasise />
      </section>

      {/* Monthly breakdown */}
      {data.monthly.length > 0 && (
        <section style={{ marginBottom: '8mm' }}>
          <h2 style={sectionHeading}>Monthly breakdown</h2>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '10pt',
              marginTop: '3mm',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                <th style={{ ...th, textAlign: 'left' }}>Month end</th>
                <th style={{ ...th, textAlign: 'right' }}>Income</th>
                <th style={{ ...th, textAlign: 'right' }}>Expenses</th>
                <th style={{ ...th, textAlign: 'right' }}>Net profit</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly.map((m) => (
                <tr key={m.monthEnd ?? Math.random()} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={td}>{fmtMonthShort(m.monthEnd)}</td>
                  <td style={{ ...td, textAlign: 'right' }}>{fmtMoney(m.income)}</td>
                  <td style={{ ...td, textAlign: 'right' }}>{fmtMoney(m.expense)}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>
                    {fmtMoney(m.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* About MTD */}
      <section
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '5mm 6mm',
          marginBottom: '6mm',
          fontSize: '9.5pt',
          color: '#374151',
        }}
      >
        <h2 style={{ ...sectionHeading, marginTop: 0 }}>About this return</h2>
        <p style={{ margin: '0 0 2mm' }}>
          Making Tax Digital (MTD) for Income Tax requires sole traders and landlords with qualifying
          income to submit a summary of business income and expenses to HMRC every quarter, in
          addition to the end-of-year return.
        </p>
        <p style={{ margin: 0 }}>
          The figures above are drawn from your FreeAgent bookkeeping at the period end, prepared by{' '}
          {data.brandName}. Please review and confirm they look right before we submit on your
          behalf — flag anything unexpected (missing income, mis-categorised expenses) so we can
          correct it pre-submission.
        </p>
      </section>

      {/* Footer / next steps */}
      <footer
        style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '4mm',
          fontSize: '9pt',
          color: '#6b7280',
        }}
      >
        <strong style={{ color: '#1f2937' }}>What happens next:</strong> reply to your accountant
        confirming you&apos;re happy with the figures, or note any queries. Once approved we&apos;ll
        submit the return to HMRC and confirm.
      </footer>
    </div>
  );
}

const sectionHeading = {
  fontSize: '11pt',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: 'var(--color-primary, #1A7A9B)',
  margin: '0 0 1mm',
  fontWeight: 600,
};

const th = { padding: '2mm 1mm', fontWeight: 500, fontSize: '9pt' };
const td = { padding: '2mm 1mm' };

function Tile({
  label,
  value,
  emphasise = false,
}: {
  label: string;
  value: string;
  emphasise?: boolean;
}) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
        padding: '5mm 5mm 4mm',
        background: emphasise ? 'var(--color-primary-50, #F0F9FF)' : '#ffffff',
      }}
    >
      <div
        style={{
          fontSize: '9pt',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#6b7280',
          marginBottom: '2mm',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: emphasise ? '20pt' : '17pt',
          fontWeight: 700,
          color: emphasise ? 'var(--color-primary, #1A7A9B)' : '#0f172a',
        }}
      >
        {value}
      </div>
    </div>
  );
}
