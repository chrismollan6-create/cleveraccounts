/**
 * Seed each existing knowledgeTopic with keyFacts, timeline, usefulLinks, quickAnswers.
 *
 * Run:
 *   node scripts/learn-seed/07-enrich-topics.mjs
 *
 * Idempotent: patches the existing topic documents in place. Re-running
 * overwrites with the latest content here, so this file is the source of
 * truth for topic-level UK reference content. An accountant should review
 * + adjust each topic in Studio after seeding.
 *
 * Figures throughout reflect the 2025/26 tax year — every fact has a
 * `context` line that names the year so future-you knows what to update.
 */

import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

if (!process.env.SANITY_TOKEN) {
  console.error("✗ SANITY_TOKEN not set in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const TOPIC_ID = (slug) => `knowledgeTopic-${slug}`;

// ── Topic content ───────────────────────────────────────────────────────────
const TOPICS = {
  "self-assessment": {
    keyFacts: [
      { label: "Online filing deadline", value: "31 Jan", context: "Following the tax year that ended 5 April", icon: "Calendar" },
      { label: "Registration deadline", value: "5 Oct", context: "If new to Self-Assessment", icon: "UserPlus" },
      { label: "Paper return deadline", value: "31 Oct", context: "Earlier than online — most people file online", icon: "FileText" },
      { label: "Personal allowance", value: "£12,570", context: "Tax-free, 2025/26", icon: "PoundSterling" },
      { label: "Basic-rate band", value: "Up to £50,270", context: "Including allowance, 2025/26", icon: "Banknote" },
      { label: "Late-filing penalty", value: "£100", context: "Initial fine — escalates further if unpaid", icon: "AlertTriangle" },
    ],
    timeline: [
      { period: "6 April", label: "Tax year begins", description: "The clock starts. You can file as early as the next day if you have all your figures." },
      { period: "5 October", label: "Register by this date (if new)", description: "Tell HMRC you need to complete a Self-Assessment for the tax year just ended." },
      { period: "31 October", label: "Paper return deadline", description: "Almost everyone files online instead — but if you must paper-file, this is your cut-off." },
      { period: "31 January", label: "Online return + payment deadline", description: "File your return AND pay your tax. Miss it and an automatic £100 penalty kicks in." },
      { period: "31 January", label: "First payment on account due", description: "If your bill was over £1,000, you also pay 50% of next year's expected bill on this date." },
      { period: "31 July", label: "Second payment on account due", description: "The other 50% of next year's expected bill." },
    ],
    usefulLinks: [
      { label: "Sign in to file your Self-Assessment", url: "https://www.gov.uk/log-in-file-self-assessment-tax-return", source: "gov.uk", description: "Government Gateway sign-in for filing your return online." },
      { label: "Register for Self-Assessment", url: "https://www.gov.uk/register-for-self-assessment", source: "gov.uk", description: "Tell HMRC you need to file — different forms depending on whether you're self-employed, a partner, or filing for another reason." },
      { label: "Check what you owe (your HMRC account)", url: "https://www.gov.uk/personal-tax-account", source: "gov.uk", description: "Your personal tax account shows balances, payment history, and any HMRC messages." },
      { label: "Take-home tax calculator", url: "https://cleveraccounts.com/take-home-calculator", source: "Clever Accounts", description: "Estimate the tax on your income before filing." },
    ],
    quickAnswers: [
      { q: "Who needs to file a Self-Assessment?", a: "Anyone who has income that wasn't fully taxed at source. Common triggers: self-employment income over £1,000, rental income, dividends over £500, capital gains over the annual exemption, foreign income, or earnings over £150,000. If you've been asked to file by HMRC, you have to — even if you owe nothing." },
      { q: "What if I miss the 31 January deadline?", a: "An automatic £100 penalty applies even if you owe no tax. After 3 months, daily penalties of £10 (up to £900) start. After 6 months and 12 months, further percentage-based penalties apply. Interest also runs on any unpaid tax. The fastest fix is to file ASAP — penalties freeze once your return is in." },
      { q: "Can I file early?", a: "Yes — from 6 April, the day after the tax year ends. Many clients file in April or May to know their bill early and budget for the January payment." },
      { q: "What are payments on account?", a: "If your tax bill is over £1,000 and less than 80% was collected at source, HMRC asks for two advance payments toward next year's bill — due 31 January and 31 July. Each is 50% of the previous year's liability. You can apply to reduce them if your income has dropped." },
      { q: "Do I still need to file if I had no self-employed income?", a: "If HMRC has asked you to file, yes — you submit a return showing nil income rather than ignoring it. If you no longer need to file, contact HMRC to be removed from Self-Assessment so they stop asking." },
    ],
  },

  "companies-house": {
    keyFacts: [
      { label: "Confirmation statement", value: "Annually", context: "£40 paper / £34 online filing fee", icon: "FileText" },
      { label: "Accounts filing deadline", value: "9 months", context: "After your accounting reference date", icon: "Calendar" },
      { label: "First accounts deadline", value: "21 months", context: "From incorporation, for the first year", icon: "Hourglass" },
      { label: "Director ID verification", value: "Required", context: "Since 18 November 2025 (ECCTA)", icon: "ShieldCheck" },
      { label: "Late filing penalty (private co)", value: "£150-£1,500", context: "Depending on how late accounts are", icon: "AlertTriangle" },
    ],
    timeline: [
      { period: "On incorporation", label: "Company registered", description: "Companies House issues your company number and certificate of incorporation." },
      { period: "Within 21 months of incorporation", label: "First accounts due", description: "Your first annual accounts cover the period from incorporation to your first accounting reference date." },
      { period: "Annually (12 months after incorp, then yearly)", label: "Confirmation statement due", description: "Confirm your company's details are still correct — directors, shareholders, registered office, SIC code, PSCs." },
      { period: "Annually (9 months after year end)", label: "Annual accounts due", description: "Statutory accounts filed at Companies House. Late filing triggers an automatic penalty." },
      { period: "Whenever changes happen", label: "File event notifications", description: "Director appointments/resignations, address changes, share allotments — most have a deadline of 14 days." },
      { period: "From 18 November 2025", label: "Identity verification (ECCTA)", description: "All new and existing directors must verify their identity with Companies House. Your next confirmation statement will require this confirmation." },
    ],
    usefulLinks: [
      { label: "Companies House WebFiling", url: "https://ewf.companieshouse.gov.uk/", source: "Companies House", description: "File your confirmation statement, accounts and changes online." },
      { label: "Verify your identity for Companies House", url: "https://www.gov.uk/guidance/verify-your-identity-for-companies-house", source: "gov.uk", description: "Official identity verification process — required for directors and PSCs under the ECCTA." },
      { label: "Search the public Companies House register", url: "https://find-and-update.company-information.service.gov.uk/", source: "Companies House", description: "Free search of every UK registered company — useful for due-diligence." },
      { label: "Strike off your company (DS01)", url: "https://www.gov.uk/strike-off-your-company-from-companies-register", source: "gov.uk", description: "How to voluntarily close a limited company that's no longer trading." },
    ],
    quickAnswers: [
      { q: "Do I have to file a confirmation statement even if nothing's changed?", a: "Yes. The confirmation statement isn't optional — it confirms that the information held by Companies House is still accurate, even if every detail is unchanged. Skipping it can lead to your company being struck off." },
      { q: "What is identity verification and who needs to do it?", a: "Under the Economic Crime and Corporate Transparency Act 2023, every UK director and Person with Significant Control (PSC) must verify their identity with Companies House. This came into force on 18 November 2025. You get a personal code that gets linked to all your director appointments." },
      { q: "What happens if I file accounts late?", a: "Companies House issues automatic penalties: £150 if up to 1 month late, £375 if 1-3 months, £750 if 3-6 months, and £1,500 if over 6 months. Penalties double if you were also late filing the previous year. The company is also at risk of being struck off." },
      { q: "Can I change my company's year-end date?", a: "Yes — you can shorten it as often as you like, but you can only lengthen it once every 5 years (unless special circumstances apply). Submit form AA01 to Companies House, ideally before the new date passes." },
      { q: "What's the difference between a director and a shareholder?", a: "A director runs the company (legal duties to file accounts, act in members' interests, etc.). A shareholder owns the company. The same person is often both, but they're separate roles with different responsibilities." },
    ],
  },

  vat: {
    keyFacts: [
      { label: "Registration threshold", value: "£90,000", context: "Taxable turnover in any rolling 12-month period (2025/26)", icon: "PoundSterling" },
      { label: "Deregistration threshold", value: "£88,000", context: "If turnover drops below this, you can leave VAT (2025/26)", icon: "ArrowDownCircle" },
      { label: "Standard rate", value: "20%", context: "Applies to most goods and services", icon: "Percent" },
      { label: "Reduced rate", value: "5%", context: "Domestic fuel, children's car seats, some others", icon: "Percent" },
      { label: "Zero rate", value: "0%", context: "Most food, books, children's clothes, exports", icon: "Percent" },
      { label: "MTD for VAT", value: "Required", context: "All VAT-registered businesses must use compatible software", icon: "MonitorSmartphone" },
      { label: "Return frequency", value: "Quarterly", context: "Annual scheme available for some businesses", icon: "Calendar" },
      { label: "Return + payment due", value: "1 month + 7 days", context: "After the end of each VAT quarter", icon: "Clock" },
    ],
    timeline: [
      { period: "Day 1 of VAT quarter", label: "VAT period begins", description: "You charge VAT on sales and track VAT on purchases throughout the quarter." },
      { period: "Last day of quarter", label: "VAT period ends", description: "Total up your output VAT (sales) and input VAT (purchases). Net = what you owe HMRC." },
      { period: "+1 month and 7 days", label: "VAT return + payment due", description: "Submit your return via MTD-compatible software. Direct Debit takes the payment automatically a few days later." },
      { period: "Anytime turnover hits £90k", label: "Must register within 30 days", description: "If your taxable turnover in any rolling 12-month period exceeds the threshold, you have 30 days to register." },
      { period: "Anytime turnover drops below £88k", label: "Can deregister", description: "You don't have to deregister, but if your turnover has fallen and is expected to stay below the threshold for the next 12 months, you can." },
    ],
    usefulLinks: [
      { label: "Register for VAT", url: "https://www.gov.uk/register-for-vat", source: "gov.uk", description: "Apply for VAT registration online — takes 10-30 working days." },
      { label: "Sign in to your VAT account", url: "https://www.gov.uk/log-in-register-hmrc-online-services", source: "gov.uk", description: "View returns, payments, and any HMRC correspondence." },
      { label: "VAT rates on different goods and services", url: "https://www.gov.uk/guidance/rates-of-vat-on-different-goods-and-services", source: "gov.uk", description: "Definitive list of what's standard, reduced, zero-rated or exempt." },
      { label: "Making Tax Digital for VAT", url: "https://www.gov.uk/government/collections/making-tax-digital-for-vat", source: "gov.uk", description: "Rules and approved software list for MTD-compliant VAT filing." },
    ],
    quickAnswers: [
      { q: "Should I register voluntarily even if I'm under the threshold?", a: "Sometimes yes. If your customers are themselves VAT-registered (they can reclaim what you charge), and you have significant VAT-bearing costs, voluntary registration can put real money back in your pocket. It can also make a young business look more established. The downside: more admin and 20% on top of your prices for non-VAT customers." },
      { q: "What's the Flat Rate Scheme and is it worth using?", a: "A simplified scheme for small businesses where you pay a fixed % of gross turnover (depending on industry) instead of accounting for input VAT in detail. It's often less generous than standard accounting now (especially for 'limited cost' businesses) — your accountant can model both and recommend." },
      { q: "Can I reclaim VAT on things bought before I was registered?", a: "Yes — generally goods bought up to 4 years before registration that you still have on hand, and services bought up to 6 months before. You reclaim them on your first VAT return." },
      { q: "What is MTD for VAT?", a: "Making Tax Digital — every VAT-registered business must keep digital records and file returns through MTD-compatible software. You can't just type figures into HMRC's website any more. Tools like FreeAgent, Xero, QuickBooks and many others handle this." },
      { q: "How do I deal with VAT on imports / exports?", a: "Exports to outside the UK are usually zero-rated. Imports from outside the UK now use postponed VAT accounting — VAT is recorded on your return rather than paid at the border. Your accountant should handle the mechanics, especially since Brexit changed how EU trade works." },
    ],
  },

  "corporation-tax": {
    keyFacts: [
      { label: "Small profits rate", value: "19%", context: "Profits up to £50,000 (2025/26)", icon: "Percent" },
      { label: "Main rate", value: "25%", context: "Profits over £250,000 (2025/26)", icon: "Percent" },
      { label: "Marginal rate", value: "26.5%", context: "Effective rate on profits between £50k and £250k", icon: "Percent" },
      { label: "Payment due", value: "9 months + 1 day", context: "After the end of your accounting period", icon: "PoundSterling" },
      { label: "Filing deadline", value: "12 months", context: "Submit your CT600 within 12 months of period end", icon: "FileText" },
      { label: "S455 charge on director's loans", value: "33.75%", context: "Tax on loans not repaid within 9 months 1 day of year-end", icon: "AlertTriangle" },
    ],
    timeline: [
      { period: "Start of accounting period", label: "Tax year begins", description: "Usually 12 months. Could be shorter for a first or final year." },
      { period: "End of accounting period", label: "Profits crystallise", description: "Your accountants prepare statutory accounts and the CT600 (corporation tax return)." },
      { period: "+9 months and 1 day", label: "Corporation tax payment due", description: "Pay HMRC. Use your 17-character reference for the right accounting period." },
      { period: "+12 months", label: "CT600 filing deadline", description: "Submit your corporation tax return to HMRC. Late filing triggers automatic penalties." },
      { period: "Within 3 months of starting", label: "Tell HMRC you've started trading", description: "Required even if you've already registered the company at Companies House. Form CT41G or via your business tax account." },
    ],
    usefulLinks: [
      { label: "Sign in to file your CT600", url: "https://www.gov.uk/log-in-register-hmrc-online-services", source: "gov.uk", description: "Government Gateway entry to HMRC's online services." },
      { label: "Pay your Corporation Tax bill", url: "https://www.gov.uk/pay-corporation-tax", source: "gov.uk", description: "Bank details, references and timing for HMRC corporation tax payments." },
      { label: "Find your accounting period dates", url: "https://www.gov.uk/corporation-tax-accounting-period", source: "gov.uk", description: "How accounting periods work — particularly for first/final years." },
      { label: "Corporation Tax rates", url: "https://www.gov.uk/government/publications/rates-and-allowances-corporation-tax", source: "gov.uk", description: "Current rates and historical archive." },
    ],
    quickAnswers: [
      { q: "How is corporation tax calculated?", a: "Your accounts show a 'profit before tax'. Your accountants then adjust this for tax purposes (disallowing entertaining, adding back depreciation and replacing with capital allowances, claiming any reliefs). The resulting taxable profit is taxed at 19% if under £50k, 25% if over £250k, and at the marginal effective rate of 26.5% in between." },
      { q: "What is S455 tax on director's loans?", a: "If a director has borrowed money from their own company (an overdrawn director's loan account) and hasn't repaid it within 9 months and 1 day of year-end, the company pays a temporary tax charge of 33.75% on the outstanding balance. It's refundable once the loan is repaid — but it ties up cash in the meantime." },
      { q: "When do I have to pay corporation tax in instalments?", a: "If your taxable profits exceed £1.5 million in a single accounting period, you pay quarterly instalments instead of one lump sum. Most small companies won't hit this." },
      { q: "Can I delay paying corporation tax if cash is tight?", a: "Talk to HMRC — they sometimes agree a 'time to pay' arrangement, especially if you contact them early and have a credible plan. Interest still accrues, but at least the company isn't formally in arrears." },
      { q: "What reliefs can reduce my corporation tax?", a: "The big ones for small companies: capital allowances on equipment (often 100% in year of purchase via the Annual Investment Allowance), R&D tax credits if you're doing qualifying innovation work, and patent box for IP income. Your accountant should be reviewing these every year." },
    ],
  },

  dividends: {
    keyFacts: [
      { label: "Dividend allowance", value: "£500", context: "Tax-free per person, 2025/26", icon: "Gift" },
      { label: "Basic-rate tax", value: "8.75%", context: "On dividends above the allowance, within the basic-rate band", icon: "Percent" },
      { label: "Higher-rate tax", value: "33.75%", context: "On dividends in the higher-rate band", icon: "Percent" },
      { label: "Additional-rate tax", value: "39.35%", context: "On dividends over £125,140", icon: "Percent" },
      { label: "Paid from", value: "Distributable profits", context: "After-tax retained profits only — never from share capital", icon: "Banknote" },
    ],
    timeline: [
      { period: "Any time during the year", label: "Board declares dividend", description: "Directors meet (even if it's a one-director Zoom with themselves) and minute the decision to distribute profits." },
      { period: "Same day", label: "Dividend voucher issued", description: "One per shareholder, showing date, amount, and number of shares — the legal paperwork for HMRC and the shareholder's tax return." },
      { period: "Same day", label: "Payment made", description: "Bank transfer to the shareholder. The bookkeeping debits the dividends account and credits the bank." },
      { period: "31 January following year end", label: "Personal tax on dividends", description: "The shareholder declares the dividend on their Self-Assessment and pays personal tax due." },
    ],
    usefulLinks: [
      { label: "Tax on dividends", url: "https://www.gov.uk/tax-on-dividends", source: "gov.uk", description: "Current rates and how dividend income is taxed for individuals." },
      { label: "Pay yourself a salary or dividend", url: "https://www.gov.uk/business-finance-support/take-money-from-business", source: "gov.uk", description: "Quick comparison of ways to extract value from a company." },
      { label: "Take-home calculator", url: "https://cleveraccounts.com/take-home-calculator", source: "Clever Accounts", description: "Model different salary + dividend splits and see what you'd actually take home." },
    ],
    quickAnswers: [
      { q: "Can I just transfer money from my company to myself whenever I want?", a: "No — at least, not without consequences. Money you take out is either salary (PAYE), an expense reimbursement, a dividend (requires distributable profits + paperwork), or a director's loan (which you'll have to repay or be taxed on). Random transfers without classification can trigger S455 tax and HMRC questions." },
      { q: "What are 'distributable profits' and why do they matter?", a: "Distributable profits = retained earnings after corporation tax, since the company started. You can only legally pay dividends from this pot. Paying out more than you have is an 'illegal dividend' that may need to be paid back, especially if the company later runs into trouble." },
      { q: "Is salary or dividend more tax-efficient?", a: "Usually a low salary (up to the NI threshold) plus dividends for the rest. The salary uses your tax-free personal allowance and qualifies for state pension contributions. Beyond that, dividends are taxed at lower headline rates than salary — but the company has already paid corporation tax on the underlying profit, so the comparison isn't as one-sided as it first looks." },
      { q: "Do I need dividend vouchers?", a: "Yes. Even for a one-person company. A voucher per shareholder per dividend, kept with the company records. Plus board minutes recording the dividend decision. HMRC can ask for these — and lenders / mortgage providers definitely will." },
      { q: "What if the company doesn't have profits — can it still pay a dividend?", a: "No. Paying a dividend with no distributable profits is unlawful. If you've already withdrawn the money, it gets reclassified as a director's loan, with the S455 tax consequences if not repaid within 9 months of year-end." },
    ],
  },

  expenses: {
    keyFacts: [
      { label: "Business mileage (car)", value: "45p / 25p", context: "First 10,000 miles / above 10,000 miles", icon: "Car" },
      { label: "Business mileage (bike)", value: "20p", context: "Per mile, no upper limit", icon: "Bike" },
      { label: "Working from home (sole trader)", value: "£6/wk", context: "Simplified expense — or claim a proportion of actual costs", icon: "Home" },
      { label: "Working from home (Ltd)", value: "£6/wk", context: "Reimbursable from company without P11D", icon: "Briefcase" },
      { label: "Trivial benefits", value: "£50 max", context: "Per gift, plus £300/yr cap for directors", icon: "Gift" },
      { label: "Subsistence (per HMRC scale)", value: "£5-£25", context: "Tax-free meal allowances on qualifying business travel", icon: "Utensils" },
    ],
    timeline: [
      { period: "As they happen", label: "Record the expense", description: "Photo of receipt, log in accounting software (FreeAgent, Xero etc.), categorise correctly." },
      { period: "Same day, ideally", label: "Categorise", description: "Right category = right tax treatment. Mileage ≠ fuel ≠ travel. Wrong category can mean missed claims or unexpected benefits-in-kind." },
      { period: "Tax year end (5 April / company year end)", label: "Reconcile", description: "Make sure every expense has a receipt and a valid business purpose. Anything unsupported gets disallowed." },
      { period: "6 July (companies only)", label: "P11D deadline", description: "Report any benefits-in-kind provided to directors / employees during the previous tax year." },
    ],
    usefulLinks: [
      { label: "Expenses if you're self-employed", url: "https://www.gov.uk/expenses-if-youre-self-employed", source: "gov.uk", description: "What sole traders can claim as business expenses." },
      { label: "Expenses and benefits for employers", url: "https://www.gov.uk/expenses-and-benefits-a-to-z", source: "gov.uk", description: "A-Z guide to expenses, benefits and their tax treatment for employees and directors." },
      { label: "Approved mileage allowance payments (AMAP)", url: "https://www.gov.uk/expenses-and-benefits-business-travel-mileage/rules-for-tax", source: "gov.uk", description: "The official rates for business mileage in employees' own vehicles." },
      { label: "Trivial benefits rules", url: "https://www.gov.uk/expenses-and-benefits-trivial-benefits", source: "gov.uk", description: "What qualifies as a trivial benefit and how the £50 / £300 limits work." },
    ],
    quickAnswers: [
      { q: "What's the rule for an expense to be allowable?", a: "It must be 'wholly and exclusively' for business purposes. If something has both business and personal use (like a phone or laptop), you can usually claim the business proportion. Pure dual-purpose expenses (a suit for work but also wearable socially) are generally not allowed." },
      { q: "Can I claim for working from home?", a: "Sole traders can use HMRC's simplified flat rate (£6/wk, or scaled by hours worked from home) or claim a proportion of actual household costs. Limited company directors can reimburse themselves £6/wk from the company without a P11D — or, for higher claims, prepare a formal use-of-home calculation." },
      { q: "What about meals when I'm working?", a: "Generally no — eating is a personal cost. Exceptions: subsistence on qualifying business travel away from your normal base (per HMRC scale rates), occasional staff entertainment (limits apply), or a meal during a genuine business meeting with a client (sometimes — entertainment rules complicate this)." },
      { q: "Can I put my mortgage / rent through the company?", a: "Not directly — but you can claim a reasonable proportion of running costs (lighting, heating, council tax, broadband) if you genuinely work from home. Putting rent or mortgage interest through has stamp duty and capital gains tax implications that almost always outweigh the saving." },
      { q: "What's a benefit-in-kind?", a: "A non-cash perk an employer provides to an employee or director — private healthcare, a company car for personal use, a season ticket loan over £10k, etc. It gets reported on a P11D each year, and either the employee or the company (if you payroll the benefit) pays tax on it." },
    ],
  },

  payroll: {
    keyFacts: [
      { label: "Personal allowance", value: "£12,570", context: "Tax-free for most employees, 2025/26", icon: "PoundSterling" },
      { label: "Employer NI threshold (ST)", value: "£5,000", context: "Employer NI starts above this, 2025/26 (down from £9,100)", icon: "AlertTriangle" },
      { label: "Employer NI rate", value: "15%", context: "On earnings above the £5,000 ST, 2025/26 (up from 13.8%)", icon: "Percent" },
      { label: "Employee NI rate", value: "8%", context: "Above the primary threshold (£12,570) up to £50,270", icon: "Percent" },
      { label: "Employment Allowance", value: "£10,500", context: "Reduces employer NI bill for eligible employers, 2025/26", icon: "Gift" },
      { label: "PAYE payment deadline", value: "22nd of next month", context: "By bank transfer (19th if paying by post)", icon: "Calendar" },
    ],
    timeline: [
      { period: "Each pay day", label: "Run payroll + send FPS to HMRC", description: "Calculate gross-to-net for each employee, send a Full Payment Submission to HMRC on or before pay day." },
      { period: "If no employees were paid in a month", label: "Send an EPS", description: "Employer Payment Summary tells HMRC there's nothing to report — otherwise they'll chase you." },
      { period: "By 22nd of next month", label: "Pay HMRC", description: "Send the PAYE and NI deductions to HMRC by the 22nd (electronic) or 19th (cheque)." },
      { period: "End of tax year (5 April)", label: "Issue P60s by 31 May", description: "Every employee on the books at year-end gets a P60 summarising their pay and deductions." },
      { period: "By 6 July", label: "Submit P11Ds", description: "Report any taxable benefits-in-kind provided to employees / directors during the previous tax year." },
    ],
    usefulLinks: [
      { label: "PAYE for employers", url: "https://www.gov.uk/paye-for-employers", source: "gov.uk", description: "The full HMRC guide to operating PAYE." },
      { label: "Sign in to PAYE online", url: "https://www.gov.uk/log-in-register-hmrc-online-services", source: "gov.uk", description: "View liabilities, submit corrections, manage employers' PAYE." },
      { label: "Pay your PAYE bill", url: "https://www.gov.uk/pay-paye-tax", source: "gov.uk", description: "Bank details and references for paying HMRC." },
      { label: "Tax codes explained", url: "https://www.gov.uk/tax-codes", source: "gov.uk", description: "What each letter and number on a tax code means." },
    ],
    quickAnswers: [
      { q: "Do I need to run payroll for my one-person Ltd company?", a: "Yes if you want to pay yourself a salary. Even at a 'low salary' (just up to the NI threshold), you still need to register as an employer with HMRC, run real-time payroll and send FPS submissions each month." },
      { q: "What's the most tax-efficient salary for a director?", a: "Usually the lower of the secondary threshold (£5,000) or primary threshold (£12,570) — figures change each year. Just above £5,000 means you start owing employer NI; staying below means no NI but you might miss out on building qualifying state-pension years. Your accountant will recommend based on your numbers." },
      { q: "How does the Employment Allowance work?", a: "It reduces your employer NI bill by up to £10,500 per year — but it's not available to one-person Ltd companies where the only employee is the sole director. If you have at least one non-director employee, you usually qualify." },
      { q: "What happens if I miss a PAYE payment?", a: "HMRC charges interest immediately and may add a late-payment penalty (1-4% depending on how late). Worse — late RTI submissions can also trigger penalties even if you eventually pay. Speak to HMRC quickly if there's a problem." },
      { q: "Can I employ family members?", a: "Yes, but the salary must be commercially justifiable for the work actually done. HMRC will challenge a £40k 'salary' for a child who does an hour a week — and disallow the company's deduction. Document the role and pay a market rate." },
    ],
  },
};

// ── Run ─────────────────────────────────────────────────────────────────────
console.log("→ Enriching topics with key facts, timeline, links, and FAQs…\n");

for (const [slug, content] of Object.entries(TOPICS)) {
  const id = TOPIC_ID(slug);
  const existing = await client.getDocument(id).catch(() => null);
  if (!existing) {
    console.log(`  ⏭  ${slug} — topic doesn't exist, skipping (run 05-create-hubs.mjs first?)`);
    continue;
  }
  await client.patch(id).set(content).commit();
  const counts = `${content.keyFacts.length} facts · ${content.timeline.length} events · ${content.usefulLinks.length} links · ${content.quickAnswers.length} FAQs`;
  console.log(`  ✓ ${slug.padEnd(20)} (${counts})`);
}

console.log("\n✓ Done. Open the Studio (/studio → 🎓 Learning Centre — Topics) to review & adjust.");
