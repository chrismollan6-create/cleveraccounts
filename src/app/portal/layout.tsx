import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { isNativeAppUA } from "@/lib/portal/native";
import BrandProvider from "@/components/brand/BrandProvider";
import PortalShell from "@/components/portal/PortalShell";
import NativePush from "@/components/portal/NativePush";
import { VercelMonitoring } from "@/components/VercelMonitoring";
import { getBrand } from "@/lib/brand";
import { getOnboardingForCurrentUser, isOnboardingError } from "@/lib/portal/onboarding";
import { countAccountantRepliesForCurrentUser } from "@/lib/portal/messages";
import { countUnreadNotificationsForCurrentUser } from "@/lib/portal/notifications";
import { getDeadlinesForCurrentUser } from "@/lib/portal/deadlines";
import { countPendingApprovalsForCurrentUser } from "@/lib/portal/approvals";
import { countOutstandingDocRequestsForCurrentUser } from "@/lib/portal/documents";
import { listMyCompanies, getImpersonationBanner, type PortalCompany } from "@/lib/portal/memberships";
import "../globals.css";

// viewport-fit=cover is required for `env(safe-area-inset-*)` to resolve on
// notched devices — the native shell relies on it for the header + tab bar.
//
// In the NATIVE app we also lock zoom (maximumScale 1 / userScalable false):
// iOS auto-zooms into any input with font-size < 16px on focus, which makes the
// whole screen "grow" and stop fitting when the keyboard opens. The web keeps
// pinch-zoom (accessibility) — only the app locks it.
export async function generateViewport(): Promise<Viewport> {
  const isNativeApp = isNativeAppUA((await headers()).get("user-agent"));
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    ...(isNativeApp ? { maximumScale: 1, userScalable: false } : {}),
  };
}

/**
 * Portal layout — root layout for all `src/app/portal/*` routes.
 *
 * Wraps everything in ClerkProvider for auth, BrandProvider for theming.
 * Mounts the PortalShell (sidebar + main area). Auth gating happens in
 * middleware so non-public routes never reach this layout unauthenticated.
 */

// Clerk text overrides. The default authenticator-setup screen shows only a QR
// code with no instruction, so users scan it with their phone camera (which
// routes to iOS Passwords and does nothing useful) instead of an authenticator
// app. We spell out the steps. `taskSetupMfa` is the forced-enrollment screen
// shown after sign-in when "Require MFA" is on; `userProfile.mfaTOTPPage` is the
// same flow reached from profile settings.
const AUTHENTICATOR_INSTRUCTION =
  "Open an authenticator app on your phone — Google Authenticator, Microsoft " +
  "Authenticator, Authy or 1Password — and use its “Scan QR code” option to scan " +
  "the code below (your phone’s camera app won’t work). Then enter the 6-digit " +
  "code it generates.";

const PORTAL_CLERK_LOCALIZATION = {
  // Brand-neutral heading on the first sign-in step (Clerk's default
  // "Sign in to <app name>" would bake in one brand across both portals).
  // Later steps (e.g. the email-code screen) keep Clerk's own contextual
  // title + subtitle so the user always sees what to do above the input.
  signIn: {
    start: {
      title: "Sign in to your portal",
      subtitle: "Use your passkey, or we’ll email you a sign-in link.",
    },
  },
  taskSetupMfa: {
    totpCode: {
      addAuthenticatorApp: {
        infoText__ableToScan: AUTHENTICATOR_INSTRUCTION,
      },
    },
  },
  userProfile: {
    mfaTOTPPage: {
      authenticatorApp: {
        infoText__ableToScan: AUTHENTICATOR_INSTRUCTION,
      },
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    metadataBase: new URL(`https://${brand.portalDomain}`),
    title: {
      default: `Client Portal | ${brand.name}`,
      template: `%s | ${brand.name} Portal`,
    },
    description: `Your ${brand.name} client portal — track onboarding progress and book appointments with your accountant.`,
    robots: { index: false, follow: false },
    formatDetection: { email: false, address: false, telephone: false },
    icons: brand.assets.favicon,
  };
}

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [brand, { userId }, hdrs] = await Promise.all([getBrand(), auth(), headers()]);
  const isSignedIn = Boolean(userId);

  // Active nav resolution. Middleware rewrites /dashboard → /portal/dashboard
  // on portal hostnames, so we check the rewrite header first; fall back to
  // x-pathname (set by Next), then derive from the URL.
  const pathname = hdrs.get("x-invoke-path") ?? hdrs.get("x-pathname") ?? "";
  const activeHref =
    pathname && pathname.startsWith("/portal") ? pathname : "/portal/dashboard";

  // Compute sidebar notification counts + accountant + next-action all from
  // one cached fetch — same call from the dashboard page won't re-hit
  // Salesforce. Skip silently on any failure; the layout never breaks.
  let notifications: Partial<Record<string, number>> = {};
  let accountant: import("@/lib/portal/types").PortalAccountantInfo | null = null;
  let nextAction: { title: string; sub: string; href: string } | null = null;
  let progress: { pct: number; segments: string[] } | null = null;
  // Staff view-as banner — independent of Clerk auth (staff have no session).
  const impersonation = await getImpersonationBanner().catch(() => null);

  let companies: PortalCompany[] = [];
  if (isSignedIn) {
    // Companies this login can access — drives the sidebar switcher. Fail-soft
    // to an empty list so the layout never breaks.
    try {
      companies = await listMyCompanies();
    } catch {
      companies = [];
    }
    try {
      const result = await getOnboardingForCurrentUser();
      if (!isOnboardingError(result) && result.data) {
        const status = result.data;
        // Documents → pending compliance tasks (engagement letter, etc.)
        const pendingDocs = (status.tasks ?? []).filter(
          (t) =>
            t.key === "engagement_letter" &&
            (t.state === "pending" || t.state === "in_progress")
        ).length;
        // Appointments → unbooked stages that need a time picked
        const pendingAppointments = status.blockedOn === "client" && !status.isComplete ? 1 : 0;
        // Nav badges — messages replies, unread notifications, deadlines that
        // need the client. Each resolved from the cache; all fail-soft to 0.
        const [replies, unreadNotifs, dl, pendingApprovals, docRequests] =
          await Promise.all([
            countAccountantRepliesForCurrentUser(),
            countUnreadNotificationsForCurrentUser(),
            getDeadlinesForCurrentUser(),
            countPendingApprovalsForCurrentUser(),
            countOutstandingDocRequestsForCurrentUser(),
          ]);
        const deadlinesNeedingClient = dl.ok
          ? dl.data.filter(
              (d) =>
                d.status === "overdue" ||
                (d.status === "due_soon" && d.blockedOn === "client")
            ).length
          : 0;
        notifications = {
          "/portal/documents": docRequests.ok ? docRequests.data : pendingDocs,
          "/portal/appointments": pendingAppointments,
          "/portal/messages": replies.ok ? replies.data : 0,
          "/portal/notifications": unreadNotifs.ok ? unreadNotifs.data : 0,
          "/portal/deadlines": deadlinesNeedingClient,
          "/portal/approvals": pendingApprovals.ok ? pendingApprovals.data : 0,
        };
        accountant = status.accountant ?? null;
        // Compact onboarding progress strip for the sidebar.
        const completedStages = status.stages.filter(
          (s) => s.state === "complete"
        ).length;
        progress = {
          pct: Math.round((completedStages / status.totalStages) * 100),
          segments: status.stages.map((s) => s.state),
        };
        // Derive a sidebar "what's next" reminder — gentle nudge tone, no
        // alarming "N days overdue" framing (matches the dashboard).
        if (!status.isComplete && status.nextActionLabel) {
          nextAction = {
            title: status.nextActionLabel,
            sub:
              status.blockedOn === "client"
                ? "A quick 30-min call"
                : "In progress",
            href: status.accountant?.calendlyUrl ?? "/portal/dashboard",
          };
        }
      }
    } catch {
      // Layout never breaks for badge issues.
    }
  }

  const fontFamilyParam = brand.font.family.replace(/\s+/g, "+");
  const fontHref =
    brand.id === "workwell"
      ? `https://fonts.googleapis.com/css2?family=${fontFamilyParam}:wght@${brand.font.weights}&display=swap`
      : null;

  // Routes that bring their own full-screen layout — bypass PortalShell so
  // the sidebar isn't shown when it'd be useless or confusing:
  //   /portal/preview/*   — design playground, owns its own shell
  //   /portal/sign-in/*   — auth pages, no nav to show before login
  //   /portal/activate/*  — invite redemption, no nav before account exists
  const isBareLayout =
    pathname.startsWith("/portal/preview") ||
    pathname.startsWith("/portal/sign-in") ||
    pathname.startsWith("/portal/activate");

  // Running inside the Capacitor app? → native bottom-tab shell + safe areas.
  const isNativeApp = isNativeAppUA((await headers()).get("user-agent"));

  return (
    <ClerkProvider localization={PORTAL_CLERK_LOCALIZATION}>
      <html
        lang="en"
        className="h-full"
        data-brand={brand.id}
        data-native={isNativeApp ? "true" : undefined}
      >
        <head>
          {fontHref && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
              <link rel="stylesheet" href={fontHref} />
            </>
          )}
        </head>
        <body className="min-h-full font-sans antialiased text-text">
          <BrandProvider brandId={brand.id}>
            {isBareLayout ? (
              children
            ) : (
              <PortalShell
                brand={brand}
                activeHref={activeHref}
                isSignedIn={isSignedIn}
                notifications={notifications}
                accountant={accountant}
                nextAction={nextAction}
                progress={progress}
                companies={companies}
                impersonation={impersonation}
                isNativeApp={isNativeApp}
              >
                {children}
              </PortalShell>
            )}
          </BrandProvider>
          {/* Native-app FCM push registration (no-op in a web browser). */}
          {isSignedIn && <NativePush />}
          <VercelMonitoring />
        </body>
      </html>
    </ClerkProvider>
  );
}
