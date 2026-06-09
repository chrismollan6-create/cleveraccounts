import { defineField } from "sanity";

/**
 * Shared "Brand" selector for any content type that can differ between
 * Clever Accounts and Workwell Accountancy.
 *
 * - "shared" (default)  → the document shows on BOTH brands. Use this for
 *   evergreen content that doesn't need brand-specific wording.
 * - "clever" / "workwell" → the document only shows on that brand, and (for
 *   singletons / slug lookups) overrides the shared version for that brand.
 *
 * Pre-existing documents have no `brand` field at all — the GROQ queries treat
 * a missing value the same as "shared", so nothing breaks when this is added.
 *
 * Returns a fresh field each call so the same definition isn't shared by
 * reference across multiple schemas.
 */
export const brandField = () =>
  defineField({
    name: "brand",
    title: "Brand",
    type: "string",
    description:
      "Which brand this content is for. 'Shared' shows on both Clever and Workwell. Pick a specific brand to override the shared version for that brand only.",
    options: {
      list: [
        { title: "Shared (both brands)", value: "shared" },
        { title: "Clever Accounts", value: "clever" },
        { title: "Workwell Accountancy", value: "workwell" },
      ],
      layout: "radio",
    },
    initialValue: "shared",
  });
