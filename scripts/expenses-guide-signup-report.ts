/**
 * expenses-guide-signup-report — READ-ONLY analysis harness.
 *
 * Reads a CSV export of recent signups (Account: Id, Name, Branding__c,
 * Client_type__c, Sector__c, Type, Previous_Accountant__c) and maps each row to
 * the axes the expenses guide renders on (brand / variant / clientType / sector /
 * priorAccountant). Prints the real permutation distribution, how many fall to
 * the generic 'general' guide (no sector block), any unmapped sector labels, and
 * a shortlist of real clients with a preview URL for each.
 *
 * NOTHING is sent. Usage:  npx tsx scripts/expenses-guide-signup-report.ts <csv>
 */

import { readFileSync } from 'node:fs';
import type {
  ExpensesGuideBrandId,
  ExpensesVariant,
  ExpensesSector,
} from '../src/content/expenses-guide';

// ── Sector label (Sector__c free text, SIC-backfilled) → guide enum ──────────
// Only 8 enum sectors have a bespoke block; everything else → 'general'.
const SECTOR_LABEL_TO_ENUM: Record<string, ExpensesSector> = {};
const add = (sector: ExpensesSector, labels: string[]) =>
  labels.forEach((l) => (SECTOR_LABEL_TO_ENUM[l.toLowerCase()] = sector));

add('cis', [
  'Building & General Contractor', 'CIS Contractor / Subcontractor', 'Electrical',
  'Carpentry & Joinery', 'Decorating & Painting', 'Landscaping & Gardening',
  'Tree Surgery & Arborist', 'Heating & Plumbing', 'Woodworking & Crafts',
  'Groundworks', 'Insulation', 'Glazing & Windows', 'Drainage & Sewage',
  'Fencing & Gates', 'Air Conditioning & Refrigeration', 'Handyman Services',
  'Kitchen & Bathroom Fitting', 'Scaffolding', 'Roofing', 'Bricklaying',
  'Plastering', 'Tiling', 'Flooring',
]);
add('consulting', [
  'Consulting & Management Consulting', 'Engineering Consulting', 'HR & Recruitment',
  'Marketing & PR', 'Digital Marketing & SEO', 'Project Management',
  'Training & Coaching', 'Training Provider', 'Environmental & Sustainability',
  'Life Coaching', 'Accountancy & Bookkeeping', 'Legal Services / Solicitor',
  'Mortgage Broker', 'Data Science & Analytics', 'Financial Advice & Planning',
  'Research & Analysis', 'Business Consulting',
]);
add('creative', [
  'IT Contracting', 'Software Development', 'IT Support',
  'Advertising & Creative Agency', 'Graphic & Web Design',
  'Content Creation & Influencer', 'Architecture', 'Art & Illustration',
  'Cybersecurity', 'Printmaking', 'UX & UI Design', 'Film & TV Production',
  'Photography', 'Wedding Photography & Videography', 'Music & Audio Production',
  'Journalism & Writing', 'Musician & Performer', 'DJ & Live Entertainment',
  'Acting & Entertainment',
]);
add('medical', [
  'Nursing & Care', 'Healthcare & NHS', 'Dentistry',
  'Chiropractic & Osteopathy', 'Veterinary', 'Physiotherapy', 'Optician',
  'Pharmacy',
]);
add('retail', [
  'Reselling & Vintage', 'E-commerce & Online Retail', 'Online Retail',
  'Retail Shop', 'Export & Import',
]);
add('transport', [
  'Courier & Delivery', 'Taxi & Private Hire', 'Automotive & Mechanics',
  'Removal Services', 'Freight & Haulage', 'Logistics',
]);
add('hospitality', [
  'Catering & Food', 'Bar & Pub', 'Coffee Shop & Café', 'Restaurant',
  'Street Food', 'Bakery', 'Food & Beverage Production', 'Food Producer',
  'Takeaway & Delivery',
]);
add('property', [
  'Property Development', 'Property Management', 'Property Sourcing',
  'Buy-to-Let Landlord', 'Commercial Property', 'Estate Agent',
]);
add('beauty', [
  'Hairdressing', 'Hair & Beauty', 'Aesthetics & Cosmetic Treatments',
  'Nail Technician', 'Barbering', 'Animal Grooming',
]);

function variantFromType(type: string): ExpensesVariant | null {
  if (type === 'Limited Company') return 'ltd';
  if (type === 'Sole Trader') return 'sole';
  // Type = 'CIS' is intentionally excluded — CIS clients are not sent the
  // expenses guide (they have their own onboarding path), mirroring the
  // suppression in AccountantIntroEmailBatch.
  return null; // CIS / junk / unknown → skipped
}

function sectorFor(sectorC: string): { sector: ExpensesSector; unmapped: boolean } {
  const key = (sectorC || '').trim().toLowerCase();
  if (!key) return { sector: 'general', unmapped: false }; // genuinely blank
  const mapped = SECTOR_LABEL_TO_ENUM[key];
  return mapped ? { sector: mapped, unmapped: false } : { sector: 'general', unmapped: true };
}

function brandFrom(b: string): ExpensesGuideBrandId {
  return /workwell/i.test(b) ? 'workwell' : 'clever';
}

// ── minimal CSV parser (handles quoted fields) ───────────────────────────────
function parseCsv(text: string): Record<string, string>[] {
  text = text.replace(/^﻿/, ''); // strip BOM (PowerShell utf8 export)
  const rows: string[][] = [];
  let cur: string[] = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { cur.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      if (field !== '' || cur.length) { cur.push(field); rows.push(cur); cur = []; field = ''; }
    } else field += c;
  }
  if (field !== '' || cur.length) { cur.push(field); rows.push(cur); }
  const header = rows.shift()!;
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

// ── run ──────────────────────────────────────────────────────────────────────
const csvPath = process.argv[2];
if (!csvPath) { console.error('Usage: tsx scripts/expenses-guide-signup-report.ts <csv>'); process.exit(1); }
const rows = parseCsv(readFileSync(csvPath, 'utf8')).filter((r) => r.Id);

const byVariant: Record<string, number> = {};
const bySector: Record<string, number> = {};
const byBrand: Record<string, number> = {};
const combo: Record<string, number> = {};
const unmappedLabels: Record<string, number> = {};
let psc = 0, prior = 0, general = 0, skipped = 0;
const samples: Record<string, { name: string; url: string }> = {};
const generalLabels: Record<string, number> = {}; // raw Sector__c of rows that fell to 'general'

// thematic rollup of the general bucket — candidates for new sector blocks
const THEME: Record<string, string> = {};
const theme = (t: string, labels: string[]) => labels.forEach((l) => (THEME[l.toLowerCase()] = t));
theme('Property / landlord', ['Property Development', 'Property Management', 'Property Sourcing', 'Buy-to-Let Landlord', 'Commercial Property', 'Estate Agent', 'Mortgage Broker']);
theme('Personal care / beauty', ['Hairdressing', 'Hair & Beauty', 'Aesthetics & Cosmetic Treatments', 'Nail Technician', 'Barbering', 'Animal Grooming']);
theme('Education / childcare', ['Private Tutoring', 'Childcare & Nursery', 'Education & Teaching']);
theme('Fitness / wellbeing', ['Gym & Fitness Classes', 'Personal Trainer', 'Tennis Coach', 'Life Coaching']);
theme('Events', ['Event Management']);
theme('Other — not listed', ['Other — not listed']);

for (const r of rows) {
  const variant = variantFromType(r.Type);
  if (!variant) { skipped++; continue; }
  const brand = brandFrom(r.Branding__c);
  const { sector, unmapped } = sectorFor(r.Sector__c);
  if (unmapped) unmappedLabels[r.Sector__c] = (unmappedLabels[r.Sector__c] ?? 0) + 1;
  const isPsc = variant === 'ltd' && /^(psc|contractor)$/i.test(r.Client_type__c);
  const isPrior = /^true$/i.test(r.Previous_Accountant__c);
  if (sector === 'general') { general++; generalLabels[(r.Sector__c || '').trim() || '(blank)'] = (generalLabels[(r.Sector__c || '').trim() || '(blank)'] ?? 0) + 1; }
  if (isPsc) psc++;
  if (isPrior) prior++;

  byVariant[variant] = (byVariant[variant] ?? 0) + 1;
  bySector[sector] = (bySector[sector] ?? 0) + 1;
  byBrand[brand] = (byBrand[brand] ?? 0) + 1;
  const key = `${brand} · ${variant}${isPsc ? '·PSC' : ''} · ${sector}${isPrior ? ' · switcher' : ''}`;
  combo[key] = (combo[key] ?? 0) + 1;

  // keep one real example per (variant × sector) for a preview shortlist
  const sKey = `${variant}|${sector}|${isPsc}`;
  if (!samples[sKey]) {
    const ct = isPsc ? 'PSC' : variant === 'ltd' ? '' : '';
    const url = `/expenses-guide/preview?brand=${brand}&variant=${variant}&clientType=${ct}&sector=${sector}${isPrior ? '&prior=1' : ''}`;
    samples[sKey] = { name: r.Name, url };
  }
}

const total = rows.length - skipped;
const pct = (n: number) => `${((n / total) * 100).toFixed(0)}%`;
const sortDesc = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1]);

console.log(`\n=== ${total} addressable signups (${skipped} excluded: CIS + junk/unknown Type) ===\n`);
console.log('VARIANT:'); sortDesc(byVariant).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${pct(n)}  ${k}`));
console.log('\nBRAND:'); sortDesc(byBrand).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${pct(n)}  ${k}`));
console.log(`\nSECTOR (→ 'general' = generic guide, no sector block):`);
sortDesc(bySector).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${pct(n)}  ${k}`));
console.log(`\n  PSC (contractor section):   ${psc}  ${pct(psc)}`);
console.log(`  Switcher (prior accountant): ${prior}  ${pct(prior)}`);
console.log(`  → GENERAL (no sector block): ${general}  ${pct(general)}`);

const gp = (n: number) => `${((n / general) * 100).toFixed(0)}% of general`;
console.log(`\n=== GENERAL bucket (${general}) — underlying sector spread ===`);
sortDesc(generalLabels).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${gp(n)}  ${k}`));

const themeRoll: Record<string, number> = {};
for (const [label, n] of Object.entries(generalLabels)) {
  const t = label === '(blank)' ? '(blank — no sector captured)' : (THEME[label.toLowerCase()] ?? 'Misc single labels');
  themeRoll[t] = (themeRoll[t] ?? 0) + n;
}
console.log(`\nGENERAL bucket — thematic rollup (candidate new blocks):`);
sortDesc(themeRoll).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${gp(n)}  ${k}`));

console.log(`\nUNMAPPED sector labels (non-blank → fell through to 'general'):`);
sortDesc(unmappedLabels).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${k}`));

console.log(`\nTOP 15 real permutations:`);
sortDesc(combo).slice(0, 15).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${pct(n)}  ${k}`));

console.log(`\nPREVIEW URLs — one real client per (variant × sector) shape:`);
Object.entries(samples).forEach(([, s]) => console.log(`  ${s.name}\n    ${s.url}`));
console.log('');
