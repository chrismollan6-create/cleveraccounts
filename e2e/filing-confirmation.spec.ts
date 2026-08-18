import { test, expect } from '@playwright/test';

/**
 * /filing-confirmation/[token] — a single Companies House change (here an AD01) a client signs off
 * before we file it. Same brief as the confirmation-statement spec: prove it renders and submits.
 */

const READY = '/filing-confirmation/filing-token-ready-01';
const ALREADY_DONE = '/filing-confirmation/filing-token-done-001';

const AGREE = /I confirm the change above is correct/;
const CONFIRM = /Confirm & authorise/;

const STUB = 'http://127.0.0.1:4010';

test('a client can sign off a change and it reaches Salesforce', async ({ page, request }) => {
  // Start from nothing recorded, so "a respond arrived" cannot be satisfied by an earlier run's.
  await request.get(`${STUB}/__reset?path=/FilingConfirmation/respond`);
  await page.goto(READY);

  await expect(page.getByText('CLOSE PRO ENTERPRISES LTD').first()).toBeVisible();
  await expect(page.getByText('11 New Street, Birmingham, B1 1AA').first()).toBeVisible();

  // Confirming needs BOTH a name and the authority checkbox — it is an authorisation to file on
  // someone's behalf, so neither half alone should arm the button.
  const confirm = page.getByRole('button', { name: CONFIRM });
  await expect(confirm).toBeDisabled();

  await page.getByPlaceholder('e.g. Jane Smith').fill('Ann Wheeler');
  await expect(confirm).toBeDisabled();

  await page.locator('label', { hasText: AGREE }).getByRole('checkbox').check();

  // An AD01 to an address that isn't our own office also asks whether the client trades from there,
  // because that pulls in HMRC, VAT, PAYE and billing. It is unanswered by default and blocks
  // confirming until it is answered either way — silence must not be read as "no".
  await expect(confirm).toBeDisabled();
  await page.getByRole('button', { name: /No — registered office only/ }).click();
  await expect(confirm).toBeEnabled();

  await confirm.click();
  await expect(page.getByRole('heading', { name: /that’s confirmed/ })).toBeVisible();

  const posted = await (await request.get(`${STUB}/__received`)).json();
  const respond = posted.filter((p: { path: string }) => p.path === '/FilingConfirmation/respond').pop();
  expect(respond).toBeTruthy();
  expect(respond.body.token).toBe('filing-token-ready-01');
  expect(respond.body.decision).toBe('confirm');
  // The typed name is the signature on the authorisation — it has to travel with the decision.
  expect(respond.body.name).toBe('Ann Wheeler');
  expect(respond.body.tradingAddressChange).toBe(false);
});

test('a change already confirmed shows the thank-you, not the sign-off page', async ({ page }) => {
  await page.goto(ALREADY_DONE);
  await expect(page.getByRole('heading', { name: /that’s confirmed/ })).toBeVisible();
  await expect(page.getByRole('button', { name: CONFIRM })).toHaveCount(0);
});

test('an unrecognised link is refused rather than half-rendered', async ({ page }) => {
  await page.goto('/filing-confirmation/no-such-token-here');
  await expect(page.getByRole('heading', { name: /Link not recognised/ })).toBeVisible();
});
