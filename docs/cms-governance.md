# CMS Governance — Who can do what, and the boundaries

How the Clever/Workwell websites are run day-to-day, who's responsible for what, and where the line sits between "no-code" and "needs a developer." This is the document that de-risks the bus-factor: it makes the platform runnable by a team, not one person.

---

## 1. Roles

Managed in the **Sanity project dashboard** (sanity.io → Manage → this project → Members), not in code.

| Role | Who | Can |
|---|---|---|
| **Administrator** | Owner + 1 backup | Everything, plus invite/remove members, change roles, manage datasets, change billing. Keep this to **2 people minimum** (never just one — that's the bus-factor trap). |
| **Editor** | Marketing team | Create, edit, publish and delete content. Cannot change members, schema, or settings. This is the day-to-day role. |
| **Viewer** (optional) | Stakeholders | Read-only. |

**Onboarding a new editor:** an Administrator invites their email as **Editor** in the Sanity dashboard, then shares the `cms-editor-runbook.md` guide. No code, no deploy.

### Brand-scoped permissions (multi-brand / group)
By default any Editor can edit any brand's content. For a group with per-brand teams, restrict who edits what — this is a **Sanity dashboard configuration, not code**:
- On **Growth/Enterprise** plans, Sanity supports **custom roles with document-level grants**. In the dashboard → *API/Members → Roles*, create e.g. a "Workwell Editor" role whose update/create grant is **filtered by the `brand` field** (`brand == "workwell" || brand == "shared"`), and assign each person to their brand's role.
- This builds directly on the **`brand` field already on every content type** (Clever / Workwell / Shared) — that's what the grant filters on. No code change needed.
- On the **free/Team plan** (no custom roles), brand separation is by **convention + trust**: the brand field + the runbook rule "only edit your brand." Acceptable for a small team; revisit when the group scales.
- Independent of brand: enforce **MFA on every Administrator account**, and keep Administrators to the two-person minimum.

## 2. The no-code / needs-a-developer line

This is the single most important thing to be clear about, so the team knows what they own and what to escalate.

**Editors own (no developer):**
- All page **content** — text, prices, FAQs, testimonials, blog, Learning Centre.
- **Building pages** with the page builder (`/p/{slug}`) and **landing pages** (`/lp/{slug}`) — stacking blocks, no code.
- **Promo banners**, **site settings** (phone/email/offices), **SEO** fields, **brand tagging** (Clever/Workwell/Shared), **publish/draft**.
- The **header menu & footer columns** (Navigation & Footer — per brand).
- **URL redirects** (Redirects) — change a page's slug, then add a redirect old → new themselves.

**Needs a developer:**
- A **new page type** or **new field** that doesn't exist.
- A **new block** for the page builder, or a new component/section.
- **Design** — colours, fonts, spacing, component styling (locked per brand by design).
- **Adding a brand** to the platform, integrations, forms, calculators.

Guiding principle: *the more we invest in CMS-driven fields and blocks, the more the team self-serves.* The block library is the lever — when the team keeps hitting "I wish there was a block for X," that's the cue to have a developer add block X once, after which it's reusable forever.

## 3. Brand rules

- Content carries a **Brand** field: `Shared | Clever | Workwell`. Brand is otherwise decided automatically by the website's domain.
- Default to **Shared** for anything identical across brands; use a specific brand only when the wording/offer differs. This keeps duplication down.
- **Pricing/packages are currently shared.** If they diverge, brand-tag the pricing — flag it to a developer if the *structure* (not just the number) changes.

## 4. Publishing & change management

- **Draft → Publish.** Nothing is live until Published. Encourage editors to preview on the test URL before publishing anything significant.
- **Preview:** the stable branch URL (`…-git-…vercel.app`) always shows the latest build; `?_brand=workwell` / `?_brand=clear` switch brands.
- **High-risk changes** (URL changes, pricing structure, anything touching multiple pages) — give a developer a heads-up first.
- **The Learning Centre** has a built-in review queue: articles need accountant sign-off (`lastReviewed`) before they go live. Respect it — public tax content must be accurate.

## 5. The developer resource (don't skip this)

The platform is conventional **Next.js + Sanity + Vercel** — any competent contractor can pick it up (see `platform-overview.md`). But it must not live only in one head.

- Keep a **developer on retainer or on-call** for the "needs a developer" list above. Budget a small monthly allowance for new blocks/page types/redirects.
- Keep **`platform-overview.md` current** so a new developer can onboard fast.
- **Two Administrators** at all times.
- When a developer adds a block or page type, they should also add a line to the editor runbook so the team knows it exists.

## 6. Redirects (now self-serve)
Changing a published page's slug **breaks the old URL**, so always pair a URL change with a redirect. Editors now do this themselves: **Studio → 🔀 Redirects** → add **From** (old path) → **To** (new path). Live within ~a minute. Redirects fire for paths that no longer resolve (i.e. the old URL is now a 404), which covers the slug-change case. *(Note: a redirect from a path that still has a live page won't fire — remove/rename the page first. Bulk or domain-level redirects still warrant a developer.)*

## 7. Backups & safety
- Sanity keeps document **history** — any document can be rolled back to a previous version (open the doc → history). So a bad edit is recoverable.
- Deleting a document is reversible from history for a period, but treat deletion as permanent — prefer turning things **off** (e.g. a promo's "Show this banner?" toggle) over deleting.

---
*See also: `cms-editor-runbook.md` (how-to for editors) and `platform-overview.md` (for developers).*
