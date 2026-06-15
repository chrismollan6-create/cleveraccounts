# IR35 Opinion Questionnaire — wording sign-off pack

**Purpose:** every client-facing statement in the questionnaire that makes an IR35 / tax assertion, for an IR35-aware accountant to approve or amend **before the form is sent to clients**.

**Form:** `src/app/(site)/forms/ir35-opinion-questionnaire/page.tsx`
**Last grounded:** 2026-06-15 (deep-research vs gov.uk / HMRC manuals / ITEPA 2003). Plain field labels with no IR35 assertion are omitted.

Legend: ✅ = verified against an authoritative source · ⚠️ = practitioner/case-law framing, **needs specialist confirmation** · 🗓️ = date-sensitive.

| Sign-off | Where | Current wording | Status & source |
|---|---|---|---|
| ☐ | Intro box | "An IR35 assessment looks at two things together: the wording of your written contract *and* how you actually work day-to-day with the client. HMRC can look past the paperwork to the reality…" | ✅ Reality-over-label principle (Autoclenz; HMRC ESM). |
| ☐ | "Off-payroll & status determination" section description | "Since April 2021, for medium and large clients it's the client — not you — who decides your status." | ✅ gov.uk/guidance/understanding-off-payroll-working-ir35; ESM10000. Public sector since 2017. *Optional add: public-sector clients of any size must determine (no small exemption).* |
| ☐ | Tooltip — `endClientSmall` | "If the client is medium or large, the off-payroll rules make THEM responsible for deciding your status (and giving you an SDS). If the client is small, responsibility stays with your own company. Size is based on the client's turnover, balance sheet and staff." | ✅ gov.uk; ESM10011 (Chapter 10 vs Chapter 8). 🗓️ Thresholds rose £10.2m/£5.1m→£15m/£7.5m for FYs from 6 Apr 2025 but off-payroll effect defers to ~2027/28. Form states no figures (intentional). *Refinement: "small organisation" is more precise than "company".* |
| ☐ | Tooltip — `sdsIssued` | "An SDS is the client's formal written decision on your IR35 status, with reasons. Medium/large clients must provide one." | ✅ gov.uk; ITEPA 2003 s.61NA (must state conclusion **and** reasons; reasonable care). |
| ☐ | Tooltip — `cestResult` | "CEST is HMRC's free online 'Check Employment Status for Tax' tool. The result isn't legally binding, but HMRC will stand by it if your answers are accurate and reflect how you really work." | ✅ gov.uk/guidance/check-employment-status-for-tax; GfC4 Part 14; ESM11010 (no stand-behind for contrived/indeterminate results). CEST updated 30 Apr 2025. |
| ☐ | Tooltip — `q3EngagementsOver2Years` (24-month rule) | "If you expect to be at the same workplace for more than 24 months and spend 40%+ of your time there, travel and subsistence stop being claimable…" | ✅ EIM32080 (combined 24-month **and** 40%-of-time test; relief denied as soon as a >24-month expectation arises). |
| ☐ | Tooltip — `q15ClientControlsHow` (control) | "'Control' is a key IR35 test — it's about whether the client tells you how, when and where to do the work, rather than just what the end result should be." | ⚠️ Standard (Ready Mixed Concrete) but **not separately verified** in the grounding run — please confirm phrasing. |
| ☐ | Tooltip — `q9SubstitutionAllowed` (substitution) | "A genuine, unfettered right to send a substitute is a strong pointer towards being outside IR35 — but it has to be real in practice, not just a clause in the contract." | ⚠️ **Needs specialist confirmation.** Softened from "strongest indicator even if never used". Confirm the "unfettered / real in practice" framing vs current case law. |
| ☐ | Tooltip — `obligationOfferAccept` (MOO) | "Mutuality of obligation is whether the client must offer you work and you must accept it. It's one of several factors weighed together — recent case law (PGMOL) treats it as a fairly low bar — not decisive on its own." | ⚠️ **Needs specialist confirmation** post-PGMOL (Supreme Court 2024). |
| ☐ | Tooltip — `paymentBasis` | "One factor among many: a fixed price for a defined deliverable can support being in business on your own account, while a day or hourly rate is more neutral. It's never decisive on its own." | ⚠️ Practitioner view — confirm acceptable. |
| ☐ | Tooltip — `q13AdditionalHours` | "Working unpaid extra hours to deliver a result can point towards being in business on your own account." | ⚠️ Practitioner view — confirm acceptable. |
| ☐ | Tooltip — `confirmationOfArrangements` | "A Confirmation of Arrangements is a document the end client signs confirming how you actually work day-to-day. It's useful supporting evidence if HMRC ever questions the contract — as long as it matches reality." | ⚠️ Softened from "strong evidence". Confirm weight given to a CoA. |
| ☐ | Tooltip — `q31TrainingSpend` | "'Speculative' means training you fund yourself that may not be used on a specific contract — a sign of investing in your own business." | ⚠️ Practitioner view — low risk, confirm. |
| ☐ | New-contract guidance box | "As this contract hasn't started yet, please answer the questions below based on how you expect to work. Anything that asks what has happened so far … can be left blank." | ✅ Process guidance, no legal assertion. |

## Reviewer instructions
1. Tick each row you're happy with; for any you want changed, note the replacement wording in the right-hand column.
2. Priority rows are the ⚠️ ones (substitution, MOO, payment basis, extra hours, Confirmation of Arrangements, control).
3. Return to the dev team — wording lives only in `page.tsx` tooltips (`tip:`) / section `description:` strings, so changes are a one-line edit each.

**Reviewed by:** _________________  **Date:** __________  **Approved for client use:** ☐ Yes ☐ With amendments above
