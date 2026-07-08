import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Clever Accounts client portal — native shell.
 *
 * Architecture: the portal is a server-rendered Next.js app (server components,
 * API routes, Clerk auth), so it can't be statically bundled. Instead the app is
 * a thin Capacitor shell that loads the LIVE portal (server.url) in a native
 * webview — auth, routing and data all behave exactly as on the web. Native
 * plugins (push, splash, status bar) bridge in on top.
 *
 * Brand flavours: swap appId / appName / server.url per brand. Clever ships
 * first (its store accounts are provisioned); the Workwell flavour reuses this
 * codebase — see mobile/README.md.
 */
const config: CapacitorConfig = {
  appId: "com.cleveraccounts.portal",
  appName: "Clever Accounts",
  // Required by the CLI even in remote-server mode — a minimal offline fallback.
  webDir: "www",
  // Marks the webview's user-agent so the (server-rendered) portal can detect
  // it's running inside the app and render the native-style shell (bottom tab
  // bar, safe areas) instead of the web sidebar — no flash, no hydration diff.
  appendUserAgent: "CleverAccountsApp",
  server: {
    url: "https://my.cleveraccounts.com",
    androidScheme: "https",
    iosScheme: "https",
    // Keep cross-subdomain auth navigations INSIDE the webview instead of
    // bouncing to Safari (which breaks sign-in — the session lands in Safari,
    // not the app). Clerk's Frontend API + hosted pages live on clerk.* /
    // accounts.*; Turnstile is the bot-check iframe.
    allowNavigation: [
      "my.cleveraccounts.com",
      "clerk.cleveraccounts.com",
      "accounts.cleveraccounts.com",
      "*.clerk.accounts.dev",
      "challenges.cloudflare.com",
    ],
  },
  ios: {
    // "never" — the webview does NOT add its own scroll content-inset, which was
    // causing a white band + downward content shift after scrolling on the
    // immersive dashboard. Safe areas are handled in CSS via env(safe-area-*).
    contentInset: "never",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0d2c40",
      showSpinner: true,
      spinnerColor: "#ffffff",
      iosSpinnerStyle: "large",
    },
    Keyboard: {
      // Resize the webview (not the whole page) when the keyboard opens, so
      // inputs stay visible and the layout doesn't jump like a mobile web page.
      resize: "native",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
