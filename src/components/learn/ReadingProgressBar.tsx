"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar pinned to the top of the viewport. Width tracks how far
 * the reader has scrolled through the document. Hidden until the user has
 * scrolled at least a few pixels — avoids a flashing 0%-bar on first paint.
 */
export default function ReadingProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        setPct(0);
        return;
      }
      const next = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      setPct(next);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
      style={{ opacity: pct > 1 ? 1 : 0, transition: "opacity 200ms" }}
    >
      <div
        className="h-full bg-primary"
        style={{ width: `${pct}%`, transition: "width 80ms linear" }}
      />
    </div>
  );
}
