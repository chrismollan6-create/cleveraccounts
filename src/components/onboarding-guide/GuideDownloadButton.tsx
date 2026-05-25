'use client';

import { Download } from 'lucide-react';

/**
 * Floating "Download" control for the onboarding guide.
 *
 * Uses the browser's own print-to-PDF — the guide page is already A4
 * print-styled, so this produces a clean PDF with zero server infrastructure.
 * Hidden from the printed output itself via `print:hidden`.
 */
export default function GuideDownloadButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-dark print:hidden"
    >
      <Download size={16} />
      Download
    </button>
  );
}
