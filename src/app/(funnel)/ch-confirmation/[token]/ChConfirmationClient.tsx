'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import {
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  Tag,
  FileText,
  Lock,
  Loader2,
  PenLine,
  CalendarClock,
  Clock,
} from 'lucide-react';
import type { ChConfirmationDto } from './page';
import { sicDescription } from '@/lib/sic-codes';

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
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [lawful, setLawful] = useState(true); // opt-out: the company confirms it will keep trading lawfully
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | 'confirmed' | 'changes'>(null);
  const [error, setError] = useState('');

  const flaggedKeys = SECTIONS.filter((s) => flagged[s.key]).map((s) => s.key);
  const anyFlagged = flaggedKeys.length > 0;
  const allFlaggedHaveNotes = flaggedKeys.every((k) => (notes[k] || '').trim().length > 0);

  const setFlag = (key: string, on: boolean) => {
    setFlagged((f) => ({ ...f, [key]: on }));
    if (!on) setNotes((n) => ({ ...n, [key]: '' }));
  };

  async function post() {
    // Guards mirror the button disabled state, so nothing slips through.
    if (anyFlagged && !allFlaggedHaveNotes) return;
    if (!anyFlagged && !lawful) return;

    setSubmitting(true);
    setError('');
    try {
      const sections: Record<string, { ok: boolean; note: string }> = {};
      for (const s of SECTIONS) {
        const isChanged = !!flagged[s.key];
        sections[s.key] = { ok: !isChanged, note: isChanged ? notes[s.key] || '' : '' };
      }
      const res = await fetch('/api/ch-confirmation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, payload: { sections, lawfulPurpose: lawful } }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong.');
      setDone(anyFlagged ? 'changes' : 'confirmed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
              : 'You’ve told us something’s changed. One of the team will be in touch to get it sorted, then we’ll file your confirmation statement for you.'}
          </p>
          <HelpFooter email={brandEmail} phone={brandPhone} />
        </div>
      </main>
    );
  }

  // ---------- Review ----------
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-7 lg:items-start">
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
              file — please check it over. If everything’s right, confirm below; if not, hit <strong className="font-semibold text-text">Update</strong> next to
              anything that’s changed.
            </p>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-800">
              <Clock size={16} className="shrink-0 mt-0.5" />
              <span>
                <strong className="font-semibold">Please approve this as soon as you can.</strong> We can’t file your
                confirmation statement with Companies House until you’ve approved it
                {dto.dueDate ? (
                  <>
                    {' '}
                    — and it must be filed by <strong className="font-semibold">{dto.dueDate}</strong> to keep the
                    company compliant.
                  </>
                ) : (
                  <>.</>
                )}
              </span>
            </div>
          </div>

          {/* read-only summary */}
          <div className="px-6 sm:px-9 pt-6 pb-2">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="block h-[3px] w-6 rounded-full bg-primary" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-primary">Details on file</h2>
            </div>
            <div>
              {SECTIONS.map((s) => {
                const on = !!flagged[s.key];
                const noteMissing = on && (notes[s.key] || '').trim().length === 0;
                return (
                  <div
                    key={s.key}
                    className={`py-4 border-b border-gray-100 last:border-b-0 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5 transition-colors ${
                      on ? 'bg-amber-50/50 rounded-lg px-3 -mx-3 border-b-transparent' : ''
                    }`}
                  >
                    <div className="sm:w-52 shrink-0 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-light">
                      <s.icon size={14} className="text-primary" />
                      {s.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      {renderValue(s.key, dto)}
                      {on ? (
                        <>
                          <textarea
                            className={`mt-2.5 w-full rounded-lg border bg-white px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 ${
                              noteMissing
                                ? 'border-amber-300 focus:ring-amber-400/40 focus:border-amber-400'
                                : 'border-amber-200 focus:ring-amber-400/40 focus:border-amber-400'
                            }`}
                            rows={2}
                            placeholder="Please tell us what’s changed"
                            value={notes[s.key] || ''}
                            onChange={(e) => setNotes((n) => ({ ...n, [s.key]: e.target.value }))}
                          />
                          {noteMissing ? (
                            <p className="mt-1 text-[12px] text-amber-700">Add a quick note so we know what to change.</p>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                    <div className="shrink-0 sm:pt-0.5">
                      {on ? (
                        <button
                          type="button"
                          onClick={() => setFlag(s.key, false)}
                          className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-700 hover:underline whitespace-nowrap"
                        >
                          Flagged · Undo
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFlag(s.key, true)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-primary hover:bg-primary-50 hover:border-primary/30 transition-colors whitespace-nowrap"
                        >
                          <PenLine size={13} /> Update
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* decision */}
          <div className="px-6 sm:px-9 pt-4 pb-8">
            {anyFlagged ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
                <p className="text-[15px] font-semibold text-text">
                  You’ve flagged {flaggedKeys.length} change{flaggedKeys.length > 1 ? 's' : ''}
                </p>
                <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                  Send these to us and we’ll sort them out with you before filing. Everything else will be confirmed
                  as correct. We won’t file anything with Companies House until it’s resolved.
                </p>
                {!allFlaggedHaveNotes ? (
                  <p className="mt-3 text-[13px] font-medium text-amber-700">
                    Please add a note on each flagged item so we know what’s changed.
                  </p>
                ) : null}
                {error ? <p className="text-rose-600 text-sm mt-3">{error}</p> : null}
                <button
                  onClick={post}
                  disabled={submitting || !allFlaggedHaveNotes}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 text-white font-semibold shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <PenLine size={18} />}
                  {submitting ? 'Sending…' : 'Send my changes'}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6">
                <p className="text-[15px] font-semibold text-text">Confirm &amp; file</p>
                <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                  We won’t file anything with Companies House until you approve it below
                  {dto.dueDate ? <> — please do this before <strong className="font-semibold text-text">{dto.dueDate}</strong></> : null}.
                </p>

                <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lawful}
                    onChange={(e) => setLawful(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[var(--color-primary,#1A7A9B)] shrink-0"
                  />
                  <span className="text-[13px] text-text leading-relaxed">
                    I confirm the company is trading lawfully and intends to continue carrying on its activities
                    lawfully in the year ahead.
                  </span>
                </label>

                {!lawful ? (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-[13px] leading-relaxed text-amber-800">
                    <span>
                      We can only file a confirmation statement once the company can confirm it will keep trading
                      lawfully. Please{' '}
                      <a className="font-semibold underline" href={`mailto:${brandEmail}`}>get in touch</a> and we’ll
                      help.
                    </span>
                  </p>
                ) : null}

                {error ? <p className="text-rose-600 text-sm mt-3">{error}</p> : null}

                <button
                  onClick={post}
                  disabled={submitting || !lawful}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {submitting ? 'Confirming…' : 'Approve & confirm these details'}
                </button>
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
            </div>

            {dto.dueDate ? (
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-start gap-3 bg-amber-50/40">
                <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <CalendarClock size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Approve by</p>
                  <p className="text-lg font-bold text-text leading-tight">{dto.dueDate}</p>
                  <p className="text-[12px] text-text-light mt-0.5 leading-relaxed">
                    We can’t file until you approve — please do this as soon as you can, and before this date.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="px-5 sm:px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-light mb-2">What happens next</p>
              <p className="text-[13px] text-text-light leading-relaxed">
                Once you approve, we file your confirmation statement with Companies House and email you when it’s
                done. If you flag a change, we’ll sort it out with you first. Nothing is filed until you approve.
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
        <ul className="space-y-1.5">
          {dto.sicCodes.map((c, i) => {
            const desc = sicDescription(c);
            return (
              <li key={i} className="flex items-baseline gap-2.5">
                <span className="inline-flex items-center rounded-md bg-primary-50 text-primary px-2 py-0.5 text-[13px] font-semibold tabular-nums shrink-0">
                  {c}
                </span>
                {desc ? <span className="text-[15px] text-text">{desc}</span> : null}
              </li>
            );
          })}
        </ul>
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
