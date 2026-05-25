/**
 * Headless-Chrome PDF rendering for the onboarding guide.
 *
 * Production (Vercel / Linux): uses the @sparticuz/chromium bundle.
 * Local dev (Windows / macOS): @sparticuz/chromium ships no local binary, so
 * set LOCAL_CHROME_PATH to a Chrome or Edge executable to exercise the route
 * locally, e.g. in .env.local:
 *   LOCAL_CHROME_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
 */

import puppeteerCore, { type Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

async function launchBrowser(): Promise<Browser> {
  const localPath = process.env.LOCAL_CHROME_PATH;
  if (localPath) {
    return puppeteerCore.launch({ executablePath: localPath, headless: true });
  }
  return puppeteerCore.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

/** Render a URL to an A4 PDF. The URL must be reachable from the server. */
export async function renderUrlToPdf(url: string): Promise<Uint8Array> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 });
    // Wait for brand web fonts to finish loading before snapshotting.
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    return await page.pdf({
      printBackground: true,
      preferCSSPageSize: true, // honours @page { size: A4 } from the layout
      format: 'A4',
    });
  } finally {
    await browser.close();
  }
}
