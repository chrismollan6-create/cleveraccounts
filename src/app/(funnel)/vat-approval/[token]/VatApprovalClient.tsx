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
  ReceiptText,
  Ban,
  Car,
  HardHat,
  FolderTree,
  type LucideIcon,
} from 'lucide-react';
import type { VatApprovalDto, ReverseCharge, FindingGroup } from './page';
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

  // Prefer the new grouped findings; fall back to the deprecated single reverse-charge payload so
  // a page served from a not-yet-updated deploy still renders that section. Drop the fallback once
  // the Apex change has been live a release.
  const groups: FindingGroup[] =
    dto.groups && dto.groups.length > 0
      ? dto.groups
      : dto.reverseCharge
        ? [reverseChargeAsGroup(dto.reverseCharge)]
        : [];

  // What the rail warns about — everything on the page asking for their eye, counted the same
  // way they'd count it. Must stay in step with what actually renders.
  const attention =
    groups.length +
    (dto.confirmIncomeNote ? 1 : 0) +
    (dto.checks ?? []).filter((c) => c.status === 'Flagged').length +
    (dto.housekeeping ?? []).filter((h) => !h.fixed).length;

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
  // Two columns from lg up: the figures they read on the left, the decision they make on the
  // right, pinned. The single narrow column meant Approve sat below a full quarter's worth of
  // tables — on a wide screen the client scrolled past the return to reach the thing the page
  // exists for, and the rest of the viewport was white space. Below lg it stacks back to one
  // column and the actions land at the foot, which is the right place on a phone.
  return (
    <main className="min-h-[70vh] px-4 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6 lg:items-start">
        {/* ── Left: the return itself ── */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Context header */}
          <div className="px-6 sm:px-9 pt-8 pb-6 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              VAT Return
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-text leading-tight">{heading}</h1>
            <p className="mt-1 text-sm text-text-light">{periodLabel}</p>
          </div>

          <div className="px-6 sm:px-9 py-7 space-y-8">
            {/* Summary — rendered natively (chrome-free, on-brand, responsive) */}
            <VatSummaryView dto={dto} />

            {/* The things we need FROM them. Last in the column, nearest the buttons. Each check
                that flagged something renders with its actual transactions, so the client can go
                and settle it rather than emailing us to ask which payment we mean. */}
            {groups.map((g) => (
              <FindingGroupSection key={g.code} group={g} />
            ))}

            {dto.confirmIncomeNote && (
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
            )}
          </div>
        </div>

        {/* ── Right: the decision, pinned ── */}
        <aside className="mt-5 lg:mt-0 lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
            <p className="text-sm font-semibold text-text mb-1.5">Ready to approve?</p>
            <p className="text-[13px] leading-relaxed text-text-light">
              These figures come from your bookkeeping as it stands today, so they&rsquo;ll change if
              you amend anything in FreeAgent from here. Nothing is filed until you approve.
            </p>

            {attention > 0 && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[13px] leading-relaxed text-amber-800">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>
                  {attention === 1 ? "There's one thing" : `There are ${attention} things`}
                  {' '}we&rsquo;d like you to look at first.
                </span>
              </p>
            )}

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              onClick={() => submit('approve')}
              disabled={busy !== null}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {busy === 'approve' ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {busy === 'approve' ? 'Submitting…' : 'Approve this VAT return'}
            </button>

            {!showQuery ? (
              <button
                onClick={() => setShowQuery(true)}
                disabled={busy !== null}
                className="w-full mt-2.5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                <MessageCircleQuestion size={17} className="text-primary" />
                Something needs checking
              </button>
            ) : (
              <div className="mt-4 rounded-lg border border-gray-200 p-3.5">
                <label htmlFor="vat-query-notes" className="block text-sm font-semibold text-text mb-2">
                  What needs checking?
                </label>
                <textarea
                  id="vat-query-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  maxLength={5000}
                  placeholder="e.g. I've corrected the VAT on the Google Ads bills, or an invoice is missing, or why is the VAT higher than last quarter?"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                {/* Amber, not primary blue: on this page amber means "something needs you", and a
                    second blue button beside Approve reads as a second way to say yes. */}
                <button
                  onClick={() => submit('query')}
                  disabled={busy !== null}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
                >
                  {busy === 'query' ? <Loader2 size={16} className="animate-spin" /> : null}
                  {busy === 'query' ? 'Sending…' : 'Send to my accountant'}
                </button>
                <button
                  onClick={() => setShowQuery(false)}
                  disabled={busy !== null}
                  className="w-full mt-1.5 px-5 py-2 rounded-lg text-text-light text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100">
              <WhatNext />
            </div>
          </div>

          <p className="px-1 text-center text-xs leading-relaxed text-text-light">
            Questions? Email{' '}
            <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>{' '}
            or call{' '}
            <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>.
          </p>
        </aside>
      </div>
    </main>
  );
}

/** Bridge the deprecated single reverse-charge payload onto the general group shape. */
function reverseChargeAsGroup(rc: ReverseCharge): FindingGroup {
  return {
    code: 'TXN_RC_OVERCLAIM',
    title: 'VAT reclaimed on overseas suppliers',
    intro:
      `These look like overseas suppliers, but ${rc.totalVatText} of UK VAT has been reclaimed on ` +
      `them. Overseas suppliers don't normally charge UK VAT — so if there's no VAT on the invoice, ` +
      `there's none to reclaim, and claiming it means underpaying HMRC.`,
    action:
      `If we're right, please correct them in FreeAgent and tell us — we'll re-check and send the ` +
      `return back to you. If the invoices do show UK VAT, just continue and click Approve.`,
    totalVatText: rc.totalVatText,
    showVat: true,
    lines: rc.lines,
    moreCount: rc.moreCount,
  };
}

/**
 * A check that flagged something, with its actual transactions listed.
 *
 * The pattern each of these follows: state the position plainly (the bank narrative usually
 * carries the reason — "Google Ads … Dublin Irl", "AXA Insurance"), list the payments so the
 * client can recognise them, and always give both ways out — fix it, or tell us it's right and
 * approve. A section that only describes a problem strands the client, and a stranded client
 * emails us, which is the human touch this is meant to remove.
 */
const GROUP_ICONS: Record<string, LucideIcon> = {
  TXN_RC_OVERCLAIM: Globe2,
  TXN_VAT_ON_EXEMPT: ReceiptText,
  TXN_BLOCKED_VAT: Ban,
  TXN_CAR_LEASE: Car,
  TXN_UNEXPECTED_VAT: HardHat,
  TXN_ACCY_NO_VAT: ReceiptText,
  TXN_MISPOST_AI: FolderTree,
};

function FindingGroupSection({ group }: { group: FindingGroup }) {
  const g = group;
  const Icon = GROUP_ICONS[g.code] ?? ReceiptText;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Icon size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-text">{g.title}</p>
            <p className="text-[13px] leading-relaxed text-text-light mt-1">{g.intro}</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-5">
        <div className="overflow-x-auto rounded-lg border border-amber-200/80 bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left bg-gray-50/80 border-b border-gray-100">
                <Th>Date</Th>
                <Th>{g.showVat ? 'Supplier' : 'Item'}</Th>
                <Th right>Amount</Th>
                {g.showVat && <Th right>VAT claimed</Th>}
              </tr>
            </thead>
            <tbody>
              {g.lines.map((l, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 text-text-light whitespace-nowrap tabular-nums align-top">{l.txnDate}</td>
                  <td className="px-3 py-2 text-text">
                    {l.payee}
                    {l.note && <span className="block text-[12px] text-text-light">{l.note}</span>}
                  </td>
                  <td className="px-3 py-2 text-text-light text-right whitespace-nowrap tabular-nums align-top">{l.amountText}</td>
                  {g.showVat && (
                    <td className="px-3 py-2 text-text font-semibold text-right whitespace-nowrap tabular-nums align-top">{l.vatText}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {g.moreCount > 0 && (
          <p className="text-xs text-text-light mt-2">
            …and {g.moreCount} more
            {g.totalVatText ? `, included in the ${g.totalVatText} total` : ''}.
          </p>
        )}
        <p className="text-[13px] leading-relaxed text-text-light mt-3">{g.action}</p>
      </div>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-light whitespace-nowrap ${
        right ? 'text-right' : ''
      }`}
    >
      {children}
    </th>
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
