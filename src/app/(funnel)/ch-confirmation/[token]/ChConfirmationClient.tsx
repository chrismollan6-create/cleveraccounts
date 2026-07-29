'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import { CheckCircle2, Building2, Users, ShieldCheck, Mail, Tag, FileText } from 'lucide-react';
import type { ChConfirmationDto } from './page';

const CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

type Lane = 'red' | 'green';
interface Answer {
  ok: boolean;
  note: string;
  value?: string;
}
type AnswerMap = Record<string, Answer>;

const SECTION_KEYS = ['companyName', 'registeredOffice', 'officers', 'pscs', 'sic', 'email'];

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
  const [ans, setAns] = useState<AnswerMap>(() =>
    Object.fromEntries(SECTION_KEYS.map((k) => [k, { ok: true, note: '', value: '' } as Answer])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | 'confirmed' | 'changes'>(null);
  const [error, setError] = useState('');

  const setOk = (key: string, ok: boolean) =>
    setAns((a) => ({ ...a, [key]: { ...a[key], ok } }));
  const setNote = (key: string, note: string) =>
    setAns((a) => ({ ...a, [key]: { ...a[key], note } }));
  const setValue = (key: string, value: string) =>
    setAns((a) => ({ ...a, [key]: { ...a[key], value } }));

  const anyChanges = SECTION_KEYS.some((k) => !ans[k].ok);

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const sections: Record<string, Answer> = {};
      for (const k of SECTION_KEYS) sections[k] = ans[k];
      const res = await fetch('/api/ch-confirmation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, payload: { sections } }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong.');
      setDone(anyChanges ? 'changes' : 'confirmed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className={`max-w-lg w-full ${CARD} p-8 sm:p-10`}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">
            {done === 'confirmed' ? 'Thanks — that’s confirmed' : 'Thanks — we’ve got your response'}
          </h1>
          <p className="text-text-light leading-relaxed">
            {done === 'confirmed'
              ? 'We’ve got everything we need and will file your confirmation statement with Companies House. We’ll let you know once it’s done.'
              : 'You’ve told us something’s changed. One of the team will be in touch to sort it out before we file.'}
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
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3">
          <FileText size={16} /> Confirmation statement
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">{dto.companyName}</h1>
        <p className="text-text-light mt-1">
          Company {dto.companyNumber}
          {dto.dueDate ? ` · due ${dto.dueDate}` : ''}
        </p>
        <p className="text-text-light leading-relaxed mt-4">
          Once a year we confirm to Companies House that your company details are up to date. Please
          check each section below and let us know if anything’s changed — it only takes a minute.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Company name" icon={Tag} lane="red" answer={ans.companyName} sectionKey="companyName" setOk={setOk} setNote={setNote}>
          <p className="text-text font-medium">{dto.companyName}</p>
        </Section>

        <Section title="Registered office address" icon={Building2} lane="red" answer={ans.registeredOffice} sectionKey="registeredOffice" setOk={setOk} setNote={setNote}>
          <p className="text-text">{dto.registeredOffice || 'Not on record'}</p>
        </Section>

        <Section title="Directors" icon={Users} lane="red" answer={ans.officers} sectionKey="officers" setOk={setOk} setNote={setNote}>
          {dto.officers && dto.officers.length ? (
            <ul className="space-y-1.5">
              {dto.officers.map((o, i) => (
                <li key={i} className="text-text">
                  <span className="font-medium">{o.name}</span>
                  {o.role ? <span className="text-text-light"> · {o.role}</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-light">No directors on record</p>
          )}
        </Section>

        <Section title="People with significant control" icon={ShieldCheck} lane="red" answer={ans.pscs} sectionKey="pscs" setOk={setOk} setNote={setNote}>
          {dto.pscs && dto.pscs.length ? (
            <ul className="space-y-1.5">
              {dto.pscs.map((p, i) => (
                <li key={i} className="text-text font-medium">{p.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-text-light">None on record</p>
          )}
        </Section>

        <Section title="Nature of business (SIC codes)" icon={Tag} lane="green" answer={ans.sic} sectionKey="sic" setOk={setOk} setNote={setNote}>
          {dto.sicCodes && dto.sicCodes.length ? (
            <div className="flex flex-wrap gap-2">
              {dto.sicCodes.map((c, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-primary-50 text-primary px-2.5 py-0.5 text-sm font-medium">{c}</span>
              ))}
            </div>
          ) : (
            <p className="text-text-light">No SIC codes on record</p>
          )}
        </Section>

        <Section title="Registered email address" icon={Mail} lane="green" answer={ans.email} sectionKey="email" setOk={setOk} setNote={setNote}>
          <p className="text-text">{dto.registeredEmail || 'Not on record'}</p>
          {!ans.email.ok ? (
            <input
              type="email"
              className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Your correct registered email address"
              value={ans.email.value || ''}
              onChange={(e) => setValue('email', e.target.value)}
            />
          ) : null}
        </Section>
      </div>

      {/* Submit */}
      <div className={`${CARD} p-5 sm:p-6 mt-6`}>
        <p className="text-sm text-text-light leading-relaxed mb-4">
          By submitting you confirm the details you’ve marked as correct are accurate, and that the
          company is lawfully carrying on business. If you’ve flagged a change, we’ll be in touch
          before filing.
        </p>
        {error ? <p className="text-rose-600 text-sm mb-3">{error}</p> : null}
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : anyChanges ? 'Submit my changes' : 'Confirm my details are correct'}
        </button>
      </div>

      <p className="text-center text-xs text-text-light mt-6">
        Need help? <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a> · {brandPhone}
      </p>
    </main>
  );
}

function Section({
  title,
  icon: Icon,
  lane,
  answer,
  sectionKey,
  setOk,
  setNote,
  children,
}: {
  title: string;
  icon: ComponentType<{ size?: number }>;
  lane: Lane;
  answer: Answer;
  sectionKey: string;
  setOk: (key: string, ok: boolean) => void;
  setNote: (key: string, note: string) => void;
  children: ReactNode;
}) {
  const changeLabel = lane === 'red' ? 'Something’s changed' : 'Needs updating';
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary"><Icon size={18} /></span>
        <h2 className="text-base font-semibold text-text">{title}</h2>
      </div>
      <div className="mb-4">{children}</div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setOk(sectionKey, true)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
            answer.ok ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-text-light hover:border-gray-300'
          }`}
        >
          {answer.ok ? <CheckCircle2 size={15} /> : null} This is correct
        </button>
        <button
          onClick={() => setOk(sectionKey, false)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
            !answer.ok ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-text-light hover:border-gray-300'
          }`}
        >
          {changeLabel}
        </button>
      </div>
      {!answer.ok ? (
        <textarea
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={2}
          placeholder="Tell us what’s changed (optional)"
          value={answer.note}
          onChange={(e) => setNote(sectionKey, e.target.value)}
        />
      ) : null}
    </div>
  );
}
