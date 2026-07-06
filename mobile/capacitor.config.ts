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
    contentInset: "always",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#1A7A9B",
      showSpinner: false,
    },
  },
};

export default config;
