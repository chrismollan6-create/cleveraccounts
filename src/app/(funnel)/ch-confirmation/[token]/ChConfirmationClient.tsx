'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import { CheckCircle2, Building2, Users, ShieldCheck, Mail, Tag, FileText, Lock, Loader2 } from 'lucide-react';
import type { ChConfirmationDto } from './page';

/** Same premium elevation as the VAT approval + accounts signing pages, so the three read as one system. */
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

  const setOk = (key: string, ok: boolean) => setAns((a) => ({ ...a, [key]: { ...a[key], ok } }));
  const setNote = (key: string, note: string) => setAns((a) => ({ ...a, [key]: { ...a[key], note } }));
  const setValue = (key: string, value: string) => setAns((a) => ({ ...a, [key]: { ...a[key], value } }));

  const changedCount = SECTION_KEYS.filter((k) => !ans[k].ok).length;
  const anyChanges = changedCount > 0;

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
        {/* Left: the review */}
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
              Once a year we confirm to Companies House that your company details are up to date. Please
              check each section below and let us know if anything’s changed — it only takes a minute.
            </p>
          </div>

          {/* sections */}
          <div className="px-6 sm:px-9 pb-8 divide-y divide-gray-100">
            <Section title="Company name" icon={Tag} lane="red" answer={ans.companyName} sectionKey="companyName" setOk={setOk} setNote={setNote}>
              <p className="text-[15px] font-semibold text-text">{dto.companyName}</p>
            </Section>

            <Section title="Registered office address" icon={Building2} lane="red" answer={ans.registeredOffice} sectionKey="registeredOffice" setOk={setOk} setNote={setNote}>
              <p className="text-[15px] text-text">{dto.registeredOffice || 'Not on record'}</p>
            </Section>

            <Section title="Directors" icon={Users} lane="red" answer={ans.officers} sectionKey="officers" setOk={setOk} setNote={setNote}>
              {dto.officers && dto.officers.length ? (
                <ul className="space-y-1.5">
                  {dto.officers.map((o, i) => (
                    <li key={i} className="text-[15px] text-text">
                      <span className="font-semibold">{o.name}</span>
                      {o.role ? <span className="text-text-light"> · {o.role}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] text-text-light">No directors on record</p>
              )}
            </Section>

            <Section title="People with significant control" icon={ShieldCheck} lane="red" answer={ans.pscs} sectionKey="pscs" setOk={setOk} setNote={setNote}>
              {dto.pscs && dto.pscs.length ? (
                <ul className="space-y-1.5">
                  {dto.pscs.map((p, i) => (
                    <li key={i} className="text-[15px] font-semibold text-text">{p.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] text-text-light">None on record</p>
              )}
            </Section>

            <Section title="Nature of business (SIC codes)" icon={Tag} lane="green" answer={ans.sic} sectionKey="sic" setOk={setOk} setNote={setNote}>
              {dto.sicCodes && dto.sicCodes.length ? (
                <div className="flex flex-wrap gap-2">
                  {dto.sicCodes.map((c, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-primary-50 text-primary px-2.5 py-0.5 text-sm font-medium tabular-nums">{c}</span>
                  ))}
                </div>
              ) : (
                <p className="text-[15px] text-text-light">No SIC codes on record</p>
              )}
            </Section>

            <Section title="Registered email address" icon={Mail} lane="green" answer={ans.email} sectionKey="email" setOk={setOk} setNote={setNote}>
              <p className="text-[15px] text-text">{dto.registeredEmail || 'Not on record'}</p>
              {!ans.email.ok ? (
                <input
                  type="email"
                  className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Your correct registered email address"
                  value={ans.email.value || ''}
                  onChange={(e) => setValue('email', e.target.value)}
                />
              ) : null}
            </Section>
          </div>
        </div>

        {/* Right: pinned confirm rail */}
        <aside className="mt-6 lg:mt-0 lg:sticky lg:top-8 space-y-4">
          <div className={`${CARD} overflow-hidden`}>
            <div className="bg-gradient-to-b from-primary-50 to-primary-50/40 px-5 sm:px-6 py-4 border-b border-primary/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">Your confirmation</p>
              <p className="mt-1.5 text-[15px] font-bold text-text leading-snug">{dto.companyName}</p>
              {dto.dueDate ? <p className="text-[13px] text-text-light mt-0.5">Due {dto.dueDate}</p> : null}
            </div>
            <div className="px-5 sm:px-6 py-5">
              {anyChanges ? (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[13px] leading-relaxed text-amber-800">
                  <span className="tabular-nums font-semibold">{changedCount}</span>
                  <span>section{changedCount === 1 ? '' : 's'} flagged — we’ll be in touch to sort {changedCount === 1 ? 'it' : 'them'} out before filing.</span>
                </div>
              ) : (
                <p className="text-[13px] text-text-light leading-relaxed">
                  If everything above is correct, confirm below and we’ll file your confirmation statement with Companies House.
                </p>
              )}

              <p className="mt-4 text-[12px] text-text-light leading-relaxed">
                By confirming, you agree the details you’ve marked correct are accurate and the company is lawfully carrying on business.
              </p>

              {error ? <p className="text-rose-600 text-sm mt-3">{error}</p> : null}

              <button
                onClick={submit}
                disabled={submitting}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {submitting ? 'Submitting…' : anyChanges ? 'Submit my changes' : 'Confirm my details are correct'}
              </button>

              <p className="mt-3 text-center text-[12px] text-text-light">Nothing is filed until you confirm.</p>
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
    <div className="py-7 first:pt-6 last:pb-0">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="block h-[3px] w-6 rounded-full bg-primary" />
        <h2 className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-primary">
          <Icon size={13} /> {title}
        </h2>
      </div>
      <div className="mb-4">{children}</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOk(sectionKey, true)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
            answer.ok ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-text-light hover:border-gray-300'
          }`}
        >
          {answer.ok ? <CheckCircle2 size={15} /> : null} This is correct
        </button>
        <button
          type="button"
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
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          rows={2}
          placeholder="Tell us what’s changed (optional)"
          value={answer.note}
          onChange={(e) => setNote(sectionKey, e.target.value)}
        />
      ) : null}
    </div>
  );
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
