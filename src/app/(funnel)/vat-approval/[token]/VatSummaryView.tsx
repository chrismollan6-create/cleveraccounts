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
 * Native, responsive presentation of the VAT return — the headline net VAT, the 9-box return,
 * the month-by-month breakdown and anything the checks want them to look at.
 *
 * Table chrome is deliberately quiet: solid brand-blue header bars on every table made the page
 * read as three competing objects, and the client's eye should land on the figures. The brand
 * carries in the headline and the section rules instead.
 */
export default function VatSummaryView({ dto }: { dto: VatApprovalDto }) {
  const boxes = dto.boxes ?? [];
  const flaggedChecks = (dto.checks ?? []).filter((c) => c.status === 'Flagged');
  const months = dto.months ?? [];
  const noSalesMonths = months.filter((m) => m.noSales);
  const totals = months.reduce(
    (a, m) => ({
      sales: a.sales + (m.sales ?? 0),
      salesVat: a.salesVat + (m.salesVat ?? 0),
      purchases: a.purchases + (m.purchases ?? 0),
    }),
    { sales: 0, salesVat: 0, purchases: 0 },
  );
  const net = dto.netVatDue ?? null;
  const isReclaim = net != null && net < 0;
  const headlineLabel = isReclaim ? 'Net VAT to reclaim from HMRC' : 'Net VAT to pay to HMRC';
  const headlineValue = fmtMoney(net == null ? null : Math.abs(net));

  // Scheme is deliberately NOT shown. We hold it, but not always accurately, and stating
  // "Standard Rated Scheme" to a client who is on Flat Rate is the kind of small confident
  // error that costs us the benefit of the doubt on every figure above it.
  const meta = dto.basis ? `${dto.basis} basis` : '';

  return (
    <div className="space-y-8">
      {/* Headline — net VAT */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200">
        <span className="w-1.5 shrink-0 bg-primary" />
        <div className="flex-1 bg-primary/[0.03] px-5 py-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-light">
            {headlineLabel}
          </p>
          <p
            className={`mt-2 text-[2.5rem] leading-none font-bold tracking-tight tabular-nums ${
              isReclaim ? 'text-emerald-600' : 'text-text'
            }`}
          >
            {headlineValue}
          </p>
          <p className="mt-3 text-[13px] text-text-light">
            {fmtDay(dto.periodStart)} → {fmtDay(dto.periodEnd)}
            {meta ? ` · ${meta}` : ''}
          </p>
        </div>
      </div>

      {/* The 9-box VAT return */}
      {boxes.length > 0 && (
        <section>
          <SectionLabel>Your VAT return</SectionLabel>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <Th3 cols={['Box', 'Description', 'Value']} />
              </thead>
              <tbody>
                {boxes.map((b, i) => (
                  <tr
                    key={b.num ?? i}
                    className={`border-t border-gray-100 ${b.emphasise ? 'bg-primary/[0.04]' : ''}`}
                  >
                    <td
                      className={`px-4 py-2.5 whitespace-nowrap tabular-nums ${
                        b.emphasise ? 'font-bold text-text' : 'font-medium text-text-light'
                      }`}
                    >
                      {b.num}
                    </td>
                    <td className={`px-4 py-2.5 ${b.emphasise ? 'font-semibold text-text' : 'text-text-light'}`}>
                      {b.label}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right whitespace-nowrap tabular-nums ${
                        b.emphasise ? 'font-bold text-text' : 'text-text'
                      }`}
                    >
                      {fmtMoney(b.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      )}

      {/* Month by month — a quarter total can hide an income gap; months cannot. */}
      {months.length > 0 && (
        <section>
          <SectionLabel>Month by month</SectionLabel>
          <p className="mt-2.5 text-[13px] leading-relaxed text-text-light">
            {noSalesMonths.length > 0 ? (
              <>
                Please check this carefully. We haven&apos;t found any sales invoiced in{' '}
                <span className="font-semibold text-text">{noSalesMonths.map((m) => m.label).join(' or ')}</span>.
                If that&apos;s right, approve as normal. If you&apos;ve done work you haven&apos;t
                invoiced yet, please decline below and tell us — we&apos;ll hold the return.
              </>
            ) : (
              <>How the quarter breaks down, so you can sense-check the income we&apos;re reporting.</>
            )}
          </p>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left">
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-light">
                    Month
                  </th>
                  {['Sales', 'VAT on sales', 'Purchases'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-text-light whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.month} className={`border-t border-gray-100 ${m.noSales ? 'bg-amber-50/70' : ''}`}>
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-text">{m.label}</td>
                    <td
                      className={`px-4 py-2.5 text-right whitespace-nowrap tabular-nums ${
                        m.noSales ? 'font-bold text-amber-700' : 'text-text'
                      }`}
                    >
                      {m.noSales ? 'No sales invoiced' : fmtMoney(m.sales)}
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap tabular-nums text-text-light">
                      {fmtMoney(m.salesVat)}
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap tabular-nums text-text-light">
                      {fmtMoney(m.purchases)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-200 bg-gray-50/60">
                  <td className="px-4 py-2.5 font-bold text-text">Total</td>
                  {[totals.sales, totals.salesVat, totals.purchases].map((v, i) => (
                    <td
                      key={i}
                      className="px-4 py-2.5 text-right whitespace-nowrap tabular-nums font-bold text-text"
                    >
                      {fmtMoney(v)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Card>
        </section>
      )}

      {/* Housekeeping — mis-allocations we corrected or want the client to know about */}
      {(dto.housekeeping?.length ?? 0) > 0 && (
        <section>
          <SectionLabel>A little housekeeping</SectionLabel>
          <p className="mt-2.5 text-[13px] leading-relaxed text-text-light">
            While preparing your return we check the category on every transaction. A few items
            looked like they were filed under a different category to where they usually belong:
          </p>
          <ul className="mt-3 rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {dto.housekeeping!.map((n, i) => (
              <li key={i} className="px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                      n.fixed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {n.fixed ? "We've fixed this" : 'Worth checking'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {n.payee ?? 'Transaction'}
                      {n.amountText ? <span className="font-normal text-text-light"> · {n.amountText}</span> : null}
                      {n.txnDate ? <span className="font-normal text-text-light"> · {n.txnDate}</span> : null}
                    </p>
                    <p className="text-[13px] leading-relaxed text-text-light">
                      {n.fromCategory ? (
                        <>Was in <span className="font-medium text-text">{n.fromCategory}</span> — </>
                      ) : null}
                      {n.fixed ? (
                        <>we&apos;ve moved it to <span className="font-medium text-text">{n.toCategory}</span> for you.</>
                      ) : (
                        <>this looks like it belongs in <span className="font-medium text-text">{n.toCategory}</span>.
                        {' '}Could you move it when you get a moment — or just reply to let us know if it&apos;s deliberate.</>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[12px] leading-relaxed text-text-light">
            These don&apos;t hold up your approval — keeping categories tidy just makes your VAT and
            year-end accounts more accurate.
          </p>
        </section>
      )}

      {/* Checks that FOUND something. A passing check is our reassurance, not theirs: a wall of
          CLEAN rows describing our own mechanics is a page they scroll past, taking the one or
          two rows that need them with it. Nothing found, nothing shown. */}
      {flaggedChecks.length > 0 && (
        <section>
          <SectionLabel>Worth a look</SectionLabel>
          <p className="mt-2.5 text-[13px] leading-relaxed text-text-light">
            We check your bookkeeping for the quarter before we file. Everything else looked fine —
            {flaggedChecks.length === 1 ? ' this is the one' : ' these are the ones'} we&rsquo;d like
            you to cast an eye over:
          </p>
          <ul className="mt-3 rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {flaggedChecks.map((c, i) => (
              <li key={`${c.title}-${i}`} className="flex items-start gap-3 px-4 py-3.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-text">{c.title}</p>
                  <p className="text-[13px] leading-relaxed text-text-light">{c.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Rounded, clipped table shell that scrolls on its own rather than the page. */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Th3({ cols }: { cols: [string, string, string] | string[] }) {
  return (
    <tr className="bg-gray-50/80 text-left">
      {cols.map((c, i) => (
        <th
          key={c}
          className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-light whitespace-nowrap ${
            i === cols.length - 1 ? 'text-right' : ''
          }`}
        >
          {c}
        </th>
      ))}
    </tr>
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
