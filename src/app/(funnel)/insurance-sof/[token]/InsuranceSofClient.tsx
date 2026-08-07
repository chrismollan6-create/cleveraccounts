'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ShieldCheck, Check, Lock, Clock, FileCheck2, Mail, Phone } from 'lucide-react';
import type { InsuranceSofDto } from './page';

type YN = '' | 'yes' | 'no';
type Source = '' | 'Recruitment Agency' | 'End Client' | 'No';

const today = () => new Date().toISOString().slice(0, 10);

/* ---------- small building blocks ---------- */

function Choice({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 min-w-[4.5rem] justify-center px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              active
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-text border-gray-200 hover:border-primary/40 hover:bg-primary/[0.04]'
            }`}
          >
            {active && <Check size={15} strokeWidth={3} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function QuestionRow({
  n,
  label,
  hint,
  answered,
  children,
}: {
  n: number;
  label: string;
  hint?: string;
  answered: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex gap-3">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
            answered ? 'bg-primary text-white' : 'bg-gray-100 text-text-light'
          }`}
        >
          {answered ? <Check size={13} strokeWidth={3} /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[0.95rem] font-medium text-text leading-snug">{label}</div>
          {hint && <div className="text-xs text-text-light mt-0.5">{hint}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

function RailCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>{children}</div>
  );
}

/* ---------- main ---------- */

export default function InsuranceSofClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: InsuranceSofDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const [startDate, setStartDate] = useState('');
  const [singlePerson, setSinglePerson] = useState<YN>('');
  const [outsideUS, setOutsideUS] = useState<YN>('');
  const [professionalPI, setProfessionalPI] = useState<YN>('');
  const [highRisk, setHighRisk] = useState<YN>('');
  const [adverse, setAdverse] = useState<YN>('');
  const [source, setSource] = useState<Source>('');
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<'' | 'Suitable' | 'Unsuitable'>('');
  const [error, setError] = useState('');

  const answers = [!!startDate, !!singlePerson, !!outsideUS, !!professionalPI, !!highRisk, !!adverse, !!source];
  const answeredCount = answers.filter(Boolean).length;
  const total = answers.length;
  const allAnswered = answeredCount === total;
  const pct = Math.round((answeredCount / total) * 100);

  // Client-side branch preview only — the server is the source of truth on submit.
  const suitable = useMemo(
    () =>
      singlePerson === 'yes' &&
      outsideUS === 'yes' &&
      professionalPI === 'no' &&
      highRisk === 'no' &&
      adverse === 'no' &&
      (source === 'Recruitment Agency' || source === 'End Client'),
    [singlePerson, outsideUS, professionalPI, highRisk, adverse, source],
  );

  const canSubmit = allAnswered && !submitting && (!suitable || (confirmed && name.trim().length > 1));

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/insurance-sof/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: name.trim(),
          answers: {
            startDate,
            singlePersonCompany: singlePerson === 'yes',
            worksOutsideUSCanada: outsideUS === 'yes',
            needsProfessionalBodyPI: professionalPI === 'yes',
            highRiskWork: highRisk === 'yes',
            adverseHistory: adverse === 'yes',
            workSource: source,
            confirmedTruth: confirmed,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone(data.suitability === 'Suitable' ? 'Suitable' : 'Unsuitable');
    } catch {
      setError('We couldn’t submit that just now. Please try again.');
      setSubmitting(false);
    }
  }

  /* ---------- success ---------- */
  if (done) {
    const ok = done === 'Suitable';
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
              ok ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
            }`}
          >
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we’ve got your answers</h1>
          <p className="text-text-light leading-relaxed">
            {ok ? (
              <>
                We’ll review your Statement of Facts for <strong>{dto.companyName}</strong> and, once accepted,
                issue your policy documents.
              </>
            ) : (
              <>
                Based on your answers we’re unable to offer this insurance cover for{' '}
                <strong>{dto.companyName}</strong>. We’ll be in touch to discuss your options and recommend an
                alternative if one is available.
              </>
            )}
          </p>
          {ok && (
            <div className="mt-5 rounded-xl bg-amber-50 text-amber-900 text-sm px-4 py-3 text-left">
              Please note you are <strong>not covered</strong> until you receive the policy schedules from us.
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-sm text-text-light">
            <a className="inline-flex items-center gap-1.5 hover:text-primary" href={`tel:${brandPhone.replace(/\s/g, '')}`}>
              <Phone size={14} /> {brandPhone}
            </a>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <a className="inline-flex items-center gap-1.5 hover:text-primary" href={`mailto:${brandEmail}`}>
              <Mail size={14} /> {brandEmail}
            </a>
          </div>
        </div>
      </main>
    );
  }

  const yn = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  /* ---------- form ---------- */
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl grid lg:grid-cols-[minmax(0,1fr)_336px] gap-6 lg:gap-8 items-start">
        {/* LEFT — the form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={22} />
              </span>
              <h1 className="text-2xl sm:text-[1.7rem] font-bold text-text leading-tight">
                Insurance Statement of Facts
              </h1>
            </div>
            <p className="text-text-light leading-relaxed">
              Complete this short declaration to arrange insurance cover for{' '}
              <strong className="text-text">{dto.companyName}</strong> — designed exclusively for contractors and
              consultants.
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-medium text-text-light mb-1.5">
                <span>Your answers</span>
                <span>
                  {answeredCount} of {total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex gap-2.5 rounded-xl bg-amber-50/70 border border-amber-100 px-4 py-3 mb-2 text-sm text-amber-900">
              <ShieldCheck size={18} className="shrink-0 mt-0.5 text-amber-500" />
              <span>
                Please answer all questions accurately and truthfully. Inaccurate answers may invalidate your cover
                in the event of a claim.
              </span>
            </div>

            <QuestionRow n={1} label="When do you want the insurance to start?" hint="Must be today or later" answered={!!startDate}>
              <input
                type="date"
                min={today()}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-3 w-full sm:w-auto border border-gray-200 rounded-lg px-3.5 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </QuestionRow>

            <QuestionRow n={2} label="Are you a single-person limited company?" hint="Only fee-earning additional directors" answered={!!singlePerson}>
              <Choice value={singlePerson} onChange={(v) => setSinglePerson(v as YN)} options={yn} />
            </QuestionRow>

            <QuestionRow n={3} label="Do you work outside the USA or Canada?" answered={!!outsideUS}>
              <Choice value={outsideUS} onChange={(v) => setOutsideUS(v as YN)} options={yn} />
            </QuestionRow>

            <QuestionRow
              n={4}
              label="Do you need specific professional indemnity insurance as part of your membership to a professional body e.g. ARB, ICAEW, RICS, SRA or similar?"
              answered={!!professionalPI}
            >
              <Choice value={professionalPI} onChange={(v) => setProfessionalPI(v as YN)} options={yn} />
            </QuestionRow>

            <QuestionRow
              n={5}
              label="Do you carry out any Offshore work, Safety Critical Rail work, Asbestos Related work or work which requires Medical Malpractice Insurance?"
              answered={!!highRisk}
            >
              <Choice value={highRisk} onChange={(v) => setHighRisk(v as YN)} options={yn} />
            </QuestionRow>

            <QuestionRow
              n={6}
              label="Have you ever been declined insurance, accepted on special terms, or convicted of any non-motoring criminal offence?"
              answered={!!adverse}
            >
              <Choice value={adverse} onChange={(v) => setAdverse(v as YN)} options={yn} />
            </QuestionRow>

            <QuestionRow
              n={7}
              label="You obtain work through a recruitment agency or direct to the end client (not the general public) — e.g. you work as a contractor."
              answered={!!source}
            >
              <Choice
                value={source}
                onChange={(v) => setSource(v as Source)}
                options={[
                  { value: 'Recruitment Agency', label: 'Recruitment Agency' },
                  { value: 'End Client', label: 'End Client' },
                  { value: 'No', label: 'No' },
                ]}
              />
            </QuestionRow>

            {/* branch */}
            {allAnswered && suitable && (
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
                <div className="text-sm text-text leading-relaxed mb-4">
                  Good news — this policy may be suitable for you. Please confirm the statements are correct and
                  submit. We’ll review and, if accepted, issue your policy documents.
                  <span className="block mt-2 text-amber-800 font-medium">
                    Until you receive the policy schedules from us, you are not yet covered.
                  </span>
                </div>

                <label className="block text-sm font-semibold text-text mb-1.5">Your full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 mb-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[color:var(--color-primary)]"
                  />
                  <span className="text-sm text-text-light leading-relaxed">
                    I confirm the above statements of truth are correct.
                  </span>
                </label>
              </div>
            )}

            {allAnswered && !suitable && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 leading-relaxed">
                Based on one or more of your answers, we’re unable to offer you this insurance cover. Please submit
                anyway — we’ll be in touch to discuss your options and recommend an alternative if available.
              </div>
            )}

            {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}

            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit}
              className="w-full mt-6 bg-primary text-white font-semibold py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.99] transition"
            >
              {submitting ? 'Submitting…' : allAnswered ? 'Submit declaration' : `Answer all ${total} questions to continue`}
            </button>
          </div>
        </div>

        {/* RIGHT — rail */}
        <aside className="lg:sticky lg:top-8 space-y-4">
          <RailCard className="overflow-hidden !p-0">
            <div className="bg-gradient-to-br from-primary to-primary/80 px-5 py-4 text-white">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} /> Your cover
              </div>
            </div>
            <ul className="p-5 space-y-3 text-sm">
              {[
                ['Professional Indemnity', '£5,000,000 any one claim & aggregate'],
                ['Employers’ Liability', '£10,000,000 any one occurrence'],
                ['Public Liability', '£10,000,000 any one claim'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-2.5">
                  <Check size={16} className="shrink-0 mt-0.5 text-emerald-500" strokeWidth={3} />
                  <div>
                    <div className="font-semibold text-text">{t}</div>
                    <div className="text-text-light text-[0.8rem]">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </RailCard>

          <RailCard>
            <div className="text-sm font-semibold text-text mb-4">What happens next</div>
            <ol className="space-y-4">
              {[
                { icon: FileCheck2, t: 'You complete this form', d: 'Takes about a minute.' },
                { icon: Clock, t: 'We review your answers', d: 'To confirm the policy is suitable.' },
                { icon: ShieldCheck, t: 'We issue your policy schedules', d: 'You’re covered once you receive them.' },
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon size={16} />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-text">{s.t}</div>
                    <div className="text-xs text-text-light">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </RailCard>

          <RailCard>
            <div className="flex items-center gap-2 text-xs text-text-light mb-3">
              <Lock size={13} /> Secure &amp; encrypted
            </div>
            <div className="text-sm font-semibold text-text mb-1">Need a hand?</div>
            <p className="text-xs text-text-light mb-3">We’re happy to help you through it.</p>
            <div className="space-y-1.5 text-sm">
              <a className="flex items-center gap-2 text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>
                <Phone size={14} /> {brandPhone}
              </a>
              <a className="flex items-center gap-2 text-primary hover:underline" href={`mailto:${brandEmail}`}>
                <Mail size={14} /> {brandEmail}
              </a>
            </div>
          </RailCard>
        </aside>
      </div>
    </main>
  );
}
