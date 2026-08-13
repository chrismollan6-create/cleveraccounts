'use client';

import { useState } from 'react';

/**
 * The Bacs Direct Debit logo.
 *
 * To use the official mark, save the artwork Access PaySuite supply as either:
 *
 *     public/images/direct-debit-logo.png   (preferred — tried first)
 *     public/images/direct-debit-logo.svg
 *
 * and it appears everywhere with no code change. An SVG or a transparent PNG at
 * 2x the display size (roughly 360px wide) both work.
 *
 * The mark is a controlled trademark with usage rules — minimum size, clear
 * space around it, and no recolouring or redrawing — which is why the fallback
 * below is a plain wordmark rather than an imitation of it.
 */

const CANDIDATES = ['/images/direct-debit-logo.png', '/images/direct-debit-logo.svg'];

export default function DirectDebitLogo({ className = '' }: { className?: string }) {
  const [attempt, setAttempt] = useState(0);

  if (attempt >= CANDIDATES.length) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded border border-slate-300 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 ${className}`}
      >
        Direct Debit
      </span>
    );
  }

  return (
    // Plain <img>: a candidate may legitimately not exist, and next/image
    // cannot fail softly enough to try the next one.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={CANDIDATES[attempt]}
      src={CANDIDATES[attempt]}
      alt="Direct Debit"
      className={`h-8 w-auto ${className}`}
      onError={() => setAttempt((n) => n + 1)}
    />
  );
}
