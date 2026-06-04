# Client Portal — Governance Readiness

_Meeting prep · response to CTO review · June 2026_

---

## Where it is today

Phase 1 of the portal is live on `my.cleveraccounts.com` and `my.workwellaccountancy.com` with a small internal cohort. No clients onboarded yet. Architecture: Next.js on Vercel (London), Supabase Postgres (London), Clerk auth, Resend email, Salesforce as system of record. **Postgres holds a read cache only — no financial data, no documents.** Sensitive surface area is small by design.

---

## The six concerns

| # | Concern | Current state | Proposed |
|---|---|---|---|
| 1 | **Ownership & support** | Solo build. Named owner: Chris. No formal SLA. No 24/7 cover. | **Phase 1**: business-hours SLA, best-effort outside. Monthly dependency review. Aligns with existing practice support model (clients aren't expecting 24/7 from the firm). **Phase 2**: second engineer onto a rota when client volume justifies. |
| 2 | **Change management & release** | Push-to-main → auto-deploy. CI runs (typecheck, build, tests) but isn't blocking. Solo dev = no PR review. | Branch protection on `main` with required CI green + one reviewer (CTO's team can be the reviewer until a second dev joins). Formal staging tier between branch deploys and prod. Documented rollback runbook (one click on Vercel/Azure). Mirrors the Salesforce SDLC we already follow (sandbox → prod, RunSpecifiedTests gate). |
| 3 | **Security sign-off / pentest** | Budgeted (£5–8k), CREST firm, 5-day scope, on roadmap — not commissioned. | Commission before launch. Three candidate firms: Cure53, NCC, PortSwigger partners. Scope: portal subdomains + APIs + auth flow + Clerk webhook + SF integration boundary. Includes retest after fixes. Findings register. **Target date: before broad rollout (~Q3).** |
| 4 | **IT visibility** | Built outside the company's standard governance. Not on any asset register or ROPA entry. | One-page **infrastructure & data inventory** (drafted alongside this doc): hosts, DBs, vendors, data classification, access matrix, secrets register, MFA enforcement points. Added to whatever asset/CMDB the rest of the estate uses. ROPA entry created. Vendor DPAs collected for Clerk, Resend, Supabase. |
| 5 | **DR & continuity** | Per-vendor: Vercel/Azure down → portal down, no data loss (SF is source of truth). Clerk down → no new logins, existing sessions live. SF down → portal serves from Postgres cache (architectural win). Supabase down → no fallback today. | Documented RTO/RPO per dependency. Postgres PITR confirmed enabled (Supabase 7-day standard). Per-scenario runbook (half-day to write). Supabase fallback to live SF reads (with API-limit guard) as Phase 2 hardening. Quarterly tabletop. |
| 6 | **How it was specced / written / tested / deployed** | AI-assisted development (Claude Code) with human review on every change. Plan + architecture + security-hardening docs all written down. Test suite exists (e.g. 16 tests on the invite stack, 90% coverage on the onboarding service). Audit log table records every portal event. | Be transparent about this — Cursor/Copilot/Claude Code are mainstream and defensible. Gaps to close: PR template, code-review checklist, ticket-per-change discipline (Linear/Jira), integration test environment. All paperwork, none of it structural. |

---

## What's already in place (worth surfacing — not a gap)

The portal isn't a skunkworks vibe-code job. Six security foundations were built in before Phase 1 went live:

1. **Clerk ↔ Salesforce link table** with email-verified mapping — closes the biggest IDOR risk
2. **`withAccountScope()` wrapper** — every Postgres query is scoped to the logged-in user's account at a single chokepoint
3. **Append-only audit log** — every login, view, action, IP, user-agent recorded
4. **Strict CSP + security headers** on portal routes (no `unsafe-eval`, HSTS preload on prod, frame-deny, scoped allowlist)
5. **Rate limiting** (Upstash sliding window) on portal API routes, tighter on auth-adjacent
6. **Production Clerk** with MFA enforcement (in progress)

Plus HMAC-signed callouts between Salesforce and the portal, Svix-verified Clerk webhooks, subdomain-scoped cookies, and a dedicated Salesforce integration user with explicit field-level permissions.

---

## Hosting — Vercel vs Azure

We're using these Vercel features today: Analytics, Speed Insights, Blob, Skew Protection, Edge Middleware. **All have direct Azure equivalents**: App Insights, Blob Storage, Container Apps revisions, Front Door.

**Position to take**: if WWG's portal already runs Next.js on Azure, aligning is the right call — cost, consolidation, and Vercel's recent breach all point the same way. The migration is **1–2 weeks of dev + 1 week of testing/cutover** assuming we get WWG's reference architecture. No application code rewrite; it's a deployment-target swap.

**Ask in the meeting**: WWG's specific Azure setup — App Service, Static Web Apps, Container Apps, or AKS? That determines the target architecture and the cutover plan.

---

## Honest gaps (acknowledge before he raises them)

- No QA function; tests are developer-written
- No integration test environment beyond branch deploys against sandbox SF
- No ticket-per-change discipline yet
- Supabase fallback for SF outage not wired
- Portal data not yet on the company ROPA
- Pentest not yet commissioned (only roadmapped)
- 24/7 on-call not resourced

None of these are blockers for the internal pilot. All need to be closed before broad rollout.

---

## Proposed sequence

| Weeks | Focus |
|---|---|
| 0–1 | Infrastructure inventory, ROPA entry, vendor DPAs collected, asset register entry — **paperwork that unblocks IT visibility immediately** |
| 1–2 | Change management hardening: branch protection, PR review, formal staging, rollback runbook |
| 2–4 | Azure migration (parallel to above, assuming WWG architecture confirmed) |
| 3–4 | DR runbook, PITR confirmation, tabletop exercise |
| 4–6 | Pentest commissioned, executed, findings remediated, retested |
| 6+ | Broad rollout |

**Framing for the meeting**: most of this is governance paperwork around a product that's in better technical shape than the wrapper around it. Closing it is a 4–6 week tidy-up, not a rebuild.
