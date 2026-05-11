import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Portal API rate limiting backed by Upstash Redis. Slides a 60-second window
 * keyed by Clerk user id (when available) or IP (anonymous endpoints).
 *
 * Failure mode (changed by security audit, May 2026):
 *   - Production (NODE_ENV=production): if `UPSTASH_REDIS_REST_URL` and
 *     `UPSTASH_REDIS_REST_TOKEN` aren't both set, every limit check throws.
 *     This forces a 500 on every API request and surfaces in Netlify logs
 *     so a misconfigured deploy can't silently disable rate limiting. To
 *     intentionally degrade (e.g. a debug branch deploy without Upstash),
 *     set `PORTAL_RATE_LIMIT_OPTIONAL=1`.
 *   - Dev / non-production: warn once and return `{ ok: true }` so a local
 *     `npm run dev` works without Upstash. Set the env vars to test.
 *
 * Limits:
 *   - portalApi: 30 requests / 60s — generous for the dashboard, tight enough
 *                to block scraping
 *   - authAdjacent: 5 requests / 60s — stricter, used for sign-up / magic
 *                   link / password reset endpoints
 */

let cached: { portal: Ratelimit; authAdjacent: Ratelimit } | null = null;
let warned = false;

function getLimiters(): { portal: Ratelimit; authAdjacent: Ratelimit } | null {
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    const isProd = process.env.NODE_ENV === "production";
    const opted = process.env.PORTAL_RATE_LIMIT_OPTIONAL === "1";
    if (isProd && !opted) {
      // Fail hard — no silent disable in production.
      throw new Error(
        "[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are " +
          "required in production. Set both Netlify env vars, or set " +
          "PORTAL_RATE_LIMIT_OPTIONAL=1 to intentionally disable (not recommended)."
      );
    }
    if (!warned) {
      console.warn(
        "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled. " +
          (isProd
            ? "PORTAL_RATE_LIMIT_OPTIONAL=1 detected; running without limits."
            : "Set both env vars on Netlify to enable.")
      );
      warned = true;
    }
    return null;
  }

  const redis = new Redis({ url, token });
  cached = {
    portal: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "60 s"),
      prefix: "rl:portal-api",
      analytics: true,
    }),
    authAdjacent: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "rl:portal-auth",
      analytics: true,
    }),
  };
  return cached;
}

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix-seconds when window resets
}

/**
 * Check the portal API rate limit for a given identifier (Clerk user id
 * preferred, IP fallback). Returns `{ ok: false }` when over the limit so
 * callers can return 429.
 */
export async function checkPortalApiLimit(identifier: string): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) {
    return { ok: true, limit: -1, remaining: -1, reset: 0 };
  }
  const r = await limiters.portal.limit(identifier);
  return {
    ok: r.success,
    limit: r.limit,
    remaining: r.remaining,
    reset: Math.ceil(r.reset / 1000),
  };
}

/**
 * Stricter limit for auth-adjacent endpoints (sign-up, magic-link request).
 */
export async function checkAuthAdjacentLimit(identifier: string): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) {
    return { ok: true, limit: -1, remaining: -1, reset: 0 };
  }
  const r = await limiters.authAdjacent.limit(identifier);
  return {
    ok: r.success,
    limit: r.limit,
    remaining: r.remaining,
    reset: Math.ceil(r.reset / 1000),
  };
}

/**
 * Build a 429 response with standard headers — RFC-compliant Retry-After
 * + X-RateLimit-* hints so clients can self-throttle.
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  const retryAfter = Math.max(1, result.reset - Math.floor(Date.now() / 1000));
  return new Response(
    JSON.stringify({
      error: "RATE_LIMITED",
      message: "Too many requests. Please slow down.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}
