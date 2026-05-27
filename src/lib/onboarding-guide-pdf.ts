/**
 * Headless-Chrome PDF rendering for the onboarding guide.
 *
 * Production (Vercel / Linux): uses the @sparticuz/chromium bundle.
 * Local dev (Windows / macOS): @sparticuz/chromium ships no local binary, so
 * set LOCAL_CHROME_PATH to a Chrome or Edge executable to exercise the route
 * locally, e.g. in .env.local:
 *   LOCAL_CHROME_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
 */

import puppeteerCore, { type Browser, type Viewport } from 'puppeteer-core';
import chromiumModule from '@sparticuz/chromium';

// @sparticuz/chromium's published types are incomplete — these properties /
// setters exist at runtime in v148+ but aren't in the d.ts. Cast once to
// expose the surface we need.
const chromium = chromiumModule as unknown as {
  args: string[];
  executablePath: () => Promise<string>;
  headless: boolean | 'shell';
  defaultViewport: Viewport | null;
  setHeadlessMode: boolean;
  setGraphicsMode: boolean;
};

// Module-level @sparticuz/chromium config — disable heavy features for a
// smaller boot footprint in the Vercel serverless function. Both lines are
// recommended by @sparticuz/chromium for Lambda/Vercel deployments and help
// avoid the TargetCloseError that surfaces when the chromium process is
// killed mid-render.
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

async function launchBrowser(): Promise<Browser> {
  const localPath = process.env.LOCAL_CHROME_PATH;
  if (localPath) {
    return puppeteerCore.launch({ executablePath: localPath, headless: true });
  }
  // Use chromium.headless / defaultViewport from sparticuz — these encode the
  // shell-headless mode flags the binary actually supports. Passing
  // `headless: true` (old-headless) is the classic cause of "Target closed".
  return puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

/** Render a URL to an A4 PDF. The URL must be reachable from the server. */
export async function renderUrlToPdf(url: string): Promise<Uint8Array> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    // `load` is more reliable than `networkidle0` in serverless — networkidle0
    // can deadlock when a stray connection (e.g. fonts.googleapis.com) refuses
    // to settle, and a deadlock here is what kills chromium with Target closed.
    await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
    // Best-effort: wait for web fonts to finish loading before snapshotting.
    // Swallow timeouts so font issues never collapse the render.
    try {
      await page.waitForFunction(() => (document as Document).fonts.status === 'loaded', {
        timeout: 5_000,
      });
    } catch {
      // proceed anyway — font may have fallen back, page is still useful
    }
    return await page.pdf({
      printBackground: true,
      preferCSSPageSize: true, // honours @page { size: A4 } from the layout
      format: 'A4',
    });
  } finally {
    await browser.close().catch(() => {
      // suppress close errors so the original failure (if any) reaches the caller
    });
  }
}
