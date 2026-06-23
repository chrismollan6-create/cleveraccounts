'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  MessageSquareWarning,
  Loader2,
  ExternalLink,
  FileText,
} from 'lucide-react';
import type { MtdApprovalDto } from './page';

function fmtDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

type Outcome = null | 'approved' | 'queried';

export default function MtdApprovalClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: MtdApprovalDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [busy, setBusy] = useState<'approve' | 'query' | null>(null);
  const [showQuery, setShowQuery] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const periodLabel = `${dto.quarter ? dto.quarter + ' ' : ''}${dto.taxYear ?? ''}`.trim();
  const heading = dto.businessName || dto.clientName || 'your business';
  const pdfUrl = `/api/mtd-approval/pdf?t=${encodeURIComponent(token)}`;

  async function submit(kind: 'approve' | 'query') {
    setBusy(kind);
    setError(null);
    try {
      const res = await fetch(`/api/mtd-approval/${kind}?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: kind === 'query' ? JSON.stringify({ notes }) : '{}',
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }
      setOutcome(kind === 'approve' ? 'approved' : 'queried');
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
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thank you — figures approved</h1>
        <p className="text-text-light leading-relaxed mb-4">
          We&rsquo;ve recorded your approval of the {periodLabel || 'quarterly'} figures for{' '}
          <span className="font-semibold text-text">{heading}</span>.
        </p>
        <WhatNext />
        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  if (outcome === 'queried') {
    return (
      <Centered>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-amber-600 bg-amber-50">
          <MessageSquareWarning size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we&rsquo;ll take a look</h1>
        <p className="text-text-light leading-relaxed">
          Your query has been sent to your accountant, who will review what you&rsquo;ve flagged
          before this quarter is submitted. We&rsquo;ll be in touch — there&rsquo;s nothing else you
          need to do for now.
        </p>
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
              Quarterly MTD Return{periodLabel ? ` · ${periodLabel}` : ''}
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-text leading-tight">{heading}</h1>
            <p className="mt-1 text-sm text-text-light">
              {fmtDate(dto.periodStart)} → {fmtDate(dto.periodEnd)}
            </p>
          </div>

          {/* Summary PDF — the document being approved */}
          <div className="px-6 sm:px-9 pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-text inline-flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Your quarterly summary
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Open in new tab <ExternalLink size={13} />
              </a>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <iframe
                src={pdfUrl}
                title="Quarterly MTD summary"
                className="w-full h-[68vh] min-h-[480px]"
              />
            </div>
          </div>

          <div className="px-6 sm:px-9 py-6">
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 border-l-4 border-amber-400 px-4 py-3 mb-6">
              <p className="text-[13px] leading-relaxed text-text">
                <span className="font-bold">Indicative figures — please use as a guide.</span>{' '}
                These can change if you add or amend transactions in FreeAgent after this point, or
                if our year-end review surfaces adjustments.
              </p>
            </div>

            <p className="text-sm text-text-light mb-5">
              If your summary looks right, approve it below and we&rsquo;ll submit your quarterly
              update to HMRC. If something looks off, let us know and we&rsquo;ll review before
              submitting.
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
              {busy === 'approve' ? 'Submitting…' : 'Approve these figures'}
            </button>

            {!showQuery ? (
              <button
                onClick={() => setShowQuery(true)}
                disabled={busy !== null}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                <MessageSquareWarning size={17} className="text-amber-500" />
                Something looks wrong
              </button>
            ) : (
              <div className="mt-4 rounded-lg border border-gray-200 p-4">
                <label htmlFor="mtd-query-notes" className="block text-sm font-semibold text-text mb-2">
                  What looks wrong? (optional)
                </label>
                <textarea
                  id="mtd-query-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  maxLength={5000}
                  placeholder="e.g. my income looks too low, or an expense is missing…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => submit('query')}
                    disabled={busy !== null}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
                  >
                    {busy === 'query' ? <Loader2 size={16} className="animate-spin" /> : null}
                    {busy === 'query' ? 'Sending…' : 'Send query'}
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

function WhatNext() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-light mb-2">
        What happens next
      </p>
      <p className="text-[13px] leading-relaxed text-text-light">
        Once you approve, we submit your quarterly update to HMRC on your behalf and email you a
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
