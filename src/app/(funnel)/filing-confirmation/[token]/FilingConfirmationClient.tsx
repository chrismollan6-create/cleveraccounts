'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { FilingConfirmationDto } from './page';

export default function FilingConfirmationClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: FilingConfirmationDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState<'' | 'confirm' | 'decline'>('');
  const [done, setDone] = useState<'' | 'confirm' | 'decline'>('');
  const [error, setError] = useState('');

  const canConfirm = agreed && name.trim().length > 1 && !submitting;

  async function respond(decision: 'confirm' | 'decline') {
    if (decision === 'confirm' && !canConfirm) return;
    if (submitting) return;
    setSubmitting(decision);
    setError('');
    try {
      const res = await fetch('/api/filing-confirmation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name: name.trim(), decision }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        setSubmitting('');
        return;
      }
      setDone(decision);
    } catch {
      setError('We couldn’t submit that just now. Please try again.');
      setSubmitting('');
    }
  }

  if (done === 'confirm') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thank you — that’s confirmed</h1>
          <p className="text-text-light leading-relaxed">
            We’ve recorded your confirmation of this change to <strong>{dto.companyName}</strong>. We’ll
            file it with Companies House — there’s nothing more you need to do.
          </p>
        </div>
      </main>
    );
  }

  if (done === 'decline') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we won’t file this</h1>
          <p className="text-text-light leading-relaxed">
            We’ve noted that this change to <strong>{dto.companyName}</strong> isn’t right. Nothing has been
            filed. We’ll be in touch — or reach us on{' '}
            <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>.
          </p>
        </div>
      </main>
    );
  }

  const summaryLines = (dto.summary ?? '').split(/\n|  →  |→/).map((s) => s.trim()).filter(Boolean);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Confirm this change before we file it</h1>
        <p className="text-text-light leading-relaxed mb-6">
          We’re about to make the following change to <strong>{dto.companyName}</strong> at Companies House
          on your behalf. Please check it’s right and confirm — we won’t file anything until you do.
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4 text-sm">
          <div className="text-xs uppercase tracking-wide text-text-light font-semibold mb-2">
            {dto.formLabel}
          </div>
          {summaryLines.length > 1 ? (
            <ul className="space-y-1">
              {summaryLines.map((line, i) => (
                <li key={i} className="text-text">{line}</li>
              ))}
            </ul>
          ) : (
            <div className="text-text whitespace-pre-line">{dto.summary}</div>
          )}
          {dto.companyNumber && (
            <div className="flex justify-between pt-3 mt-3 border-t border-gray-200 text-text-light">
              <span>Company number</span>
              <span className="font-semibold text-text">{dto.companyNumber}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-text-light leading-relaxed mb-6">
          Once filed, this change becomes part of the company’s public record at Companies House. By
          confirming you’re telling us this is correct and authorising us to file it on your behalf.
        </p>

        <label className="block text-sm font-semibold text-text mb-1">Your full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jane Smith"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-5 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4" />
          <span className="text-sm text-text-light leading-relaxed">
            I confirm the change above is correct and I authorise {dto.brand ?? 'my accountant'} to file it
            with Companies House on behalf of {dto.companyName}.
          </span>
        </label>

        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

        <button
          type="button"
          onClick={() => respond('confirm')}
          disabled={!canConfirm}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition"
        >
          {submitting === 'confirm' ? 'Submitting…' : 'Confirm & authorise'}
        </button>

        <button
          type="button"
          onClick={() => respond('decline')}
          disabled={!!submitting}
          className="w-full mt-3 text-text-light font-medium py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          {submitting === 'decline' ? 'Submitting…' : 'This isn’t right — don’t file it'}
        </button>

        <p className="text-xs text-text-light mt-5 text-center">
          Questions? Contact us on{' '}
          <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>{' '}
          or <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>. Nothing is filed until you confirm.
        </p>
      </div>
    </main>
  );
}
