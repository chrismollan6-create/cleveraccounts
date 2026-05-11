import { getPortalSalesforceToken, sfApex } from "@/lib/salesforce";

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
 * Call a portal Apex REST endpoint with Connected App Bearer auth.
 *
 * Convention: `path` is relative to /services/apexrest/Portal (e.g. '/onboarding').
 * Use this helper from server-side code only — it relies on the SF service
 * account token in env vars and would leak the Connected App if used from
 * the browser.
 */
export async function fetchPortalApex<T>(
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
