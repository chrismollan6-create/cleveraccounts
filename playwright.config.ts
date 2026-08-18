import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests for the two client-facing confirmation pages.
 *
 * Deliberately small. No UI bug has caused any of the Companies House filing failures we have found
 * — they were all schema, envelope or pipeline problems, which the offline validator and the gateway
 * smoke suite in the Salesforce repo cover far better than a browser can. These exist to catch the
 * thing those cannot: that the page a client is sent still renders and still submits.
 *
 * Both pages load their data server-side, so the tests do not stub in the browser. They run a fake
 * Salesforce (e2e/salesforce-stub.mjs) and point the Next server's SALESFORCE_INSTANCE_URL at it.
 * Nothing here touches a real org.
 *
 *   npx playwright test              # both specs
 *   npx playwright test --ui         # pick through them interactively
 */
const STUB_PORT = 4010;
const APP_PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  // The funnel pages are force-dynamic and the dev server compiles them on first hit, so the first
  // navigation in a run is slow in a way that has nothing to do with the assertion being made.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    // localhost, NOT 127.0.0.1. Next dev serves its client bundles to the host it prints, and
    // blocks the other as a cross-origin dev resource — the page still renders, but nothing hydrates,
    // so every control looks present and dead. Both happy paths failed on that before this line.
    baseURL: `http://localhost:${APP_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `node e2e/salesforce-stub.mjs`,
      url: `http://127.0.0.1:${STUB_PORT}/__received`,
      reuseExistingServer: !process.env.CI,
      env: { STUB_PORT: String(STUB_PORT) },
      stdout: 'pipe',
    },
    {
      command: `npx next dev --port ${APP_PORT}`,
      url: `http://localhost:${APP_PORT}/ch-confirmation/ch-token-ready-000001`,
      reuseExistingServer: !process.env.CI,
      // Next needs a couple of minutes from cold on this codebase.
      timeout: 180_000,
      env: {
        // The seam. sfApex() builds every Salesforce call from this, so the stub stands in for the
        // whole org — and a token is required but never checked by the stub.
        SALESFORCE_INSTANCE_URL: `http://127.0.0.1:${STUB_PORT}`,
        SALESFORCE_ACCESS_TOKEN: 'stub-token-not-a-real-credential',
      },
      stdout: 'pipe',
    },
  ],
});
