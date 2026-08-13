'use client';

import { useState } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import type { DDRequestDto } from './page';

/**
 * The Direct Debit sign-up form.
 *
 * Two things here are obligations, not decoration:
 *  - The **Direct Debit Guarantee** must be shown to the payer. It is part of
 *    the Scheme Rules, not marketing copy, and its wording is fixed.
 *  - The payer must confirm they are the account holder and the only signatory
 *    required to authorise debits. Joint accounts needing two signatures cannot
 *    be set up online.
 */

function formatSortCode(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  return digits.replace(/(\d{2})(?=\d)/g, '$1-');
}

export default function DirectDebitClient({
  token,
  dto,
  brandName,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: DDRequestDto;
  brandName: string;
  brandEmail: string;
  brandPhone: string;
}) {
  const [accountHolder, setAccountHolder] = useState(dto.recipientName ?? '');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAuthority, setConfirmAuthority] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ reference?: string; firstCollectionDate?: string } | null>(null);

  const sortDigits = sortCode.replace(/\D/g, '');
  const accountDigits = accountNumber.replace(/\D/g, '');
  const ready =
    accountHolder.trim().length > 1 &&
    sortDigits.length === 6 &&
    accountDigits.length === 8 &&
    confirmAuthority &&
    !submitting;

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/direct-debit/submit?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountHolder: accountHolder.trim(),
          sortCode: sortDigits,
          accountNumber: accountDigits,
          confirmAuthority,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'We could not set up your Direct Debit. Please check the details and try again.');
        return;
      }
      setDone({ reference: data.bankReference, firstCollectionDate: data.firstCollectionDate });
    } catch {
      setError('Something went wrong. Please try again, or contact us and we will help.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Your Direct Debit is set up</h1>
              <p className="mt-3 text-slate-600">
                Thank you. We&apos;ve sent your instruction to your bank. You&apos;ll see{' '}
                <span className="font-medium text-slate-900">{brandName}</span> on your bank statement,
                and we&apos;ll always tell you the amount and date in advance of collecting anything.
              </p>
              {done.reference && (
                <p className="mt-3 text-sm text-slate-500">
                  Your Direct Debit reference is <span className="font-mono">{done.reference}</span>.
                </p>
              )}
              <p className="mt-6 text-sm text-slate-500">
                Questions? {brandEmail} · {brandPhone}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Set up your Direct Debit</h1>
        <p className="mt-3 text-slate-600">
          {dto.clientName ? (
            <>
              This sets up a Direct Debit for{' '}
              <span className="font-medium text-slate-900">{dto.clientName}</span> so your{' '}
              {brandName} invoices are collected automatically.
            </>
          ) : (
            <>This sets up a Direct Debit so your {brandName} invoices are collected automatically.</>
          )}{' '}
          It takes about a minute.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="accountHolder" className="block text-sm font-medium text-slate-900">
              Name on the account
            </label>
            <input
              id="accountHolder"
              type="text"
              autoComplete="name"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-900"
              placeholder="As it appears on your bank account"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sortCode" className="block text-sm font-medium text-slate-900">
                Sort code
              </label>
              <input
                id="sortCode"
                type="text"
                inputMode="numeric"
                value={sortCode}
                onChange={(e) => setSortCode(formatSortCode(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-slate-900 outline-none focus:border-slate-900"
                placeholder="00-00-00"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-900">
                Account number
              </label>
              <input
                id="accountNumber"
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-slate-900 outline-none focus:border-slate-900"
                placeholder="12345678"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={confirmAuthority}
              onChange={(e) => setConfirmAuthority(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              I confirm I am the account holder and the only person required to authorise Direct
              Debits on this account.
              <span className="mt-1 block text-slate-500">
                If your account needs more than one person to authorise payments, please contact us
                instead — we&apos;ll send a paper form.
              </span>
            </span>
          </label>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!ready}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? 'Setting up your Direct Debit…' : 'Set up Direct Debit'}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Your bank details are sent straight to our payments provider and are not stored on our
            systems.
          </p>
        </div>

        {/*
          The Direct Debit Guarantee. Required by the Scheme Rules — the wording
          is fixed and must not be paraphrased or shortened.
        */}
        <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-900">The Direct Debit Guarantee</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              This Guarantee is offered by all banks and building societies that accept instructions
              to pay Direct Debits.
            </li>
            <li>
              If there are any changes to the amount, date or frequency of your Direct Debit,{' '}
              {brandName} will notify you in advance of your account being debited, or as otherwise
              agreed. If you request {brandName} to collect a payment, confirmation of the amount and
              date will be given to you at the time of the request.
            </li>
            <li>
              If an error is made in the payment of your Direct Debit, by {brandName} or your bank or
              building society, you are entitled to a full and immediate refund of the amount paid
              from your bank or building society.
            </li>
            <li>
              If you receive a refund you are not entitled to, you must pay it back when {brandName}{' '}
              asks you to.
            </li>
            <li>
              You can cancel a Direct Debit at any time by simply contacting your bank or building
              society. Written confirmation may be required. Please also notify us.
            </li>
          </ul>
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          Need help? {brandEmail} · {brandPhone}
        </p>
      </div>
    </main>
  );
}
