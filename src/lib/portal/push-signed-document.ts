import { getSupabaseServerClient } from '@/lib/portal/db';
import { getPortalDb, schema } from '@/lib/portal/db/client';

/**
 * Pushes a freshly sealed signed PDF into the client portal's Documents area
 * (portal.documents, direction='shared'), storing the bytes in Supabase
 * Storage and linking a long-lived signed URL.
 *
 * Best-effort by design: the signature is already complete and stored in
 * Salesforce before this runs. If the Supabase env vars aren't configured on
 * this deployment (e.g. a preview build), it no-ops quietly.
 */

const BUCKET = 'portal-uploads';
// Ten years — the URL is unguessable (embedded token) and only surfaced to the
// authenticated owner inside the portal, matching the email-attachment posture.
const SIGNED_URL_TTL_SECONDS = 10 * 365 * 24 * 60 * 60;

export interface PushSignedDocumentParams {
  accountSfId: string;
  requestName: string; // SIG-xxxxx — stable idempotency key
  documentTitle: string;
  documentType: string;
  signerName: string;
  signedAtIso: string;
  pdfBytes: Uint8Array;
}

export async function pushSignedDocumentToPortal(params: PushSignedDocumentParams): Promise<boolean> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY ||
    !process.env.SUPABASE_DB_URL
  ) {
    console.warn('pushSignedDocumentToPortal: Supabase env not configured — skipping portal copy');
    return false;
  }

  const supabase = getSupabaseServerClient();
  const path = `${params.accountSfId}/signed/${params.requestName}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, Buffer.from(params.pdfBytes), {
      contentType: 'application/pdf',
      upsert: true,
    });
  if (uploadError) throw new Error(`portal storage upload failed: ${uploadError.message}`);

  const { data: signedUrl, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS, {
      download: `${params.documentTitle}.pdf`,
    });
  if (urlError || !signedUrl?.signedUrl) {
    throw new Error(`portal signed URL failed: ${urlError?.message ?? 'no url returned'}`);
  }

  const category =
    params.documentType.includes('SA Tax Return') ? 'tax_return' : 'accounts';

  const db = getPortalDb();
  const now = new Date();
  await db
    .insert(schema.documents)
    .values({
      sfId: `sig-${params.requestName}`,
      accountSfId: params.accountSfId,
      name: `${params.documentTitle} (signed)`,
      category,
      direction: 'shared',
      status: 'available',
      fileType: 'application/pdf',
      sizeLabel: humanSize(params.pdfBytes.length),
      downloadUrl: signedUrl.signedUrl,
      sharedAt: now,
      sfUpdatedAt: now,
      raw: {
        source: 'document-signing',
        requestName: params.requestName,
        documentType: params.documentType,
        signerName: params.signerName,
        signedAtIso: params.signedAtIso,
      },
    })
    .onConflictDoUpdate({
      target: schema.documents.sfId,
      set: {
        name: `${params.documentTitle} (signed)`,
        status: 'available',
        downloadUrl: signedUrl.signedUrl,
        sizeLabel: humanSize(params.pdfBytes.length),
        sharedAt: now,
        updatedAt: now,
      },
    });

  return true;
}

function humanSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
