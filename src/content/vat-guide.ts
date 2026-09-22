/**
 * VAT Guide — content + data model.
 *
 * A standalone PDF sent to clients when their VAT registration comes through
 * (and to existing VAT clients as a reference). Sits alongside the welcome
 * pack (onboarding-guide) and the expenses guide.
 *
 * Content is dynamic on several axes:
 *   • brandId          — clever | workwell (palette, domain, learn-centre links)
 *   • variant          — Limited Company vs Sole Trader
 *   • scheme           — Standard Rated vs Flat Rate (Account.VAT_Scheme__c)
 *   • sector           — surfaces the VAT quirks of the client's trade
 *   • newlyRegistered  — shows the "your registration" + "day one" sections
 *   • hmrcAuthorised   — shows/hides the "authorise us with HMRC" action band
 *
 * ⚠️ The tax/technical copy is a Claude draft against HMRC guidance current at
 * September 2026 and still needs an accountant accuracy/compliance review
 * before it goes to clients.
 */

import { BRANDS } from '@/lib/constants';

export type VatGuideBrandId = 'clever' | 'workwell';
export type VatVariant = 'ltd' | 'sole';
export type VatScheme = 'standard' | 'flat-rate';
export type VatSector =
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

export type DayOneIconKey = 'invoice' | 'pricing' | 'lookback' | 'records' | 'customers';
export type TrapIconKey =
  | 'foreign'
  | 'subcontractor'
  | 'rent'
  | 'carlease'
  | 'entertaining'
  | 'receipt'
  | 'duplicate'
  | 'unexplained';
export type TellUsIconKey =
  | 'zerorate'
  | 'overseas'
  | 'turnover'
  | 'bigpurchase'
  | 'newtrade'
  | 'property'
  | 'hmrcletter'
  | 'latebooks';

/** Everything the guide needs to render for one client. */
export interface VatGuideData {
  brandId: VatGuideBrandId;
  brandName: string;
  variant: VatVariant;
  scheme: VatScheme;
  clientFirstName: string;
  companyName: string;
  /** No email here on purpose — the guide always points clients at the brand
   *  support inbox (`support.email`), never an individual accountant's address. */
  accountant: { name: string; phone: string };
  support: { email: string; phone: string };

  /** Account.VAT_Number__c — shown on the registration card. */
  vatNumber?: string;
  /** Pre-formatted UK date, e.g. "1 April 2026" (Account.Effective_Date__c). */
  effectiveDate?: string;
  /** Pre-formatted, e.g. "1 April to 30 June 2026". */
  firstReturnPeriod?: string;
  /** Pre-formatted, e.g. "7 August 2026". */
  firstReturnDeadline?: string;
  /** Which months the quarters end in, e.g. "March, June, September and December". */
  quarterEnds?: string;

  /** Account.VAT_Flat_Rate__c — the client's own flat rate, e.g. 14.5. */
  flatRatePercent?: number;
  /** HMRC flat-rate sector label, e.g. "Management consultancy". */
  flatRateCategory?: string;
  /** True inside the first 12 months of registration (1% discount applies). */
  firstYearDiscount?: boolean;

  /** True = registration has just come through; shows the day-one sections. */
  newlyRegistered?: boolean;
  /** Account.HMRC_VAT_Authorisation__c set — hides the "authorise us" band. */
  hmrcAuthorised?: boolean;
  /** Account.DD_Setup_for_VAT__c — swaps the payment guidance. */
  directDebit?: boolean;
  /** Drives the sector-specific section. */
  sector?: VatSector;
}

// ─────────────────────────────────────────────────────────────────────────
// Key figures (cover strip) + the mental model
// ─────────────────────────────────────────────────────────────────────────

/** Registration threshold — rolling 12-month taxable turnover. */
export const VAT_THRESHOLD = '£90,000';
/** Deregistration threshold. */
export const VAT_DEREG_THRESHOLD = '£88,000';

export function getCoverFigures(d: VatGuideData): { value: string; label: string }[] {
  if (d.scheme === 'flat-rate') {
    return [
      { value: '20%', label: 'You charge the standard rate' },
      {
        value: d.flatRatePercent != null ? `${d.flatRatePercent}%` : 'Flat rate',
        label:
          d.flatRatePercent != null
            ? 'You pay HMRC this of gross turnover'
            : 'You pay a % of gross turnover',
      },
      { value: '1m + 7d', label: 'To file and pay after each quarter' },
    ];
  }
  return [
    { value: '20%', label: 'Standard rate on most UK sales' },
    { value: VAT_THRESHOLD, label: 'Rolling 12-month registration threshold' },
    { value: '1m + 7d', label: 'To file and pay after each quarter' },
  ];
}

export const HOW_VAT_WORKS = {
  title: 'You are collecting VAT, not paying it',
  body:
    'The single most useful thing to understand about VAT is that it is not your money and it ' +
    'is not your cost. You add VAT to what you sell, collect it from your customer, and hand ' +
    'it to HMRC. Against that, you deduct the VAT you were charged on your own business costs. ' +
    'What you pay over each quarter is the difference between the two — and if you were charged ' +
    'more than you collected, HMRC pays you.',
};

export function howVatWorksBoxes(d: VatGuideData): { label: string; body: string }[] {
  if (d.scheme === 'flat-rate') {
    return [
      {
        label: 'VAT you charge',
        body:
          'You still add 20% to your invoices and still collect the full amount from your ' +
          'customers — nothing about your invoices changes on the Flat Rate Scheme.',
      },
      {
        label: 'What you keep',
        body:
          'Instead of tracking VAT on every cost, you pay HMRC a fixed percentage' +
          (d.flatRatePercent != null ? ` — ${d.flatRatePercent}%` : '') +
          ' of your gross (VAT-inclusive) turnover, and keep the difference.',
      },
      {
        label: 'The trade-off',
        body:
          'In exchange for that simplicity you cannot normally reclaim VAT on your costs — the ' +
          'exception is a single capital asset costing £2,000 or more including VAT.',
      },
    ];
  }
  return [
    {
      label: 'Output VAT',
      body:
        'The VAT you add to your sales and collect from your customers. On the return, this is ' +
        'Box 1.',
    },
    {
      label: 'Input VAT',
      body:
        'The VAT you were charged on business costs, where you hold a valid VAT invoice. On the ' +
        'return, this is Box 4.',
    },
    {
      label: 'What you pay',
      body:
        'Output VAT minus input VAT. Box 5 on the return. A negative figure is a repayment — ' +
        'HMRC pays you, usually within 30 days.',
    },
  ];
}

export function variantIntro(d: VatGuideData): string {
  const who = d.variant === 'ltd' ? d.companyName : 'your business';
  if (d.newlyRegistered) {
    return (
      `${who} is now VAT registered, which changes a handful of things in how you invoice, ` +
      'what you record, and what you owe HMRC each quarter. This guide walks through all of ' +
      'it: what to do from day one, how a quarter runs with us, exactly what to do in your ' +
      'bookkeeping, and the handful of things that catch people out. None of it is difficult ' +
      'once it is set up — but the habits you form in the first quarter are the ones that make ' +
      'every quarter after it straightforward.'
    );
  }
  return (
    'This is your reference guide to VAT — how it works, how a quarter runs with us, what to ' +
    'do in your bookkeeping, and the things worth telling us about as they happen. Most VAT ' +
    'problems we see are not complicated: they are a receipt that was never attached, a bank ' +
    'transaction left unexplained, or VAT reclaimed on a cost that never carried any. This ' +
    `guide is here to keep ${who} well clear of all three.`
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section — From day one: what changes
// ─────────────────────────────────────────────────────────────────────────

export interface DayOneItem {
  iconKey: DayOneIconKey;
  title: string;
  body: string;
  badge?: string;
}

export function getDayOneItems(d: VatGuideData): DayOneItem[] {
  const lookbackBody =
    'You can usually reclaim VAT on goods bought in the four years before registration, ' +
    'provided you still have them and they are still used in the business — stock, equipment, ' +
    'laptops, tools. For services, the window is six months. This goes on your first return, ' +
    'and it is regularly worth a meaningful amount. Send us anything you have receipts for.' +
    (d.scheme === 'flat-rate'
      ? ' On the Flat Rate Scheme you can still make this pre-registration claim on your first ' +
        'return, even though you cannot generally reclaim VAT after that.'
      : '');

  return [
    {
      iconKey: 'invoice',
      title: 'Every invoice becomes a VAT invoice',
      badge: 'Do this first',
      body:
        'From your effective date, each sales invoice must show: a unique sequential number, ' +
        'your business name and address, your VAT number, the customer’s name and address, ' +
        'the date of supply and the invoice date, a description of what was supplied, the net ' +
        'amount, the VAT rate applied, and the VAT amount. FreeAgent does all of this ' +
        'automatically once your VAT number is in your settings — which is why that is the very ' +
        'first job.',
    },
    {
      iconKey: 'pricing',
      title: 'Decide what happens to your prices',
      body:
        'If your customers are VAT-registered businesses, adding 20% costs them nothing — they ' +
        'reclaim it — so most people simply add VAT on top. If you sell to the public or to ' +
        'exempt businesses such as healthcare, finance and education, that 20% is a real price ' +
        'rise to them, and you may prefer to absorb some of it. Either way, decide before you ' +
        'invoice, not after.',
    },
    {
      iconKey: 'customers',
      title: 'Tell your regular customers',
      body:
        'A short note is enough: your VAT number, the date you are charging from, and the fact ' +
        'that their invoices will now show VAT. Business customers will often need your VAT ' +
        'number for their own records. Doing this up front prevents a round of queries later.',
    },
    {
      iconKey: 'lookback',
      title: 'Reclaim VAT from before you registered',
      badge: 'Often missed',
      body: lookbackBody,
    },
    {
      iconKey: 'records',
      title: 'Your records have to be digital',
      body:
        'Making Tax Digital applies to every VAT-registered business. Your records must be kept ' +
        'digitally and the return has to reach HMRC through compatible software — which is ' +
        'exactly what FreeAgent is, and why we file through it. Keep everything for six years. ' +
        'In practice this means no spreadsheets on the side, and no re-typing figures.',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// Section — How a quarter runs with us
// ─────────────────────────────────────────────────────────────────────────

export interface QuarterStep {
  step: string;
  title: string;
  body: string;
  /** Who is doing the work at this step. */
  actor: 'you' | 'us';
}

export function getQuarterSteps(d: VatGuideData): QuarterStep[] {
  return [
    {
      step: '01',
      title: 'Your quarter ends',
      actor: 'us',
      body:
        'A couple of days after your period end we email you asking one question: are your ' +
        'books ready? We do not start until you say so, because a return prepared from ' +
        'half-finished books has to be done twice.',
    },
    {
      step: '02',
      title: 'You get your books ready',
      actor: 'you',
      body:
        'Four things in FreeAgent: raise any invoices for work done in the quarter, enter your ' +
        'bills and expenses with receipts attached, explain every unexplained bank transaction, ' +
        'and record payments in and out. Then click the button in the email. This is the only ' +
        'part of the quarter that needs real time from you.',
    },
    {
      step: '03',
      title: 'We prepare it and check it',
      actor: 'us',
      body:
        'We pull your figures and run them through an automated review — over thirty checks ' +
        'covering the arithmetic, the VAT treatment of every transaction in the period, ' +
        'duplicates, cut-off around the quarter end, unexplained items, and a reconciliation ' +
        'against HMRC’s own record. Anything that looks wrong comes back to you as a short, ' +
        'specific question rather than a vague "please check".',
    },
    {
      step: '04',
      title: 'You approve it',
      actor: 'you',
      body:
        'We email you the finished return with the figures and the checks we ran. One click ' +
        'approves it. Nothing is filed until you have said yes — we will chase you if the ' +
        'deadline gets close, but we will not file without you.',
    },
    {
      step: '05',
      title: 'We file it, and tell you what to pay',
      actor: 'us',
      body: d.directDebit
        ? 'We submit to HMRC and send you the receipt with the amount and the date. Because you ' +
          'have a VAT direct debit set up, HMRC collects the payment automatically — there is ' +
          'nothing for you to do.'
        : 'We submit to HMRC and send you the receipt, the amount, and the date it is due. You ' +
          'pay HMRC directly at gov.uk/pay-vat, using your VAT number as the reference. Setting ' +
          'up a direct debit is the easiest way to never think about this again — ask us and we ' +
          'will talk you through it.',
    },
  ];
}

export const QUARTER_FOOTNOTE =
  'Your return is due with HMRC one calendar month and seven days after your quarter ends — and ' +
  'the payment is due on the same day, not later. A quarter ending 30 June is due on 7 August. ' +
  'We work to that date, never to the week before it.';

// ─────────────────────────────────────────────────────────────────────────
// Section — In FreeAgent: setup, then the weekly habits
// ─────────────────────────────────────────────────────────────────────────

export interface FreeAgentStep {
  title: string;
  body: string;
  /** Where in FreeAgent, e.g. "Settings › VAT Registration". */
  where?: string;
}

export function getFreeAgentSetup(d: VatGuideData): FreeAgentStep[] {
  return [
    {
      title: 'Turn VAT on and enter your registration',
      where: 'Settings › VAT Registration',
      body:
        'Set "Are you VAT registered?" to Yes, enter your VAT number and your effective date of ' +
        'registration, and pick your filing frequency — quarterly, for almost everyone. Getting ' +
        'the date right matters: FreeAgent will not put VAT on anything dated before it, which ' +
        'is exactly what you want.',
    },
    {
      title:
        d.scheme === 'flat-rate'
          ? 'Set the Flat Rate Scheme and your percentage'
          : 'Choose your VAT basis — invoice or cash',
      where: 'Settings › VAT Registration',
      body:
        d.scheme === 'flat-rate'
          ? 'Select "Flat Rate Scheme" and enter your percentage' +
            (d.flatRatePercent != null ? ` — yours is ${d.flatRatePercent}%` : '') +
            '. If you are in your first twelve months of registration, FreeAgent handles the 1% ' +
            'discount for you. Check this screen again the day your first year ends — the rate ' +
            'steps back up, and the return will be wrong if the setting does not.'
          : 'On the invoice (accrual) basis you account for VAT when you raise the invoice; on ' +
            'the cash basis, when you actually get paid. Cash accounting is available up to ' +
            '£1.35m of turnover and is a real cash-flow help if your customers pay slowly — you ' +
            'never hand HMRC VAT you have not yet collected. Talk to us before switching either ' +
            'way.',
    },
    {
      title: 'Connect FreeAgent to HMRC for Making Tax Digital',
      where: 'Settings › VAT Registration › Filing via MTD',
      body:
        'This is a one-off connection that lets the return reach HMRC digitally. Separately, ' +
        'HMRC will ask you to approve us as your VAT agent — that is the "Authorise on HMRC" ' +
        'email from us, and it takes about a minute. Both are needed before anything can be ' +
        'filed.',
    },
    {
      title: 'Check your invoice template shows your VAT number',
      where: 'Settings › Invoice Customisation',
      body:
        'FreeAgent adds it automatically once VAT is switched on — but raise a test invoice and ' +
        'look at it anyway. An invoice without a VAT number is not a valid VAT invoice, and your ' +
        'customer cannot reclaim from it.',
    },
    {
      title: 'Set the right VAT rate on what you sell',
      where: 'When raising an invoice',
      body:
        'FreeAgent defaults each invoice line to 20%. If any of what you sell is zero rated, ' +
        'exempt, or outside the scope of UK VAT, change it on the line — and tell us, because it ' +
        'changes what your return should look like every quarter after that.',
    },
  ];
}

export const FREEAGENT_HABITS: FreeAgentStep[] = [
  {
    title: 'Explain every bank transaction — and check the VAT on it',
    where: 'Banking',
    body:
      'When you explain a transaction, FreeAgent picks a category and then assumes 20% VAT. It ' +
      'is right most of the time and wrong often enough to matter. If the cost carried no VAT — ' +
      'insurance, bank charges, wages, an unregistered subcontractor, most rent — change the VAT ' +
      'field to Exempt, Out of Scope, or 0%. This one habit prevents the single most common ' +
      'error we correct.',
  },
  {
    title: 'Attach the receipt at the same time',
    where: 'Files, or the FreeAgent mobile app',
    body:
      'No receipt, no reclaim — HMRC can disallow input VAT purely because you cannot produce ' +
      'the invoice. Photograph it on the app when you spend, or forward the supplier’s ' +
      'email straight into FreeAgent. Doing it in the moment takes seconds; doing it three ' +
      'months later takes an afternoon.',
  },
  {
    title: 'Get unexplained transactions to zero before the quarter ends',
    where: 'Banking › the unexplained count',
    body:
      'FreeAgent builds your return only from transactions it understands. Anything sitting ' +
      'unexplained is simply missing from the figures — which means the return understates, and ' +
      'that is our problem to unpick and yours to pay interest on. Clear them weekly and the ' +
      'quarter end is a non-event.',
  },
  {
    title: 'Mark overseas purchases correctly',
    where: 'When explaining the transaction',
    body:
      'Buying services from abroad — Google, AWS, Meta, Adobe, Zoom, a developer overseas — is ' +
      'handled by the reverse charge: you account for the VAT on both sides of your own return ' +
      'and end up neutral. Set the EC / reverse-charge status when you explain it. What you must ' +
      'not do is reclaim VAT that a foreign supplier never charged you.',
  },
  {
    title: 'Leave the VAT journals alone',
    where: 'Accounting › Journal Entries',
    body:
      'Never post a manual journal to a VAT code. Every VAT figure should come from a real ' +
      'transaction, and a journal straight into the VAT account is the classic place an error ' +
      'hides. If something needs adjusting, tell us and we will do it properly.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section — Top tips: what is usually vatable, and what is not
// ─────────────────────────────────────────────────────────────────────────

export interface RateBand {
  /** Displayed as the badge, e.g. "20%". */
  rate: string;
  name: string;
  /** One line on what the band means for the client. */
  meaning: string;
  examples: string[];
  tone: 'charge' | 'reduced' | 'zero' | 'exempt' | 'outside';
}

export const RATE_BANDS: RateBand[] = [
  {
    rate: '20%',
    name: 'Standard rated',
    meaning:
      'The default. If you cannot point to a specific rule putting something elsewhere, it is ' +
      'standard rated.',
    tone: 'charge',
    examples: [
      'Consultancy, design, development and most professional services',
      'Most goods sold in the UK',
      'Software, subscriptions and hosting',
      'Adult clothing and footwear',
      'Restaurant meals, hot takeaway food, alcohol and soft drinks',
      'Repairs, extensions and maintenance to existing homes',
    ],
  },
  {
    rate: '5%',
    name: 'Reduced rated',
    meaning:
      'A short, specific list. Worth knowing if you work in property or energy — otherwise rare.',
    tone: 'reduced',
    examples: [
      'Domestic fuel and power',
      'Children’s car seats',
      'Installing certain energy-saving materials',
      'Converting a property into a different number of dwellings',
      'Renovating a home that has been empty for two years or more',
    ],
  },
  {
    rate: '0%',
    name: 'Zero rated',
    meaning:
      'Still a taxable supply, at a rate of nothing — it counts towards the registration ' +
      'threshold, and you can still reclaim VAT on your costs. This is the good one to be in.',
    tone: 'zero',
    examples: [
      'Most food and drink sold cold, to take away',
      'Books, newspapers, journals and e-books',
      'Children’s clothing and footwear',
      'Public transport, and most exports of goods outside the UK',
      'Building new residential property',
      'Prescription medicines, and most printed advertising for charities',
    ],
  },
  {
    rate: 'Exempt',
    name: 'Exempt',
    meaning:
      'Not a taxable supply at all. You charge nothing, it does not count towards the threshold, ' +
      'and you generally cannot reclaim the VAT on costs relating to it.',
    tone: 'exempt',
    examples: [
      'Insurance, and most finance and credit',
      'Medical and dental care by a registered practitioner',
      'Education and training by an eligible body',
      'Rent on commercial property, unless the landlord has opted to tax',
      'Subscriptions to certain professional and public-interest bodies',
      'Burial and cremation',
    ],
  },
  {
    rate: 'N/A',
    name: 'Outside the scope',
    meaning: 'Not a supply of anything. It never appears on a VAT return, in either direction.',
    tone: 'outside',
    examples: [
      'Wages, PAYE, National Insurance and pension contributions',
      'Dividends and drawings',
      'Transfers between your own bank accounts',
      'Most grants and genuine donations',
      'Statutory fees — Companies House, vehicle tax, MOT at cost',
      'Payments of VAT, Corporation Tax and Self Assessment to HMRC',
    ],
  },
];

export const RATE_BAND_PRO_TIP =
  'Zero rated and exempt look identical on a bank statement and are completely different on a ' +
  'VAT return. Zero-rated sales let you keep reclaiming VAT on your costs; exempt sales do not. ' +
  'If a meaningful part of what you sell is exempt, tell us — there are rules limiting how much ' +
  'input VAT you can recover, and they need setting up properly rather than discovering at the ' +
  'year end.';

// ─────────────────────────────────────────────────────────────────────────
// Section — The reclaim traps
// ─────────────────────────────────────────────────────────────────────────

export interface TrapItem {
  iconKey: TrapIconKey;
  title: string;
  body: string;
  /** 'never' = the VAT can never be reclaimed; 'check' = it depends. */
  severity: 'never' | 'check';
}

export function getTraps(d: VatGuideData): TrapItem[] {
  const traps: TrapItem[] = [
    {
      iconKey: 'foreign',
      title: 'Overseas digital suppliers',
      severity: 'never',
      body:
        'Google, AWS, Meta, LinkedIn, Adobe, Zoom, GitHub, Canva, Shopify and their like do not ' +
        'charge you UK VAT once they hold your VAT number. There is therefore nothing to reclaim ' +
        '— the correct treatment is the reverse charge, where you put the VAT on both sides of ' +
        'your own return and end up neutral. Reclaiming VAT that was never charged is the most ' +
        'expensive small error we find.',
    },
    {
      iconKey: 'entertaining',
      title: 'Client entertaining, and buying a car',
      severity: 'never',
      body:
        'VAT on entertaining clients is blocked outright, however legitimate the business ' +
        'purpose. So is VAT on buying a car, unless it genuinely has no private use at all — a ' +
        'pool car, taxi, driving-school or hire car. Entertaining your own staff is different, ' +
        'and is recoverable.',
    },
    {
      iconKey: 'carlease',
      title: 'Leasing a car — only half',
      severity: 'check',
      body:
        'Where a leased car has any private use, only 50% of the VAT on the lease payments is ' +
        'recoverable. VAT on the maintenance element, and on a leased van or commercial vehicle, ' +
        'is recoverable in full. Tell us when a lease starts so it is set up right from the first ' +
        'payment.',
    },
    {
      iconKey: 'subcontractor',
      title: 'Subcontractors who are not VAT registered',
      severity: 'check',
      body:
        'Plenty of subcontractors are below the threshold and correctly charge no VAT. If their ' +
        'invoice does not show a VAT number and a VAT amount, there is no VAT to reclaim — ' +
        'whatever the bookkeeping software suggests. Check the invoice, not the habit.',
    },
    {
      iconKey: 'rent',
      title: 'Rent — usually exempt, sometimes not',
      severity: 'check',
      body:
        'Rent on commercial property is exempt unless your landlord has opted to tax, in which ' +
        'case they charge 20% and you reclaim it. Both are common. What matters is that you ' +
        'follow the invoice: if the landlord has not charged VAT, do not record any.',
    },
    {
      iconKey: 'receipt',
      title: 'No VAT invoice, no reclaim',
      severity: 'never',
      body:
        'A bank statement line is not evidence. To reclaim input VAT you need the supplier’s ' +
        'VAT invoice showing their VAT number and the VAT charged. For purchases under £250 a ' +
        'simplified receipt is enough — but you still need the receipt. Attach it in FreeAgent ' +
        'when you spend and this never becomes a problem.',
    },
    {
      iconKey: 'duplicate',
      title: 'The same cost entered twice',
      severity: 'check',
      body:
        'A bill entered by hand and then the bank payment explained separately is the classic ' +
        'double count — it reclaims the VAT twice and overstates your costs. When a bank ' +
        'transaction matches a bill you have already entered, explain it as a payment of that ' +
        'bill rather than as a fresh cost.',
    },
    {
      iconKey: 'unexplained',
      title: 'Anything left unexplained',
      severity: 'check',
      body:
        'Unexplained bank transactions are not neutral — they are silently left out of your ' +
        'return. Whatever VAT they carried, in either direction, is missing. This is the single ' +
        'biggest reason a return has to be reworked, and the easiest of all of these to avoid.',
    },
  ];

  if (d.scheme === 'flat-rate') {
    traps.unshift({
      iconKey: 'foreign',
      title: 'On the Flat Rate Scheme, you are not reclaiming at all',
      severity: 'never',
      body:
        'The flat percentage already assumes you are bearing VAT on your costs, so with one ' +
        'exception you do not reclaim input VAT on anything. The exception is a single capital ' +
        'asset costing £2,000 or more including VAT — a van, a serious piece of equipment, a full ' +
        'computer setup bought together on one invoice. Tell us when you buy one.',
    });
  }

  return traps;
}

// ─────────────────────────────────────────────────────────────────────────
// Section — Tell us when…
// ─────────────────────────────────────────────────────────────────────────

export interface TellUsItem {
  iconKey: TellUsIconKey;
  title: string;
  body: string;
  /** Short pill, e.g. "Same week". */
  urgency?: string;
}

export function getTellUsItems(d: VatGuideData): TellUsItem[] {
  return [
    {
      iconKey: 'zerorate',
      title: 'You start invoicing anything at 0%, or without VAT',
      urgency: 'Before you send it',
      body:
        'A sale going out at nothing is either completely correct or a straightforward ' +
        'under-declaration, and the two look identical in the data. If you are about to zero rate ' +
        'something, exempt it, or treat it as outside the scope, tell us first — it takes a ' +
        'minute to confirm and it saves a correction later. Our checks will flag it anyway; this ' +
        'just means you hear it from us rather than from HMRC.',
    },
    {
      iconKey: 'overseas',
      title: 'You start selling to, or buying from, overseas',
      urgency: 'Same week',
      body:
        'Where your customer is changes whether UK VAT applies at all, and buying services from ' +
        'abroad brings in the reverse charge. Both are entirely manageable, and both need setting ' +
        'up correctly from the first transaction rather than reconstructed afterwards. Selling ' +
        'goods to consumers in the EU has its own rules again.',
    },
    {
      iconKey: 'turnover',
      title: 'Your turnover changes materially, up or down',
      body:
        `If your rolling 12-month turnover falls below ${VAT_DEREG_THRESHOLD} you may be able to ` +
        'deregister, which can save both money and admin. Going the other way, growth can push ' +
        'you past the limits of the Flat Rate or cash accounting schemes. We watch this in the ' +
        'background — but you will know before the figures do.',
    },
    {
      iconKey: 'bigpurchase',
      title: 'You buy something substantial',
      urgency: 'Before you commit',
      body:
        d.scheme === 'flat-rate'
          ? 'On the Flat Rate Scheme a single capital asset of £2,000 or more including VAT is the ' +
            'one thing you can reclaim on — but only if it is recorded correctly. Vehicles, ' +
            'property and anything over £50,000 have their own rules on top.'
          : 'Vehicles, property, and computer equipment costing £50,000 or more all have special ' +
            'VAT treatment — and property over £250,000 falls into a scheme that adjusts the VAT ' +
            'recovery over the following ten years. A five-minute conversation beforehand is ' +
            'worth a great deal more than a correction afterwards.',
    },
    {
      iconKey: 'newtrade',
      title: 'You change what you actually sell',
      body:
        d.scheme === 'flat-rate'
          ? 'Your flat rate is tied to your trade sector. Move into a different line of work and ' +
            'the percentage may need to change — using the wrong one for a year is an expensive ' +
            'way to find out.'
          : 'A new product or service line can sit in a different VAT band to everything else you ' +
            'do. It is much easier to get the treatment right at launch than to unpick a year of ' +
            'invoices.',
    },
    {
      iconKey: 'property',
      title: 'You take on premises, or your landlord starts charging VAT',
      body:
        'A landlord who opts to tax will start adding 20% to your rent — reclaimable, but only if ' +
        'it is recorded as VAT rather than swallowed into the cost. Buying or leasing commercial ' +
        'property has wider VAT consequences that are worth a proper conversation.',
    },
    {
      iconKey: 'hmrcletter',
      title: 'HMRC writes to you about VAT',
      urgency: 'Forward it same day',
      body:
        'Forward it to us the day it arrives, whatever it looks like — assessments, compliance ' +
        'checks and penalty notices all have response deadlines, and they are short. Equally, if ' +
        'something claiming to be from HMRC asks you to pay or click urgently, send it to us ' +
        'before you do anything: we will tell you quickly whether it is genuine.',
    },
    {
      iconKey: 'latebooks',
      title: 'You are not going to have your books ready in time',
      body:
        'Tell us early rather than going quiet. There is almost always something we can do with a ' +
        'week’s notice and very little we can do the day before. A late return costs a ' +
        'penalty point; a late payment starts charging interest immediately.',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// Section — Deadlines, payment and what late costs
// ─────────────────────────────────────────────────────────────────────────

export const DEADLINE_FACTS: { label: string; value: string; note: string }[] = [
  {
    label: 'Return due',
    value: '1 month + 7 days',
    note: 'After your quarter ends. A 30 June quarter is due 7 August.',
  },
  {
    label: 'Payment due',
    value: 'The same day',
    note: 'Cleared with HMRC, not sent — allow time unless you pay by direct debit.',
  },
  {
    label: 'Repayments',
    value: 'Within 30 days',
    note: 'Paid to your bank account, and usually a good deal faster than that.',
  },
  {
    label: 'Keep records for',
    value: '6 years',
    note: 'Digitally — FreeAgent does it for you, as long as receipts are attached.',
  },
];

export const PENALTY_ITEMS: { title: string; body: string }[] = [
  {
    title: 'Late returns earn points, not fines — at first',
    body:
      'Each VAT return filed late gives you one penalty point. Reach four points on quarterly ' +
      'returns and you get a £200 penalty, and another £200 for every late return after that. ' +
      'Points expire after a period of compliant filing. A nil return still has to be filed.',
  },
  {
    title: 'Late payment costs money immediately',
    body:
      'Interest runs from the day the payment was due. On top of that, a payment still ' +
      'outstanding after 15 days attracts a penalty of 3% of the amount owed, a further 3% at 30 ' +
      'days, and an annualised 10% charge accruing daily from day 31.',
  },
  {
    title: 'If you cannot pay, say so before the deadline',
    body:
      'HMRC will usually agree a Time to Pay arrangement, and agreeing one before the due date ' +
      'stops the penalties escalating. The worst outcome is silence. Tell us as soon as you can ' +
      'see the problem coming and we will help you set it up.',
  },
  {
    title: 'Mistakes are fixable, and the threshold is generous',
    body:
      'Errors below £10,000 — or below 1% of your quarterly turnover, up to £50,000 — can simply ' +
      'be corrected on your next return. Above that, HMRC needs a formal notification. Either ' +
      'way, an error you find and correct yourself is treated very differently from one HMRC ' +
      'finds for you.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Section — Flat Rate Scheme (flat-rate clients only)
// ─────────────────────────────────────────────────────────────────────────

export function getFlatRateItems(d: VatGuideData): { title: string; body: string }[] {
  const worked =
    d.flatRatePercent != null
      ? ` On a £1,000 + VAT invoice you collect £1,200 and pay HMRC £${(
          (1200 * d.flatRatePercent) /
          100
        ).toFixed(2)}.`
      : '';

  const items = [
    {
      title: 'You still charge 20% — you just keep some of it',
      body:
        'Nothing changes on your invoices: you charge the normal rate and your customers reclaim ' +
        'it as normal. What changes is what you hand over. You pay HMRC ' +
        (d.flatRatePercent != null ? `${d.flatRatePercent}%` : 'a fixed percentage') +
        ' of your gross, VAT-inclusive turnover and keep the rest.' +
        worked,
    },
    {
      title: 'The trade-off: no reclaiming on your costs',
      body:
        'The percentage is set low precisely because it already assumes you are bearing VAT on ' +
        'your purchases. So you do not reclaim input VAT — with one exception: a single capital ' +
        'asset costing £2,000 or more including VAT. That means one invoice, not £2,000 of ' +
        'laptops bought across a year.',
    },
    {
      title: 'Watch the limited cost trader rule',
      body:
        'If you spend less than 2% of your turnover on goods — or less than £1,000 a year — HMRC ' +
        'treats you as a limited cost trader and your rate becomes 16.5% regardless of your ' +
        'sector. At that rate the scheme is usually costing you money. Services, rent, ' +
        'accountancy fees and anything you lease do not count as goods. We test this every ' +
        'quarter and will tell you the moment it stops being worth it.',
    },
    {
      title: 'Leaving is easy, and sometimes right',
      body:
        'You must leave if your turnover exceeds £230,000 including VAT, and you can leave ' +
        'voluntarily at any time. If you start buying more, spending on equipment, or taking on a ' +
        'VAT-charging landlord, the standard scheme can be worth noticeably more. Ask us to ' +
        'compare the two — it is a quick calculation.',
    },
  ];

  if (d.firstYearDiscount) {
    items.splice(1, 0, {
      title: 'You get 1% off for your first year',
      body:
        'Every business joining the Flat Rate Scheme gets a one percentage point discount for the ' +
        'first twelve months after VAT registration. It falls away on the anniversary — we track ' +
        'the date and adjust it for you, but it is worth knowing why the figure steps up.',
    });
  }

  return items;
}

// ─────────────────────────────────────────────────────────────────────────
// Section — Sector specifics
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

const GENERAL_COMMON: SectorItem[] = [
  {
    title: 'Anything with private use is apportioned',
    body:
      'A phone, a laptop, a vehicle, a room at home — where there is genuine private use, only ' +
      'the business proportion of the VAT is recoverable. Choose a defensible basis, write down ' +
      'how you arrived at it, and keep using it.',
  },
  {
    title: 'Bad debts can be reclaimed',
    body:
      'If a customer never pays an invoice you have already accounted for VAT on, you can ' +
      'reclaim that VAT once the debt is more than six months overdue and has been written off ' +
      'in your books. It is easily missed — tell us about anything unpaid that is that old.',
  },
  {
    title: 'Your VAT number is public',
    body:
      'Anyone can check a VAT number on HMRC’s checker at gov.uk, and it is worth doing for ' +
      'a new supplier charging you significant VAT. An invalid number means no valid VAT invoice, ' +
      'and no reclaim.',
  },
];

export function getSectorBlock(sector: VatSector, variant: VatVariant): SectorBlock | null {
  switch (sector) {
    case 'cis':
      return {
        heading: 'VAT in construction',
        intro:
          'Construction has the most distinctive VAT rules of any trade — and the one that ' +
          'catches people hardest is the domestic reverse charge.',
        items: [
          {
            title: 'The domestic reverse charge — you invoice without VAT',
            body:
              'When you do construction work for another VAT-registered business that will supply ' +
              'it onward, you do not charge VAT. You invoice the net amount with a note saying ' +
              'the reverse charge applies, and your customer accounts for the VAT instead. It ' +
              'applies to work reportable under CIS between two VAT-registered parties — and not ' +
              'when your customer is the end user, such as a homeowner, or a building’s owner ' +
              'occupying it.',
          },
          {
            title: 'It changes your cash flow, not your tax',
            body:
              'Because you stop collecting VAT on those sales while still reclaiming it on your ' +
              'materials, many subcontractors go from paying HMRC each quarter to being repaid by ' +
              'them. That is correct and expected — but if you had been using the VAT you ' +
              'collected as working capital, plan for it.',
          },
          {
            title: 'End user statements matter',
            body:
              'Your customer has to tell you in writing if they are the end user; until they do, ' +
              'the reverse charge applies. Keep those statements — they are the evidence for why ' +
              'you did or did not charge VAT, and they are the first thing asked for in a check.',
          },
          {
            title: 'New build is zero rated; repairs are not',
            body:
              'Work on a new residential building is generally zero rated, conversions are often ' +
              '5%, and repairs, extensions and maintenance to an existing home are 20%. The same ' +
              'crew doing the same work on two sites can be on two different rates — the rate ' +
              'follows the building, not the job.',
          },
          {
            title: 'CIS deductions and VAT are separate',
            body:
              'A contractor deducts CIS from the labour element of your invoice, never from the ' +
              'VAT. Your return shows the full value of your sales regardless of what was ' +
              'deducted before you were paid.',
          },
        ],
      };

    case 'medical':
      return {
        heading: 'VAT in healthcare',
        intro:
          'Most medical care is exempt from VAT — which sounds simple, and is the reason ' +
          'healthcare businesses get VAT wrong more often than most.',
        items: [
          {
            title: 'Exempt is not the same as zero rated',
            body:
              'Medical care provided by a registered practitioner is exempt: you charge no VAT, ' +
              'and it does not count towards the registration threshold. But exempt income also ' +
              'means you generally cannot reclaim the VAT on the costs that relate to it.',
          },
          {
            title: 'The purpose of the treatment decides it',
            body:
              'Exemption depends on the care being for the protection, maintenance or restoration ' +
              'of health. The same procedure can be exempt when it is medically indicated and ' +
              'standard rated when it is cosmetic. That distinction has to be recorded at the ' +
              'point of treatment, not reconstructed a year later.',
          },
          {
            title: 'Where mixed income appears, so does partial exemption',
            body:
              'Cosmetic work, medico-legal reports, teaching, product sales and room hire can all ' +
              'be taxable alongside exempt care. Once you have both, there are rules limiting how ' +
              'much input VAT you can recover. Tell us as soon as a taxable income stream starts ' +
              '— it needs a method agreed, not an estimate.',
          },
          {
            title: 'Locum staff and agencies',
            body:
              'Supplying a person is treated differently from supplying medical care. Staff ' +
              'supplied through an agency is usually standard rated even though the underlying ' +
              'work is medical. Check the contract before assuming the invoice should be exempt.',
          },
        ],
      };

    case 'creative':
      return {
        heading: 'VAT for creative and tech businesses',
        intro:
          'Almost everything you sell is standard rated — the complications come from where your ' +
          'customers and your suppliers are.',
        items: [
          {
            title: 'Your tool stack is almost entirely overseas',
            body:
              'Adobe, Figma, AWS, GitHub, Vercel, OpenAI, Google, Meta — once they hold your VAT ' +
              'number these suppliers charge you no UK VAT, and the reverse charge applies. Every ' +
              'one of those subscriptions needs marking as such. This is the most common error we ' +
              'see in creative and tech books, and it is entirely avoidable.',
          },
          {
            title: 'Selling services to overseas businesses',
            body:
              'For most services to a business customer outside the UK, the place of supply is ' +
              'where the customer is, so you do not charge UK VAT. Get evidence of their business ' +
              'status and where they are, and keep it. Selling to overseas consumers rather than ' +
              'businesses can be a different answer entirely.',
          },
          {
            title: 'Digital products sold to consumers',
            body:
              'Downloads, apps, templates and courses sold to consumers in other countries are ' +
              'taxed where the customer is. Platforms like Apple, Google and Gumroad usually ' +
              'handle that for you; selling direct from your own site means you have to. Tell us ' +
              'before you launch, not after the first month’s sales.',
          },
          {
            title: 'Equipment and the home studio',
            body:
              'Cameras, monitors, machines and studio kit carry reclaimable VAT where the ' +
              'purchase is genuinely for the business. Where there is real private use, only the ' +
              'business proportion is recoverable — apportion it honestly and record how you ' +
              'arrived at the figure.',
          },
        ],
      };

    case 'transport':
      return {
        heading: 'VAT in transport and logistics',
        intro:
          'Fuel, vehicles and international movement — three areas where the rules are specific ' +
          'and the sums are large.',
        items: [
          {
            title: 'Fuel: reclaim on business mileage only',
            body:
              'VAT on fuel is reclaimable only for business use. Where a vehicle has private use ' +
              'you either keep detailed mileage records, or reclaim all the VAT and pay ' +
              'HMRC’s fixed fuel scale charge each quarter. The scale charge is usually the ' +
              'simpler option — we will tell you which works out better for you.',
          },
          {
            title: 'Vans are treated far better than cars',
            body:
              'VAT on buying a commercial vehicle is fully reclaimable where it is used for ' +
              'business. VAT on buying a car almost never is. Double-cab pickups and car-derived ' +
              'vans sit in between and depend on the exact specification — send us the invoice ' +
              'before you buy.',
          },
          {
            title: 'Passenger transport is zero rated at scale',
            body:
              'Transporting passengers in a vehicle designed to carry ten or more people is zero ' +
              'rated. Taxi and private hire in smaller vehicles is standard rated. Freight has ' +
              'its own rules again, and international freight is generally zero rated.',
          },
          {
            title: 'Tolls, congestion charges and parking',
            body:
              'Most road tolls carry VAT and give you a receipt you can reclaim from. The ' +
              'congestion charge and most on-street parking carry no VAT at all. Car park ' +
              'operators normally do. Follow the receipt rather than the habit.',
          },
        ],
      };

    case 'hospitality':
      return {
        heading: 'VAT in hospitality and food',
        intro:
          'Food is the most rate-sensitive area in UK VAT — hot or cold, eaten in or taken away, ' +
          'prepared or not.',
        items: [
          {
            title: 'The hot/cold, in/out grid',
            body:
              'Anything eaten on the premises is standard rated, whatever it is. Hot takeaway ' +
              'food is standard rated. Cold takeaway food is generally zero rated. That single ' +
              'grid decides most of your till — and your point-of-sale system needs to be set up ' +
              'to follow it rather than defaulting everything to 20%.',
          },
          {
            title: 'The exceptions are famous for a reason',
            body:
              'Confectionery, crisps, ice cream, alcohol and soft drinks are standard rated even ' +
              'when cold and taken away. Cakes are zero rated and chocolate-covered biscuits are ' +
              'not. If you are launching a product and cannot place it confidently, ask before ' +
              'you price it.',
          },
          {
            title: 'Service charges, tips and deposits',
            body:
              'A genuinely voluntary tip is outside the scope of VAT. A compulsory service charge ' +
              'is part of the price and carries VAT at the same rate as the meal. Deposits ' +
              'generally create a tax point when taken, so the VAT falls in that quarter rather ' +
              'than the one the booking is for.',
          },
          {
            title: 'Accommodation and the long-stay reduction',
            body:
              'Hotel and similar accommodation is standard rated, but where a guest stays more ' +
              'than 28 continuous days the value on which VAT is due reduces substantially from ' +
              'day 29. If you take long stays, this is worth having set up properly.',
          },
        ],
      };

    case 'retail':
      return {
        heading: 'VAT in retail and e-commerce',
        intro:
          'Mixed rates across a product range, and marketplaces that sometimes account for the ' +
          'VAT instead of you.',
        items: [
          {
            title: 'Your product range probably spans rates',
            body:
              'Children’s clothing, books and most cold food are zero rated; adult clothing ' +
              'and almost everything else is 20%. Get the rate onto the product record in your ' +
              'till or store platform, and the return takes care of itself. Retrofitting rates ' +
              'across a catalogue is painful.',
          },
          {
            title: 'Marketplaces may already have taken the VAT',
            body:
              'Amazon, eBay and Etsy are deemed the supplier for some sales — typically goods ' +
              'sent from overseas, or sold by non-UK sellers — and account for the VAT ' +
              'themselves. Your payout report and your VAT return are then two different figures. ' +
              'Send us the settlement reports, not just the bank deposits.',
          },
          {
            title: 'Retail schemes exist so you do not count every sale',
            body:
              'If you sell at mixed rates in volume, HMRC’s retail schemes let you work out ' +
              'VAT from your takings rather than transaction by transaction. Worth a conversation ' +
              'if your point of sale cannot split the rates cleanly.',
          },
          {
            title: 'Refunds, returns and shipping',
            body:
              'A refund reverses the VAT in the period you make it. Delivery charged alongside ' +
              'goods takes the VAT rate of the goods — so shipping on a zero-rated book is zero ' +
              'rated, and on a jumper it is 20%.',
          },
        ],
      };

    case 'consulting':
      return {
        heading: 'VAT for consultants',
        intro:
          'Straightforward in the UK, with two things worth getting right: expenses you recharge, ' +
          'and clients abroad.',
        items: [
          {
            title: 'Recharged expenses carry your VAT rate, not theirs',
            body:
              'When you rebill travel, hotels or mileage to a client, it forms part of your fee ' +
              'and carries 20% — even where the original cost was zero rated, like a train fare. ' +
              'The exception is a genuine disbursement paid as your client’s agent, which is ' +
              'rarer than people think.',
          },
          {
            title: 'Overseas clients: usually no UK VAT',
            body:
              'Consultancy to a business customer outside the UK is generally supplied where they ' +
              'are, so you do not charge UK VAT. Hold evidence of their business status and ' +
              'location. This is also why a run of zero-VAT sales is entirely normal for some ' +
              'consultants and a red flag for others — tell us which you are.',
          },
          {
            title: 'Your own costs are mostly clean',
            body:
              'Software, training, professional subscriptions, phones and equipment carry ' +
              'reclaimable VAT. Insurance, bank charges and most rent do not. Client entertaining ' +
              'never does. Those five cover the overwhelming majority of a consultant’s ' +
              'ledger.',
          },
          {
            title: 'Watch the threshold as day rates rise',
            body:
              `The ${VAT_THRESHOLD} threshold is a rolling twelve months, not a tax year. A busy ` +
              'run of work can take you past it before an annual view would show anything. ' +
              'Registering late means paying the VAT you should have charged out of your own ' +
              'pocket.',
          },
        ],
      };

    case 'property':
      return {
        heading: 'VAT in property',
        intro:
          'Property is the most technical corner of VAT. The headline: residential letting is ' +
          'exempt, and commercial property depends entirely on whether it has been opted to tax.',
        items: [
          {
            title: 'Residential rent is exempt — and that has a cost',
            body:
              'You charge no VAT on residential rent, and you generally cannot reclaim the VAT on ' +
              'the costs of that property either. Refurbishment VAT on a rental flat is normally ' +
              'not recoverable, which tends to surprise people mid-project rather than before it.',
          },
          {
            title: 'The option to tax changes everything',
            body:
              'A commercial property can be opted to tax, which makes rent and sale proceeds ' +
              'standard rated and, in exchange, makes the VAT on its costs recoverable. It is a ' +
              'formal election with HMRC, it generally lasts twenty years, and it affects who ' +
              'will want to buy or rent from you. Never make one without advice.',
          },
          {
            title: 'Construction rates: new build, conversion, repair',
            body:
              'Building new residential property is zero rated. Converting a property into a ' +
              'different number of dwellings, or renovating one empty for two years or more, is ' +
              'often 5%. Repairs and extensions to an existing home are 20%. Getting the ' +
              'contractor on the right rate at the start saves a great deal.',
          },
          {
            title: 'The Capital Goods Scheme',
            body:
              'Property costing £250,000 or more brings the VAT recovery under review for ten ' +
              'years — if the use of the building changes, the recovery adjusts annually. Tell us ' +
              'about any property purchase or major works before they complete.',
          },
        ],
      };

    case 'beauty':
      return {
        heading: 'VAT in hair, beauty and personal care',
        intro:
          'Services are standard rated throughout — the questions are about chairs, retail ' +
          'products and whose turnover it is.',
        items: [
          {
            title: 'Rent-a-chair arrangements need care',
            body:
              'Whether you are renting out space or renting it, the VAT treatment depends on what ' +
              'is actually supplied. A bare licence to occupy can be exempt; once you bundle in ' +
              'reception, products, booking, laundry or marketing, it usually becomes a standard ' +
              'rated supply of facilities. HMRC looks closely at this. Get the agreement written ' +
              'to match what genuinely happens.',
          },
          {
            title: 'Whose turnover is it?',
            body:
              'If stylists are genuinely self-employed, each has their own turnover and their own ' +
              'threshold. If the salon takes the money and pays them, it is all the ' +
              'salon’s turnover. That single question decides whether the business needed to ' +
              'register at all, so it is worth being certain rather than assuming.',
          },
          {
            title: 'Retail products alongside services',
            body:
              'Shampoo, styling products and gift items sold to clients are standard rated, and ' +
              'the VAT you were charged on that stock is reclaimable. Keep retail sales separable ' +
              'in the till from service income — it makes the return quick and the margin visible.',
          },
          {
            title: 'Treatments are not medical care',
            body:
              'Cosmetic and aesthetic treatments are standard rated. The medical exemption ' +
              'requires a registered practitioner treating a health condition, which very few ' +
              'salon treatments meet. If you are adding anything clinical, check with us first.',
          },
        ],
      };

    case 'general':
    default:
      return {
        heading: 'A few things worth knowing',
        intro:
          'Whatever your trade, these come up often enough to be worth having in the back of your ' +
          'mind.',
        items: [
          variant === 'ltd'
            ? {
                title: 'Company purchases, company invoices',
                body:
                  'To reclaim VAT, the invoice should be in the company’s name. A supplier ' +
                  'account set up personally, or a receipt in your own name, weakens the claim — ' +
                  'and for larger purchases it can lose it entirely. Update your supplier ' +
                  'accounts once and it is solved permanently.',
              }
            : {
                title: 'Keep business spending in a business account',
                body:
                  'VAT is far easier to get right when business costs run through one account. ' +
                  'Personal-card purchases are still reclaimable if you hold the VAT invoice, ' +
                  'but they are the ones that get missed at the quarter end.',
              },
          ...GENERAL_COMMON,
        ],
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Learn centre
// ─────────────────────────────────────────────────────────────────────────

export const HAS_LEARN_CENTRE: Record<VatGuideBrandId, boolean> = {
  clever: true,
  workwell: true,
};

export const LEARN_CENTRE_DOMAIN: Record<VatGuideBrandId, string> = {
  clever: 'cleveraccounts.com',
  workwell: 'workwellaccountancy.com',
};

export interface VatLearnItem {
  title: string;
  blurb: string;
  slug: string;
}

/** Real published articles under the VAT topic in the learn centre. */
export function getLearnItems(d: VatGuideData): VatLearnItem[] {
  const items: VatLearnItem[] = [
    {
      title: 'Making Tax Digital for VAT',
      blurb: 'What MTD requires, and how to stay compliant',
      slug: '/learn/vat/making-tax-digital-for-vat',
    },
    {
      title: 'What VAT you can reclaim',
      blurb: 'Business expenses, rates, and what is blocked',
      slug: '/learn/vat/reclaiming-vat-and-rates',
    },
    {
      title: 'VAT returns, start to finish',
      blurb: 'Preparing and submitting yours on time',
      slug: '/learn/vat/vat-returns-filing',
    },
    {
      title: 'Paying VAT and claiming refunds',
      blurb: 'Payment methods, deadlines and repayments',
      slug: '/learn/vat/vat-payments-and-refunds',
    },
  ];

  if (!d.newlyRegistered) {
    items.push({
      title: 'Registering and deregistering',
      blurb: 'Thresholds, timing, and when to come off',
      slug: '/learn/vat/how-to-register-for-vat',
    });
  }

  return items;
}

// ─────────────────────────────────────────────────────────────────────────
// Sample data for browser preview
// ─────────────────────────────────────────────────────────────────────────

export function buildSampleData(
  brandId: VatGuideBrandId,
  variant: VatVariant,
  scheme: VatScheme,
  sector?: VatSector,
  newlyRegistered?: boolean,
): VatGuideData {
  const brand = BRANDS[brandId];
  return {
    brandId,
    brandName: brand.name,
    variant,
    scheme,
    clientFirstName: 'Sarah',
    companyName: variant === 'ltd' ? 'Mitchell Consulting Ltd' : 'Sarah Mitchell',
    accountant: { name: 'Jimmy Patel', phone: brand.phone },
    support: { email: brand.supportEmail, phone: brand.phone },
    vatNumber: '123 4567 89',
    effectiveDate: '1 April 2026',
    firstReturnPeriod: '1 April to 30 June 2026',
    firstReturnDeadline: '7 August 2026',
    quarterEnds: 'March, June, September and December',
    flatRatePercent: scheme === 'flat-rate' ? 14.5 : undefined,
    flatRateCategory: scheme === 'flat-rate' ? 'Management consultancy' : undefined,
    firstYearDiscount: scheme === 'flat-rate',
    newlyRegistered: newlyRegistered ?? true,
    hmrcAuthorised: false,
    directDebit: false,
    sector: sector ?? 'general',
  };
}
