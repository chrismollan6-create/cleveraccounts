import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  MessageCircle,
  Settings,
  HelpCircle,
  ArrowUpRight,
  CircleAlert,
  Building2,
  Bell,
  CalendarClock,
  FileCheck,
  PoundSterling,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import type { BrandConfig } from "@/lib/constants";
import type { PortalAccountantInfo } from "@/lib/portal/types";
import MobileNav, { type MobileNavItem } from "./MobileNav";
import AccountantAvatar from "./AccountantAvatar";
import AccountSwitcher from "./AccountSwitcher";
import ImpersonationBanner from "./ImpersonationBanner";
import { isSurfaceHidden } from "@/lib/portal/features";
import type { PortalCompany } from "@/lib/portal/memberships";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  badge?: string;
  notificationCount?: number;
}

interface NextAction {
  /** Short title shown in the bottom-of-sidebar reminder card. */
  title: string;
  /** Subtitle — e.g. "36 days overdue · 30 min". */
  sub: string;
  /** Where the CTA goes — Calendly URL, action URL, etc. */
  href: string;
}

interface Props {
  brand: BrandConfig;
  activeHref: string;
  isSignedIn: boolean;
  notifications?: Partial<Record<string, number>>;
  /** Accountant — drives the chip at the top of the sidebar. */
  accountant?: PortalAccountantInfo | null;
  /** Persistent "what's next" CTA at the bottom of the sidebar. */
  nextAction?: NextAction | null;
  /** Compact onboarding progress strip — segments are per-stage states. */
  progress?: { pct: number; segments: string[] } | null;
  /** Companies this login can access — drives the switcher (shown when >1). */
  companies?: PortalCompany[];
  /** When set, a staff view-as session is active — shows the read-only banner. */
  impersonation?: { clientName: string; staffName: string | null } | null;
  children: React.ReactNode;
}

const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Financials", href: "/portal/financials", icon: PoundSterling },
  { label: "Notifications", href: "/portal/notifications", icon: Bell },
  { label: "Deadlines", href: "/portal/deadlines", icon: CalendarClock },
  { label: "Approvals", href: "/portal/approvals", icon: FileCheck },
  { label: "Messages", href: "/portal/messages", icon: MessageCircle },
  { label: "Your details", href: "/portal/details", icon: Building2 },
  { label: "Documents", href: "/portal/documents", icon: FileText },
  { label: "Appointments", href: "/portal/appointments", icon: CalendarDays, disabled: true, badge: "Soon" },
];

const SECONDARY_NAV: NavItem[] = [
  { label: "Help", href: "/portal/help", icon: HelpCircle, disabled: true },
  { label: "Settings", href: "/portal/settings", icon: Settings, disabled: true },
];

function applyNotifications(
  items: NavItem[],
  notifications?: Partial<Record<string, number>>,
): NavItem[] {
  if (!notifications) return items;
  return items.map((item) => {
    const count = notifications[item.href];
    if (count && count > 0 && !item.disabled) {
      return { ...item, notificationCount: count };
    }
    return item;
  });
}

function toMobile(items: NavItem[]): MobileNavItem[] {
  return items.map((item) => {
    const Icon = item.icon;
    return {
      label: item.label,
      href: item.href,
      iconNode: <Icon size={17} />,
      disabled: item.disabled,
      badge: item.badge,
      notificationCount: item.notificationCount,
    };
  });
}

/**
 * Portal application shell — redesigned (May 2026).
 *
 * Four sidebar changes from the previous version:
 *   1. Accountant chip at top (replaces "Encrypted & secure portal" pill).
 *      Shows initials avatar, online dot, reply-time line, Book/Message
 *      icons. Always visible on every page.
 *   2. Active-nav refinement — brand-coloured left border + brand text,
 *      no filled background. Linear-style.
 *   3. Notification badges remain (Messages = "2" amber pill etc.).
 *   4. "What's next" reminder card at the very bottom — persistent nudge
 *      so the next action is always one click away.
 *
 * Photo: still initials, because Salesforce User.FullPhotoUrl needs an
 * auth'd Connected App fetch. TODO: build /api/portal/accountant-photo
 * proxy and switch to real photo when available.
 */
export default function PortalShell({
  brand,
  activeHref,
  isSignedIn,
  notifications,
  accountant,
  nextAction,
  progress,
  companies,
  impersonation,
  children,
}: Props) {
  // Pilot mode hides surfaces whose SF→cache sync isn't built yet.
  const primary = applyNotifications(
    PRIMARY_NAV.filter((i) => !isSurfaceHidden(i.href)),
    notifications
  );
  const secondary = applyNotifications(
    SECONDARY_NAV.filter((i) => !isSurfaceHidden(i.href)),
    notifications
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface-alt/50">
      {impersonation && (
        <ImpersonationBanner
          clientName={impersonation.clientName}
          staffName={impersonation.staffName}
        />
      )}
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-3 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MobileNav
              brand={brand}
              primary={toMobile(primary)}
              secondary={toMobile(secondary)}
              activeHref={activeHref}
              switcherSlot={companies && <AccountSwitcher companies={companies} />}
              footerSlot={
                isSignedIn ? (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/50">
                    <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} showName />
                  </div>
                ) : (
                  <Link
                    href="/portal/sign-in"
                    className="block px-3 py-2.5 text-sm font-semibold text-primary"
                  >
                    Sign in
                  </Link>
                )
              }
            />
            <Link href="/portal/dashboard" aria-label={`${brand.name} portal home`} className="ml-1">
              <Image
                src={brand.assets.logo}
                alt={brand.name}
                width={130}
                height={34}
                priority
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {isSignedIn && <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />}
          </div>
        </div>
      </header>

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-white border-r border-gray-100 z-30">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-50">
            <Link href="/portal/dashboard" aria-label={`${brand.name} portal home`} className="flex items-center">
              <Image
                src={brand.assets.logo}
                alt={brand.name}
                width={170}
                height={44}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Account switcher — only renders when this login has >1 company */}
          {companies && <AccountSwitcher companies={companies} />}

          {/* 1. ACCOUNTANT CHIP — replaces the trust pill */}
          {accountant && accountant.name && (
            <div className="px-4 pt-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <AccountantAvatar
                      name={accountant.name}
                      hasPhoto={Boolean(accountant.photoUrl)}
                      sizeClass="h-8 w-8"
                      textClass="text-[10px]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-gray-50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-text">
                      {accountant.name}
                    </div>
                    <div className="truncate text-[10px] text-text-light">
                      Online · replies in ~2hr
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-1">
                  {accountant.calendlyUrl ? (
                    <a
                      href={accountant.calendlyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-md bg-[#F97316] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[#EA580C]"
                    >
                      <CalendarDays size={10} /> Book
                    </a>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1 rounded-md bg-[#F97316]/40 px-2 py-1 text-[10px] font-semibold text-white">
                      <CalendarDays size={10} /> Book
                    </span>
                  )}
                  <Link
                    href="/portal/messages"
                    className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-text hover:border-gray-400"
                  >
                    <MessageCircle size={10} /> Message
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Primary nav */}
          <nav className="px-3 pt-4 pb-2">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-light/70 mb-2">
              Your account
            </p>
            <ul className="space-y-0.5">
              {primary.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} active={activeHref === item.href} />
                </li>
              ))}
            </ul>

            <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-light/70 mb-2">
              Support
            </p>
            <ul className="space-y-0.5">
              {secondary.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} active={activeHref === item.href} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Compact onboarding progress — fills the rail, persistent across
              pages. Teal = done, orange = current (brand dual-colour system). */}
          {progress && (
            <div className="px-4 pb-1 pt-1">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-light/70">
                    Onboarding
                  </span>
                  <span className="text-[11px] font-bold text-text">
                    {progress.pct}%
                  </span>
                </div>
                <div className="mt-2 flex gap-1">
                  {progress.segments.map((st, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        st === "complete"
                          ? "bg-[#1A7A9B]"
                          : st === "current"
                            ? "bg-[#F97316]"
                            : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Push the reminder + user chip to the bottom of the rail */}
          <div className="flex-1" />

          {/* 4. WHAT'S NEXT REMINDER */}
          {nextAction && (
            <div className="px-3 pb-3">
              <a
                href={nextAction.href}
                target={nextAction.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group block rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-3 ring-1 ring-amber-200 transition hover:ring-amber-300"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-amber-500 text-white">
                    <CircleAlert size={12} />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                    What&apos;s next
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold leading-tight text-text">
                  {nextAction.title}
                </div>
                <div className="mt-0.5 text-[10px] text-text-light">
                  {nextAction.sub}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                  Go now
                  <ArrowUpRight
                    size={11}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </a>
            </div>
          )}

          {/* Tiny user chip */}
          <div className="p-3 border-t border-gray-50">
            {isSignedIn ? (
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} showName />
              </div>
            ) : (
              <Link
                href="/portal/sign-in"
                className="block px-3 py-2 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Sign in
              </Link>
            )}
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 lg:pl-64 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  if (item.disabled) {
    return (
      <span
        aria-disabled
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-text-light/60 cursor-not-allowed"
      >
        <Icon size={17} className="shrink-0 text-text-light/50" />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gray-100 text-text-light/70">
            {item.badge}
          </span>
        )}
      </span>
    );
  }

  const hasNotifications = (item.notificationCount ?? 0) > 0;
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
        active
          ? "font-semibold text-primary"
          : "font-medium text-text hover:bg-gray-50"
      }`}
    >
      {/* 2. Active state: brand-coloured left border, no fill */}
      {active && (
        <span className="absolute left-0 top-2 h-5 w-0.5 rounded-r-full bg-primary" />
      )}
      <Icon size={17} className={`shrink-0 ${active ? "text-primary" : ""}`} />
      <span className="flex-1">{item.label}</span>
      {/* 3. Notification badge */}
      {hasNotifications && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
          {item.notificationCount! > 99 ? "99+" : item.notificationCount}
        </span>
      )}
    </Link>
  );
}
