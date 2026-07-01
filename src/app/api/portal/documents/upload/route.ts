import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import {
  registerUploadForCurrentUser,
  validateUploadRequest,
  type RegisterFileInput,
} from "@/lib/portal/uploads";
import {
  checkAuthAdjacentLimit,
  rateLimitResponse,
} from "@/lib/portal/ratelimit";
import { assertSameOrigin } from "@/lib/portal/csrf";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/documents/upload — register step.
 * Body: { note?: string, files: { name: string, type?: string, size?: number }[] }
 *
 * Creates the (pending) upload rows and returns one signed-upload slot per file
 * so the browser can push bytes straight to Supabase Storage (bypassing the
 * serverless request-body limit). IDOR-safe: the account id comes from the
 * session inside registerUploadForCurrentUser, never from this request.
 */
export async function POST(req: Request) {
  const csrf = assertSameOrigin(req);
  if (csrf) return csrf;

  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkAuthAdjacentLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  let payload: { note?: unknown; files?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "Request body must be JSON" },
      { status: 400 }
    );
  }

  const note = typeof payload.note === "string" ? payload.note : null;
  if (!Array.isArray(payload.files)) {
    return NextResponse.json(
      { error: "MISSING_FILES", message: "files[] is required" },
      { status: 400 }
    );
  }
  const files: RegisterFileInput[] = payload.files.map((f) => ({
    name: typeof f?.name === "string" ? f.name : "",
    type: typeof f?.type === "string" ? f.type : null,
    size: typeof f?.size === "number" ? f.size : null,
  }));

  const invalid = validateUploadRequest(files, note);
  if (invalid) {
    return NextResponse.json(
      { error: invalid.reason.toUpperCase(), message: invalid.message },
      { status: 400 }
    );
  }

  let result: Awaited<ReturnType<typeof registerUploadForCurrentUser>>;
  try {
    result = await registerUploadForCurrentUser(files, note);
  } catch (err) {
    console.error("[/api/portal/documents/upload] uncaught:", sanitisedError(err));
    return NextResponse.json(
      { error: "INTERNAL", message: "Couldn't start the upload — please try again" },
      { status: 500 }
    );
  }

  if (result.ok === false) {
    return NextResponse.json(
      { error: result.reason, message: "Could not start upload" },
      { status: result.reason === "not_signed_in" ? 401 : 403 }
    );
  }

  return NextResponse.json(result.data);
}
