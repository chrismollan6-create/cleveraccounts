"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import AccountSwitcher from "./AccountSwitcher";
import type { PortalCompany } from "@/lib/portal/memberships";

/**
 * Native-app top bar — CLIENT side on purpose.
 *
 * PortalShell lives in the portal layout, which Next.js does NOT re-render on
 * client-side navigation between sibling tabs. A server-derived title/header
 * therefore goes stale (every tab still reads as the dashboard → floating
 * avatar over the content, no title). Reading `usePathname()` here keeps the
 * big title and the hero-vs-title decision correct on every tab switch.
 *
 * Home (`/portal/dashboard`) paints its own full-bleed brand hero, so we render
 * just a floating account cluster over it. Every other screen gets the bold
 * iOS-style large title.
 */

const NATIVE_TITLES: Record<string, string> = {
  "/portal/dashboard": "Home",
  "/portal/notifications": "Notifications",
  "/portal/messages": "Messages",
  "/portal/documents": "Documents",
  "/portal/financials": "Financials",
  "/portal/deadlines": "Deadlines",
  "/portal/details": "Your details",
  "/portal/appointments": "Appointments",
  "/portal/approvals": "Approvals",
};

function titleFor(pathname: string, fallback: string): string {
  if (NATIVE_TITLES[pathname]) return NATIVE_TITLES[pathname];
  // Longest-prefix match so nested routes (e.g. /portal/messages/123) keep the title.
  const hit = Object.keys(NATIVE_TITLES).find((h) => pathname.startsWith(h + "/"));
  return hit ? NATIVE_TITLES[hit] : fallback;
}

export default function NativeHeader({
  brandName,
  isSignedIn,
  companies,
}: {
  brandName: string;
  isSignedIn: boolean;
  companies?: PortalCompany[];
}) {
  const pathname = usePathname();
  const isHero = pathname === "/portal/dashboard";

  const cluster = (
    <div className="flex items-center gap-2">
      {companies && companies.length > 1 && <AccountSwitcher companies={companies} />}
      {isSignedIn && (
        <UserButton
          appearance={{
            elements: { avatarBox: isHero ? "h-8 w-8 ring-2 ring-white/40" : "h-8 w-8" },
          }}
        />
      )}
    </div>
  );

  // Home: float the account cluster over the page's own brand hero.
  if (isHero) {
    return (
      <div
        className="fixed right-4 z-50 flex items-center gap-2"
        style={{ top: "calc(env(safe-area-inset-top) + 14px)" }}
      >
        {cluster}
      </div>
    );
  }

  // Every other tab: bold large title under the status bar.
  return (
    <header
      className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-2.5">
        <h1 className="text-[1.75rem] font-extrabold leading-none tracking-tight text-text">
          {titleFor(pathname, brandName)}
        </h1>
        {cluster}
      </div>
    </header>
  );
}
