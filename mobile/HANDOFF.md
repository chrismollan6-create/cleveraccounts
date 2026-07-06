# Mobile app — session handoff (2026-07-06)

Continuing the Capacitor app work on the Mac. Everything below is committed +
pushed to `origin/main` — on the Mac just `git pull`.

## Where we are — WORKING on the iOS simulator
- **Capacitor shell** wraps the live portal (`server.url = https://my.cleveraccounts.com`).
  See `capacitor.config.ts` + `README.md`.
- **Clerk sign-in works in-app** — the fix was `server.allowNavigation` for the
  Clerk domains (else it bounced to Safari and stuck white). Session persists, so
  reopening the app goes straight in.
- **Native app shell** is live, gated on a user-agent marker
  (`appendUserAgent: "CleverAccountsApp"` → server detects it via
  `src/lib/portal/native.ts` → `html[data-native]`):
  - **Bottom tab bar** (Home · Notifications · Messages · Documents · More) —
    `src/components/portal/PortalTabBar.tsx`, wired in `PortalShell.tsx`.
  - **Bold large-title header** (iOS-style) in `PortalShell.tsx`.
  - **Immersive full-bleed sign-in** — `src/app/portal/sign-in/[[...rest]]/page.tsx`
    + `getPortalClerkAppearanceImmersive` in `src/lib/clerk-appearance.ts`.
  - **Browser-isms killed** (no bounce/tap-flash/callout) — `src/app/globals.css`
    `html[data-native]` rules. **Haptics** on tab tap + **Keyboard resize** config.

## Build loop on the Mac
```bash
git pull
cd mobile
npm install            # if deps changed
npx cap sync           # only needed when capacitor.config.ts / native plugins change
npx cap open ios       # Run in Xcode
```
Web-only changes (styling, layout) just need an **app reload** — they're served
from the deployed portal. Native/config changes need `cap sync`.
Deploy the web with `vercel --prod` from the repo root (portal-clever project).

## NEXT TASK — bold app design skin (in progress)
Goal: make it look like a *proper* app, not the website. All gated on
`data-native` so the website is untouched. **Blocked on screenshots** — build a
bold **Home** screen first (immersive branded hero: greeting + next action + key
numbers; chunky app-scale cards), react to it, then roll the language across
Notifications / Messages / Documents. Open direction Qs: clean-premium vs
rich-vibrant; personalised Home hero.

## Then (queued)
- Perceived speed: loading skeletons + client caching per tab.
- Face ID unlock for returning users (biometric plugin + gate).
- **Phase 2 native push (FCM/APNs)** — server side buildable anywhere (needs a
  Firebase project); device side on the Mac. See README Phase 2.
- Workwell flavour + store submission (Apple guideline 4.2 — native push is the
  mitigation for a wrapper).

## Context note
Detailed session memory lives on the Windows machine's `~/.claude`; a fresh Mac
session starts without it, but this file + `README.md` + the code carry the
essentials.
