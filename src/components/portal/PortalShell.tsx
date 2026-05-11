import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  MessageCircle,
  Settings,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import type { BrandConfig } from "@/lib/constants";
import MobileNav, { type MobileNavItem } from "./MobileNav";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  /** Small text badge ("Soon", "Beta", etc.) — shown on disabled items. */
  badge?: string;
  /** Notification count — shown as a red dot+number on active items. */
  notificationCount?: number;
}

interface Props {
  brand: BrandConfig;
  activeHref: string;
  isSignedIn: boolean;
  /** Notification counts keyed by nav href so the layout can drive badges from real data. */
  notifications?: Partial<Record<string, number>>;
  children: React.ReactNode;
}

const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Messages", href: "/portal/messages", icon: MessageCircle },
  { label: "Documents", href: "/portal/documents", icon: FileText, disabled: true, badge: "Soon" },
  { label: "Appointments", href: "/portal/appointments", icon: CalendarDays, disabled: true, badge: "Soon" },
];

const SECONDARY_NAV: NavItem[] = [
  { label: "Help", href: "/portal/help", icon: HelpCircle, disabled: true },
  { label: "Settings", href: "/portal/settings", icon: Settings, disabled: true },
];

function applyNotifications(
  items: NavItem[],
  notifications?: Partial<Record<string, number>>
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

/**
 * Convert the desktop NavItem (with icon component) into the mobile shape
 * (with pre-rendered icon node). Mobile nav lives in a client component, so
 * passing a component class would force the whole shell client-side.
 */
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
 * Portal application shell. Sidebar + main content area, mobile-responsive.
 */
export default function PortalShell({
  brand,
  activeHref,
  isSignedIn,
  notifications,
  children,
}: Props) {
  const primary = applyNotifications(PRIMARY_NAV, notifications);
  const secondary = applyNotifications(SECONDARY_NAV, notifications);

  const userButton = isSignedIn ? (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/50 hover:bg-gray-100/70 transition-colors">
      <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} showName />
    </div>
  ) : (
    <Link
      href="/portal/sign-in"
      className="block px-3 py-2.5 text-sm font-semibold text-primary hover:text-primary-dark"
    >
      Sign in
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface-alt/50">
      {/* Mobile top bar (hidden on lg+) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-3 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MobileNav
              brand={brand}
              primary={toMobile(primary)}
              secondary={toMobile(secondary)}
              activeHref={activeHref}
              footerSlot={userButton}
            />
            <Link
              href="/portal/dashboard"
              aria-label={`${brand.name} portal home`}
              className="ml-1"
            >
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
            <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck size={10} />
              Secure
            </span>
            {isSignedIn && <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />}
          </div>
        </div>
      </header>

      <div className="lg:flex">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-white border-r border-gray-100 z-30">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-50">
            <Link
              href="/portal/dashboard"
              aria-label={`${brand.name} portal home`}
              className="flex items-center"
            >
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

          {/* Trust pill */}
          <div className="px-4 pt-5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
              <ShieldCheck size={14} className="text-primary shrink-0" />
              <span className="text-xs font-medium text-primary">
                Encrypted &amp; secure portal
              </span>
            </div>
          </div>

          {/* Primary nav */}
          <nav className="flex-1 px-3 pt-4 pb-2">
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

          {/* User chip */}
          <div className="p-3 border-t border-gray-50">
            {userButton}
            <p className="mt-2 px-3 text-[10px] text-text-light/70">
              © {new Date().getFullYear()} {brand.legalName}
            </p>
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
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-text-light/60 cursor-not-allowed"
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
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all relative ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-text hover:bg-gray-50 hover:text-primary"
      }`}
    >
      <Icon size={17} className="shrink-0" />
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
