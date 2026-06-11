/**
 * One-off internal-review export: emit a Word doc per permutation of the
 * expenses guide (brand × variant × sector × prior-accountant). Run with:
 *
 *   npx tsx scripts/export-expenses-guide-docs.ts
 *
 * Output → ./expenses-guide-docs/
 */

import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from 'docx';

import {
  GOLDEN_RULE,
  EVERYDAY_ESSENTIALS,
  LTD_EXTRAS,
  CONTRACTOR_ITEMS,
  TRAVEL_ITEMS,
  GREY_AREAS,
  RECORD_KEEPING,
  PRIOR_ACCOUNTANT_CALLOUT,
  getAmendmentWindow,
  getMissedItems,
  getLearnItems,
  getHomeOfficeContent,
  getSectorBlock,
  variantIntro,
  buildSampleData,
  type ExpensesGuideBrandId,
  type ExpensesVariant,
  type ExpensesSector,
  type ExpensesGuideData,
} from '../src/content/expenses-guide';

const BRANDS: ExpensesGuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: ExpensesVariant[] = ['ltd', 'sole'];
const SECTORS: ExpensesSector[] = [
  'general', 'cis', 'medical', 'creative', 'transport', 'hospitality', 'retail', 'consulting',
];
const PRIORS = [false, true];

const VARIANT_LABEL: Record<ExpensesVariant, string> = {
  ltd: 'Limited Company',
  sole: 'Sole Trader',
};
const SECTOR_LABEL: Record<ExpensesSector, string> = {
  general: 'General',
  cis: 'CIS / Construction',
  medical: 'Medical / Healthcare',
  creative: 'Creative / Tech',
  transport: 'Transport & Logistics',
  hospitality: 'Hospitality & Food',
  retail: 'Retail & E-commerce',
  consulting: 'Consulting',
};
const BRAND_LABEL: Record<ExpensesGuideBrandId, string> = {
  clever: 'Clever Accounts',
  workwell: 'Workwell',
};

// ─────────────────────────────────────────────────────────────────────────
// Paragraph helpers
// ─────────────────────────────────────────────────────────────────────────

const p = (text: string) => new Paragraph({ children: [new TextRun(text)] });

const heading = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]) =>
  new Paragraph({ text, heading: level });

const h1 = (text: string) => heading(text, HeadingLevel.HEADING_1);
const h2 = (text: string) => heading(text, HeadingLevel.HEADING_2);
const h3 = (text: string) => heading(text, HeadingLevel.HEADING_3);

const meta = (label: string, value: string) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value, italics: true }),
    ],
  });

const blank = () => new Paragraph({ children: [] });

// ─────────────────────────────────────────────────────────────────────────
// Build the document for a single permutation
// ─────────────────────────────────────────────────────────────────────────

function buildSections(d: ExpensesGuideData): Paragraph[] {
  const out: Paragraph[] = [];

  // Title page
  out.push(
    new Paragraph({
      text: 'Expenses Guide',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
  );
  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${BRAND_LABEL[d.brandId]} · ${VARIANT_LABEL[d.variant]}${d.clientType ? ` · ${d.clientType}` : ''} · ${SECTOR_LABEL[d.sector ?? 'general']}${d.priorAccountant ? ' · Switcher' : ''}`,
          italics: true,
        }),
      ],
    }),
  );
  out.push(blank());

  // Intro
  out.push(p(variantIntro(d)));
  out.push(blank());

  // Prior-accountant callout (appears near top in the PDF)
  if (d.priorAccountant) {
    out.push(h3(PRIOR_ACCOUNTANT_CALLOUT.title));
    out.push(p(PRIOR_ACCOUNTANT_CALLOUT.body));
    out.push(blank());
  }

  // Golden rule
  out.push(h3(GOLDEN_RULE.title));
  out.push(p(GOLDEN_RULE.body));
  out.push(blank());

  // 01 — Everyday essentials
  out.push(h1('01 — Everyday essentials'));
  for (const item of EVERYDAY_ESSENTIALS) {
    out.push(h2(item.title));
    if (item.stat) out.push(meta('Stat', item.stat));
    if (item.badge) out.push(meta('Badge', item.badge));
    out.push(p(item.body));
    if (item.learnSlug) out.push(meta('Learn', item.learnSlug));
    out.push(blank());
  }

  // 02 — Working from home
  out.push(h1('02 — Working from home'));
  const home = getHomeOfficeContent(d);
  out.push(h2(home.fixedRate.title));
  out.push(p(home.fixedRate.body));
  out.push(blank());
  out.push(h2(home.actualCosts.title));
  out.push(p(home.actualCosts.body));
  out.push(blank());
  if (home.ltdNote) {
    out.push(h2(home.ltdNote.title));
    out.push(p(home.ltdNote.body));
    out.push(blank());
  }
  out.push(h2('CGT warning'));
  out.push(p(home.warning));
  out.push(blank());

  // 03 — Travel & subsistence
  out.push(h1('03 — Travel & subsistence'));
  for (const item of TRAVEL_ITEMS) {
    out.push(h2(item.title));
    out.push(p(item.body));
    out.push(blank());
  }

  // 04 — Limited company extras
  if (d.variant === 'ltd') {
    out.push(h1('04 — Limited company extras'));
    for (const item of LTD_EXTRAS) {
      out.push(h2(item.title));
      out.push(p(item.body));
      out.push(blank());
    }
  }

  // 05 — Contractor focus
  if (d.clientType === 'PSC') {
    out.push(h1('05 — Contractor focus (PSC)'));
    for (const item of CONTRACTOR_ITEMS) {
      out.push(h2(item.title));
      out.push(p(item.body));
      out.push(blank());
    }
  }

  // 06 — Sector specifics
  const sectorBlock = getSectorBlock(d.sector ?? 'general');
  if (sectorBlock) {
    out.push(h1(`06 — ${sectorBlock.heading}`));
    out.push(p(sectorBlock.intro));
    out.push(blank());
    for (const item of sectorBlock.items) {
      out.push(h2(item.title));
      out.push(p(item.body));
      out.push(blank());
    }
  }

  // 07 — Grey areas
  out.push(h1('07 — Grey areas: what you generally cannot claim'));
  for (const item of GREY_AREAS) {
    out.push(h2(item.title));
    out.push(p(item.body));
    out.push(blank());
  }

  // 08 — Record-keeping
  out.push(h1('08 — Record-keeping'));
  for (const item of RECORD_KEEPING) {
    out.push(h2(item.title));
    out.push(p(item.body));
    out.push(blank());
  }

  // Prior-accountant — amendment window + missed items
  if (d.priorAccountant) {
    out.push(h1('Prior accountant — switcher review'));
    out.push(h2('Amendment window'));
    out.push(p(getAmendmentWindow(d.variant)));
    out.push(blank());
    out.push(h2('Commonly missed items we will review'));
    for (const item of getMissedItems(d)) {
      out.push(h3(item.title));
      out.push(p(item.body));
      out.push(blank());
    }
  }

  // Learn more
  out.push(h1('Learn more'));
  for (const item of getLearnItems(d)) {
    out.push(h2(item.title));
    out.push(p(item.blurb));
    out.push(meta('Link', item.slug));
    out.push(blank());
  }

  return out;
}

function filename(
  brand: ExpensesGuideBrandId,
  variant: ExpensesVariant,
  clientType: string | undefined,
  sector: ExpensesSector,
  prior: boolean,
): string {
  const parts = [brand, variant];
  if (clientType) parts.push(clientType.toLowerCase());
  parts.push(sector);
  if (prior) parts.push('switcher');
  return parts.join('-') + '.docx';
}

// ─────────────────────────────────────────────────────────────────────────
// Drive the matrix
// ─────────────────────────────────────────────────────────────────────────

async function main() {
  const outDir = join(process.cwd(), 'expenses-guide-docs');
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  let count = 0;
  for (const brand of BRANDS) {
    for (const variant of VARIANTS) {
      const clientType = variant === 'ltd' ? 'PSC' : undefined;
      for (const sector of SECTORS) {
        for (const prior of PRIORS) {
          const data = buildSampleData(brand, variant, clientType, sector, prior);
          const doc = new Document({
            creator: 'Clever Accounts',
            title: 'Expenses Guide',
            sections: [{ children: buildSections(data) }],
          });
          const buf = await Packer.toBuffer(doc);
          const fname = filename(brand, variant, clientType, sector, prior);
          writeFileSync(join(outDir, fname), buf);
          count++;
        }
      }
    }
  }
  console.log(`Wrote ${count} files to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
