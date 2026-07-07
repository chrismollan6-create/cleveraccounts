# Native push (FCM) — setup checklist

The **code** is done and deployed (server + device registration). Native push
stays silently disabled until the credentials below exist. iOS-first; Android
reuses the same code + a google-services.json later.

Flow: `Notification__c` (Salesforce) → sync → `sendPushToAccount` → FCM Admin
SDK → device. Tokens are stored per user in `portal.push_tokens`
(`platform = ios|android`) by `/api/portal/push/register-native`.

## Already built (no action needed)
- `src/lib/portal/fcm.ts` — FCM sender (firebase-admin), prunes dead tokens,
  sets the iOS app-icon badge to the account's unread count.
- `src/lib/portal/push.ts` — `sendPushToClerkUsers` now fans out web + native.
- `src/app/api/portal/push/register-native/route.ts` — token registration.
- `src/components/portal/NativePush.tsx` — registers the token in-app + deep-links taps.
- `push_tokens` table already supports `ios`/`android` (no migration).

---

## 1. Apple Developer (developer.apple.com)
- Keys → **＋** → enable **Apple Push Notifications service (APNs)** → create.
  Download the **`.p8`** key. Note the **Key ID** and your **Team ID**.
- Confirm the App ID `com.cleveraccounts.portal` has **Push Notifications** enabled.

## 2. Firebase (console.firebase.google.com)
- Create/choose a project (e.g. "Clever Accounts").
- **Add app → iOS** → bundle ID **`com.cleveraccounts.portal`** → download
  **`GoogleService-Info.plist`**.
- Project Settings → **Cloud Messaging** → *Apple app configuration* → upload the
  **APNs `.p8`** key + Key ID + Team ID (from step 1).
- Project Settings → **Service accounts** → **Generate new private key** →
  download the **service-account JSON** (for the server, step 5).

## 3. The app — `mobile/`
```bash
cd mobile
npm install @capacitor-firebase/messaging   # picks the Capacitor-8-compatible version
```
- Drop **`GoogleService-Info.plist`** into `mobile/ios/App/App/` and add it to the
  **App** target in Xcode (drag in → check "App" target).
- `AppDelegate.swift`: add at the top of `application(_:didFinishLaunchingWithOptions:)`:
  ```swift
  import FirebaseCore     // at the top of the file
  // ...inside didFinishLaunchingWithOptions, before `return true`:
  FirebaseApp.configure()
  ```

## 4. Xcode capabilities — App target → Signing & Capabilities → **＋ Capability**
- **Push Notifications**
- **Background Modes** → tick **Remote notifications**

Then:
```bash
npx cap sync ios
npx cap open ios     # Run on a REAL device — push does NOT work in the simulator
```

## 5. Server — Vercel (portal-clever project)
- Add env var **`FIREBASE_SERVICE_ACCOUNT_JSON`** = the service-account JSON from
  step 2 (whole JSON on one line, or base64). Scope: Production.
- Redeploy the portal (`vercel --prod`) so the new env var is picked up.

## 6. Test
1. Run the app on a device, sign in → accept the notification permission prompt.
   The FCM token registers (`POST /api/portal/push/register-native`).
2. Create a test `Notification__c` in Salesforce (same as the in-app test) on the
   client's Account → within a few seconds the device should buzz + the app icon
   badge should show the unread count.

## Android (later)
Add an **Android** app in the same Firebase project (package
`com.cleveraccounts.portal`), download **`google-services.json`** into
`mobile/android/app/`, `npm install` already covers the plugin, `cap sync android`.
The server + device code already handle `platform = android`.

## Workwell flavour
Add a second iOS app (bundle `com.workwellaccountancy.portal`) to the same
Firebase project (or a per-brand project), ship its own `GoogleService-Info.plist`
in the Workwell build. One `FIREBASE_SERVICE_ACCOUNT_JSON` can serve both apps.
