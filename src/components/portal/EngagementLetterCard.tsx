import { FileText, ArrowRight } from "lucide-react";

/**
 * Phase 1 placeholder. Will be replaced by a real component once the
 * `/api/portal/engagement-letter` endpoint exists, but we still want a
 * card that looks polished rather than a "coming soon" text dump.
 */
export default function EngagementLetterCard() {
  return (
    <div
      className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden"
      style={{ animationDelay: "150ms" }}
    >
      {/* Subtle decorative motif */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text">Engagement letter</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-text-light text-[10px] font-semibold uppercase tracking-wider">
                Soon
              </span>
            </div>
            <p className="mt-1 text-xs text-text-light leading-relaxed">
              Your signed engagement letter will live here for download whenever you need it.
            </p>
          </div>
        </div>

        <button
          disabled
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-gray-200 text-xs font-medium text-text-light/70 cursor-not-allowed"
        >
          View letter
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
