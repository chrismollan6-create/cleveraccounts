# Learning Centre — handoff doc

Last updated by an AI session on 2026-06-04.

## Where things stand

| | Count |
|---|---|
| Total articles in Sanity | **54** |
| Topics | **8** |
| Articles with Google-Search grounding to gov.uk | **~45 (83%)** |
| Articles without grounding (training-data only) | **~9** |
| Published live on cleveraccounts.com/learn | **2** |
| Drafts awaiting accountant review | **52** |

## Topics & per-topic article counts

| Slug | Name | Articles |
|---|---|---|
| `self-assessment` | Self-Assessment | 11 |
| `companies-house` | Companies House | 7 |
| `vat` | VAT | 8 |
| `corporation-tax` | Corporation Tax | 7 |
| `dividends` | Dividends | 4 |
| `expenses` | Expenses | 6 |
| `paye-payroll` | PAYE & Payroll | 7 |
| `year-end-accounts` | Year-End Accounts | 3 |

## The 2 articles live in production

- `directors-loan-account-s455-explained` (Corporation Tax) — published with only AI draft, no accountant review yet
- `companies-house-identity-verification` (Companies House) — same

Both are publicly indexable on Google. They need accountant fact-check + republish.

## All 5 build waves shipped

**Wave 1** (8 articles): the initial launch hubs — Companies House ID, Self-Assessment guide, S455, VAT registration, salary vs dividends, payments on account, confirmation statement, vehicle/travel expenses.

**Wave 2** (14 articles): Self-Assessment registration/UTR/tax calc/capital gains/HMRC letters, Companies House closing+updating, VAT returns/payments/reclaiming, Corp Tax understanding+paying, home office, allowable expenses, dividends basics.

**Wave 3** (2 articles): expense deep-dives — recording-expenses-and-receipts, paying-for-expenses-personally.

**Wave 4** (15 articles + 2 new topics): PAYE & Payroll topic launched (PAYE for directors, hiring first employee, NIC, tax codes, P11D, auto-enrolment, P60/P45), Year-End Accounts topic launched (deadlines, understanding figures, documents needed), VAT (flat rate, HMRC letters, MTD VAT), Self-Assessment (MTD ITSA), Corp Tax (sole trader vs Ltd).

**Wave 5** (15 articles): Self-Assessment (amending, refunds, SA302 mortgages, HMRC investigation), Companies House (shares, dormancy, director's responsibilities), Corp Tax (capital allowances + AIA, BADR closing, R&D credits), Dividends (accounting/reclassification, higher-rate dividend tax), Expenses (buying a company car), PAYE (PAYE penalties, SSP/SMP).

## Architecture

- Sanity schemas: `knowledgeTopic`, `knowledgeArticle`, `knowledgeArticleFeedback` in `src/sanity/schemas/`
- New field on article: `draftedSources` — array of `{url, title, source}` populated by the drafter with the gov.uk URLs Gemini cited via Google Search grounding
- Routes: `src/app/(site)/learn/page.tsx`, `[topic]/page.tsx`, `[topic]/[slug]/page.tsx` — all `export const dynamic = "force-dynamic"` (ISR clashes with the `(site)` layout's `getBrand()` → `headers()` call)
- Lighter chrome for `/learn/*`: `src/components/layout/LearnHeader.tsx` + `LearnFooter.tsx`, wired conditionally in `src/app/(site)/layout.tsx` via the `x-pathname` header set by middleware
- Workwell access: `my.workwellaccountancy.com/learn` works — `/learn` and `/api/learn-feedback` added to `PORTAL_PUBLIC_PASSTHROUGH` in `src/middleware.ts`

## The drafter pipeline

Three scripts in `scripts/learn-seed/`:

1. **`05-create-hubs.mjs`** — Idempotent. Creates the topic documents (published) and the article documents (as Sanity drafts). Reads spec from `launch-hubs.mjs`. Won't clobber existing bodies; refreshes metadata only.
2. **`06-draft.mjs`** — Drafts article bodies via Gemini 2.5 Flash with `tools: [{ google_search: {} }]` grounding. Output is markdown, parsed to PortableText. Captures grounding sources, appends a "Sources & references" section to the body, and writes the sources list to the new `draftedSources` Sanity field. Flags:
   - `<slug>` — only draft that one article
   - `--force` — overwrite even if body already exists
   - `--include-published` — create a fresh draft alongside an already-published article (lets you re-review it without disturbing the live page)
3. **`07-enrich-topics.mjs`** — Patches each topic's `keyFacts`, `timeline`, `usefulLinks`, `quickAnswers` from the embedded constants. Idempotent. Re-run whenever you tweak the constants.

Source spec: `scripts/learn-seed/launch-hubs.mjs` — both the topic list and the article hubs are here.

## Reviewer dashboard

In Sanity Studio sidebar: **🔍 Learning Centre — Review queue** with five filtered views:

1. **🔴 To review — no accountant sign-off** (`!defined(lastReviewed)`)
2. **🟡 To review — has grounding sources** (`!lastReviewed && defined(draftedSources) && length(draftedSources) > 0`)
3. **⚠ To verify — no grounding** (`!lastReviewed && (!defined(draftedSources) || length(draftedSources) == 0)`)
4. **✓ Reviewed & ready to publish** (`defined(lastReviewed)`)
5. **🟢 Live on /learn (published)** (`!(_id in path("drafts.**"))`)

Configured in `sanity.config.ts`. Articles disappear from 🔴/🟡/⚠ the moment an accountant sets `lastReviewed`.

## Recent commits (in order)

- `bc3a75a9` — Lighter chrome (LearnHeader/LearnFooter) + Wave 2 spec
- `54029aa1` — Topic page reorder + hero polish (articles above the fold)
- `5b015124` — Allow `/learn` on `my.*` portal hosts without auth gate (Workwell access)
- `28a22e82` — Wave 4 (PAYE/Year-End topics + 15 articles) + grounded drafter + reviewer dashboard
- `ecedb9c5` — Wave 5 spec (15 more articles across existing topics)

All on `main`. Vercel auto-deploys.

## Articles still without grounding sources (need extra accountant scrutiny)

These landed in the ⚠ dashboard view:

- `vat-payments-and-refunds`
- `self-assessment-payments-on-account`
- `capital-gains-and-property-income`
- `dealing-with-hmrc-vat-letters`
- `sa302-and-accountant-references-for-mortgages`
- `dormant-company-status`
- `closing-your-company-and-badr`
- (a couple more — full list visible in the dashboard's ⚠ view)

Gemini's grounding decision is non-deterministic — retried twice with `--force`, these stubbornly refuse to search. Articles drafted from training data only. Accountant must review more carefully.

## Top grounded articles (highest gov.uk source counts — best soft-launch candidates)

| Article | Sources |
|---|---|
| company-shares-issuing-and-transferring | 35 |
| national-insurance-contributions-explained | 31 |
| p11d-benefits-in-kind-explained | 30 |
| sole-trader-vs-limited-company | 30 |
| salary-vs-dividends-optimum-split | 28 |
| directors-legal-responsibilities | 28 |
| p60-and-p45-explained | 27 |
| home-office-expenses | 27 |
| buying-a-company-car-tax-decision | 26 |
| statutory-sick-and-maternity-pay | 26 |
| hmrc-investigation-what-to-do | 25 |

Suggested first publish batch — 5 of these would be a credible soft launch.

## Operational next step (NOT a code task)

**The bottleneck is accountant review time.** 52 drafts in the queue need someone to:
1. Open the article in Studio
2. Read it, edit anything wrong
3. Spot-check the cited gov.uk URLs in `draftedSources`
4. Set `lastReviewed: today` and `reviewedBy: <name>`
5. Click Publish

Realistic throughput estimate:
- ~15-20 min per grounded article
- ~30-45 min per ungrounded article
- 45 grounded × 17 min + 9 ungrounded × 37 min ≈ **20 hours of focused accountant time** for the whole library

Three-hour-per-day pace → all 52 drafts live within ~7 working days.

## Tooling you can ask me to build later if reviewers hit friction

- "Set lastReviewed=today and publish" one-click custom action in Studio
- "Diff against last grounded version" view for re-review cycles
- A focused per-article "review report" exporter — PDF that lists the article + its cited sources for offline reading
- Per-topic review burndown chart
- Auto-notify in Slack when 5 articles are published in a session

## Open questions for the next session

- Should the 2 live articles be retracted (unpublished) until accountant-reviewed? Currently public.
- Bookkeeping topic launch (90 client Qs unaddressed)? Would be Wave 6.
- IR35 / Contractor topic articles? Existing schema, no articles yet.
- Pension articles (small but consistent Q volume)?
- Once reviewed and live, do we want internal-link automation (related articles by topic + applies-to overlap)?

## Files most relevant to picking up

- `scripts/learn-seed/launch-hubs.mjs` — the source-of-truth spec
- `scripts/learn-seed/06-draft.mjs` — grounded drafter; tweak the system prompt here to change tone
- `scripts/learn-seed/07-enrich-topics.mjs` — topic-page key facts / timeline / etc.
- `sanity.config.ts` — Studio nav + reviewer dashboard structure
- `src/sanity/schemas/knowledgeArticle.ts` — article schema, including the `draftedSources` field
- `src/app/(site)/layout.tsx` — conditional chrome (`useLightChrome` on `/learn/*`)
- `src/components/layout/LearnHeader.tsx`, `LearnFooter.tsx` — the lighter chrome
- `src/app/(site)/learn/[topic]/page.tsx` — topic page (articles-first ordering, jump anchors)

## scratch/learn-seed/ (gitignored, kept locally)

- `raw.jsonl` — 3,000 anonymised inbound EmailMessages from production
- `classified.jsonl` — Gemini-classified per email
- `clusters.jsonl` — 85 thematic hubs across 18 topics; the drafter pulls real client phrasings per hub from here
- `final-seed.md` — human-readable summary of the analysis
