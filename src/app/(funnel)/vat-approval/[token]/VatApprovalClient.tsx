'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  MessageCircleQuestion,
  Loader2,
  Globe2,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import type { VatApprovalDto, ReverseCharge } from './page';
import VatSummaryView from './VatSummaryView';

function fmtDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

type Outcome = null | 'approved' | 'queried' | 'rechecking';
type Action = 'approve' | 'query' | 'recheck';

export default function VatApprovalClient({
  token,
  dto,
  brandEmail,
  brandPhone,
  initialOutcome = null,
}: {
  token: string;
  dto: VatApprovalDto;
  brandEmail: string;
  brandPhone: string;
  /** 'queried' when they come back to a return they've already raised a query on — they land on
   *  the queried state, where the "I've updated my books" button lives. */
  initialOutcome?: Outcome;
}) {
  const [outcome, setOutcome] = useState<Outcome>(initialOutcome);
  const [busy, setBusy] = useState<Action | null>(null);
  const [showQuery, setShowQuery] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const periodLabel = `${fmtDate(dto.periodStart)} → ${fmtDate(dto.periodEnd)}`;
  const heading = dto.clientName || 'your business';

  async function submit(kind: Action) {
    setBusy(kind);
    setError(null);
    try {
      const res = await fetch(`/api/vat-approval/${kind}?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: kind === 'query' ? JSON.stringify({ notes }) : '{}',
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }
      setOutcome(kind === 'approve' ? 'approved' : kind === 'query' ? 'queried' : 'rechecking');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  // ── Success states ──────────────────────────────────────────────
  if (outcome === 'approved') {
    return (
      <Centered>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thank you — VAT return approved</h1>
        <p className="text-text-light leading-relaxed mb-4">
          We&rsquo;ve recorded your approval of the VAT return for{' '}
          <span className="font-semibold text-text">{heading}</span>.
        </p>
        <WhatNext />
        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  if (outcome === 'rechecking') {
    return (
      <Centered>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
          <RefreshCw size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we&rsquo;re re-checking</h1>
        <p className="text-text-light leading-relaxed">
          We&rsquo;re pulling your latest figures through and running our checks again. If everything
          looks right we&rsquo;ll email you a fresh copy of the return to approve. If anything still
          needs a look, we&rsquo;ll be in touch. Nothing will be filed with HMRC until you&rsquo;ve
          approved it.
        </p>
        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  if (outcome === 'queried') {
    return (
      <Centered>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-primary bg-primary/10">
          <MessageCircleQuestion size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we&rsquo;ve got your question</h1>
        <p className="text-text-light leading-relaxed">
          We&rsquo;ve logged it and your accountant will take a look and come back to you before this
          VAT return is submitted. There&rsquo;s nothing else you need to do for now.
        </p>

        {/* The client's own way out of the queried state. Without this, a client who fixes their
            books sits waiting for us to notice — and we only notice by asking a human to look. */}
        <div className="mt-7 pt-6 border-t border-gray-100">
          <p className="text-sm font-semibold text-text mb-1">Made changes in FreeAgent?</p>
          <p className="text-[13px] leading-relaxed text-text-light mb-4">
            If you&rsquo;ve updated your records since, let us know and we&rsquo;ll re-run the return
            on your latest figures.
          </p>
          {error && (
            <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <button
            onClick={() => submit('recheck')}
            disabled={busy !== null}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {busy === 'recheck' ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} className="text-primary" />}
            {busy === 'recheck' ? 'Sending…' : "I've updated my books"}
          </button>
        </div>

        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  // ── Active approval view ────────────────────────────────────────
  return (
    <main className="min-h-[70vh] px-4 py-8 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Context header */}
          <div className="px-6 sm:px-9 pt-8 pb-6 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              VAT Return
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-text leading-tight">{heading}</h1>
            <p className="mt-1 text-sm text-text-light">{periodLabel}</p>
          </div>

          {/* Summary — rendered natively (chrome-free, on-brand, responsive) */}
          <div className="px-6 sm:px-9 pt-7">
            <VatSummaryView dto={dto} />
          </div>

          {/* The two things we need FROM them, above the buttons — a client who has already
              approved is not coming back to read a note underneath. */}
          {dto.reverseCharge && (
            <div className="px-6 sm:px-9 pt-6">
              <ReverseChargeSection rc={dto.reverseCharge} />
            </div>
          )}

          {dto.confirmIncomeNote && (
            <div className="px-6 sm:px-9 pt-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <TrendingDown size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text mb-1">
                      A quieter quarter than usual
                    </p>
                    <p className="text-[13px] leading-relaxed text-text-light">
                      {dto.confirmIncomeNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 sm:px-9 pt-7 pb-7 mt-7 border-t border-gray-100">
            <p className="text-sm leading-relaxed text-text-light mb-5">
              These figures come from your bookkeeping as it stands today, so they&rsquo;ll change if
              you add or amend anything in FreeAgent from here. Once you approve, we&rsquo;ll file
              the return with HMRC. If something doesn&rsquo;t look right, tell us instead —
              nothing is filed until you&rsquo;ve approved it.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              onClick={() => submit('approve')}
              disabled={busy !== null}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {busy === 'approve' ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {busy === 'approve' ? 'Submitting…' : 'Approve this VAT return'}
            </button>

            {!showQuery ? (
              <button
                onClick={() => setShowQuery(true)}
                disabled={busy !== null}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                <MessageCircleQuestion size={17} className="text-primary" />
                Something needs checking
              </button>
            ) : (
              <div className="mt-4 rounded-lg border border-gray-200 p-4">
                <label htmlFor="vat-query-notes" className="block text-sm font-semibold text-text mb-2">
                  What needs checking?
                </label>
                <textarea
                  id="vat-query-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  maxLength={5000}
                  placeholder="e.g. I've corrected the VAT on the Google Ads bills, or an invoice is missing, or why is the VAT higher than last quarter?"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => submit('query')}
                    disabled={busy !== null}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
                  >
                    {busy === 'query' ? <Loader2 size={16} className="animate-spin" /> : null}
                    {busy === 'query' ? 'Sending…' : 'Send to my accountant'}
                  </button>
                  <button
                    onClick={() => setShowQuery(false)}
                    disabled={busy !== null}
                    className="px-5 py-2.5 rounded-lg text-text-light font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-gray-100">
              <WhatNext />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-text-light">
          Questions? Email{' '}
          <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>{' '}
          or call{' '}
          <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>.
        </p>
      </div>
    </main>
  );
}

/**
 * VAT reclaimed on overseas suppliers — the only thing on this page we ask the client to go and
 * CHANGE rather than confirm.
 *
 * Almost always FreeAgent auto-applying 20% to an invoice billed from Ireland or Cyprus. There is
 * no UK VAT on those invoices to reclaim, so the return over-claims and the money is owed back to
 * HMRC. It is normally a standing setup issue rather than a one-off, which is why the client fixes
 * it: stripping the VAT ourselves each quarter corrects one return and nothing else.
 *
 * The supplier's country is right there in the bank narrative ("Google Ads ... Dublin Irl"), so the
 * table explains itself without us lecturing. We state the position plainly and let them look.
 */
function ReverseChargeSection({ rc }: { rc: ReverseCharge }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Globe2 size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-text">
              Please check these before you approve
            </p>
            <p className="text-[13px] leading-relaxed text-text-light mt-1">
              These look like overseas suppliers, but <strong className="text-text">{rc.totalVatText}</strong>{' '}
              of UK VAT has been reclaimed on them. Overseas suppliers don&rsquo;t normally charge UK
              VAT — so if there&rsquo;s no VAT on the invoice, there&rsquo;s none to reclaim, and
              claiming it means underpaying HMRC.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-5">
        <div className="overflow-x-auto rounded-lg border border-amber-200/80 bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left bg-gray-50/80 border-b border-gray-100">
                {['Date', 'Supplier', 'Amount', 'VAT claimed'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-light whitespace-nowrap ${
                      i >= 2 ? 'text-right' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rc.lines.map((l, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 text-text-light whitespace-nowrap tabular-nums">{l.txnDate}</td>
                  <td className="px-3 py-2 text-text">{l.payee}</td>
                  <td className="px-3 py-2 text-text-light text-right whitespace-nowrap tabular-nums">{l.amountText}</td>
                  <td className="px-3 py-2 text-text font-semibold text-right whitespace-nowrap tabular-nums">{l.vatText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rc.moreCount > 0 && (
          <p className="text-xs text-text-light mt-2">
            …and {rc.moreCount} more, included in the {rc.totalVatText} total.
          </p>
        )}
        <p className="text-[13px] leading-relaxed text-text-light mt-3">
          If we&rsquo;re right, please correct them in FreeAgent and use{' '}
          <strong className="text-text">Something needs checking</strong> below to tell us — we&rsquo;ll
          re-check and send the return back to you. If the invoices <em>do</em> show UK VAT, say so
          and we&rsquo;ll leave them alone.
        </p>
      </div>
    </div>
  );
}

function WhatNext() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-light mb-2">
        What happens next
      </p>
      <p className="text-[13px] leading-relaxed text-text-light">
        Once you approve, we submit your VAT return to HMRC on your behalf and email you a
        confirmation. There&rsquo;s nothing else you need to do.
      </p>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        {children}
      </div>
    </main>
  );
}

function HelpFooter({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
      <span>Need help?</span>
      <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
      <span className="text-gray-300 hidden sm:inline">·</span>
      <a className="text-primary hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
    </div>
  );
}
