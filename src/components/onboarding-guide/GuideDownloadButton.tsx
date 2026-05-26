'use client';

import { Download } from 'lucide-react';

/**
 * Floating "Download" control for the onboarding guide.
 *
 * Links to the server-rendered PDF endpoint (the same one used by the email
 * attach flow) — guarantees the downloaded file is the full-fidelity branded
 * PDF, identical to what the client received in their welcome email. Using
 * window.print() instead would have been at the mercy of the user's print
 * dialog ("Background graphics" off by default would strip every gradient
 * and colour fill from the saved PDF).
 *
 * `brandColor` is passed so the button itself is brand-correct without
 * relying on Tailwind utilities (which @theme inline can't reliably override
 * via the data-brand cascade — same reason the doc surfaces use inline style).
 *
 * Hidden from the print/PDF output itself via `print:hidden`.
 */
export default function GuideDownloadButton({
  brandId,
  variant,
  brandColor,
  brandColorDark,
}: {
  brandId: 'clever' | 'workwell';
  variant: 'ltd-new' | 'ltd-existing' | 'sole';
  brandColor: string;
  brandColorDark: string;
}) {
  const href = `/api/onboarding-guide/pdf?brand=${brandId}&variant=${variant}`;
  return (
    <a
      href={href}
      download="onboarding-guide.pdf"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg no-underline print:hidden"
      style={{ backgroundImage: `linear-gradient(to bottom right, ${brandColor}, ${brandColorDark})` }}
    >
      <Download size={16} />
      Download PDF
    </a>
  );
}
