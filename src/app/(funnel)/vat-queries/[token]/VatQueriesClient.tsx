'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  ListChecks,
  Wrench,
  Clock,
  ShieldCheck,
  LifeBuoy,
  HelpCircle,
} from 'lucide-react';
import type { QuerySection } from './page';

const CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

type Status = 'fixed' | 'correct' | 'question';
type Responses = Record<string, { status?: Status; note: string }>;

export default function VatQueriesClient({
  token,
  clientName,
  period,
  dueDate,
  sections,
  brandEmail,
  brandPhone,
  demo = false,
}: {
  token: string;
  clientName?: string;
  period?: string;
  dueDate?: string;
  sections: QuerySection[];
  brandEmail: string;
  brandPhone: string;
  /** Walkthrough mode (/vat-queries/preview): reaches the real thank-you screen without calling
   *  Salesforce, so the page can be demonstrated repeatedly with nothing to undo. */
  demo?: boolean;
}) {
  const [responses, setResponses] = useState<Responses>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setStatus = (code: string, status: Status) =>
    setResponses((r) => ({ ...r, [code]: { ...r[code], status, note: r[code]?.note ?? '' } }));
  const setNote = (code: string, note: string) =>
    setResponses((r) => ({ ...r, [code]: { ...r[code], note } }));

  // Two lists, because they ask two different things. A mis-posted category is worth telling
  // someone about but is not worth holding a VAT filing for, and burying the £3,000 question
  // among forty category suggestions is how the important one gets skimmed past.
  const needed = sections.filter((s) => !s.informational);
  const forInfo = sections.filter((s) => s.informational);

  // Progress counts only what we actually need an answer to.
  const answered = needed.filter((s) => responses[s.code]?.status).length;
  const allAnswered = answered === needed.length;
  const pct = needed.length ? Math.round((answered / needed.length) * 100) : 100;

  async function submit() {
    setBusy(true);
    setError(null);
    if (demo) {
      // Same busy → thank-you transition a client sees, without writing anything.
      await new Promise((r) => setTimeout(r, 550));
      setDone(true);
      setBusy(false);
      return;
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — that&apos;s everything we need</h1>
          <p className="text-text-light leading-relaxed mb-6">
            We&apos;ve got your answers and we&apos;re taking another look at your VAT return. If what you updated in
            FreeAgent clears it, we&apos;ll move it forward to file; if we need anything else, we&apos;ll be in touch.
            There&apos;s nothing else you need to do right now.
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
    <main className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-primary bg-primary/10 shrink-0">
          <ListChecks size={22} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text leading-tight">A few things to check</h1>
          {period && (
            <p className="text-sm text-text-light">
              VAT return{clientName ? ` for ${clientName}` : ''} · {period}
            </p>
          )}
        </div>
      </div>

      {/* Why this matters — visible on every screen */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3.5">
        <Clock size={20} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-900 leading-relaxed">
          <span className="font-semibold">We can&apos;t file your VAT return with HMRC until these are confirmed.</span>{' '}
          {dueDate ? (
            <>Your return is due by <span className="font-semibold">{dueDate}</span>, so please take a moment to answer the points below.</>
          ) : (
            <>Please take a moment to answer the points below so we can file it on time.</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Main column */}
        <div>
          <p className="text-text-light leading-relaxed mb-6">
            We&apos;ve reviewed your VAT return and there are a few points we&apos;d like you to look at.
            {/* {' '} after the span: JSX drops the newline between an element and the next line,
                which is what produced "FreeAgent firstand then tell us". */}
            Where something needs changing, please{' '}
            <span className="font-semibold">put it right in FreeAgent first</span>{' '}
            and then tell us you&apos;ve done it. If a point is already
            correct, say so. And if you&apos;re not sure what we mean, ask — we&apos;d far rather
            explain it than have you guess.
          </p>

          <div className="space-y-5">
            {needed.map((s, i) => {
              const r = responses[s.code];
              const isAnswered = !!r?.status;
              return (
                <section
                  key={s.code}
                  className={`p-5 sm:p-6 transition-colors ${CARD} ${
                    isAnswered ? 'ring-1 ring-emerald-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                        isAnswered ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {isAnswered ? <CheckCircle2 size={16} /> : i + 1}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-text">{s.title}</h2>
                      {/* What we've seen, in their words — then what we'd like them to do about
                          it. The page used to show only the instruction, so a client who got a
                          thin one had no idea what the point even was. */}
                      {s.meaning && <p className="text-text-light leading-relaxed mt-1.5">{s.meaning}</p>}
                      {s.instruction && <p className="text-text leading-relaxed mt-2">{s.instruction}</p>}
                    </div>
                  </div>

                  {s.lines.length > 0 && (
                    <div className="mt-4 sm:pl-9 overflow-x-auto">
                      <table className="w-full text-sm">
                        <tbody className="text-text-light">
                          {s.lines.map((l, j) => (
                            <tr key={j} className="border-t border-gray-100 first:border-t-0">
                              <td className="py-1.5 pr-4 whitespace-nowrap text-gray-400">{l.txnDate}</td>
                              <td className="py-1.5 pr-4">
                                {l.payee}
                                {/* Which category it's actually in. Telling someone a payee
                                    "looks like Mobile Phone — check the category" without saying
                                    which category it sits in leaves out the one fact they need. */}
                                {l.note && (
                                  <span className="block text-xs text-gray-400">{l.note}</span>
                                )}
                              </td>
                              <td className="py-1.5 pr-4 whitespace-nowrap text-right tabular-nums font-medium text-text">
                                {l.amountText}
                              </td>
                              <td className="py-1.5 whitespace-nowrap text-gray-400 tabular-nums">
                                {/* Not always "VAT". On "sales invoiced without VAT" the figure
                                    is what WOULD be due if they should have charged it, so
                                    labelling it VAT contradicted the heading above. */}
                                {l.vatText ? `${s.vatLabel ?? 'VAT'} ${l.vatText}` : ''}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Where there is no "this is correct" answer, say what to do BEFORE the buttons
                      rather than leaving them to work it out from a missing option. */}
                  {s.canConfirm === false && (
                    <p className="mt-4 sm:ml-9 rounded-xl border border-amber-100 bg-amber-50/70 px-3.5 py-2.5 text-sm text-amber-900">
                      <span className="font-semibold">Please sort these out in FreeAgent first</span>
                      , then come back and tell us you&apos;ve done it. We can&apos;t finish your
                      return until they&apos;re dealt with.
                    </p>
                  )}

                  <div className="mt-5 sm:pl-9 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStatus(s.code, 'fixed')}
                      className={`flex-1 whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        r?.status === 'fixed'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-text hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Wrench size={16} />{' '}
                      {s.canConfirm === false
                        ? "I've dealt with these in FreeAgent"
                        : "I've fixed this in FreeAgent"}
                    </button>
                    {s.canConfirm !== false && (
                    <button
                      type="button"
                      onClick={() => setStatus(s.code, 'correct')}
                      className={`flex-1 whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        r?.status === 'correct'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-text hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <CheckCircle2 size={16} /> These are correct
                    </button>
                    )}
                    {/* A client who doesn't understand must not have to guess. With only the two
                        buttons above, a confused client had to claim one of them — and a false
                        "these are correct" is worse than a question, because it closes the point
                        and we file on it. Asking is a real answer. */}
                    <button
                      type="button"
                      onClick={() => setStatus(s.code, 'question')}
                      className={`flex-1 whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        r?.status === 'question'
                          ? 'border-amber-500 bg-amber-500 text-white'
                          : 'border-gray-200 text-text hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <HelpCircle size={16} /> I&apos;m not sure — ask us
                    </button>
                  </div>

                  <textarea
                    value={r?.note ?? ''}
                    onChange={(e) => setNote(s.code, e.target.value)}
                    placeholder={
                      r?.status === 'question'
                        ? 'What would you like us to explain?'
                        : "Anything you'd like to add (optional)…"
                    }
                    rows={2}
                    className="mt-3 sm:ml-9 w-[calc(100%-0px)] sm:w-[calc(100%-2.25rem)] rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </section>
              );
            })}
          </div>

          {/* FOR INFORMATION. Nothing here holds up the return, so nothing here asks for an
              answer or counts towards the progress above — it is below the fold of the real
              questions on purpose. */}
          {forInfo.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-text-light mb-1">
                Also worth knowing
              </h2>
              <p className="text-sm text-text-light mb-4">
                These don&apos;t affect your VAT or hold up the return — we just spotted them while
                we were in there. Nothing to do unless you&apos;d like them changed, in which case
                reply and we&apos;ll sort it.
              </p>
              <div className="space-y-4">
                {forInfo.map((s) => (
                  <section key={s.code} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/60">
                    <h3 className="font-semibold text-text">{s.title}</h3>
                    {s.meaning && <p className="text-sm text-text-light leading-relaxed mt-1">{s.meaning}</p>}
                    {s.lines.length > 0 && (
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <tbody className="text-text-light">
                            {s.lines.map((l, j) => (
                              <tr key={j} className="border-t border-gray-200/70 first:border-t-0">
                                <td className="py-1.5 pr-4 whitespace-nowrap text-gray-400">{l.txnDate}</td>
                                <td className="py-1.5 pr-4">
                                  {l.payee}
                                  {l.note && <span className="block text-xs text-gray-400">{l.note}</span>}
                                </td>
                                <td className="py-1.5 whitespace-nowrap text-right tabular-nums font-medium text-text">
                                  {l.amountText}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {s.txnCount > s.lines.length && (
                          <p className="mt-2 text-xs text-gray-400">
                            and {s.txnCount - s.lines.length} more like these
                          </p>
                        )}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </section>
          )}

          {error && (
            <p className="mt-6 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-text-light">
              {answered} of {needed.length} answered
            </span>
            <div className="flex flex-col items-end">
              <button
                type="button"
                onClick={submit}
                disabled={busy || !allAnswered}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                I&apos;ve dealt with these
              </button>
              {!allAnswered && (
                <p className="mt-2 text-xs text-text-light">Please answer each point before sending back.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="lg:sticky lg:top-8 space-y-4">
          <div className={`p-5 ${CARD}`}>
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <span className="text-text-light">Progress</span>
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text tabular-nums">{answered}</span>
              <span className="text-sm text-text-light">of {needed.length} answered</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className={`p-5 ${CARD}`}>
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" /> What happens next
            </h3>
            <ol className="space-y-3">
              {[
                'You confirm or fix each point below.',
                'We re-check your return against your figures.',
                'Once it’s clear, we file it with HMRC.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-light leading-snug">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={`p-5 ${CARD}`}>
            <h3 className="text-sm font-semibold text-text mb-2 flex items-center gap-2">
              <LifeBuoy size={16} className="text-primary" /> Need a hand?
            </h3>
            <p className="text-sm text-text-light leading-relaxed mb-3">
              Not sure about something? We&apos;re happy to talk it through.
            </p>
            <div className="text-sm space-y-1">
              <a className="block text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>
              <a className="block text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
