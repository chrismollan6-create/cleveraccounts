# Client Portal — Production Go-Live Runbook

**Domains:** `my.cleveraccounts.com` (Clever) · `my.workwellaccountancy.com` (Workwell)
**Strategy:** access-gated **invite-only production pilot** → external pentest → broad launch.
**Status:** planning. This runbook is the execution checklist; tick items as they land.

> Why go live now (not later): the local dev stack (dev Clerk + dev Supabase + cache-only reads) **cannot** prove the production architecture, the SF→Clerk→portal linking, or give pentesters a real target. Standing up the real structure — but exposed only to a tiny consenting cohort — de-risks everything before broad launch.

---

## Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Clerk model | **Option B — separate Clerk app per brand** | **Brand-pure auth URL/email is a deal-breaker** — a Workwell client must not receive sign-in links/emails on a `cleveraccounts.com` domain. B gives each brand its own Clerk app → own auth domain (`clerk.cleveraccounts.com` / `clerk.workwellaccountancy.com`), own email sender, own user pool, own MFA policy. Implemented as **two Vercel projects from one repo** (see below) so there's **no runtime per-host key-switching code**. Supabase + SF stay shared (scoped by `brand`). Cost: two Clerk apps + two Vercel projects to manage. |
| Pilot environment | **Access-gated production** | Tests the real stack; 5–10 consenting friendly clients; everyone else hard-gated until post-pentest. |
| Hosting | **Vercel** (push to `main` = prod; previews = sandbox env) | Already migrated off Netlify. |
| Data isolation | One Supabase prod project + one SF prod org, scoped by `brand` column / field | Brand is a column on `portal.users`/`portal.accounts`; SF uses `Branding__c`. |

---

## Target production topology

```
my.cleveraccounts.com ─► Vercel project "portal-clever"  ─► Clerk app (Clever)  ─┐
                              (same repo, brand env)                              ├─► Supabase PROD (RLS on)
my.workwellaccountancy.com ─► Vercel project "portal-workwell" ─► Clerk app (WW) ─┘        ▲
                              (same repo, brand env)        │                              │ sync (HMAC)
                                                      /api/portal/* ──► Salesforce PROD org  (shared, scoped by brand)
                                                        (Bearer + scoped JWT)               │
                                                            ▲                               │
                                                            └─ SF triggers → Portal_Sync_Event__e → Queueable → HMAC callout ─┘
```

---

## Phase 0 — Pre-flight (no prod changes yet)

- [ ] **Freeze a release branch** off the portal work; confirm `npm run build` + `tsc --noEmit` clean.
- [ ] **Data-protection sign-off**: pilot uses *real* client data → confirm DPA/consent for the pilot cohort; brief the cohort that it's a pilot.
- [ ] **Inventory secrets** to be generated (see Secrets Matrix below).
- [ ] **Confirm SF deploy safety**: `force-app` working tree is dirty (100+ uncommitted files) → deploy **only changed portal files** via `--source-dir`, always `--dry-run` first. Note the org-wide `responseTimeByPersonBH` stale-symbol issue blocks `RunLocalTests` → use **RunSpecifiedTests** scoped to portal classes.

---

## Phase 1 — Infrastructure

### 1a. Clerk (two production apps — Option B)
- [ ] Create Clerk **prod app "Clever Accounts Portal"** → `pk_live`/`sk_live`, webhook secret, custom auth domain `clerk.cleveraccounts.com`, email sender on the Clever domain.
- [ ] Create Clerk **prod app "Workwell Portal"** → its own `pk_live`/`sk_live`, webhook secret, custom auth domain `clerk.workwellaccountancy.com`, email sender on the Workwell domain.
- [ ] Each: enforce **MFA**, enable **passkey + magic link**, attach **Cloudflare Turnstile**, restrict sign-up to **invitation only**.
- [ ] **No per-host key code.** Isolation is achieved by deploying the repo as **two Vercel projects** (Phase 1c), each carrying ONE brand's Clerk keys — each deployment is a clean single-instance Clerk app. Brand is still detected from host for theming/content.

> **Why two deployments, not one with runtime key-switching:** Clerk's Next SDK expects one instance per app (secret read from env); selecting `pk/sk`/webhook per-host at runtime in a single deployment is awkward and was the previously "highest-risk" item. Two Vercel projects of the same repo sidesteps it entirely — full brand-pure auth isolation, no risky code. Trade-off accepted: two Clerk apps + two Vercel projects to operate.

### 1b. Supabase (production)
- [ ] New **prod project** (EU region) — do not reuse the dev project.
- [ ] Apply **all migrations 0000–0006** via `scripts/apply-portal-migration.mjs` against the prod connection string.
- [ ] Verify **RLS enabled** on all portal tables (incl. new `companies`, `officers`, `deadlines`, `notifications`).
- [ ] Capture prod `SUPABASE_DB_URL` (transaction pooler, `prepare:false`).

### 1c. DNS & Vercel (two projects — one per brand, same repo)
- [ ] Create **two Vercel projects from the same repo**: `portal-clever` (`my.cleveraccounts.com`) and `portal-workwell` (`my.workwellaccountancy.com`). Both deploy from `main`.
- [ ] Point each domain at its project (Cloudflare CNAME, **DNS-only / grey cloud**). Re-point if still aimed at Netlify.
- [ ] Each project's **Production** env = that brand's Clerk keys/webhook + the shared Supabase/SF/HMAC secrets (see Secrets Matrix). Previews stay on dev/sandbox keys.
- [ ] Set `BRANDS.workwell.portalDomain = 'my.workwellaccountancy.com'` (placeholder today). **← code change.**
- [ ] Optionally pin brand per project via `PORTAL_BRAND` env for explicitness; otherwise host detection covers it.
- [ ] Confirm `isStrictProduction()` treats both custom domains as strict-prod (HSTS, no `_brand` override, no dev `unsafe-eval`).

---

## Phase 2 — Salesforce (PRODUCTION org — handle with care)

### 2a. Stage 1 — dedicated integration identity
- [ ] Create SF user `portal-integration@cleveraccounts.com` (Integration license if available).
- [ ] Assign `Portal_Integration_User_PS` permission set.
- [ ] **Grant FLS** on portal-written long-text fields to that perm set (Apex can write fields that aren't queryable/visible until FLS is granted).
- [ ] Create **second Connected App** `Portal_Integration_App` (separate from the general app → granular revocation), client-credentials run-as = the integration user, minimal scopes.
- [ ] Retrieve Consumer Key/Secret → `SALESFORCE_PORTAL_CLIENT_ID` / `_SECRET` in Vercel prod.

### 2b. Deploy Apex
- [ ] `--dry-run` validate the changed portal classes/triggers/objects against prod.
- [ ] Deploy with **RunSpecifiedTests** (portal test classes only): `PortalRestService`, `PortalRequestAuth`, `PortalAccessService`, `PortalMessagingService`, `PortalSync*`, `PortalBackfillBatch`, `PortalInviteService/Queueable/Callout`, perm set, triggers, objects/fields.
- [ ] Deploy new cache-backing SF objects/fields if syncing CH/deadlines (see Phase 2e).

### 2c. Secrets + remote site
- [ ] Generate prod HMAC secrets: `openssl rand -base64 48` ×2 (JWT inbound, sync outbound).
- [ ] Set in **both** Vercel prod (`PORTAL_APEX_JWT_SECRET`, `PORTAL_SYNC_HMAC_SECRET`) **and** SF `Portal_Auth_Setting__mdt.HMAC_v1` (`HMAC_Secret__c`, `Sync_HMAC_Secret__c`).
- [ ] Set `Sync_Webhook_URL__c = https://my.cleveraccounts.com/api/portal/sync` (+ Workwell equivalent).
- [ ] Set `Invite_Webhook_URL_Clever__c` / `Invite_Webhook_URL_Workwell__c`.
- [ ] Deploy **Remote Site Settings** for `https://my.cleveraccounts.com` + `https://my.workwellaccountancy.com` (allow Apex callouts).

### 2d. Activate sync + backfill
- [ ] Confirm triggers publish `Portal_Sync_Event__e` and the Queueable callout fires (inspect `AsyncApexJob`).
- [ ] Run `PortalBackfillBatch` per object type to seed the cache (Account, Contact, Case[Origin=Portal], EmailMessage, Engagement_Letter__c, New_Client_Workflow__c, User).

### 2e. ⚠️ New surfaces need sync built (gap)
The surfaces built recently are **cache-backed but their SF→cache sync is not yet implemented** (they're seeded for demo only):
- [ ] **CH company/officers** (`portal.companies`, `portal.officers`) — build trigger + snapshot from `CH_Company__c`/`CH_Officer__c`/`CH_Company_Officer__c`, or they render empty in prod.
- [ ] **Deadlines** (`portal.deadlines`) — aggregate CH dates + VAT/SA/CT/payroll from SF.
- [ ] **Notifications** (`portal.notifications`) — server-side event raising (deadline approaching, reply received, item to approve).
- [ ] **Money snapshot** — FreeAgent figures (not built).
> Decide per surface: ship now with sync, or hide behind a "coming soon" flag for the pilot.

---

## Phase 3 — The linking flow (the core thing to test)

End-to-end path to validate:
```
SF Flow on New_Client_Workflow__c stage → PortalInviteService (@InvocableMethod)
  → PortalInviteQueueable → PortalInviteCallout (HMAC) → POST /api/portal/invite
  → Clerk invitation API → branded email → client signs up
  → Svix webhook → /api/portal/clerk-webhook → PortalAccessService.findForEmail
  → upsert portal.users (clerk_user_id ↔ account_sf_id) → scoped portal data
```
- [ ] **Build the invite Flow** (does not exist yet) — confirm trigger criteria with the team (which stage transition fires an invite).
- [ ] **Harden invite webhook**: add timestamp + replay window to the invite HMAC (currently no replay protection — match `sync-verify.ts`).
- [ ] Fix `PortalAccessService.findForEmail` `LIMIT 200` Contact scan (fail-closed today → legitimate clients beyond the window get denied). Make it a targeted SOQL on email.
- [ ] **Test with a real pilot account end-to-end**: fire the Flow → receive invite → sign up with MFA → land on the dashboard showing *that account's* real synced data → send a message → confirm it lands on the SF Case.

---

## Phase 4 — Access gating & pilot cohort

- [ ] Confirm `AccessGate` blocks any signed-in user without an `active` `portal.users` row (pending/disabled → gated, no data leak; don't reveal whether an email exists).
- [ ] Invite only the **5–10 pilot clients**; everyone else cannot self-serve in.
- [ ] Wire **Upstash** rate limiting (`UPSTASH_REDIS_REST_URL`/`_TOKEN`) in prod (fails hard in prod by design).
- [ ] Verify the prod CSP (nonce/`unsafe-inline` status), HSTS, and security headers on both domains.

---

## Phase 5 — Pentest readiness

- [ ] **Scope doc** for the CREST firm: domains, auth model (Clerk→JWT→Apex), data-scoping (IDOR) chokepoint, in-scope endpoints (`/api/portal/*`), the SF boundary, write ops (send message, approve, sign).
- [ ] Provision **dedicated pentest accounts** on prod (clearly flagged, in a test-brand or test-account so they can probe without touching real client data).
- [ ] Stand up **automated SAST in CI**: Snyk + Semgrep + OWASP ZAP baseline against a preview deploy.
- [ ] Provide the internal security-review notes + this runbook to the testers as context.
- [ ] Agree remediation/re-test window (your plan: Phase G fixes + re-test).

---

## Phase 6 — Go-live verification checklist (run on both domains)

- [ ] Hit `https://my.<brand>.com/portal/dashboard` unauthenticated → redirected to branded sign-in.
- [ ] Sign in (MFA enforced) as a pilot user → dashboard shows **that account's** real data.
- [ ] Vercel logs: **no** "falling back to GENERAL Connected App" warning (Stage 1 user active).
- [ ] Make a SF change to the pilot account → appears in the portal within ~5–15s (sync working).
- [ ] Send a portal message → `EmailMessage` lands on the SF Case immediately; reply on the Case → appears in portal on next poll.
- [ ] Attempt cross-account access (swap ids in requests) → blocked at both Next.js scope and Apex JWT layers.
- [ ] Workwell host renders Workwell branding + uses the Workwell Clerk app.

---

## Phase 7 — Broad launch (post-pentest)

- [ ] Pentest fixes applied + re-tested.
- [ ] Backfill remaining client cohort into the cache in stages.
- [ ] Open invite Flow to all eligible new + existing clients.
- [ ] Monitoring/alerting on portal access + sync failures (BetterStack — your Stage 6 item).

---

## Secrets matrix

| Secret / var | Where set | Notes |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **each** Vercel project | `pk_live` — that project's brand Clerk app |
| `CLERK_SECRET_KEY` | **each** Vercel project | `sk_live` per brand |
| `CLERK_WEBHOOK_SECRET` | **each** Vercel project | per-brand Svix signing secret |
| `SUPABASE_DB_URL` | Vercel prod | prod project, pooler |
| `SALESFORCE_PORTAL_CLIENT_ID` / `_SECRET` | Vercel prod | second Connected App |
| `SALESFORCE_INSTANCE_URL` | Vercel prod | prod org |
| `PORTAL_APEX_JWT_SECRET` | Vercel prod **+** SF `HMAC_v1.HMAC_Secret__c` | must match |
| `PORTAL_SYNC_HMAC_SECRET` | Vercel prod **+** SF `HMAC_v1.Sync_HMAC_Secret__c` | must match |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Vercel prod | rate limiting |
| (SF) `Sync_Webhook_URL__c`, `Invite_Webhook_URL_*` | SF custom metadata | per-brand URLs |
| ❌ `SALESFORCE_ACCESS_TOKEN` | **never in prod** | local-dev only — causes INVALID_SESSION_ID on expiry |

> **Sharing rule:** only the three **Clerk** vars differ per project (each gets its own brand's app). **Everything else — Supabase, Salesforce, HMAC/JWT, Upstash — is identical in both Vercel projects** (shared backends, scoped by `brand`).

---

## Risks & gotchas (known)

- **This repo connects to the PRODUCTION SF org** — every Apex deploy is live. Dry-run + changed-files-only + RunSpecifiedTests.
- **`responseTimeByPersonBH` stale symbol** blocks org-wide `RunLocalTests` — scope tests to portal classes.
- **Clerk Option B operational cost** — two Clerk apps + two Vercel projects to keep in sync (MFA policy, Turnstile, webhook URLs, env vars). **Do NOT** implement B as one deployment with runtime per-host key-switching (awkward/risky) — use the two-deployments approach (each is a clean single-instance app). Both projects deploy from the same `main`.
- **New cache surfaces (CH/deadlines/notifications/money) have no SF sync yet** — decide ship-with-sync vs hide-for-pilot.
- **Invite Flow doesn't exist** + invite webhook lacks replay protection — both on the critical linking path.
- **Branch/preview deploys must stay on dev/sandbox keys** — only the Production context gets live keys.
- **GDPR**: real client data in pilot → consent + DPA before inviting anyone.

---

## Open items needing an owner / decision

1. Trigger criteria for the invite Flow (which stage transition).
2. Pilot cohort selection (which 5–10 clients).
3. Which new surfaces ship for the pilot vs hide behind "coming soon".
4. CREST pentest firm + dates (D-U-N-S / scheduling lead time).
5. Stand up the **two Vercel projects** + **two Clerk apps** with per-brand auth domains (`clerk.cleveraccounts.com`, `clerk.workwellaccountancy.com`) early in Phase 1. Everything else (Supabase, SF, secrets) is shared/identical across both.
