/**
 * Types for the engagement letter content modules.
 *
 * The canonical structure: an array of Section objects. The id+number+title+body
 * tuple of every section in the rendered, merged-token-resolved letter is what
 * gets SHA-256 hashed. This hash is stored on the Engagement_Letter__c record
 * and forms part of the legal evidence of "exactly what was signed".
 *
 * Mail-merge tokens use {{tokenName}} syntax. They are resolved at render time
 * from a MergeContext built from the Salesforce-side data (signer, business,
 * jurisdiction, joining date). After resolution the body contains zero tokens —
 * any unresolved token is a bug and the page will refuse to display.
 */

export type VariantId = 'sole-trader' | 'limited-company';

export type Jurisdiction = 'England and Wales' | 'Scotland' | 'Northern Ireland';

export interface Section {
  /** Stable id used in canonical hashing; changing it invalidates older signatures. */
  id: string;
  /** Display number, e.g. "1", "13", "Schedule" or "Complaints". */
  number: string;
  /** Section heading. */
  title: string;
  /** Body text in lightweight markdown — paragraphs separated by `\n\n`, bullets as `- `. */
  body: string;
  /**
   * If set, this section only renders for the named variant. Used for §3
   * "Who are we acting for?" which has different wording for sole traders
   * (acting for "you and your business") vs limited companies (acting for
   * "you and your company").
   */
  variantOnly?: VariantId;
}

export interface VariantManifest {
  id: VariantId;
  /** Version constant — changes whenever the template text changes (cleanups don't count). */
  version: string;
  /** Display title at the top of the letter, e.g. "Sole Trader Accountancy Services". */
  title: string;
  /** Standard terms sections 1-15 (shared) + this variant's Schedule of Services + complaints. */
  sectionGroups: SectionGroup[];
}

export interface SectionGroup {
  /** Group heading, e.g. "Standard Terms", "Schedule of Services", "Complaints Procedure". */
  heading: string;
  sections: Section[];
}

/**
 * Variables resolved into mail-merge tokens at render time.
 * Sourced from the Salesforce DTO returned by /api/engagement-letter.
 */
export interface MergeContext {
  /** ISO yyyy-mm-dd date the engagement begins (= parent record CreatedDate). */
  joiningDate: string;
  /** Resolved single jurisdiction — never "X / Y / Z". */
  jurisdiction: Jurisdiction;
  /** The client's business name (Lead.Company or Account.Name). */
  businessName: string;
  /** Signer's first name. */
  firstName: string;
  /** Signer's last name. */
  lastName: string;
  /** Clever Accounts contact line for §13 Quality of Service. */
  phoneNumber: string;
  /** Clever Accounts support inbox. */
  supportEmail: string;
}

/** Shape returned by getLetter(variant, ctx) — already merged + ready to render. */
export interface RenderedLetter {
  variant: VariantId;
  version: string;
  title: string;
  groups: SectionGroup[];
  /** SHA-256 hex digest of the canonical JSON of the merged sections. */
  documentSha256: string;
}
