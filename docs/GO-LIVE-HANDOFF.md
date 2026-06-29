# Workwell Go-Live — Handoff / Resume Doc

_Last updated: 2026-06-29. Self-contained so it works on any machine (the work is on `main`/`origin`)._

## TL;DR — where we are
The Workwell marketing site is **code-complete and deployed to production**. The only things left are **(1) one Sanity Studio edit** and **(2) the DNS cutover** — both are your manual actions, no code needed. Everything in the repo/CMS is done and pushed.

`workwellaccountancy.com` (apex) still points at the old **WordPress** site. Flipping DNS is the go-live moment.

---

## Branch state (important — read first)
- **`main`** = production (Vercel production branch). HEAD = `10dfcf6`. **Everything is merged in and live on the Vercel deploy.** Local `main` == `origin/main` (clean, 0 ahead/behind).
- **`feat/workwell-marketing`** = the old marketing branch. It was **merged into `main`** on 2026-06-29 (merge commit `06e1a8b`). No longer the source of truth — `main` is.
- **`integration/go-live`** = the throwaway branch used to do the merge. Now identical to `main`; safe to delete (`git push origin --delete integration/go-live` + `git branch -d integration/go-live`).

**On the new PC:** `git clone` the repo (or `git pull` on `main`). Everything is on `main`. You do NOT need `feat/workwell-marketing` anymore.

### The merge that happened
`main` and `feat/workwell-marketing` had diverged (33 vs 93 commits): `main` had the **MTD PDF** work; `feat` had the **Workwell marketing rebuild + portal** work. They were merged via `integration/go-live`, resolving ~50 conflicts to **feat's version** for the marketing pages (newer `ServiceRoute`/`BrandConfig` architecture; main's older brand-sweep superseded). MTD work was preserved (it never conflicted). Built clean (`tsc` + `next build`), fast-forwarded onto `main`, deployed.

---

## What was done this session (all on `main`, pushed)
- `0a7091c` — /learn: nav "About"→"Learn", trust band into dark hero, tightened guides list, ChromeSwitcher (fixes header/footer not swapping on soft-nav)
- `158118c` — /learn: muted topic cards (white, colour in chip/badge only)
- `06e1a8b` — **the go-live merge** (MTD + Workwell marketing)
- `0875d3f` — funnel brand leaks fixed (phone/Trustpilot/stats brand-aware), MTD reworded as add-on (code fallbacks), cookie "Manage" control in footers
- `cb1be47` — keyless bot protection on public forms (honeypot + time-trap + rate-limit) via `src/lib/formGuard.ts`
- `738ee17` — "50% off for 3 months" badge now on /limited-company, /contractor-accountancy, /accounting-for-startups, /contractor-accountants/ir35
- `10dfcf6` — brand-aware `metadataBase` in service-page metadata helpers

Also done in **Sanity** (CMS, not git):
- Published **37 Workwell blog posts** (the 2026-06-24 import batch).
- Created **185 redirect documents** (old WordPress URLs → new): 20 page mappings, 29 legacy/umbrella pages → `/`, 136 old blog posts → `/blog`. (Redirects are editor-managed: Studio → Redirects; served by `src/app/(site)/[...notFound]/page.tsx`.)

---

## ⏳ STILL TO DO

### 1. One Sanity Studio edit (MTD wording)
Studio (`https://cleveraccounts.com/studio`) → **Pricing Plans → "Sole Trader" → Features**: change
`MTD ITSA compliant` → `MTD ITSA filing (optional add-on)`
_(Reason: MTD ITSA is a paid extra, shouldn't read as included in the £42.50 fee. The two code fallbacks are already fixed; this CMS plan is the live one.)_

### 2. DNS cutover (the go-live) — runbook
The apex is already added to the Vercel project (apex = primary, `www` → apex 301). At the DNS host (third-party nameservers — do NOT enable Vercel DNS):
1. A day before: **lower the TTL** on the web records so propagation is fast / rollback is quick.
2. Set apex `workwellaccountancy.com`: **A → 76.76.21.21**
3. Set `www.workwellaccountancy.com`: **CNAME → cname.vercel-dns.com**
4. **Leave MX and all email records untouched** (or Workwell email breaks).
5. Vercel domain rows flip to "Valid" automatically + SSL issues; redirects + Workwell marketing go live.
6. Verify: home/pricing/`/learn` on both brands, a few old URLs 301 correctly, OG/social preview, sign-up funnel + contact/callback forms submit, portal still works at `my.workwellaccountancy.com`.

Rollback if needed: point the apex A / www CNAME back to the WordPress host (fast if TTL was lowered).

---

## Key facts / reference
- **App:** Next.js (App Router) on **Vercel**, multi-brand (Clever + Workwell) decided by `Host` header (`src/lib/brand-host.ts` → `workwellaccountancy.com` ⇒ workwell). Production branch = `main`.
- **Preview a brand (non-prod):** Vercel preview URL + `?_brand=workwell` (sticky cookie). Don't use `workwellaccountancy.com` (still WordPress until DNS flips).
- **Sanity:** project `sgaod5tg`, dataset `production`, Studio at `/studio`. Read token in `.env.local` (`SANITY_TOKEN`). Editor/write tokens used this session were **rotated/deleted** — make a fresh one (Studio project → API → Tokens, role Editor) if you need to script CMS writes again.
- **Promo (50% off 3 months):** lives in Sanity `siteSettings.promo` (covers plans Ltd Complete + Ltd Premium). Service pages join via the plan's `homepageLearnMore`; helpers in `src/lib/promo.ts`.
- **`/forms/*`:** embed Clever's TFA Forms tenant (`cleveraccounts.tfaforms.net`). **Intentionally left as-is** — generic client-servicing forms, shared tenant is fine. Do not re-flag.
- **Known benign:** 7 `metadataBase` build warnings on SSG pages — production OG resolves correctly via the `(site)` layout's brand-aware `metadataBase`. Not a blocker.

---

## How to resume on the new PC
1. `git clone` the repo (or `git pull`); work on `main`.
2. Copy `.env.local` across (it's gitignored — contains `SANITY_TOKEN` etc.). Without it, local dev + any CMS scripts won't authenticate.
3. `npm install`, then `npm run dev` (or the project's dev script) to run locally.
4. Resume point = the two "STILL TO DO" items above. Nothing else is outstanding in code.

> Note: the assistant's memory does not transfer between machines — **this file is the source of truth** for picking the work back up.
