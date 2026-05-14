import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Calendar,
  HelpCircle,
  Settings,
  ChevronRight,
  ArrowUpRight,
  CircleAlert,
} from "lucide-react";
import { MOCK_STATUS } from "./_mock";

/**
 * PreviewSidebar — the redesigned sidebar mocked for the C2 preview.
 *
 * Four differences vs the live PortalShell:
 *  1. Accountant chip at top (replaces "Encrypted & secure portal" pill)
 *     — small avatar, online dot, reply-time line, inline message/book icons
 *  2. Refined active nav state — left brand-coloured border, no fill
 *  3. Notification badges on Messages / Documents / Appointments
 *     (Documents and Appointments lose their "SOON" tags here — the badges
 *      are the new way to surface "you have things waiting")
 *  4. "What's next" reminder card at bottom replaces the bare user chip
 *     — always-visible nudge so the next action is one click away from
 *     every screen
 *
 * Renders ONLY on /portal/preview/c2 — the live PortalShell stays untouched.
 */

const NAV = [
  { key: "dashboard",    href: "/portal/preview/c2",          icon: LayoutDashboard, label: "Dashboard",    badge: null,      active: true  },
  { key: "messages",     href: "#",                            icon: MessageSquare,   label: "Messages",     badge: 2,         active: false },
  { key: "documents",    href: "#",                            icon: FileText,        label: "Documents",    badge: 1,         active: false },
  { key: "appointments", href: "#",                            icon: Calendar,        label: "Appointments", badge: null,      active: false },
];

const SUPPORT = [
  { key: "help",     href: "#", icon: HelpCircle, label: "Help" },
  { key: "settings", href: "#", icon: Settings,   label: "Settings" },
];

export default function PreviewSidebar({ children }: { children: React.ReactNode }) {
  const s = MOCK_STATUS;
  const a = s.accountant;

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-neutral-200 bg-white lg:flex">
        {/* Logo */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white">
              CA
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Clever Accounts
              </div>
            </div>
          </div>
        </div>

        {/* 1. ACCOUNTANT CHIP — replaces "Encrypted & secure portal" pill */}
        <div className="mx-3 mb-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                {a.photoUrl && (
                  <Image
                    src={a.photoUrl}
                    width={32}
                    height={32}
                    alt={a.name ?? ""}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-50" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-neutral-900">
                  {a.name}
                </div>
                <div className="truncate text-[10px] text-neutral-500">
                  Online · replies in ~2hr
                </div>
              </div>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-1">
              <button
                className="inline-flex items-center justify-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-blue-700"
                title="Book a call"
              >
                <Calendar size={10} /> Book
              </button>
              <button
                className="inline-flex items-center justify-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700 hover:border-neutral-400"
                title="Send a message"
              >
                <MessageSquare size={10} /> Message
              </button>
            </div>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3">
            <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Your account
            </div>
            <nav className="space-y-0.5">
              {NAV.map((item) => (
                <NavItem key={item.key} {...item} />
              ))}
            </nav>
          </div>

          <div className="mt-6 px-3">
            <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Support
            </div>
            <nav className="space-y-0.5">
              {SUPPORT.map((item) => (
                <NavItem key={item.key} {...item} active={false} badge={null} />
              ))}
            </nav>
          </div>
        </div>

        {/* 4. "WHAT'S NEXT" REMINDER — replaces bare user chip */}
        <div className="border-t border-neutral-200 p-3">
          <Link
            href={a.calendlyUrl ?? "#"}
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
            <div className="mt-2 text-xs font-semibold leading-tight text-neutral-900">
              Book your portal training
            </div>
            <div className="mt-0.5 text-[10px] text-neutral-600">
              36 days overdue · 30 min
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              Book now
              <ArrowUpRight
                size={11}
                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </Link>
        </div>

        {/* Tiny user line at the very bottom */}
        <div className="border-t border-neutral-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                CM
              </div>
              <span className="text-xs text-neutral-700">Chris Mollan</span>
            </div>
            <ChevronRight size={12} className="text-neutral-400" />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  badge,
  active,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  badge: number | null;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition ${
        active
          ? "font-semibold text-blue-700"
          : "font-medium text-neutral-700 hover:bg-neutral-100"
      }`}
    >
      {/* 2. Active state: left brand-coloured border */}
      {active && (
        <span className="absolute left-0 top-1.5 h-5 w-0.5 rounded-r-full bg-blue-600" />
      )}
      <Icon
        size={15}
        className={active ? "text-blue-600" : "text-neutral-500"}
      />
      <span className="flex-1">{label}</span>
      {/* 3. Notification badge */}
      {badge && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
