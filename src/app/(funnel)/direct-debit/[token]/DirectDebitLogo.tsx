'use client';

import { useState } from 'react';

/**
 * The Bacs Direct Debit logo.
 *
 * The mark is controlled by Bacs and comes with usage rules (minimum size,
 * clear space, no recolouring), so it is NOT reproduced here from memory — an
 * approximation would be both wrong and a trademark problem. Drop the official
 * artwork, which Access PaySuite supply to service users, at:
 *
 *     public/images/direct-debit-logo.svg
 *
 * and it appears automatically. Until then a neutral wordmark stands in, which
 * is honest about being ours rather than pretending to be the scheme mark.
 */
export default function DirectDebitLogo({ className = '' }: { className?: string }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded border border-slate-300 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 ${className}`}
      >
        Direct Debit
      </span>
    );
  }

  return (
    // Plain <img> rather than next/image: the file may legitimately not exist
    // yet, and next/image cannot fail softly.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/direct-debit-logo.svg"
      alt="Direct Debit"
      className={`h-8 w-auto ${className}`}
      onError={() => setMissing(true)}
    />
  );
}
