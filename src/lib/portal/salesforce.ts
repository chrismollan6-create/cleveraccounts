import { getPortalSalesforceToken, sfApex } from "@/lib/salesforce";
import { signPortalApexJwt, type PortalAuthScope } from "./apex-jwt";

/**
 * Result envelope for portal-facing Salesforce calls. Matches the JSON shape
 * returned by `PortalRestService` (the Apex REST class) on the error path.
 */

export interface PortalApexOk<T> {
  ok: true;
  data: T;
}

export interface PortalApexError {
  ok: false;
  status: number;
  error: string;
  message: string;
}

export type PortalApexResult<T> = PortalApexOk<T> | PortalApexError;

export interface FetchPortalApexOptions {
  /** HTTP method — defaults to GET. */
  method?: "GET" | "POST";
  /** JSON-serialisable body for POST requests. */
  body?: unknown;
}

/**
 * Call a portal Apex REST endpoint with both Connected App Bearer auth AND
 * an HMAC-signed X-Portal-Auth JWT carrying the user's resolved Salesforce
 * scope (accountId/contactId/clerkUserId/brand).
 *
 * Stage 2 portal security hardening: Apex uses the JWT-derived accountId
 * for SOQL — request body / query params are IGNORED for that purpose. So
 * even a bug in `withPortalScope()` upstream that passes the wrong
 * accountId in a URL can't cause an IDOR.
 *
 * The `scope` arg is intentionally explicit (not auto-derived) so every
 * call site documents which scope it's acting under. Pre-auth flows that
 * must run before a scope exists — currently only `/access` for the Clerk
 * webhook's email-to-account lookup — pass `null` and the call goes out
 * with Bearer-only auth.
 */
export async function fetchPortalApex<T>(
  scope: PortalAuthScope | null,
  path: string,
  params?: Record<string, string>,
  options?: FetchPortalApexOptions
): Promise<PortalApexResult<T>> {
  let token: string;
  try {
    token = await getPortalSalesforceToken();
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: "SF_AUTH",
      message: err instanceof Error ? err.message : "Failed to obtain Salesforce token",
    };
  }

  // Build the X-Portal-Auth JWT for everything except the pre-auth /access
  // lookup. The signer throws on missing config — that's intentional so
  // a misconfigured production deploy fails loud rather than running
  // unsigned requests that Apex would 401 anyway.
  let portalAuthJwt: string | null = null;
  if (scope !== null) {
    try {
      portalAuthJwt = signPortalApexJwt(scope);
    } catch (err) {
      return {
        ok: false,
        status: 500,
        error: "JWT_SIGN",
        message: err instanceof Error ? err.message : "Failed to sign portal JWT",
      };
    }
  }

  const method = options?.method ?? "GET";
  const baseUrl = sfApex(`/Portal${path.startsWith("/") ? path : "/" + path}`);
  const url = new URL(baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
  if (portalAuthJwt) headers["X-Portal-Auth"] = portalAuthJwt;
  if (method === "POST") headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: method === "POST" && options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: "SF_NETWORK",
      message: err instanceof Error ? err.message : "Network error calling Salesforce",
    };
  }

  // Read body once, then decide. Body might be JSON or text.
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const errBody = (body && typeof body === "object" ? (body as Record<string, unknown>) : {}) as {
      error?: string;
      message?: string;
    };
    return {
      ok: false,
      status: res.status,
      error: errBody.error ?? `HTTP_${res.status}`,
      message: errBody.message ?? res.statusText ?? `HTTP ${res.status}`,
    };
  }

  return { ok: true, data: body as T };
}
