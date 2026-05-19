# Client Portal — System & Infrastructure Overview

_For CTO review · May 2026 · Phase 1 live on test address, broad launch on the horizon_

---

## In one paragraph

A web app that gives every accountancy client a personal home page — onboarding progress, who their accountant is, call booking, document signing, messaging. **One codebase serves both Clever Accounts and Workwell Accountancy**; the app picks the right brand from the web address. Hosted on **Vercel** in London. Backed by **Salesforce as source of truth**, with a **Supabase Postgres copy in London** for fast reads. **Clerk** handles sign-in. Built from day one to be tested by an outside security firm.

## How it fits together

```
       cleveraccounts.com  /  workwellaccountancy.com       (marketing)
       my.cleveraccounts.com / my.workwellaccountancy.com   (portal)
                              │
                  ┌───────────▼────────────┐
                  │ Vercel (London)        │  Security headers, login gate,
                  │ Next.js app (one repo) │  brand decided by web address
                  └───────────┬────────────┘
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼────┐         ┌──────▼──────┐        ┌──────▼──────┐
   │ Clerk   │         │  Postgres   │        │ Salesforce  │
   │ Sign-in │         │  (London)   │◄───────│  (source    │
   │ + MFA   │         │  Fast copy  │ signed │   of truth) │
   └─────────┘         └─────────────┘ sync   └─────────────┘
```

Reads hit the Postgres copy — fast. Writes go to Salesforce. Salesforce broadcasts changes back to the Postgres cache via signed Platform Events (~2-5 second sync).

## The tech

| Layer | What we use |
|---|---|
| Hosting | **Vercel Pro**, London region — built by the team behind Next.js |
| Framework | **Next.js 16** (latest), React Server Components |
| Database | **Supabase Postgres**, eu-west-2 (London) |
| ORM | **Drizzle** — type-safe queries, wrong column names fail at build time |
| Sign-in | **Clerk** — passkey + magic-link, MFA-enforceable, SOC 2 Type II |
| Rate limiting | **Upstash Redis** (EU) |
| File storage (Phase 2) | **Vercel Blob** (London) — replaces Salesforce Files at ~£0.10/GB vs ~£20/GB |
| Email | **Resend** (new) + **SendGrid** (legacy) |
| Observability | **Vercel Analytics + Speed Insights** |
| Marketing CMS | **Sanity** |

Eleven external integrations, all standard choices for their purpose: Salesforce, Clerk, Stripe, Calendly, **Credas** (FCA-recognised UK ID verification for AML), Companies House, HMRC, Resend, SendGrid, Sanity, Cloudflare Turnstile. Everything that holds client data is in UK or EU regions.

## Security

Designed for an outside CREST-accredited pentest before broad launch. Three load-bearing decisions:

### 1. Single chokepoint for "only your own data"

Every data fetch in the app goes through **one function, `withPortalScope()`**. It reads the verified Clerk session, looks up the Salesforce Account that signed-in client belongs to, and only ever passes *that* Account's ID downstream. It is **structurally impossible** for a route handler to accept a client-supplied "show me account X" parameter. Even a sloppily-written future page can't accidentally show one client's data to another. As a second line of defence, the Postgres database has row-level security enabled.

### 2. Two separate Salesforce service accounts

The marketing site (creating Leads) uses one Salesforce Connected App. The portal uses a **separate, least-privilege Connected App** bound to a dedicated Integration User. The portal's API key can only see portal-relevant records — no salaries, no internal notes, no records belonging to clients other than the one currently signed in. If a portal token leaks, the blast radius is bounded.

### 3. Everything else

- Sign-in via Clerk — passkey or magic link, no passwords stored. MFA required from launch
- HTTPS only with HSTS preload. Strict Content Security Policy on portal pages — locked allowlist of which third-party scripts can run
- Sign-in cookies HTTP-only, Secure, SameSite=Strict, scoped to portal subdomain only
- Salesforce → portal sync messages signed with HMAC-SHA256. Forged or replayed messages rejected
- Rate-limiting on every portal API endpoint via Upstash
- **Append-only audit log** — every login, page view, action, IP, and user agent. The database refuses UPDATE or DELETE on these rows. Shipped to a separate aggregator pre-launch
- Production secrets in Vercel encrypted env vars only, never in the codebase
- Vercel Skew Protection on — clients with warm tabs never hit half-loaded code during deploys

## Where we are

| | Status |
|---|---|
| **Phase 1 features** (read-only dashboard, EL signing, Calendly, messaging, both brands) | ✅ Live on test address |
| **Dashboard redesign** | ✅ Shipped May 2026, modelled on Mercury Bank / Linear |
| **Postgres sync from Salesforce** | ✅ Running |
| **Stage 1 security hardening** (locked-down SF Integration User) | ✅ Sandbox · production pending |

**Three milestones to broad launch:**

1. **DNS cutover** — point `my.cleveraccounts.com` and `my.workwellaccountancy.com` at Vercel. In progress this week.
2. **External pentest** — 5-day engagement with a CREST-accredited firm. ~£5–8k. Full report + retest after fixes.
3. **Pilot** — 5–10 friendly clients use it for a fortnight before opening to the full 6,500-strong book.

**Phase 2** (after pentest): client document uploads (Vercel Blob), real-time messaging, web push, mobile app via Capacitor (same codebase, two App Store listings), optional AI assistant that drafts replies for accountants to review before sending.

## Ask

Twenty minutes of your time on two design decisions in particular:

1. **The `withPortalScope()` chokepoint.** If this is right, an entire class of cross-account data-leak vulnerabilities is structurally impossible.
2. **The split between the two Salesforce Connected Apps.** Confirm that this is the right level of isolation between marketing-site and portal credentials.

Those are the heaviest engineering decisions and the two places I most want a second pair of eyes before the external test.
