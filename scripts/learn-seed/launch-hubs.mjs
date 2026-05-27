/**
 * Shared spec for the 8 launch hubs.
 *
 * - TOPICS define the parent knowledge topics (one per area).
 * - HUBS define the 8 article hubs we'll create/draft first.
 *   `sourceHub` is the hub_name in scratch/learn-seed/clusters.jsonl
 *   the drafter uses to pull real client phrasings + why-clients-ask.
 */

export const TOPICS = [
  {
    name: "Self-Assessment",
    slug: "self-assessment",
    icon: "FileText",
    order: 10,
    shortDescription:
      "Filing your personal tax return — registration, payments, deadlines, and the common pitfalls clients trip on every January.",
    intro:
      "Self-Assessment is how HMRC works out the income tax you owe on anything that isn't taxed at source — self-employed income, rental income, dividends, capital gains and more. The system is straightforward once you understand it, but the deadlines and penalties bite hard if you don't. These guides walk you through registration, payments, the calculation, and how to fix things when they go wrong.",
  },
  {
    name: "Companies House",
    slug: "companies-house",
    icon: "Building2",
    order: 20,
    shortDescription:
      "Identity verification, confirmation statements, officer changes and dormancy — the legal admin every UK director needs to stay on top of.",
    intro:
      "Companies House is the UK registrar of companies. As a director you're personally responsible for keeping your company's records up to date and filing on time — even if you've hired an accountant to help. The rules tightened significantly from late 2025 with the Economic Crime and Corporate Transparency Act, so these guides cover the new identity verification requirements alongside the long-standing duties.",
  },
  {
    name: "VAT",
    slug: "vat",
    icon: "Receipt",
    order: 30,
    shortDescription:
      "When to register, how to file your returns, what you can reclaim, and what to do if your circumstances change.",
    intro:
      "VAT is the UK's tax on most goods and services. If your turnover is below the registration threshold, you can usually ignore it — but once you cross the line, or choose to register voluntarily, you'll need to charge VAT on your sales, file returns, and pay HMRC. These guides cover the lifecycle: when to register, how to file, what you can reclaim, and how to deregister when the time comes.",
  },
  {
    name: "Corporation Tax",
    slug: "corporation-tax",
    icon: "Banknote",
    order: 40,
    shortDescription:
      "How company profits are taxed, the rules around director's loans and S455, and the practicalities of paying HMRC.",
    intro:
      "Corporation tax is the tax your limited company pays on its profits — broadly, sales minus allowable expenses. Sounds simple, but the rules around director's loans, allowable deductions and HMRC payment references generate a steady stream of questions. These guides cover how the bill is calculated, how to pay it, and the most common areas where directors get caught out.",
  },
  {
    name: "Dividends",
    slug: "dividends",
    icon: "Coins",
    order: 50,
    shortDescription:
      "Salary vs dividends, how much you can take, the personal tax on dividends, and the paperwork you need.",
    intro:
      "Dividends are how directors typically extract profits from their limited company once a small salary has been paid. The mechanics aren't complicated, but the rules around distributable profits, paperwork and personal tax catch a lot of directors out. These guides cover how to take dividends correctly, how to plan the optimum mix with salary, and how the personal tax side works.",
  },
  {
    name: "Expenses",
    slug: "expenses",
    icon: "Wallet",
    order: 60,
    shortDescription:
      "What you can claim, how to record it, vehicle and home office costs, and how benefits in kind work.",
    intro:
      "Claiming the right expenses isn't about being clever with HMRC — it's about not paying tax on money you've actually spent running your business. These guides cover what counts as an allowable expense, the specific rules for mileage, home working and benefits in kind, and how to record everything so it stands up to scrutiny.",
  },
];

export const HUBS = [
  {
    articleSlug: "companies-house-identity-verification",
    topicSlug: "companies-house",
    sourceTopic: "Companies-House",
    sourceHub: "Companies House ID Verification",
    title: "Companies House identity verification: the complete guide for UK directors",
    canonicalQuestion: "How do I complete Companies House identity verification?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "self-assessment-complete-guide",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "General Self-Assessment Guidance",
    title: "Self-Assessment: a complete guide for the UK self-employed",
    canonicalQuestion: "What is Self-Assessment and what do I need to do?",
    appliesTo: ["sole-trader", "ltd", "contractor", "landlord"],
  },
  {
    articleSlug: "directors-loan-account-s455-explained",
    topicSlug: "corporation-tax",
    sourceTopic: "Corporation-Tax",
    sourceHub: "Director's Loan Accounts and S455 Tax",
    title: "Director's Loan Account and S455 tax: what every limited company director should know",
    canonicalQuestion: "How is S455 tax calculated on a director's loan and how can it be avoided or reclaimed?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "how-to-register-for-vat",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "VAT Registration and Deregistration",
    title: "How to register for VAT in the UK (and when you can deregister)",
    canonicalQuestion: "How do I register or deregister for VAT and what are the requirements?",
    appliesTo: ["ltd", "sole-trader"],
  },
  {
    articleSlug: "salary-vs-dividends-optimum-split",
    topicSlug: "dividends",
    sourceTopic: "Dividends",
    sourceHub: "Optimal Salary and Dividend Strategy",
    title: "Salary vs dividends: the optimum split for limited company directors",
    canonicalQuestion: "What is the most tax-efficient way to pay myself from my company?",
    appliesTo: ["ltd", "director", "contractor"],
  },
  {
    articleSlug: "self-assessment-payments-on-account",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "Understanding Payments on Account",
    title: "Self-Assessment payments on account: what they are and how to reduce them",
    canonicalQuestion: "How do Self-Assessment payments on account work and can they be reduced?",
    appliesTo: ["sole-trader", "contractor", "ltd", "landlord"],
  },
  {
    articleSlug: "confirmation-statement-explained",
    topicSlug: "companies-house",
    sourceTopic: "Companies-House",
    sourceHub: "Confirmation Statements and Accounts",
    title: "Confirmation Statement: deadlines, what to file, and what changes need declaring",
    canonicalQuestion: "What is a confirmation statement and how do I file it?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "vehicle-and-travel-expenses",
    topicSlug: "expenses",
    sourceTopic: "Expenses",
    sourceHub: "Vehicle and Travel Expenses",
    title: "Vehicle and travel expenses: what UK businesses can actually claim",
    canonicalQuestion: "What vehicle and travel expenses can my business claim?",
    appliesTo: ["ltd", "sole-trader", "director", "employer"],
  },
];
