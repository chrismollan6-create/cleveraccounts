import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Lightweight, keyless-by-default bot protection for PUBLIC marketing forms
 * (contact, callback, sign-up, IR35 — not the authenticated portal).
 *
 * Three layers, in order of cost:
 *   1. Honeypot — a hidden `website` field real users never see/fill. Bots that
 *      blindly fill inputs trip it. (Matches the existing convention in
 *      /api/ir35-opinion.)
 *   2. Time-trap — the client stamps `_t` (ms epoch) when the form mounts; a
 *      submission faster than MIN_FILL_MS is almost certainly automated.
 *   3. Rate-limit — per-IP, best-effort via Upstash IF configured. Unlike the
 *      portal limiter (which fails HARD in prod by design), marketing spam
 *      protection FAILS OPEN: no Upstash creds → no limiting, never a 500.
 *
 * On honeypot/time-trap hits, callers should return a benign success so bots
 * can't tell they were dropped (see spamResponse).
 */

export const HONEYPOT_FIELD = "website";
const MIN_FILL_MS = 2500;

let limiter: Ratelimit | null | undefined; // undefined = not yet initialised, null = disabled
function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_TOKEN;
  limiter =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(5, "60 s"),
          prefix: "mkt-form",
        })
      : null;
  return limiter;
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Honeypot + time-trap check. Returns a reason if it looks like a bot, else null. */
export function detectSpam(body: Record<string, unknown> | null | undefined): string | null {
  if (!body) return null;
  const hp = body[HONEYPOT_FIELD];
  if (typeof hp === "string" && hp.trim() !== "") return "honeypot";
  const t = Number((body as Record<string, unknown>)._t);
  if (Number.isFinite(t) && t > 0 && Date.now() - t < MIN_FILL_MS) return "too-fast";
  return null;
}

/**
 * Full guard for a marketing form submission. Returns:
 *   - { ok: true } to proceed
 *   - { ok: false, spam: true } → caller should return spamResponse() (benign 200)
 *   - { ok: false, rateLimited: true } → caller should return a 429
 */
export async function guardFormSubmission(
  req: Request,
  body: Record<string, unknown> | null | undefined,
): Promise<{ ok: boolean; spam?: boolean; rateLimited?: boolean }> {
  if (detectSpam(body)) return { ok: false, spam: true };
  const rl = getLimiter();
  if (rl) {
    try {
      const { success } = await rl.limit(getClientIp(req));
      if (!success) return { ok: false, rateLimited: true };
    } catch {
      // fail open — never block a real lead because Redis hiccuped
    }
  }
  return { ok: true };
}

/** Benign response for honeypot/time-trap hits — looks like success to a bot. */
export function spamResponse(): Response {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export function rateLimitedResponse(): Response {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
    status: 429,
    headers: { "content-type": "application/json", "retry-after": "60" },
  });
}
