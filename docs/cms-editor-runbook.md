# Website Editor Runbook (Sanity Studio)

A practical, no-jargon guide for the marketing team to manage the Clever Accounts and Workwell Accountancy websites. **You do not need to be a developer.** If a task isn't in this guide, it probably needs a developer — see "When to ask a developer" at the bottom.

---

## 1. Logging in

- Studio (the editor) lives at **`/studio`** on the site — e.g. `https://cleveraccounts.com/studio` (production) or the preview URL for testing.
- Sign in with the Google/email account you were invited with. If you can't get in, the site admin needs to invite you (see the Governance doc).

## 2. The big idea: content vs design

- **You edit content** — the words, prices, FAQs, images, and which blocks appear on a page.
- **You don't touch design** — colours, fonts and the look of components are locked to each brand on purpose, so nothing can go off-brand.
- Every content type is a **form with tabs** (Content / SEO / Settings). Fill in the fields; each has a hint under its label.

## 3. Brands — Clever vs Workwell

Most content has a **Brand** field (in the **Settings** tab) with three options:

- **Shared** — shows on *both* Clever and Workwell.
- **Clever Accounts** — shows on Clever only.
- **Workwell Accountancy** — shows on Workwell only.

Rule of thumb: write **Shared** for things that are the same on both; pick a specific brand when the wording or offer differs.

## 4. Saving & publishing (important)

- Changes save as a **Draft** automatically as you type — they are **not live yet**.
- Click **Publish** (top-right of the editor) to make changes go live.
- To undo unpublished edits, use **⋯ → Discard changes**.
- Live sites update within a minute or two of publishing.

## 5. Common tasks

### Change some text on a page
1. Find the page type in the left sidebar (e.g. **Service Pages**, **Home Page**).
2. Open the page, find the field (use the **Content** tab), edit it.
3. **Publish.**

### Build a brand-new page (the page builder) — no developer
1. Left sidebar → **🧩 Pages (builder)** → **＋** (new).
2. Set **Page name** and the **Web address (URL)** (Settings tab) — your page will live at `/p/your-slug`.
3. On the **Content** tab, under **Page sections**, click **Add item** and pick a block:
   - **Hero** (big banner), **Feature list**, **Cards**, **How it works (steps)**, **Stats band**, **Testimonial**, **FAQ**, **Text** (free prose), **Call to action**.
4. Fill the block in. Add more blocks; **drag** them to reorder.
5. Many blocks have a **Background** option (Light / Tinted / Dark) — alternate them for nice rhythm.
6. Set the **Brand** (Settings) and **Publish.** Look at `/p/your-slug` (add `?_brand=workwell` on previews to see the Workwell version).
7. Want it hidden from Google (e.g. a paid-ad page)? Turn on **Hide from search engines** (Settings).
8. See **`/p/example`** for a reference page showing every block.

### Add a PPC / campaign landing page
- Use **🚀 Landing Pages (CMS)** for the templated landing-page format, or **🧩 Pages (builder)** if you want to compose a bespoke layout. Both go live with no developer.

### Change a price
- **Pricing Plans** → open the plan → edit the price/features → **Publish.** (Pricing is shared, so it updates both brands unless a plan is brand-tagged.)

### Put up a promo banner
- **Promo Banner** → create/edit → set the message, button, colour, and optionally **Show from / Hide after** dates → turn **Show this banner?** on → **Publish.**

### Change a button's text or where it links
- Most buttons are fields on the page/block (e.g. "Button text" + "Button link"). Edit them and **Publish.** *(Buttons that aren't editable fields are built into the design — those need a developer.)*

### Change a page's web address (URL)
- The **Web address (URL)** / slug field controls it (for pages that have one). **⚠ Changing a live URL breaks the old link** and can hurt SEO — tell a developer so they can set up a redirect.

### Edit FAQs, testimonials, blog, Learning Centre
- Each has its own section in the sidebar. Open, edit, **Publish.** The Learning Centre has its own review queue (articles need accountant sign-off before publishing).

## 6. SEO (the SEO tab)
- **Search engine title** — what shows as the blue link in Google (aim ~30–60 characters).
- **Search engine description** — the grey text under it (aim ~120–160 characters).
- Leave **Structured data (advanced)** alone unless a developer asks.

## 7. Previewing before it's live
- Use the **preview URL** the team shares (a stable `…-git-feat-…vercel.app` link) to check changes on a test build.
- Add `?_brand=workwell` to see the Workwell version, `?_brand=clear` for Clever.

## 8. When to ask a developer
You can do almost all day-to-day content yourself. **Ask a developer for:**
- A **new *kind* of page** or a new field that doesn't exist yet.
- A **new block** for the page builder.
- Anything about **design** (colours, fonts, spacing, component look).
- **Navigation menu** and **footer** structure.
- **Changing a live URL** (needs a redirect).
- A page that behaves differently (forms, calculators, integrations).

---
*See also: `cms-governance.md` (roles & rules) and `platform-overview.md` (for developers).*
