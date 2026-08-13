'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, Loader2, Mail, ShieldCheck, CalendarClock, Building2 } from 'lucide-react';
import type { DDRequestDto } from './page';

/**
 * The Direct Debit sign-up form.
 *
 * Three things here are obligations, not decoration:
 *  - The **Direct Debit Guarantee** must be shown to the payer. It is part of
 *    the Scheme Rules and its wording is fixed.
 *  - The payer must confirm they are the account holder and the only signatory
 *    required to authorise debits. Joint accounts needing two signatures cannot
 *    be set up online.
 *  - An **address** is required: DDCMS reports CustomerAddressMandatory, and
 *    performs no KYC itself, so validating the address at point of entry is our
 *    obligation. Hence the postcode lookup rather than a free-text box.
 */

interface PostcoderAddress {
  addressline1?: string;
  addressline2?: string;
  addressline3?: string;
  posttown?: string;
  county?: string;
  postcode?: string;
  summaryline?: string;
}

interface BankCheck {
  valid?: boolean;
  cautious?: boolean;
  skipped?: boolean;
  bankName?: string;
  branch?: string;
  errorMessage?: string;
}

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
  const [email, setEmail] = useState(dto.email ?? '');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAuthority, setConfirmAuthority] = useState(false);

  // Prefilled from the client record. The payer confirms it rather than
  // retyping — but can change it, because the address their bank holds for the
  // account is not always the one we bill.
  const [postcodeQuery, setPostcodeQuery] = useState('');
  const [addressOptions, setAddressOptions] = useState<PostcoderAddress[] | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [addressLine1, setAddressLine1] = useState(dto.addressLine1 ?? '');
  const [addressLine2, setAddressLine2] = useState(dto.addressLine2 ?? '');
  const [town, setTown] = useState(dto.town ?? '');
  const [postCode, setPostCode] = useState(dto.postCode ?? '');
  const [changingAddress, setChangingAddress] = useState(false);

  const [bankCheck, setBankCheck] = useState<BankCheck | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ reference?: string; firstCollectionDate?: string } | null>(null);

  const sortDigits = sortCode.replace(/\D/g, '');
  const accountDigits = accountNumber.replace(/\D/g, '');
  const addressReady = addressLine1.trim().length > 1 && postCode.trim().length > 4;

  const ready =
    accountHolder.trim().length > 1 &&
    sortDigits.length === 6 &&
    accountDigits.length === 8 &&
    addressReady &&
    confirmAuthority &&
    bankCheck?.valid !== false &&
    !submitting;

  async function lookupPostcode() {
    const pc = postcodeQuery.trim();
    if (pc.length < 3) return;
    setLookingUp(true);
    setError('');
    try {
      const res = await fetch(`/api/address?postcode=${encodeURIComponent(pc)}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError('No addresses found for that postcode. You can type it in below.');
        setAddressOptions(null);
        return;
      }
      setAddressOptions(data as PostcoderAddress[]);
    } catch {
      setError('Address lookup is unavailable. Please type your address in below.');
    } finally {
      setLookingUp(false);
    }
  }

  function chooseAddress(addr: PostcoderAddress) {
    const lines = [addr.addressline1, addr.addressline2, addr.addressline3].filter(Boolean);
    setAddressLine1(lines[0] ?? '');
    setAddressLine2(lines.slice(1).join(', '));
    setTown(addr.posttown ?? '');
    setPostCode(addr.postcode ?? postcodeQuery.trim().toUpperCase());
    setAddressOptions(null);
  }

  /** Runs as soon as both bank fields are complete, so mistakes surface here. */
  async function runBankCheck(sort: string, account: string) {
    if (sort.length !== 6 || account.length !== 8) {
      setBankCheck(null);
      return;
    }
    setChecking(true);
    try {
      const res = await fetch(`/api/direct-debit/bankcheck?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortCode: sort, accountNumber: account }),
      });
      setBankCheck(res.ok ? await res.json() : null);
    } catch {
      setBankCheck(null);
    } finally {
      setChecking(false);
    }
  }

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
          email: email.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          town: town.trim(),
          postCode: postCode.trim(),
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
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Your Direct Debit is set up</h1>
              <p className="mt-3 text-slate-600">
                Thank you. We&apos;ve sent the instruction to your bank — there&apos;s nothing more for
                you to do.
              </p>
              <dl className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 text-sm">
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-slate-500">On your statement</dt>
                  <dd className="font-medium text-slate-900">{brandName}</dd>
                </div>
                {done.reference && (
                  <div className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-slate-500">Your reference</dt>
                    <dd className="font-mono text-slate-900">{done.reference}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-slate-500">Before we collect</dt>
                  <dd className="text-right font-medium text-slate-900">
                    We&apos;ll always tell you the amount and date in advance
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm text-slate-500">
                A confirmation will follow by email. Questions? {brandEmail} · {brandPhone}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Set up your Direct Debit
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            {dto.clientName ? (
              <>
                For <span className="font-medium text-slate-900">{dto.clientName}</span>, so your{' '}
                {brandName} invoices are collected automatically. It takes about a minute.
              </>
            ) : (
              <>So your {brandName} invoices are collected automatically. It takes about a minute.</>
            )}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
        {/* ---------------------------------------------------------- form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {dto.reference && (
            <p className="mb-8 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Your reference <span className="font-mono font-medium text-slate-900">{dto.reference}</span>
              {' '}— quote this if you contact us about your Direct Debit.
            </p>
          )}

          {/* --- 1. Account holder ------------------------------------- */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              1. Account holder
            </h2>
            <div className="mt-4 space-y-5">
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
                  className={inputClass}
                  placeholder="As it appears on your bank account"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  We&apos;ll send your Direct Debit confirmation here, and tell you the amount and date
                  before each collection.
                </p>
              </div>
            </div>
          </section>

          {/* --- 2. Address -------------------------------------------- */}
          <section className="mt-9">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              2. Your address
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This should be the address your bank holds for this account.
            </p>

            {/* Prefilled from the client record — confirm, don't retype. */}
            {!changingAddress && addressReady && (
              <div className="mt-4 flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <address className="text-sm not-italic leading-6 text-slate-700">
                  {[addressLine1, addressLine2, town, postCode].filter(Boolean).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <button
                  type="button"
                  onClick={() => setChangingAddress(true)}
                  className="shrink-0 text-sm font-medium text-slate-700 underline"
                >
                  Change
                </button>
              </div>
            )}

            {(changingAddress || !addressReady) && (
              <>
                <div className="mt-4">
                  <label htmlFor="postcodeQuery" className="block text-sm font-medium text-slate-900">
                    Search by postcode
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="postcodeQuery"
                      type="text"
                      autoComplete="postal-code"
                      value={postcodeQuery}
                      onChange={(e) => setPostcodeQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          lookupPostcode();
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 uppercase text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                      placeholder="LN11 9BX"
                    />
                    <button
                      type="button"
                      onClick={lookupPostcode}
                      disabled={lookingUp || postcodeQuery.trim().length < 3}
                      className="shrink-0 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Find address'}
                    </button>
                  </div>
                </div>

                {addressOptions && (
                  <ul className="mt-3 max-h-56 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
                    {addressOptions.map((addr, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => chooseAddress(addr)}
                          className="w-full px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          {addr.summaryline ??
                            [addr.addressline1, addr.posttown, addr.postcode].filter(Boolean).join(', ')}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="line1" className="block text-sm font-medium text-slate-900">
                      Address line 1
                    </label>
                    <input
                      id="line1"
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="line2" className="block text-sm font-medium text-slate-900">
                      Address line 2 <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      id="line2"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="town" className="block text-sm font-medium text-slate-900">
                        Town
                      </label>
                      <input
                        id="town"
                        type="text"
                        value={town}
                        onChange={(e) => setTown(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="postCode" className="block text-sm font-medium text-slate-900">
                        Postcode
                      </label>
                      <input
                        id="postCode"
                        type="text"
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value.toUpperCase())}
                        className={`${inputClass} uppercase`}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* --- 3. Bank details --------------------------------------- */}
          <section className="mt-9">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              3. Bank details
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="sortCode" className="block text-sm font-medium text-slate-900">
                  Sort code
                </label>
                <input
                  id="sortCode"
                  type="text"
                  inputMode="numeric"
                  value={sortCode}
                  onChange={(e) => {
                    const next = formatSortCode(e.target.value);
                    setSortCode(next);
                    setBankCheck(null);
                    runBankCheck(next.replace(/\D/g, ''), accountDigits);
                  }}
                  className={`${inputClass} font-mono`}
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
                  onChange={(e) => {
                    const next = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setAccountNumber(next);
                    setBankCheck(null);
                    runBankCheck(sortDigits, next);
                  }}
                  className={`${inputClass} font-mono`}
                  placeholder="12345678"
                />
              </div>
            </div>

            {checking && (
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Checking your bank details…
              </p>
            )}
            {!checking && bankCheck?.valid && bankCheck.bankName && (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                <Building2 className="h-4 w-4" aria-hidden />
                {bankCheck.bankName}
                {bankCheck.branch ? ` — ${bankCheck.branch}` : ''}
              </p>
            )}
            {!checking && bankCheck?.valid === false && bankCheck.errorMessage && (
              <p className="mt-3 text-sm text-red-700">{bankCheck.errorMessage}</p>
            )}
          </section>

          {/* --- 4. Authority ------------------------------------------ */}
          <section className="mt-9">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              4. Confirm
            </h2>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-4">
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
              <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={!ready}
              className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? 'Setting up your Direct Debit…' : 'Set up Direct Debit'}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Your bank details go straight to our payments provider and are not stored on our systems.
            </p>
          </section>
        </div>

        {/* ---------------------------------------------------------- rail */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-5 w-5 text-slate-900" aria-hidden />
              <span className="text-sm font-semibold text-slate-900">Protected by the Direct Debit Guarantee</span>
            </div>
            <ol className="mt-4 space-y-4">
              {[
                {
                  icon: <Mail className="h-4 w-4" aria-hidden />,
                  title: 'We confirm it in writing',
                  body: 'You’ll get an email confirming your Direct Debit has been set up.',
                },
                {
                  icon: <CalendarClock className="h-4 w-4" aria-hidden />,
                  title: 'We tell you before we collect',
                  body: 'You’ll always know the amount and the date in advance — never a surprise.',
                },
                {
                  icon: <Building2 className="h-4 w-4" aria-hidden />,
                  title: 'It appears on your statement',
                  body: `Collections show as ${brandName}.`,
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    {step.icon}
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium text-slate-900">{step.title}</span>
                    <span className="mt-0.5 block text-slate-600">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-900">You can cancel at any time</p>
            <p className="mt-1.5 text-sm text-slate-600">
              Contact your bank or building society, and let us know so we can update your account.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-900">Need a hand?</p>
            <p className="mt-1.5 text-sm text-slate-600">
              <a className="underline" href={`mailto:${brandEmail}`}>
                {brandEmail}
              </a>
              <br />
              {brandPhone}
            </p>
          </div>
        </aside>
      </div>

      {/*
        The Direct Debit Guarantee. Required by the Scheme Rules — the wording is
        fixed and must not be paraphrased or shortened. Rendered as a single
        readable column: a two-column grid left ragged, uneven-length clauses
        that made a legal notice look like an afterthought.
      */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">The Direct Debit Guarantee</h2>
        </div>
        <ul className="space-y-3 px-6 py-5">
          {[
            <>
              This Guarantee is offered by all banks and building societies that accept instructions
              to pay Direct Debits.
            </>,
            <>
              If there are any changes to the amount, date or frequency of your Direct Debit,{' '}
              {brandName} will notify you in advance of your account being debited, or as otherwise
              agreed. If you request {brandName} to collect a payment, confirmation of the amount and
              date will be given to you at the time of the request.
            </>,
            <>
              If an error is made in the payment of your Direct Debit, by {brandName} or your bank or
              building society, you are entitled to a full and immediate refund of the amount paid
              from your bank or building society.
            </>,
            <>
              If you receive a refund you are not entitled to, you must pay it back when {brandName}{' '}
              asks you to.
            </>,
            <>
              You can cancel a Direct Debit at any time by simply contacting your bank or building
              society. Written confirmation may be required. Please also notify us.
            </>,
          ].map((clause, i) => (
            <li key={i} className="flex gap-3 text-sm leading-6 text-slate-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
              <span className="max-w-3xl">{clause}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
