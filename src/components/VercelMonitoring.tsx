import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Analytics + Speed Insights.
 *
 * - Analytics tracks page views + custom events (no PII), included with Pro.
 * - Speed Insights captures Core Web Vitals from real users (LCP, INP, CLS),
 *   per route, so we can spot perf regressions before clients complain.
 *
 * Both must be inside <body> on every layout that owns its own <html>/<body>
 * (there's no app-root layout in this app — each of (site), (funnel), portal
 * is its own root). Importing this once per layout keeps the calls colocated
 * if we ever want to fork their config per surface.
 */
export function VercelMonitoring() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
