"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShieldCheck } from "lucide-react";
import type { BrandConfig } from "@/lib/constants";

export interface MobileNavItem {
  label: string;
  href: string;
  /** Lucide icon component as a React node (rendered server-side then passed in). */
  iconNode: React.ReactNode;
  disabled?: boolean;
  badge?: string;
  notificationCount?: number;
}

interface Props {
  brand: BrandConfig;
  primary: MobileNavItem[];
  secondary: MobileNavItem[];
  activeHref: string;
  /** Bottom-of-drawer slot: typically the user button. */
  footerSlot: React.ReactNode;
}

/**
 * Slide-in drawer used on mobile (lg-and-below). Owns its own open/close
 * state so the rest of the shell can stay server-rendered.
 *
 * Body scroll locked while the drawer is open; click on the backdrop or
 * Escape closes it. Same nav data as the desktop sidebar so we don't end up
 * with two parallel definitions.
 */
export default function MobileNav({
  brand,
  primary,
  secondary,
  activeHref,
  footerSlot,
}: Props) {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-text hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <aside
            className="relative h-full w-[80vw] max-w-sm bg-white shadow-2xl flex flex-col animate-drawer-slide"
            role="navigation"
            aria-label="Primary"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
              <Link
                href="/portal/dashboard"
                onClick={() => setOpen(false)}
                aria-label={`${brand.name} portal home`}
              >
                <Image
                  src={brand.assets.logo}
                  alt={brand.name}
                  width={140}
                  height={36}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-text-light hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Trust pill */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                <ShieldCheck size={14} className="text-primary shrink-0" />
                <span className="text-xs font-medium text-primary">
                  Encrypted &amp; secure portal
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-2">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-light/70 mb-2">
                Your account
              </p>
              <ul className="space-y-0.5">
                {primary.map((item) => (
                  <li key={item.href}>
                    <DrawerNavLink
                      item={item}
                      active={activeHref === item.href}
                      onSelect={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>

              <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-light/70 mb-2">
                Support
              </p>
              <ul className="space-y-0.5">
                {secondary.map((item) => (
                  <li key={item.href}>
                    <DrawerNavLink
                      item={item}
                      active={activeHref === item.href}
                      onSelect={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer slot (UserButton) */}
            <div className="p-3 border-t border-gray-100">{footerSlot}</div>
          </aside>
        </div>
      )}
    </>
  );
}

function DrawerNavLink({
  item,
  active,
  onSelect,
}: {
  item: MobileNavItem;
  active: boolean;
  onSelect: () => void;
}) {
  const hasNotifications = (item.notificationCount ?? 0) > 0;

  if (item.disabled) {
    return (
      <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-light/60 cursor-not-allowed">
        <span className="shrink-0 text-text-light/50">{item.iconNode}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gray-100 text-text-light/70">
            {item.badge}
          </span>
        )}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-text hover:bg-gray-50 hover:text-primary"
      }`}
    >
      <span className="shrink-0">{item.iconNode}</span>
      <span className="flex-1">{item.label}</span>
      {hasNotifications && (
        <span
          className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
            active ? "bg-white text-primary" : "bg-red-500 text-white"
          }`}
        >
          {item.notificationCount! > 99 ? "99+" : item.notificationCount}
        </span>
      )}
    </Link>
  );
}
