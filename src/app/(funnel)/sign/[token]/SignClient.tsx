'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  HelpCircle,
  Landmark,
  Lock,
  MessageSquareWarning,
  Phone,
  PenLine,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import SignaturePad from '../../engagement-letter/[token]/SignaturePad';
import PdfViewer from './PdfViewer';

export interface LetterPeriod {
  label?: string | null;
  taxLiability?: string | null;
  paymentDue?: string | null;
  paymentReference?: string | null;
}

export interface CoverLetter {
  noPayment?: boolean;
  periods?: LetterPeriod[] | null; // split period: >12-month year = two CT600s
  taxLiability?: string | null;
  paymentDue?: string | null;
  paymentReference?: string | null;
  revenue?: string | null;
  profit?: string | null;
  dividends?: string | null;
  adjustments?: string[];
  adjustmentsHtml?: string | null; // accountant-composed rich text (sanitised before render)
  s455Amount?: string | null;
  dlaNote?: string | null;
  dlaNoteHtml?: string | null;
  commentary?: string | null;
}

/**
 * Strict allowlist sanitiser for the accountant-composed rich-text fields.
 * Keeps basic formatting (bold/italic/underline/lists/paragraphs), drops every
 * attribute and any other tag. Content is staff-authored, but the letter is
 * public-token-served — never render it unfiltered.
 */
function sanitizeRichHtml(html: string): string {
  const ALLOWED = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'P', 'BR', 'DIV', 'SPAN']);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as Element;
    const inner = [...el.childNodes].map(walk).join('');
    if (!ALLOWED.has(el.tagName)) return inner; // unwrap unknown tags, keep content
    const tag = el.tagName.toLowerCase();
    return tag === 'br' ? '<br/>' : `<${tag}>${inner}</${tag}>`;
  };
  return [...doc.body.childNodes].map(walk).join('');
}

function RichBlock({ html }: { html: string }) {
  const [safe, setSafe] = useState('');
  useEffect(() => setSafe(sanitizeRichHtml(html)), [html]);
  return (
    <div
      className="text-sm text-text leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 last:[&_p]:mb-0"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

// Shared card treatment — matches the VAT approval page's depth so the two
// client-facing decision pages read as one system.
const SIGN_CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

interface Meta {
  documentTitle: string;
  documentType: string;
  approvalStatement: string;
  challengeType: 'Postcode' | 'Date of Birth' | 'None';
  signerFirstName: string;
  signerLastName: string;
  signerEmail: string;
  businessName: string;
  sourcePdfSha256: string;
  periodEndIso: string | null;
  alreadyDeclined: boolean;
}

interface Props {
  token: string;
  meta: Meta;
  coverLetter: CoverLetter | null;
  confirmations: string[];
  portalSessionKey?: string | null; // Clerk-verified portal login: skip the challenge
  brandPhone: string;
  brandEmail: string;
  brandName: string;
}

type Phase = 'challenge' | 'ready' | 'submitting' | 'signed' | 'declined' | 'locked';

/**
 * Client-side signing flow: identity challenge → covering letter + PDF review
 * → declaration + consents + signature (or request changes) → confirmation.
 *
 * The PDF (and the letter contents) only render once Salesforce has issued a
 * session key for a passed challenge, so nothing sensitive shows on a bare link.
 */
export default function SignClient({ token, meta, coverLetter, confirmations, portalSessionKey, brandPhone, brandEmail, brandName }: Props) {
  const [phase, setPhase] = useState<Phase>(portalSessionKey ? 'ready' : 'challenge');
  const [sessionKey, setSessionKey] = useState<string | null>(portalSessionKey ?? null);

  // Portal-authenticated arrivals skip the challenge — still log the view.
  useEffect(() => {
    if (portalSessionKey) {
      fetch(`/api/sign/view?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey: portalSessionKey }),
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [challengeBusy, setChallengeBusy] = useState(false);

  const [consentRead, setConsentRead] = useState(false);
  const [consentEsign, setConsentEsign] = useState(false);
  const [mode, setMode] = useState<'drawn' | 'typed'>('drawn');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [typedName, setTypedName] = useState('');
  const [fullName, setFullName] = useState(`${meta.signerFirstName} ${meta.signerLastName}`.trim());
  const [signError, setSignError] = useState<string | null>(null);
  const [sealed, setSealed] = useState(false);

  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [declineBusy, setDeclineBusy] = useState(false);
  const [declineError, setDeclineError] = useState<string | null>(null);
  const [signCardVisible, setSignCardVisible] = useState(false);

  // Sticky "go to sign" bar: shown while reviewing, hidden once the sign card
  // is on screen so it never covers the actual signature controls.
  useEffect(() => {
    if (phase !== 'ready') return;
    const card = document.getElementById('sign-card');
    if (!card || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setSignCardVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(card);
    return () => io.disconnect();
  }, [phase]);

  const isNoneChallenge = meta.challengeType === 'None';

  const submitChallenge = useCallback(
    async (answer: string) => {
      setChallengeBusy(true);
      setChallengeError(null);
      try {
        const res = await fetch(`/api/sign/challenge?t=${encodeURIComponent(token)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.sessionKey) {
          setSessionKey(data.sessionKey);
          setPhase('ready');
          fetch(`/api/sign/view?t=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionKey: data.sessionKey }),
          }).catch(() => {});
        } else if (data.locked) {
          setPhase('locked');
        } else {
          setChallengeError(data.message || data.error || 'That doesn’t match what we hold on file.');
        }
      } catch {
        setChallengeError('Something went wrong — please try again.');
      } finally {
        setChallengeBusy(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (isNoneChallenge && phase === 'challenge' && !challengeBusy && !sessionKey) {
      submitChallenge('');
    }
  }, [isNoneChallenge, phase, challengeBusy, sessionKey, submitChallenge]);

  const pdfUrl = useMemo(
    () =>
      sessionKey
        ? `/api/sign/pdf?t=${encodeURIComponent(token)}&k=${encodeURIComponent(sessionKey)}`
        : null,
    [token, sessionKey],
  );

  const canSign =
    consentRead &&
    consentEsign &&
    fullName.trim().length > 1 &&
    (mode === 'drawn' ? !!signatureDataUrl : typedName.trim().length > 1);

  const handleSign = async () => {
    if (!sessionKey || !canSign) return;
    setPhase('submitting');
    setSignError(null);
    try {
      const res = await fetch(`/api/sign/sign?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionKey,
          fullName: fullName.trim(),
          signatureDataUrl: mode === 'drawn' ? signatureDataUrl : null,
          typedName: mode === 'typed' ? typedName.trim() : null,
          sourcePdfSha256: meta.sourcePdfSha256,
          consentReadAndAccept: consentRead,
          consentToEsign: consentEsign,
          signerEmail: meta.signerEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSealed(!!data.sealed);
        setPhase('signed');
        window.scrollTo({ top: 0 });
      } else {
        setSignError(data.message || data.error || 'Signing failed — please try again.');
        setPhase('ready');
      }
    } catch {
      setSignError('Something went wrong — please try again.');
      setPhase('ready');
    }
  };

  const handleDecline = async () => {
    if (!sessionKey || declineReason.trim().length < 5) {
      setDeclineError('Please tell us what needs looking at (a sentence is fine).');
      return;
    }
    setDeclineBusy(true);
    setDeclineError(null);
    try {
      const res = await fetch(`/api/sign/decline?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey, reason: declineReason.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhase('declined');
        window.scrollTo({ top: 0 });
      } else {
        setDeclineError(data.message || data.error || 'Could not send — please try again.');
      }
    } catch {
      setDeclineError('Something went wrong — please try again.');
    } finally {
      setDeclineBusy(false);
    }
  };

  // ---------------------------------------------------------------- states

  if (phase === 'locked') {
    return (
      <StateCard
        icon={<Lock size={28} />}
        tone="error"
        title="This link has been locked"
        body={`Too many unsuccessful attempts. To protect your information the link is locked — please contact us at ${brandEmail} or ${brandPhone} and we'll reissue the document.`}
      />
    );
  }

  if (phase === 'declined' || (meta.alreadyDeclined && phase === 'challenge')) {
    return (
      <StateCard
        icon={<MessageSquareWarning size={28} />}
        tone="warning"
        title="Thanks — we're on it"
        body={`We've let your accountant know what needs looking at. We'll review your comments, make any changes needed, and send you a fresh version to sign. Nothing more to do for now — if you'd like to talk it through, call ${brandPhone} or email ${brandEmail}.`}
      />
    );
  }

  if (phase === 'signed') {
    const downloadUrl = sealed && pdfUrl ? `${pdfUrl}&signed=1` : null;
    const nextSteps: string[] = [
      sealed
        ? 'Your signed copy is on its way to your inbox — keep it for your records.'
        : 'Your signed copy will be emailed to you shortly — keep it for your records.',
      meta.documentType.includes('CT600') || meta.documentType.includes('Accounts')
        ? 'We file the accounts with Companies House and the return with HMRC — nothing more for you to do there.'
        : 'We take care of the filing with HMRC — nothing more for you to do there.',
    ];
    return (
      <StateCard
        icon={<CheckCircle2 size={28} />}
        tone="success"
        title="Signed — all done"
        body={`Thank you. ${meta.documentTitle} has been signed.`}
      >
        <ol className="text-left space-y-2.5 mb-6">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-text leading-relaxed">
              <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
          {(coverLetter?.periods ?? [])
            .filter((p) => p.taxLiability && p.paymentDue)
            .map((p, i) => (
              <li key={`p${i}`} className="flex gap-2.5 text-sm text-text leading-relaxed">
                <span className="w-5 h-5 shrink-0 rounded-full bg-amber-100 text-amber-700 font-bold text-[11px] flex items-center justify-center mt-0.5">
                  !
                </span>
                <span>
                  Diarise: <strong>{p.taxLiability}</strong> corporation tax ({p.label || `period ${i + 1}`})
                  due to HMRC by{' '}
                  <strong>
                    {new Date(p.paymentDue as string).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                  .
                </span>
              </li>
            ))}
          {coverLetter?.taxLiability && coverLetter?.paymentDue && (
            <li className="flex gap-2.5 text-sm text-text leading-relaxed">
              <span className="w-5 h-5 shrink-0 rounded-full bg-amber-100 text-amber-700 font-bold text-[11px] flex items-center justify-center mt-0.5">
                !
              </span>
              <span>
                One thing to diarise: <strong>{coverLetter.taxLiability}</strong> corporation tax is
                due to HMRC by{' '}
                <strong>
                  {new Date(coverLetter.paymentDue).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </strong>{' '}
                — payment details are in your signed copy.
              </span>
            </li>
          )}
        </ol>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            <Download size={18} />
            Download signed copy
          </a>
        )}
      </StateCard>
    );
  }

  if (phase === 'challenge') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-primary bg-primary/10">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">
            Hello{meta.signerFirstName ? ` ${meta.signerFirstName}` : ''}
          </h1>
          <p className="text-text-light mb-1">
            <strong className="text-text">{meta.documentTitle}</strong>
            {meta.businessName ? ` for ${meta.businessName}` : ''} is ready for your review and signature.
          </p>
          <p className="text-text-light text-sm mb-2">
            Because this document contains personal financial information, please confirm a detail we
            hold on file before it opens.
          </p>
          <details className="mb-6 text-xs text-text-light">
            <summary className="cursor-pointer text-primary hover:underline">
              Why do we ask this?
            </summary>
            <p className="mt-1.5 leading-relaxed">
              Email links can be forwarded. This quick check makes sure only you — not anyone who
              happens to have the link — can open documents containing your financial details. It
              also forms part of the legal evidence that it was really you who signed.
            </p>
          </details>

          {isNoneChallenge ? (
            <p className="text-text-light text-sm">Opening your document…</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (challengeAnswer.trim()) submitChallenge(challengeAnswer.trim());
              }}
            >
              <label className="block text-sm font-semibold text-text mb-1">
                {meta.challengeType === 'Postcode' ? 'Your postcode' : 'Your date of birth'}
              </label>
              <input
                type={meta.challengeType === 'Postcode' ? 'text' : 'date'}
                value={challengeAnswer}
                onChange={(e) => setChallengeAnswer(e.target.value)}
                placeholder={meta.challengeType === 'Postcode' ? 'e.g. LS1 4AB' : undefined}
                autoComplete={meta.challengeType === 'Postcode' ? 'postal-code' : 'bday'}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {challengeError && (
                <p className="text-rose-600 text-sm mt-2" role="alert">
                  {challengeError}
                </p>
              )}
              <button
                type="submit"
                disabled={challengeBusy || !challengeAnswer.trim()}
                className="mt-4 w-full px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {challengeBusy ? 'Checking…' : 'View document'}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-text-light">
            Not you, or having trouble? Contact us at{' '}
            <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>
              {brandEmail}
            </a>{' '}
            or {brandPhone}.
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------- ready / submitting

  const hasFigures = !!(coverLetter && (coverLetter.revenue || coverLetter.profit || coverLetter.dividends));
  const splitPeriods = (coverLetter?.periods ?? []).filter(
    (p) => p.taxLiability || p.paymentDue || p.paymentReference,
  );
  const hasPayment = !!(
    coverLetter &&
    (coverLetter.taxLiability || coverLetter.paymentDue || coverLetter.paymentReference || splitPeriods.length)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header + what-to-do steps */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <FileText size={20} />
          <span className="text-sm font-semibold uppercase tracking-wide">{meta.documentType}</span>
          <span className="ml-1 text-[11px] font-semibold text-text-light bg-gray-100 rounded-full px-2.5 py-0.5">
            ~2 minutes
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">{meta.documentTitle}</h1>
        {meta.businessName && <p className="text-text-light mt-1">{meta.businessName}</p>}

        <ol className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          {['Read the summary', 'Review the full document', 'Sign — 2 minutes'].map(
            (step, i) => (
              <li key={step} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-text">{step}</span>
              </li>
            ),
          )}
        </ol>
      </header>

      {/* Two columns from lg: the document + commentary on the left, the key
          figures and CT payment pinned on the right so the numbers stay in
          view while the client reads and scrolls. Stacks to one column below lg. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6 lg:items-start">
        {/* ── Left: letter, document, signature ── */}
        <div className="space-y-6 min-w-0">

      {/* Covering letter */}
      {coverLetter && (
        <section className={`${SIGN_CARD} p-6 sm:p-8`}>
          <h2 className="text-lg font-bold text-text mb-1">
            Hello {meta.signerFirstName || 'there'},
          </h2>
          <p className="text-text-light text-sm leading-relaxed mb-5">
            {meta.documentType.includes('CT600')
              ? 'Your year-end accounts and corporation tax return are'
              : 'Your year-end accounts are'}{' '}
            ready for your approval. Please read the summary, check the full document, and sign at
            the bottom. Once signed, we&rsquo;ll file everything with Companies House and HMRC for you.
          </p>

          {coverLetter.commentary && (
            <div className="border-l-4 border-primary/40 bg-primary/5 rounded-r-xl px-5 py-4 mb-6">
              <h3 className="text-sm font-bold text-text mb-1.5">Your accountant&rsquo;s commentary</h3>
              {coverLetter.commentary.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-sm text-text leading-relaxed mb-2 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          )}

          {(coverLetter.adjustmentsHtml || (coverLetter.adjustments && coverLetter.adjustments.length > 0)) && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-text mb-2">Year-end adjustments we&rsquo;ve made</h3>
              {coverLetter.adjustmentsHtml ? (
                <RichBlock html={coverLetter.adjustmentsHtml} />
              ) : (
                <ul className="space-y-1.5">
                  {(coverLetter.adjustments ?? []).map((adj, i) => (
                    <li key={i} className="flex gap-2 text-sm text-text leading-relaxed">
                      <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                      {adj}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-text-light mt-2">
                These will be reflected in your bookkeeping once you approve the accounts.
              </p>
            </div>
          )}

          {(coverLetter.dlaNoteHtml || coverLetter.dlaNote || coverLetter.s455Amount) && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-2">
              <h3 className="text-sm font-bold text-text mb-1">
                Director&rsquo;s loan account{coverLetter.s455Amount ? ' & S455 tax' : ''}
              </h3>
              {coverLetter.s455Amount && (
                <p className="text-sm text-text mb-2">
                  <span className="inline-block rounded-md bg-amber-100 text-amber-900 font-bold px-2 py-0.5">
                    S455 tax arising: {coverLetter.s455Amount}
                  </span>
                </p>
              )}
              {coverLetter.dlaNoteHtml ? (
                <RichBlock html={coverLetter.dlaNoteHtml} />
              ) : coverLetter.dlaNote ? (
                <p className="text-sm text-text leading-relaxed">{coverLetter.dlaNote}</p>
              ) : null}
            </div>
          )}

          <p className="text-xs text-text-light mt-4">
            It&rsquo;s your responsibility to check the accounts are accurate before signing — if
            anything looks wrong, use &ldquo;Request changes&rdquo; at the bottom and we&rsquo;ll put it
            right before you sign.
          </p>
        </section>
      )}

      {/* Document viewer */}
      <section className={`${SIGN_CARD} overflow-hidden`}>
        {pdfUrl && <PdfViewer url={pdfUrl} title={meta.documentTitle} />}
      </section>

      {/* Sign card */}
      <section id="sign-card" className={`${SIGN_CARD} p-6 sm:p-8 scroll-mt-6`}>
        <div className="flex items-center gap-2 mb-3">
          <PenLine size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-text">Approve and sign</h2>
        </div>
        <blockquote className="border-l-4 border-primary/40 bg-primary/5 rounded-r-lg px-4 py-3 text-sm text-text leading-relaxed mb-6">
          {meta.approvalStatement}
        </blockquote>

        {confirmations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-text mb-2">By signing, you also confirm:</h3>
            <ul className="space-y-2">
              {confirmations.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-text leading-relaxed">
                  <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentRead}
              onChange={(e) => setConsentRead(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-primary,#1A7A9B)]"
            />
            <span className="text-sm text-text">
              I have reviewed the document above in full and agree to the declaration
              {confirmations.length > 0 ? ' and the confirmations above' : ''}.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentEsign}
              onChange={(e) => setConsentEsign(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-primary,#1A7A9B)]"
            />
            <span className="text-sm text-text">
              I consent to signing this document electronically and understand it has the same legal
              effect as a handwritten signature.
            </span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text mb-1">Your full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full sm:max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
            autoComplete="name"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-text">Your signature</label>
            <button
              type="button"
              onClick={() => setMode(mode === 'drawn' ? 'typed' : 'drawn')}
              className="text-xs text-primary hover:underline"
            >
              {mode === 'drawn' ? "I'd prefer to type my name" : "I'd prefer to draw my signature"}
            </button>
          </div>
          {mode === 'drawn' ? (
            <SignaturePad onChange={setSignatureDataUrl} height={180} />
          ) : (
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your full name as your signature"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 italic text-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          )}
        </div>

        {signError && (
          <p className="text-rose-600 text-sm mb-4" role="alert">
            {signError}
          </p>
        )}

        <button
          type="button"
          onClick={handleSign}
          disabled={!canSign || phase === 'submitting'}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {phase === 'submitting' ? 'Signing…' : 'Sign document'}
        </button>
        <p className="mt-3 text-xs text-text-light">
          By clicking Sign, a record of your name, email ({meta.signerEmail}), the date and time, your IP
          address and the document&rsquo;s digital fingerprint is stored by {brandName} as evidence of
          signing.
        </p>
        <p className="mt-2 text-xs text-text-light">
          Any queries with the accounts or this letter before you sign? Call{' '}
          <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>
            {brandPhone}
          </a>{' '}
          or email{' '}
          <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>
            {brandEmail}
          </a>{' '}
          — we&rsquo;re happy to help.
        </p>

        {/* Request changes */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          {!showDecline ? (
            <button
              type="button"
              onClick={() => setShowDecline(true)}
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-rose-600 transition-colors"
            >
              <MessageSquareWarning size={16} />
              Something not right? Request changes instead
            </button>
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
              <h3 className="text-sm font-bold text-text mb-1.5">Request changes</h3>
              <p className="text-xs text-text-light mb-3">
                Tell us what doesn&rsquo;t look right and we&rsquo;ll review it, make any corrections and
                send you a fresh version. Nothing is filed until you&rsquo;ve signed.
              </p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
                placeholder="e.g. The dividend figure looks too high — I only took £12,000 this year."
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              {declineError && (
                <p className="text-rose-600 text-sm mt-2" role="alert">
                  {declineError}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleDecline}
                  disabled={declineBusy}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors"
                >
                  {declineBusy ? 'Sending…' : 'Send to my accountant'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDecline(false)}
                  className="px-4 py-2 rounded-lg text-sm text-text-light hover:text-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      {meta.documentType.includes('CT600') || meta.documentType.includes('Accounts') ? (
        <section className={`${SIGN_CARD} overflow-hidden`}>
          <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-transparent">
            <HelpCircle size={17} className="text-primary" />
            <h2 className="text-sm font-bold text-text">Common questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {CT_FAQS.map((faq) => (
              <details key={faq.q} className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-sm font-semibold text-text hover:bg-gray-50/60 transition-colors">
                  {faq.q}
                  <span className="shrink-0 grid place-items-center w-6 h-6 rounded-full bg-gray-100 text-text-light group-open:bg-primary/10 group-open:text-primary group-open:rotate-45 transition-all text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="text-sm text-text-light leading-relaxed px-5 sm:px-6 pb-4 -mt-1">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

        </div>{/* ── /Left ── */}

        {/* ── Right: figures + CT payment, pinned ── */}
        {coverLetter && (hasFigures || hasPayment || coverLetter.noPayment) && (
          <aside className="mt-6 lg:mt-0 lg:sticky lg:top-8 space-y-4">
            {(hasFigures || hasPayment || coverLetter.noPayment) && (
              <div className={`${SIGN_CARD} overflow-hidden`}>
                <div className="bg-gradient-to-b from-primary-50 to-primary-50/40 px-5 py-3.5 border-b border-primary/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">
                    Your year at a glance
                  </p>
                </div>
                <div className="p-5 space-y-3.5">
                  {hasFigures && (
                    <dl className="space-y-2.5">
                      {coverLetter.revenue && <GlanceRow icon={<TrendingUp size={15} />} label="Revenue" value={coverLetter.revenue} />}
                      {coverLetter.profit && <GlanceRow icon={<Banknote size={15} />} label="Profit / (loss)" value={coverLetter.profit} />}
                      {coverLetter.dividends && <GlanceRow icon={<Landmark size={15} />} label="Dividends taken" value={coverLetter.dividends} />}
                    </dl>
                  )}

                  {coverLetter.noPayment && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3.5 py-3">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <p className="text-[13px] text-text leading-snug">
                        <strong>No corporation tax to pay</strong> this period.
                      </p>
                    </div>
                  )}

                  {!coverLetter.noPayment && hasPayment && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CalendarClock size={15} className="text-amber-600" />
                        <h3 className="text-[13px] font-bold text-text">
                          Corporation tax to pay{splitPeriods.length > 0 ? ' — two periods' : ''}
                        </h3>
                      </div>

                      {splitPeriods.length > 0 ? (
                        <div className="space-y-2.5">
                          {splitPeriods.map((p, i) => (
                            <div key={i} className="rounded-md border border-amber-200/80 bg-white/70 px-3 py-2.5">
                              <div className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-1">
                                {p.label || `Period ${i + 1}`}
                              </div>
                              {p.taxLiability && <div className="text-lg font-bold text-text leading-tight">{p.taxLiability}</div>}
                              {p.paymentDue && (
                                <div className="text-xs text-text-light mt-0.5">
                                  due by{' '}
                                  <strong className="text-text">
                                    {new Date(p.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </strong>
                                </div>
                              )}
                              {p.paymentReference && (
                                <div className="text-xs mt-1"><span className="text-text-light">Ref: </span><span className="font-mono font-semibold text-text">{p.paymentReference}</span></div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {coverLetter.taxLiability && <span className="text-2xl font-bold text-text tracking-tight">{coverLetter.taxLiability}</span>}
                            {coverLetter.paymentDue && (
                              <span className="text-xs text-text-light">
                                due by{' '}
                                <strong className="text-text">
                                  {new Date(coverLetter.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </strong>
                              </span>
                            )}
                          </div>
                          <dl className="mt-3 space-y-1.5 text-[13px]">
                            <GlanceRow label="Pay to" value="HMRC" />
                            <GlanceRow label="Sort code · Account" value="08-32-10 · 12001039" />
                            {coverLetter.paymentReference && <GlanceRow label="Reference" value={coverLetter.paymentReference} mono />}
                          </dl>
                        </>
                      )}
                      <p className="text-[11px] text-text-light mt-2.5 leading-snug">
                        Use the exact reference{splitPeriods.length > 0 ? ' for each period' : ''} — a wrong one delays HMRC allocating your payment. Paid by the company, not by us.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => document.getElementById('sign-card')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hidden lg:inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
                  >
                    <PenLine size={15} />
                    Go to signature
                  </button>
                </div>
              </div>
            )}

            {/* Reassurance / help — sits with the decision, and stops the rail
                orphaning beside the long left column. */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck size={15} className="text-primary" />
                <h3 className="text-[13px] font-bold text-text">Nothing is filed until you sign</h3>
              </div>
              <p className="text-[13px] text-text-light leading-relaxed">
                Not sure about anything? Use &ldquo;Request changes&rdquo; and we&rsquo;ll put it
                right, or get in touch:
              </p>
              <div className="mt-3 space-y-1.5 text-[13px]">
                <a href={`tel:${brandPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-primary hover:underline font-medium">
                  <Phone size={14} /> {brandPhone}
                </a>
                <a href={`mailto:${brandEmail}`} className="flex items-center gap-2 text-primary hover:underline font-medium break-all">
                  <MessageSquareWarning size={14} /> {brandEmail}
                </a>
              </div>
            </div>
          </aside>
        )}
      </div>{/* ── /grid ── */}

      {/* Sticky go-to-sign bar — mobile only (the pinned rail covers desktop) */}
      {phase === 'ready' && !signCardVisible && (
        <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none lg:hidden">
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <div className="pointer-events-auto flex items-center justify-between gap-3 bg-white/95 backdrop-blur border border-gray-200 shadow-lg rounded-2xl px-4 py-3">
              <span className="text-sm text-text">Ready when you are.</span>
              <button
                type="button"
                onClick={() => document.getElementById('sign-card')?.scrollIntoView({ behavior: 'smooth' })}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
              >
                <PenLine size={15} />
                Go to signature
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const CT_FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'How is corporation tax calculated?',
    a: 'Corporation tax is a percentage of your company’s net profits — income less salaries and other allowable expenses (mileage, premises, equipment and so on). Salaries reduce the taxable profit; dividends don’t, because they’re paid out of profits after tax.',
  },
  {
    q: 'When is the corporation tax due?',
    a: 'The tax return is due twelve months after your accounting year end, but the payment is due nine months (and one day) after the year end. Your exact payment date is shown above.',
  },
  {
    q: 'Why has the payment reference changed from last year?',
    a: 'Unlike most UK taxes, corporation tax payments don’t go into one pot — each return has its own payment reference so HMRC can allocate your payment to the right period. Always use the reference shown for this year.',
  },
  {
    q: 'Why might I have to make two separate payments?',
    a: 'If your accounting period ran longer than twelve months (common in a first year of trading), HMRC splits it into two returns, each with its own reference — so two payments, two references.',
  },
  {
    q: 'What are the late filing penalties?',
    a: 'Filing late triggers automatic penalties: £150 at 1 month, £375 up to 3 months, £750 up to 6 months and £1,500 beyond that — doubled if you’re late two years running. Interest also accrues on late payments, which is why we ask you to review and sign promptly.',
  },
  {
    q: 'How can I check my account with HMRC?',
    a: 'Register for HMRC online services at gov.uk/log-in-register-hmrc-online-services with a Government Gateway ID. You can then see payment due dates, payments made and the status of your returns.',
  },
];

// ---------------------------------------------------------------------------

function GlanceRow({
  icon,
  label,
  value,
  mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-[13px] text-text-light min-w-0">
        {icon && <span className="text-text-light shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </dt>
      <dd className={`text-sm font-bold text-text tabular-nums text-right shrink-0 ${mono ? 'font-mono' : ''}`}>
        {value}
      </dd>
    </div>
  );
}

function StateCard({
  icon,
  tone,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  tone: 'success' | 'error' | 'warning';
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const toneClass =
    tone === 'success'
      ? 'text-emerald-600 bg-emerald-50'
      : tone === 'warning'
        ? 'text-amber-600 bg-amber-50'
        : 'text-rose-600 bg-rose-50';
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${toneClass}`}>
          {icon}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">{title}</h1>
        <p className="text-text-light leading-relaxed mb-6">{body}</p>
        {children}
      </div>
    </main>
  );
}
