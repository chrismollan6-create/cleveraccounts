import { test, expect } from '@playwright/test';

/**
 * /ch-confirmation/[token] — the confirmation statement a client reviews before we file it.
 *
 * One happy path and the two states that must never render the review UI. That is the whole brief:
 * no UI bug has caused any of the filing failures we have found, so this is here to notice if the
 * page stops rendering or stops submitting, not to re-test the filing logic.
 */

const READY = '/ch-confirmation/ch-token-ready-000001';
const ALREADY_DONE = '/ch-confirmation/ch-token-done-0000001';

const LAWFUL = /I confirm the company is trading lawfully/;
const APPROVE = /Approve & confirm these details/;

const STUB = 'http://127.0.0.1:4010';

test('a client can read the statement and approve it', async ({ page, request }) => {
  // Start from nothing recorded, so "a respond arrived" cannot be satisfied by an earlier run's.
  await request.get(`${STUB}/__reset?path=/CHConfirmation/respond`);
  await page.goto(READY);

  // The company this is about, so a client can tell at a glance it is theirs.
  await expect(page.getByText('CLOSE PRO ENTERPRISES LTD').first()).toBeVisible();

  // Lawful purpose is opt-IN and is the directors' statutory declaration, so the approve button
  // must start out of reach. Pre-ticking it once meant a statement could be filed without the
  // declaration ever actively being made.
  const approve = page.getByRole('button', { name: APPROVE });
  await expect(approve).toBeDisabled();

  await page.locator('label', { hasText: LAWFUL }).getByRole('checkbox').check();
  await expect(approve).toBeEnabled();

  await approve.click();
  await expect(page.getByRole('heading', { name: /Thanks — that’s approved/ })).toBeVisible();

  // What reached Salesforce, not just what the page then said. A submit that renders the thank-you
  // without sending the declaration would pass a text-only assertion.
  const posted = await (await request.get(`${STUB}/__received`)).json();
  const respond = posted.filter((p: { path: string }) => p.path === '/CHConfirmation/respond').pop();
  expect(respond).toBeTruthy();
  expect(respond.body.token).toBe('ch-token-ready-000001');
  expect(respond.body.payload.lawfulPurpose).toBe(true);
  expect(respond.body.payload.approve).toBe(true);
});

test('a statement already confirmed shows the thank-you, not the review page', async ({ page }) => {
  await page.goto(ALREADY_DONE);
  await expect(page.getByRole('heading', { name: /you’ve confirmed your details/ })).toBeVisible();
  await expect(page.getByRole('button', { name: APPROVE })).toHaveCount(0);
});

test('an unrecognised link is refused rather than half-rendered', async ({ page }) => {
  await page.goto('/ch-confirmation/no-such-token-here');
  await expect(page.getByRole('heading', { name: /Link not recognised/ })).toBeVisible();
});
