# Workwell Marketing Site — Build Status / Handoff

**Last updated:** 2026-06-09 (end of build session)
**Branch:** `feat/workwell-marketing` — **18 commits, all pushed to `origin`**, working tree clean.
**Not merged to `main`** (so production `cleveraccounts.com` is untouched). The Salesforce repo was never touched during this work.

Companion docs: [workwell-marketing-site-roadmap.md](workwell-marketing-site-roadmap.md) (the original plan + decisions).

---

## How to continue on another machine

```bash
git clone https://github.com/chrismollan6-create/cleveraccounts.git
cd cleveraccounts
git checkout feat/workwell-marketing
npm install
# copy .env.local across (gitignored — has Clerk/Sanity/SF/Upstash keys)
npm run dev
```

**Previewing the two brands** (brand is decided by HOST; localhost/preview default to Clever):
- Clever: `http://localhost:3000/`
- Workwell: `http://localhost:3000/?_brand=workwell` (sets a sticky cookie)
- Back to Clever: `http://localhost:3000/?_brand=clear`

On Vercel previews (`*.vercel.app`) the same `?_brand=workwell` override works. On the real production domains the override is hard-blocked — brand is purely host-based (`workwellaccountancy.com` → Workwell, `cleveraccounts.com` → Clever).

**Vercel:** pushing the branch builds a preview automatically. Pushing to `main` = Clever production deploy. `workwellaccountancy.com` is NOT yet pointed at Vercel (still WordPress).

---

## Architecture (how multi-brand works)

- **One codebase, host-branded.** Brand resolved from the `Host` header in [src/middleware.ts](../src/middleware.ts) → stamped on `x-brand` → read server-side via `getBrand()` ([src/lib/brand.ts](../src/lib/brand.ts)), client-side via `useBrand()`.
- **BRANDS registry**: [src/lib/constants.ts](../src/lib/constants.ts) — `clever` + `workwell` configs (colours, fonts, logos, phone, legal, Trustpilot, social).
- **Theming**: Tailwind v4 colour utilities resolve to `var(--color-*)`; the `[data-brand="workwell"]` block in [src/app/globals.css](../src/app/globals.css) overrides those vars. **Do NOT re-add `inline` to `@theme`** — that bakes literal hex into utilities and breaks brand theming (this was a real bug we fixed).
- **Content (Sanity)**: conversion content carries an optional `brand` field (shared/clever/workwell) — see `brandField()` in [src/sanity/schemas/objects/brandField.ts](../src/sanity/schemas/objects/brandField.ts). Queries in [src/sanity/queries.ts](../src/sanity/queries.ts) filter by brand (untagged = shared, so existing docs still work). `homePage` is a **per-brand singleton** in the Studio desk ([sanity.config.ts](../sanity.config.ts)): "Home Page → Clever Accounts" (id `homePage`) and "→ Workwell Accountancy" (id `homePage-workwell`).

---

## What's DONE (Workwell homepage + site chrome)

### Homepage — bespoke B2C, NOT a recoloured Clever clone
[src/app/(site)/page.tsx](../src/app/(site)/page.tsx) early-returns `<WorkwellHome>` for the Workwell brand; Clever keeps its original page.
- **[WorkwellHero.tsx](../src/app/(site)/WorkwellHero.tsx)** — bold, colourful hero: lime/cyan/teal mesh background, lime→cyan→teal gradient headline, coloured audience chips, layered card visual with floating Trustpilot + MTD chips (positioned above/below the card so they don't obscure it). Copy is CMS-driven from the `homePage-workwell` doc.
- **[WorkwellHome.tsx](../src/app/(site)/WorkwellHome.tsx)** — the page body: segment picker ("What kind of business are you?", shows up to 6 features, bottom-aligned price) → sector showcase (dark, scrolling marquee, ~40 trades + "200+ more") → benefits (crisp white, strong card shadows) → take-home calculator (reused `TaxCalculator`, its own heading) → "Up and running in minutes" steps (DARK) → social proof (DARK, flows seamlessly from steps at `#243b40`) → pricing teaser → FAQ (DARK, so the reused white-text `PricingFAQ` reads) → final CTA (dark card).
- **Colour rhythm**: deliberate light/dark alternation (Hero light → Segments white → Sector DARK → Benefits white → Calc white → Steps+SocialProof one DARK zone → Pricing white → FAQ DARK → CTA dark card). The dark teal is Workwell's primary; lime/cyan pop against it.
- **Sector list**: [src/lib/sectors.ts](../src/lib/sectors.ts) is a ~40-trade PLACEHOLDER. **TODO: swap for the real Salesforce export** (SOQL in the file header). Sectors only, never client names. Decision: static snapshot, NOT a live SF query (no SF coupling/exposure on the public site).

### Site chrome — all brand-aware now
- **Header** [src/components/layout/Header.tsx](../src/components/layout/Header.tsx): logo + phone from registry.
- **TrustBar** [src/components/layout/TrustBar.tsx](../src/components/layout/TrustBar.tsx): Clever keeps its bar; Workwell gets a conservative one (Trustpilot + Qualified & Regulated + MTD + Free software). **TODO: confirm Workwell's real accreditations** (FreeAgent partner? FCSA?) — currently omitted to avoid false claims.
- **Footer** [src/components/layout/Footer.tsx](../src/components/layout/Footer.tsx): logo, description, phone, Watford, legal name, Workwell external privacy URL (no Terms link — Workwell has no terms page yet).
- **Phone/email leak fix**: the shared (Clever) Sanity `siteSettings` no longer overrides contact details for non-Clever brands (layout + page.tsx guard on `brand.id === 'clever'`).
- **SEO JSON-LD** [src/components/seo/StructuredData.tsx](../src/components/seo/StructuredData.tsx): `OrganizationJsonLd` + `PricingJsonLd` brand-aware. (Blog/Service/Review/Breadcrumb JSON-LD still Clever-hardcoded — only matter on pages not yet Workwell-ready.)
- **FAQs**: dedicated Workwell set in page.tsx (no "FreeAgent Platinum / Clever FLEX / FCSA" claims). "Clever FLEX" stripped from shared pricing-plan features for Workwell.

### Infra / bug fixes
- `@theme inline` → `@theme` so brand colour utilities actually switch.
- Sector marquee animation shipped **inline** (was relying on globals.css which the dev server + browser kept caching).
- **Middleware resilience** [src/middleware.ts](../src/middleware.ts): `clerkMiddleware` was 500ing (`MIDDLEWARE_INVOCATION_FAILED`) on any env without Clerk keys (e.g. Vercel Preview). Now: if Clerk keys present → real auth gate (production unchanged); if absent → fallback that DENIES portal routes (fails closed) but serves marketing. This is why the preview works now.

---

## What's LEFT (next session)

1. **Other marketing pages** — pricing, service/audience pages (`/sole-trader`, `/limited-company`, `/contractor-accountancy`, etc.), about, contact, how-it-works are still Clever-styled/hardcoded and NOT B2C-restyled for Workwell. Biggest remaining chunk. (~257 hardcoded "Clever Accounts"/`cleveraccounts.com` strings were noted across the site; homepage + chrome are clean, the rest aren't.)
2. **Terms & Privacy** — port into the app as brand-aware Workwell legal pages (user confirmed separate Workwell legal). Currently Workwell's footer links to the old WordPress privacy URL.
3. **Real sector list** — export from Salesforce, replace `src/lib/sectors.ts`.
4. **Workwell homepage CMS copy** — the `homePage-workwell` Studio doc currently holds schema-default (Clever-ish) copy in some fields; edit in `/studio` → Home Page → Workwell Accountancy. Suggested hero copy is in the component fallbacks.
5. **Remaining SEO JSON-LD** brand-awareness (Blog/Service/Review/Breadcrumb) once those pages are Workwell-ready.
6. **Vercel Preview env vars** (optional) — middleware no longer needs them, but mirroring prod vars to Preview would make previews render live DATA (Sanity/SF), not just static fallbacks.
7. **Cutover (later)**: point `workwellaccountancy.com` DNS at Vercel; handle old WordPress SEO redirects; separate GA4/GTM for Workwell (registry `analytics` field empty).

---

## Gotchas / lessons (important)

- **Website git: always `git -C "<...>/cleveraccounts"`.** The Bash working dir is NOT reliably persistent — it resets to the SF repo root (`CleverAccountsSandbox`). A bare `git add -A` from the wrong dir once swept the SF dirty scratchpad into a commit (recovered). If you see `force-app/...` in website git output, STOP — wrong repo.
- **`git -C` for all website git ops.** Website = `c:\Users\chris\CleverAccountsSandbox\cleveraccounts` (nested repo). SF = the parent folder (separate repo).
- **globals.css changes can be served stale** by the dev server (Turbopack) + browser — a full restart (`rm -rf .next` + `npm run dev`) or inline styles fixes it.
- **React inserts HTML comment markers between `{dynamic}` expressions** — so grepping rendered HTML for text spanning two expressions returns 0 even when it renders fine. Not a bug.
- **Deploy to PROD** (when the time comes): Salesforce uses RunSpecifiedTests + deploy only changed files; the website deploys via Vercel on push to `main`.
