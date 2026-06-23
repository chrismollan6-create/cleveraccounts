import type { MtdSummaryData } from '@/content/mtd-summary';

function fmtMoney(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtMonth(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Net profit coloured by sign — a loss reads red, a profit reads positive. */
function netClass(n: number | null | undefined): string {
  if (n == null) return 'text-text';
  if (n < 0) return 'text-rose-600';
  return 'text-emerald-600';
}

/**
 * Native, responsive presentation of the MTD quarterly summary — the same data
 * the PDF is built from (totals / monthly / things-to-look-at), rendered as HTML
 * so it's consistently on-brand and chrome-free across every client's browser.
 */
export default function SummaryView({ summary }: { summary: MtdSummaryData }) {
  const t = summary.totals ?? { totalIncome: null, totalExpenses: null, netProfit: null };
  const issues = summary.issues ?? [];
  const monthly = summary.monthly ?? [];

  return (
    <div className="space-y-6">
      {/* Headline totals */}
      <div className="grid grid-cols-3 rounded-xl border border-gray-200 overflow-hidden">
        <Tile label="Total income" value={fmtMoney(t.totalIncome)} />
        <Tile label="Total expenses" value={fmtMoney(t.totalExpenses)} divider />
        <Tile
          label="Net profit"
          value={fmtMoney(t.netProfit)}
          valueClass={netClass(t.netProfit)}
          divider
        />
      </div>

      {/* Financial summary (fact-based narrative) */}
      {summary.financialSummary && (
        <div>
          <SectionLabel>Summary</SectionLabel>
          <p className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] leading-relaxed text-text">
            {summary.financialSummary}
          </p>
        </div>
      )}

      {/* Things to look at */}
      {issues.length > 0 && (
        <div>
          <SectionLabel>Things to look at</SectionLabel>
          <ul className="mt-2 rounded-lg border border-gray-200 divide-y divide-gray-100">
            {issues.map((it, i) => (
              <li key={`${it.title}-${i}`} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-text">{it.title}</p>
                  <p className="text-[13px] leading-relaxed text-text-light">{it.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Monthly breakdown */}
      {monthly.length > 0 && (
        <div>
          <SectionLabel>Monthly breakdown</SectionLabel>
          <div className="mt-2 rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white text-left">
                    <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide">Month end</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide">Income</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide">Expenses</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide">Net profit</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((m, i) => (
                    <tr key={m.monthEnd ?? i} className="border-t border-gray-100">
                      <td className="px-4 py-2.5 font-medium text-text whitespace-nowrap">{fmtMonth(m.monthEnd)}</td>
                      <td className="px-4 py-2.5 text-right text-text-light">{fmtMoney(m.income)}</td>
                      <td className="px-4 py-2.5 text-right text-text-light">{fmtMoney(m.expense)}</td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${netClass(m.profit)}`}>{fmtMoney(m.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({
  label,
  value,
  valueClass = 'text-text',
  divider,
}: {
  label: string;
  value: string;
  valueClass?: string;
  divider?: boolean;
}) {
  return (
    <div className={`px-3 sm:px-5 py-4 text-center ${divider ? 'border-l border-gray-200' : ''}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-light">{label}</p>
      <p className={`mt-1.5 text-base sm:text-xl font-bold tracking-tight ${valueClass}`}>{value}</p>
    </div>
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
