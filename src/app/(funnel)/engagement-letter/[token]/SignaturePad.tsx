'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Eraser } from 'lucide-react';

interface Props {
  /** Called with a PNG data URL whenever the signature changes (or null when cleared). */
  onChange: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
}

/**
 * Minimal native canvas signature pad. Captures pointer events, draws smooth
 * lines using quadratic bezier interpolation between consecutive points, and
 * exports the result as a PNG data URL.
 *
 * Hi-DPI aware: backing store is sized to devicePixelRatio so the rendered
 * signature is crisp on retina displays. The exported PNG is also at that
 * resolution.
 *
 * Why we don't pull in `signature_pad`: the native implementation here is
 * ~80 lines, has no dependency surface area, and produces output adequate for
 * a UK e-signature. Signature legibility is not a legal requirement; what
 * matters legally is the audit trail (IP, UA, hash, consent flags), and that
 * the signer expressed intent — both fully covered.
 */
export default function SignaturePad({ onChange, width = 600, height = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const isEmptyRef = useRef(true);
  const [isEmpty, setIsEmpty] = useState(true);

  // Set up canvas at devicePixelRatio so strokes are crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
  }, [width, height]);

  const getPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(e.pointerId);
      drawingRef.current = true;
      const pt = getPoint(e);
      lastPtRef.current = pt;
      const ctx = canvas.getContext('2d')!;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
    },
    [getPoint],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const pt = getPoint(e);
      const last = lastPtRef.current;
      if (last) {
        // Quadratic bezier midpoint smoothing
        const midX = (last.x + pt.x) / 2;
        const midY = (last.y + pt.y) / 2;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.quadraticCurveTo(last.x, last.y, midX, midY);
        ctx.stroke();
      }
      lastPtRef.current = pt;
      if (isEmptyRef.current) {
        isEmptyRef.current = false;
        setIsEmpty(false);
      }
    },
    [getPoint],
  );

  const handlePointerUp = useCallback(() => {
    drawingRef.current = false;
    lastPtRef.current = null;
    if (!isEmptyRef.current && canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isEmptyRef.current = true;
    setIsEmpty(true);
    onChange(null);
  }, [onChange]);

  return (
    <div className="relative">
      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden touch-none select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="block w-full cursor-crosshair touch-none"
          aria-label="Signature pad — sign here using your mouse, finger, or stylus"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center text-text-light text-sm pointer-events-none">
            Sign here with your mouse, finger, or stylus
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center text-xs">
        <span className="text-text-light">
          {isEmpty ? 'Draw your signature above' : '✓ Signature captured'}
        </span>
        <button
          type="button"
          onClick={handleClear}
          disabled={isEmpty}
          className="inline-flex items-center gap-1 text-text-light hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Eraser size={13} />
          Clear
        </button>
      </div>
    </div>
  );
}
