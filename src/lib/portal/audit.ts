import { headers } from "next/headers";
import { getCurrentPortalUser } from "./auth";
import { getPortalDb, schema } from "./db/client";

/**
 * Portal audit log helper. Every "interesting" event (login, dashboard view,
 * data access, denied access, write actions) gets a row in `portal.audit_log`.
 *
 * Design rules:
 *   - Never throws. Audit failures must not break user-facing actions —
 *     a 500 in the audit log is a worse customer experience than a missing
 *     audit row. We log to console and move on.
 *   - Resolves user identity automatically via getCurrentPortalUser(). For
 *     anonymous events (pre-auth), pass `anonymous: true` in metadata.
 *   - Pulls IP from x-forwarded-for, UA from user-agent — both via Next.js
 *     `headers()`.
 *
 * Used everywhere we want forensic visibility. Required by GDPR Art. 32 for
 * personal-data processing systems.
 */

export interface LogPortalEventInput {
  /** Stable verb/noun describing what happened. e.g. 'view_dashboard'. */
  action: string;
  /** Optional id-like reference (SF record, Engagement Letter token, etc.). */
  target?: string;
  /** Arbitrary structured detail — stored as JSONB. */
  metadata?: Record<string, unknown>;
  /**
   * Override the resolved user — useful from server actions that already
   * know who they're acting on behalf of (e.g. Clerk webhook handler).
   */
  override?: {
    clerkUserId?: string | null;
    accountSfId?: string | null;
  };
}

export async function logPortalEvent(input: LogPortalEventInput): Promise<void> {
  try {
    let clerkUserId: string | null = input.override?.clerkUserId ?? null;
    let accountSfId: string | null = input.override?.accountSfId ?? null;

    if (clerkUserId == null) {
      const user = await getCurrentPortalUser();
      clerkUserId = user?.clerkUserId ?? null;
      accountSfId = accountSfId ?? user?.accountSfId ?? null;
    }

    const h = await headers();
    const ipHeader = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? null;
    const ip = ipHeader ? ipHeader.split(",")[0]?.trim() : null;
    const ua = h.get("user-agent") ?? null;

    const db = getPortalDb();
    await db.insert(schema.auditLog).values({
      clerkUserId,
      accountSfId,
      action: input.action,
      target: input.target ?? null,
      ip: ip && isValidIp(ip) ? ip : null,
      userAgent: ua,
      metadata: input.metadata ?? null,
    });
  } catch (err) {
    console.error("[audit] logPortalEvent failed:", err);
  }
}

/**
 * Minimal IP sanity check. Postgres `inet` type rejects non-IP strings with
 * a Bad Request; we'd rather drop the value than 500 the audit insert.
 */
function isValidIp(ip: string): boolean {
  // IPv4 quick check
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return true;
  // IPv6 (very loose — Postgres validates strictly, this is just a gate)
  if (/^[0-9a-fA-F:]+$/.test(ip) && ip.includes(":")) return true;
  return false;
}

/**
 * Variant for code paths that already have an open DB scope (e.g. inside
 * `withPortalScope()`) and want to reuse the connection rather than reach
 * for a fresh one.
 */
export async function logPortalEventScoped(
  db: ReturnType<typeof getPortalDb>,
  input: Omit<LogPortalEventInput, "override"> & {
    clerkUserId: string;
    accountSfId: string;
  }
): Promise<void> {
  try {
    const h = await headers();
    const ipHeader = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? null;
    const ip = ipHeader ? ipHeader.split(",")[0]?.trim() : null;
    const ua = h.get("user-agent") ?? null;

    await db.insert(schema.auditLog).values({
      clerkUserId: input.clerkUserId,
      accountSfId: input.accountSfId,
      action: input.action,
      target: input.target ?? null,
      ip: ip && isValidIp(ip) ? ip : null,
      userAgent: ua,
      metadata: input.metadata ?? null,
    });
  } catch (err) {
    console.error("[audit] logPortalEventScoped failed:", err);
  }
}
