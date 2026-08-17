'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Check,
  ShieldCheck,
  Building2,
  UserCog,
  HelpCircle,
  Users,
  ArrowDown,
  ListChecks,
  FileCheck2,
} from 'lucide-react';
import type { FilingConfirmationDto } from './page';

type CascadeChoice = { service: boolean; residential: boolean };

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
  const [tradingChange, setTradingChange] = useState<boolean | null>(null);

  const brand = dto.brand ?? 'your accountant';
  const isAd01 = dto.formType?.toUpperCase() === 'AD01';
  const people = isAd01 ? dto.people ?? [] : [];
  // Ask "is this your trading address?" only when the new office isn't our own practice address.
  const showTradingQuestion = isAd01 && dto.isOwnOffice === false;

  const [cascade, setCascade] = useState<Record<string, CascadeChoice>>(() => {
    const init: Record<string, CascadeChoice> = {};
    for (const p of people) {
      // Service address ticked by default on everyone. A service address is normally the registered
      // office, so when that moves theirs almost always moves with it — and the ones left behind are
      // the ones nobody notices. Previously this was only pre-ticked where the service address
      // already matched the old office, which missed anyone whose record had drifted. Residential is
      // never assumed: it's their private home address.
      init[p.key] = { service: true, residential: false };
    }
    return init;
  });
  function toggle(key: string, field: keyof CascadeChoice) {
    setCascade((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { service: false, residential: false }), [field]: !prev[key]?.[field] },
    }));
  }

  const canConfirm =
    agreed && name.trim().length > 1 && !submitting && (!showTradingQuestion || tradingChange !== null);

  async function respond(decision: 'confirm' | 'decline') {
    if (decision === 'confirm' && !canConfirm) return;
    if (submitting) return;
    setSubmitting(decision);
    setError('');
    try {
      // One list, two kinds of entry. Directors carry their service/home ticks and are dropped when
      // neither is set. PSC entries are sent even when UNTICKED — that's how the filing side knows
      // the client was shown the PSC register and said no, rather than never having been asked.
      const officerCascade =
        decision === 'confirm'
          ? [
              ...people
                .filter((p) => p.isDirector)
                .map((p) => ({ key: p.key, ...(cascade[p.key] ?? { service: false, residential: false }) }))
                .filter((p) => p.service || p.residential),
              ...people
                .filter((p) => p.pscKey)
                .map((p) => ({ key: p.pscKey as string, psc: true, service: !!cascade[p.key]?.service })),
            ]
          : undefined;
      const res = await fetch('/api/filing-confirmation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: name.trim(),
          decision,
          officerCascade,
          tradingAddressChange: showTradingQuestion && decision === 'confirm' ? tradingChange === true : false,
        }),
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
            file it with Companies House and take care of the rest — there’s nothing more you need to do.
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

  // AD01 summaries read "… from: X  →  to: Y" — pull the two out for a clean from→to display.
  const fromMatch = (dto.summary ?? '').match(/from:\s*([^\n→]+?)\s*(?:→|to:|$)/i);
  const toMatch = (dto.summary ?? '').match(/(?:→\s*)?to:\s*([^\n]+)/i);
  const hasFromTo = !!(fromMatch && toMatch);
  const fromText = fromMatch ? fromMatch[1].trim() : '';
  const toText = toMatch ? toMatch[1].trim() : '';

  const nextSteps = [
    'You check the details are right and confirm below.',
    'We file it with Companies House on your behalf — usually the same working day.',
    'We confirm it’s been accepted and update your records. We’ll only be in touch if we need anything.',
  ];

  const alsoHandle = isAd01
    ? [
        'Let HMRC know your new correspondence address, so tax post reaches the right place.',
        `Update your records with ${brand} so letters, invoices and future filings all use it.`,
        'File any director address changes you tick, alongside this one — no extra approval needed.',
      ]
    : [
        'Notify HMRC where this change affects your tax records or correspondence.',
        `Update your records with ${brand} so everything stays consistent.`,
      ];

  return (
    <main className="px-4 py-10">
      <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
        {/* ---- Main column ---- */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-primary font-bold mb-3">
            <FileCheck2 size={14} /> Companies House filing
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2 leading-tight">
            Confirm this change before we file it
          </h1>
          <p className="text-text-light leading-relaxed mb-6">
            We’re about to make the following change to <strong className="text-text">{dto.companyName}</strong> at
            Companies House on your behalf. Please check it’s right and confirm — we won’t file anything until you do.
          </p>

          {/* The change itself — the centrepiece */}
          <div className="rounded-2xl border border-primary-light/40 overflow-hidden shadow-sm mb-6">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 border-b border-primary-light/30 text-xs uppercase tracking-wide text-primary font-bold">
              {isAd01 ? <Building2 size={14} /> : <UserCog size={14} />}
              {dto.formLabel}
            </div>
            <div className="p-4 sm:p-5 text-sm">
              {hasFromTo ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-wide text-text-light font-semibold mb-1">Currently</div>
                    <div className="text-text-light leading-snug">{fromText}</div>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <ArrowDown size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Changing to</span>
                    <span className="flex-1 h-px bg-primary-light/30" />
                  </div>
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-wide text-primary font-semibold mb-1">New</div>
                    <div className="text-text font-semibold leading-snug">{toText}</div>
                  </div>
                </div>
              ) : summaryLines.length > 1 ? (
                <ul className="space-y-1.5">
                  {summaryLines.map((line, i) => {
                    const idx = line.indexOf(':');
                    const label = idx > -1 ? line.slice(0, idx) : '';
                    const val = idx > -1 ? line.slice(idx + 1).trim() : line;
                    return (
                      <li key={i} className="leading-snug">
                        {label ? (
                          <>
                            <span className="text-text-light">{label}:</span>{' '}
                            <span className="text-text font-semibold">{val}</span>
                          </>
                        ) : (
                          <span className="text-text">{val}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-text font-medium whitespace-pre-line">{dto.summary}</div>
              )}
            </div>
            {dto.companyNumber && (
              <div className="flex justify-between items-center px-4 sm:px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-xs text-text-light">
                <span>Company number</span>
                <span className="font-semibold text-text tracking-wider tabular-nums">{dto.companyNumber}</span>
              </div>
            )}
          </div>

          {showTradingQuestion && (
            <div className="rounded-xl border border-gray-200 border-l-4 border-l-secondary bg-secondary/[0.03] p-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle size={16} className="text-secondary flex-none" />
                <span className="text-sm font-semibold text-text">Is this also a change to your trading address?</span>
              </div>
              <p className="text-xs text-text-light leading-relaxed mb-3 pl-6">
                Your registered office and the address you actually trade from can be different. If your
                business now operates from this new address, we may also need to update HMRC, VAT and PAYE
                and your billing address — let us know so we can take care of it.
              </p>
              <div className="flex gap-3 pl-6">
                <button
                  type="button"
                  onClick={() => setTradingChange(true)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                    tradingChange === true
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-gray-300 text-text-light hover:border-primary/40 hover:bg-white'
                  }`}
                >
                  Yes — we trade from here
                </button>
                <button
                  type="button"
                  onClick={() => setTradingChange(false)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                    tradingChange === false
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-gray-300 text-text-light hover:border-primary/40 hover:bg-white'
                  }`}
                >
                  No — registered office only
                </button>
              </div>
            </div>
          )}

          {people.length > 0 && (
            <div className="rounded-xl border border-gray-200 border-l-4 border-l-primary bg-primary-50/40 p-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-primary flex-none" />
                <span className="text-sm font-semibold text-text">Who else should this address change for?</span>
              </div>
              <p className="text-xs text-text-light leading-relaxed mb-3 pl-6">
                Companies House holds an address for each of your directors and for anyone with significant
                control of the company, and none of them move automatically when the office does. We’ve
                ticked everyone below — untick anyone whose address shouldn’t change. We’ll file these
                alongside this change, with nothing more for you to approve.
              </p>
              <ul className="space-y-3 pl-6">
                {people.map((p) => (
                  <li key={p.key} className="border-t border-gray-200/70 pt-3 first:border-t-0 first:pt-0">
                    <div className="text-sm font-medium text-text">{p.name}</div>
                    <div className="text-xs text-text-light mt-0.5">
                      {p.isDirector
                        ? p.isPsc
                          ? `${p.role ?? 'Director'} · also has significant control`
                          : p.role ?? 'Director'
                        : 'Person with significant control'}
                      {p.currentAddress && !p.serviceMatchesOldOffice && (
                        <span className="block mt-0.5">Currently shown as {p.currentAddress}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-6 mt-1.5">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-text-light">
                        <input
                          type="checkbox"
                          checked={!!cascade[p.key]?.service}
                          onChange={() => toggle(p.key, 'service')}
                          className="h-4 w-4"
                        />
                        Service address
                      </label>
                      {/* Home address is a director-only option. A PSC's residential address is
                          private and never moves off the back of an office change. */}
                      {p.isDirector && (
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text-light">
                          <input
                            type="checkbox"
                            checked={!!cascade[p.key]?.residential}
                            onChange={() => toggle(p.key, 'residential')}
                            className="h-4 w-4"
                          />
                          Home address
                        </label>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[0.7rem] text-text-light leading-relaxed mt-3 pt-3 border-t border-gray-100">
                The <strong>service address</strong> is the public contact address shown on the Companies
                House register. The <strong>home address</strong> is a director’s private residential
                address — it’s kept confidential and never shown publicly. A{' '}
                <strong>person with significant control</strong> is someone who owns or controls a large
                enough share of the company to be named on its public PSC register — usually a shareholder.
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 mt-2">
          <p className="text-xs text-text-light leading-relaxed mb-6">
            Once filed, this change becomes part of the company’s public record at Companies House. By
            confirming you’re telling us this is correct and authorising {brand} to file it on your behalf.
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
              I confirm the change above is correct and I authorise {brand} to file it with Companies House
              on behalf of {dto.companyName}.
            </span>
          </label>

          {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

          <button
            type="button"
            onClick={() => respond('confirm')}
            disabled={!canConfirm}
            className="w-full bg-secondary text-white font-semibold py-3.5 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-dark transition flex items-center justify-center gap-2"
          >
            {submitting === 'confirm' ? (
              'Submitting…'
            ) : (
              <>
                <CheckCircle2 size={18} /> Confirm &amp; authorise
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => respond('decline')}
            disabled={!!submitting}
            className="w-full mt-3 text-text-light font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            {submitting === 'decline' ? 'Submitting…' : 'This isn’t right — don’t file it'}
          </button>
          </div>
        </div>

        {/* ---- Right rail ---- */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-text mb-5">What happens next</h2>
            <ol className="relative space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-primary/15">
              {nextSteps.map((s, i) => (
                <li key={i} className="relative flex gap-3.5 text-sm text-text-light leading-relaxed">
                  <span className="flex-none w-[22px] h-[22px] rounded-full bg-primary text-white text-[0.7rem] font-bold flex items-center justify-center z-10 ring-4 ring-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-text mb-4">
              <ListChecks size={16} className="text-primary" /> We’ll also take care of
            </h2>
            <ul className="space-y-3">
              {alsoHandle.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-text-light leading-relaxed">
                  <span className="flex-none mt-0.5 w-4 h-4 rounded-full bg-success/15 text-success flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-primary-50 border border-primary-light/30 p-5">
            <div className="flex gap-2.5 text-sm text-text leading-relaxed">
              <ShieldCheck size={18} className="flex-none mt-0.5 text-primary" />
              <span>
                Nothing is filed with Companies House until you confirm. If anything looks wrong, don’t
                confirm — just let us know and we’ll sort it.
              </span>
            </div>
            <p className="text-xs text-text-light mt-4 pt-4 border-t border-primary-light/25">
              Questions?{' '}
              <a className="text-primary font-medium hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>{' '}
              · <a className="text-primary font-medium hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
