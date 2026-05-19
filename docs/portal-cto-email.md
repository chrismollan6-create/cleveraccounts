# Email body — send to CTO

**Subject:** Client portal — overview ahead of launch

---

Hi [name],

Quick summary of where we are with the client portal. Longer doc attached — this is the headlines.

## What we've built

A web app that gives every client a personal home page for everything to do with their account: where they are in onboarding, who their accountant is, how to book calls, where to sign documents, how to message us. One codebase serves both **Clever Accounts** and **Workwell Accountancy** — the app decides which brand to show based on which web address the client typed in.

Hosting is **Vercel** (London region). The database is **Supabase Postgres** (also London). **Salesforce stays in charge** — Supabase is a fast read copy, kept up to date within seconds of any Salesforce change.

## Security — what we've done

Designed from the start to be tested by an outside security firm. The main things in place:

- **Login is handled by Clerk**, a specialist auth provider. Clients sign in with a passkey or a one-tap email link. We never see or store their passwords. Two-factor sign-in is on the roadmap to be required from launch.
- **One small piece of code controls every data fetch.** Every page that pulls client data goes through it. The function works out who's signed in and only ever returns *that* client's data. It is structurally impossible for one client to see another's data — even if a future developer wires a new page up badly.
- **Salesforce has two separate API keys** — one for the marketing site (creating leads), and a separate, restricted one for the portal. The portal's key can only see the records the portal needs. No salaries, no internal notes, no other clients.
- **The database has row-level security** as a second line of defence. If the function above is somehow skipped, the database itself refuses the query.
- **Messages between Salesforce and the portal are signed** with a shared secret. Forged messages get rejected.
- **Browser security headers** stop the portal being embedded in another site, force HTTPS, and limit which third-party scripts the page can load.
- **Every login, page view, and action is logged** — who, when, where from, what. These records can't be edited or deleted.
- **Login cookies** are tied to the portal subdomain only and can't be read by JavaScript or sent in cross-site requests.
- An **external security firm will pentest** the portal before broad launch.

## What's underneath

**Next.js** (the current standard for React apps) hosted on **Vercel**. Database is **Postgres on Supabase**. Login is **Clerk**. Rate limiting (stops abuse) runs on **Upstash Redis**. File storage for client documents in Phase 2 is **Vercel Blob**, set up in London so client files stay in the UK.

Eleven external services connect in: **Salesforce** (the firm's CRM), **Clerk** (login), **Stripe** (payments), **Calendly** (booking), **Credas** (regulated UK ID checks), **Companies House**, **HMRC**, **Resend** and **SendGrid** (transactional email), **Sanity** (blog content), **Cloudflare Turnstile** (sign-up bot protection).

**Everything that holds client data is in the UK or EU.**

## Where we are

**Phase 1 is live on a test address.** Clients can see their onboarding progress, see their accountant, book calls, sign engagement letters, and message us. Both brands work. The dashboard was redesigned last week to look like a modern app.

To get to broad launch we still need to:

1. Switch the real `my.cleveraccounts.com` and `my.workwellaccountancy.com` addresses to point at Vercel (in progress this week)
2. Roll out the restricted Salesforce API key to production (already done in sandbox)
3. Tighten the last security headers
4. Get the external pentest done
5. Pilot with 5–10 friendly clients before opening it to the full 6,500-strong client base

**Phase 2** (after pentest): clients upload their own documents, real-time messaging, push notifications, and an optional AI helper that drafts replies for accountants to review and send.

## Ask

If you have twenty minutes, I'd value your eyes on two things in the longer doc:

- The single-function chokepoint that controls every data fetch
- The split between the two Salesforce API keys

Those are the heaviest design decisions and the parts I most want a second opinion on before the external test.

Happy to walk through whenever suits.

Best,
Chris
