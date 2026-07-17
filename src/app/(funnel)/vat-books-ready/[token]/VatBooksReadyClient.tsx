'use client';

import { useState } from 'react';
import { CheckCircle2, FileText, Receipt, Landmark, CreditCard, Loader2 } from 'lucide-react';
import type { BooksReadyDto } from './page';

const CHECKLIST = [
  { Icon: FileText, text: 'Raise and add any invoices for work you did in the quarter' },
  { Icon: Receipt, text: 'Add your expenses and bills, and upload the receipts' },
  { Icon: Landmark, text: 'Explain any bank transactions still showing as unexplained' },
  { Icon: CreditCard, text: "Record any payments you've made or received" },
];

function fmt(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function VatBooksReadyClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: BooksReadyDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/vat-books-ready/confirm?t=${encodeURIComponent(token)}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'We couldn&rsquo;t record that. Please try again.');
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
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — that&rsquo;s all we needed</h1>
          <p className="text-text-light leading-relaxed mb-4">
            We&rsquo;ll prepare your VAT return for the quarter ending {fmt(dto.periodEnd)} and check it
            over. You&rsquo;ll get it back to approve before anything goes to HMRC.
          </p>
          <p className="text-text-light leading-relaxed">
            If you realise something&rsquo;s still missing, just let us know — it&rsquo;s much easier to
            fix now than after it&rsquo;s filed.
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
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
          {dto.clientName}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Are your books ready?</h1>
        <p className="text-text-light leading-relaxed mb-6">
          Your VAT quarter ended on <strong className="text-text">{fmt(dto.periodEnd)}</strong>, so
          we&rsquo;re ready to prepare your return. Before we start, please make sure your records for
          the quarter are complete:
        </p>

        <ul className="space-y-3 mb-6">
          {CHECKLIST.map(({ Icon, text }) => (
            <li key={text} className="flex gap-3 items-start">
              <Icon size={18} className="text-primary mt-0.5 shrink-0" />
              <span className="text-text-light text-sm leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-text-light leading-relaxed">
            We work out your VAT from what&rsquo;s in your books, so anything missing changes the
            figures. Once you confirm, we&rsquo;ll check everything over and send the return back to
            you to approve — we can&rsquo;t submit it to HMRC without your approval.
          </p>
        </div>

        {dto.dueDate && (
          <p className="text-sm text-text-light mb-6">
            Your return is due with HMRC by <strong className="text-text">{fmt(dto.dueDate)}</strong>.
          </p>
        )}

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-4 py-3 mb-4">{error}</p>
        )}

        <button
          onClick={confirm}
          disabled={busy}
          className="w-full bg-primary text-white font-semibold rounded-xl px-6 py-4 hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 size={18} className="animate-spin" />}
          {busy ? 'Just a moment…' : 'Yes — my books are ready'}
        </button>

        <p className="text-xs text-text-light text-center mt-4 leading-relaxed">
          Not quite there yet? Close this page and come back once you&rsquo;re done — the link will
          still work.
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
