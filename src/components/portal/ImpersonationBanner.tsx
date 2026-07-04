import { Eye } from "lucide-react";

/**
 * Persistent banner shown while a staff member is "viewing as" a client. Makes
 * the impersonation impossible to miss (amber, sticky, top of viewport) and
 * offers the exit control. Rendered by PortalShell when an impersonation
 * session is active.
 */
export default function ImpersonationBanner({
  clientName,
  staffName,
}: {
  clientName: string;
  staffName: string | null;
}) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-amber-500 px-4 py-2 text-white shadow-sm">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <Eye size={16} className="shrink-0" />
        <span className="truncate">
          Staff view — viewing <strong className="font-semibold">{clientName}</strong>
          {staffName ? ` as ${staffName}` : ""} ·{" "}
          <span className="font-semibold uppercase tracking-wide">read only</span>
        </span>
      </div>
      {/* Full navigation (not next/link): /portal/view-as/exit is a route
          handler that clears the cookie server-side and redirects. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/portal/view-as/exit"
        className="shrink-0 rounded-md bg-white/20 px-3 py-1 text-xs font-semibold transition hover:bg-white/30"
      >
        Exit view-as
      </a>
    </div>
  );
}
