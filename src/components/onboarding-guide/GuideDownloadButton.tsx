'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Floating "Download PDF" control for the onboarding guide.
 *
 * Fetches the server-rendered PDF (same endpoint the email attach flow uses)
 * as a blob, then triggers a programmatic download. This is reliable across
 * browsers regardless of:
 *   • the server's Content-Disposition (download UX shouldn't depend on it);
 *   • the user's print-dialog "Background graphics" setting (window.print()
 *     would have stripped every brand colour from the saved PDF).
 *
 * Shows a loading spinner during the fetch because headless-Chrome PDF
 * generation takes ~3–5 seconds — without feedback the click feels dead.
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
  const [loading, setLoading] = useState(false);
  const href = `/api/onboarding-guide/pdf?brand=${brandId}&variant=${variant}`;

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(href, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'onboarding-guide.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke after a tick so Safari has time to start the download.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Onboarding guide download failed:', err);
      alert('Sorry — could not generate the PDF. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg no-underline disabled:opacity-80 print:hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${brandColor}, ${brandColorDark})`,
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {loading ? 'Generating PDF…' : 'Download PDF'}
    </button>
  );
}
