/**
 * MtdSummary — the MTD client-summary one-pager.
 *
 * Server component, rendered at A4 width and turned into a PDF by headless
 * Chrome (see /api/mtd-summary/pdf). Visual language matches the expenses
 * guide / onboarding guide: brand-gradient hero with logo card, big stat
 * tiles, designed callouts. Brand theming via data-brand + inline CSS vars
 * — same mechanism the other PDFs use.
 *
 * Deliberately single-page: the MTD return summary is meant to fit on one
 * sheet so a client can scan it in 20 seconds.
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
  const isWorkwell = data.brandId === 'workwell';

  const heroGradient = isWorkwell
    ? `linear-gradient(135deg, ${c.primary} 0%, ${c.primaryDark} 60%, ${c.secondary} 100%)`
    : `linear-gradient(135deg, ${c.primary} 0%, ${c.primaryDark} 100%)`;

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
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundImage: heroGradient }}
      >
        {/* top accent stripe */}
        <span className="block h-[6px] w-full" style={{ backgroundColor: c.secondary }} />

        {/* decorative shapes */}
        <span className="absolute -right-24 -top-20 h-[280px] w-[280px] rounded-full bg-white/[0.08]" />
        <span className="absolute right-16 top-32 h-32 w-32 rounded-full border-[1.5px] border-white/[0.15]" />
        <span
          className="absolute -bottom-24 -left-20 h-[240px] w-[240px] rounded-full"
          style={{ backgroundColor: hexAlpha(c.secondary, isWorkwell ? 0.45 : 0.22) }}
        />

        <div className="relative flex items-start justify-between px-[20mm] pt-[16mm]">
          {/* logo in white card */}
          <span className="inline-flex rounded-xl bg-white px-4 py-2.5 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={data.brandName} className="h-7 w-auto" />
          </span>

          {/* status pill */}
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[0.12] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm"
          >
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: data.isDraft ? c.secondary : '#10B981' }}
            />
            {data.isDraft ? 'Draft for review' : 'Submitted'}
          </span>
        </div>

        <div className="relative px-[20mm] pb-[16mm] pt-[10mm]">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/65">
            Quarterly MTD Return
          </p>
          <h1 className="mt-3 text-[36px] font-extrabold leading-[1.05] tracking-tight">
            {data.client.businessName || data.client.name}
          </h1>
          {data.client.businessName && data.client.name !== data.client.businessName && (
            <p className="mt-1 text-[13px] font-medium text-white/70">{data.client.name}</p>
          )}
          <div className="mt-5 h-[4px] w-16 rounded-full" style={{ backgroundColor: c.secondary }} />
          <p className="mt-5 text-[15px] font-semibold text-white/90">
            {periodLabel ? `${periodLabel} · ` : ''}
            {periodDates}
          </p>
        </div>
      </section>

      {/* ═══════════════ HERO FIGURES ═══════════════ */}
      <section className="grid grid-cols-3 gap-5 px-[20mm] pt-[10mm]">
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
      <section className="px-[20mm] pt-[8mm]">
        <div
          className="flex items-start gap-3 rounded-xl border-l-4 px-4 py-3"
          style={{
            borderLeftColor: c.secondary,
            backgroundColor: hexAlpha(c.secondary, 0.07),
          }}
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
            style={{ backgroundColor: c.secondary }}
          >
            !
          </span>
          <p className="text-[11px] leading-[1.6] text-text">
            <span className="font-extrabold">Indicative figures — use as a guide.</span>{' '}
            These totals can change: if you add, alter or amend transactions in FreeAgent after this
            return was prepared, or if our year-end review surfaces adjustments. Final figures are
            confirmed on the year-end Self Assessment.
          </p>
        </div>
      </section>

      {/* ═══════════════ MONTHLY BREAKDOWN ═══════════════ */}
      {data.monthly.length > 0 && (
        <section className="px-[20mm] pt-[14mm]">
          <div className="flex items-baseline gap-3">
            <span
              className="text-[34px] font-extrabold leading-[0.8]"
              style={{ color: c.primary, opacity: 0.14 }}
            >
              01
            </span>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.24em]"
                style={{ color: c.primary }}
              >
                Inside the quarter
              </p>
              <h2 className="mt-1 text-[20px] font-extrabold tracking-tight text-text">
                Monthly breakdown
              </h2>
            </div>
          </div>

          <div
            className="mt-5 overflow-hidden rounded-2xl border"
            style={{ borderColor: hexAlpha(c.primary, 0.16) }}
          >
            <table className="w-full text-[12px]">
              <thead>
                <tr
                  className="text-left"
                  style={{
                    backgroundColor: hexAlpha(c.primary, 0.05),
                    color: c.primary,
                  }}
                >
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">
                    Month end
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.16em]">
                    Income
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.16em]">
                    Expenses
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.16em]">
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
                    <td className="px-5 py-3 font-semibold text-text">{fmtMonthShort(m.monthEnd)}</td>
                    <td className="px-5 py-3 text-right text-text-light">{fmtMoney(m.income)}</td>
                    <td className="px-5 py-3 text-right text-text-light">{fmtMoney(m.expense)}</td>
                    <td
                      className="px-5 py-3 text-right font-extrabold"
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
      <section className="px-[20mm] pt-[12mm]">
        <div className="flex items-baseline gap-3">
          <span
            className="text-[34px] font-extrabold leading-[0.8]"
            style={{ color: c.primary, opacity: 0.14 }}
          >
            02
          </span>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.24em]"
              style={{ color: c.primary }}
            >
              About this return
            </p>
            <h2 className="mt-1 text-[20px] font-extrabold tracking-tight text-text">
              Making Tax Digital — Income Tax
            </h2>
          </div>
        </div>

        <div
          className="mt-5 grid grid-cols-2 gap-5 rounded-2xl border p-6"
          style={{
            borderColor: hexAlpha(c.primary, 0.16),
            backgroundColor: hexAlpha(c.primary, 0.035),
          }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">
              Why every quarter
            </p>
            <p className="mt-2 text-[12px] leading-[1.7] text-text-light">
              Making Tax Digital for Income Tax requires sole traders and landlords with qualifying
              income to submit a summary of business income and expenses to HMRC every quarter, in
              addition to the end-of-year return.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">
              Where these figures came from
            </p>
            <p className="mt-2 text-[12px] leading-[1.7] text-text-light">
              Drawn from your FreeAgent bookkeeping at the period end, prepared by{' '}
              <span className="font-bold text-text">{data.brandName}</span>. Please review and flag
              anything unexpected — missing income, mis-categorised expenses — so we can correct it
              before submission.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHAT HAPPENS NEXT ═══════════════ */}
      <section className="px-[20mm] pt-[12mm]">
        <div
          className="overflow-hidden rounded-2xl"
          style={{ backgroundImage: heroGradient }}
        >
          <div className="px-7 py-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
              What happens next
            </p>
            <h3 className="mt-2 text-[17px] font-extrabold tracking-tight">
              Reply to confirm — or flag any queries
            </h3>
            <p className="mt-2 text-[12.5px] leading-[1.7] text-white/85">
              Reply to your accountant confirming you&rsquo;re happy with the figures, or note any
              queries. Once approved we&rsquo;ll submit the return to HMRC on your behalf and
              confirm.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="mt-auto flex items-center justify-between px-[20mm] pb-[16mm] pt-[10mm] text-[10px] text-text-light">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={data.brandName} className="h-4 w-auto opacity-80" />
          <span className="font-semibold uppercase tracking-[0.18em] text-text-light">
            {data.brandName}
          </span>
        </div>
        <span>Prepared {fmtDateLong(data.preparedAt)}</span>
      </footer>
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
      className="rounded-2xl border bg-white px-5 py-5 shadow-[0_10px_25px_-15px_rgba(15,23,42,0.25)]"
      style={{
        borderColor: emphasise ? hexAlpha(color, 0.4) : hexAlpha(color, 0.14),
        backgroundColor: emphasise ? hexAlpha(color, 0.04) : '#ffffff',
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{ color: emphasise ? color : '#6b7280' }}
      >
        {label}
      </p>
      <p
        className="mt-2 font-extrabold tracking-tight"
        style={{
          color: emphasise ? color : '#0f172a',
          fontSize: emphasise ? '28px' : '24px',
          lineHeight: 1.05,
        }}
      >
        {value}
      </p>
    </div>
  );
}
