"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Fires a GTM dataLayer event recording which A/B variant the visitor saw, and
 * persists the variant in a cookie so the visitor stays pinned on later visits
 * (a Server Component can't set the cookie during render, so we do it here).
 * Renders nothing.
 */
export default function AbTrack({ experiment, variant }: { experiment: string; variant: string }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "experiment_view", experiment, variant });
    try {
      const name = `ab_${experiment}`;
      if (!document.cookie.split("; ").some((c) => c.startsWith(`${name}=`))) {
        document.cookie = `${name}=${variant}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }
    } catch {
      /* cookies unavailable — variant still tracked, just not pinned */
    }
  }, [experiment, variant]);
  return null;
}
