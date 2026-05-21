/**
 * Promotional-discount badge helpers.
 *
 * The promo lives on the `siteSettings` singleton (see the siteSettings
 * schema). `appliesTo` is an array of *references* to `pricingPlan`
 * documents — matching is by document `_id`, so a plan can be renamed in the
 * CMS without silently breaking the badge. GROQ must dereference it as
 * `appliesTo[]->{ _id, name }`.
 */

/** A pricing plan the promo applies to, dereferenced from a Sanity reference. */
export type PromoPlanRef = { _id: string; name?: string };

export type Promo = {
  enabled?: boolean;
  discountPercent?: number;
  durationMonths?: number;
  badgeText?: string;
  /** Pricing plans this promo applies to, dereferenced to id + name. */
  appliesTo?: PromoPlanRef[];
  endDate?: string;
} | null | undefined;

/** Badge label — the explicit `badgeText` override, else generated from %/duration. */
export function promoBadgeText(promo: Promo): string {
  if (!promo?.enabled) return "";
  if (promo.badgeText) return promo.badgeText;
  const pct = promo.discountPercent ? `${promo.discountPercent}% off` : "";
  const dur = promo.durationMonths ? ` for ${promo.durationMonths} months` : "";
  return (pct + dur).trim();
}

/** True if the promo is live and covers the pricing plan with this `_id`. */
export function promoCoversPlanId(planId: string | undefined, promo: Promo): boolean {
  if (!planId || !promo?.enabled || !promo.appliesTo) return false;
  return promo.appliesTo.some((p) => p?._id === planId);
}

/** Badge text for a given plan `_id`, or "" when the promo doesn't cover it. */
export function promoBadgeForPlanId(planId: string | undefined, promo: Promo): string {
  return promoCoversPlanId(planId, promo) ? promoBadgeText(promo) : "";
}

/**
 * Map of pricing-plan name → badge text for every plan the promo covers.
 * Used by surfaces keyed by plan name (homepage tabs, service cards) rather
 * than by `_id`. The names come from the referenced plan documents, so they
 * always reflect the current plan name.
 */
export function promoBadgesByPlanName(promo: Promo): Record<string, string> {
  const text = promoBadgeText(promo);
  const out: Record<string, string> = {};
  if (!text || !promo?.appliesTo) return out;
  for (const p of promo.appliesTo) if (p?.name) out[p.name] = text;
  return out;
}

/**
 * Badge text for the pricing plan whose `homepageLearnMore` link points at
 * `pagePath` — the data-driven join between a marketing/service page and its
 * pricing plan. Returns "" when no plan declares that link or the promo does
 * not cover it. (Set "Homepage 'Learn More' Link" on the plan in Sanity to
 * wire a service page up, e.g. Ltd Complete → "/limited-company".)
 */
export function promoBadgeForPage(
  plans: { _id: string; homepageLearnMore?: string }[] | undefined,
  pagePath: string,
  promo: Promo,
): string {
  const plan = plans?.find((p) => p.homepageLearnMore === pagePath);
  return plan ? promoBadgeForPlanId(plan._id, promo) : "";
}
