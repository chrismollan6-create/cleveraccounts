'use client';

import { useState } from 'react';
import {
  CheckCircle2, FileText, Receipt, Landmark, CreditCard, Loader2, ExternalLink,
} from 'lucide-react';
import type { BooksReadyDto } from './page';

/**
 * The four things that actually change a VAT return, each said in FreeAgent's own language and
 * linked straight to the screen that does it.
 *
 * `path` values are VERIFIED against a live FreeAgent tenant, not assumed: an unknown path 404s
 * while a real one 302s to that company's login, so they are distinguishable. /banking and
 * /expenses — the obvious guesses — are both 404. The real ones are below.
 */
const CHECKLIST = [
  {
    Icon: FileText,
    title: 'Raise any invoices for work you did this quarter',
    detail: 'Including anything you’ve done but not billed yet — if the work falls in this quarter, the VAT usually does too.',
    path: '/invoices',
    linkText: 'Go to Invoicing',
  },
  {
    Icon: Receipt,
    title: 'Add your bills and expenses, and attach the receipts',
    detail: 'Supplier invoices go in as bills; anything you paid for personally goes in as an expense. No receipt, no VAT reclaim.',
    path: '/bills',
    linkText: 'Go to Bills',
  },
  {
    Icon: Landmark,
    title: 'Explain any bank transactions still marked unexplained',
    detail: 'FreeAgent only counts what’s been explained, so anything still sitting unexplained is missing from your VAT return. This is the most common reason a return is wrong.',
    path: '/bank_accounts/unexplained',
    linkText: 'Show my unexplained items',
  },
  {
    Icon: CreditCard,
    title: 'Record any payments you’ve made or received',
    detail: 'Match invoice and bill payments off against the bank so nothing is counted twice or left out.',
    path: '/bank_accounts',
    linkText: 'Go to Banking',
  },
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

  const fa = dto.freeAgentUrl;

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/vat-books-ready/confirm?t=${encodeURIComponent(token)}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'We couldn’t record that. Please try again.');
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
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
          {dto.clientName}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Are your books ready?</h1>
        <p className="text-text-light leading-relaxed mb-6">
          Your VAT quarter ended on <strong className="text-text">{fmt(dto.periodEnd)}</strong>, so
          we&rsquo;re ready to prepare your return. Before we start, please check these four things
          in {fa ? 'FreeAgent' : 'your records'}:
        </p>

        <ul className="space-y-4 mb-6">
          {CHECKLIST.map(({ Icon, title, detail, path, linkText }) => (
            <li key={title} className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-text font-semibold text-sm leading-snug">{title}</p>
                <p className="text-text-light text-sm leading-relaxed mt-0.5">{detail}</p>
                {fa && (
                  <a
                    href={`${fa}${path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-1.5"
                  >
                    {linkText}
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        {fa && (
          <a
            href={`${fa}/overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-primary/30 text-primary font-semibold rounded-xl px-6 py-3 hover:bg-primary/5 transition mb-6"
          >
            Open my FreeAgent
            <ExternalLink size={16} />
          </a>
        )}

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
          {fa && (
            <>
              <span className="text-gray-300 hidden sm:inline">·</span>
              <a
                className="text-primary hover:underline"
                href="https://support.freeagent.com/hc/en-gb"
                target="_blank"
                rel="noopener noreferrer"
              >
                FreeAgent guides
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
