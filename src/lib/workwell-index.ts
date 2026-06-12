/**
 * Workwell SEO allowlist — the paths that currently have genuinely UNIQUE
 * Workwell content and are therefore safe to index. Everything else on the
 * Workwell domain is still Clever's copy (brand-swapped) and is noindex'd +
 * kept out of Workwell's sitemap until it's rewritten, so duplicate content
 * can't hurt us at launch.
 *
 * As each page is rewritten with unique content, add its path here and it
 * becomes indexable + appears in the Workwell sitemap.
 */
export const WORKWELL_INDEXABLE_PATHS: readonly string[] = [
  "/",
  "/pricing",
  "/sole-trader",
  "/limited-company",
  "/contractor-accountancy",
  "/freelancer-accountancy",
  "/landlord-accounting",
  "/accounting-for-startups",
  "/ecommerce-accounting",
  "/cis-accounting",
  "/small-business-accountant",
  // Batch 1 — specialist pages rewritten with unique grounded content
  "/vat-returns",
  "/self-assessment",
  "/making-tax-digital",
  "/payroll-services",
  // Batch 2
  "/switching-accountants",
  "/our-services/accountant-switch",
  "/our-services/accounting-software",
  "/it-contractor-accountant",
];

const SET = new Set(WORKWELL_INDEXABLE_PATHS);

/** True if this path has unique Workwell content and may be indexed on Workwell. */
export function isWorkwellIndexable(pathname: string): boolean {
  const p = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";
  return SET.has(p);
}
