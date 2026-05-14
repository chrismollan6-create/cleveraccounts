/**
 * Engagement Letter content — public entry point.
 *
 * Assembles the standard terms (shared) + variant-specific Schedule of Services
 * + complaints procedure into a single rendered letter, resolves mail-merge
 * tokens, and computes the canonical SHA-256 document hash that gets stored on
 * the signed Engagement_Letter__c record.
 *
 * Crucially, the hash is computed from JSON of the *merged* sections — i.e.
 * with the actual signer's joining date / jurisdiction / business name baked in.
 * This means the hash uniquely identifies "this exact text shown to this signer".
 */

import type {
  Jurisdiction,
  MergeContext,
  RenderedLetter,
  Section,
  SectionGroup,
  VariantId,
  VariantManifest,
} from './types';

import { STANDARD_TERMS } from './shared/standard-terms';
import { COMPLAINTS_PROCEDURE } from './shared/complaints-procedure';
import { SOLE_TRADER_SCHEDULE } from './variants/sole-trader-schedule';
import { LIMITED_COMPANY_SCHEDULE } from './variants/limited-company-schedule';

// =============================================================================
// VERSION REGISTRY
//
// IMPORTANT: bump the version string for a variant whenever its content changes.
// The version must be unique forever — never rewind. Apex stores the version
// the client signed against, and we may eventually pin a server-side hash
// allowlist per version (see EngagementLetterService.sign TODO).
// =============================================================================

// VERSION HISTORY
//   v2 (2026-05): pre-multi-tenant baseline
//   v3 (2026-05-09): introduced {{brandName}}, {{brandLegalName}},
//                    {{brandPrivacyUrl}} mail-merge tokens — body content is
//                    now brand-aware, so previous SHA hashes for Clever
//                    Accounts letters won't match. Existing signed letters
//                    keep their v2 hash forever (legally archived); only
//                    NEW signings use v3.
export const VERSIONS: Record<VariantId, string> = {
  'sole-trader': 'sole-trader-2026-05-v3',
  'limited-company': 'limited-company-2026-05-v3',
};

// =============================================================================
// VARIANT TITLES
// =============================================================================

const TITLES: Record<VariantId, string> = {
  'sole-trader': 'Sole Trader Accountancy Services',
  'limited-company': 'Limited Company Accountancy Services',
};

// =============================================================================
// MAIL-MERGE
// =============================================================================

/**
 * Replaces all {{token}} occurrences in a string with values from the context.
 * Throws if any token remains unresolved — so a missing context key causes a
 * hard build/runtime failure rather than a silent legal-document defect.
 */
export function mergeTokens(input: string, ctx: MergeContext): string {
  const tokenMap: Record<string, string> = {
    joiningDate: formatJoiningDate(ctx.joiningDate),
    jurisdiction: ctx.jurisdiction,
    businessName: ctx.businessName,
    firstName: ctx.firstName,
    lastName: ctx.lastName,
    phoneNumber: ctx.phoneNumber,
    supportEmail: ctx.supportEmail,
    brandName: ctx.brandName,
    brandLegalName: ctx.brandLegalName,
    brandPrivacyUrl: ctx.brandPrivacyUrl,
    brandPostalAddress: ctx.brandPostalAddress,
  };

  const out = input.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = tokenMap[key];
    if (value === undefined || value === '') {
      throw new Error(
        `Unresolved engagement-letter mail-merge token: {{${key}}}. Context: ${JSON.stringify(
          ctx,
        )}`,
      );
    }
    return value;
  });

  // Defensive: shouldn't be possible after the throw above, but belt-and-braces.
  if (out.includes('{{')) {
    throw new Error(`Engagement letter still contains unresolved tokens after merge: ${out.slice(0, 200)}`);
  }

  return out;
}

/**
 * "2026-05-08" → "8 May 2026" — the form readers actually expect on a contract.
 */
function formatJoiningDate(iso: string): string {
  // Accept yyyy-mm-dd or full ISO datetime
  const dateOnly = iso.slice(0, 10);
  const [y, m, d] = dateOnly.split('-').map(Number);
  if (!y || !m || !d) return iso; // fall back to whatever we got
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function mergeSection(s: Section, ctx: MergeContext): Section {
  return {
    id: s.id,
    number: s.number,
    title: mergeTokens(s.title, ctx),
    body: mergeTokens(s.body, ctx),
  };
}

// =============================================================================
// VARIANT ASSEMBLY
// =============================================================================

function variantSchedule(variant: VariantId): Section[] {
  switch (variant) {
    case 'sole-trader':
      return SOLE_TRADER_SCHEDULE;
    case 'limited-company':
      return LIMITED_COMPANY_SCHEDULE;
  }
}

/** Filter out sections marked with a different variantOnly than requested. */
function applyVariantFilter(sections: Section[], variant: VariantId): Section[] {
  return sections.filter((s) => !s.variantOnly || s.variantOnly === variant);
}

export function getManifest(variant: VariantId): VariantManifest {
  return {
    id: variant,
    version: VERSIONS[variant],
    title: TITLES[variant],
    sectionGroups: [
      { heading: 'Standard Terms', sections: applyVariantFilter(STANDARD_TERMS, variant) },
      { heading: 'Schedule of Services', sections: applyVariantFilter(variantSchedule(variant), variant) },
      { heading: 'Complaints Procedure', sections: applyVariantFilter(COMPLAINTS_PROCEDURE, variant) },
    ],
  };
}

// =============================================================================
// RENDER + HASH
// =============================================================================

/**
 * Assembles the variant for a specific signer, resolving all mail-merge tokens
 * and computing the document hash. This is what the page actually displays —
 * the returned `groups` are post-merge so unresolved tokens are impossible.
 */
export async function renderLetter(
  variant: VariantId,
  ctx: MergeContext,
): Promise<RenderedLetter> {
  const manifest = getManifest(variant);
  const groups: SectionGroup[] = manifest.sectionGroups.map((g) => ({
    heading: g.heading,
    sections: g.sections.map((s) => mergeSection(s, ctx)),
  }));

  const documentSha256 = await canonicalHash(groups);

  return {
    variant,
    version: manifest.version,
    title: manifest.title,
    groups,
    documentSha256,
  };
}

/**
 * Canonical hash of the rendered, merged letter. Stable across signers as long
 * as the input merge context produces identical text.
 *
 * Canonical form: a JSON serialisation that is order-stable and key-stable so
 * the same logical content always hashes to the same digest.
 */
export async function canonicalHash(groups: SectionGroup[]): Promise<string> {
  const canonical = JSON.stringify(
    groups.map((g) => ({
      heading: g.heading,
      sections: g.sections.map((s) => ({
        id: s.id,
        number: s.number,
        title: s.title,
        body: s.body,
      })),
    })),
  );

  const data = new TextEncoder().encode(canonical);

  // Web Crypto is available both in modern browsers and in Node 16+ via globalThis.crypto.
  const subtle =
    (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API unavailable — cannot compute document hash');
  }

  const hashBuffer = await subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export type { Section, SectionGroup, VariantId, VariantManifest, MergeContext, RenderedLetter, Jurisdiction };
