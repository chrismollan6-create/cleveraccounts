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
import PortalTabBar, { type TabItem } from "./PortalTabBar";
import NativeHeader from "./NativeHeader";
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
  /**
   * Sub-destinations that belong to this group. They keep their own routes
   * (nothing moved), they just stop competing for a top-level slot. Rendered
   * indented under the parent while the group is the active one.
   */
  children?: NavItem[];
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
  /** True when rendered inside the Capacitor app → native bottom-tab shell. */
  isNativeApp?: boolean;
  children: React.ReactNode;
}

/** The 4 primary destinations that get their own bottom-tab (rest go in "More"). */
const TAB_HREFS = [
  "/portal/dashboard",
  "/portal/notifications",
  "/portal/messages",
  "/portal/documents",
];

/** Flatten a grouped nav tree to a plain list (tab bar / mobile drawer). */
function flatten(items: NavItem[]): NavItem[] {
  return items.flatMap((i) => [i, ...(i.children ?? [])]);
}

/**
 * A group's badge when collapsed is the sum of everything inside it —
 * otherwise collapsing "Deadlines 1 · Approvals 2" under "Needs you" would
 * silently hide three things that need the client.
 */
function rollUpCount(item: NavItem): number {
  return (
    (item.notificationCount ?? 0) +
    (item.children ?? []).reduce((n, c) => n + (c.notificationCount ?? 0), 0)
  );
}

function toTab(item: NavItem, size: number): TabItem {
  const Icon = item.icon;
  return {
    label: item.href === "/portal/dashboard" ? "Home" : item.label,
    href: item.href,
    iconNode: <Icon size={size} />,
    notificationCount: item.notificationCount,
  };
}

/**
 * Five primary destinations, matching the app's five tabs so web and native
 * stop diverging. Nine flat items (two of them permanently disabled) asked the
 * client to hold the whole product in their head; these five are the questions
 * a client actually arrives with:
 *
 *   Home       — what's going on
 *   Needs you  — what I have to do        (notifications · deadlines · approvals)
 *   Money      — how the business is doing
 *   Documents  — paperwork, both ways
 *   Messages   — talk to my accountant    (+ book a call)
 *
 * Every route is unchanged — this is a regrouping, not a migration.
 */
const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/portal/dashboard", icon: LayoutDashboard },
  {
    label: "Needs you",
    href: "/portal/notifications",
    icon: Bell,
    children: [
      { label: "Deadlines", href: "/portal/deadlines", icon: CalendarClock },
      { label: "Approvals", href: "/portal/approvals", icon: FileCheck },
    ],
  },
  { label: "Money", href: "/portal/financials", icon: PoundSterling },
  { label: "Documents", href: "/portal/documents", icon: FileText },
  {
    label: "Messages",
    href: "/portal/messages",
    icon: MessageCircle,
    children: [
      { label: "Book a call", href: "/portal/appointments", icon: CalendarDays },
    ],
  },
];

/** The account group — who I am, how this behaves, where to get help. */
const SECONDARY_NAV: NavItem[] = [
  { label: "Your details", href: "/portal/details", icon: Building2 },
  { label: "Settings", href: "/portal/settings", icon: Settings },
  { label: "Help", href: "/portal/help", icon: HelpCircle },
];

function applyNotifications(
  items: NavItem[],
  notifications?: Partial<Record<string, number>>,
): NavItem[] {
  if (!notifications) return items;
  const apply = (item: NavItem): NavItem => {
    const count = notifications[item.href];
    const next: NavItem = { ...item };
    if (count && count > 0 && !item.disabled) next.notificationCount = count;
    if (item.children) next.children = item.children.map(apply);
    return next;
  };
  return items.map(apply);
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
 * Portal application shell — redesigned May 2026, re-disciplined Oct 2026.
 *
 * The sidebar:
 *   1. Accountant chip at top — the ONE place the accountant appears.
 *      Pages must not repeat it; that is how we ended up with three of them
 *      on the dashboard.
 *   2. Active-nav refinement — brand-coloured left border + brand text,
 *      no filled background. Linear-style.
 *   3. Notification counts are teal, not orange. Orange in this product
 *      means "this needs you to act"; a count is information.
 *   4. Progress strip + "what's next" card are rail wayfinding for pages
 *      that DON'T state them — both are suppressed on the dashboard, which
 *      carries the full-size versions.
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
  isNativeApp,
  children,
}: Props) {
  // The dashboard states the onboarding progress and the next action in full,
  // so the rail's compact copies of both are suppressed there — otherwise one
  // screen carries two progress meters and says "book your welcome call"
  // twice. On every other page the rail copies ARE the wayfinding, so they stay.
  const onDashboard = activeHref === "/portal/dashboard";

  // Pilot mode hides surfaces whose SF→cache sync isn't built yet — including
  // sub-items, so a hidden Approvals doesn't leave a dead child under "Needs you".
  const prune = (items: NavItem[]): NavItem[] =>
    items
      .filter((i) => !isSurfaceHidden(i.href))
      .map((i) =>
        i.children ? { ...i, children: prune(i.children) } : i
      );

  const primary = applyNotifications(prune(PRIMARY_NAV), notifications);
  const secondary = applyNotifications(prune(SECONDARY_NAV), notifications);

  // ── Native app shell: slim header + bottom tab bar (no sidebar) ──────────
  if (isNativeApp) {
    // Tabs come from the grouped parents; everything else — sub-items and the
    // account group — lives behind "More", so the tab bar stays at five.
    const flat = flatten(primary);
    const byHref = new Map(flat.map((i) => [i.href, i]));
    const tabItems = TAB_HREFS.map((href) => byHref.get(href))
      .filter((i): i is NavItem => Boolean(i))
      .map((i) => toTab({ ...i, notificationCount: rollUpCount(i) }, 22));
    const moreItems = [...flat, ...flatten(secondary)]
      .filter((i) => !TAB_HREFS.includes(i.href))
      .map((i) => toTab(i, 20));

    return (
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(180deg, ${brand.colors.surfaceAlt} 0%, ${brand.colors.surface} 55%, ${brand.colors.surfaceAlt} 100%)`,
        }}
      >
        {impersonation && (
          <ImpersonationBanner
            clientName={impersonation.clientName}
            staffName={impersonation.staffName}
          />
        )}
        {/* Client-side so the title / hero decision stays correct on tab nav
            (the layout doesn't re-render between sibling routes). */}
        <NativeHeader brandName={brand.name} companies={companies} />

        {/* Content clears the fixed tab bar (~64px) + home-indicator inset. */}
        <main
          className="min-w-0"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 64px)" }}
        >
          {children}
        </main>

        <PortalTabBar tabs={tabItems} moreItems={moreItems} isSignedIn={isSignedIn} />
      </div>
    );
  }

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
              primary={toMobile(flatten(primary))}
              secondary={toMobile(flatten(secondary))}
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
                    <Link
                      href="/portal/appointments"
                      className="inline-flex items-center justify-center gap-1 rounded-md bg-[#F97316] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[#EA580C]"
                    >
                      <CalendarDays size={10} /> Book
                    </Link>
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

          {/* Primary nav — five groups. Sub-items reveal only for the group
              you're in, so the rail shows five lines at rest instead of nine. */}
          <nav className="px-3 pt-4 pb-2">
            <ul className="space-y-0.5">
              {primary.map((item) => (
                <li key={item.href}>
                  <NavGroup item={item} activeHref={activeHref} />
                </li>
              ))}
            </ul>

            <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-light/70 mb-2">
              Account
            </p>
            <ul className="space-y-0.5">
              {secondary.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} active={activeHref === item.href} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Compact onboarding progress — persistent wayfinding on every page
              EXCEPT the dashboard, which carries the full journey band. */}
          {progress && !onDashboard && (
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
                          ? "bg-primary"
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

          {/* 4. WHAT'S NEXT REMINDER — suppressed on the dashboard, where the
              hero already is this exact call-to-action at full size. */}
          {nextAction && !onDashboard && (
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

/**
 * A top-level nav group: the parent link, plus its sub-items revealed only
 * while you're inside the group. Collapsed, the parent carries the rolled-up
 * count so nothing hides; expanded, each child carries its own.
 */
function NavGroup({ item, activeHref }: { item: NavItem; activeHref: string }) {
  const children = item.children ?? [];
  const childActive = children.some((c) => c.href === activeHref);
  const open = activeHref === item.href || childActive;
  const rolled = rollUpCount(item);

  return (
    <>
      <NavLink
        item={{
          ...item,
          // Expanded, the children show their own counts — repeating the total
          // on the parent would double-count the same items on one screen.
          notificationCount: open ? item.notificationCount : rolled || undefined,
        }}
        active={activeHref === item.href}
      />
      {open && children.length > 0 && (
        <ul className="mt-0.5 space-y-0.5 border-l border-gray-100 pl-3 ml-5">
          {children.map((c) => (
            <li key={c.href}>
              <NavLink item={c} active={activeHref === c.href} compact />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function NavLink({
  item,
  active,
  compact = false,
}: {
  item: NavItem;
  active: boolean;
  compact?: boolean;
}) {
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
      className={`group relative flex items-center gap-3 rounded-md transition ${
        compact ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-sm"
      } ${
        active
          ? "font-semibold text-primary"
          : compact
            ? "font-medium text-text-light hover:bg-gray-50 hover:text-text"
            : "font-medium text-text hover:bg-gray-50"
      }`}
    >
      {/* 2. Active state: brand-coloured left border, no fill. Sub-items sit
          inside their own rule, so they don't need a second one. */}
      {active && !compact && (
        <span className="absolute left-0 top-2 h-5 w-0.5 rounded-r-full bg-primary" />
      )}
      <Icon
        size={compact ? 15 : 17}
        className={`shrink-0 ${active ? "text-primary" : ""}`}
      />
      <span className="flex-1">{item.label}</span>
      {/* 3. Notification count — teal, not orange. Orange is reserved for the
          one thing that needs the client to act; an unread count is
          information, not an instruction. */}
      {hasNotifications && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-bold text-primary">
          {item.notificationCount! > 99 ? "99+" : item.notificationCount}
        </span>
      )}
    </Link>
  );
}
