export type Variant = "A" | "B";

/** Cookie name used to pin a visitor to a variant for a given page slug. */
export function abCookieName(slug: string): string {
  return `ab_${slug}`;
}

/**
 * Decide which variant a visitor should see.
 * If a valid cookie value ("A"/"B") already exists, reuse it so the visitor
 * stays pinned. Otherwise pick 50/50 at random — the caller is responsible
 * for persisting the returned value back into the cookie.
 */
export function pickVariant(_slug: string, cookieValue?: string): Variant {
  if (cookieValue === "A" || cookieValue === "B") return cookieValue;
  return Math.random() < 0.5 ? "A" : "B";
}
