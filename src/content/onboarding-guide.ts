/**
 * Onboarding Guide — content + data model.
 *
 * A welcome pack rendered as a branded page and turned into a PDF by headless
 * Chrome. Content is dynamic on several axes:
 *   • variant      — Limited Company (new/existing) vs Sole Trader
 *   • vatStatus    — Account.VAT_Status__c picklist
 *   • payeStatus   — Account.PAYE_Status__c picklist
 *   • clientType   — Account.Client_type__c ('PSC' surfaces IR35)
 *   • dates.*      — onboarding call dates from the NCW
 *   • calendlyUrl  — surfaced when the accountant has Calendly enabled
 *
 * ⚠️ The tax/technical copy (deadlines, FAQs, quick wins, VAT, PAYE, IR35,
 * director duties) is a Claude draft and still needs an accountant accuracy/
 * compliance review before going to clients.
 */

import { BRANDS } from '@/lib/constants';

export type GuideVariant = 'ltd-new' | 'ltd-existing' | 'sole';
export type GuideBrandId = 'clever' | 'workwell';
export type SectionIconKey = 'director' | 'formation' | 'bank' | 'vat' | 'paye' | 'ir35' | 'freeagent';

/** A dated onboarding milestone. `date` is a pre-formatted string or null. */
export interface JourneyDate {
  welcomeCall: string | null;
  mainCall: string | null;
  portalTraining: string | null;
  catchUp: string | null;
}

/** Everything the guide needs to render for one client. */
export interface OnboardingGuideData {
  brandId: GuideBrandId;
  brandName: string;
  variant: GuideVariant;
  clientFirstName: string;
  companyName: string;
  accountant: { name: string; email: string; phone: string; photoUrl?: string };
  dates: JourneyDate;
  support: { email: string; phone: string };
  vatStatus?: string;
  payeStatus?: string;
  clientType?: string;
  calendlyUrl?: string;
}

export interface GuideSection {
  id: string;
  icon: SectionIconKey;
  title: string | ((d: OnboardingGuideData) => string);
  body: (d: OnboardingGuideData) => string;
  shouldShow: (d: OnboardingGuideData) => boolean;
}

const isLtd = (d: OnboardingGuideData) =>
  d.variant === 'ltd-new' || d.variant === 'ltd-existing';

// ─────────────────────────────────────────────────────────────────────────
// Welcome paragraph + accountant strip
// ─────────────────────────────────────────────────────────────────────────

export function welcomeIntro(d: OnboardingGuideData): string {
  return (
    `Welcome to ${d.brandName}, ${d.clientFirstName}. We're really glad you've ` +
    `chosen us, and we'll do our utmost to make this the easiest accountancy ` +
    `switch you've made. This is your welcome pack — it walks you through ` +
    `what happens next, what you can expect from us, and the things that ` +
    `matter most as we get started together.`
  );
}

export const ACCOUNTANT_BIO =
  'Your day-to-day point of contact for everything — calls, emails, questions, ' +
  'advice — and the person who will guide you through each of the phases below.';

// ─────────────────────────────────────────────────────────────────────────
// Get started — your first three actions
// ─────────────────────────────────────────────────────────────────────────

export const ENGAGEMENT_LETTER_EXPLANATION =
  "Before we can act for you, we need a signed engagement letter. It's the " +
  "legal agreement that sets out exactly what we'll do for you, what we'll " +
  "need from you, and how we work together — it protects both sides and is " +
  "required by professional accounting standards. Your letter is on its way " +
  "by email; please review and sign as soon as you can.";

export function credasExplanation(d: OnboardingGuideData): string {
  if (d.variant === 'sole') {
    return (
      "As the owner of the business, you need to complete an identity check. " +
      "This is a legal requirement under HMRC's anti-money-laundering rules — " +
      "we can't begin work for you until it's done. You'll receive an SMS or " +
      "email from Credas with a unique link; it takes about five minutes."
    );
  }
  return (
    `Every officer of ${d.companyName} — all directors and shareholders with ` +
    `significant control — must complete an identity check. This is a legal ` +
    `requirement under HMRC's anti-money-laundering rules; we can't begin work ` +
    `for the company until each person is verified. Each will receive an SMS ` +
    `or email from Credas with a unique link; it takes about five minutes each.`
  );
}

export function introCallExplanation(d: OnboardingGuideData): string {
  return d.dates.welcomeCall
    ? `Your introductory call is booked for ${d.dates.welcomeCall}. We'll talk through your business, answer any questions, and agree the next steps.`
    : "We'll talk through your business, answer any questions, and agree the next steps. Most clients are booked in within a couple of days of signing up — pick a time that suits.";
}

// ─────────────────────────────────────────────────────────────────────────
// 01 — How we'll work with you (three phases)
// ─────────────────────────────────────────────────────────────────────────

export const WORKING_PHASES: { num: string; title: string; body: string }[] = [
  {
    num: '01',
    title: 'Understand',
    body:
      "We start by getting to know your business inside out — what you do, how " +
      "you trade, your goals for the next year and beyond. Our introductory and " +
      "main onboarding calls are where we build the picture: you, your " +
      "circumstances, and what success looks like for you.",
  },
  {
    num: '02',
    title: 'Why you need us',
    body:
      "We identify the things that matter most — tax efficiency, compliance with " +
      "HMRC and Companies House, freeing up your time, planning for growth. " +
      "We're not just here to file your accounts; we help you understand where " +
      "you stand today and where we can take you next.",
  },
  {
    num: '03',
    title: 'Where we can deliver value',
    body:
      "The proactive work that makes the difference: year-round advice, tax " +
      "savings spotted before they're missed, real-time visibility on your " +
      "numbers, and a phone call away whenever questions come up. The " +
      "relationship doesn't stop when the accounts are filed.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// 02 — What you can expect from us
// ─────────────────────────────────────────────────────────────────────────

export const WHAT_TO_EXPECT: { title: string; body: string }[] = [
  {
    title: 'Replies within 24 working hours',
    body: 'Most emails get a same-day answer — we treat them as work, not interruptions.',
  },
  {
    title: 'Unlimited advice — no clock ticking',
    body:
      'Call or email as often as you need. No per-question fees, no "billable time" ' +
      'creeping into your invoice.',
  },
  {
    title: 'Proactive deadline reminders',
    body:
      'We chase you for what we need well before HMRC or Companies House does. ' +
      'No surprise letters, no last-minute rushes.',
  },
  {
    title: 'An annual review meeting',
    body:
      "Once a year we sit down (or video) to look ahead — at your numbers, your " +
      "tax position, and what we can do better.",
  },
  {
    title: 'Real-time visibility on FreeAgent',
    body:
      'You see what we see — your figures, your tax estimate, your VAT due — ' +
      'refreshed daily and always accessible.',
  },
  {
    title: 'Plain-English explanations',
    body:
      "We won't bury you in jargon. If something matters, we'll explain it like " +
      "a friend would.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// 03 — How and when to reach us
// ─────────────────────────────────────────────────────────────────────────

export type ContactChannelIcon = 'mail' | 'phone' | 'monitor' | 'calendar';

export const CONTACT_CHANNELS: {
  iconKey: ContactChannelIcon;
  label: string;
  description: string;
}[] = [
  {
    iconKey: 'mail',
    label: 'Email your accountant',
    description: "Quick questions or day-to-day items — your accountant's direct email is your first port of call.",
  },
  {
    iconKey: 'phone',
    label: 'Phone the office',
    description: "For longer conversations or anything time-sensitive. We'll route you or take a message.",
  },
  {
    iconKey: 'monitor',
    label: 'Log in to FreeAgent',
    description: 'Numbers, receipts, invoices, dashboards — the single source of truth for your finances.',
  },
  {
    iconKey: 'calendar',
    label: 'Book a Calendly slot',
    description: "Anything that needs a scheduled call — pick a slot directly from your accountant's calendar.",
  },
];

export const OFFICE_HOURS =
  'Office hours: Monday to Friday, 8:30 am – 5:30 pm. If your accountant is on ' +
  "leave, the team picks up — you'll never be without someone who knows your account.";

// ─────────────────────────────────────────────────────────────────────────
// 04 — Getting set up the right way (educational essentials)
// ─────────────────────────────────────────────────────────────────────────

function vatTitle(status: string | undefined): string {
  switch (status) {
    case 'Existing VAT registration':
      return 'Your existing VAT registration';
    case 'Needs VAT registration':
      return 'Setting up your VAT registration';
    case 'Not VAT registered':
      return "VAT — you're under the threshold";
    default:
      return 'VAT — when to register';
  }
}

function vatBody(d: OnboardingGuideData): string {
  let base: string;
  switch (d.vatStatus) {
    case 'Existing VAT registration':
      base =
        "You have an existing VAT registration, which we'll take over and run for you. We " +
        "will prepare and submit your VAT returns and make sure you stay on the right scheme " +
        "for your business. If you would like us to review whether you're on the most " +
        "tax-efficient scheme (flat rate, cash accounting, standard), just ask.";
      break;
    case 'Needs VAT registration':
      base =
        "Based on what you've told us, you need to register for VAT. We'll handle the " +
        "registration with HMRC and get you set up on the most suitable scheme for your " +
        "business. We will be in touch shortly with what we need from you to get this moving.";
      break;
    case 'Not VAT registered':
      base =
        "You're not currently VAT-registered, which is fine while your taxable turnover " +
        "stays under the VAT registration threshold (measured over a rolling 12-month " +
        "period). We'll keep an eye on this as part of your service and flag when you're " +
        "getting close. If voluntary registration would suit your business — for example if " +
        "you mainly sell to other VAT-registered businesses — we can talk through the pros " +
        "and cons.";
      break;
    default:
      base =
        "You must register for VAT once your taxable turnover passes the VAT registration " +
        "threshold over a rolling 12-month period. Below that, it's optional. Voluntary " +
        "registration can be worthwhile — you can reclaim VAT on purchases and it can make " +
        "the business look more established — but it adds admin and means charging VAT to " +
        "your customers, which doesn't suit everyone. We will look at your numbers and " +
        "customers and advise what makes sense.";
  }
  if (d.clientType === 'PSC') {
    base +=
      '\n\n' +
      "As a contractor working through a personal service company, the Flat Rate VAT " +
      "scheme is worth considering. You charge clients VAT at the standard rate but pay " +
      "HMRC a lower fixed percentage of your gross turnover, keeping the difference. " +
      "It has been popular with many contractors, though 'limited-cost' " +
      "businesses face a higher rate that often makes it less attractive — so it " +
      "isn't always the right fit. We will review whether the Flat Rate scheme would " +
      "benefit you when we look at your VAT position.";
  }
  return base;
}

function payeTitle(d: OnboardingGuideData): string {
  if (d.variant === 'sole') return 'PAYE — for any staff you take on';
  switch (d.payeStatus) {
    case 'Existing PAYE registration':
      return "Your director's payroll";
    case 'Needs PAYE registration':
      return "Setting up your director's payroll";
    case 'Not PAYE registered':
      return "Drawing a director's salary";
    default:
      return 'Paying yourself tax-efficiently';
  }
}

function payeBody(d: OnboardingGuideData): string {
  if (d.variant === 'sole') {
    switch (d.payeStatus) {
      case 'Existing PAYE registration':
        return (
          "You have a PAYE scheme set up for your staff. We will run the monthly payroll " +
          "and handle the RTI submissions to HMRC. As a sole trader you don't pay yourself " +
          "a salary — your profits are taxed via Self Assessment, which we will also handle."
        );
      case 'Needs PAYE registration':
        return (
          "You need a PAYE scheme set up — typically because you're taking on staff. As a " +
          "sole trader you don't pay yourself a salary; your profits ARE your income, taxed " +
          "via Self Assessment. We will register the scheme with HMRC and run the payroll " +
          "once it's live."
        );
      case 'Not PAYE registered':
      default:
        return (
          "As a sole trader you don't pay yourself a salary — your profits are taxed via " +
          "Self Assessment, which we handle for you. If you take on any staff in future you " +
          "will need a PAYE scheme; just let us know and we will get it set up."
        );
    }
  }
  switch (d.payeStatus) {
    case 'Existing PAYE registration':
      return (
        "You have PAYE set up. We will run your monthly payroll and handle the RTI " +
        "submissions to HMRC. For most directors, a modest salary combined with dividends " +
        "is more tax-efficient than taking everything as salary — particularly if you have " +
        "little or no other income this year. If you would like us to review your salary " +
        "and dividend split, just ask."
      );
    case 'Needs PAYE registration':
      return (
        "You need PAYE set up to draw a director's salary. We will register the scheme for " +
        "you and recommend an amount that's tax-efficient for your circumstances. For most " +
        "directors with no other income this year, a small salary up to the National " +
        "Insurance threshold combined with dividends works out best — but the right " +
        "approach depends on your other income, profit and pension plans."
      );
    case 'Not PAYE registered':
      return (
        "You don't have PAYE set up yet. For most directors, drawing a small salary " +
        "combined with dividends is more tax-efficient than taking everything as one or " +
        "the other — particularly if this is your only income for the year. We will talk " +
        "through what works for your situation and, if you would like a salary, set up " +
        "PAYE for you and recommend the right amount."
      );
    default:
      return (
        "For most directors, a modest salary combined with dividends is more tax-efficient " +
        "than taking everything as salary — especially if you have no other income during " +
        "the year. The right split depends on your circumstances (other income, profit, " +
        "pension plans). We will recommend a salary and dividend approach tailored to you, " +
        "and revisit it as things change."
      );
  }
}

const SECTIONS: GuideSection[] = [
  {
    id: 'director',
    icon: 'director',
    title: 'Your responsibilities as a director',
    shouldShow: isLtd,
    body: () =>
      "Becoming a director comes with real legal responsibilities. In short: filing the " +
      "annual accounts and confirmation statement with Companies House on time, keeping " +
      "accurate accounting records, paying the company's tax by the deadlines, declaring " +
      "any personal interests in company decisions, and keeping company money strictly " +
      "separate from your personal finances. We handle the filings and reminders for you " +
      "— but the legal duty sits with the director, so it's worth knowing the basics.",
  },
  {
    id: 'formation',
    icon: 'formation',
    title: 'Forming your company — what we need',
    shouldShow: (d) => d.variant === 'ltd-new',
    body: (d) =>
      `To incorporate ${d.companyName} we'll need your preferred company name, a registered ` +
      "office address, and for every director and shareholder their full name, date of " +
      "birth, home address and nationality. We will also confirm your share split and the " +
      "nature of your business (SIC code). Companies House requires these to register the " +
      "company, and the ID details support the anti-money-laundering checks we are legally " +
      "required to complete. Your share split sets out who owns the company and how " +
      "dividends can be paid, so it's worth getting right from day one.",
  },
  {
    id: 'bank',
    icon: 'bank',
    title: 'Your business bank account',
    shouldShow: isLtd,
    body: () =>
      "Limited companies must keep company and personal finances separate, so a dedicated " +
      "business bank account is essential. If you don't have one yet, open one as soon as " +
      "the company is incorporated. Modern digital business banks (Tide, Starling, Mettle " +
      "and others) are usually quickest to set up and integrate cleanly with FreeAgent. " +
      "Let us know which provider you choose and we'll make sure FreeAgent is connected.",
  },
  {
    id: 'vat',
    icon: 'vat',
    title: (d) => vatTitle(d.vatStatus),
    shouldShow: () => true,
    body: (d) => vatBody(d),
  },
  {
    id: 'paye',
    icon: 'paye',
    title: (d) => payeTitle(d),
    shouldShow: () => true,
    body: (d) => payeBody(d),
  },
  {
    id: 'ir35',
    icon: 'ir35',
    title: 'IR35 — your contract review',
    shouldShow: (d) => d.clientType === 'PSC',
    body: () =>
      "If you provide services through your limited company, IR35 decides whether HMRC " +
      "treats you as genuinely self-employed or effectively an employee for tax — and " +
      "getting it wrong can be expensive. We offer a contract review on any current or " +
      "future contract to assess your position and tell you whether each engagement falls " +
      "inside or outside IR35. Just ask your accountant when you'd like one — it's " +
      "included with your service.",
  },
  {
    id: 'freeagent',
    icon: 'freeagent',
    title: 'Your accounting software — FreeAgent',
    shouldShow: () => true,
    body: () =>
      "FreeAgent is included free with your package. It lets you raise invoices, record " +
      "expenses, connect your bank, and see your tax position in real time. We will get " +
      "your account set up and walk you through it on your portal training session, so " +
      "you're comfortable using it from the start.",
  },
];

export function getSections(d: OnboardingGuideData): GuideSection[] {
  return SECTIONS.filter((s) => s.shouldShow(d));
}

export function sectionTitle(s: GuideSection, d: OnboardingGuideData): string {
  return typeof s.title === 'function' ? s.title(d) : s.title;
}

// ─────────────────────────────────────────────────────────────────────────
// 05 — Key deadlines for your year
// ─────────────────────────────────────────────────────────────────────────

export function getDeadlines(variant: GuideVariant): { label: string; when: string }[] {
  if (variant === 'sole') {
    return [
      { label: 'Self Assessment return (online)', when: '31 January, for the tax year ending the previous 5 April' },
      { label: 'Self Assessment tax payment', when: '31 January, alongside the return' },
      { label: 'Payments on Account (if applicable)', when: '31 January and 31 July each year' },
      { label: 'Self Assessment return (paper)', when: '31 October, if you choose paper instead of online' },
      { label: 'VAT returns (if registered)', when: '1 month and 7 days after each quarter-end' },
      { label: 'Payroll RTI (if you employ staff)', when: 'Each pay run, plus 19th of the month to HMRC' },
    ];
  }
  return [
    { label: 'Year-end accounts to Companies House', when: '9 months after your accounting year-end' },
    { label: 'Corporation Tax payment to HMRC', when: '9 months and 1 day after your year-end' },
    { label: 'Corporation Tax return (CT600)', when: '12 months after your year-end' },
    { label: 'Confirmation Statement to Companies House', when: 'Annually, on the anniversary of incorporation' },
    { label: 'Self Assessment (if you draw a salary or dividends)', when: '31 January, for the prior tax year' },
    { label: 'VAT returns (if registered)', when: '1 month and 7 days after each quarter-end' },
    { label: 'Payroll RTI (if you run PAYE)', when: 'Each pay run, plus 19th of the month to HMRC' },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// 05 — Common questions in your first month
//
// Sourced from the top topics in the 12-month inbound-question seed
// (scratch/learn-seed/final-seed.md). Each FAQ optionally carries a `slug`
// pointing at the brand's learn-centre article — the component renders a
// "Read the full article →" link when both (a) the brand has a learn centre
// and (b) the slug is set. Slugs that don't yet exist as articles should be
// omitted (set undefined) so no broken links ship.
// ─────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  q: string;
  a: string;
  /** Relative path on the brand's learn centre, e.g. "/learn/...". When set
   *  AND the brand has a learn centre, a "Read the full article →" link
   *  renders below the answer. */
  slug?: string;
}

export function getFaqs(d: OnboardingGuideData): FaqItem[] {
  if (d.variant === 'sole') {
    // Top sole-trader topics from the seed: SA payments (44), SA registration/
    // UTR (28), allowable expenses (~74 across Expenses), record-keeping
    // (Bookkeeping + general).
    return [
      {
        q: 'How and when do I pay my Self-Assessment tax bill?',
        a:
          "Your tax for the year ending 5 April is due by the following 31 January, paid " +
          "via HMRC's online portal. If you owe more than £1,000 you'll usually also have " +
          "Payments on Account due 31 January and 31 July. We'll send the figures and a " +
          "guide well before each deadline.",
        slug: '/learn/paying-your-self-assessment-tax',
      },
      {
        q: 'How do I register for Self-Assessment and get my UTR?',
        a:
          "If you're new to self-employment, HMRC needs to issue you a UTR (Unique " +
          "Taxpayer Reference) before you can file. Registration usually takes about 10 " +
          "working days — we can do it for you, just send us your details.",
        slug: '/learn/registering-for-self-assessment-utr',
      },
      {
        q: 'Can I claim this as a business expense?',
        a:
          "If it's genuinely for the business, yes. Some costs (use of home, mileage) " +
          "have set allowances. The grey areas are usually the interesting bits — ask us " +
          "before claiming.",
        slug: '/learn/allowable-business-expenses',
      },
      {
        q: 'What records do I need to keep, and for how long?',
        a:
          'Income, expenses, bank statements and a mileage log — anything HMRC could ask ' +
          'for over the next six years. FreeAgent handles most of this; snap receipts on ' +
          'the mobile app as they happen.',
        slug: '/learn/record-keeping-essentials',
      },
    ];
  }

  // Limited Company — top topics from the seed: Companies House ID
  // verification (93), corporation tax payments (24), director salary/dividend
  // strategy (14), allowable expenses, officer/details changes (31).
  const ltdBase: FaqItem[] = [
    {
      q: 'How do I complete Companies House ID verification?',
      a:
        'Every director and Person with Significant Control (PSC) must verify their ' +
        "identity directly with Companies House — it's a statutory requirement. You can " +
        'do it via the Companies House identity service, GOV.UK One Login, or an ' +
        "authorised provider. We'll guide you to the right route for your situation.",
      slug: '/learn/companies-house-id-verification',
    },
    {
      q: 'How do I pay myself — salary and dividends?',
      a:
        "Most directors take a modest salary (around the NI threshold) plus dividends " +
        "from after-tax profit. We'll recommend the right mix for your circumstances and " +
        "set up PAYE if you don't already have it.",
      slug: '/learn/director-salary-and-dividends',
    },
    {
      q: 'How and when do I pay my corporation tax?',
      a:
        '9 months and 1 day after your accounting year-end. The return (CT600) is due 12 ' +
        "months after — we'll prepare both well before each deadline.",
      slug: '/learn/paying-corporation-tax',
    },
    {
      q: 'Can I claim this as a business expense?',
      a:
        "If it's genuinely 'wholly and exclusively' for the business, yes. The grey " +
        "areas are usually the interesting bits — ask us before claiming.",
      slug: '/learn/allowable-business-expenses',
    },
  ];

  // PSC contractor — IR35 is the standout topic for this profile, so swap
  // the generic "update company details" question for the IR35 one.
  if (d.clientType === 'PSC') {
    return [
      ...ltdBase,
      {
        q: 'How do I know if my contract is inside or outside IR35?',
        a:
          "IR35 looks at whether HMRC would treat you as an employee if your limited " +
          "company didn't exist. We offer a contract review on any current or future " +
          "engagement to assess your position — just ask when you'd like one.",
        slug: '/learn/ir35-explained',
      },
    ];
  }

  return [
    ...ltdBase,
    {
      q: "How do I update my company's details or officers?",
      a:
        'We can file most changes (registered address, SIC code, director appointments, ' +
        'share transfers) with Companies House on your behalf — just let us know what has ' +
        'changed.',
      slug: '/learn/updating-company-details',
    },
  ];
}

/** Which brands have a learn centre live. Used by the component to decide
 *  whether to render the "Read the full article →" link AND the "Where to
 *  learn more" tile panel. Flip to true once Workwell ships its own learn
 *  centre. */
export const HAS_LEARN_CENTRE: Record<GuideBrandId, boolean> = {
  clever: true,
  workwell: false,
};

// ─────────────────────────────────────────────────────────────────────────
// Where to learn more — tile panel pointing at the learn-centre hubs
// ─────────────────────────────────────────────────────────────────────────

export type LearnTopicIconKey =
  | 'expenses'
  | 'taxsaving'
  | 'freeagent'
  | 'selfassessment'
  | 'director'
  | 'companieshouse'
  | 'ir35';

export interface LearnTopic {
  iconKey: LearnTopicIconKey;
  title: string;
  blurb: string;
  slug: string;
}

/** Topic tiles for the "Where to learn more" panel. Variant-aware so the
 *  panel shows the topics a given client is most likely to want — and stays
 *  short (4–6 tiles). Slugs point to learn-centre HUB pages. */
export function getLearnTopics(d: OnboardingGuideData): LearnTopic[] {
  const common: LearnTopic[] = [
    {
      iconKey: 'expenses',
      title: 'Expenses guide',
      blurb: 'What you can claim and how to record it',
      slug: '/learn/expenses',
    },
    {
      iconKey: 'taxsaving',
      title: 'Tax-saving guides',
      blurb: 'Reliefs, allowances and quick wins',
      slug: '/learn/tax-saving',
    },
    {
      iconKey: 'freeagent',
      title: 'FreeAgent how-tos',
      blurb: 'Day-to-day software walkthroughs',
      slug: '/learn/freeagent',
    },
  ];

  if (d.variant === 'sole') {
    return [
      ...common,
      {
        iconKey: 'selfassessment',
        title: 'Self-Assessment',
        blurb: 'Filing, deadlines, payments and UTR',
        slug: '/learn/self-assessment',
      },
    ];
  }

  const ltdExtras: LearnTopic[] = [
    {
      iconKey: 'director',
      title: "Director's guide",
      blurb: 'Your legal duties at a glance',
      slug: '/learn/director-responsibilities',
    },
    {
      iconKey: 'companieshouse',
      title: 'Companies House essentials',
      blurb: 'ID verification, filings, confirmation statements',
      slug: '/learn/companies-house',
    },
  ];

  if (d.clientType === 'PSC') {
    ltdExtras.push({
      iconKey: 'ir35',
      title: 'IR35 explained',
      blurb: 'Inside vs outside, contract reviews',
      slug: '/learn/ir35',
    });
  }

  return [...common, ...ltdExtras];
}

// ─────────────────────────────────────────────────────────────────────────
// 07 — Quick wins for your first year (replaces the old "Good to know" tips)
// ─────────────────────────────────────────────────────────────────────────

export function getQuickWins(variant: GuideVariant): { title: string; body: string }[] {
  if (variant === 'sole') {
    return [
      {
        title: 'Keep business and personal money separate',
        body:
          'A dedicated business bank account makes your accounts simpler and your tax ' +
          'position clearer from day one.',
      },
      {
        title: 'Track every business mile',
        body:
          'HMRC allows 45p/mile for the first 10,000 business miles each year, 25p ' +
          'thereafter. It adds up faster than you would expect — keep a simple log or ' +
          "use FreeAgent's mobile app.",
      },
      {
        title: 'Claim use-of-home allowance',
        body:
          'If you work from home, you can claim a fixed amount (currently £6/week, no ' +
          'receipts needed) or a proportion of actual costs. Easy win.',
      },
      {
        title: "Don't forget pre-trading expenses",
        body:
          'Costs incurred up to seven years before trading started can usually be ' +
          'claimed — laptops, training, professional fees. Tell us what you spent.',
      },
      {
        title: 'Set aside for tax as you earn',
        body:
          'A simple rule: park 25-30% of every payment in a separate "tax pot" account. ' +
          "January feels far less stressful when the money's already there.",
      },
    ];
  }
  return [
    {
      title: 'Keep business and personal money separate',
      body:
        'A dedicated business bank account makes your accounts simpler and your tax ' +
        'position clearer from day one.',
    },
    {
      title: 'Set Corporation Tax aside as you earn',
      body:
        'Treat it as money that was never yours to spend — ringfence a percentage of ' +
        'every profit-making month and there is no surprise bill at year-end.',
    },
    {
      title: 'Pay pension contributions through the company',
      body:
        "They're a tax-deductible expense for the company AND don't touch your personal " +
        'salary or dividend tax. Worth reviewing with us early.',
    },
    {
      title: "Don't forget pre-trading expenses",
      body:
        'Costs incurred up to seven years before trading started can usually be ' +
        'claimed — laptops, training, professional fees. Tell us what you spent.',
    },
    {
      title: 'Trivial benefits — small thanks, big saving',
      body:
        'You can give yourself (as a director) up to £300 a year and each employee up ' +
        'to £50 per occasion in non-cash gifts, tax-free. Coffees, lunches, birthday ' +
        'treats — keep the receipts.',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// 08 — Things to think about (looking out for the business)
//
// Deliberate framing: NOT upsell. These are gaps a new business owner
// usually doesn't know exist, where the consequence of missing them is real
// (legal requirement, statutory fine, or uninsured loss). Tone is "we're
// looking out for you" — not "here's another bill" and not distancing
// ("not our problem"). Title and lead copy in OnboardingGuide.tsx are
// aligned with that framing.
//
// Insurance copy is variant-aware off clientType:
//   • 'PSC'        → we have a streamlined block-style policy for contractors,
//                    surfaced without naming the product (the accountant
//                    follows up with details). One line covers PI + PL + cover
//                    requirements typically asked for in IT/engineering
//                    contracts.
//   • 'SME' / etc. → we'd refer to a specialist commercial broker for a
//                    bespoke quote. Provider name intentionally not in the
//                    PDF — keeps the doc evergreen if partner ever changes.
// ─────────────────────────────────────────────────────────────────────────

export type ThingsIconKey =
  | 'insurance'
  | 'ico'
  | 'bank'
  | 'cyber'
  | 'ip'
  | 'pension';

export interface ThingsItem {
  iconKey: ThingsIconKey;
  title: string;
  body: string;
}

function insuranceItem(d: OnboardingGuideData): ThingsItem {
  if (d.clientType === 'PSC') {
    return {
      iconKey: 'insurance',
      title: 'Contractor insurance (PI + PL)',
      body:
        'Most contracts require Professional Indemnity and Public Liability cover ' +
        'before you can start work, and many agencies set specific minimum limits. ' +
        "We have a streamlined option built for contractors — ask your accountant if " +
        "you'd like the details.",
    };
  }
  if (d.clientType === 'SME') {
    return {
      iconKey: 'insurance',
      title: 'Business insurance',
      body:
        'Your cover needs depend on what you do, who you employ and where you work — ' +
        'Public Liability, Employer’s Liability (legally required from your first ' +
        'employee), Professional Indemnity, business interruption and cyber are the ' +
        'usual mix. We can introduce you to a specialist commercial broker for a ' +
        'bespoke quote — just ask.',
    };
  }
  return {
    iconKey: 'insurance',
    title: 'Business insurance',
    body:
      'Even as a smaller operation, Public Liability and Professional Indemnity cover ' +
      'protect you against claims that can dwarf a year’s profit. We can point ' +
      'you to a specialist broker if you’d like a bespoke quote — just ask.',
  };
}

export function getThingsToThinkAbout(d: OnboardingGuideData): ThingsItem[] {
  const items: ThingsItem[] = [insuranceItem(d)];

  // ICO registration — applies broadly; legal requirement if you process
  // personal data (which almost every business does — customer email, payroll,
  // suppliers).
  items.push({
    iconKey: 'ico',
    title: 'ICO registration (data protection fee)',
    body:
      'If you process personal data — customers, suppliers, employees — you almost ' +
      'certainly need to register with the Information Commissioner’s Office and ' +
      'pay an annual fee (currently £40–£60 for most small businesses). ' +
      'Statutory; missing it can attract a fine.',
  });

  // Business bank account — for Ltd this is essentially required; for sole
  // traders it's strong best practice, not a legal must.
  if (d.variant !== 'sole') {
    items.push({
      iconKey: 'bank',
      title: 'A dedicated business bank account',
      body:
        'Your limited company is a separate legal entity, so its money has to live in ' +
        'its own account — not yours. Most banks open a basic business account quickly; ' +
        'we can point you to providers our clients rate if you’d like a steer.',
    });
  } else {
    items.push({
      iconKey: 'bank',
      title: 'Keep business and personal money separate',
      body:
        'Not strictly required for a sole trader, but a dedicated business account ' +
        'makes bookkeeping, tax and VAT (if you register) dramatically easier — and ' +
        'protects you in an HMRC enquiry.',
    });
  }

  // Cyber awareness — universally applicable.
  items.push({
    iconKey: 'cyber',
    title: 'Basic cyber hygiene',
    body:
      'Unique passwords on a password manager, two-factor authentication on your ' +
      'email, accounting software and HMRC login, and a healthy scepticism of urgent ' +
      'payment requests. Most small-business losses start with a compromised email ' +
      'inbox.',
  });

  // Trade marks / IP — only worth flagging for new Ltds (those building a
  // brand from day one); sole traders rarely have brand assets to protect.
  if (d.variant === 'ltd-new') {
    items.push({
      iconKey: 'ip',
      title: 'Protect your name and brand',
      body:
        'A company name registered at Companies House does NOT give you trade mark ' +
        'rights. If your business name, logo or product name matters to you, a UK ' +
        'trade mark registration (currently from £170 via the IPO) gives you exclusive ' +
        'rights and is well worth the price.',
    });
  }

  // Pension auto-enrolment — only when employer status (PAYE) applies.
  if (d.payeStatus === 'Existing PAYE registration' || d.payeStatus === 'Needs PAYE registration') {
    items.push({
      iconKey: 'pension',
      title: 'Pension auto-enrolment',
      body:
        'As soon as you employ someone other than a single director, you have to set ' +
        'up a workplace pension and enrol eligible employees. The Pensions Regulator ' +
        'writes to you with a staging date — we’ll prompt you when it lands.',
    });
  }

  return items;
}

// HMRC scam awareness — fixed copy, surfaced as a callout at the bottom of
// Section 08. Real client harm averted by this is significant: HMRC-impersonation
// SMS, "tax refund" emails, and "you owe tax, pay now" phone calls cost UK
// taxpayers tens of millions a year. The rule is simple: HMRC never asks for
// payment by SMS, never threatens immediate arrest, and never asks for
// passwords or card details.
export const HMRC_SCAM_WARNING = {
  title: 'HMRC and Companies House scams — read this',
  lead:
    "We see this monthly: a client gets a convincing-looking SMS, email or phone " +
    "call claiming to be from HMRC or Companies House, often urgent and threatening. " +
    "Almost all of it is fraud.",
  rules: [
    'HMRC will never text you a link to claim a tax refund, or ask for card or password details by SMS or email.',
    'HMRC will never threaten you with arrest or immediate police action over the phone.',
    'Companies House do not phone you to demand payment for your confirmation statement.',
    'When in doubt, hang up / delete / forward to us. We can confirm whether anything is real in minutes.',
  ],
};

// Open invitation that belongs near the contact channels — many clients sit
// on letters for weeks before flagging. Encouraging immediate forwarding is
// the cheapest preventable-loss measure we have.
export const FORWARD_ANYTHING =
  'Forward us anything from HMRC, Companies House or your bank — even if it looks like spam. ' +
  "We’d rather see it and confirm it's nothing than miss something that mattered.";

// ─────────────────────────────────────────────────────────────────────────
// The team behind your accountant
// ─────────────────────────────────────────────────────────────────────────

export const TEAM_INTRO =
  "Your accountant doesn't work alone — they're backed by a team of specialists. If " +
  'you ever need an extra pair of eyes, they bring in the right person at no extra ' +
  "cost. It's all part of your service.";

export const TEAM_ROLES: { role: string; description: string }[] = [
  { role: 'Senior tax adviser', description: 'Complex planning and HMRC enquiries' },
  { role: 'Payroll specialist', description: 'PAYE, P11Ds, year-end submissions' },
  { role: 'VAT specialist', description: 'Scheme advice, registrations, complex VAT' },
  { role: 'IR35 advisor', description: 'Contract reviews and status assessments' },
];

// ─────────────────────────────────────────────────────────────────────────
// Sample data for browser preview
// ─────────────────────────────────────────────────────────────────────────

export function buildSampleData(
  brandId: GuideBrandId,
  variant: GuideVariant,
): OnboardingGuideData {
  const brand = BRANDS[brandId];
  const isSole = variant === 'sole';

  let vatStatus: string | undefined;
  let payeStatus: string | undefined;
  let clientType: string | undefined;
  let welcomeCall: string | null = 'Tue 26 May 2026';
  const calendlyUrl: string | undefined = 'https://calendly.com/sample-accountant';
  if (variant === 'ltd-new') {
    vatStatus = 'Not VAT registered';
    payeStatus = 'Needs PAYE registration';
    clientType = 'PSC';
  } else if (variant === 'ltd-existing') {
    vatStatus = 'Existing VAT registration';
    payeStatus = 'Existing PAYE registration';
    // SME so the design-review preview surfaces the SME-broker insurance copy
    // for Section 08. Real-world distribution: existing Ltds split between
    // 'SME' and 'PSC' — both branches need exercising in preview.
    clientType = 'SME';
  } else {
    vatStatus = 'Needs VAT registration';
    payeStatus = 'Not PAYE registered';
    clientType = undefined;
    welcomeCall = null;
  }

  return {
    brandId,
    brandName: brand.name,
    variant,
    clientFirstName: 'Sarah',
    companyName: isSole ? 'Sarah Mitchell' : 'Mitchell Consulting Ltd',
    accountant: {
      name: 'Jimmy Patel',
      email: brandId === 'clever' ? 'jimmy@cleveraccounts.com' : 'jimmy@workwellsolutions.com',
      phone: brand.phone,
      photoUrl: 'https://i.pravatar.cc/240?img=12',
    },
    dates: {
      welcomeCall,
      mainCall: 'Fri 29 May 2026',
      portalTraining: 'Wed 3 Jun 2026',
      catchUp: null,
    },
    support: { email: brand.supportEmail, phone: brand.phone },
    vatStatus,
    payeStatus,
    clientType,
    calendlyUrl,
  };
}
