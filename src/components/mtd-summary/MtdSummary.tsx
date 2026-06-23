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

type NarrativeBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

/** Parse a plain-text summary (newlines + "- " bullets) into paragraphs and lists. */
function parseNarrative(text: string): NarrativeBlock[] {
  const blocks: NarrativeBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: list });
      list = [];
    }
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const m = line.match(/^[-•*]\s+(.*)/);
    if (m) {
      flushPara();
      list.push(m[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export default function MtdSummary({ data }: { data: MtdSummaryData }) {
  const brand = BRANDS[data.brandId];
  const logo = `/brand/${data.brandId}/logo.png`;
  const c = brand.colors;

  const periodLabel = `${data.period.quarter ? data.period.quarter + ' ' : ''}${
    data.period.taxYear ?? ''
  }`.trim();
  const periodDates = `${fmtDateLong(data.period.startDate)} → ${fmtDateLong(data.period.endDate)}`;
  const net = data.totals.netProfit ?? 0;
  const isLoss = net < 0;
  const LOSS = '#dc2626'; // red-600
  const netColor = isLoss ? LOSS : c.primary;

  return (
    <div
      data-brand={data.brandId}
      className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white font-sans text-text"
      style={
        {
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
      {/* ═══════════════ BRANDED HERO ═══════════════ */}
      <div
        className="px-[18mm] pb-[7mm] pt-[12mm]"
        style={{ background: `linear-gradient(135deg, ${c.primaryDark} 0%, ${c.primary} 100%)` }}
      >
        <div className="flex items-start justify-between">
          <div className="inline-flex rounded-lg bg-white px-3.5 py-2.5 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={data.brandName} className="h-7 w-auto" />
          </div>
          <div className="text-right">
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-white">
              Quarterly MTD Return
            </p>
            <p className="mt-1 text-[11px] font-medium" style={{ color: hexAlpha('#ffffff', 0.8) }}>
              {data.isDraft ? 'Draft for client review' : 'Submitted to HMRC'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: c.secondaryLight }}
            >
              Prepared for
            </p>
            <h1 className="mt-1.5 text-[29px] font-bold leading-[1.04] tracking-tight text-white">
              {data.client.businessName || data.client.name}
            </h1>
            {data.client.businessName && data.client.name !== data.client.businessName && (
              <p className="mt-1 text-[13px] font-medium" style={{ color: hexAlpha('#ffffff', 0.75) }}>
                {data.client.name}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            {periodLabel && (
              <span
                className="inline-block rounded-md px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ backgroundColor: hexAlpha('#ffffff', 0.16) }}
              >
                {periodLabel}
              </span>
            )}
            <p className="mt-2 text-[11.5px]" style={{ color: hexAlpha('#ffffff', 0.85) }}>
              {periodDates}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════ HEADLINE FIGURES ═══════════════ */}
      <section className="grid grid-cols-3 gap-4 px-[18mm] pt-[6mm]">
        <StatTile label="Total income" value={fmtMoney(data.totals.totalIncome)} accent={c.primary} />
        <StatTile label="Total expenses" value={fmtMoney(data.totals.totalExpenses)} accent={c.primary} />
        <StatTile
          label={isLoss ? 'Net loss' : 'Net profit'}
          value={fmtMoney(data.totals.netProfit)}
          accent={netColor}
          solid
        />
      </section>

      {/* ═══════════════ CAVEAT STRIP ═══════════════ */}
      <section className="px-[18mm] pt-[6mm]">
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
          <p className="text-[10.5px] leading-[1.5] text-text">
            <span className="font-bold">Indicative figures — use as a guide.</span> These can change
            if transactions are added or amended in FreeAgent, or if our year-end review surfaces
            adjustments. Final figures are confirmed on the year-end Self Assessment.
          </p>
        </div>
      </section>

      {/* ═══════════════ FINANCIAL SUMMARY ═══════════════ */}
      {data.financialSummary && (
        <section className="px-[18mm] pt-[6mm]">
          <SectionLabel color={c.primary}>Summary</SectionLabel>
          <div
            className="mt-3 overflow-hidden rounded-md border"
            style={{ borderColor: hexAlpha(c.primary, 0.18) }}
          >
            <div className="flex">
              <span className="w-[5px] shrink-0" style={{ backgroundColor: c.secondary }} />
              <div className="space-y-2.5 px-5 py-4 text-[11.5px] leading-[1.7] text-text">
                {parseNarrative(data.financialSummary).map((b, i) =>
                  b.type === 'p' ? (
                    <p key={i}>{b.text}</p>
                  ) : (
                    <ul key={i} className="space-y-1.5">
                      {b.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <span
                            className="mt-[6px] block h-[5px] w-[5px] shrink-0 rounded-full"
                            style={{ backgroundColor: c.secondary }}
                          />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ THINGS TO LOOK AT (fallback only — the AI summary
           covers actions when present, so we don't repeat them) ═══════════════ */}
      {!data.financialSummary && data.issues && data.issues.length > 0 && (
        <section className="px-[18mm] pt-[6mm]">
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
        <section className="px-[18mm] pt-[6mm]">
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
                  <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em]">
                    Month end
                  </th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-[0.14em]">
                    Income
                  </th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-[0.14em]">
                    Expenses
                  </th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-[0.14em]">
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
                    <td className="px-4 py-2 font-semibold text-text">{fmtMonthShort(m.monthEnd)}</td>
                    <td className="px-4 py-2 text-right text-text-light">{fmtMoney(m.income)}</td>
                    <td className="px-4 py-2 text-right text-text-light">{fmtMoney(m.expense)}</td>
                    <td
                      className="px-4 py-2 text-right font-bold"
                      style={{ color: (m.profit ?? 0) < 0 ? LOSS : c.primary }}
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

      {/* ═══════════════ WHAT HAPPENS NEXT (boilerplate, condensed) ═══════════════ */}
      <section className="px-[18mm] pt-[6mm]">
        <SectionLabel color={c.primary}>What happens next</SectionLabel>
        <div
          className="mt-2.5 rounded-md px-5 py-3"
          style={{ backgroundColor: hexAlpha(c.primary, 0.04) }}
        >
          <p className="text-[11px] leading-[1.6] text-text">
            Reply to your accountant confirming you&rsquo;re happy with the figures, or note any
            queries — once approved we&rsquo;ll submit the return to HMRC and confirm receipt. These
            figures are drawn from your FreeAgent bookkeeping and prepared by{' '}
            <span className="font-semibold">{data.brandName}</span>; MTD requires a quarterly
            income-and-expense summary to HMRC alongside the year-end return.
          </p>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="mt-auto px-[18mm] pb-[9mm] pt-[6mm]">
        <div
          className="flex items-center justify-between rounded-md px-5 py-3"
          style={{ backgroundColor: c.primary }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            {data.brandName}
          </span>
          <span className="text-[10px]" style={{ color: hexAlpha('#ffffff', 0.8) }}>
            Prepared {fmtDateLong(data.preparedAt)}
          </span>
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
  accent,
  solid = false,
}: {
  label: string;
  value: string;
  accent: string;
  solid?: boolean;
}) {
  if (solid) {
    return (
      <div className="rounded-lg px-5 py-[13px]" style={{ backgroundColor: accent }}>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: hexAlpha('#ffffff', 0.85) }}
        >
          {label}
        </p>
        <p className="mt-1.5 text-[25px] font-bold tracking-tight text-white" style={{ lineHeight: 1.05 }}>
          {value}
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: hexAlpha(accent, 0.2) }}>
      <span className="block h-[3px] w-full" style={{ backgroundColor: accent }} />
      <div className="px-5 py-[13px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">{label}</p>
        <p className="mt-1.5 text-[22px] font-bold tracking-tight" style={{ color: '#0f172a', lineHeight: 1.05 }}>
          {value}
        </p>
      </div>
    </div>
  );
}
