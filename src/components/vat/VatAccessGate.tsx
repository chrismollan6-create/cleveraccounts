'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import type { VatGateOption } from '@/lib/vat-access';

/**
 * The lock in front of a client's VAT page. They pick one of the addresses we hold for them
 * (masked), we email a 6-digit code, and the right code opens the page for 7 days on this device.
 */
export default function VatAccessGate({
  token,
  options,
  error: gateError,
  email,
  phone,
}: {
  token: string;
  options: VatGateOption[];
  error?: string | null;
  email: string;
  phone: string;
}) {
  const router = useRouter();
  const [chosen, setChosen] = useState<string>(options[0]?.id ?? '');
  const [stage, setStage] = useState<'choose' | 'code'>('choose');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/vat-access/send?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: chosen }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSentTo(data.sentTo ?? null);
        setCode('');
        setStage('code');
      } else {
        setError(data.error || 'We couldn’t send a code just now. Please try again.');
      }
    } catch {
      setError('We couldn’t send a code just now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/vat-access/verify?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.refresh();
        return; // keep the button busy while the page reloads behind the lock
      }
      setError(data.error || 'That code isn’t right. Please check it and try again.');
    } catch {
      setError('We couldn’t check your code just now. Please try again.');
    }
    setBusy(false);
  }

  const button =
    'w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2';

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-primary bg-primary/10">
          <Lock size={26} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Confirm it’s you</h1>

        {options.length === 0 ? (
          <p className="text-text-light leading-relaxed">
            {gateError ||
              'We don’t have an email address on file to send a code to. Please get in touch and we’ll sort it out.'}
          </p>
        ) : stage === 'choose' ? (
          <>
            <p className="text-text-light leading-relaxed mb-6">
              Your VAT return has your figures in it, so we keep it private. We’ll email you a 6-digit code to open it.
              {options.length > 1 ? ' Where should we send it?' : ''}
            </p>
            <fieldset className="space-y-2">
              <legend className="sr-only">Where to send the code</legend>
              {options.map((o) => (
                <label
                  key={o.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                    chosen === o.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="vat-access-option"
                    value={o.id}
                    checked={chosen === o.id}
                    onChange={() => setChosen(o.id)}
                    className="accent-[var(--color-primary)]"
                  />
                  <Mail size={18} className="text-text-light shrink-0" />
                  <span className="text-text">
                    {o.masked}
                    {o.name ? <span className="text-text-light"> · {o.name}</span> : null}
                  </span>
                </label>
              ))}
            </fieldset>
            {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
            <button type="button" onClick={send} disabled={busy || !chosen} className={button}>
              {busy ? 'Sending…' : 'Email me a code'}
            </button>
          </>
        ) : (
          <form onSubmit={verify}>
            <p className="text-text-light leading-relaxed mb-6">
              We’ve sent a 6-digit code to <span className="font-semibold text-text">{sentTo}</span>. It works for 10
              minutes. If it hasn’t arrived, check your junk folder.
            </p>
            <label htmlFor="vat-access-code" className="block text-sm font-medium text-text mb-2">
              Your code
            </label>
            <input
              id="vat-access-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]*"
              maxLength={7}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-2xl tracking-[0.4em] text-center text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={busy || code.replace(/\D/g, '').length !== 6} className={button}>
              {busy ? 'Checking…' : 'Open my VAT return'}
            </button>
            <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
              <button type="button" onClick={send} disabled={busy} className="text-primary hover:underline disabled:opacity-60">
                Send a new code
              </button>
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setStage('choose');
                    setError(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Use a different address
                </button>
              )}
            </div>
          </form>
        )}

        <p className="mt-6 text-xs text-text-light leading-relaxed">
          Once you’re in, this device stays signed in to this return for 7 days.
        </p>
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
          <span>Need help?</span>
          <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <a className="text-primary hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        </div>
      </div>
    </main>
  );
}
