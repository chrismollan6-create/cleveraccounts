"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

/**
 * Native-app bottom tab bar. Rendered by PortalShell only when running inside
 * the Capacitor shell — replaces the web sidebar/hamburger with an iOS/Android
 * style bottom bar (+ a "More" sheet for overflow nav). Sits in the home-
 * indicator safe area.
 */

export interface TabItem {
  label: string;
  href: string;
  iconNode: React.ReactNode;
  notificationCount?: number;
}

export default function PortalTabBar({
  tabs,
  moreItems,
  isSignedIn,
}: {
  tabs: TabItem[];
  moreItems: TabItem[];
  isSignedIn: boolean;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const moreActive = moreItems.some((m) => isActive(m.href));

  return (
    <>
      {/* Overflow sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white shadow-2xl"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-text">More</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-text-light"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="px-3 pb-2">
              {moreItems.map((m) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] ${
                      isActive(m.href)
                        ? "font-semibold text-primary"
                        : "font-medium text-text hover:bg-neutral-50"
                    }`}
                  >
                    <span className={isActive(m.href) ? "text-primary" : "text-text-light"}>
                      {m.iconNode}
                    </span>
                    <span className="flex-1">{m.label}</span>
                    {(m.notificationCount ?? 0) > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">
                        {m.notificationCount! > 99 ? "99+" : m.notificationCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            {isSignedIn && (
              <div className="mx-3 mb-2 flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-3">
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} showName />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex items-stretch">
          {tabs.map((t) => (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  isActive(t.href) ? "text-primary" : "text-text-light"
                }`}
              >
                <span className="relative">
                  {t.iconNode}
                  {(t.notificationCount ?? 0) > 0 && (
                    <span className="absolute -right-2 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                      {t.notificationCount! > 9 ? "9+" : t.notificationCount}
                    </span>
                  )}
                </span>
                <span>{t.label}</span>
              </Link>
            </li>
          ))}
          {/* More */}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={`flex w-full flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                moreActive ? "text-primary" : "text-text-light"
              }`}
            >
              <MoreHorizontal size={22} />
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
