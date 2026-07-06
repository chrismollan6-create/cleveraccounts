# Clever Accounts / Workwell — Mobile app (Capacitor)

Native iOS + Android shell for the client portal. It **loads the live portal**
(`https://my.cleveraccounts.com`) in a native webview — the portal is a
server-rendered Next.js app, so it can't be statically bundled; the shell reuses
everything already deployed (auth, routing, data, notifications) and layers
native capabilities (push, splash, status bar) on top.

> Scaffolded on Windows. **Building runs on a Mac** (iOS needs Xcode; Android
> uses Android Studio). The `ios/` and `android/` native projects are generated
> on the Mac with `npx cap add` and then committed.

## Phase 1 — get it running (do this on the Mac)

Prereqs: Node 20+, Xcode + CocoaPods (`sudo gem install cocoapods`), Android
Studio (with an SDK + a virtual device), JDK 17.

```bash
cd cleveraccounts/mobile
npm install                # installs Capacitor + plugins from package.json
npx cap add ios            # generates ios/  (commit it after)
npx cap add android        # generates android/  (commit it after)
npx cap sync               # copies config + plugins into the native projects
npx cap open ios           # opens Xcode → pick a device/simulator → Run
npx cap open android       # opens Android Studio → Run
```

You should get the Clever Accounts portal running natively, signed in via Clerk
exactly as on the web.

### What to expect / known wrinkles
- **Auth in a webview:** email + password, magic link and passkeys work.
  Third-party **Google OAuth may be blocked by Google inside a webview** — if you
  rely on it, add a native OAuth flow later (Clerk supports it) or keep
  email/passkey for the app.
- **Apple guideline 4.2 (minimum functionality):** a pure website wrapper can be
  rejected. Native push + the fact that it's a real client tool usually clears
  it; if review pushes back, the answer is to lean harder on native features
  (push, biometric unlock, offline states).

## Configuration

`capacitor.config.ts` — appId `com.cleveraccounts.portal`, name **Clever
Accounts**, `server.url` = the live portal. Change `server.url` to a Vercel
preview URL to test against a branch build.

## Brand flavours (Clever now, Workwell later)

One codebase, per-brand build config:

| | Clever (now) | Workwell (later) |
|---|---|---|
| appId | `com.cleveraccounts.portal` | `com.workwellaccountancy.portal` |
| appName | Clever Accounts | Workwell |
| server.url | my.cleveraccounts.com | my.workwellaccountancy.com |
| store accounts | provisioned | needs own D-U-N-S/Apple/Google |

Recommended approach: a `capacitor.config.clever.ts` / `capacitor.config.workwell.ts`
pair swapped by a small `prebuild` script (or Android `productFlavors` + iOS
schemes/targets once the native projects exist). Kept single-flavour (Clever)
for Phase 1.

## Phase 2 — native push (FCM / APNs) — NOT YET BUILT

Web push already works in the browser portal; the native app needs the
`@capacitor/push-notifications` plugin wired to FCM (Android) + APNs (iOS):

1. Firebase project per brand → `google-services.json` (Android) +
   `GoogleService-Info.plist` (iOS); APNs auth key in Firebase.
2. On launch: register for push, get the FCM/APNs token, POST it to a **new**
   `/api/portal/push/register-native` endpoint → store in `portal.push_tokens`
   with `platform` = `ios` | `android`, `token` = the FCM token.
3. Server send path: the existing `sendPushToAccount` handles web via `web-push`;
   add an **FCM Admin SDK** path for native tokens (fan-out stays best-effort,
   fired via `after()` like web push).
4. Deep-link taps to the right portal route (the SW already does this for web).

The `lib/portal/push.ts` seam was built so this slots in alongside web push.

## Phase 3 — store submission

Signing certs / provisioning profiles (Apple), keystore (Android), store
listings + review. Clever first; Workwell once its store accounts are enrolled.
