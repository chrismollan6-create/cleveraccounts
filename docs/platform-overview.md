# Platform Overview (for developers)

Onboarding for any developer picking up the Clever Accounts / Workwell Accountancy website platform. It's a **multi-tenant marketing platform** — one codebase serving multiple brands — built on conventional tools. This doc covers the architecture and the common "needs a developer" tasks so the platform never depends on one person.

---

## Stack
- **Next.js 16** (App Router, `(site)` route group) — `cleveraccounts/`
- **Sanity v3** CMS, embedded Studio at `/studio` (project `sgaod5tg`, dataset `production`)
- **Vercel** hosting — push to `main` = production deploy; push any branch = preview deploy
- **Tailwind v4** with CSS-variable theming (`src/app/globals.css`)
- Clerk (client portal only), Supabase (portal), Resend (email)

```bash
git clone <repo> && cd cleveraccounts && npm install
# copy .env.local (gitignored — Sanity/Clerk/SF/Resend/Upstash keys)
npm run dev            # localhost:3000
npx sanity schema validate   # validate CMS schema after schema edits
```

## Multi-tenant brand model (the core idea)
- Brand is resolved from the **Host header** in `src/middleware.ts` → `src/lib/brand-host.ts` (`workwellaccountancy.com`/contains "workwell" → `workwell`, else `clever`). Stamped on `x-brand`.
- Read it server-side via `getBrand()` (`src/lib/brand.ts`), client-side via `useBrand()`.
- **Brand registry:** `src/lib/constants.ts` `BRANDS` — colours, fonts, logos, phone, legal, Trustpilot per brand.
- **Theming:** Tailwind colour utilities compile to `var(--color-*)`; `[data-brand="workwell"]` in `globals.css` overrides those vars. **Never use `@theme inline`** (it bakes literal hex and breaks brand theming). Components should use the brand utilities (`bg-primary`, `text-gradient`, `bg-dark`, …) so they theme automatically.
- **QA override (non-prod only):** `?_brand=workwell` / `?_brand=clear` sets a cookie; hard-blocked on real production domains.

## Content model (Sanity)
- Schemas in `src/sanity/schemas/`, registered in `index.ts`. Studio desk + theme + logo in `sanity.config.ts`.
- **Brand-scoping:** content carries an optional `brand` field (`brandField()`); queries (`src/sanity/queries.ts`) filter `brand == $brandId || brand == "shared" || !defined(brand)`, preferring brand-specific. `homePage` is a per-brand singleton keyed by id.
- Schemas use field **groups** (tabs) + plain-English descriptions for non-technical editors — keep that style when adding fields.

## The page builder (`/p/{slug}`)
- Doc type `flexiblePage` with a `sections` array (the block library) → `src/app/(site)/p/[slug]/page.tsx` fetches via `getFlexiblePage(slug, brandId)` and renders `BlockRenderer`.
- Blocks: schema in `src/sanity/schemas/blocks/block*.ts` (`name: "block.<x>"`), component in `src/components/blocks/Block*.tsx`. Section tone (light/tinted/dark) via `src/components/blocks/tone.ts`.
- Reference page seeded at `/p/example` (`scripts/seed-demo-page.mjs`).

---

## How-to: the common developer tasks

### Add a block to the page builder
1. `src/sanity/schemas/blocks/block<Name>.ts` — `defineType({ name: "block.<name>", type: "object", icon, fields, preview })`. Add a `tone` field (`TONE_LIST`) for full-width sections.
2. `src/components/blocks/Block<Name>.tsx` — default export + exported props type; **brand-aware** (use design tokens + the `tone*` helpers, no hardcoded hex).
3. Register: add the import + entry in `src/sanity/schemas/index.ts`, add `{ type: "block.<name>" }` to `flexiblePage.ts` `sections.of`, and a `case` in `BlockRenderer.tsx`.
4. `npx sanity schema validate` (0 errors) + `npx tsc --noEmit`. Add a line to `cms-editor-runbook.md`.

### Add a CMS-driven page type (like service pages)
- New `document` schema (with brand field + groups), a `getX(slug, brandId)` query, and a route that fetches brand-aware and renders. See `servicePage` + `src/components/service/ServiceRoute.tsx` for the brand-router pattern (Workwell→CMS, Clever→legacy, with de-Clevered fallback so pages look right before content is authored).

### Add a brand (the group-consolidation play)
- Add an entry to `BRANDS` in `constants.ts` (colours/font/logo/legal), add brand assets in `public/brand/<id>/`, add a `[data-brand="<id>"]` override block in `globals.css`, extend `brandIdFromHost` + the brand `<option>`s in `brandField`, add the domain in Vercel and point DNS. Content is then brand-scoped via the existing `brand` field. **This is incremental — that's the whole point of the platform.**

### Add a redirect (when an editor changes a URL)
- Add to `next.config.ts` `redirects()` (301 old → new). *(Future: a CMS-managed redirects list so editors self-serve.)*

### Brand-aware metadata / JSON-LD
- Per-route `layout.tsx`/`page.tsx` can branch on `getBrand()`; see the ecommerce/small-business/CIS routes for the pattern (Clever keeps its SEO + FAQ JSON-LD; Workwell gets `workwellServiceMetadata`, Clever JSON-LD gated off).

## Deploy
- **Website:** push to `main` → Vercel production. Feature branches → preview deploys (stable alias `…-git-<branch>-…vercel.app`).
- **Middleware is Clerk-resilient:** runs without Clerk keys (denies portal, serves marketing) so previews don't 500 — keep that fallback.
- **Salesforce** repo is separate (the parent folder) — never commit website changes there; always `git -C <cleveraccounts path>`.

## Gotchas
- `@theme` must NOT be `inline` (brand theming).
- React inserts HTML comment markers between `{dynamic}` expressions — grep for split text can mislead.
- Turbopack dev caches `globals.css`/route changes aggressively — `rm -rf .next` + restart when something looks stale after a confirmed code change.
- Schema edits show in Studio only after the app rebuilds (Studio is served from the same Next app).

---
*See also: `cms-editor-runbook.md` (editors), `cms-governance.md` (roles/boundaries), `workwell-marketing-status.md` (current Workwell build state).*
