# Website Platform — Long-Term Strategy

The Clever/Workwell websites are now a **multi-tenant marketing platform** (one codebase, many brands). This doc captures the long-term direction and the things that matter beyond the platform plumbing, so the strategy isn't only in one person's head. For *how it works*, see `platform-overview.md`; for *running it*, see `cms-governance.md` + `cms-editor-runbook.md`.

## The three goals
1. **Marketing self-sufficiency** — the marketing team runs day-to-day content, pages, menus, redirects, promos with no developer.
2. **Bus-factor** — the platform is runnable by a team + a retainer developer, documented, not dependent on one person.
3. **Group consolidation** — bring other group brand sites (B2B, vs the accountancy B2C) onto this platform to replace £10k's of WordPress/other builds + upkeep.

## Build status (the features requested 2026-06-11)
| Feature | Status |
|---|---|
| Per-brand funnels (GA4/GTM + Trustpilot + conversion, per brand) | **Built** — wired to the BRANDS registry; brand IDs still need filling for Workwell |
| Brand-scoped permissions | **Code + runbook done**; true RBAC is a Sanity dashboard step (documented) |
| Editorial calendar | **Built** — Studio desk views by status/schedule |
| Accessibility/SEO guardrails (alt text) | **Built** — required on images |
| AI-assisted drafting | **v1** — Studio action → Gemini |
| A/B testing | **v1** — page-builder variants + assignment + tracking |
| Visual preview (Sanity Presentation) | **Planned** — needs draft-mode infra; see below |
| Scheduled publishing | **Planned** — native Sanity feature; enable in dashboard |

---

## The rest — longer-term, not yet built

These are the higher-altitude things that decide whether this becomes valuable group infrastructure rather than just a nice website. Captured here so they're not lost.

### A. Content is the engine (the CMS is only the pipe)
A great CMS half-empty converts nothing. Needs:
- An **editorial calendar + named ownership** per brand (calendar shipped; ownership is a people decision).
- **AI-assisted drafting** at scale (v1 shipped) — extend toward **programmatic SEO**: generate service × audience × sector pages from structured data, accountant-reviewed, published. This is how a small team fills a multi-brand site. Biggest lever on the actual goal (signups).

### B. The funnel is the product — optimise it continuously
- **A/B testing** (v1 shipped) → build the *habit*: test, measure per brand, iterate. A 0.5% lift across a PPC funnel pays for the platform.
- End-to-end **per-brand conversion tracking** (visit → lead → signup), not just pageviews.

### C. Connect the ecosystem — the website is not an island
The genuine moat and the B2B pitch. We own **website + Salesforce + client portal + (planned) multi-brand email**. Long-term win: one brand-aware lifecycle — lead on site → Salesforce → onboarding → portal → lifecycle email. A WordPress site can't do this. Design B2B lead capture to push **straight into Salesforce** (existing integration) — that's the unfair advantage over a generic site.

### D. Treat it as group infrastructure, not a project
- **Ownership** — who owns the Sanity org, domains, repo, billing across group entities? Settle before brands depend on it.
- **A named platform owner** — "Chris + a contractor" must become a small accountable function if the group relies on it.
- **Measure ROI for real** — cost-per-brand on WordPress vs here, time-to-publish, dev hours. Capture from the first pilot so "saved £10k's" is evidenced.
- **A retainer developer + a second Sanity admin** — the bus-factor isn't closed until these *people* exist.

### E. The group migration play
- **Don't build B2B features speculatively** — build for one scoped pilot with defined success (cost saved, time-to-publish, SEO retained).
- **A migration playbook** is reusable IP: content audit → URL inventory + redirect map → SEO preservation → DNS cutover. Today's redirects only cover removed paths; a real migration needs **bulk + live-path redirects + per-brand sitemaps/robots**.
- **Know the plan ceilings** (Sanity users/datasets/API/bandwidth; Vercel) before onboarding N brands.

### F. Governance & risk hygiene
- **Staging dataset** — everything is the one `production` dataset; a `staging` dataset lets you trial schema/content safely.
- **Scheduled dataset exports** — belt-and-braces backup beyond per-doc history.
- **Compliance multiplies per brand** — WCAG accessibility (legal exposure), GDPR, per-brand legal pages, cookie consent.
- **Lock-in / exit** — Sanity/Vercel/Clerk dependencies; content is portable (Sanity → JSON), code is yours; know the switching cost.
- **Maintenance cadence** — Next.js/Sanity upgrades (e.g. the pending Next 16 `middleware.ts → proxy.ts`); budget quarterly dev hours.
- **Security** — dependency scanning, secrets hygiene, periodic review for a group-facing platform.

### G. Visual preview & scheduled publishing (setup notes)
- **Sanity Presentation tool** (live side-by-side preview) needs: the `presentationTool` plugin in `sanity.config.ts`, a `resolveProductionUrl`, and **Next draft mode** + a preview route so Studio can render unpublished content. Highest-value self-sufficiency add; deferred because it needs draft-mode infra (a focused build, not a quick toggle).
- **Scheduled publishing** is a native Sanity feature (enable per project in the Sanity dashboard / Studio) — lets editors schedule a doc to go live at a date. Pair with the promo banner's existing start/end dates.

---

## Recommended sequence
1. **Make the people/process real** — second admin, retainer dev, one training session. (Closes the bus-factor you started with; not code.)
2. **Finish Workwell** (supporting + legal pages) so one brand is a complete reference for the group pitch.
3. **Visual preview** — biggest remaining self-sufficiency lever; benefits every brand.
4. **A scoped B2B pilot** with Salesforce-connected lead capture — proves the group savings before committing the group.
5. **Then** deepen the content engine (programmatic SEO) + CRO habit where signups actually compound.

**Honest caution:** the expensive, reusable foundation is built. The next risk is over-engineering the platform instead of proving the business case with one real migration and filling the funnel with content.
