/**
 * Onboarding Guide — content + data model.
 *
 * A per-client welcome guide rendered as a branded page and exported to PDF
 * (headless Chrome). Content is variant-aware: Limited Company (new formation
 * or existing) and Sole Trader.
 *
 * ⚠️ The tax/technical copy (VAT, wages, director duties) is a first draft and
 * still needs an accountant accuracy/compliance review before go-live — see
 * docs/onboarding-guide-content-brief.md.
 */

import { BRANDS } from '@/lib/constants';

export type GuideVariant = 'ltd-new' | 'ltd-existing' | 'sole';
export type GuideBrandId = 'clever' | 'workwell';
export type SectionIconKey = 'director' | 'formation' | 'vat' | 'wages' | 'freeagent';

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
}

export interface GuideSection {
  id: string;
  icon: SectionIconKey;
  title: string;
  variants: GuideVariant[];
  body: (d: OnboardingGuideData) => string;
}

/** Static onboarding journey stages — only the dates are per-client. */
export const JOURNEY_STAGES: {
  key: keyof JourneyDate;
  label: string;
  blurb: string;
}[] = [
  {
    key: 'welcomeCall',
    label: 'Introductory call',
    blurb: 'A quick hello to confirm your details and answer any first questions.',
  },
  {
    key: 'mainCall',
    label: 'Main onboarding call',
    blurb: 'We walk through your business, your goals and how we will work together.',
  },
  {
    key: 'portalTraining',
    label: 'Portal & software training',
    blurb: 'We set up FreeAgent and show you how to use it day to day.',
  },
  {
    key: 'catchUp',
    label: 'Catch-up',
    blurb: 'A follow-up to make sure everything is running smoothly and nothing is outstanding.',
  },
];

/** Educational sections, in display order, with the variants they apply to. */
const SECTIONS: GuideSection[] = [
  {
    id: 'director',
    icon: 'director',
    title: 'Your responsibilities as a director',
    variants: ['ltd-new', 'ltd-existing'],
    body: () =>
      "As a director you're legally responsible for keeping the company compliant. " +
      'In short, that means filing the annual accounts and confirmation statement with ' +
      "Companies House on time, keeping accurate accounting records, paying the company's " +
      'tax by the deadlines, and keeping company money separate from your personal finances. ' +
      'We handle the filings and reminders for you — but the legal duty sits with the ' +
      "director, so it's worth knowing the basics.",
  },
  {
    id: 'formation',
    icon: 'formation',
    title: 'Forming your company — what we need',
    variants: ['ltd-new'],
    body: (d) =>
      `To incorporate ${d.companyName} we'll need your preferred company name, a registered ` +
      'office address, and for every director and shareholder their full name, date of birth, ' +
      'home address and nationality. We will also confirm your share split and the nature of ' +
      'your business (SIC code). Companies House requires these to register the company, and ' +
      'the ID details support the anti-money-laundering checks we are legally required to ' +
      'complete. Your share split sets out who owns the company and how dividends can be paid, ' +
      "so it's worth getting right from day one.",
  },
  {
    id: 'vat',
    icon: 'vat',
    title: 'VAT — should you register?',
    variants: ['ltd-new', 'ltd-existing', 'sole'],
    body: () =>
      'You must register for VAT once your taxable turnover passes the VAT registration ' +
      "threshold over a rolling 12-month period. Below that, it's optional. Registering " +
      'voluntarily can be worthwhile — you can reclaim VAT on your purchases and it can make ' +
      'the business look more established — but it also means charging VAT to your customers ' +
      "and a little more admin, which doesn't suit everyone. There's no single right answer; " +
      'we will look at your numbers and customers and advise what makes sense for you.',
  },
  {
    id: 'wages',
    icon: 'wages',
    title: 'Paying yourself tax-efficiently',
    variants: ['ltd-new', 'ltd-existing'],
    body: () =>
      'For most directors, a modest salary combined with dividends is more tax-efficient than ' +
      'taking everything as salary. The right split depends on your circumstances — other ' +
      'income you receive, the profit available in the company, and your pension plans all ' +
      'affect it. We will recommend a salary and dividend approach tailored to you, and ' +
      'revisit it as things change.',
  },
  {
    id: 'freeagent',
    icon: 'freeagent',
    title: 'Your accounting software — FreeAgent',
    variants: ['ltd-new', 'ltd-existing', 'sole'],
    body: () =>
      'FreeAgent is included free with your package. It lets you raise invoices, record ' +
      'expenses, connect your bank, and see your tax position in real time. We will get your ' +
      'account set up and walk you through it on your portal training session, so you are ' +
      'comfortable using it from the start.',
  },
];

/** Educational sections that apply to a given variant, in display order. */
export function getSections(variant: GuideVariant): GuideSection[] {
  return SECTIONS.filter((s) => s.variants.includes(variant));
}

/** The opening welcome paragraph — variant-aware. */
export function welcomeIntro(d: OnboardingGuideData): string {
  const subject = d.variant === 'sole' ? 'you' : d.companyName;
  return (
    `Welcome to ${d.brandName}, ${d.clientFirstName}. This short guide covers a few ` +
    `essentials to help your onboarding go smoothly and get ${subject} set up the right ` +
    `way. Your accountant, ${d.accountant.name}, will go through anything you would like ` +
    `to discuss in more detail on your calls.`
  );
}

/**
 * Short "good to know" practical tips, variant-aware. General good-practice
 * pointers — kept free of specific tax figures so they never go stale. Still
 * pending the same accountant review as the educational sections.
 */
export function getTips(variant: GuideVariant): string[] {
  const tips = [
    'Keep business and personal spending separate from day one — a dedicated ' +
      'business bank account makes your accounts simpler and your tax position clearer.',
  ];
  if (variant === 'ltd-new' || variant === 'ltd-existing') {
    tips.push(
      'Treat Corporation Tax as money that was never yours to spend — setting it ' +
        'aside as you earn means no surprise bill at year end.',
    );
  } else {
    tips.push(
      'Set aside a portion of every payment for your Self Assessment tax as you go ' +
        '— it makes the January deadline far less stressful.',
    );
  }
  return tips;
}

/** Realistic sample data for browser preview / design review. */
export function buildSampleData(
  brandId: GuideBrandId,
  variant: GuideVariant,
): OnboardingGuideData {
  const brand = BRANDS[brandId];
  const isSole = variant === 'sole';
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
      welcomeCall: 'Tue 26 May 2026',
      mainCall: 'Fri 29 May 2026',
      portalTraining: 'Wed 3 Jun 2026',
      catchUp: null,
    },
    support: { email: brand.supportEmail, phone: brand.phone },
  };
}
