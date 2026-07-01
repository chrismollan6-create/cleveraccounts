import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { completeUploadForCurrentUser } from "@/lib/portal/uploads";
import {
  checkAuthAdjacentLimit,
  rateLimitResponse,
} from "@/lib/portal/ratelimit";
import { assertSameOrigin } from "@/lib/portal/csrf";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/documents/upload/complete
 * Body: { uploadId: string }
 *
 * Called once the browser has uploaded every file to Storage. Flips the batch
 * to 'received', fires the (fail-soft) Salesforce push, and returns the
 * finished upload for the history. Ownership is pinned to the session account
 * inside completeUploadForCurrentUser.
 */
export async function POST(req: Request) {
  const csrf = assertSameOrigin(req);
  if (csrf) return csrf;

  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkAuthAdjacentLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  let payload: { uploadId?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "Request body must be JSON" },
      { status: 400 }
    );
  }

  if (typeof payload.uploadId !== "string" || payload.uploadId.trim().length === 0) {
    return NextResponse.json(
      { error: "MISSING_ID", message: "uploadId is required" },
      { status: 400 }
    );
  }

  let result: Awaited<ReturnType<typeof completeUploadForCurrentUser>>;
  try {
    result = await completeUploadForCurrentUser(payload.uploadId.trim());
  } catch (err) {
    console.error(
      "[/api/portal/documents/upload/complete] uncaught:",
      sanitisedError(err)
    );
    return NextResponse.json(
      { error: "INTERNAL", message: "Couldn't finish the upload" },
      { status: 500 }
    );
  }

  if (result.ok === false) {
    return NextResponse.json(
      { error: result.reason, message: "Could not complete upload" },
      { status: result.reason === "not_signed_in" ? 401 : 403 }
    );
  }

  if (result.data === null) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "That upload can't be completed" },
      { status: 409 }
    );
  }

  return NextResponse.json(result.data);
}
