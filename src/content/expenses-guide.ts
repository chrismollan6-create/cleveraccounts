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
  | 'property'
  | 'beauty'
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
  /** No email here on purpose — the guide always points clients at the brand
   *  support inbox (`support.email`), never an individual accountant's address. */
  accountant: { name: string; phone: string };
  support: { email: string; phone: string };
  /** 'PSC' triggers the contractor / 24-month rule section */
  clientType?: string;
  /** Determines which sector-specific block is shown */
  sector?: ExpensesSector;
  /** True when the client has switched from a previous accountant */
  priorAccountant?: boolean;
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
      "benefits — are the ones clients most often miss. As a rule of thumb, costs should be " +
      "contracted and paid in the company's name wherever possible: it is what makes them " +
      "cleanly claimable and keeps them off your personal tax."
    );
  }
  return (
    `This guide covers the expenses you can deduct from your self-employment income — ` +
    "reducing the profit on which Income Tax and National Insurance are calculated. " +
    "As a sole trader, the 'wholly and exclusively' test applies to your business expenditure. " +
    "Many sole traders leave real money on the table by not claiming use-of-home or full " +
    "mileage allowances — this guide is here to change that. Keep business spending in a " +
    "dedicated business account and in the business's name so the costs are easy to identify."
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

export function getEverydayEssentials(d: ExpensesGuideData): EssentialItem[] {
  const isLtd = d.variant === 'ltd';
  return [
  {
    iconKey: 'home',
    title: 'Use of home as office',
    stat: '£312/year minimum',
    badge: 'Most missed',
    body: isLtd
      ? 'Claim £6/week (£312/year) as a tax-free company reimbursement with no receipts ' +
        'needed. A larger claim is possible but works differently for a company — see ' +
        'Section 2. (Directors cannot simply put a share of mortgage interest or council ' +
        'tax through the company.)'
      : 'Claim £6/week (£312/year) with zero receipts needed. Or calculate the actual ' +
        'proportional cost of heating, electricity, mortgage interest and council tax. ' +
        'See Section 2 for the full breakdown of both methods.',
    learnSlug: '/learn/expenses/home-office-expenses',
  },
  {
    iconKey: 'car',
    title: 'Business mileage',
    stat: '55p per mile (2026/27)',
    badge: 'Top saver',
    body:
      'In your own car: 55p/mile for the first 10,000 business miles in 2026/27 (increased ' +
      'from 45p in April 2026), 25p/mile after that. The same rate applies to a personally ' +
      'owned electric car. Motorbike: 24p/mile. Bicycle: 20p/mile. A mileage log is ' +
      'essential — see Section 5.',
    learnSlug: '/learn/expenses/vehicle-and-travel-expenses',
  },
  {
    iconKey: 'phone',
    title: 'Phone & internet',
    stat: isLtd ? 'Best in the company name' : 'Business proportion of the bill',
    body: isLtd
      ? "A mobile contract taken out in the company's name is an exempt benefit in full — " +
        "one phone per director/employee, with no taxable benefit even if you use it " +
        "privately. If the contract is in your personal name, the company can only meet " +
        "the cost of business calls (line rental stays personal). Broadband is only " +
        "claimable through the company where the line is in the company's name and " +
        "personal use is incidental."
      : "Your personal phone and broadband used for business? Claim the business proportion — " +
        "based on your actual business use, evidenced by itemised bills rather than a flat " +
        "percentage. A dedicated business SIM or broadband line used only for work is 100% " +
        "deductible with no apportionment needed.",
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
    learnSlug: '/learn/expenses/allowable-business-expenses',
  },
  {
    iconKey: 'training',
    title: 'Training & development',
    badge: 'Check first',
    body:
      'Courses, books, webinars, conferences — allowable when they update or improve your ' +
      'existing skills for the current trade. Key rule: training to enter a new profession ' +
      'from scratch is generally not deductible, and degrees or higher degrees are never ' +
      'allowable. Relevant CPD and accreditation courses: fully claimable.',
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
      'business interruption, and contents cover for business property: also deductible. ' +
      (isLtd
        ? 'Key person insurance taken out by the company on a director can also be ' +
          'deductible where it meets the HMRC "Anderson" conditions (short term, purely ' +
          'to cover business loss, no capital/surrender value) — ask us before setting it up.'
        : 'Key person cover on a business partner can be deductible where it purely ' +
          'protects against loss of trading profits — ask us before setting it up.'),
  },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// Section 02 — Working from home (all variants, but calculation differs)
// ─────────────────────────────────────────────────────────────────────────

export function getHomeOfficeContent(d: ExpensesGuideData): {
  fixedRate: { title: string; body: string };
  actualCosts: { title: string; body: string };
  ltdNote?: { title: string; body: string };
  warning: string;
} {
  const isLtd = d.variant === 'ltd';

  const fixedRate = {
    title: 'Method A — Fixed rate (no receipts needed)',
    body: isLtd
      ? 'Your company can reimburse you £6/week (£312/year) tax-free for working from ' +
        'home, with no receipts and no calculations. It is exempt from PAYE and NI and ' +
        'is the simplest win on the list — set it up as a regular company payment to ' +
        'yourself.'
      : 'HMRC allows £6/week (£312/year) for any week you work from home. No receipts, ' +
        'no proportional calculations, no risk to your Principal Private Residence relief. ' +
        'Claim it on your Self Assessment — it is the simplest win on the list. If you ' +
        'work from home part-time, HMRC\'s simplified flat rate is £10/month (25–50 hrs), ' +
        '£18/month (51–100 hrs), or £26/month (101+ hrs).',
  };

  const actualCosts = isLtd
    ? {
        title: 'Method B — Additional running costs (directors)',
        body:
          'A director cannot put a share of the mortgage interest, council tax or ' +
          'standard water charge through the company — those are personal costs of ' +
          'the home. What the company can reimburse tax-free are the ADDITIONAL ' +
          'household running costs caused by working from home: the extra gas and ' +
          'electricity, metered water used for the business, and business phone/broadband ' +
          'where the line is in the company\'s name (s316A ITEPA 2003 / EIM32815). The ' +
          'company must actually reimburse you — from 6 April 2026 an employee can no ' +
          'longer claim unreimbursed household costs on their own return (EIM32759). To ' +
          'recover a share of mortgage/council tax, use the licence-to-occupy route below.',
      }
    : {
        title: 'Method B — Actual costs (higher claim, more documentation)',
        body:
          'Calculate the business proportion of your household costs: electricity, gas, ' +
          'broadband (less any business-specific allocation), mortgage interest (not ' +
          'capital repayment), council tax, and buildings/contents insurance (BIM47815). ' +
          'The typical formula: (rooms used for business work / total rooms in the house) × ' +
          '(hours worked at home / total available hours). For example: one dedicated study ' +
          'in a 5-room house, 40 hours a week from home out of 168 hours available = roughly ' +
          '5% of total household costs. Keep utility bills and mortgage statements for 6 years.',
      };

  const ltdNote = isLtd
    ? {
        title: "Ltd company directors — the licence-to-occupy route",
        body:
          "To recover a share of your fixed home costs (mortgage interest, council tax, " +
          "insurance), your company can pay you rent under a 'licence to occupy' for using " +
          "part of your home as its office. The rent is a deductible company cost, but it is " +
          "property income in your hands — you declare it on your Self Assessment and offset " +
          "the actual apportioned home costs (calculated much like Method B) against it. It " +
          "usually still leaves a modest taxable profit, so it is not tax-free money; the " +
          "benefit is moving the cost into the company. It needs a simple written agreement " +
          "at a commercial rate — ask us to set it up properly.",
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

export function getTravelItems(d: ExpensesGuideData): TravelItem[] {
  const isLtd = d.variant === 'ltd';
  return [
  {
    title: 'Business travel vs commuting — the fundamental distinction',
    body: isLtd
      ? 'Travel to a permanent workplace is commuting — never deductible. Travel to a ' +
        'temporary workplace is business travel. A workplace stays "temporary" only while ' +
        'you neither expect, nor actually work there, for more than 24 months AND it takes ' +
        'up less than 40% of your working time (the 24-month / 40% rule — see the contractor ' +
        'section). If the company operates from your home, travel to client sites is business ' +
        'travel; if you rent an office you attend regularly, travel to it is commuting.'
      : 'The test for a sole trader is whether your home is the genuine "base of operations". ' +
        'A truly itinerant trade — no fixed site, with tools, stock and records kept at home — ' +
        'can claim travel from home to jobs (BIM37635/BIM37675). But where you attend the same ' +
        'place on a settled, predictable pattern, that travel is ordinary commuting and is not ' +
        'deductible. Travel to occasional client meetings, suppliers and one-off sites is ' +
        'business travel.',
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
    title: 'Meals — the rules follow the travel',
    body: isLtd
      ? 'Subsistence follows the travel rules. On a qualifying journey to a temporary ' +
        'workplace, or an overnight business trip, a reasonable meal is claimable. Meals at ' +
        'your permanent/normal workplace, or on a journey that is really commuting, are not. ' +
        'Meals provided as part of a conference or training event are claimable as part of ' +
        'the event cost.'
      : 'Meals on overnight business trips are claimable (you would not have incurred the ' +
        'cost at home). An ordinary lunch on your normal working pattern is not — HMRC ' +
        'treats it as private subsistence. But where the travel itself is allowable (a ' +
        'genuinely itinerant trade, or a journey outside your normal pattern), reasonable ' +
        'food and drink can be claimed too (BIM37670/BIM47705).',
  },
  {
    title: 'Mileage rate summary (2026/27)',
    body:
      'Own car or van: 55p/mile for the first 10,000 business miles (increased from ' +
      '45p in April 2026), 25p/mile after that. A personally owned electric car uses the ' +
      'same 55p/25p rate (the ~9p Advisory Electricity Rate only applies to a ' +
      'company-provided EV). Motorbike: 24p/mile. Bicycle: 20p/mile. Business passengers: ' +
      '+5p/mile per person. Company-owned car: claim actual fuel costs instead of AMAP.',
  },
  ];
}

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
      'there is no PAYE or NI to pay on it. The annual allowance is currently £60,000, and ' +
      'you can carry forward unused allowance from the previous three tax years. (The ' +
      '"100% of earnings" cap applies to your own personal contributions, not to employer ' +
      'contributions paid by the company; the allowance also tapers for high total income ' +
      'over £260,000.) Making a contribution before your year-end reduces this year\'s CT ' +
      'bill. Ask us to run the numbers before year-end.',
  },
  {
    title: 'Trivial benefits — £300/year of tax-free perks for directors',
    body:
      'You can give yourself non-cash gifts from the company up to £50 each (VAT ' +
      'inclusive), with a maximum of £300/year for directors of close companies (which ' +
      'almost all small Ltd companies are). Gifts must not be cash or a cash voucher, must ' +
      'not reward performance, and must not be in your contract. Use it for: birthday ' +
      'gifts, a restaurant meal, a bottle of wine, a book, a store voucher — anything ' +
      'under £50 including VAT.',
  },
  {
    title: 'Staff entertaining at £150/head/year',
    body:
      'A Christmas party, summer event, or similar annual function open to all employees ' +
      'is allowable up to £150/head/year (VAT inclusive). Below that limit, it is both ' +
      'Corporation Tax deductible AND exempt from PAYE and NI for attendees. Note: if the ' +
      'event is above £150/head, the whole amount becomes taxable — not just the excess.',
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
      'It is expectation, not just time served, that stops the clock. If at month 20 you ' +
      'renew for another year — so you now expect to be at the site beyond 24 months — ' +
      'travel stops being claimable from that point (month 20), not at month 24. The other ' +
      'trigger is time: a site taking up 40% or more of your working time and lasting (or ' +
      'expected to last) 24+ months is permanent. A genuine break of 6+ months elsewhere ' +
      'resets it. Working from home: if the company operates from your home address, travel ' +
      'to a client site is business travel — there is no permanent client workplace to ' +
      'trigger the rule.',
  },
  {
    title: 'Inside IR35 — expenses change',
    body:
      'If a contract is inside IR35, HMRC treats the income from that engagement as ' +
      'employment income, and the deemed-employment rules restrict what you can offset ' +
      'against it. Travel and subsistence to that client typically cannot be claimed ' +
      'against the deemed payment — but the normal temporary-workplace rules still apply, ' +
      'so treatment turns on the facts of each contract. You can still claim business ' +
      'insurance, professional subscriptions, training and the use-of-home allowance. ' +
      'Ask us to review each inside-IR35 engagement separately.',
  },
  {
    title: 'Tools, equipment, and specialist software',
    body:
      'Equipment and software the company buys for contract work are fully deductible: ' +
      'laptops, specialist software licences (development IDEs, testing tools, design ' +
      'applications), test equipment, and peripherals. Because the company owns the asset, ' +
      'you claim the full cost — you do not apportion it. If there is more than incidental ' +
      'private use, that use is instead taxed as a benefit in kind rather than scaling down ' +
      'the deduction.',
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

export function getSectorBlock(
  sector: ExpensesSector,
  variant: ExpensesVariant = 'ltd',
): SectorBlock | null {
  if (sector === 'general') return null;
  const isLtd = variant === 'ltd';

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
          body: isLtd
            ? 'A van is treated more favourably than a car. For the company to claim the ' +
              'running costs (fuel, insurance, road tax, servicing, MOT) and the purchase, ' +
              'the company must own the van. Watch the benefit in kind: a company van kept ' +
              'at your home is hard to argue is "not available" for private use, which ' +
              'triggers a van benefit charge (plus a fuel benefit if the company pays for ' +
              'private fuel). A genuinely commercial vehicle used only for work, with private ' +
              'use no more than incidental, avoids the charge.'
            : 'A van used to transport tools and materials is treated more favourably than ' +
              'a car. Running costs (fuel, insurance, road tax, servicing, MOT) are allowable ' +
              'on a business-use basis — you apportion out any private use. Unlike a car, a ' +
              'van does not attract the restrictive car rules, so it is usually the more ' +
              'tax-efficient vehicle for the trade.',
        },
        {
          title: 'Subcontractor payments & CIS',
          body:
            'The GROSS amount you pay a subcontractor is your deductible expense — not just ' +
            'the net cash you hand over. Where you make a CIS deduction, you pay the ' +
            'subcontractor the net figure and pay the deducted tax over to HMRC; both parts, ' +
            'plus the cost of any materials, make up the gross deductible cost. Keep monthly ' +
            'CIS returns and payment/deduction statements. If you are a CIS subcontractor and ' +
            'your contractor withholds 20% (or 30%) CIS tax, that withheld amount is a credit ' +
            'against your Corporation Tax or Income Tax bill — not itself an expense.',
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
          body: isLtd
            ? 'Clinical scrubs and uniforms that identify you as a healthcare professional ' +
              'are deductible, and PPE (gloves, masks, aprons, eye protection) is fully ' +
              'deductible. The £125 flat-rate laundry allowance you may have seen is an ' +
              'employee deduction for nurses and midwives specifically (EIM67240) — it is ' +
              'not a general "healthcare" figure and is not how a company claims. A company ' +
              'meets the actual cost of cleaning workwear, or provides it directly.'
            : 'Clinical scrubs and uniforms that identify you as a healthcare professional ' +
              'are deductible, as is PPE (gloves, masks, aprons, eye protection). A sole ' +
              'trader deducts the actual cost of laundering workwear. Note the widely quoted ' +
              '£125 flat-rate laundry allowance is specifically the nurses\'/midwives\' ' +
              'EMPLOYEE allowance (EIM67240), not a universal healthcare figure — check the ' +
              'correct treatment for your role.',
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
          body: isLtd
            ? 'High-performance computers, graphics tablets (Wacom, iPad Pro with Apple ' +
              'Pencil), monitors, audio interfaces, external drives and other peripherals ' +
              'the company buys for your work: fully deductible. The company must own the ' +
              'asset, and you claim the full cost rather than apportioning it. More than ' +
              'incidental private use is taxed as a benefit in kind instead of reducing the ' +
              'claim.'
            : 'High-performance computers, graphics tablets (Wacom, iPad Pro with Apple ' +
              'Pencil), monitors, audio interfaces, external drives, and other peripherals ' +
              'used for your work: deductible. Where equipment has some private use, claim ' +
              'only the business proportion.',
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
          body: isLtd
            ? 'There are two ways to relieve vehicle costs, and which is open to you depends ' +
              'on who owns the vehicle. A director/employee can only claim ACTUAL running ' +
              'costs where the COMPANY owns the vehicle; if you own it personally, you claim ' +
              'the HMRC Approved Mileage rate instead (55p/mile first 10,000 miles, 25p ' +
              'after — Agent Update 143, April 2026), an all-in rate covering fuel, ' +
              'insurance, servicing and depreciation. Tolls, the Congestion Charge, the ULEZ ' +
              'charge and Dart Charge are claimable on top of mileage. A company-owned van is ' +
              'often efficient (100% AIA on purchase), but weigh the van benefit-in-kind if ' +
              'it is kept at home.'
            : 'The HMRC Approved Mileage rate (55p/mile first 10,000 miles, 25p/mile ' +
              'after — Agent Update 143, April 2026) is an all-in rate covering fuel, ' +
              'insurance, servicing and depreciation. Once chosen for a vehicle, you stay on ' +
              'it for the life of that vehicle. The alternative is actual costs (a business ' +
              'proportion of fuel, insurance, servicing plus capital allowances). For a ' +
              'high-mileage operator doing 40,000+ miles/year in a diesel van, actual costs ' +
              'often beat the mileage rate — particularly when a van qualifies for 100% AIA. ' +
              'Tolls, the Congestion Charge, the ULEZ charge and Dart Charge are claimable on ' +
              'top of mileage. Note: black cab (Hackney carriage) drivers cannot use the ' +
              'mileage rate — actual costs only (BIM75005).',
        },
        {
          title: 'Vans and the Annual Investment Allowance',
          body:
            'Unlike cars, vans (and lorries, trucks) qualify for the Annual Investment ' +
            'Allowance — currently £1 million per year — so you can write off the entire ' +
            'purchase cost against taxable profits in the year of purchase. Cars are excluded ' +
            'from AIA and go into a Writing Down Allowance pool: the main-rate pool is 14% ' +
            'from April 2026 (down from 18%), but most petrol/diesel cars are higher-emission ' +
            'and fall into the 6% special-rate pool. ' +
            (isLtd
              ? 'A company claims the full allowance on a company-owned vehicle. '
              : 'A sole trader restricts the claim for any private use of the vehicle. '),
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
            '100% deductible — they have no personal use element at all. Breakdown cover and ' +
            'public liability insurance for your transport business: both deductible in full. ' +
            (isLtd
              ? 'For ordinary motor insurance, the company can only deduct it where the ' +
                'policy is a company policy on a company vehicle — you cannot put a share of ' +
                'your personal motor insurance through the company.'
              : 'Standard motor insurance on a vehicle with mixed use is deductible on a ' +
                'business-use proportion basis.'),
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
          body: isLtd
            ? 'Food and drink purchased for resale, or used in producing meals for ' +
              'customers, is a cost of sales — deducted against trading income. Normal ' +
              'wastage (spoilage, trimmings, preparation loss) is fully allowable. A company ' +
              'cannot eat, so there is no "own consumption" adjustment: meals taken by you or ' +
              'staff are staff meals — the cost stays allowable to the company, but it can be ' +
              'a benefit in kind on the individual unless it qualifies as an exempt staff ' +
              'meal (e.g. canteen meals available to all staff). Recipe development with a ' +
              'documented commercial purpose is allowable (BIM37007).'
            : 'Food and drink purchased for resale, or used in producing meals for ' +
              'customers, is a cost of sales — deducted against trading income as part of ' +
              'your gross profit calculation. Normal wastage (spoilage, trimmings, ' +
              'preparation loss) is fully allowable. Own consumption must be adjusted for: ' +
              'in a restaurant, cafe or B&B you remove the meals you and your family take at ' +
              'cost; in a shop or market stall, stock taken for own use is brought in as a ' +
              'sale at market value, not cost. Recipe development with a documented ' +
              'commercial purpose is allowable, but a personal element creates dual-purpose ' +
              'risk (BIM37007 — the "wholly and exclusively" test).',
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
            '6.5%. Watch the "limited cost trader" rate of 16.5%: it applies if your goods ' +
            'spend is either under 2% of your flat-rate turnover, OR over 2% but still less ' +
            'than £1,000 a year — check both tests before registering. Source: GOV.UK VAT ' +
            'Flat Rate Scheme rates.',
        },
        {
          title: 'Business rates — Retail, Hospitality & Leisure relief',
          body:
            'Business rates are a fully deductible trading expense (BIM46835). For ' +
            '2025/26, qualifying occupied hospitality premises receive 40% off their ' +
            'rates bill, capped at £110,000 per business (the Retail, Hospitality and ' +
            'Leisure Relief Scheme). From April 2026 this is replaced by permanently lower ' +
            'RHL multipliers, which vary with the property\'s rateable value (lower-value ' +
            'premises get the biggest reduction) — we can confirm the multiplier for your ' +
            'premises. Mobile caterers ' +
            'operating on public land typically pay pitch fees to councils rather than ' +
            'business rates — those fees are deductible as a premises cost.',
        },
        {
          title: 'Tips and service charges — the tax rules',
          body:
            'The Employment (Allocation of Tips) Act 2023 (from October 2024) requires ' +
            '100% of tips to reach workers — but does not change how they are taxed. Key ' +
            'point: cash tips kept by staff, and a tronc run independently of the owner, are ' +
            'NOT the business\'s income — they stay off the business\'s books entirely (the ' +
            'staff or troncmaster handle any tax). It is only where the owner collects the ' +
            'tips directly, or runs the tronc themselves, that the tips become business ' +
            'income: PAYE must be operated and employer NIC arises (the tips are then also a ' +
            'staff cost, so the real net cost is just the employer NIC). The practical ' +
            'answer is usually to use a genuinely independent tronc, or let staff keep their ' +
            'own tips, to avoid the NIC. Service charges are always business income — ' +
            'mandatory service charges are VAT-able, genuinely discretionary ones are ' +
            'outside VAT scope.',
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
            'realisable value (BIM33115) — LIFO is not permitted. Under the cash basis — ' +
            'now the default for eligible sole traders, with the old £150k turnover entry ' +
            'limit removed from 2024/25 — stock is simpler: cost of goods is deducted when ' +
            'paid, with no year-end adjustment needed.',
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
            'allowed for income/corporation tax and does not count as business entertainment ' +
            '(BIM45071). Sending samples to potential stockists, influencers, or distributors ' +
            'to promote the product to the public: deductible. Giving stock to friends or ' +
            'family: not deductible. Watch the VAT angle separately: gifts and samples have ' +
            'their own VAT rules depending on who receives them and the value given (VAT ' +
            'Notice 700/7) — a deduction for tax does not automatically mean no output VAT is ' +
            'due, so flag larger giveaway campaigns with us.',
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
            'less, EU IOSS (Import One Stop Shop) registration lets you collect and remit ' +
            'EU VAT at point of sale, avoiding import VAT at the border. (Do not confuse this ' +
            'with the UK\'s own £135 low-value threshold, which governs VAT on goods imported ' +
            'INTO Great Britain.) HMRC\'s UK IOSS intermediary scheme became available from ' +
            'April 2026. For consignments above €150, standard EU import procedures apply in ' +
            'each country. From July 2026, ' +
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
            'A subscription is generally in an individual\'s name, so the entity you trade ' +
            'through changes how relief works. For a director or employee, the main test is ' +
            'HMRC\'s List 3: relief is due through the employment income rules only where the ' +
            'body appears on List 3 (EIM32900) — CMI, IoD, CIPD, CIMA, APM and PMI are the ' +
            'kind of bodies to check against it. For a sole trader, List 3 does not apply; a ' +
            'subscription is deductible under the ordinary "wholly and exclusively" test ' +
            'where it is genuinely necessary for the trade, even if the body is not on ' +
            'List 3. Life memberships are specifically excluded from relief in all cases.',
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

  // ─── Property & landlords ───────────────────────────────────────────────
  if (sector === 'property') {
    return {
      heading: 'Property & landlords — sector expenses',
      intro:
        'Letting property is taxed as a property business, not a trade — so several rules ' +
        'differ from the rest of this guide. The single biggest difference is how mortgage ' +
        'interest is treated, and it turns entirely on whether you hold the property ' +
        'personally or through a company.',
      items: [
        {
          title: 'Mortgage interest & finance costs — the key split',
          body: isLtd
            ? 'A property company deducts mortgage interest and other finance costs in full ' +
              'against its rental profit, like any business cost — one of the main reasons ' +
              'landlords incorporate. Weigh the flip side: extracting the profit personally ' +
              '(as dividends) is taxed again, and moving existing personal properties into a ' +
              'company can trigger SDLT and CGT on the way in. Ask us to model it before ' +
              'incorporating.'
            : 'As an individual landlord of residential property you can NO LONGER deduct ' +
              'mortgage interest from your rental profit. Instead you get a basic-rate (20%) ' +
              'tax reducer on the finance costs — the "section 24" restriction (s272A ITTOIA). ' +
              'A higher-rate taxpayer therefore gets relief at 20%, not 40%, which is a real ' +
              'cost. Full deduction still applies to genuinely commercial lettings; the ' +
              'furnished-holiday-let regime that used to allow it was abolished from April 2025.',
        },
        {
          title: 'Allowable running costs',
          body:
            'Letting agent and management fees, landlord insurance, ground rent and service ' +
            'charges, and any council tax or utilities you pay between tenancies are ' +
            'deductible. So are advertising for tenants, referencing and inventory fees, and ' +
            'safety compliance — gas safety (CP12), EICR electrical reports and EPCs. Keep ' +
            'invoices logged against each property.',
        },
        {
          title: 'Repairs vs improvements — revenue or capital',
          body:
            'Repairs that restore the property (redecorating, replacing a broken boiler ' +
            'like-for-like, fixing a roof) are deductible revenue costs. Improvements that ' +
            'upgrade or extend it (an extension, a materially better kitchen, a loft ' +
            'conversion) are capital — not deductible against rent, but they reduce your ' +
            'Capital Gains Tax when you sell. The line between the two is a common enquiry ' +
            'point, so ask us on anything substantial.',
        },
        {
          title: 'Replacing furnishings — domestic items relief',
          body:
            'For a furnished let you can claim the cost of REPLACING domestic items — beds, ' +
            'sofas, carpets, curtains, white goods, crockery — under Replacement of Domestic ' +
            'Items relief. The initial purchase when you first furnish a let is not claimable, ' +
            'only later replacements, and only on a like-for-like basis (any genuine upgrade ' +
            'element is stripped out). The old 10% wear-and-tear allowance no longer exists.',
        },
        {
          title: 'Professional fees',
          body:
            'Accountancy for the rental accounts, and legal/professional fees on SHORT ' +
            'leases, lease renewals, rent reviews and evicting a tenant, are deductible. ' +
            'Legal costs on BUYING a property or granting a long lease are capital (they add ' +
            'to the property\'s cost for CGT). For individuals, mortgage arrangement and ' +
            'broker fees on a residential let fall into the restricted finance-cost basket ' +
            'above rather than being fully deductible.',
        },
        {
          title: 'The £1,000 property allowance',
          body:
            'If your total rental income is £1,000 or less in the year it is tax-free and ' +
            'need not be declared. Above that, you can either deduct your actual expenses or ' +
            'claim the £1,000 allowance instead — whichever gives the better result — but ' +
            'not both. For most established landlords, actual expenses win comfortably.',
        },
      ],
    };
  }

  // ─── Hair, beauty & personal care ───────────────────────────────────────
  if (sector === 'beauty') {
    return {
      heading: 'Hair, beauty & personal care — sector expenses',
      intro:
        'Salons, barbers, nail technicians, aesthetics practitioners and mobile stylists ' +
        'share a set of deductions built around products, equipment and premises — plus a ' +
        'couple of rules specific to chair rental and treatment insurance.',
      items: [
        {
          title: 'Products, consumables & retail stock',
          body:
            'Colours, tints, developer, styling products, gels and acrylics, wax and ' +
            'disposables (gloves, foils, towels, couch roll) used in treatments are ' +
            'deductible as cost of sales. Products you buy to RE-SELL to clients are stock — ' +
            'deductible when sold, with any unsold stock counted at the year-end. Keep the ' +
            'trade-supplier invoices.',
        },
        {
          title: 'Equipment & salon fit-out',
          body: isLtd
            ? 'Styling chairs, backwashes, dryers, nail stations, treatment couches, lasers ' +
              'and sterilising equipment qualify for the Annual Investment Allowance — 100% ' +
              'relief in the year of purchase. The company must own the equipment to claim it; ' +
              'more than incidental private use of an item is taxed as a benefit in kind ' +
              'rather than reducing the claim.'
            : 'Styling chairs, backwashes, dryers, nail stations, treatment couches, lasers ' +
              'and sterilising equipment qualify for the Annual Investment Allowance — 100% ' +
              'relief in the year of purchase. Where an item has some private use, claim only ' +
              'the business proportion.',
        },
        {
          title: 'Chair / room rental',
          body:
            'If you rent a chair or a room in someone else\'s salon, the rent is a deductible ' +
            'business cost — keep the agreement and payment records. If you are the salon ' +
            'owner receiving chair rent, that rent is income, and mind the VAT trap: genuine ' +
            '"rent a chair" can be VAT-exempt as a licence over land, but once you also ' +
            'provide services (reception, products, towels, laundry) HMRC often treats the ' +
            'whole charge as a standard-rated supply. Ask us which side of the line you are on.',
        },
        {
          title: 'Uniforms, PPE & laundry',
          body:
            'Branded tunics, aprons, barber jackets and PPE (gloves, masks) genuinely ' +
            'required for the work are deductible, as is laundering them. Ordinary clothing ' +
            'you could wear outside work — a plain black outfit — is not deductible even if ' +
            'you only wear it in the salon (the Mallalieu v Drummond principle).',
        },
        {
          title: 'Training & CPD',
          body:
            'Courses that update or extend your existing skills — a new balayage technique, a ' +
            'fresh nail system, an advanced facial qualification for an existing aesthetics ' +
            'practice — are deductible. Training to enter the profession for the first time ' +
            '(your initial hairdressing or beauty qualification) is not, and degrees are ' +
            'never allowable.',
        },
        {
          title: 'Insurance & licences',
          body:
            'Treatment liability, public liability and professional indemnity insurance are ' +
            'fully deductible — essential for aesthetics and any skin-piercing work. Local ' +
            'authority special-treatment and skin-piercing licences, and professional ' +
            'registration fees, are also deductible as costs of carrying on the trade.',
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
      'that travel is commuting regardless of what else you do in between. (The exceptions ' +
      'are set out in Section 3: travel to genuinely temporary workplaces, and travel in a ' +
      'truly itinerant trade, can be allowable.)',
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
      'General meals and coffees during your normal working day are not deductible — you ' +
      'would eat whether you were working or not. Working from a coffee shop does not make ' +
      'the latte a business expense. Meals do become allowable where they follow allowable ' +
      'travel: overnight business trips, journeys to a temporary workplace, or an itinerant ' +
      'trade (see Section 3).',
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
      slug: '/learn/expenses/allowable-business-expenses',
    },
    {
      title: 'Use of home as office',
      blurb: 'Both methods explained with examples',
      slug: '/learn/expenses/home-office-expenses',
    },
    {
      title: 'Mileage & travel expenses',
      blurb: 'AMAP rates, logs, overnight rules',
      slug: '/learn/expenses/vehicle-and-travel-expenses',
    },
  ];

  if (d.variant === 'ltd') {
    base.push({
      title: 'Director salary & dividends',
      blurb: 'Tax-efficient extraction strategies',
      slug: '/learn/paye-payroll',
    });
  }

  if (d.clientType === 'PSC') {
    base.push({
      title: 'IR35 & contractor travel',
      blurb: 'How your status affects expenses',
      slug: '/learn/ir35',
    });
  }

  if (d.variant === 'sole') {
    base.push({
      title: 'Self Assessment for sole traders',
      blurb: 'Filing, deadlines, payments',
      slug: '/learn/self-assessment/self-assessment-complete-guide',
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
// Prior accountant — switcher callout + commonly missed items
// ─────────────────────────────────────────────────────────────────────────

export const PRIOR_ACCOUNTANT_CALLOUT = {
  title: "You've joined us from a previous accountant",
  body:
    "One of the first things we do for every switcher is review your recent tax returns " +
    "for missed deductions. The windows for amending returns are limited — so we make " +
    "this a priority in the early weeks of our relationship.",
};

export function getAmendmentWindow(variant: ExpensesVariant): string {
  if (variant === 'ltd') {
    return (
      "Corporation Tax: a CT600 can be amended up to 12 months after the original " +
      "filing deadline — giving us access to roughly the past two years. Your director's " +
      "Self Assessment can be amended up to 12 months after the relevant 31 January " +
      "deadline (approximately 22 months after the tax year ended)."
    );
  }
  return (
    "Self Assessment returns can be amended up to 12 months after the relevant " +
    "31 January filing deadline — giving us access to roughly the past 22 months. " +
    "We'll check both your most recent return and the one before it for anything " +
    "that can be corrected."
  );
}

export interface MissedItem {
  title: string;
  body: string;
}

export function getMissedItems(d: ExpensesGuideData): MissedItem[] {
  const items: MissedItem[] = [];

  // Use of home — universally missed
  items.push({
    title: 'Use of home as office — the £312/year minimum',
    body:
      'The flat-rate claim of £6/week requires no receipts and no calculation, yet many ' +
      'accountants never set it up. If you have worked from home at any point in the last ' +
      'two years and it was not on your returns, this is the first thing we will look at.',
  });

  // Mileage
  items.push({
    title: 'Business mileage — rate and record-keeping',
    body:
      'Some clients have never claimed business mileage at all; others have been claiming ' +
      'at an incorrect rate. The HMRC approved rate is 55p/mile (increased from 45p in ' +
      'April 2026). Where mileage logs do not exist for prior years, we can sometimes ' +
      'reconstruct a reasonable estimate from diary entries, invoices, and bank records.',
  });

  if (d.variant === 'ltd') {
    // Trivial benefits
    items.push({
      title: 'Trivial benefits — £300/year of tax-free perks',
      body:
        'The £50-per-occasion, £300/year director benefit is almost universally missed. ' +
        'It cannot be backdated to prior years, but identifying it now means you start ' +
        'claiming it from day one with us.',
    });

    // Pension
    items.push({
      title: 'Director pension contributions',
      body:
        'Company pension contributions are one of the most tax-efficient tools available ' +
        'to a director — yet many are either never set up, or the contribution level has ' +
        'never been reviewed against the company\'s profit position. We will look at ' +
        'whether employer contributions were properly claimed in previous years.',
    });

    // AIA / capital allowances
    items.push({
      title: 'Capital allowances on equipment',
      body:
        'Equipment purchased in prior years may have been expensed incorrectly — either ' +
        'missed entirely, or capitalised without claiming the Annual Investment Allowance ' +
        '(which gives 100% first-year relief). We will check the capital allowance pool ' +
        'figures in your previous accounts.',
    });
  }

  if (d.variant === 'sole') {
    // Pre-trading expenses
    items.push({
      title: 'Pre-trading expenses',
      body:
        'Costs incurred up to seven years before you started trading can be treated as ' +
        'allowable expenses on day one. Equipment, training, and professional fees paid ' +
        'before the business launched are often never claimed. We will ask about your ' +
        'pre-trading costs if they have not already been included.',
    });

    // Payments on account
    items.push({
      title: 'Payments on Account — have they been set up correctly?',
      body:
        'If your tax bill exceeded £1,000 in any year, HMRC requires Payments on Account ' +
        'towards the following year\'s bill. Errors here — underpayment, overpayment, or ' +
        'failure to claim a reduction — are common and can result in unnecessary interest ' +
        'charges or cash tied up unnecessarily. We will check your Payments on Account ' +
        'position as part of the handover review.',
    });
  }

  // PSC — 24-month rule audit
  if (d.clientType === 'PSC') {
    items.push({
      title: 'Travel expenses and the 24-month rule',
      body:
        'Contractors sometimes claim travel expenses that should have stopped when the ' +
        '24-month temporary workplace limit was reached — or conversely, stop claiming ' +
        'travel they were still entitled to. We will review your contract history and ' +
        'travel claims to confirm your prior-year position was correct.',
    });
  }

  return items;
}

// ─────────────────────────────────────────────────────────────────────────
// Sample data for browser preview
// ─────────────────────────────────────────────────────────────────────────

export function buildSampleData(
  brandId: ExpensesGuideBrandId,
  variant: ExpensesVariant,
  clientType?: string,
  sector?: ExpensesSector,
  priorAccountant?: boolean,
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
      phone: brand.phone,
    },
    support: { email: brand.supportEmail, phone: brand.phone },
    clientType: clientType ?? (variant === 'ltd' ? 'PSC' : undefined),
    sector: sector ?? 'general',
    priorAccountant: priorAccountant ?? false,
  };
}
