import { Mail, Calendar, MessageCircle, ShieldCheck } from "lucide-react";
import type { PortalAccountantInfo } from "@/lib/portal/types";

interface Props {
  accountant: PortalAccountantInfo;
  brandName: string;
}

/**
 * Accountant card. Photo prominence + clear CTA. The "your accountant has
 * a face" moment that builds long-term portal stickiness.
 *
 * Note: we don't render `accountant.photoUrl` directly because Salesforce
 * profile photos require an auth'd session to fetch — the `<img>` would
 * fail silently. Instead we always render a high-quality initials avatar.
 * (Future: build /api/portal/accountant-photo proxy that fetches with the
 * Connected App token.)
 */
export default function AccountantCard({ accountant, brandName }: Props) {
  const displayName = accountant.name ?? "Your accountant";
  const initials = computeInitials(accountant.name);
  const calendlyHref = accountant.calendlyUrl ?? null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Decorative gradient header with subtle dot pattern */}
      <div
        className="relative h-24 bg-gradient-to-br from-primary-light via-primary to-primary-dark overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "16px 16px, auto",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-light via-primary to-primary-dark opacity-90"
          aria-hidden
        />
        <div
          className="absolute -top-16 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute top-2 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20"
          aria-hidden
        >
          <ShieldCheck size={10} />
          Verified
        </div>
      </div>

      {/* Avatar overlapping the gradient */}
      <div className="px-6 pb-6 -mt-14">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-full ring-4 ring-white shadow-lg bg-gradient-to-br from-primary-light to-primary-dark text-white text-3xl font-bold flex items-center justify-center">
              {initials}
            </div>
            {/* Online indicator */}
            <span
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white"
              aria-label="Active"
              title="Available"
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              Your accountant
            </p>
            <h3 className="mt-1 text-xl font-semibold text-text">{displayName}</h3>
            <p className="mt-0.5 text-xs text-text-light">at {brandName}</p>
          </div>

          {accountant.email && (
            <a
              href={`mailto:${accountant.email}`}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs text-text-light hover:bg-primary/5 hover:text-primary transition-colors group"
            >
              <Mail
                size={12}
                className="text-text-light group-hover:text-primary transition-colors"
              />
              <span className="truncate max-w-[14rem]">{accountant.email}</span>
            </a>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-6 space-y-2.5">
          {calendlyHref ? (
            <a
              href={calendlyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-dark hover:shadow-md transition-all group"
            >
              <Calendar size={16} className="transition-transform group-hover:-rotate-6" />
              Book a call
            </a>
          ) : (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
            >
              <Calendar size={16} />
              Booking unavailable
            </button>
          )}
          <button
            disabled
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-text-light text-sm font-medium hover:border-primary/30 hover:text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            title="Coming soon — secure messaging with your accountant"
          >
            <MessageCircle size={16} />
            Send a message
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-text-light/60">
              Soon
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function computeInitials(name: string | null): string {
  if (!name) return "··";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
