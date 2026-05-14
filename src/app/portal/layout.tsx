import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import BrandProvider from "@/components/brand/BrandProvider";
import PortalShell from "@/components/portal/PortalShell";
import { VercelMonitoring } from "@/components/VercelMonitoring";
import { getBrand } from "@/lib/brand";
import { getOnboardingForCurrentUser, isOnboardingError } from "@/lib/portal/onboarding";
import "../globals.css";

/**
 * Portal layout — root layout for all `src/app/portal/*` routes.
 *
 * Wraps everything in ClerkProvider for auth, BrandProvider for theming.
 * Mounts the PortalShell (sidebar + main area). Auth gating happens in
 * middleware so non-public routes never reach this layout unauthenticated.
 */

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
    icons: brand.assets.favicon ? { icon: brand.assets.favicon } : undefined,
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

  // Compute sidebar notification counts. Cached fetch — same call from the
  // dashboard page won't re-hit Salesforce. Skip silently on any failure;
  // the layout shouldn't break if the badge data isn't available.
  let notifications: Partial<Record<string, number>> = {};
  if (isSignedIn) {
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
        notifications = {
          "/portal/documents": pendingDocs,
          "/portal/appointments": pendingAppointments,
        };
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

  // Design-preview routes bring their own shell so we can A/B sidebars.
  // Skip the default PortalShell for /portal/preview/* but keep Clerk +
  // brand + html chrome so the preview still runs in the real environment.
  const isPreview = pathname.startsWith("/portal/preview");

  return (
    <ClerkProvider>
      <html lang="en" className="h-full" data-brand={brand.id}>
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
            {isPreview ? (
              children
            ) : (
              <PortalShell
                brand={brand}
                activeHref={activeHref}
                isSignedIn={isSignedIn}
                notifications={notifications}
              >
                {children}
              </PortalShell>
            )}
          </BrandProvider>
          <VercelMonitoring />
        </body>
      </html>
    </ClerkProvider>
  );
}
