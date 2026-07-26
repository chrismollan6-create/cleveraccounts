'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, ListChecks } from 'lucide-react';
import type { QuerySection } from './page';

const CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

type Status = 'fixed' | 'correct';
type Responses = Record<string, { status?: Status; note: string }>;

export default function VatQueriesClient({
  token,
  clientName,
  period,
  sections,
  brandEmail,
  brandPhone,
}: {
  token: string;
  clientName?: string;
  period?: string;
  sections: QuerySection[];
  brandEmail: string;
  brandPhone: string;
}) {
  const [responses, setResponses] = useState<Responses>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setStatus = (code: string, status: Status) =>
    setResponses((r) => ({ ...r, [code]: { ...r[code], status, note: r[code]?.note ?? '' } }));
  const setNote = (code: string, note: string) =>
    setResponses((r) => ({ ...r, [code]: { ...r[code], note } }));

  const answered = sections.filter((s) => responses[s.code]?.status).length;
  const allAnswered = answered === sections.length;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const checks: Record<string, { status?: Status; note: string }> = {};
      for (const s of sections) {
        const r = responses[s.code];
        if (r?.status) checks[s.code] = { status: r.status, note: r.note ?? '' };
      }
      const res = await fetch(`/api/vat-queries/respond?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checks }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className={`max-w-lg w-full p-8 sm:p-10 ${CARD}`}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — that's everything we need for now</h1>
          <p className="text-text-light leading-relaxed mb-6">
            We've got your answers and we're taking another look at your VAT return. If anything you updated in
            FreeAgent clears it, we'll move it forward; if we need anything else, we'll be in touch. There's nothing
            else you need to do right now.
          </p>
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
            <span>Need help?</span>
            <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary bg-primary/10">
          <ListChecks size={22} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text leading-tight">A few things to check</h1>
          {period && <p className="text-sm text-text-light">VAT return{clientName ? ` for ${clientName}` : ''} · {period}</p>}
        </div>
      </div>
      <p className="text-text-light leading-relaxed mb-8">
        We've reviewed your VAT return and there are a few points we'd like you to confirm or correct before we file
        it. For each one, either fix it in FreeAgent or let us know it's correct, then send it back to us.
      </p>

      <div className="space-y-5">
        {sections.map((s) => {
          const r = responses[s.code];
          return (
            <section key={s.code} className={`p-5 sm:p-6 ${CARD}`}>
              <h2 className="text-lg font-semibold text-text">{s.title}</h2>
              {s.instruction && <p className="text-text-light leading-relaxed mt-1.5">{s.instruction}</p>}

              {s.lines.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="text-text-light">
                      {s.lines.map((l, i) => (
                        <tr key={i} className="border-t border-gray-100 first:border-t-0">
                          <td className="py-1.5 pr-4 whitespace-nowrap text-gray-400">{l.txnDate}</td>
                          <td className="py-1.5 pr-4">{l.payee}</td>
                          <td className="py-1.5 pr-4 whitespace-nowrap text-right tabular-nums">{l.amountText}</td>
                          <td className="py-1.5 whitespace-nowrap text-gray-400 tabular-nums">
                            {l.vatText ? `VAT ${l.vatText}` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(s.code, 'fixed')}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                    r?.status === 'fixed'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-text hover:border-gray-300'
                  }`}
                >
                  I've fixed this in FreeAgent
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(s.code, 'correct')}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                    r?.status === 'correct'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-text hover:border-gray-300'
                  }`}
                >
                  These are correct
                </button>
              </div>

              <textarea
                value={r?.note ?? ''}
                onChange={(e) => setNote(s.code, e.target.value)}
                placeholder="Anything you'd like to add (optional)…"
                rows={2}
                className="mt-3 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </section>
          );
        })}
      </div>

      {error && (
        <p className="mt-6 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <span className="text-sm text-text-light">{answered} of {sections.length} answered</span>
        <button
          type="button"
          onClick={submit}
          disabled={busy || !allAnswered}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          I've dealt with these
        </button>
      </div>
      {!allAnswered && (
        <p className="mt-2 text-right text-xs text-text-light">Please answer each point before sending back.</p>
      )}
    </main>
  );
}
