'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { InsuranceSofDto } from './page';

type YN = '' | 'yes' | 'no';
type Source = '' | 'Recruitment Agency' | 'End Client' | 'No';

const today = () => new Date().toISOString().slice(0, 10);

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
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium border transition ${
              active
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-50 text-text border-gray-200 hover:border-gray-300'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Question({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="text-sm font-medium text-text">{label}</div>
      {hint && <div className="text-xs text-text-light mt-0.5">{hint}</div>}
      {children}
    </div>
  );
}

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

  const allAnswered =
    !!startDate && !!singlePerson && !!outsideUS && !!professionalPI && !!highRisk && !!adverse && !!source;

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

  if (done) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we’ve got your answers</h1>
          <p className="text-text-light leading-relaxed">
            {done === 'Suitable' ? (
              <>
                We’ll review your Statement of Facts for <strong>{dto.companyName}</strong> and, once accepted,
                issue your policy documents.{' '}
                <strong>Please note you are not covered until you receive the policy schedules from us.</strong>
              </>
            ) : (
              <>
                Based on your answers we’re unable to offer the premium block policy for{' '}
                <strong>{dto.companyName}</strong>. We’ll be in touch to discuss your options and recommend an
                alternative if one is available.
              </>
            )}
          </p>
          <p className="text-xs text-text-light mt-6">
            Questions? Contact us on{' '}
            <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>{' '}
            or <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>.
          </p>
        </div>
      </main>
    );
  }

  const yn = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-primary" size={26} />
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Insurance Statement of Facts</h1>
        </div>
        <p className="text-text-light leading-relaxed mb-5">
          Complete this short declaration for <strong>{dto.companyName}</strong> to join our block
          professional-indemnity policy.
        </p>

        <div className="rounded-xl border-2 border-primary/60 bg-white p-4 mb-4 text-sm">
          <div className="font-semibold text-text mb-1">Insurance overview</div>
          <ul className="space-y-1 text-text-light">
            <li><strong>Professional Indemnity</strong> — £5,000,000 any one claim and in the aggregate</li>
            <li><strong>Employers’ Liability</strong> — £10,000,000 any one occurrence</li>
            <li><strong>Public Liability</strong> — £10,000,000 any one claim</li>
          </ul>
        </div>

        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-2 text-sm text-text-light">
          Please answer all questions accurately and truthfully. Failure to provide accurate answers may
          result in your insurance becoming invalid in the event of a claim.
        </div>

        <Question label="When do you want the insurance to start?" hint="Start date must be today or later">
          <input
            type="date"
            min={today()}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Question>

        <Question label="Are you a single-person limited company?" hint="Only fee-earning additional directors">
          <Choice value={singlePerson} onChange={(v) => setSinglePerson(v as YN)} options={yn} />
        </Question>

        <Question label="Do you work outside the USA or Canada?">
          <Choice value={outsideUS} onChange={(v) => setOutsideUS(v as YN)} options={yn} />
        </Question>

        <Question label="Do you need specific professional indemnity insurance as part of your membership to a professional body e.g. ARB, ICAEW, RICS, SRA or similar?">
          <Choice value={professionalPI} onChange={(v) => setProfessionalPI(v as YN)} options={yn} />
        </Question>

        <Question label="Do you carry out any Offshore work, Safety Critical Rail work, Asbestos Related work or work which requires Medical Malpractice Insurance?">
          <Choice value={highRisk} onChange={(v) => setHighRisk(v as YN)} options={yn} />
        </Question>

        <Question label="Have you ever been declined insurance, accepted on special terms or ever convicted of any non-motoring criminal offence?">
          <Choice value={adverse} onChange={(v) => setAdverse(v as YN)} options={yn} />
        </Question>

        <Question label="You obtain work through a recruitment agency or direct to the end client (not the general public) and never on a direct basis with customers e.g. you work as a contractor.">
          <Choice
            value={source}
            onChange={(v) => setSource(v as Source)}
            options={[
              { value: 'Recruitment Agency', label: 'Recruitment Agency' },
              { value: 'End Client', label: 'End Client' },
              { value: 'No', label: 'No' },
            ]}
          />
        </Question>

        {allAnswered && suitable && (
          <div className="mt-5">
            <div className="rounded-lg bg-blue-50 text-blue-900 p-3 text-sm mb-3">
              This insurance may be suitable for your requirements. Please read the terms below and, if you
              agree, confirm and submit. Once submitted we’ll review the request to ensure suitability and, if
              accepted, issue policy documents.{' '}
              <strong>Please note that until you receive the policy schedules from us you are NOT covered by insurance.</strong>
            </div>

            <label className="block text-sm font-semibold text-text mb-1">Your full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-4 w-4" />
              <span className="text-sm text-text-light leading-relaxed">
                I confirm the above statements of truth are correct.
              </span>
            </label>
          </div>
        )}

        {allAnswered && !suitable && (
          <div className="mt-5 rounded-lg bg-amber-50 text-amber-900 p-3 text-sm">
            Unfortunately, due to one or more of your answers, we’re unable to offer you insurance through our
            premium package. Please submit and we’ll be in touch to discuss your options and recommend an
            alternative solution if available.
          </div>
        )}

        {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="w-full mt-6 bg-primary text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>

        <p className="text-xs text-text-light mt-5 text-center">
          Questions? Contact us on{' '}
          <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>{' '}
          or <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>.
        </p>
      </div>
    </main>
  );
}
