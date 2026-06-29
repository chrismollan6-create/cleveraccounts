# Workwell — Remaining Work Scope: Copy + Design

Two distinct jobs to take Workwell from "brand-correct" to "genuinely Workwell." They're independent — do either, both, or neither.

---

## Job 1 — Real Workwell copy on the 9 service pages

**Current state.** The 9 service/audience pages already use the **Workwell-designed template** (`WorkwellServicePage`) and pull content from **Sanity** (`servicePage` docs, brand = Workwell). But that content is the **de-Clevered Clever copy** — accurate enough, but it's Clever's words with the brand swapped, not Workwell's voice. The design is done; the words aren't.

**This is a CONTENT job, not code.** Every field is editable in Studio (Service Pages → each doc). Nothing needs building.

**Pages (9):** sole-trader, limited-company, contractor-accountancy, freelancer-accountancy, landlord-accounting, accounting-for-startups, ecommerce-accounting, cis-accounting, small-business-accountant.

**Fields to rewrite per page (~10):** hero headline, hero description, features list, benefit cards, FAQs, stats band, "what we do" categories, testimonial, section headings, SEO title + description.

**Recommended approach — AI-draft → review → publish:**
1. I run the **AI-draft tool** (already built) across all 9, in a defined Workwell voice, producing first-draft copy for every field.
2. A human (you / marketing) edits for voice + truth.
3. An **accountant signs off** anything factual (tax thresholds, claims) — public tax content must be accurate.
4. Publish in Studio.

**Inputs needed from you (the real blockers):**
- **Workwell's voice** — a few adjectives + 2–3 example sentences (e.g. "plain-spoken, warm, no jargon"). Sets the AI brief and the human edit.
- **Real proof** — any genuine Workwell stats and at least 1–2 **real testimonials**. *We must not fabricate named reviews or client counts* (same rule we applied de-Clevering — fake proof undercuts trust and is a compliance risk). If none exist yet, we omit stats/testimonials rather than invent them.
- Confirm pricing per page is correct.

**Effort.** With the AI pass, the bottleneck is **human review**, not drafting — roughly half a day of editing for the batch once the voice + proof are agreed. I can produce all 9 drafts quickly.

**Risk.** Fabricated claims/testimonials, and tax-accuracy errors — both mitigated by the "real proof only" rule + accountant sign-off.

---

## Job 2 — Distinct Workwell design for the shared pages

**Important clarification first.** The ~25 "shared" pages are **not Clever-blue** — they already render in **Workwell's colour palette** (via the `[data-brand="workwell"]` theme). What they lack is Workwell's distinct **visual language / layout** — the bold gradient heroes, dark-section rhythm, and playful B2C structure of `WorkwellHome` / `WorkwellServicePage`. So this job is **re-structuring layouts, not re-colouring.**

**The honest question: is it worth it for all 25?** No. Bespoke-designing 25 pages is high effort for diminishing returns on low-traffic informational pages, and it **doubles the design you maintain** (a Clever layout *and* a Workwell layout per page). Spend the effort where it shapes brand impression and conversion.

**Value tiers:**

| Tier | Pages | Recommendation |
|---|---|---|
| **A — worth bespoke** | about-us, how-it-works, contact, our-services | These set the brand impression for anyone browsing. **Redesign bespoke.** |
| **B — optional** | compare, reviews, faq | Redesign if budget allows; medium impact. |
| **C — leave shared** | all specialist service pages, legal, utility, and the 7 `/lp/*` PPC pages | **Leave as-is.** They're brand-correct + Workwell-coloured. PPC pages convert on *copy/proof*, not bespoke layout; the shared `LandingPageLayout` is fine. Legal/utility don't warrant it. |

**Recommended approach — reuse the page-builder as the design system.** The block library I built (hero, features, cards, steps, stats, testimonial, FAQ, CTA) **is** the Workwell design language, already brand-aware. Two ways to apply it to Tier A:
- **(a) Bespoke components** for `/about-us` etc. that compose the block components — full control, code-owned.
- **(b) CMS-composed** — make those routes render a builder page for Workwell, so **marketing can rearrange them in Studio** (ties into the self-service goal). More flexible, slightly more plumbing.

Recommendation: **(b)** for pages marketing will tweak (about, how-it-works), **(a)** where layout should stay fixed.

**Effort.** Tier A ≈ ~4 pages, roughly half a day to a day each (less if CMS-composed from existing blocks). Tier B similar. Tier C: £0 — leave it.

**Risk.** Scope creep (resist doing all 25) and dual-design maintenance — both controlled by the tiering above.

---

## Recommended sequence

1. **Job 1 first** (copy) — higher ROI, no new code, makes the *already-Workwell-designed* pages actually sound like Workwell. Needs only your voice brief + real proof.
2. **Job 2 Tier A** (bespoke about/how-it-works/contact/our-services) — the impression-setting pages, reusing the block library.
3. **Stop there** unless data says otherwise. Leave Tier C shared; revisit Tier B later.

**What I need from you to start Job 1:** the Workwell **voice brief** (a few words + 2–3 sample sentences) and any **real stats/testimonials**. Give me those and I'll run the AI-draft pass across all 9.
