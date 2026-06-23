/**
 * MtdSummary — the MTD client-summary one-pager.
 *
 * Server component, rendered at A4 width and turned into a PDF by headless
 * Chrome (see /api/mtd-summary/pdf). Designed as a branded financial
 * document — restrained, single-page, but with consistent brand colour
 * throughout so it doesn't read as a plain Word doc.
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
      {/* ═══════════════ TOP COLOUR STRIPE ═══════════════ */}
      <span className="block h-[8px] w-full" style={{ backgroundColor: c.primary }} />
      <span className="block h-[3px] w-full" style={{ backgroundColor: c.secondary }} />

      {/* ═══════════════ DOCUMENT HEAD ═══════════════ */}
      <header className="px-[18mm] pt-[14mm]">
        <div className="flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={data.brandName} className="h-9 w-auto" />
          <div className="text-right">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: c.primary }}
            >
              Quarterly MTD Return
            </p>
            <p className="mt-1 text-[11px] font-semibold text-text-light">
              {data.isDraft ? 'Draft for client review' : 'Submitted to HMRC'}
            </p>
          </div>
        </div>

        {/* client + period row, sat on a soft brand tint */}
        <div
          className="mt-6 flex items-end justify-between gap-6 rounded-md border px-5 py-4"
          style={{
            backgroundColor: hexAlpha(c.primary, 0.045),
            borderColor: hexAlpha(c.primary, 0.18),
          }}
        >
          <div>
            <h1
              className="text-[30px] font-bold leading-[1.1] tracking-tight"
              style={{ color: c.text }}
            >
              {data.client.businessName || data.client.name}
            </h1>
            {data.client.businessName && data.client.name !== data.client.businessName && (
              <p className="mt-1 text-[13px] font-medium text-text-light">{data.client.name}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: c.primary }}
            >
              Period
            </p>
            <p className="mt-1 text-[14px] font-bold text-text">{periodLabel || '—'}</p>
            <p className="text-[11.5px] text-text-light">{periodDates}</p>
          </div>
        </div>
      </header>

      {/* ═══════════════ HEADLINE FIGURES ═══════════════ */}
      <section className="grid grid-cols-3 gap-4 px-[18mm] pt-[8mm]">
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
      <section className="px-[18mm] pt-[5mm]">
        <div
          className="flex items-start gap-3 rounded-md border-l-[4px] px-4 py-3"
          style={{
            borderLeftColor: c.secondary,
            backgroundColor: hexAlpha(c.secondary, 0.08),
          }}
        >
          <span
            className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: c.secondary }}
          >
            !
          </span>
          <p className="text-[11px] leading-[1.55] text-text">
            <span className="font-bold">Indicative figures — use as a guide.</span> These totals
            can change if you add, alter or amend transactions in FreeAgent after this return is
            prepared, or if our year-end review surfaces adjustments. Final figures are confirmed
            on the year-end Self Assessment.
          </p>
        </div>
      </section>

      {/* ═══════════════ FINANCIAL SUMMARY ═══════════════ */}
      {data.financialSummary && (
        <section className="px-[18mm] pt-[9mm]">
          <SectionLabel color={c.primary}>Summary</SectionLabel>
          <div
            className="mt-3 rounded-md border px-5 py-4"
            style={{
              borderColor: hexAlpha(c.primary, 0.18),
              backgroundColor: hexAlpha(c.primary, 0.035),
            }}
          >
            <p className="text-[11.5px] leading-[1.7] text-text">{data.financialSummary}</p>
          </div>
        </section>
      )}

      {/* ═══════════════ THINGS TO LOOK AT ═══════════════ */}
      {data.issues && data.issues.length > 0 && (
        <section className="px-[18mm] pt-[9mm]">
          <SectionLabel color={c.primary}>Things to look at</SectionLabel>
          <div
            className="mt-3 overflow-hidden rounded-md border"
            style={{ borderColor: hexAlpha(c.primary, 0.18) }}
          >
            <ul className="divide-y" style={{ borderColor: hexAlpha(c.primary, 0.1) }}>
              {data.issues.map((it, i) => (
                <li
                  key={`${it.title}-${i}`}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{
                    backgroundColor: i % 2 === 1 ? hexAlpha(c.primary, 0.025) : 'transparent',
                  }}
                >
                  <span
                    className="mt-1 block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: c.secondary }}
                  />
                  <div>
                    <p className="text-[11.5px] font-bold text-text">{it.title}</p>
                    <p className="mt-0.5 text-[11px] leading-[1.55] text-text-light">{it.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══════════════ MONTHLY BREAKDOWN ═══════════════ */}
      {data.monthly.length > 0 && (
        <section className="px-[18mm] pt-[9mm]">
          <SectionLabel color={c.primary}>Monthly breakdown</SectionLabel>
          <div
            className="mt-3 overflow-hidden rounded-md border"
            style={{ borderColor: hexAlpha(c.primary, 0.22) }}
          >
            <table className="w-full text-[12px]">
              <thead>
                <tr
                  className="text-left"
                  style={{
                    backgroundColor: c.primary,
                    color: '#ffffff',
                  }}
                >
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em]">
                    Month end
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em]">
                    Income
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em]">
                    Expenses
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em]">
                    Net profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.monthly.map((m, i) => (
                  <tr
                    key={m.monthEnd ?? i}
                    className="border-t"
                    style={{
                      borderColor: hexAlpha(c.primary, 0.1),
                      backgroundColor: i % 2 === 1 ? hexAlpha(c.primary, 0.025) : 'transparent',
                    }}
                  >
                    <td className="px-4 py-2.5 font-semibold text-text">{fmtMonthShort(m.monthEnd)}</td>
                    <td className="px-4 py-2.5 text-right text-text-light">{fmtMoney(m.income)}</td>
                    <td className="px-4 py-2.5 text-right text-text-light">{fmtMoney(m.expense)}</td>
                    <td
                      className="px-4 py-2.5 text-right font-bold"
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
      <section className="px-[18mm] pt-[9mm]">
        <SectionLabel color={c.primary}>About this return</SectionLabel>
        <div
          className="mt-3 grid grid-cols-2 gap-6 rounded-md border p-5"
          style={{
            borderColor: hexAlpha(c.primary, 0.18),
            backgroundColor: hexAlpha(c.primary, 0.035),
          }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: c.primary }}
            >
              Why every quarter
            </p>
            <p className="mt-2 text-[11.5px] leading-[1.65] text-text-light">
              Making Tax Digital for Income Tax requires sole traders and landlords with
              qualifying income to submit a summary of business income and expenses to HMRC every
              quarter, in addition to the end-of-year return.
            </p>
          </div>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: c.primary }}
            >
              Where these figures came from
            </p>
            <p className="mt-2 text-[11.5px] leading-[1.65] text-text-light">
              Drawn from your FreeAgent bookkeeping at the period end, prepared by{' '}
              <span className="font-bold text-text">{data.brandName}</span>. Please review and
              flag anything unexpected — missing income, mis-categorised expenses — so we can
              correct it before submission.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHAT HAPPENS NEXT ═══════════════ */}
      <section className="px-[18mm] pt-[9mm]">
        <SectionLabel color={c.primary}>What happens next</SectionLabel>
        <p className="mt-3 text-[12px] leading-[1.7] text-text">
          Reply to your accountant confirming you&rsquo;re happy with the figures, or note any
          queries. Once approved we&rsquo;ll submit the return to HMRC on your behalf and confirm
          receipt.
        </p>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="mt-auto px-[18mm] pb-[14mm] pt-[12mm]">
        <span
          className="block h-[2px] w-full rounded-full"
          style={{ backgroundColor: hexAlpha(c.primary, 0.4) }}
        />
        <div className="mt-3 flex items-center justify-between text-[10px] text-text-light">
          <span className="font-bold uppercase tracking-[0.18em]" style={{ color: c.primary }}>
            {data.brandName}
          </span>
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
      <span className="block h-[3px] w-7 rounded-full" style={{ backgroundColor: color }} />
      <h2
        className="text-[12px] font-bold uppercase tracking-[0.2em]"
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
      className="rounded-md border px-4 py-4"
      style={{
        borderColor: emphasise ? color : hexAlpha(color, 0.18),
        borderWidth: emphasise ? '1.5px' : '1px',
        backgroundColor: emphasise ? hexAlpha(color, 0.08) : '#ffffff',
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{ color: emphasise ? color : '#6b7280' }}
      >
        {label}
      </p>
      <p
        className="mt-2 font-bold tracking-tight"
        style={{
          color: emphasise ? color : '#0f172a',
          fontSize: emphasise ? '26px' : '22px',
          lineHeight: 1.05,
        }}
      >
        {value}
      </p>
    </div>
  );
}
