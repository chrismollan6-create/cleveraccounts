'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import { CheckCircle2, Building2, Users, ShieldCheck, Mail, Tag, FileText, Lock, Loader2, PenLine } from 'lucide-react';
import type { ChConfirmationDto } from './page';

/** Same premium elevation as the VAT approval + accounts signing pages, so the three read as one system. */
const CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

interface SectionDef {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}
const SECTIONS: SectionDef[] = [
  { key: 'companyName', label: 'Company name', icon: Tag },
  { key: 'registeredOffice', label: 'Registered office', icon: Building2 },
  { key: 'officers', label: 'Directors', icon: Users },
  { key: 'pscs', label: 'People with significant control', icon: ShieldCheck },
  { key: 'sic', label: 'Nature of business', icon: Tag },
  { key: 'email', label: 'Registered email', icon: Mail },
];

export default function ChConfirmationClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: ChConfirmationDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const [flagging, setFlagging] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState<null | 'confirm' | 'changes'>(null);
  const [done, setDone] = useState<null | 'confirmed' | 'changes'>(null);
  const [error, setError] = useState('');

  const checkedKeys = SECTIONS.filter((s) => checked[s.key]).map((s) => s.key);

  async function post(kind: 'confirm' | 'changes') {
    setSubmitting(kind);
    setError('');
    try {
      const sections: Record<string, { ok: boolean; note: string }> = {};
      for (const s of SECTIONS) {
        const isChanged = kind === 'changes' && !!checked[s.key];
        sections[s.key] = { ok: !isChanged, note: isChanged ? note : '' };
      }
      const res = await fetch('/api/ch-confirmation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, payload: { sections } }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong.');
      setDone(kind === 'changes' ? 'changes' : 'confirmed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(null);
    }
  }

  // ---------- Success ----------
  if (done) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className={`max-w-lg w-full ${CARD} p-8 sm:p-10`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-8 text-emerald-600 bg-emerald-50 ring-emerald-100">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">
            {done === 'confirmed' ? 'Thanks — that’s confirmed' : 'Thanks — we’ve got your response'}
          </h1>
          <p className="text-text-light leading-relaxed">
            {done === 'confirmed'
              ? 'We’ve got everything we need and will file your confirmation statement with Companies House. We’ll let you know once it’s done.'
              : 'You’ve told us something’s changed. One of the team will be in touch to get it sorted before we file.'}
          </p>
          <HelpFooter email={brandEmail} phone={brandPhone} />
        </div>
      </main>
    );
  }

  // ---------- Review ----------
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6 lg:items-start">
        {/* Left: read-only summary + one decision */}
        <div className={CARD}>
          {/* tinted context band */}
          <div className="px-6 sm:px-9 pt-7 pb-6 border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-transparent">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              <FileText size={13} strokeWidth={2.5} /> Confirmation statement
            </div>
            <h1 className="mt-2.5 text-[1.7rem] sm:text-[2rem] font-bold text-text leading-[1.1] tracking-tight">
              {dto.companyName}
            </h1>
            <p className="mt-1.5 text-sm text-text-light">
              Company {dto.companyNumber}
              {dto.dueDate ? ` · due ${dto.dueDate}` : ''}
            </p>
            <p className="mt-4 text-sm text-text-light leading-relaxed max-w-prose">
              Each year we confirm to Companies House that your company details are up to date. Here’s what’s on
              file — please check it over and confirm it’s correct. It only takes a minute.
            </p>
          </div>

          {/* read-only summary */}
          <div className="px-6 sm:px-9 pt-6 pb-2">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="block h-[3px] w-6 rounded-full bg-primary" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-primary">Details on file</h2>
            </div>
            <dl className="divide-y divide-gray-100">
              {SECTIONS.map((s) => (
                <div key={s.key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-5 py-4">
                  <dt className="sm:w-48 shrink-0 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-text-light">
                    <s.icon size={14} className="text-primary" />
                    {s.label}
                  </dt>
                  <dd className="flex-1 min-w-0">{renderValue(s.key, dto)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* decision */}
          <div className="px-6 sm:px-9 pt-4 pb-8">
            {!flagging ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6">
                <p className="text-[15px] font-semibold text-text">Is everything above correct?</p>
                <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                  Confirm and we’ll file your confirmation statement with Companies House. Nothing is filed until you confirm.
                </p>
                {error ? <p className="text-rose-600 text-sm mt-3">{error}</p> : null}
                <button
                  onClick={() => post('confirm')}
                  disabled={submitting !== null}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  {submitting === 'confirm' ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {submitting === 'confirm' ? 'Confirming…' : 'Confirm these details are correct'}
                </button>
                <button
                  onClick={() => setFlagging(true)}
                  disabled={submitting !== null}
                  className="w-full mt-2.5 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-text-light hover:text-text transition-colors disabled:opacity-60"
                >
                  <PenLine size={14} /> Something’s changed
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 border-l-[3px] border-l-amber-400 bg-white p-5 sm:p-6">
                <p className="text-[15px] font-semibold text-text">What’s changed?</p>
                <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                  Tick anything that’s no longer right. We’ll get it sorted with you before we file — you don’t need
                  the exact new details here.
                </p>
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {SECTIONS.map((s) => {
                    const on = !!checked[s.key];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setChecked((c) => ({ ...c, [s.key]: !c[s.key] }))}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                          on ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-text hover:border-gray-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            on ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'
                          }`}
                        >
                          {on ? <CheckCircle2 size={12} /> : null}
                        </span>
                        <span className="min-w-0">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
                <textarea
                  className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  rows={3}
                  placeholder="Anything else we should know? (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {error ? <p className="text-rose-600 text-sm mt-3">{error}</p> : null}
                <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => post('changes')}
                    disabled={submitting !== null || checkedKeys.length === 0}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2"
                  >
                    {submitting === 'changes' ? <Loader2 size={18} className="animate-spin" /> : <PenLine size={18} />}
                    {submitting === 'changes' ? 'Sending…' : 'Send my changes'}
                  </button>
                  <button
                    onClick={() => {
                      setFlagging(false);
                      setChecked({});
                      setError('');
                    }}
                    disabled={submitting !== null}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: pinned info rail */}
        <aside className="mt-6 lg:mt-0 lg:sticky lg:top-8 space-y-4">
          <div className={`${CARD} overflow-hidden`}>
            <div className="bg-gradient-to-b from-primary-50 to-primary-50/40 px-5 sm:px-6 py-4 border-b border-primary/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">Your confirmation</p>
              <p className="mt-1.5 text-[15px] font-bold text-text leading-snug">{dto.companyName}</p>
              {dto.dueDate ? <p className="text-[13px] text-text-light mt-0.5">Due {dto.dueDate}</p> : null}
            </div>
            <div className="px-5 sm:px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-light mb-2">What happens next</p>
              <p className="text-[13px] text-text-light leading-relaxed">
                Once you confirm, we file your confirmation statement with Companies House and email you when it’s
                done. If you flag a change, we’ll sort it out with you first.
              </p>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 px-1 text-center text-xs leading-relaxed text-text-light">
            <Lock size={11} className="shrink-0" />
            Secure &amp; encrypted. Questions?{' '}
            <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>
          </p>
        </aside>
      </div>
    </main>
  );
}

function renderValue(key: string, dto: ChConfirmationDto): ReactNode {
  switch (key) {
    case 'companyName':
      return <p className="text-[15px] font-semibold text-text">{dto.companyName}</p>;
    case 'registeredOffice':
      return <p className="text-[15px] text-text leading-relaxed">{dto.registeredOffice || 'Not on record'}</p>;
    case 'officers':
      return dto.officers && dto.officers.length ? (
        <ul className="space-y-1">
          {dto.officers.map((o, i) => (
            <li key={i} className="text-[15px] text-text">
              <span className="font-semibold">{o.name}</span>
              {o.role ? <span className="text-text-light"> · {o.role}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-text-light">No directors on record</p>
      );
    case 'pscs':
      return dto.pscs && dto.pscs.length ? (
        <ul className="space-y-1">
          {dto.pscs.map((p, i) => (
            <li key={i} className="text-[15px] font-semibold text-text">{p.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-text-light">None on record</p>
      );
    case 'sic':
      return dto.sicCodes && dto.sicCodes.length ? (
        <div className="flex flex-wrap gap-1.5">
          {dto.sicCodes.map((c, i) => (
            <span key={i} className="inline-flex items-center rounded-full bg-primary-50 text-primary px-2.5 py-0.5 text-sm font-medium tabular-nums">{c}</span>
          ))}
        </div>
      ) : (
        <p className="text-[15px] text-text-light">No SIC codes on record</p>
      );
    case 'email':
      return <p className="text-[15px] text-text break-words">{dto.registeredEmail || 'Not on record'}</p>;
    default:
      return null;
  }
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
