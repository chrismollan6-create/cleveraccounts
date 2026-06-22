/**
 * MtdSummary — the MTD client-summary one-pager.
 *
 * Server component, rendered at A4 width and turned into a PDF by headless
 * Chrome (see /api/mtd-summary/pdf). Designed as a formal financial-document
 * style: branded but restrained — no decorative shapes, no marketing
 * gradients, clear section rules and typography. Single page.
 */

import { BRANDS } from '@/lib/constants';
import type { MtdSummaryData } from '@/content/mtd-summary';

function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
  const brand = BRANDS[data.brandId];
  const logo = `/brand/${data.brandId}/logo.png`;
  const c = brand.colors;

  const periodLabel = `${data.period.quarter ? data.period.quarter + ' ' : ''}${
    data.period.taxYear ?? ''
  }`.trim();
  const periodDates = `${fmtDateLong(data.period.startDate)} → ${fmtDateLong(data.period.endDate)}`;

  return (
    <div
      data-brand={data.brandId}
      className="mx-auto bg-white font-sans text-text"
      style={
        {
          width: '210mm',
          minHeight: '297mm',
          '--color-primary': c.primary,
          '--color-primary-dark': c.primaryDark,
          '--color-primary-light': c.primaryLight,
          '--color-primary-50': c.primary50,
          '--color-secondary': c.secondary,
          '--color-secondary-dark': c.secondaryDark,
          '--color-secondary-light': c.secondaryLight,
          '--color-accent': c.accent,
          '--color-surface': c.surface,
          '--color-surface-alt': c.surfaceAlt,
          '--color-text': c.text,
          '--color-text-light': c.textLight,
        } as React.CSSProperties
      }
    >
      {/* ═══════════════ DOCUMENT HEAD ═══════════════ */}
      <header className="px-[18mm] pt-[16mm]">
        <div className="flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={data.brandName} className="h-8 w-auto" />
          <div className="text-right">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: c.primary }}
            >
              Quarterly MTD Return
            </p>
            <p className="mt-1 text-[10px] font-semibold text-text-light">
              {data.isDraft ? 'Draft for client review' : 'Submitted to HMRC'}
            </p>
          </div>
        </div>

        {/* primary-coloured rule under the header */}
        <span
          className="mt-5 block h-[3px] w-full rounded-full"
          style={{ backgroundColor: c.primary }}
        />

        {/* client + period */}
        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-extrabold leading-[1.1] tracking-tight text-text">
              {data.client.businessName || data.client.name}
            </h1>
            {data.client.businessName && data.client.name !== data.client.businessName && (
              <p className="mt-1 text-[12px] font-medium text-text-light">{data.client.name}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-light"
            >
              Period
            </p>
            <p className="mt-1 text-[13px] font-extrabold text-text">{periodLabel || '—'}</p>
            <p className="text-[10.5px] text-text-light">{periodDates}</p>
          </div>
        </div>
      </header>

      {/* ═══════════════ HEADLINE FIGURES ═══════════════ */}
      <section className="grid grid-cols-3 gap-4 px-[18mm] pt-[10mm]">
        <StatTile label="Total income" value={fmtMoney(data.totals.totalIncome)} color={c.primary} />
        <StatTile
          label="Total expenses"
          value={fmtMoney(data.totals.totalExpenses)}
          color={c.primary}
        />
        <StatTile
          label="Net profit"
          value={fmtMoney(data.totals.netProfit)}
          color={c.primary}
          emphasise
        />
      </section>

      {/* ═══════════════ CAVEAT STRIP ═══════════════ */}
      <section className="px-[18mm] pt-[6mm]">
        <div
          className="flex items-start gap-3 rounded-md border-l-[3px] px-3.5 py-2.5"
          style={{
            borderLeftColor: c.secondary,
            backgroundColor: hexAlpha(c.secondary, 0.06),
          }}
        >
          <span
            className="mt-px text-[11px] font-extrabold"
            style={{ color: c.secondary }}
          >
            !
          </span>
          <p className="text-[10px] leading-[1.55] text-text">
            <span className="font-bold">Indicative figures — use as a guide.</span> These totals
            can change if you add, alter or amend transactions in FreeAgent after this return is
            prepared, or if our year-end review surfaces adjustments. Final figures are confirmed
            on the year-end Self Assessment.
          </p>
        </div>
      </section>

      {/* ═══════════════ MONTHLY BREAKDOWN ═══════════════ */}
      {data.monthly.length > 0 && (
        <section className="px-[18mm] pt-[10mm]">
          <SectionLabel color={c.primary}>Monthly breakdown</SectionLabel>
          <div
            className="mt-3 overflow-hidden rounded-md border"
            style={{ borderColor: hexAlpha(c.primary, 0.18) }}
          >
            <table className="w-full text-[11px]">
              <thead>
                <tr
                  className="text-left"
                  style={{
                    backgroundColor: hexAlpha(c.primary, 0.05),
                    color: c.primary,
                  }}
                >
                  <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em]">
                    Month end
                  </th>
                  <th className="px-4 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.14em]">
                    Income
                  </th>
                  <th className="px-4 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.14em]">
                    Expenses
                  </th>
                  <th className="px-4 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.14em]">
                    Net profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.monthly.map((m, i) => (
                  <tr
                    key={m.monthEnd ?? i}
                    className="border-t"
                    style={{ borderColor: hexAlpha(c.primary, 0.08) }}
                  >
                    <td className="px-4 py-2.5 font-semibold text-text">{fmtMonthShort(m.monthEnd)}</td>
                    <td className="px-4 py-2.5 text-right text-text-light">{fmtMoney(m.income)}</td>
                    <td className="px-4 py-2.5 text-right text-text-light">{fmtMoney(m.expense)}</td>
                    <td
                      className="px-4 py-2.5 text-right font-extrabold"
                      style={{ color: c.primary }}
                    >
                      {fmtMoney(m.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ═══════════════ ABOUT MTD ═══════════════ */}
      <section className="px-[18mm] pt-[10mm]">
        <SectionLabel color={c.primary}>About this return</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-6">
          <div>
            <p
              className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-light"
            >
              Why every quarter
            </p>
            <p className="mt-1.5 text-[10.5px] leading-[1.65] text-text-light">
              Making Tax Digital for Income Tax requires sole traders and landlords with
              qualifying income to submit a summary of business income and expenses to HMRC every
              quarter, in addition to the end-of-year return.
            </p>
          </div>
          <div>
            <p
              className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-light"
            >
              Where these figures came from
            </p>
            <p className="mt-1.5 text-[10.5px] leading-[1.65] text-text-light">
              Drawn from your FreeAgent bookkeeping at the period end, prepared by{' '}
              <span className="font-bold text-text">{data.brandName}</span>. Please review and
              flag anything unexpected — missing income, mis-categorised expenses — so we can
              correct it before submission.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHAT HAPPENS NEXT ═══════════════ */}
      <section className="px-[18mm] pt-[10mm]">
        <SectionLabel color={c.primary}>What happens next</SectionLabel>
        <p className="mt-2 text-[11px] leading-[1.7] text-text">
          Reply to your accountant confirming you&rsquo;re happy with the figures, or note any
          queries. Once approved we&rsquo;ll submit the return to HMRC on your behalf and confirm
          receipt.
        </p>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="mt-auto px-[18mm] pb-[14mm] pt-[14mm]">
        <span className="block h-px w-full bg-border" />
        <div className="mt-3 flex items-center justify-between text-[9px] text-text-light">
          <span className="font-semibold uppercase tracking-[0.18em]">{data.brandName}</span>
          <span>Prepared {fmtDateLong(data.preparedAt)}</span>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="block h-[2px] w-6" style={{ backgroundColor: color }} />
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {children}
      </h2>
    </div>
  );
}

function StatTile({
  label,
  value,
  color,
  emphasise = false,
}: {
  label: string;
  value: string;
  color: string;
  emphasise?: boolean;
}) {
  return (
    <div
      className="rounded-md border bg-white px-4 py-4"
      style={{
        borderColor: emphasise ? hexAlpha(color, 0.35) : hexAlpha(color, 0.15),
        backgroundColor: emphasise ? hexAlpha(color, 0.035) : '#ffffff',
      }}
    >
      <p
        className="text-[9px] font-bold uppercase tracking-[0.18em]"
        style={{ color: emphasise ? color : '#6b7280' }}
      >
        {label}
      </p>
      <p
        className="mt-2 font-extrabold tracking-tight"
        style={{
          color: emphasise ? color : '#0f172a',
          fontSize: emphasise ? '24px' : '21px',
          lineHeight: 1.05,
        }}
      >
        {value}
      </p>
    </div>
  );
}
