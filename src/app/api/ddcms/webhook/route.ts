import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken } from '@/lib/salesforce';

/**
 * DDCMS (Access PaySuite) callback receiver.
 *
 * Registered with them as the return endpoint for all entities:
 *   https://www.cleveraccounts.co.uk/api/ddcms/webhook
 *
 * Design rules (see docs/ddcms-integration-plan.md §4, §4a):
 *
 * 1. A callback is a NOTIFICATION, not a payload of record. We store the GUID
 *    and let Salesforce re-fetch the authoritative object from the DDCMS API.
 *    That makes payload authenticity a non-issue and survives out-of-order
 *    delivery.
 * 2. ALWAYS answer fast, and answer 200 for anything we've safely stored.
 *    BACS-driven retries are not something to invite by being slow or fussy.
 * 3. REDACT BEFORE STORING. Customer-entity callbacks carry AccountNumber and
 *    SortCode in clear. They must never reach a log, Vercel's request
 *    capture, or a Salesforce field.
 *
 * Note: `Paid` never arrives here — the payment callback fires only for Unpaid
 * and Indemnity Claimed. Success is learned by polling (DDCMSOutcomeSweeper).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Anything matching these keys is masked before storage or logging. */
const BANK_KEYS =
  /^(accountnumber|banksortcode|sortcode|accountholdername|accountname)$/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        BANK_KEYS.test(k) && typeof v === 'string' && v
          ? `***${v.slice(-4)}`
          : redact(v),
      ]),
    );
  }
  return value;
}

/**
 * Shared-secret check. Access PaySuite can send a custom header on every
 * callback (arranged by support case). Until that is in place the check is
 * inert, so registration can be tested before the secret exists — but once
 * DDCMS_WEBHOOK_SECRET is set, a missing or wrong header is rejected.
 */
function authorised(req: NextRequest): boolean {
  const expected = process.env.DDCMS_WEBHOOK_SECRET;
  if (!expected) return true;
  const headerName = process.env.DDCMS_WEBHOOK_HEADER || 'x-ddcms-secret';
  return req.headers.get(headerName) === expected;
}

type Payload = Record<string, unknown>;

/**
 * DDCMS sends several payload shapes down the same pipe. Normalise the fields
 * we index on; the untouched (redacted) body is stored alongside regardless.
 *
 *  - object change  : { Entity, Id, NewStatus, ChangeType, Source, ReportCode, ... }
 *  - new payment    : { Entity: 'payment', Id, ContractId, DirectDebitRef, Status, ... }
 *  - new eDD signup : { Entity: 'contract', Id, DirectDebitReference, Status, ... }
 *  - bulk payment   : { Contract, Amount, DueDate, Id, Error, ... }  (no Entity)
 */
function summarise(body: Payload) {
  const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? null : String(v));

  const entity =
    str(body.Entity) ??
    (body.Contract !== undefined ? 'bulkpayment' : null);

  return {
    Entity__c: entity,
    DDCMS_Id__c: str(body.Id),
    New_Status__c: str(body.NewStatus) ?? str(body.Status),
    Change_Type__c: str(body.ChangeType) ?? str(body.CreateType),
    Source__c: str(body.Source),
    Report_Code__c: str(body.ReportCode),
    Report_Message__c: (str(body.ReportMessage) ?? str(body.Error))?.slice(0, 255) ?? null,
    Change_Date__c: str(body.ChangeDate) ?? str(body.DateAdded),
  };
}

export async function POST(request: NextRequest) {
  // Read the body first so a rejected request can still be counted, but never
  // log the raw text — it may carry bank details.
  const raw = await request.text();

  if (!authorised(request)) {
    console.warn('/api/ddcms/webhook: rejected — bad or missing shared secret');
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  let body: Payload;
  try {
    body = JSON.parse(raw) as Payload;
  } catch {
    // We asked for JSON. If XML ever arrives, keep it rather than drop it —
    // an unparsed payload we can inspect beats a silent 400.
    body = { Raw: raw.slice(0, 30000) };
  }

  const safe = redact(body) as Payload;
  const record = {
    ...summarise(body),
    Payload__c: JSON.stringify(safe).slice(0, 32000),
    Processed__c: false,
  };

  try {
    const token = await getSalesforceToken();
    const res = await fetch(
      `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v61.0/sobjects/DDCMS_Event__c`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('/api/ddcms/webhook: Salesforce insert failed', res.status, text);
      // 500 so DDCMS retries — losing a BACS notification is worse than a retry.
      return NextResponse.json({ error: 'Storage failed' }, { status: 500 });
    }

    console.log(
      `/api/ddcms/webhook: stored ${record.Entity__c ?? 'unknown'} ${record.DDCMS_Id__c ?? ''} ${record.New_Status__c ?? ''}`.trim(),
    );
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('/api/ddcms/webhook error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

/** Lets us (and them) confirm the endpoint is live without sending a payload. */
export async function GET() {
  return NextResponse.json({
    endpoint: 'ddcms-webhook',
    status: 'ready',
    secured: Boolean(process.env.DDCMS_WEBHOOK_SECRET),
  });
}
