import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { sealPdf } from '@/lib/pdf-seal';
import { pushSignedDocumentToPortal } from '@/lib/portal/push-signed-document';
import { extractClientIp } from '../shared';

export const maxDuration = 60; // sealing a large PDF can take a few seconds

interface SignBody {
  sessionKey?: string;
  fullName?: string;
  signatureDataUrl?: string | null;
  typedName?: string | null;
  sourcePdfSha256?: string;
  consentReadAndAccept?: boolean;
  consentToEsign?: boolean;
  signerEmail?: string; // display only; evidence email is held server-side
}

interface ApexSignResult {
  success: boolean;
  message: string;
  sealRequired?: boolean;
  documentType?: string;
  stampPage?: number | null;
  stampPosition?: string | null;
  stampAnchors?: string[];
  signerName?: string;
  signedAtIso?: string;
  signerIp?: string;
  documentTitle?: string;
  sourcePdfSha256?: string;
  approvalStatement?: string;
  brandName?: string;
  brandPrimaryHex?: string;
  businessName?: string;
  coverLetterJson?: string;
  confirmationsJson?: string;
  periodEndIso?: string;
  accountId?: string;
  requestName?: string;
}

/**
 * POST /api/sign/sign?t=TOKEN
 *
 * 1. Forwards the sign payload to Apex (which validates session key, consents,
 *    document hash, and records all signature evidence — the signature is
 *    legally complete after this step).
 * 2. On success, seals the PDF here with pdf-lib: stamps the signature into
 *    the document + appends the signing-certificate page, then posts the
 *    sealed PDF back to Apex, which stores it and emails the signer.
 * 3. Seal failure is non-fatal: Apex is told (Seal_Status__c = Failed) and a
 *    sweep retries later. The response still reports a successful signing.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }
    let body: SignBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const ip = extractClientIp(request);
    const ua = request.headers.get('user-agent') || 'unknown';
    const sfToken = await getSalesforceToken();
    const tokenParam = `t=${encodeURIComponent(token)}`;

    // 1. Sign
    const signRes = await fetch(sfApex(`/SignatureRequest/sign?${tokenParam}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
        'X-Original-User-Agent': ua,
      },
      body: JSON.stringify({
        sessionKey: body.sessionKey,
        fullName: body.fullName,
        signatureDataUrl: body.signatureDataUrl,
        typedName: body.typedName,
        sourcePdfSha256: body.sourcePdfSha256,
        consentReadAndAccept: body.consentReadAndAccept,
        consentToEsign: body.consentToEsign,
      }),
      cache: 'no-store',
    });
    const signData = (await signRes.json()) as ApexSignResult;
    if (!signRes.ok || !signData.success) {
      return NextResponse.json(signData, { status: signRes.ok ? 400 : signRes.status });
    }

    // 2. Seal (best-effort)
    let sealed = false;
    if (signData.sealRequired && body.sessionKey) {
      try {
        const pdfRes = await fetch(
          sfApex(`/SignatureRequest/pdf?${tokenParam}&k=${encodeURIComponent(body.sessionKey)}`),
          { headers: { Authorization: `Bearer ${sfToken}` }, cache: 'no-store' },
        );
        if (!pdfRes.ok) throw new Error(`source PDF fetch ${pdfRes.status}`);
        const pdfBytes = new Uint8Array(await pdfRes.arrayBuffer());

        let coverLetter = null;
        if (signData.coverLetterJson) {
          try {
            coverLetter = JSON.parse(signData.coverLetterJson);
          } catch {
            coverLetter = null;
          }
        }
        let confirmations: string[] = [];
        if (signData.confirmationsJson) {
          try {
            const parsed = JSON.parse(signData.confirmationsJson);
            if (Array.isArray(parsed)) confirmations = parsed.filter((c) => typeof c === 'string');
          } catch {
            confirmations = [];
          }
        }

        const sealedBytes = await sealPdf({
          pdfBytes,
          signatureDataUrl: body.signatureDataUrl,
          typedName: body.typedName,
          signerName: signData.signerName || body.fullName || '',
          signerEmail: body.signerEmail || '',
          signedAtIso: signData.signedAtIso || new Date().toISOString(),
          signerIp: signData.signerIp || ip,
          documentTitle: signData.documentTitle || 'Document',
          documentType: signData.documentType || 'Other',
          sourcePdfSha256: signData.sourcePdfSha256 || body.sourcePdfSha256 || '',
          approvalStatement: signData.approvalStatement || '',
          brandName: signData.brandName || 'Clever Accounts',
          brandPrimaryHex: signData.brandPrimaryHex,
          businessName: signData.businessName,
          periodEndIso: signData.periodEndIso,
          coverLetter,
          confirmations,
          stampPage: signData.stampPage,
          stampPosition: signData.stampPosition,
        });

        const storeRes = await fetch(sfApex(`/SignatureRequest/sealed?${tokenParam}`), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sfToken}`,
            'Content-Type': 'application/pdf',
          },
          body: Buffer.from(sealedBytes),
          cache: 'no-store',
        });
        if (!storeRes.ok) {
          const storeErr = await storeRes.text();
          throw new Error(`sealed store ${storeRes.status}: ${storeErr.slice(0, 200)}`);
        }
        sealed = true;

        // Copy into the client portal's Documents area. Best-effort — the
        // signed PDF is already safe in Salesforce and emailed to the client.
        if (signData.accountId && signData.requestName) {
          try {
            await pushSignedDocumentToPortal({
              accountSfId: signData.accountId,
              requestName: signData.requestName,
              documentTitle: signData.documentTitle || 'Signed document',
              documentType: signData.documentType || 'Other',
              signerName: signData.signerName || body.fullName || '',
              signedAtIso: signData.signedAtIso || new Date().toISOString(),
              pdfBytes: sealedBytes,
            });
          } catch (portalErr) {
            console.error('/api/sign/sign portal push failed (non-fatal):', portalErr);
          }
        }
      } catch (sealErr) {
        console.error('/api/sign/sign seal step failed:', sealErr);
        try {
          await fetch(sfApex(`/SignatureRequest/seal-failed?${tokenParam}`), {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sfToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: String(sealErr).slice(0, 400) }),
            cache: 'no-store',
          });
        } catch {
          /* reporting failure is itself best-effort */
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: signData.message,
      sealed,
    });
  } catch (err) {
    console.error('/api/sign/sign error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
