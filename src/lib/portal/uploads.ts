import { randomUUID } from "node:crypto";
import { desc, eq, inArray } from "drizzle-orm";
import { getSupabaseServerClient } from "./db";
import { fetchPortalApex } from "./salesforce";
import {
  tryWithPortalScope,
  assertWritable,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type {
  PortalUpload,
  PortalUploadFile,
  PortalUploadInit,
  PortalUploadSlot,
} from "./types";

/**
 * Client document uploads (client → us). Hybrid storage:
 *   1. bytes → private Supabase Storage bucket `portal-uploads` (direct upload
 *      from the browser via a signed-upload URL, so we don't hit Vercel's
 *      ~4.5 MB serverless request-body limit);
 *   2. metadata + the client's commentary → portal.document_uploads(+_files);
 *   3. a best-effort push to Salesforce so staff see the files on the Account.
 *
 * Two-step API to make direct upload work:
 *   register → returns one signed-upload slot per file (row = 'pending')
 *   (client uploads each file straight to Storage)
 *   complete → flips to 'received', fires the SF push (fail-soft)
 *
 * Everything is scoped through withPortalScope — the account id is taken from
 * the session, never from the request, so uploads can only ever land under the
 * caller's own account (IDOR-safe).
 */

const BUCKET = "portal-uploads";
export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB per file
export const MAX_NOTE_LENGTH = 2000;

// Extension allowlist — the pragmatic guard for a documents portal. We check
// extension (client-reported MIME is unreliable) plus the per-file byte cap.
const ALLOWED_EXT = new Set([
  "pdf", "png", "jpg", "jpeg", "webp", "gif", "heic", "heif",
  "doc", "docx", "xls", "xlsx", "csv", "txt", "rtf", "odt", "ods",
]);

export interface RegisterFileInput {
  name: string;
  type?: string | null;
  size?: number | null;
}

export interface UploadValidationError {
  ok: false;
  reason: "no_files" | "too_many" | "file_too_large" | "bad_type" | "note_too_long";
  message: string;
  detail?: string;
}

let bucketReady = false;
async function ensureBucket(
  sb: ReturnType<typeof getSupabaseServerClient>
): Promise<void> {
  if (bucketReady) return;
  const { data } = await sb.storage.getBucket(BUCKET);
  if (!data) {
    // Private bucket — objects are only ever reachable via short-lived signed
    // URLs minted server-side. Ignore an "already exists" race.
    await sb.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: MAX_FILE_BYTES,
    });
  }
  bucketReady = true;
}

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function sanitiseName(name: string): string {
  // Keep it readable but path-safe. Storage key gets a UUID prefix regardless.
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/_+/g, "_");
  return base.slice(0, 120) || "file";
}

function humanSize(bytes: number | null): string | null {
  if (bytes == null || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}

/** Static validation of a register request — returns null when OK. */
export function validateUploadRequest(
  files: RegisterFileInput[],
  note: string | null
): UploadValidationError | null {
  if (!files || files.length === 0) {
    return { ok: false, reason: "no_files", message: "Add at least one file to send." };
  }
  if (files.length > MAX_FILES) {
    return {
      ok: false,
      reason: "too_many",
      message: `You can send up to ${MAX_FILES} files at once.`,
    };
  }
  if (note && note.length > MAX_NOTE_LENGTH) {
    return {
      ok: false,
      reason: "note_too_long",
      message: `Please keep your note under ${MAX_NOTE_LENGTH} characters.`,
    };
  }
  for (const f of files) {
    if (typeof f.size === "number" && f.size > MAX_FILE_BYTES) {
      return {
        ok: false,
        reason: "file_too_large",
        message: `"${f.name}" is too big — the limit is ${MAX_FILE_BYTES / (1024 * 1024)} MB per file.`,
        detail: f.name,
      };
    }
    if (!ALLOWED_EXT.has(extensionOf(f.name))) {
      return {
        ok: false,
        reason: "bad_type",
        message: `"${f.name}" isn't a supported file type. Accepted: PDF, images, Word/Excel, CSV, text.`,
        detail: f.name,
      };
    }
  }
  return null;
}

/**
 * Register an upload batch: creates the DB rows (status 'pending') and returns
 * one signed-upload slot per file. The browser then uploads each file straight
 * to Storage using the token, and calls complete().
 */
export async function registerUploadForCurrentUser(
  files: RegisterFileInput[],
  note: string | null
): Promise<PortalScopeResult<PortalUploadInit>> {
  return tryWithPortalScope(async (scope) => {
    assertWritable(scope); // staff view-as must not upload as the client
    const { accountSfId, contactSfId, db, clerkUserId } = scope;
    const sb = getSupabaseServerClient();
    await ensureBucket(sb);

    const [uploadRow] = await db
      .insert(schema.documentUploads)
      .values({
        accountSfId,
        clerkUserId,
        contactSfId,
        note: note?.trim() ? note.trim() : null,
        status: "pending",
      })
      .returning({ id: schema.documentUploads.id });

    const uploadId = uploadRow.id;
    const slots: PortalUploadSlot[] = [];

    for (const f of files) {
      const path = `${accountSfId}/${uploadId}/${randomUUID()}-${sanitiseName(f.name)}`;
      const { data, error } = await sb.storage
        .from(BUCKET)
        .createSignedUploadUrl(path);
      if (error || !data) {
        throw new Error(
          `createSignedUploadUrl failed for ${f.name}: ${error?.message ?? "no data"}`
        );
      }

      const [fileRow] = await db
        .insert(schema.documentUploadFiles)
        .values({
          uploadId,
          fileName: f.name.slice(0, 255),
          fileType: f.type ?? null,
          sizeBytes: typeof f.size === "number" ? Math.round(f.size) : null,
          storagePath: path,
        })
        .returning({ id: schema.documentUploadFiles.id });

      slots.push({
        fileId: String(fileRow.id),
        fileName: f.name,
        path,
        token: data.token,
        signedUrl: data.signedUrl,
      });
    }

    await logPortalEventScoped(db, {
      action: "upload_register",
      clerkUserId,
      accountSfId,
      target: String(uploadId),
      metadata: { fileCount: files.length, hasNote: Boolean(note?.trim()) },
    });

    return { uploadId: String(uploadId), slots };
  });
}

/**
 * Complete an upload batch: flips 'pending' → 'received' and fires the
 * best-effort Salesforce push. Returns the finished upload DTO for the history.
 * Fail-soft: the client's files are already safe in Storage, so a push error
 * only marks 'push_failed' (retryable) — it never fails the request.
 */
export async function completeUploadForCurrentUser(
  uploadId: string
): Promise<PortalScopeResult<PortalUpload | null>> {
  return tryWithPortalScope(async (scope) => {
    assertWritable(scope); // staff view-as must not finalise uploads as the client
    const { accountSfId, db, clerkUserId } = scope;
    const idNum = Number(uploadId);
    if (!Number.isInteger(idNum)) return null;

    // Ownership-pinned update — can only touch this account's pending batch.
    const updated = await db
      .update(schema.documentUploads)
      .set({ status: "received", updatedAt: new Date() })
      .where(eq(schema.documentUploads.id, idNum))
      .returning();

    const row = updated[0];
    if (!row || row.accountSfId !== accountSfId) return null;

    const files = await db
      .select()
      .from(schema.documentUploadFiles)
      .where(eq(schema.documentUploadFiles.uploadId, idNum));

    // Best-effort push to Salesforce so staff see it on the Account.
    let finalStatus = "received";
    let pushError: string | null = null;
    try {
      const pushed = await pushUploadToSalesforce(scope, row, files);
      if (pushed.ok) {
        finalStatus = "pushed";
        await db
          .update(schema.documentUploads)
          .set({ status: "pushed", sfContentRef: pushed.ref, updatedAt: new Date() })
          .where(eq(schema.documentUploads.id, idNum));
      } else {
        finalStatus = "push_failed";
        pushError = (pushed as { error?: string }).error ?? "unknown";
        await db
          .update(schema.documentUploads)
          .set({ status: "push_failed", updatedAt: new Date() })
          .where(eq(schema.documentUploads.id, idNum));
      }
    } catch (e) {
      finalStatus = "push_failed";
      pushError = e instanceof Error ? e.message : String(e);
      await db
        .update(schema.documentUploads)
        .set({ status: "push_failed", updatedAt: new Date() })
        .where(eq(schema.documentUploads.id, idNum));
    }

    await logPortalEventScoped(db, {
      action: "upload_complete",
      clerkUserId,
      accountSfId,
      target: uploadId,
      metadata: { fileCount: files.length, pushStatus: finalStatus, pushError },
    });

    return dtoFor({ ...row, status: finalStatus }, files, getSupabaseServerClient());
  });
}

/** List the current user's upload history (newest first), with signed URLs. */
export async function listUploadsForCurrentUser(): Promise<
  PortalScopeResult<PortalUpload[]>
> {
  return tryWithPortalScope(async ({ accountSfId, db, clerkUserId }) => {
    const uploads = await db
      .select()
      .from(schema.documentUploads)
      .where(eq(schema.documentUploads.accountSfId, accountSfId))
      .orderBy(desc(schema.documentUploads.createdAt));

    // Only surface batches that actually completed (hide abandoned 'pending').
    const visible = uploads.filter((u) => u.status !== "pending");
    if (visible.length === 0) return [];

    const ids = visible.map((u) => u.id);
    const files = await db
      .select()
      .from(schema.documentUploadFiles)
      .where(inArray(schema.documentUploadFiles.uploadId, ids));

    const sb = getSupabaseServerClient();
    const byUpload = new Map<number, typeof files>();
    for (const f of files) {
      const arr = byUpload.get(f.uploadId) ?? [];
      arr.push(f);
      byUpload.set(f.uploadId, arr);
    }

    const out: PortalUpload[] = [];
    for (const u of visible) {
      out.push(await dtoFor(u, byUpload.get(u.id) ?? [], sb));
    }

    await logPortalEventScoped(db, {
      action: "view_uploads",
      clerkUserId,
      accountSfId,
      metadata: { count: out.length, source: "cache" },
    });

    return out;
  });
}

// ─── internal ───────────────────────────────────────────────────────────────

async function dtoFor(
  upload: typeof schema.documentUploads.$inferSelect,
  files: (typeof schema.documentUploadFiles.$inferSelect)[],
  sb: ReturnType<typeof getSupabaseServerClient>
): Promise<PortalUpload> {
  const fileDtos: PortalUploadFile[] = [];
  for (const f of files) {
    let downloadUrl: string | null = null;
    const { data } = await sb.storage
      .from(BUCKET)
      .createSignedUrl(f.storagePath, 600); // 10 min
    if (data?.signedUrl) downloadUrl = data.signedUrl;
    fileDtos.push({
      id: String(f.id),
      fileName: f.fileName,
      fileType: f.fileType,
      sizeLabel: humanSize(f.sizeBytes),
      downloadUrl,
    });
  }
  return {
    id: String(upload.id),
    note: upload.note,
    status: upload.status,
    createdAt:
      upload.createdAt instanceof Date
        ? upload.createdAt.toISOString()
        : String(upload.createdAt),
    files: fileDtos,
  };
}

/**
 * Push a completed batch to Salesforce. Sends the commentary + a longer-lived
 * signed URL per file to Apex /Portal/document-upload, which fetches each file
 * and creates a ContentVersion on the Account (staff-visible). Returns a
 * discriminated result so complete() can record 'pushed' vs 'push_failed'.
 *
 * NOTE: the Apex endpoint is a separate deploy. Until it exists this returns
 * ok:false and the batch stays 'push_failed' — files remain safe in Storage
 * and visible to the client; a backfill/retry can re-push later.
 */
async function pushUploadToSalesforce(
  scope: {
    accountSfId: string;
    contactSfId: string;
    brand: "clever" | "workwell";
    clerkUserId: string;
  },
  upload: typeof schema.documentUploads.$inferSelect,
  files: (typeof schema.documentUploadFiles.$inferSelect)[]
): Promise<{ ok: true; ref: string } | { ok: false; error?: string }> {
  const sb = getSupabaseServerClient();
  const payloadFiles: { name: string; type: string | null; size: number | null; url: string }[] = [];
  for (const f of files) {
    const { data } = await sb.storage
      .from(BUCKET)
      .createSignedUrl(f.storagePath, 60 * 60 * 24 * 7); // 7 days for Apex fetch
    if (!data?.signedUrl) return { ok: false, error: "signed download URL generation failed" };
    payloadFiles.push({
      name: f.fileName,
      type: f.fileType,
      size: f.sizeBytes,
      url: data.signedUrl,
    });
  }

  const result = await fetchPortalApex<{ contentDocumentId?: string; caseId?: string }>(
    {
      clerkUserId: scope.clerkUserId,
      accountId: scope.accountSfId,
      contactId: scope.contactSfId,
      brand: scope.brand,
    },
    "/document-upload",
    undefined,
    {
      method: "POST",
      body: {
        uploadId: String(upload.id),
        note: upload.note,
        files: payloadFiles,
      },
    }
  );

  if (result.ok === true) {
    return {
      ok: true,
      ref: result.data?.contentDocumentId ?? result.data?.caseId ?? "sf",
    };
  }
  return { ok: false, error: `HTTP ${result.status} ${result.error}: ${result.message}` };
}
