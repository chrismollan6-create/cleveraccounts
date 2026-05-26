/**
 * Onboarding Guide — content + data model.
 *
 * A per-client welcome guide rendered as a branded page and turned into a PDF
 * by headless Chrome. Content is dynamic on several axes:
 *   • variant      — Limited Company (new/existing) vs Sole Trader
 *   • vatStatus    — Account.VAT_Status__c picklist (drives the VAT body/title)
 *   • payeStatus   — Account.PAYE_Status__c picklist (drives the PAYE body/title)
 *   • clientType   — Account.Client_type__c (e.g. 'PSC' surfaces the IR35 section)
 *
 * ⚠️ The tax/technical copy (director duties, VAT, PAYE, IR35) is a Claude
 * draft and still needs an accountant accuracy/compliance review — see
 * docs/onboarding-guide-content-brief.md.
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
  /** Account.VAT_Status__c picklist value, or undefined if blank. */
  vatStatus?: string;
  /** Account.PAYE_Status__c picklist value, or undefined if blank. */
  payeStatus?: string;
  /** Account.Client_type__c picklist value, or undefined. 'PSC' surfaces IR35. */
  clientType?: string;
  /**
   * Accountant's Calendly URL when one is configured (Account.Calendar_UserId__c
   * = true). Surfaced in the journey timeline as a "Book your call →" link on
   * the introductory call stage when no welcome-call date is yet on file.
   */
  calendlyUrl?: string;
}

export interface GuideSection {
  id: string;
  icon: SectionIconKey;
  /** Title can be a fixed string or a function of the data (status-aware). */
  title: string | ((d: OnboardingGuideData) => string);
  body: (d: OnboardingGuideData) => string;
  /** Predicate deciding whether the section appears for a given client. */
  shouldShow: (d: OnboardingGuideData) => boolean;
}

const isLtd = (d: OnboardingGuideData) =>
  d.variant === 'ltd-new' || d.variant === 'ltd-existing';

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

// ─────────────────────────────────────────────────────────────────────────
// Dynamic title / body helpers
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

  // PSC contractors — append a paragraph on the Flat Rate VAT scheme. Two
  // paragraphs are rendered as separate <p> elements by the component
  // (split on \n\n) so the flat-rate angle reads as a distinct sub-topic.
  if (d.clientType === 'PSC') {
    base +=
      '\n\n' +
      "As a contractor working through a personal service company, the Flat Rate VAT " +
      "scheme is worth considering. You charge clients VAT at the standard rate but pay " +
      "HMRC a lower fixed percentage of your gross turnover, keeping the difference. " +
      "It has been popular with many contractors, though ‘limited-cost’ " +
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
  // Limited Company branch
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

// ─────────────────────────────────────────────────────────────────────────
// Section library
// ─────────────────────────────────────────────────────────────────────────

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

/** Sections that apply to a given client, in display order. */
export function getSections(d: OnboardingGuideData): GuideSection[] {
  return SECTIONS.filter((s) => s.shouldShow(d));
}

/** Resolve a section's title (accepts string or function-of-data). */
export function sectionTitle(s: GuideSection, d: OnboardingGuideData): string {
  return typeof s.title === 'function' ? s.title(d) : s.title;
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

  // Vary the picklist statuses per variant so the preview shows different
  // copy paths without needing extra query params.
  let vatStatus: string | undefined;
  let payeStatus: string | undefined;
  let clientType: string | undefined;
  // Sole-trader preview deliberately omits the welcome-call date so the
  // "Book your call →" link path is visible in the preview.
  let welcomeCall: string | null = 'Tue 26 May 2026';
  // Calendly URL is set for all sample variants; the sole-trader preview
  // also drops the date so the booking link surfaces in the journey timeline.
  const calendlyUrl: string | undefined = 'https://calendly.com/sample-accountant';
  if (variant === 'ltd-new') {
    vatStatus = 'Not VAT registered';
    payeStatus = 'Needs PAYE registration';
    clientType = 'PSC';
  } else if (variant === 'ltd-existing') {
    vatStatus = 'Existing VAT registration';
    payeStatus = 'Existing PAYE registration';
    clientType = undefined;
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
