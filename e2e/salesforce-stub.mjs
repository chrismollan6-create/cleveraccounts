// A stand-in for the Salesforce Apex REST endpoints the two confirmation pages talk to.
//
// Both pages fetch their data on the SERVER — they are React Server Components, and the API routes
// they post back to are route handlers. None of that traffic goes through the browser, so Playwright's
// page.route() cannot see it. The only seam is the base URL: sfApex() builds every call from
// SALESFORCE_INSTANCE_URL, so pointing that at this process puts a fixture in front of the whole page
// without the tests needing a Salesforce org, a token, or a network.
//
// Fixtures are keyed by token, so a spec picks the state it wants by choosing which link to open.
import { createServer } from 'node:http';

const PORT = Number(process.env.STUB_PORT ?? 4010);

// A confirmation statement ready to approve: nothing to pay, a webfiling code on file, every
// identity verified. Those are the four gates on the approve button, and this fixture clears them
// all — the happy path is the client reading the page, accepting the lawful-purpose statement and
// approving. Anything that fails a gate belongs in its own fixture, not this one.
const CH_READY = {
  companyName: 'CLOSE PRO ENTERPRISES LTD',
  companyNumber: '13561084',
  dueDate: '2026-09-30',
  overdue: false,
  registeredOffice: '11 New Street, Birmingham, B1 1AA',
  registeredEmail: 'accounts@closepro.example',
  sicCodes: ['62020'],
  officers: [{ name: 'Ann Wheeler', role: 'Director', appointed: '2021-08-01', nationality: 'British' }],
  pscs: [{ name: 'Ann Wheeler', nature: 'Ownership of shares – 75% or more', kind: 'individual-person-with-significant-control' }],
  capital: {
    totalShares: '100',
    shareCurrency: 'GBP',
    totalNominal: '100',
    classes: [{ shareClass: 'ORDINARY', numShares: '100', aggregateNominal: '100' }],
  },
  shareholdings: [{ shareClass: 'ORDINARY', numberHeld: '100', shareholders: ['Ann Wheeler'] }],
  idvPeople: [{ key: 'p1', name: 'Ann Wheeler', role: 'Director', type: 'officer', id: 'a01', verified: true }],
  idvAllVerified: true,
  hasWebfilingCode: true,
  status: 'Sent',
  alreadyResponded: false,
  feeStatus: 'Waived',
  feeRequired: false,
};

// A confirmation statement the client has already dealt with — the page should short-circuit to the
// thank-you card server-side and never render the review UI at all.
const CH_DONE = { ...CH_READY, status: 'Confirmed', alreadyResponded: true };

// An AD01 awaiting confirmation. No people, so the address-cascade block stays out of the way and
// the happy path is the plain one: read it, sign it, confirm it.
const FILING_REQUESTED = {
  companyName: 'CLOSE PRO ENTERPRISES LTD',
  companyNumber: '13561084',
  formType: 'AD01',
  formLabel: 'Change of registered office address',
  summary: 'New registered office: 11 New Street, Birmingham, B1 1AA',
  status: 'Requested',
  brand: 'Clever Accounts',
  newAddress: '11 New Street, Birmingham, B1 1AA',
  people: [],
  isOwnOffice: false,
};

const FILING_DONE = { ...FILING_REQUESTED, status: 'Confirmed' };

const PACKS = {
  '/CHConfirmation': {
    'ch-token-ready-000001': CH_READY,
    'ch-token-done-0000001': CH_DONE,
  },
  '/FilingConfirmation': {
    'filing-token-ready-01': FILING_REQUESTED,
    'filing-token-done-001': FILING_DONE,
  },
};

// Every respond POST this process received, so a spec can assert what the page actually SENT rather
// than only what it displayed afterwards — the difference between "the button worked" and "the
// button sent the right thing".
const received = [];

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(json) });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); } catch { resolve({ unparseable: raw }); }
    });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const path = url.pathname.replace('/services/apexrest', '');

  // Test-only introspection, not part of the Salesforce surface.
  if (path === '/__received') return send(res, 200, received);
  // The stub is reused between local runs, so without this a spec that posted NOTHING could still
  // find a matching record from a previous run and pass. Each spec clears its own path first.
  if (path === '/__reset') {
    const only = url.searchParams.get('path');
    for (let i = received.length - 1; i >= 0; i--) {
      if (!only || received[i].path === only) received.splice(i, 1);
    }
    return send(res, 200, { cleared: true, remaining: received.length });
  }

  if (req.method === 'POST' && path.endsWith('/respond')) {
    const body = await readBody(req);
    received.push({ path, body });
    return send(res, 200, { success: true });
  }

  const packs = PACKS[path];
  if (packs) {
    const dto = packs[url.searchParams.get('t') ?? ''];
    // An unknown token is a 404 in the real Apex, and both pages have a distinct card for it.
    return dto ? send(res, 200, dto) : send(res, 404, { error: 'No confirmation found for that link.' });
  }

  send(res, 404, { error: `stub has no handler for ${path}` });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`salesforce stub listening on http://127.0.0.1:${PORT}`);
});
