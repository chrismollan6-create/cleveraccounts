/**
 * Expenses Guide — content + data model.
 *
 * A standalone PDF sent to clients alongside (or after) their welcome pack.
 * Content is dynamic on four axes:
 *   • variant    — Limited Company vs Sole Trader
 *   • clientType — 'PSC' surfaces the contractor / 24-month-rule section
 *   • sector     — 'cis' | 'medical' | 'creative' | 'general' for sector specifics
 *   • brandId    — clever | workwell (colour palette, domain, learn-centre links)
 */

import { BRANDS } from '@/lib/constants';

export type ExpensesGuideBrandId = 'clever' | 'workwell';
export type ExpensesVariant = 'ltd' | 'sole';
export type ExpensesSector =
  | 'cis'
  | 'medical'
  | 'creative'
  | 'transport'
  | 'hospitality'
  | 'retail'
  | 'consulting'
  | 'general';

export type EssentialIconKey =
  | 'home'
  | 'car'
  | 'phone'
  | 'supplies'
  | 'software'
  | 'subscriptions'
  | 'training'
  | 'bank'
  | 'advertising'
  | 'insurance';

export type GreyIconKey = 'entertaining' | 'clothing' | 'commute' | 'fines' | 'food';
export type RecordIconKey = 'receipts' | 'mileage' | 'bank' | 'freeagent';

export interface ExpensesGuideData {
  brandId: ExpensesGuideBrandId;
  brandName: string;
  variant: ExpensesVariant;
  clientFirstName: string;
  companyName: string;
  accountant: { name: string; email: string; phone: string };
  support: { email: string; phone: string };
  /** 'PSC' triggers the contractor / 24-month rule section */
  clientType?: string;
  /** Determines which sector-specific block is shown */
  sector?: ExpensesSector;
}

// ─────────────────────────────────────────────────────────────────────────
// Introduction — the golden rule
// ─────────────────────────────────────────────────────────────────────────

export const GOLDEN_RULE = {
  title: "The HMRC test: 'wholly and exclusively'",
  body:
    "HMRC allows a deduction for any expense incurred 'wholly and exclusively for " +
    "the purposes of the trade or business'. If an expense has a personal element, " +
    "only the business proportion counts. When something sits in a grey area — ask " +
    "us before claiming, not after.",
};

export function variantIntro(d: ExpensesGuideData): string {
  if (d.variant === 'ltd') {
    return (
      `This guide sets out the expenses ${d.companyName} can put through the books — ` +
      "reducing the company's taxable profit and, by extension, its Corporation Tax bill. " +
      "Expenses must be 'wholly and exclusively for the purposes of the company's trade'. " +
      "Some of the biggest savings — home office, mileage, pension contributions, trivial " +
      "benefits — are the ones clients most often miss."
    );
  }
  return (
    `This guide covers the expenses you can deduct from your self-employment income — ` +
    "reducing the profit on which Income Tax and National Insurance are calculated. " +
    "As a sole trader, the 'wholly and exclusively' test applies to your business expenditure. " +
    "Many sole traders leave real money on the table by not claiming use-of-home or full " +
    "mileage allowances — this guide is here to change that."
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 01 — Everyday essentials (all variants)
// ─────────────────────────────────────────────────────────────────────────

export interface EssentialItem {
  iconKey: EssentialIconKey;
  title: string;
  body: string;
  /** Prominent figure shown below the title in brand colour */
  stat?: string;
  /** Small pill badge e.g. "Most missed", "Top saver" */
  badge?: string;
  learnSlug?: string;
}

export const EVERYDAY_ESSENTIALS: EssentialItem[] = [
  {
    iconKey: 'home',
    title: 'Use of home as office',
    stat: '£312/year minimum',
    badge: 'Most missed',
    body:
      'Claim £6/week (£312/year) with zero receipts needed. Or calculate the actual ' +
      'proportional cost of heating, electricity, mortgage interest and council tax ' +
      'for home workers. See Section 2 for the full breakdown of both methods.',
    learnSlug: '/learn/use-of-home-as-office',
  },
  {
    iconKey: 'car',
    title: 'Business mileage',
    stat: '55p per mile (2026/27)',
    badge: 'Top saver',
    body:
      'In your own car: 55p/mile for the first 10,000 business miles in 2026/27 (increased ' +
      'from 45p in April 2026), 25p/mile after that. Electric: 9p/mile fuel element. ' +
      'Motorbike: 24p/mile. Bicycle: 20p/mile. A mileage log is essential — see Section 5.',
    learnSlug: '/learn/mileage-and-travel-expenses',
  },
  {
    iconKey: 'phone',
    title: 'Phone & internet',
    stat: '50–80% business use',
    body:
      "Your personal phone and broadband used for business? Claim the business proportion — " +
      "50–80% is widely accepted for contractors and freelancers. A dedicated business " +
      "SIM or broadband line used only for work is 100% deductible with no apportionment needed.",
  },
  {
    iconKey: 'supplies',
    title: 'Office supplies & equipment',
    badge: '100% first-year relief',
    body:
      'Stationery, printer cartridges, paper, USB drives, filing equipment — all deductible. ' +
      'Laptops, monitors, printers and other hardware typically qualify for the Annual ' +
      'Investment Allowance, giving 100% tax relief in the year of purchase.',
  },
  {
    iconKey: 'software',
    title: 'Software & cloud tools',
    body:
      'Accounting software, project management tools (Notion, Asana), design tools, ' +
      'cloud storage (Dropbox, Google Workspace), video conferencing, antivirus — if ' +
      'the subscription is genuinely for business, it is fully deductible.',
  },
  {
    iconKey: 'subscriptions',
    title: 'Professional memberships',
    body:
      'Annual membership of trade bodies, professional institutes, or industry associations ' +
      'directly related to your trade. LinkedIn Premium (if used for business development), ' +
      'relevant journals, and trade publications. HMRC publishes an approved list.',
    learnSlug: '/learn/allowable-business-expenses',
  },
  {
    iconKey: 'training',
    title: 'Training & development',
    badge: 'Check first',
    body:
      'Courses, books, webinars, conferences — allowable when they update or improve your ' +
      'existing skills for the current trade. Key rule: training to enter a new profession ' +
      'from scratch is generally not deductible. Relevant CPD and accreditation courses: fully claimable.',
  },
  {
    iconKey: 'bank',
    title: 'Bank charges & professional fees',
    body:
      'Business bank account charges, overdraft interest, business credit card interest. ' +
      'Accountancy and bookkeeping fees (yes, what you pay us). Relevant legal fees — ' +
      'contract reviews, employment advice, lease negotiations.',
  },
  {
    iconKey: 'advertising',
    title: 'Advertising & marketing',
    body:
      'Website hosting and development, Google/Meta ads, print materials, business cards, ' +
      'brochures, social media marketing. Domain name registration. Photography used ' +
      'for marketing purposes.',
  },
  {
    iconKey: 'insurance',
    title: 'Business insurance',
    body:
      'Premiums for Professional Indemnity, Public Liability, and Employers\' Liability ' +
      '(legally required once you employ staff) are fully deductible. Cyber liability, ' +
      'business interruption, and contents cover for business property: also deductible.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section 02 — Working from home (all variants, but calculation differs)
// ─────────────────────────────────────────────────────────────────────────

export function getHomeOfficeContent(d: ExpensesGuideData): {
  fixedRate: { title: string; body: string };
  actualCosts: { title: string; body: string };
  ltdNote?: { title: string; body: string };
  warning: string;
} {
  const fixedRate = {
    title: 'Method A — Fixed rate (no receipts needed)',
    body:
      'HMRC allows £6/week (£312/year) for any week you work from home. No receipts, ' +
      'no proportional calculations, no risk to your Principal Private Residence relief. ' +
      'Claim it on your Self Assessment or as a company reimbursement — it is the simplest ' +
      'win on the list. For sole traders who work from home part-time, HMRC\'s simplified ' +
      'rate is £10/month (25–50 hrs), £18/month (51–100 hrs), or £26/month (101+ hrs).',
  };

  const actualCosts = {
    title: 'Method B — Actual costs (higher claim, more documentation)',
    body:
      'Calculate the business proportion of your household costs: electricity, gas, ' +
      'broadband (less any business-specific allocation), mortgage interest (not capital ' +
      'repayment), council tax' +
      (d.variant === 'sole' ? '' : ' (sole traders only)') +
      ', and buildings/contents insurance. ' +
      'The typical formula: (rooms used for business work / total rooms in the house) × ' +
      '(hours worked at home / total available hours). For example: one dedicated study ' +
      'in a 5-room house, 40 hours a week from home out of 168 hours available = roughly ' +
      '5% of total household costs. Keep utility bills and mortgage statements for 6 years.',
  };

  const ltdNote =
    d.variant === 'ltd'
      ? {
          title: "Ltd company directors — the licence-to-occupy route",
          body:
            "Your company can pay you rent (a 'licence to occupy') for using part of your " +
            "home as its office. This reduces the company's taxable profit while the income " +
            "in your hands is typically offset by the actual home costs attributable to that " +
            "use. It requires a simple written agreement and must reflect a commercial rate " +
            "for the space used. Ask your accountant to set this up properly — the tax saving " +
            "can be meaningful, but it needs documenting.",
        }
      : undefined;

  const warning =
    'CGT warning: if you designate a room exclusively and permanently as a business ' +
    'space and claim actual costs against it, HMRC may argue a proportion of any future ' +
    'house sale gain falls outside Private Residence Relief. The fixed-rate method avoids ' +
    'this risk entirely. For most home workers, the fixed rate is the right call.';

  return { fixedRate, actualCosts, ltdNote, warning };
}

// ─────────────────────────────────────────────────────────────────────────
// Section 03 — Travel & subsistence (all variants)
// ─────────────────────────────────────────────────────────────────────────

export interface TravelItem {
  title: string;
  body: string;
}

export const TRAVEL_ITEMS: TravelItem[] = [
  {
    title: 'Business travel vs commuting — the fundamental distinction',
    body:
      'Travel to a regular, permanent workplace is commuting — never deductible. ' +
      'If your company operates from your home address, travel to client sites is ' +
      'business travel and is fully deductible. If you rent an office or co-working ' +
      'space and go there daily, travel to it is commuting.',
  },
  {
    title: 'What counts as allowable travel',
    body:
      'Travel to client meetings, site visits, conferences, networking events, and ' +
      'training courses. Travel between two workplaces in the same working day. ' +
      'Airport transfers, rail travel, taxis, parking fees, the Congestion Charge, ' +
      'and road tolls — all allowable when the underlying journey is a business one.',
  },
  {
    title: 'Accommodation on overnight business trips',
    body:
      'Hotel, B&B, or Airbnb costs when you stay away from home overnight for business ' +
      'are fully deductible. Keep the receipts and note the business purpose.',
  },
  {
    title: 'Meals — the rules are tighter than most people think',
    body:
      'Meals on overnight business trips: claimable (you would not have incurred the ' +
      'cost at home). Meals during a normal working day: generally not claimable — ' +
      'HMRC treats these as private subsistence regardless of where you eat them. ' +
      'Meals provided as part of a conference or training event: claimable as part of ' +
      'the event cost.',
  },
  {
    title: 'Mileage rate summary (2026/27)',
    body:
      'Own car or van: 55p/mile for the first 10,000 business miles (increased from ' +
      '45p in April 2026), 25p/mile after that. Electric: 9p/mile fuel element; full ' +
      '55p AMAP applies. Motorbike: 24p/mile. Bicycle: 20p/mile. Business passengers: ' +
      '+5p/mile per person. Company-owned car: claim actual fuel costs instead of AMAP.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section 04 — Limited company extras (ltd only)
// ─────────────────────────────────────────────────────────────────────────

export interface LtdExtra {
  title: string;
  body: string;
}

export const LTD_EXTRAS: LtdExtra[] = [
  {
    title: 'Pension contributions — the most tax-efficient extraction',
    body:
      'When your company pays directly into your personal pension, it is a deductible ' +
      'company expense — reducing Corporation Tax. It does not appear on your P11D, so ' +
      'there is no PAYE or NI to pay on it. The annual allowance is currently £60,000 ' +
      '(or 100% of earnings, whichever is lower). Making a contribution before your ' +
      'year-end reduces this year\'s CT bill. Ask us to run the numbers before year-end.',
  },
  {
    title: 'Trivial benefits — £300/year of tax-free perks for directors',
    body:
      'You can give yourself non-cash gifts from the company up to £50 each, with a ' +
      'maximum of £300/year for directors of close companies (which almost all small ' +
      'Ltd companies are). Gifts must not be cash or a cash voucher, must not reward ' +
      'performance, and must not be in your contract. Use it for: birthday gifts, ' +
      'a restaurant meal, a bottle of wine, a book, a store voucher — anything under £50.',
  },
  {
    title: 'Staff entertaining at £150/head/year',
    body:
      'A Christmas party, summer event, or similar annual function open to all employees ' +
      'is allowable up to £150/head/year. Below that limit, it is both Corporation Tax ' +
      'deductible AND exempt from PAYE and NI for attendees. Note: if the event is above ' +
      '£150/head, the whole amount becomes taxable — not just the excess.',
  },
  {
    title: 'Annual Investment Allowance — 100% relief on capital purchases',
    body:
      'Equipment, machinery, computers, and office furniture bought for business use ' +
      'qualify for the Annual Investment Allowance — currently £1 million per year. This ' +
      'gives 100% tax relief in the year of purchase rather than depreciating over several ' +
      'years. Timing a major purchase just before year-end can materially reduce your CT bill.',
  },
  {
    title: 'Pre-trading expenses — reclaim up to seven years back',
    body:
      'Costs incurred up to seven years before the company started trading can be treated ' +
      'as if incurred on the first day of trading. Software licences, a laptop bought six ' +
      'months before incorporation, legal advice on setting up the company — all claimable. ' +
      'Keep the receipts and tell us what you spent.',
  },
  {
    title: 'Cycle to work scheme',
    body:
      'The company purchases a bicycle (and safety equipment) which you use for commuting ' +
      'or business travel. Because the asset belongs to the company, there is no benefit-in-kind ' +
      'if it is used primarily for business journeys. Employees can use salary sacrifice to ' +
      'benefit from a similar arrangement with zero NI cost.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section 05 — Contractor focus / PSC (shown when clientType === 'PSC')
// ─────────────────────────────────────────────────────────────────────────

export interface ContractorItem {
  title: string;
  body: string;
}

export const CONTRACTOR_ITEMS: ContractorItem[] = [
  {
    title: 'The 24-month rule — your most important read',
    body:
      'A workplace is "temporary" if you do not expect to work there for more than 24 ' +
      'months and you do not actually work there for more than 24 months continuously. ' +
      'Once a workplace becomes "permanent" in HMRC\'s eyes — because you have been ' +
      'there, or expect to be there, for 24+ months — travel to it becomes commuting. ' +
      'You cannot then deduct it. Critically, if you sign a 2-year contract from day ' +
      'one, the workplace was never temporary — and no travel has ever been claimable.',
  },
  {
    title: 'How the 24-month clock works in practice',
    body:
      'Renewals at the same physical site do not reset the clock — if you\'ve worked ' +
      'at Client X\'s Canary Wharf office for 20 months and renew for another year, ' +
      'you hit the limit at month 24. A genuine break of 6+ months (where you work ' +
      'elsewhere) resets it. Working at different sites for the same client may each ' +
      'be a different "workplace" — check this with your accountant when a new contract ' +
      'comes in. Working from home: if the company operates from your home address, ' +
      'any travel to a client site is business travel — there is no "permanent" client ' +
      'workplace to trigger the rule.',
  },
  {
    title: 'Inside IR35 — expenses change dramatically',
    body:
      'If a contract is inside IR35, HMRC treats the income as employment income. ' +
      'Travel and subsistence expenses that would normally be deductible are not — ' +
      'HMRC treats your travel to the client as commuting. You can still claim: ' +
      'business insurance premiums, professional subscriptions, training costs, and ' +
      'the use-of-home allowance. Ask us to review each inside-IR35 engagement ' +
      'separately — the expense picture is different each time.',
  },
  {
    title: 'Tools, equipment, and specialist software',
    body:
      'Equipment and software used specifically for contract work are fully deductible: ' +
      'laptops, specialist software licences (development IDEs, testing tools, design ' +
      'applications), test equipment, and peripherals. If any item has a personal-use ' +
      'element, claim only the business proportion.',
  },
  {
    title: 'Professional insurance (often a contract requirement)',
    body:
      'Many contracts — especially in the public sector and with large corporates — ' +
      'require Professional Indemnity and Public Liability cover before you can start ' +
      'work. These premiums are 100% deductible. Keep the policy documents in case of ' +
      'an HMRC enquiry.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section 06 — Sector-specific items
// ─────────────────────────────────────────────────────────────────────────

export interface SectorItem {
  title: string;
  body: string;
}

export interface SectorBlock {
  heading: string;
  intro: string;
  items: SectorItem[];
}

export function getSectorBlock(sector: ExpensesSector): SectorBlock | null {
  if (sector === 'general') return null;

  if (sector === 'cis') {
    return {
      heading: 'Construction & CIS — sector expenses',
      intro:
        'Working in construction under the Construction Industry Scheme comes with its ' +
        'own set of deductible costs — many of which are missed or under-claimed.',
      items: [
        {
          title: 'Workwear & PPE — the detail matters',
          body:
            'Hi-vis vests, hard hats, steel-toe-cap boots, gloves, harnesses, goggles, ' +
            'and overalls are fully deductible. The rule: it must be protective or ' +
            'specialist clothing. Timberland boots you wear anywhere else = not claimable. ' +
            'Steel-toe-cap safety boots you use only on site = fully claimable. Laundry ' +
            'costs for specialist workwear can also be claimed.',
        },
        {
          title: 'Tools & equipment',
          body:
            'Hand tools, power tools, levels, measuring equipment, and site safety kit ' +
            'are deductible costs. For major plant, the Annual Investment Allowance ' +
            '(100% first-year relief) typically applies. Tool insurance premiums are ' +
            'also fully deductible. If tools are stolen on site, the loss (less any ' +
            'insurance payout) is a deductible cost.',
        },
        {
          title: 'Materials',
          body:
            'Materials you purchase and incorporate into a project are a direct cost of ' +
            'sales — deductible in full. Keep purchase receipts and match them to the ' +
            'relevant jobs or invoices. If you re-sell materials with a markup, the ' +
            'purchase cost is still deductible; only the profit element is taxable.',
        },
        {
          title: 'Vehicles carrying tools and materials',
          body:
            'A van used to transport tools and materials is treated more favourably than ' +
            'a car. Running costs (fuel, insurance, road tax, servicing, MOT) are ' +
            'allowable on a business-use basis. Unlike a car, a van with incidental ' +
            'private use does not trigger significant restrictions — though a fuel ' +
            'benefit in kind applies if the company pays for personal fuel in a ' +
            'company van.',
        },
        {
          title: 'Subcontractor payments & CIS',
          body:
            'Payments to subcontractors (net of any CIS deductions you are required to ' +
            'make) are a deductible business expense. Keep monthly CIS returns and ' +
            'payment/deduction statements. If you are a CIS subcontractor and your ' +
            'contractor withholds 20% (or 30%) CIS tax, that withheld amount is a ' +
            'credit against your Corporation Tax or Income Tax bill — not itself an ' +
            'expense.',
        },
      ],
    };
  }

  if (sector === 'medical') {
    return {
      heading: 'Healthcare & medical — sector expenses',
      intro:
        'Healthcare professionals benefit from a set of specific HMRC-approved ' +
        'deductions that sit on top of the everyday essentials every business can claim.',
      items: [
        {
          title: 'Professional registration fees',
          body:
            'Fees to the GMC, NMC, GDC, HCPC, GPhC and other regulators are on ' +
            'HMRC\'s approved list of deductible professional subscriptions. The ' +
            'full annual registration fee is claimable without receipts — HMRC ' +
            'accepts these as a matter of course. Check the current approved list ' +
            '(form P87 guidance) for your specific regulator.',
        },
        {
          title: 'Medical indemnity insurance',
          body:
            'MDU, MPS, MDDUS and similar medical defence organisation subscriptions ' +
            'are 100% deductible. For locums and independent practitioners, this is ' +
            'often one of the largest single deductible costs. Keep the renewal ' +
            'invoice each year.',
        },
        {
          title: 'CPD & training',
          body:
            'Mandatory continuing professional development required to maintain ' +
            'registration is fully deductible. Conference attendance fees, specialist ' +
            'journals (BMJ, Lancet, etc.), textbooks, and e-learning subscriptions ' +
            'relevant to your practice: all claimable. Travel to CPD events: business ' +
            'travel, fully deductible.',
        },
        {
          title: 'Clinical equipment',
          body:
            'Stethoscopes, ophthalmoscopes, diagnostic devices, specialist instruments, ' +
            'and portable medical equipment used in your practice are deductible. Keep ' +
            'receipts and note the clinical use — HMRC may ask for this in an enquiry.',
        },
        {
          title: 'Scrubs, uniforms & laundry',
          body:
            'Clinical scrubs and uniforms that identify you as a healthcare professional ' +
            'are deductible. Importantly, HMRC also allows a flat-rate deduction for ' +
            'the cost of laundering uniforms — currently £125/year for most healthcare ' +
            'workers (check the current flat-rate allowance for your profession). ' +
            'Personal protective equipment (gloves, masks, aprons, eye protection) used ' +
            'in clinical settings is also fully deductible.',
        },
      ],
    };
  }

  if (sector === 'creative') {
    return {
      heading: 'Creative, tech & freelance — sector expenses',
      intro:
        'Creative and tech freelancers have access to a wide range of tool, equipment, ' +
        'and software deductions that can significantly reduce a taxable profit.',
      items: [
        {
          title: 'Software licences',
          body:
            'Adobe Creative Cloud, Figma, Final Cut Pro, Logic Pro, Sketch, Affinity, ' +
            'development IDEs, and any other software used for client work: fully ' +
            'deductible. Annual and monthly SaaS subscriptions used in the course of ' +
            'delivering your services count as revenue expenditure — deductible in full ' +
            'in the year the cost is incurred.',
        },
        {
          title: 'Photography & video equipment',
          body:
            'Cameras, lenses, lighting rigs, gimbals, audio recorders, microphones, ' +
            'drones — all deductible where used for business purposes. Under the Annual ' +
            'Investment Allowance, the full cost of significant equipment is deductible ' +
            'in the year of purchase rather than depreciated over its useful life.',
        },
        {
          title: 'Studio hire & workspace',
          body:
            'Hiring a photographic studio, recording studio, or rehearsal space for ' +
            'client work: fully deductible. Co-working space membership or hot-desk ' +
            'rental where you work on client projects: deductible. Storage rental for ' +
            'equipment: deductible.',
        },
        {
          title: 'Portfolio, website & stock assets',
          body:
            'Portfolio website hosting, annual domain renewal, stock image/video ' +
            'subscriptions (Shutterstock, Getty), and royalty-free music licences ' +
            'used in client deliverables: all deductible. Props, materials, or samples ' +
            'purchased for a specific shoot or project: deductible in that period.',
        },
        {
          title: 'Hardware & peripherals',
          body:
            'High-performance computers, graphics tablets (Wacom, iPad Pro with ' +
            'Apple Pencil), monitors, audio interfaces, external drives, and other ' +
            'peripherals used for your work: deductible. Where equipment has some ' +
            'personal use, claim only the business proportion.',
        },
      ],
    };
  }

  // ─── Transport & logistics ──────────────────────────────────────────────
  if (sector === 'transport') {
    return {
      heading: 'Transport & logistics — sector expenses',
      intro:
        'Couriers, taxi and private hire drivers, and self-employed haulage operators ' +
        'have access to a specific set of deductions. The vehicle expense decision — ' +
        'mileage rate vs actual costs — is often the most valuable choice to get right.',
      items: [
        {
          title: 'Mileage rate vs actual vehicle costs — making the right call',
          body:
            'The HMRC Approved Mileage rate (55p/mile first 10,000 miles, 25p/mile ' +
            'after — HMRC Agent Update 143, April 2026) is an all-in rate covering fuel, ' +
            'insurance, servicing and depreciation. Once chosen for a vehicle, you must ' +
            'stay on it for the life of that vehicle. For high-mileage operators doing ' +
            '40,000+ miles/year in a diesel van, actual costs often exceed the mileage ' +
            'rate after the first 10,000 miles — particularly when a van qualifies for ' +
            '100% Annual Investment Allowance. Tolls, the Congestion Charge, the ULEZ ' +
            'charge, and Dart Charge are claimable separately on top of the mileage rate. ' +
            'Note: black cab (Hackney carriage) drivers cannot use the mileage rate — ' +
            'actual costs only (BIM75005).',
        },
        {
          title: 'Vans and the Annual Investment Allowance',
          body:
            'Unlike cars, vans (and lorries, trucks) qualify for the Annual Investment ' +
            'Allowance — currently £1 million per year. This means you can write off the ' +
            'entire purchase cost of a van against taxable profits in the year of purchase, ' +
            'rather than depreciating it over several years. Cars are excluded from AIA ' +
            'and go into the Writing Down Allowance pool (18%/year for most cars). If you ' +
            'buy a van with some private use, the AIA claim is reduced proportionally for ' +
            'that private element.',
        },
        {
          title: 'Licences and statutory qualifications',
          body:
            'PCO licence (Uber/minicab/PHV): the application and annual renewal fee is ' +
            'deductible — the licence is a statutory requirement to carry on the trade with ' +
            'no personal benefit whatsoever. HGV/LGV licence fees and the mandatory medical ' +
            'examination: deductible (EIM66190 — the principle applies equally to self-employed ' +
            'drivers). Driver CPC renewal training (35 hours every 5 years): deductible as ' +
            'training that maintains the right to continue the existing trade (BIM42526). ' +
            'Digital tachograph card (~£38, renewed every 5 years): deductible (EIM66195).',
        },
        {
          title: 'Hire and reward insurance and specialist cover',
          body:
            'Hire and reward insurance (required to legally carry passengers or goods for ' +
            'payment), goods-in-transit insurance, and fleet/courier-specific policies are ' +
            '100% deductible — they have no personal use element at all. Standard motor ' +
            'insurance for a vehicle with mixed use is deductible on a business-use ' +
            'proportion basis. Breakdown cover and public liability insurance for your ' +
            'transport business: both deductible in full.',
        },
        {
          title: 'Overnight subsistence for long-haul drivers',
          body:
            'Self-employed lorry drivers who spend nights away from home on business can ' +
            'claim overnight subsistence (BIM37670). The £34.90/night benchmark (£26.20 ' +
            'in a sleeper cab) is the HMRC-agreed rate used by employers — self-employed ' +
            'drivers cannot apply it as a guaranteed safe harbour, but HMRC typically ' +
            'accepts it as a reasonable overnight claim. Keep receipts or a driver\'s log ' +
            'to support any claim. Meals taken on overnight trips are deductible; general ' +
            'meals during the working day for itinerant traders (BIM47705) may also be ' +
            'allowed where the trade is truly itinerant in nature.',
        },
        {
          title: 'Protective clothing and uniform',
          body:
            'Hi-vis jackets, steel-toecap boots, gloves, and waterproof outerwear required ' +
            'for the work are deductible as protective clothing (BIM37910). Branded ' +
            'company uniform (DPD, Evri or similar branded jacket): deductible as a ' +
            'uniform. Ordinary warm clothes or trainers worn while driving: not deductible — ' +
            'clothing is only allowable where it is genuinely protective or a recognisable ' +
            'uniform not suitable for everyday wear. Laundry costs for qualifying ' +
            'protective/uniform items: also deductible.',
        },
      ],
    };
  }

  // ─── Hospitality & food service ────────────────────────────────────────
  if (sector === 'hospitality') {
    return {
      heading: 'Hospitality & food businesses — sector expenses',
      intro:
        'Restaurants, cafes, pubs, takeaways, caterers and food vans have a set of ' +
        'deductions that sit alongside the everyday essentials — several with rules ' +
        'specific to the food and beverage sector.',
      items: [
        {
          title: 'Food, drink and ingredients — cost of sales',
          body:
            'Food and drink purchased for resale, or used in producing meals for customers, ' +
            'is a cost of sales — deducted against trading income as part of your gross ' +
            'profit calculation. Normal wastage (spoilage, trimmings, preparation loss) is ' +
            'an inherent cost of the trade and fully allowable. Personal consumption by ' +
            'you or your family is not — that element must be removed. Recipe development ' +
            'with documented commercial purpose is generally treated as allowable, but any ' +
            'personal consumption element creates a dual-purpose risk (BIM37007 — the ' +
            '"wholly and exclusively" test).',
        },
        {
          title: 'Kitchen equipment — 100% first-year relief via AIA',
          body:
            'Ovens, refrigeration, commercial coffee machines, dishwashers, mixers and ' +
            'extraction systems are capital expenditure qualifying for the Annual Investment ' +
            'Allowance — currently £1 million per year. For most hospitality businesses, ' +
            'this means the entire cost of kitchen equipment is deductible in the year of ' +
            'purchase, with no need to spread the deduction over several years. Leased or ' +
            'rented equipment is treated as a revenue expense — lease payments are deductible ' +
            'in full in the period paid.',
        },
        {
          title: 'Uniforms and workwear',
          body:
            'Chef whites are well-established as deductible protective/occupational ' +
            'clothing (BIM37910) — they are purpose-designed for kitchen conditions ' +
            'and not suitable for everyday wear. Non-slip safety shoes required in the ' +
            'kitchen: deductible. Aprons: deductible. Laundry costs for qualifying ' +
            'workwear: also deductible. Plain black trousers or everyday clothing worn ' +
            'by front-of-house staff: NOT deductible under the Mallalieu v Drummond ' +
            'principle — clothing suitable for wear outside work fails the test regardless ' +
            'of whether it is only worn at work.',
        },
        {
          title: 'Licences, certificates and compliance',
          body:
            'Premises licence (Licensing Act 2003) application and annual renewal: ' +
            'deductible as a business running cost. Personal licence (DPS): deductible. ' +
            'Food hygiene training (Level 2 and Level 3 Food Safety awards) for an ' +
            'existing food business: deductible — this maintains skills for the current ' +
            'trade (BIM42526). Food safety compliance costs — pest control contracts, ' +
            'allergen testing under Natasha\'s Law, deep cleaning required by EHO notice: ' +
            'all deductible. PPL PRS music licence (TheMusicLicence): fully deductible as ' +
            'a business operating cost. Commercial TV licence for sports screens: deductible.',
        },
        {
          title: 'VAT Flat Rate Scheme — rates for food businesses',
          body:
            'If your VAT-taxable turnover is below £150,000, the Flat Rate Scheme ' +
            'simplifies VAT by letting you pay a fixed percentage of gross (VAT-inclusive) ' +
            'turnover rather than calculating input/output VAT. Current rates (from ' +
            '1 April 2022): restaurants, cafes, takeaways and food vans — 12.5%; pubs — ' +
            '6.5%. Note the "limited cost trader" rate of 16.5% applies if goods spend is ' +
            'under 2% of turnover — check this before registering. Source: GOV.UK VAT ' +
            'Flat Rate Scheme rates.',
        },
        {
          title: 'Business rates — Retail, Hospitality & Leisure relief',
          body:
            'Business rates are a fully deductible trading expense (BIM46835). For ' +
            '2025/26, qualifying occupied hospitality premises receive 40% off their ' +
            'rates bill, capped at £110,000 per business (the Retail, Hospitality and ' +
            'Leisure Relief Scheme). From April 2026 this becomes a permanent lower ' +
            'multiplier (38.2p vs the standard 48p) for RHL properties. Mobile caterers ' +
            'operating on public land typically pay pitch fees to councils rather than ' +
            'business rates — those fees are deductible as a premises cost.',
        },
        {
          title: 'Tips and service charges — the tax rules',
          body:
            'The Employment (Allocation of Tips) Act 2023 (from October 2024) requires ' +
            '100% of tips to reach workers — but does not change how they are taxed. ' +
            'Cash tips given directly to staff by customers: income tax applies; no NIC. ' +
            'Tips collected by the business (card machine) and distributed: income tax ' +
            'and employer NIC apply unless a properly structured tronc arrangement is in ' +
            'place. A tronc (managed by an independent troncmaster) removes the NIC ' +
            'liability on tips distributed by the troncmaster. Mandatory service charges ' +
            'are VAT-able; genuinely discretionary service charges are outside VAT scope. ' +
            'Tips and service charges are business income — include them in turnover.',
        },
      ],
    };
  }

  // ─── Retail & e-commerce ───────────────────────────────────────────────
  if (sector === 'retail') {
    return {
      heading: 'Retail & e-commerce — sector expenses',
      intro:
        'Online sellers, independent retailers, market traders and e-commerce businesses ' +
        'have a specific set of deductions — several of which interact with how stock is ' +
        'valued and how overseas sales are treated post-Brexit.',
      items: [
        {
          title: 'Stock purchases, COGS and closing inventory',
          body:
            'Stock purchased for resale is a cost of sales — it reduces taxable profit in ' +
            'the period the goods are sold (not when purchased). The formula: Opening stock ' +
            '+ Purchases − Closing stock = Cost of goods sold. Import duties, freight and ' +
            'customs agent fees paid to bring stock to the UK form part of the cost of ' +
            'stock (BIM33135). Closing stock must be valued at the lower of cost or net ' +
            'realisable value (BIM33115) — LIFO is not permitted. Under the cash basis ' +
            '(available to sole traders with turnover under £150k) stock is simpler: cost ' +
            'of goods is deducted when paid, no year-end adjustment needed.',
        },
        {
          title: 'Marketplace fees and payment processing',
          body:
            'All platform fees are fully deductible: Amazon referral fees, FBA fulfilment ' +
            'and storage fees, eBay final value fees, Etsy listing and transaction fees ' +
            '(6.5%), and payment processing charges (Stripe, PayPal, Etsy Payments). ' +
            'Amazon\'s monthly Professional seller subscription (£25/month + VAT) is ' +
            'deductible. From August 2024, Amazon charges 20% VAT on seller fees — ' +
            'VAT-registered sellers reclaim it as input tax; unregistered sellers deduct ' +
            'the gross fee (inc. VAT) as a trading expense.',
        },
        {
          title: 'Postage, packaging and fulfilment',
          body:
            'Postage (Royal Mail, Evri, DPD, UPS), packaging materials (boxes, mailers, ' +
            'bubble wrap, tape, void fill), printed labels and packing slips are all ' +
            'deductible as direct fulfilment costs. Branded packaging with your logo: ' +
            'deductible as both a product cost and marketing. Amazon FBA storage fees ' +
            '(monthly and long-term) are deductible. Self-storage unit rental for stock: ' +
            'deductible as a premises cost.',
        },
        {
          title: 'Product photography and platform subscriptions',
          body:
            'Photo editing software subscriptions (Adobe Creative Cloud, Lightroom, ' +
            'Canva): revenue expenditure, deductible when paid. Camera bodies, lenses, ' +
            'lighting, and photography equipment: capital items — claim via Annual ' +
            'Investment Allowance (100% in year of purchase). Shopify, WooCommerce, ' +
            'BigCommerce and similar platform monthly fees: revenue expenses, fully ' +
            'deductible (BIM35810). Domain name renewals and SSL certificates: deductible.',
        },
        {
          title: 'Product samples and promotional giveaways',
          body:
            'The cost of giving away your own goods for advertising purposes is specifically ' +
            'allowed and does not count as business entertainment (BIM45071). Sending ' +
            'samples to potential stockists, influencers, or distributors to promote the ' +
            'product to the public: deductible. Giving stock to friends or family: not ' +
            'deductible. Incentivised reviews that breach marketplace terms also carry ' +
            'compliance risk — keep any sampling commercially motivated and documented.',
        },
        {
          title: 'Stock shrinkage, theft and write-offs',
          body:
            'Stock losses from theft or fire are deductible — HMRC explicitly allows this ' +
            '(BIM45851): "The loss of stock-in-trade by fire, burglary, theft or the ' +
            'negligence of an employee is, in the ordinary course of events, an allowable ' +
            'deduction." The claim is net of any insurance payout. In practice, shrinkage ' +
            'is absorbed automatically through the year-end stock count (a lower closing ' +
            'stock figure increases cost of goods sold). Keep police/crime reference numbers ' +
            'and stock records in case of an HMRC enquiry.',
        },
        {
          title: 'Overseas sales — VAT and customs obligations',
          body:
            'UK sellers to EU consumers (from Great Britain): for consignments of €150 or ' +
            'less, IOSS (Import One Stop Shop) registration allows you to collect and remit ' +
            'EU VAT at point of sale, avoiding import VAT at the border. HMRC\'s UK IOSS ' +
            'intermediary scheme became available from April 2026. For consignments above ' +
            '€150, standard EU import procedures apply in each country. From July 2026, ' +
            'the EU introduces a €3 flat customs duty on low-value parcels. The cost of ' +
            'an EU Responsible Person (now required for GPSR compliance) is a deductible ' +
            'business expense. UK VAT registration threshold remains £90,000.',
        },
      ],
    };
  }

  // ─── Management consulting & professional services ─────────────────────
  if (sector === 'consulting') {
    return {
      heading: 'Consulting & professional services — sector expenses',
      intro:
        'Management consultants, business analysts, strategy and HR consultants have ' +
        'access to a range of deductions beyond the everyday essentials — and a few ' +
        'important rules that differ from other sectors.',
      items: [
        {
          title: 'Professional memberships — CMI, IoD, CIPD, APM and others',
          body:
            'For a limited company: professional subscriptions are deductible under the ' +
            '"wholly and exclusively" test regardless of whether the body appears on HMRC\'s ' +
            'List 3. CMI, IoD, CIPD, CIMA, APM, PMI, and similar bodies relevant to a ' +
            'consulting practice are deductible company expenses. For a sole trader or ' +
            'director claiming against employment income: only bodies on HMRC\'s List 3 ' +
            'attract relief via the employment income rules (EIM32900). Life memberships ' +
            'are specifically excluded from relief in all cases.',
        },
        {
          title: 'Proposal and bid costs — deductible even when you lose',
          body:
            'Costs incurred preparing pitches and proposals for clients of an active ' +
            'consulting business are revenue expenditure and deductible — whether or not ' +
            'the bid succeeds. BIM35325 confirms that abortive expenditure does not change ' +
            'its revenue character. Design costs, print costs, travel to pitch presentations, ' +
            'freelance input for bid documents: all allowable. Note: once a formal offer is ' +
            'made in the context of acquiring a business, associated costs can shift to ' +
            'capital (Camas Plc v Atkinson [2004]) — this applies to acquisition deals, ' +
            'not normal client pitches.',
        },
        {
          title: 'Research materials and industry publications',
          body:
            'Gartner reports, Statista subscriptions, McKinsey publications, specialist ' +
            'journals, and business books purchased within the existing consulting specialism: ' +
            'revenue expenditure, fully deductible. HMRC\'s 2024 updated guidance on ' +
            'training costs (which extends to research materials by analogy) confirms that ' +
            'expenditure that updates knowledge or skills within the existing business area ' +
            'qualifies — it need not merely "refresh" existing skills. Books on a completely ' +
            'unrelated field would likely fail the "wholly and exclusively" test.',
        },
        {
          title: 'Client entertaining — the statutory prohibition',
          body:
            'Client entertaining is not deductible — HMRC applies a specific statutory ' +
            'disallowance (ITTOIA 2005 s45 / CTA 2009 s1298). This covers meals, drinks, ' +
            'golf days, hospitality boxes and event tickets provided to clients, prospects ' +
            'or suppliers. The prohibition applies even where the entertaining is genuinely ' +
            'for business. What IS allowed: light refreshments (tea, biscuits) at meetings; ' +
            'gifts up to £50/person/year carrying a conspicuous business advertisement ' +
            '(not food or drink). Staff annual functions (Christmas party, summer event) ' +
            'open to all employees: allowable up to £150/head/year — above that limit the ' +
            'whole amount becomes taxable, not just the excess.',
        },
        {
          title: 'Conference attendance and first-class travel',
          body:
            'Conference attendance fees related to the consulting specialism are deductible. ' +
            'Exhibition stand costs (stand hire, display materials) are classed as advertising ' +
            'expenditure — not entertainment — and are allowable (BIM45032). First-class rail ' +
            'and air travel: HMRC explicitly confirms this is allowable and "should not [be] ' +
            'refused... on the basis that the same journey could have been made more cheaply" ' +
            '(EIM31835). Report production for client deliverables (design, print, binding): ' +
            'fully deductible revenue expenditure — no enduring capital asset is created.',
        },
        {
          title: 'Professional Indemnity insurance — including run-off cover',
          body:
            'PI insurance premiums during active trading: fully deductible (satisfies ' +
            '"wholly and exclusively" beyond question). Run-off cover taken out after ' +
            'ceasing practice: cannot be claimed as a normal trading expense, but qualifies ' +
            'for post-cessation expense relief (ITA 2007 s24A) — available for up to seven ' +
            'years after the business closes. Relief can be set against post-cessation ' +
            'receipts, total income (capped at £50,000 or 25% of adjusted total income), ' +
            'or chargeable gains. Keep track of any run-off premiums — the relief is real ' +
            'and routinely missed.',
        },
        {
          title: 'Subcontracting associates and the 24-month rule',
          body:
            'Payments to associate consultants brought in for specific engagements are ' +
            'fully deductible as trading expenses. Maintain proper contracts and invoices. ' +
            'For long client-site engagements: the 24-month temporary workplace rule ' +
            'applies (EIM32080) — if you work at a single client site for more than 24 ' +
            'months, or expect to from the outset, travel there becomes commuting and is ' +
            'not deductible. The rule activates from the point you know the engagement ' +
            'will exceed 24 months. Consultants visiting multiple client sites (with no ' +
            'single site exceeding 40% of working time) avoid the rule entirely.',
        },
      ],
    };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Section 07 — Grey areas: what you generally cannot claim
// ─────────────────────────────────────────────────────────────────────────

export interface GreyItem {
  iconKey: GreyIconKey;
  title: string;
  body: string;
}

export const GREY_AREAS: GreyItem[] = [
  {
    iconKey: 'entertaining',
    title: 'Client entertaining & hospitality',
    body:
      'Meals and drinks with clients, prospects, or suppliers are not tax-deductible — ' +
      'HMRC specifically excludes "business entertainment". The only exception is staff ' +
      'entertaining (the £150/head annual event for employees). A client lunch is not ' +
      'deductible however business-focused the conversation.',
  },
  {
    iconKey: 'clothing',
    title: 'Ordinary clothing',
    body:
      'Clothes that could be worn in everyday life — a suit, office attire, smart shoes — ' +
      'are not deductible even if you buy them solely for work. The exception: a genuine ' +
      'uniform bearing the company logo, protective/safety clothing (PPE), or occupational ' +
      'wear (scrubs, chef\'s whites, hi-vis) is fully claimable. "I only wear it for ' +
      'work" is not enough on its own.',
  },
  {
    iconKey: 'commute',
    title: 'Commuting costs',
    body:
      'Travel between your home and a permanent place of work is commuting — never ' +
      'deductible. If you operate from home and travel to client sites, that is business ' +
      'travel. If you rent an office or co-working space and travel there regularly, ' +
      'that travel is commuting regardless of what else you do in between.',
  },
  {
    iconKey: 'fines',
    title: 'Fines & penalties',
    body:
      'HMRC late-filing penalties, parking fines, speeding fines, Companies House ' +
      'penalties — none of these are tax-deductible. The logic: HMRC does not allow ' +
      'a deduction for costs incurred in breaking the law or violating a regulation. ' +
      'This includes legal costs incurred in defending criminal proceedings.',
  },
  {
    iconKey: 'food',
    title: 'Everyday food & drink',
    body:
      'General meals and coffees during the working day are not deductible — you ' +
      'would eat whether you were working or not. Meals are only allowable on overnight ' +
      'business trips (where you have incurred a genuine away-from-home cost). ' +
      'Working from a coffee shop does not make the latte a business expense.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section 08 — Record-keeping (all variants)
// ─────────────────────────────────────────────────────────────────────────

export interface RecordItem {
  iconKey: RecordIconKey;
  title: string;
  body: string;
}

export const RECORD_KEEPING: RecordItem[] = [
  {
    iconKey: 'receipts',
    title: 'Keep every receipt — for six years',
    body:
      'HMRC can open an enquiry into any return filed in the last four to six years. ' +
      'For every business expense, you need a receipt or invoice showing what was ' +
      'purchased, from whom, on what date, and for how much. A photograph taken on ' +
      'FreeAgent\'s mobile app is legally sufficient — you do not need to keep paper.',
  },
  {
    iconKey: 'mileage',
    title: 'Keep a mileage log — without it, the claim fails',
    body:
      'HMRC\'s position is clear: no mileage log, no mileage deduction. Your log needs: ' +
      'date, journey (from / to), business purpose, and miles. FreeAgent\'s mobile app ' +
      'can track this automatically using GPS. A simple spreadsheet works too. ' +
      'Log as you travel — reconstructing a year\'s mileage at year-end is unreliable ' +
      'and HMRC knows it.',
  },
  {
    iconKey: 'bank',
    title: 'Download or sync your bank statements',
    body:
      'All income and expenditure should flow through your business bank account. Connect ' +
      'it to FreeAgent via the Bank Feed — transactions import automatically each day, ' +
      'giving you (and us) a real-time view of the books. Mixing business and personal ' +
      'transactions through a personal account makes bookkeeping significantly harder ' +
      'and can reduce the expenses HMRC will accept in an enquiry.',
  },
  {
    iconKey: 'freeagent',
    title: 'Use FreeAgent as you go — not at year-end',
    body:
      'Snap receipts the moment you spend using the FreeAgent mobile app — they are ' +
      'stored, categorised, and matched to bank transactions automatically. Categorise ' +
      'correctly from the start: wrong categories (personal vs business) are the most ' +
      'common source of HMRC enquiry triggers. The more current your bookkeeping, the ' +
      'more reliably we can advise you — and the lower your accountancy costs.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Learn more — panel of links to learn centre
// ─────────────────────────────────────────────────────────────────────────

export interface ExpensesLearnItem {
  title: string;
  blurb: string;
  slug: string;
}

export function getLearnItems(d: ExpensesGuideData): ExpensesLearnItem[] {
  const base: ExpensesLearnItem[] = [
    {
      title: 'Allowable business expenses',
      blurb: 'Full list with HMRC references',
      slug: '/learn/allowable-business-expenses',
    },
    {
      title: 'Use of home as office',
      blurb: 'Both methods explained with examples',
      slug: '/learn/use-of-home-as-office',
    },
    {
      title: 'Mileage & travel expenses',
      blurb: 'AMAP rates, logs, overnight rules',
      slug: '/learn/mileage-and-travel-expenses',
    },
  ];

  if (d.variant === 'ltd') {
    base.push({
      title: 'Director salary & dividends',
      blurb: 'Tax-efficient extraction strategies',
      slug: '/learn/director-salary-and-dividends',
    });
  }

  if (d.clientType === 'PSC') {
    base.push({
      title: 'The 24-month rule',
      blurb: 'Travel deductions for contractors',
      slug: '/learn/24-month-rule-contractors',
    });
  }

  if (d.variant === 'sole') {
    base.push({
      title: 'Self Assessment for sole traders',
      blurb: 'Filing, deadlines, payments',
      slug: '/learn/self-assessment',
    });
  }

  return base;
}

export const HAS_LEARN_CENTRE: Record<ExpensesGuideBrandId, boolean> = {
  clever: true,
  workwell: true,
};

/** Domain hosting each brand's learn centre. */
export const LEARN_CENTRE_DOMAIN: Record<ExpensesGuideBrandId, string> = {
  clever: 'cleveraccounts.com',
  workwell: 'my.workwellaccountancy.com',
};

// ─────────────────────────────────────────────────────────────────────────
// Sample data for browser preview
// ─────────────────────────────────────────────────────────────────────────

export function buildSampleData(
  brandId: ExpensesGuideBrandId,
  variant: ExpensesVariant,
  clientType?: string,
  sector?: ExpensesSector,
): ExpensesGuideData {
  const brand = BRANDS[brandId];
  return {
    brandId,
    brandName: brand.name,
    variant,
    clientFirstName: 'Sarah',
    companyName: variant === 'ltd' ? 'Mitchell Consulting Ltd' : 'Sarah Mitchell',
    accountant: {
      name: 'Jimmy Patel',
      email: brandId === 'clever' ? 'jimmy@cleveraccounts.com' : 'jimmy@workwellsolutions.com',
      phone: brand.phone,
    },
    support: { email: brand.supportEmail, phone: brand.phone },
    clientType: clientType ?? (variant === 'ltd' ? 'PSC' : undefined),
    sector: sector ?? 'general',
  };
}
