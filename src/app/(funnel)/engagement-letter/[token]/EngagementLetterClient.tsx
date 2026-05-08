'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Printer, ShieldCheck, Globe, CheckCircle2, AlertCircle, Pen, Type, Loader2 } from 'lucide-react';
import type { RenderedLetter, SectionGroup, Section } from '@/content/engagement-letter';
import SignaturePad from './SignaturePad';

interface Signer {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
}

interface Props {
  token: string;
  letter: RenderedLetter;
  signer: Signer;
  displayIp: string;
  /** Step 6 = false (no signing UI); Step 7 = true (full signing flow). */
  canSign: boolean;
}

type SignMode = 'draw' | 'type';

interface SignSuccess {
  signedAt: string;
  pdfDownloadUrl: string | null;
}

export default function EngagementLetterClient({ token, letter, signer, displayIp, canSign }: Props) {
  const viewLoggedRef = useRef(false);
  const [expandAllKey, setExpandAllKey] = useState(0);
  const [forceOpen, setForceOpen] = useState<boolean | null>(null);

  // Fire view event exactly once on mount. The Salesforce side records the
  // FIRST view; subsequent views append to the audit log only.
  useEffect(() => {
    if (viewLoggedRef.current) return;
    viewLoggedRef.current = true;
    fetch(`/api/engagement-letter/view?t=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      keepalive: true,
    }).catch((err) => {
      // Non-fatal — don't block the user from reading their letter if the view
      // log fails. The /sign POST captures the same forensic data anyway.
      console.warn('Failed to log letter view:', err);
    });
  }, [token]);

  const handleExpandAll = () => {
    setForceOpen(true);
    setExpandAllKey((k) => k + 1);
  };
  const handleCollapseAll = () => {
    setForceOpen(false);
    setExpandAllKey((k) => k + 1);
  };
  const handlePrint = () => {
    setForceOpen(true);
    setExpandAllKey((k) => k + 1);
    // Allow the DOM to update with all sections open before printing
    setTimeout(() => window.print(), 100);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ─── Header card ─── */}
      <div className="mb-6 print:mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 print:hidden">
          <FileText size={13} />
          {letter.variant === 'sole-trader' ? 'Sole Trader' : 'Limited Company'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2 leading-tight">
          {letter.title}
        </h1>
        <p className="text-text-light">
          Engagement letter for <strong className="text-text">{signer.businessName}</strong>
        </p>
      </div>

      {/* ─── Signer panel ─── */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-5 sm:p-6 mb-6 print:bg-transparent print:border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1">
              You&apos;re signing as
            </p>
            <p className="text-lg font-semibold text-text">
              {signer.firstName} {signer.lastName}
              {signer.email && (
                <span className="block sm:inline sm:ml-2 text-text-light font-normal text-base">
                  ({signer.email})
                </span>
              )}
            </p>
          </div>
          <a
            href="/contact"
            className="text-sm text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5 print:hidden"
          >
            Not you? Contact us
          </a>
        </div>
      </div>

      {/* ─── Reading controls ─── */}
      <div className="flex flex-wrap items-center gap-3 mb-6 print:hidden">
        <button
          type="button"
          onClick={handleExpandAll}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5"
        >
          <ChevronDown size={15} /> Expand all
        </button>
        <span className="text-gray-300">·</span>
        <button
          type="button"
          onClick={handleCollapseAll}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5"
        >
          <ChevronUp size={15} /> Collapse all
        </button>
        <span className="text-gray-300">·</span>
        <button
          type="button"
          onClick={handlePrint}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5"
        >
          <Printer size={15} /> Print / save as PDF
        </button>
      </div>

      {/* ─── Letter body — accordion ─── */}
      <article className="space-y-8 mb-10 print:space-y-6">
        {letter.groups.map((g) => (
          <GroupBlock key={g.heading} group={g} forceOpen={forceOpen} keyTrigger={expandAllKey} />
        ))}
      </article>

      {/* ─── Signing panel — Step 7 ─── */}
      {canSign && (
        <SigningPanel token={token} letter={letter} signer={signer} displayIp={displayIp} />
      )}

      {!canSign && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 mb-8 print:hidden">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-text mb-1">Signing not yet enabled</p>
              <p className="text-sm text-text-light">
                You&apos;re previewing the letter content. The consent + signature controls
                will be enabled in the next deploy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Document version footer ─── */}
      <div className="text-xs text-text-light flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-6 border-t border-gray-100">
        <span className="inline-flex items-center gap-1.5">
          <Globe size={12} /> Document version: <code className="text-text">{letter.version}</code>
        </span>
        <span className="text-gray-300 hidden sm:inline">·</span>
        <span className="font-mono text-[10px] break-all text-text-light/80" title="SHA-256 of rendered letter content">
          {letter.documentSha256.slice(0, 16)}…
        </span>
      </div>
    </main>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

interface GroupBlockProps {
  group: SectionGroup;
  forceOpen: boolean | null;
  keyTrigger: number;
}

function GroupBlock({ group, forceOpen, keyTrigger }: GroupBlockProps) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-text mb-4 print:mb-3">
        {group.heading}
      </h2>
      <div className="space-y-2 print:space-y-1">
        {group.sections.map((s) => (
          <SectionItem
            key={`${s.id}-${keyTrigger}`}
            section={s}
            forceOpen={forceOpen}
          />
        ))}
      </div>
    </section>
  );
}

interface SectionItemProps {
  section: Section;
  forceOpen: boolean | null;
}

function SectionItem({ section, forceOpen }: SectionItemProps) {
  // forceOpen=null → defer to user's last interaction; forceOpen=true/false → set explicitly
  const open = forceOpen === null ? undefined : forceOpen;

  return (
    <details
      open={open}
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors print:border-gray-300 print:bg-transparent print:rounded-none"
    >
      <summary className="cursor-pointer list-none px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors print:px-0 print:py-2 print:cursor-auto print:hover:bg-transparent">
        <span className="font-semibold text-text flex items-baseline gap-3">
            <span className="text-text-light text-sm font-mono shrink-0 w-8">{section.number}.</span>
            <span>{section.title}</span>
        </span>
        <ChevronDown
          size={18}
          className="text-text-light shrink-0 transition-transform group-open:rotate-180 print:hidden"
        />
      </summary>
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 print:px-0 print:pb-3">
        <div className="pl-0 sm:pl-11 prose-sm max-w-none">
          <SectionBody body={section.body} />
        </div>
      </div>
    </details>
  );
}

/**
 * Lightweight markdown-ish renderer for the constrained content we use:
 *   - Paragraphs separated by blank lines
 *   - Bullets starting with "- "
 *   - Nested bullets indented with "    - "
 *   - **bold**
 *   - Numbered lists ("1. ", "2. ", …)
 * Anything fancier should be added as a new content convention here, not via a
 * full markdown library — keeps the bundle small and the legal-text behaviour
 * deterministic.
 */
function SectionBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n');

        // Bulleted list (- ...)
        if (lines.every((l) => /^\s*-\s/.test(l) || l.trim() === '')) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 mb-3 last:mb-0 text-text-light">
              {lines
                .filter((l) => l.trim() !== '')
                .map((l, j) => {
                  const indent = (l.match(/^\s+/)?.[0].length ?? 0) > 2;
                  const content = l.replace(/^\s*-\s/, '');
                  return (
                    <li key={j} className={indent ? 'ml-5' : ''}>
                      <InlineFormatted text={content} />
                    </li>
                  );
                })}
            </ul>
          );
        }

        // Numbered list (1. 2. 3.)
        if (lines.every((l) => /^\d+\.\s/.test(l) || l.trim() === '' || /^\s+/.test(l))) {
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1.5 mb-3 last:mb-0 text-text-light">
              {lines
                .filter((l) => l.trim() !== '')
                .map((l, j) => (
                  <li key={j}>
                    <InlineFormatted text={l.replace(/^\d+\.\s/, '')} />
                  </li>
                ))}
            </ol>
          );
        }

        // Plain paragraph
        return (
          <p key={i} className="text-text-light leading-relaxed mb-3 last:mb-0">
            <InlineFormatted text={block} />
          </p>
        );
      })}
    </>
  );
}

// =============================================================================
// Signing panel — consents, signature capture, submit
// =============================================================================

interface SigningPanelProps {
  token: string;
  letter: RenderedLetter;
  signer: Signer;
  displayIp: string;
}

function SigningPanel({ token, letter, signer, displayIp }: SigningPanelProps) {
  const [consentRead, setConsentRead] = useState(false);
  const [consentEsign, setConsentEsign] = useState(false);
  const [fullName, setFullName] = useState(`${signer.firstName} ${signer.lastName}`.trim());
  const [mode, setMode] = useState<SignMode>('draw');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [typedName, setTypedName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SignSuccess | null>(null);

  // Conditions for the Sign button to enable
  const hasSignature = mode === 'draw'
    ? signatureDataUrl !== null
    : typedName.trim().length >= 2;
  const canSubmit =
    consentRead &&
    consentEsign &&
    fullName.trim().length >= 2 &&
    hasSignature &&
    !submitting &&
    !success;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      // Send the canonical JSON of the rendered, merged letter content the
      // user just saw. Apex stores this verbatim and the Visualforce PDF page
      // re-renders it for the signed copy. Cross-checked against the
      // documentSha256 (which was computed over the same canonical form).
      const signedContentJson = JSON.stringify(
        letter.groups.map((g) => ({
          heading: g.heading,
          sections: g.sections.map((s) => ({
            id: s.id,
            number: s.number,
            title: s.title,
            body: s.body,
          })),
        })),
      );

      const payload = {
        fullName: fullName.trim(),
        signatureDataUrl: mode === 'draw' ? signatureDataUrl : null,
        typedName: mode === 'type' ? typedName.trim() : null,
        documentVersion: letter.version,
        documentSha256: letter.documentSha256,
        consentReadAndAccept: consentRead,
        consentToEsign: consentEsign,
        signedContentJson,
      };

      const res = await fetch(`/api/engagement-letter/sign?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        const msg = data?.message || data?.error || 'Failed to sign — please try again, or contact us if this keeps happening.';
        setError(msg);
        return;
      }

      setSuccess({
        signedAt: new Date().toISOString(),
        pdfDownloadUrl: data?.pdfDownloadUrl ?? null,
      });

      // Scroll the success card into view
      setTimeout(() => {
        document.getElementById('engagement-letter-signed')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } catch (err) {
      console.error('Sign submission failed:', err);
      setError('Network error — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div
        id="engagement-letter-signed"
        className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 sm:p-8 mb-8 print:hidden"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={26} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-text mb-2">
              Engagement letter signed
            </h3>
            <p className="text-text-light mb-4">
              Thanks {signer.firstName}. We&apos;ve recorded your signature at{' '}
              <strong className="text-text">
                {new Date(success.signedAt).toLocaleString('en-GB', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </strong>
              . A copy will be emailed to you shortly.
            </p>
            {success.pdfDownloadUrl && (
              <a
                href={success.pdfDownloadUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
              >
                <FileText size={16} />
                Download signed copy
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-primary/20 rounded-xl p-5 sm:p-7 mb-8 shadow-md print:hidden"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-text mb-2">Ready to sign?</h3>
      <p className="text-text-light mb-6">
        Once you&apos;ve read the engagement letter above, complete the steps below to sign it electronically.
      </p>

      {/* ── Two consent checkboxes (eIDAS UK best practice — must be distinct) ── */}
      <div className="space-y-3 mb-6">
        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary/40 cursor-pointer transition-colors has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
          <input
            type="checkbox"
            checked={consentRead}
            onChange={(e) => setConsentRead(e.target.checked)}
            className="mt-0.5 w-5 h-5 accent-primary"
          />
          <span className="text-sm text-text leading-relaxed">
            I have read and agree to the engagement letter above.
          </span>
        </label>
        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary/40 cursor-pointer transition-colors has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
          <input
            type="checkbox"
            checked={consentEsign}
            onChange={(e) => setConsentEsign(e.target.checked)}
            className="mt-0.5 w-5 h-5 accent-primary"
          />
          <span className="text-sm text-text leading-relaxed">
            I consent to signing this document electronically and understand that my electronic signature has the same legal effect as a handwritten signature.
          </span>
        </label>
      </div>

      {/* ── Full name ── */}
      <div className="mb-6">
        <label htmlFor="el-fullname" className="block text-sm font-semibold text-text mb-1.5">
          Your full legal name
        </label>
        <input
          id="el-fullname"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
          placeholder="e.g. Jane Doe"
        />
      </div>

      {/* ── Mode toggle ── */}
      <div className="mb-3">
        <p className="block text-sm font-semibold text-text mb-2">Signature</p>
        <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-3">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              mode === 'draw' ? 'bg-white text-primary shadow-sm' : 'text-text-light hover:text-text'
            }`}
          >
            <Pen size={14} /> Draw
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              mode === 'type' ? 'bg-white text-primary shadow-sm' : 'text-text-light hover:text-text'
            }`}
          >
            <Type size={14} /> Type
          </button>
        </div>
      </div>

      {/* ── Signature capture ── */}
      {mode === 'draw' ? (
        <SignaturePad onChange={setSignatureDataUrl} />
      ) : (
        <div>
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Type your full name as your signature"
            className="w-full px-4 py-3 text-2xl font-cursive italic border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
            style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive' }}
          />
          <p className="text-xs text-text-light mt-1.5">
            Typing your name here counts as your electronic signature.
          </p>
        </div>
      )}

      {/* ── Live audit summary — visible-disclosure compliance feature ── */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <p className="text-text-light mb-2 font-semibold">By clicking Sign, you confirm:</p>
        <ul className="text-text-light space-y-1 text-xs">
          <li><strong className="text-text">Name:</strong> {fullName.trim() || '(awaiting)'}</li>
          <li><strong className="text-text">Email:</strong> {signer.email || 'on file'}</li>
          <li><strong className="text-text">Date:</strong> {new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}</li>
          {displayIp && <li><strong className="text-text">IP:</strong> {displayIp}</li>}
          <li><strong className="text-text">Document:</strong> {letter.title} (version <code>{letter.version}</code>)</li>
        </ul>
      </div>

      {/* ── Error display ── */}
      {error && (
        <div className="mt-4 bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-rose-900">{error}</div>
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Signing…
          </>
        ) : (
          <>
            <CheckCircle2 size={18} /> Sign engagement letter
          </>
        )}
      </button>

      <p className="text-xs text-text-light mt-3">
        After signing, we&apos;ll email you a copy and start work on your account.
      </p>
    </form>
  );
}

function InlineFormatted({ text }: { text: string }) {
  // Split on bold markers, keeping the markers, then alternate between strong and plain
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="text-text font-semibold">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
