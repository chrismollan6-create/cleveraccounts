'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Loader2 } from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

/**
 * In-page PDF viewer built on pdfjs canvas rendering.
 *
 * Why not an <iframe>: iOS Safari renders PDF iframes as a single
 * non-scrollable first page, which silently hides the rest of the accounts
 * from anyone reviewing on a phone. Canvas rendering behaves identically
 * everywhere and gives us a page counter + proper loading states.
 *
 * Pages render sequentially at devicePixelRatio for crispness, scaled to the
 * container width. FreeAgent-style documents are light vector PDFs, so
 * main-thread rendering (pdfjs "fake worker") is comfortably fast.
 */
export default function PdfViewer({ url, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        // pdfjs requires a worker script in the browser. It's served as a
        // static asset copied from node_modules by the `prebuild` script
        // (see package.json) so the worker version always matches the API.
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`PDF fetch ${res.status}`);
        const doc = await pdfjs.getDocument({
          data: new Uint8Array(await res.arrayBuffer()),
          disableFontFace: false,
        }).promise;
        if (cancelled) return;
        setNumPages(doc.numPages);

        const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
        const width = container.clientWidth - 32; // padding allowance

        for (let p = 1; p <= doc.numPages; p++) {
          if (cancelled) return;
          const page = await doc.getPage(p);
          const base = page.getViewport({ scale: 1 });
          const scale = width / base.width;
          const viewport = page.getViewport({ scale: scale * dpr });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${viewport.height / dpr}px`;
          canvas.className = 'pdf-page-canvas';
          canvas.dataset.page = String(p);

          const wrap = document.createElement('div');
          wrap.className = 'mx-auto mb-3 shadow-sm border border-gray-200 rounded-md overflow-hidden bg-white w-fit';
          wrap.appendChild(canvas);
          container.appendChild(wrap);

          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport } as Parameters<typeof page.render>[0]).promise;
          if (p === 1 && !cancelled) setState('ready');
        }
        if (!cancelled) setState('ready');
      } catch (err) {
        console.error('PdfViewer render failed:', err);
        if (!cancelled) setState('error');
      }
    })();

    // Track the page most visible in the scroll container.
    const onScroll = () => {
      const canvases = container.querySelectorAll<HTMLCanvasElement>('.pdf-page-canvas');
      const mid = container.scrollTop + container.clientHeight / 2;
      let best = 1;
      canvases.forEach((c) => {
        const wrap = c.parentElement!;
        if (wrap.offsetTop <= mid) best = parseInt(c.dataset.page || '1', 10);
      });
      setCurrentPage(best);
    };
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelled = true;
      container.removeEventListener('scroll', onScroll);
      container.querySelectorAll('.pdf-page-canvas').forEach((c) => c.parentElement?.remove());
    };
  }, [url]);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/60 rounded-t-2xl">
        <span className="text-xs font-semibold text-text-light tabular-nums">
          {numPages > 0 ? `Page ${currentPage} of ${numPages}` : 'Loading document…'}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <ExternalLink size={13} />
            Open in new tab
          </a>
          <a
            href={url}
            download={`${title}.pdf`}
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-[72vh] overflow-y-auto overscroll-contain bg-gray-100/80 px-4 py-4 rounded-b-2xl"
        aria-label={`${title} — document preview`}
      >
        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full text-text-light gap-3">
            <Loader2 size={26} className="animate-spin text-primary" />
            <span className="text-sm">Preparing your document…</span>
          </div>
        )}
        {state === 'error' && (
          <div className="flex flex-col items-center justify-center h-full text-text-light gap-3 px-6 text-center">
            <p className="text-sm">
              The in-page preview couldn&rsquo;t load on this device.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              <ExternalLink size={15} />
              Open the PDF instead
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
