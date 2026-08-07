'use client';

import { CheckCircle2, Download, FileText, ShieldCheck, Phone, Mail, Clock, Info } from 'lucide-react';
import { BLOCK_PERIOD_END, formatCertDate } from '@/content/insurance-certificate';

/**
 * Post-submission page shown after an insurance Statement of Facts is submitted.
 * Suitable → a proper "you're covered" confirmation with the cover summary,
 * document downloads, next steps and help. Unsuitable → a follow-up message.
 */
export default function InsuranceSuccess({
  suitable,
  companyName,
  startDate,
  token,
  brandEmail,
  brandPhone,
}: {
  suitable: boolean;
  companyName: string;
  startDate: string;
  token: string;
  brandEmail: string;
  brandPhone: string;
}) {
  if (!suitable) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-amber-600 bg-amber-50">
              <Info size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we’ve got your answers</h1>
            <p className="text-text-light leading-relaxed">
              Based on your answers we’re unable to offer this insurance cover for{' '}
              <strong className="text-text">{companyName}</strong>. It’s designed for a specific type of
              contractor and consultant, and one or more of your answers falls outside that.
            </p>
            <p className="text-text-light leading-relaxed mt-3">
              Please don’t worry — a member of our team will be in touch to talk through your options and
              recommend a suitable alternative where one is available.
            </p>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-sm font-semibold text-text mb-2">Need to talk to us sooner?</div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-sm">
                <a className="inline-flex items-center gap-2 text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>
                  <Phone size={15} /> {brandPhone}
                </a>
                <a className="inline-flex items-center gap-2 text-primary hover:underline" href={`mailto:${brandEmail}`}>
                  <Mail size={15} /> {brandEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const coverStart = formatCertDate(startDate);
  const coverEnd = formatCertDate(BLOCK_PERIOD_END);

  const coverRows: [string, string][] = [
    ['Insurer', 'Markel (UK) Ltd'],
    ['Broker', 'Caunce O’Hara'],
    ['Cover starts', coverStart],
    ['Cover to', coverEnd],
  ];
  const limits: [string, string][] = [
    ['Professional Indemnity', '£5,000,000 any one claim'],
    ['Employers’ Liability', '£10,000,000 any one occurrence'],
    ['Public Liability', '£10,000,000 any one claim'],
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-white px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 text-emerald-600 bg-emerald-100/70">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">You’re covered</h1>
          <p className="text-text-light leading-relaxed max-w-lg mx-auto">
            Your insurance for <strong className="text-text">{companyName}</strong> is confirmed and your cover
            starts on <strong className="text-text">{coverStart}</strong>. We’ve emailed your Verification
            Certificate and policy documents to you — and you can download them below.
          </p>
        </div>

        {/* Downloads */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <a
            href={`/api/insurance-certificate/pdf?sof=${encodeURIComponent(token)}`}
            className="flex items-center gap-3 rounded-xl bg-primary text-white px-5 py-4 font-semibold hover:opacity-95 transition"
          >
            <Download size={20} className="shrink-0" />
            <span>
              Download your certificate
              <span className="block text-xs font-normal text-white/80">Verification Certificate (PDF)</span>
            </span>
          </a>
          <a
            href="/insurance/policy-wording.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 text-text px-5 py-4 font-semibold hover:border-primary/40 hover:bg-primary/[0.03] transition"
          >
            <FileText size={20} className="shrink-0 text-primary" />
            <span>
              Policy wording &amp; key facts
              <span className="block text-xs font-normal text-text-light">Full terms &amp; conditions (PDF)</span>
            </span>
          </a>
        </div>

        {/* Cover summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-gray-100">
            <ShieldCheck size={18} className="text-primary" />
            <div className="font-semibold text-text">Your cover</div>
          </div>
          <div className="px-5 sm:px-6 py-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {coverRows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-dashed border-gray-100 pb-2">
                <span className="text-text-light">{k}</span>
                <span className="font-semibold text-text text-right">{v}</span>
              </div>
            ))}
          </div>
          <div className="px-5 sm:px-6 pb-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-light mb-2">Limits of indemnity</div>
            <ul className="space-y-1.5 text-sm">
              {limits.map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4">
                  <span className="text-text-light">{k}</span>
                  <span className="font-semibold text-text text-right">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next steps / cooling-off */}
        <div className="flex gap-3 rounded-xl bg-blue-50/70 border border-blue-100 px-5 py-4 mb-6 text-sm text-blue-900">
          <Clock size={18} className="shrink-0 mt-0.5 text-blue-500" />
          <div>
            <div className="font-semibold mb-0.5">Good to know</div>
            Please keep your certificate and policy wording somewhere safe — you may need them to prove cover.
            This policy has a 14-day cooling-off period from the day you receive your documents.
          </div>
        </div>

        {/* Help */}
        <div className="text-center text-sm text-text-light">
          Questions about your cover? Contact us on{' '}
          <a className="text-primary hover:underline font-medium" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>{' '}
          or <a className="text-primary hover:underline font-medium" href={`mailto:${brandEmail}`}>{brandEmail}</a>.
        </div>
      </div>
    </main>
  );
}
