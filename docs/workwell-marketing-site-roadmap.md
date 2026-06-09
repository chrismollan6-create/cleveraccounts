# Workwell Marketing Site — Roadmap

**Goal:** Stand up a B2C-focused marketing website for Workwell Accountancy (`workwellaccountancy.com`) that replicates Clever's proven, converting funnel structure but with Workwell's own visual identity and content, targeting sole traders, limited companies and contractors. The current Workwell marketing site is too corporate/B2B and not built for the PPC-driven self-serve signups that work for Clever (1–2/day).

Status: **planning complete, build not started.** Last updated 2026-06-09.

---

## Decisions locked

1. **One codebase, host-branded — NOT a separate fork.** The Next.js app already runs Clever (`cleveraccounts.com`) and is already multi-brand: a fully-populated `workwell` entry in the `BRANDS` registry, host→brand detection that already maps `workwellaccountancy.com` → `workwell`, and a complete Workwell CSS theme. A fork would double maintenance and security surface and split the one bottleneck (Chris). See "Why same codebase" below.

2. **Content model = hybrid (three tiers).** Pricing/packages are identical to Clever so pricing content is *shared*; conversion copy is *brand-scoped* in Sanity; Learn / portal / registration / chosen blogs are *shared*. See "Content tiers".

3. **Pricing & packages identical** (for now). Pricing plan docs stay shared — no brand tagging until packages actually diverge. Adding a `brand` field is the future trigger point when Workwell pricing changes/expands.

4. **Visual: "Distinct design language."** Workwell gets its own colours, type, imagery PLUS per-brand component treatments (hero styles, section backgrounds, card variants, decorative elements) — but every page keeps the *same underlying structure* as Clever's converting layouts. Component variants live in code (developer-changeable); all content stays in Studio (marketer-changeable).

5. **CMS governance is a first-class goal.** The build deliberately widens what non-technical staff can manage in Sanity Studio to reduce the "only Chris knows this" risk.

---

## Why same codebase (current state, verified 2026-06-09)

| Already built | Where |
|---|---|
| `workwell` brand config — colours, font, logo, phone, legal name, SF mapping, all populated | `src/lib/constants.ts:206-279` |
| Host→brand detection (`workwellaccountancy.com` → `workwell`) | `src/lib/brand-host.ts:10-16` |
| Brand resolution + header stamping + routing | `src/middleware.ts` |
| Workwell CSS theme (`#32535a` teal / `#9cbf50` lime, Montserrat) | `src/app/globals.css:428-583` |
| Funnel (sign-up, engagement letter) + portal — 100% brand-aware | `(funnel)`, `portal` route groups |

**What's NOT done:** ~257 hardcoded "Clever Accounts" / `cleveraccounts.com` strings in marketing-page metadata, JSON-LD breadcrumbs, legal pages and blog bylines; Sanity content has **no brand field** so the two brands can't yet carry different copy; Workwell analytics (GA4/GTM) and Trustpilot fields are empty; Workwell's component-level design variants don't exist yet.

So: **infrastructure ~done, content + design-variant layer is the work.**

---

## Content tiers

- **Tier 1 — Identical** (one copy serves both; brand only swaps colour/logo/phone). Code shared, content shared.
- **Tier 2 — Same structure, different words** (one React template, copy from brand-scoped Sanity docs). Editable by non-technical staff in Studio.
- **Tier 3 — Different structure/functionality** (brand-variant code: different panel, button-with-different-behaviour, calculator variant). Developer-only.

**Governing rule:** push divergence into content (Tier 2) wherever possible; reserve code divergence (Tier 3) for genuinely *functional* differences. Cosmetic differences ("different wording", "different colour panel") are Tier 2, not Tier 3 — keeping them in the CMS is what protects the bus-factor goal.

---

## Visual approach: "Distinct design language"

Two sub-layers, decoupled from content:

1. **Design-system layer (cheap, stays delegable):** Workwell colours, typography, button/card styles, gradients, spacing, and — high impact — **its own photography/imagery**. Driven by the existing `[data-brand="workwell"]` CSS system. Identical structure + different colour + type + photos + copy already reads as a different company.
2. **Component-variant layer (the "distinct" upgrade, developer-owned):** per-brand hero styles, section backgrounds, card variants, decorative elements — implemented as brand-conditional component treatments over the *same* page structure. This is the extra investment "Distinct design language" buys vs a plain themed restyle.

**Not doing:** bespoke per-page layouts (that was the rejected "Bespoke layouts" option — too costly, too dev-locked).

---

## Page-by-page matrix

70 routes under `(site)`. Classification:

### Tier 1 — Shared, no per-brand work (already serve both brands)
- `learn`, `learn/[topic]`, `learn/[topic]/[slug]` — Learning Centre (evergreen tax facts, brand-neutral)
- `blog`, `blog/[slug]` — share evergreen articles; brand-tag only ones that should be brand-specific
- `log-in` — auth entry
- `studio/[[...tool]]` — the CMS itself
- `forms/*` (17 operational client forms — UTR capture, complaints, VAT approve/decline, Companies House checks, P11D, etc.) — operational, brand-aware via theme, same for both
- Funnel/registration + portal (in other route groups) — already brand-aware

### Tier 2 — Brand-scoped content + distinct design (the bulk of the build)
**Core marketing**
- `page.tsx` (homepage) — new Workwell homepage doc + distinct hero/section variants
- `about-us` — Workwell-specific (different company story)
- `contact` — brand contact details (mostly registry-driven already)
- `how-it-works`
- `our-services`, `our-services/accounting-software`, `our-services/accountant-switch`
- `compare`, `partners`, `refer-a-friend`, `reviews`, `faq`
- `switching-accountants`, `integrations`, `freeagent`, `freeagent` software pages
- `tax-deadlines`

**Audience / service pages (the B2C heart — sole trader / ltd / contractor focus)**
- `sole-trader`, `limited-company`, `contractor-accountancy`, `contractor-accountants/ir35`
- `freelancer-accountancy`, `landlord-accounting`, `accounting-for-startups`
- `cis-accounting`, `ecommerce-accounting`, `it-contractor-accountant`
- `small-business-accountant`, `local-accountants`
- `self-assessment`, `vat-returns`, `making-tax-digital`, `tax-returns`, `payroll-services`

**Pricing**
- `pricing` — **content shared** (identical packages) but rendered through Workwell's distinct design. Tier 2 design / Tier 1 content.

**PPC landing pages (CMS-driven, `noIndex`)**
- `lp/[slug]` + `lp/cis`, `lp/contractor`, `lp/freelancer`, `lp/landlord`, `lp/limited-company`, `lp/sole-trader`, `lp/startup` — create Workwell variants in Studio; these are where PPC traffic lands

**Legal (must differ per brand — Workwell Accountancy Solutions Ltd, not Clever Accounts Ltd)**
- `terms`, `privacy` — port into the app as brand-aware pages (currently Workwell's privacy URL points at the old WordPress site, which dies on cutover)

### Tier 3 — Brand-variant code (keep minimal, deliberate)
- `take-home-calculator` — shared calculation engine, Workwell copy/CTA/results panel. Light Tier 3.
- Any homepage/section component where Workwell needs a *functionally* different panel (decide case-by-case during build)

---

## Phased plan

### Phase 0 — Plumbing & safe testing (½ day, no DNS change)
- Lock Decisions 1–5.
- Add `workwellaccountancy.com` + `www.workwellaccountancy.com` as domains on the **existing** Vercel project (`prj_gFRtnG3tlIMHhOp4GR6hocFBgaXr`). No `vercel.json` — middleware routes by host.
- **Do not cut DNS yet.** Test on Vercel preview URLs using the built-in `?_brand=workwell` override (allowed on previews, hard-blocked in production).
- Fill `BRANDS.workwell` gaps: **separate GA4/GTM property** (so Workwell PPC data never pollutes Clever's analytics) + Trustpilot rating.
- Git: branch `feat/workwell-marketing` off `main`. Per-push Vercel preview deploys. Merge to `main` = production.

### Phase 1 — Brand-scope content + kill hardcoding (2–3 dev days)
- Add optional `brand` field to conversion schemas: `homePage`, `servicePage`, `landingPage`, `testimonial`, `caseStudy`, `promoBanner`. (Leave `pricingPlan` shared.) Update GROQ queries to `brand == $brand || !defined(brand)` so blank = shared.
- Replace the ~257 hardcoded "Clever Accounts" / `cleveraccounts.com` strings (metadata, JSON-LD breadcrumbs, blog bylines, canonical URLs) with `brand.name` / `brand.domain`. Mechanical — good fan-out job.
- Port `terms` + `privacy` to brand-aware pages (or redirect Workwell legal to a kept WordPress URL — decide).
- **Bus-factor win (do it here):** migrate remaining hardcoded homepage modules (team cards, "what's included" grid, nav links) into Sanity so marketers can edit them.

### Phase 2 — Workwell design language (component-variant layer)
- Extend `[data-brand="workwell"]` design system: refine palette usage, type scale, button/card styles, Workwell photography set.
- Build per-brand component variants: hero style, section backgrounds, card variants, decorative elements — over the shared page structure.

### Phase 3 — Author Workwell content (Chris + an accountant, days)
- In Studio: Workwell homepage, service/audience pages (sole-trader/ltd/contractor first), about-us, testimonials, PPC landing pages.
- Replicate Clever's funnel structure; rewrite copy for B2C, less corporate tone.

### Phase 4 — Cutover (1 hr + DNS propagation)
- Point `workwellaccountancy.com` DNS at Vercel (Cloudflare CNAME/A, same as Clever).
- Update PPC campaign destination URLs.
- Archive/decommission old WordPress site — **back up its legal pages and note any SEO URLs to preserve/redirect first.**

---

## CMS governance / reducing the bus-factor

**What Studio already lets non-technical staff manage** (no developer, no code): pricing plans & prices, all FAQs, testimonials, case studies, blog posts, the entire Learning Centre (with its accountant-review workflow), PPC landing pages (`/lp/*`), promo banners & discount config, site settings (phone/email/offices), team profiles. Studio is embedded at `/studio`; roles (Administrator/Editor) are managed in the Sanity dashboard.

**Where the cliff is (developer-only today):** homepage hero team cards + "what's included" grid, navigation menu, page structure/layout, new page types, and all brand plumbing + Tier 3 component variants.

**Three-part de-risk plan:**
1. **Widen the CMS surface** (Phase 1) — move the remaining hardcoded homepage modules + nav into Sanity. Permanently shrinks the "only Chris" set.
2. **People + runbook** — invite 1–2 staff as Sanity Editors; write a one-page runbook (change a price / publish a landing page / put up a promo banner / write a blog). The skills are non-technical; the only barrier is that nobody's been shown.
3. **Developer safety net** — retainer/on-demand Next.js contractor for the structural/code 20%. Conventional Next.js 16 + Sanity + Vercel; a competent dev can pick it up. Risk is undocumented tacit knowledge, not the tech.

---

## Risks & watch-items

- **Legal-page trap:** `BRANDS.workwell.legal.privacyUrl` currently points at `workwellaccountancy.com/privacy-data-cookie-policy/` (WordPress). DNS cutover kills that URL — port or redirect before cutover. (`src/lib/constants.ts:275`)
- **Analytics bleed:** Workwell needs its own GA4/GTM, or PPC conversion data muddles Clever's.
- **SEO continuity:** the old WordPress site may have ranking URLs — inventory + 301-redirect map before decommission.
- **Hardcoding regressions:** the 257-string cleanup must be thorough or Workwell pages leak "Clever Accounts" in titles/breadcrumbs (bad for trust + SEO).
- **Shared blog/Learn:** decide per-article what's shared vs brand-specific; default shared for evergreen tax content.

---

## Open questions for Chris

1. Workwell legal pages — port Terms/Privacy into the new site, or keep hosted separately and redirect?
2. What is the current `workwellaccountancy.com` built on (WordPress?), and are there ranking URLs/SEO to preserve via redirects, or is it a clean replace?
3. Which blog articles (if any) should be Workwell-specific vs shared evergreen?
