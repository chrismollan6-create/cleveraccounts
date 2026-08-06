'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { DirectorConsentDto } from './page';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DirectorConsentClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: DirectorConsentDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);
  const [signed, setSigned] = useState(false);
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Size the canvas backing store to its rendered size (for crisp lines on retina).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';
    }
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasInk.current = true;
    if (!signed) setSigned(true);
  };
  const end = () => {
    drawing.current = false;
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    setSigned(false);
  }, []);

  const canSubmit = signed && agreed && name.trim().length > 1 && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const signature = canvasRef.current!.toDataURL('image/png');
      const res = await fetch('/api/director-consent/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name: name.trim(), signature }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone(true);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thank you — that’s confirmed</h1>
          <p className="text-text-light leading-relaxed">
            We’ve recorded your consent to resign as a director of{' '}
            <strong>{dto.companyName}</strong>. We’ll file it with Companies House — there’s nothing
            more you need to do.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Confirm your resignation as a director</h1>
        <p className="text-text-light leading-relaxed mb-6">
          You’ve been listed as resigning as a director of <strong>{dto.companyName}</strong>, with
          effect from <strong>{formatDate(dto.resignationDate)}</strong>. Before we file this with
          Companies House, please confirm you understand and consent to the resignation, and sign below.
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4 text-sm text-text-light">
          <div className="flex justify-between py-1"><span>Director</span><span className="font-semibold text-text">{dto.directorName}</span></div>
          <div className="flex justify-between py-1"><span>Company</span><span className="font-semibold text-text">{dto.companyName}</span></div>
          {dto.companyNumber && (
            <div className="flex justify-between py-1"><span>Company number</span><span className="font-semibold text-text">{dto.companyNumber}</span></div>
          )}
          <div className="flex justify-between py-1"><span>Resignation date</span><span className="font-semibold text-text">{formatDate(dto.resignationDate)}</span></div>
        </div>

        <p className="text-xs text-text-light leading-relaxed mb-6">
          Your resignation takes effect on the date above. Once filed, it becomes part of the company’s
          public record at Companies House. By signing you’re confirming this is correct and that you agree to it.
        </p>

        <label className="block text-sm font-semibold text-text mb-1">Your full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jane Smith"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-5 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold text-text">Sign here</label>
          <button type="button" onClick={clear} className="text-xs text-text-light hover:text-text underline">Clear</button>
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="w-full h-40 border border-gray-300 rounded-lg bg-white touch-none cursor-crosshair mb-5"
        />

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4" />
          <span className="text-sm text-text-light leading-relaxed">
            I understand that I am resigning as a director of {dto.companyName} as of{' '}
            {formatDate(dto.resignationDate)}, and I consent to this being filed at Companies House.
          </span>
        </label>

        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition"
        >
          {submitting ? 'Submitting…' : 'Confirm & sign'}
        </button>

        <p className="text-xs text-text-light mt-5 text-center">
          If you did not expect this, do not sign — contact us on{' '}
          <a className="text-primary hover:underline" href={`tel:${brandPhone.replace(/\s/g, '')}`}>{brandPhone}</a>{' '}
          or <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>. Nothing is filed until you confirm.
        </p>
      </div>
    </main>
  );
}
