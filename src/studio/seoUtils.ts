export interface SeoCheck {
  key: string;
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
  weight: number;
  earned: number;
}

export interface SeoScore {
  total: number;
  checks: SeoCheck[];
  grade: "good" | "ok" | "poor";
}

export interface SeoDocumentFields {
  _type?: string;
  title?: string;
  clientName?: string;
  headline?: string;
  slug?: { current?: string };
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  summary?: string;
  heroSubheadline?: string;
  featuredImage?: { asset?: unknown; alt?: string };
  photo?: { asset?: unknown };
  body?: unknown[];
}

export function scoreDocument(doc: SeoDocumentFields): SeoScore {
  const checks: SeoCheck[] = [];

  // ── Meta title ────────────────────────────────────────────────────────────
  const hasMetaTitle = !!doc.metaTitle?.trim();
  const metaTitleLen = doc.metaTitle?.trim().length ?? 0;
  const titleInRange = metaTitleLen >= 30 && metaTitleLen <= 60;

  checks.push({
    key: "metaTitle_present",
    label: "Meta title",
    status: hasMetaTitle ? "pass" : "fail",
    message: hasMetaTitle ? `Set (${metaTitleLen} chars)` : "Missing — add a meta title",
    weight: 20,
    earned: hasMetaTitle ? 20 : 0,
  });
  checks.push({
    key: "metaTitle_length",
    label: "Meta title length",
    status: !hasMetaTitle ? "fail" : titleInRange ? "pass" : "warn",
    message: !hasMetaTitle
      ? "Add a meta title first"
      : titleInRange
      ? `Good length (${metaTitleLen} chars)`
      : metaTitleLen < 30
      ? `Too short — aim for 30–60 chars (currently ${metaTitleLen})`
      : `Too long — trim to 60 chars (currently ${metaTitleLen})`,
    weight: 10,
    earned: titleInRange ? 10 : 0,
  });

  // ── Meta description ──────────────────────────────────────────────────────
  const hasMetaDesc = !!doc.metaDescription?.trim();
  const metaDescLen = doc.metaDescription?.trim().length ?? 0;
  const descInRange = metaDescLen >= 120 && metaDescLen <= 160;

  checks.push({
    key: "metaDesc_present",
    label: "Meta description",
    status: hasMetaDesc ? "pass" : "fail",
    message: hasMetaDesc ? `Set (${metaDescLen} chars)` : "Missing — add a meta description",
    weight: 20,
    earned: hasMetaDesc ? 20 : 0,
  });
  checks.push({
    key: "metaDesc_length",
    label: "Meta description length",
    status: !hasMetaDesc ? "fail" : descInRange ? "pass" : "warn",
    message: !hasMetaDesc
      ? "Add a meta description first"
      : descInRange
      ? `Good length (${metaDescLen} chars)`
      : metaDescLen < 120
      ? `Too short — aim for 120–160 chars (currently ${metaDescLen})`
      : `Too long — trim to 160 chars (currently ${metaDescLen})`,
    weight: 10,
    earned: descInRange ? 10 : 0,
  });

  // ── Featured image ────────────────────────────────────────────────────────
  const image = doc.featuredImage ?? doc.photo;
  const hasImage = !!(image && (image as { asset?: unknown }).asset);
  const hasAlt = !!(doc.featuredImage?.alt?.trim());
  const imageNotApplicable = doc._type === "homePage" || doc._type === "servicePage";

  if (!imageNotApplicable) {
    checks.push({
      key: "image_present",
      label: "Featured image",
      status: hasImage ? "pass" : "warn",
      message: hasImage ? "Present" : "No featured image set",
      weight: 15,
      earned: hasImage ? 15 : 0,
    });
    checks.push({
      key: "image_alt",
      label: "Image alt text",
      status: !hasImage ? "fail" : hasAlt ? "pass" : "warn",
      message: !hasImage
        ? "No image to check"
        : hasAlt
        ? "Alt text present"
        : "Missing alt text on featured image",
      weight: 10,
      earned: hasAlt ? 10 : 0,
    });
  }

  // ── Slug ──────────────────────────────────────────────────────────────────
  const isHomePage = doc._type === "homePage";
  const hasSlug = isHomePage || !!doc.slug?.current?.trim();
  checks.push({
    key: "slug",
    label: "URL slug",
    status: hasSlug ? "pass" : "fail",
    message: isHomePage ? "/ (homepage root)" : hasSlug ? `/${doc.slug!.current}` : "No slug set",
    weight: 5,
    earned: hasSlug ? 5 : 0,
  });

  // ── Excerpt / summary ─────────────────────────────────────────────────────
  const hasExcerpt = !!(doc.excerpt?.trim() || doc.summary?.trim() || doc.heroSubheadline?.trim());
  checks.push({
    key: "excerpt",
    label: "Excerpt / summary",
    status: hasExcerpt ? "pass" : "warn",
    message: hasExcerpt ? "Present" : "No excerpt or summary set",
    weight: 10,
    earned: hasExcerpt ? 10 : 0,
  });

  const total = checks.reduce((sum, c) => sum + c.earned, 0);
  const grade: SeoScore["grade"] = total >= 80 ? "good" : total >= 50 ? "ok" : "poor";

  return { total, checks, grade };
}

export function gradeColor(grade: SeoScore["grade"]): string {
  return grade === "good" ? "#10b981" : grade === "ok" ? "#f59e0b" : "#ef4444";
}
