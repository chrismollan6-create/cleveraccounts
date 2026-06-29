"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Picks between the light "reading-mode" chrome (used on /learn/*) and the full
 * marketing chrome, based on the *live* pathname.
 *
 * Why a client component: the (site) layout is a server component, and App
 * Router does NOT re-render layouts on client-side navigation. Deciding the
 * header/footer in the layout (from the x-pathname header) left it stuck on
 * whichever variant rendered first — e.g. landing on /learn then clicking Home
 * kept the stripped-down LearnHeader. `usePathname()` is reactive to soft
 * navigation, so the switch now follows the URL. Both variants are rendered on
 * the server and passed in as props; this component only chooses which to show.
 */
export function isLearnPath(pathname: string | null): boolean {
  return pathname === "/learn" || (pathname?.startsWith("/learn/") ?? false);
}

export default function ChromeSwitcher({
  light,
  full,
}: {
  light: ReactNode;
  full: ReactNode;
}) {
  const pathname = usePathname();
  return <>{isLearnPath(pathname) ? light : full}</>;
}
