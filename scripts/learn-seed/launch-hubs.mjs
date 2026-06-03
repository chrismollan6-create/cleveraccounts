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
  {
    name: "PAYE & Payroll",
    slug: "paye-payroll",
    icon: "Users",
    order: 70,
    shortDescription:
      "Running payroll for your company — PAYE basics, NIC, tax codes, payslips, P11D, auto-enrolment and reporting to HMRC.",
    intro:
      "PAYE (Pay As You Earn) is how UK employers collect income tax and National Insurance from salaries before paying them to staff. Every Ltd company that pays a director or employee a wage runs PAYE. The rules around tax codes, employer NIC, the Employment Allowance, P11D benefits and auto-enrolment pensions change regularly, and the consequences of missing a Real-Time Information submission are real. These guides cover the basics, the most common pitfalls, and the changes that came in with the 2025/26 and 2026/27 Budgets.",
  },
  {
    name: "Year-End Accounts",
    slug: "year-end-accounts",
    icon: "FolderClock",
    order: 80,
    shortDescription:
      "How your year-end accounts work, what your accountant needs from you, and what the figures actually mean.",
    intro:
      "Every limited company files annual accounts at Companies House and a Corporation Tax return at HMRC for the same accounting period — collectively the 'year-end'. This is the moment everything from the year comes together, and it's also the most-questioned process by clients each year. These guides cover the deadlines, what documents your accountant needs from you, and how to actually read the accounts they produce.",
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

  // ── Wave 2 ────────────────────────────────────────────────────────────────

  // Self-Assessment — 4 more
  {
    articleSlug: "self-assessment-registration-and-utr",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "Registering for Self-Assessment and UTR",
    title: "How to register for Self-Assessment and get your UTR",
    canonicalQuestion: "How do I register for Self-Assessment and get my Unique Taxpayer Reference (UTR)?",
    appliesTo: ["sole-trader", "ltd", "contractor", "landlord"],
  },
  {
    articleSlug: "self-assessment-tax-calculation-explained",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "Self-Assessment Tax Calculation Explained",
    title: "How your Self-Assessment tax bill is calculated",
    canonicalQuestion: "How is my Self-Assessment tax liability calculated and why are the figures what they are?",
    appliesTo: ["sole-trader", "landlord", "contractor", "ltd"],
  },
  {
    articleSlug: "capital-gains-and-property-income",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "Capital Gains and Property Income",
    title: "Capital gains and property income on your Self-Assessment",
    canonicalQuestion: "How do I report capital gains or property income on my Self-Assessment?",
    appliesTo: ["landlord", "ltd", "sole-trader"],
  },
  {
    articleSlug: "hmrc-letters-and-penalties",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "HMRC Letters and Penalties",
    title: "What to do about HMRC letters, demands and penalties",
    canonicalQuestion: "What should I do about HMRC letters, demands, or penalties?",
    appliesTo: ["sole-trader", "landlord", "contractor", "ltd"],
  },

  // Companies House — 2 more
  {
    articleSlug: "closing-a-limited-company",
    topicSlug: "companies-house",
    sourceTopic: "Companies-House",
    sourceHub: "Company Closure and Dissolution",
    title: "How to close a limited company (strike off vs liquidation)",
    canonicalQuestion: "What is the process for closing a limited company?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "updating-company-details",
    topicSlug: "companies-house",
    sourceTopic: "Companies-House",
    sourceHub: "Company Information and Officer Changes",
    title: "Updating company details and officer information at Companies House",
    canonicalQuestion: "How do I update company details or officer information?",
    appliesTo: ["ltd", "director"],
  },

  // VAT — 3 more
  {
    articleSlug: "vat-returns-filing",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "VAT Returns and Filing",
    title: "VAT returns: how to prepare and submit yours on time",
    canonicalQuestion: "How do I prepare and submit my VAT return correctly and on time?",
    appliesTo: ["ltd", "sole-trader", "contractor"],
  },
  {
    articleSlug: "vat-payments-and-refunds",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "VAT Payments and Refunds",
    title: "Paying VAT and claiming refunds: a UK director's guide",
    canonicalQuestion: "How do I pay my VAT bill or receive a VAT refund?",
    appliesTo: ["ltd", "sole-trader", "contractor"],
  },
  {
    articleSlug: "reclaiming-vat-and-rates",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "Reclaiming VAT and Rates",
    title: "What VAT you can reclaim on business expenses",
    canonicalQuestion: "What VAT can I reclaim on business expenses and what are the correct rates?",
    appliesTo: ["ltd", "sole-trader"],
  },

  // Corporation Tax — 2 more
  {
    articleSlug: "understanding-corporation-tax",
    topicSlug: "corporation-tax",
    sourceTopic: "Corporation-Tax",
    sourceHub: "Understanding Corporation Tax Liability",
    title: "Understanding your Corporation Tax bill",
    canonicalQuestion: "How is my company's Corporation Tax calculated and why does it change?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "paying-corporation-tax",
    topicSlug: "corporation-tax",
    sourceTopic: "Corporation-Tax",
    sourceHub: "Corporation Tax Payments and Refunds",
    title: "How to pay Corporation Tax (and claim a refund)",
    canonicalQuestion: "How do I pay my Corporation Tax, when is it due, and how do I claim a refund?",
    appliesTo: ["ltd", "director"],
  },

  // Expenses — 2 more
  {
    articleSlug: "home-office-expenses",
    topicSlug: "expenses",
    sourceTopic: "Expenses",
    sourceHub: "Home Office Expenses",
    title: "Home office expenses: what UK businesses can claim",
    canonicalQuestion: "How do I calculate and claim home office expenses?",
    appliesTo: ["ltd", "sole-trader", "contractor", "director"],
  },
  {
    articleSlug: "allowable-business-expenses",
    topicSlug: "expenses",
    sourceTopic: "Expenses",
    sourceHub: "Allowable Business Expenses",
    title: "What expenses can a UK business actually claim?",
    canonicalQuestion: "What business expenses can I claim for tax relief?",
    appliesTo: ["ltd", "sole-trader", "landlord"],
  },

  // Dividends — 1 more (basics + limits combined)
  {
    articleSlug: "how-to-take-dividends-correctly",
    topicSlug: "dividends",
    sourceTopic: "Dividends",
    sourceHub: "Dividend Availability and Limits",
    title: "How to take dividends from your limited company correctly",
    canonicalQuestion: "How do dividends work, how much can I take, and what's the paperwork?",
    appliesTo: ["ltd", "director"],
  },

  // ── Wave 3 — Expenses deep-dives (welcome-pack foundation set) ────────────
  // These three slot under /learn/expenses alongside the existing allowable /
  // home-office / vehicle-and-travel hubs to give a complete day-one reference
  // we can link directly from the onboarding guide PDF and the day-2 expenses
  // email (replacing the legacy Zendesk links).
  {
    articleSlug: "recording-expenses-and-receipts",
    topicSlug: "expenses",
    sourceTopic: "Expenses",
    sourceHub: "Recording Expenses and Receipts",
    title: "How to record business expenses and keep receipts HMRC will accept",
    canonicalQuestion: "How should I record business expenses and what records do I need to keep?",
    appliesTo: ["ltd", "sole-trader", "contractor", "landlord", "director"],
  },
  {
    articleSlug: "paying-for-expenses-personally",
    topicSlug: "expenses",
    sourceTopic: "Expenses",
    sourceHub: "Personally Paid Expenses and Reimbursement",
    title: "Paying for business expenses personally: how to claim them back",
    canonicalQuestion: "Can I claim back business expenses I paid for with my own money?",
    appliesTo: ["ltd", "director", "contractor"],
  },

  // ── Wave 4 — PAYE & Payroll topic launch (7), Year-End Accounts (3), evergreen filler (5) ──

  // PAYE & Payroll topic — 7 articles
  {
    articleSlug: "paye-for-limited-company-directors",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "Payroll Administration & Setup",
    title: "PAYE for limited company directors: the complete guide",
    canonicalQuestion: "How does PAYE work for a limited company director?",
    appliesTo: ["ltd", "director", "employer"],
  },
  {
    articleSlug: "hiring-your-first-employee",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "Payroll Administration & Setup",
    title: "Hiring your first employee: the UK setup checklist",
    canonicalQuestion: "What do I need to do to hire my first employee in the UK?",
    appliesTo: ["ltd", "employer", "director"],
  },
  {
    articleSlug: "national-insurance-contributions-explained",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "National Insurance Contributions Explained",
    title: "National Insurance contributions explained (2026/27 rates)",
    canonicalQuestion: "How are National Insurance contributions calculated and paid?",
    appliesTo: ["ltd", "employer", "director", "sole-trader"],
  },
  {
    articleSlug: "tax-codes-payslips-and-deductions",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "Tax Codes, Payslips, and Deductions",
    title: "Tax codes, payslips and deductions: what they mean and how to fix them",
    canonicalQuestion: "How do tax codes and deductions affect my payslip?",
    appliesTo: ["ltd", "employer", "sole-trader"],
  },
  {
    articleSlug: "p11d-benefits-in-kind-explained",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "P11D and Employee Benefits",
    title: "P11D and Benefits in Kind: what to report and how",
    canonicalQuestion: "What are P11D forms and how are employee benefits taxed?",
    appliesTo: ["ltd", "employer", "director"],
  },
  {
    articleSlug: "auto-enrolment-workplace-pensions",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "Workplace Pension Auto-Enrolment",
    title: "Workplace pensions and auto-enrolment for UK employers",
    canonicalQuestion: "What are my obligations for workplace pension auto-enrolment?",
    appliesTo: ["ltd", "employer"],
  },
  {
    articleSlug: "p60-and-p45-explained",
    topicSlug: "paye-payroll",
    sourceTopic: "PAYE",
    sourceHub: "P60, P45 and Employment Records",
    title: "P60 and P45 explained — what they're for and how to get them",
    canonicalQuestion: "How do I get my P60 or P45 and what are they used for?",
    appliesTo: ["ltd", "employer", "umbrella"],
  },

  // Year-End Accounts topic — 3 articles
  {
    articleSlug: "year-end-accounts-deadlines-and-filings",
    topicSlug: "year-end-accounts",
    sourceTopic: "Year-End-Accounts",
    sourceHub: "Year-End Accounts Status and Deadlines",
    title: "Year-end accounts: deadlines, filings and what happens when",
    canonicalQuestion: "When are my year-end accounts due and what gets filed where?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "understanding-your-year-end-accounts",
    topicSlug: "year-end-accounts",
    sourceTopic: "Year-End-Accounts",
    sourceHub: "Explaining Year-End Accounts Figures",
    title: "Understanding the figures in your year-end accounts",
    canonicalQuestion: "How do I understand the figures and reports in my year-end accounts?",
    appliesTo: ["ltd", "director"],
  },
  {
    articleSlug: "year-end-documents-your-accountant-needs",
    topicSlug: "year-end-accounts",
    sourceTopic: "Year-End-Accounts",
    sourceHub: "Documents Required for Accounts Preparation",
    title: "What documents your accountant needs at year-end",
    canonicalQuestion: "What information and documents do I need to provide for my year-end accounts?",
    appliesTo: ["ltd", "director"],
  },

  // Self-Assessment — Making Tax Digital
  {
    articleSlug: "making-tax-digital-for-itsa",
    topicSlug: "self-assessment",
    sourceTopic: "Self-Assessment",
    sourceHub: "General Self-Assessment Guidance",
    title: "Making Tax Digital for Income Tax (MTD for ITSA): what's changing and when",
    canonicalQuestion: "What is MTD for ITSA and what do I need to do?",
    appliesTo: ["sole-trader", "landlord"],
  },

  // VAT — Flat Rate, HMRC correspondence, MTD VAT
  {
    articleSlug: "vat-flat-rate-scheme",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "VAT Schemes and Invoicing",
    title: "VAT Flat Rate Scheme: pros, cons and when to use it",
    canonicalQuestion: "What is the VAT Flat Rate Scheme and should I use it?",
    appliesTo: ["ltd", "sole-trader", "contractor"],
  },
  {
    articleSlug: "dealing-with-hmrc-vat-letters",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "HMRC VAT Correspondence and Queries",
    title: "Dealing with HMRC VAT letters and queries",
    canonicalQuestion: "How do I understand and respond to HMRC VAT letters and queries?",
    appliesTo: ["ltd", "sole-trader"],
  },
  {
    articleSlug: "making-tax-digital-for-vat",
    topicSlug: "vat",
    sourceTopic: "VAT",
    sourceHub: "VAT Returns and Filing",
    title: "Making Tax Digital for VAT: what it means and how to stay compliant",
    canonicalQuestion: "What is MTD for VAT and how do I stay compliant?",
    appliesTo: ["ltd", "sole-trader", "contractor"],
  },

  // Corporation Tax — Sole Trader vs Ltd decision guide
  {
    articleSlug: "sole-trader-vs-limited-company",
    topicSlug: "corporation-tax",
    sourceTopic: "Corporation-Tax",
    sourceHub: "Corporation Tax Planning and Reliefs",
    title: "Sole trader vs limited company: which is right for you?",
    canonicalQuestion: "Should I be a sole trader or a limited company?",
    appliesTo: ["sole-trader", "ltd", "director"],
  },
];
