"use client";

import { usePathname } from "next/navigation";
import AccountSwitcher from "./AccountSwitcher";
import type { PortalCompany } from "@/lib/portal/memberships";

/**
 * Native-app top bar — CLIENT side so the title + hero decision update on
 * client-side tab navigation (the layout doesn't re-render between siblings).
 *
 * The portal serves CLEAN urls (/dashboard), but link navigations can land on
 * /portal/dashboard — so we strip the /portal prefix before matching, or the
 * title + hero detection break depending on how you got to the screen.
 *
 * Home (/dashboard) paints its own full-bleed brand hero, so no title bar there
 * — just float the account switcher (multi-company logins only). Every other
 * screen gets the bold large title. The profile/avatar lives in the More menu,
 * so it's intentionally not shown up here.
 */

const NATIVE_TITLES: Record<string, string> = {
  "/dashboard": "Home",
  "/notifications": "Notifications",
  "/messages": "Messages",
  "/documents": "Documents",
  "/financials": "Financials",
  "/deadlines": "Deadlines",
  "/details": "Your details",
  "/appointments": "Appointments",
  "/approvals": "Approvals",
};

/** Strip the internal /portal prefix so /dashboard and /portal/dashboard match. */
function stripPortal(p: string): string {
  return p.replace(/^\/portal(?=\/|$)/, "") || "/";
}

function titleFor(path: string, fallback: string): string {
  if (NATIVE_TITLES[path]) return NATIVE_TITLES[path];
  const hit = Object.keys(NATIVE_TITLES).find((h) => path.startsWith(h + "/"));
  return hit ? NATIVE_TITLES[hit] : fallback;
}

export default function NativeHeader({
  brandName,
  companies,
}: {
  brandName: string;
  companies?: PortalCompany[];
}) {
  const path = stripPortal(usePathname());
  const isHero = path === "/dashboard";
  const switcher =
    companies && companies.length > 1 ? <AccountSwitcher companies={companies} /> : null;

  // Home: the page paints its own brand hero. Only float the switcher (if any).
  if (isHero) {
    if (!switcher) return null;
    return (
      <div
        className="fixed right-4 z-50 flex items-center gap-2"
        style={{ top: "calc(env(safe-area-inset-top) + 14px)" }}
      >
        {switcher}
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
          {titleFor(path, brandName)}
        </h1>
        {switcher}
      </div>
    </header>
  );
}
