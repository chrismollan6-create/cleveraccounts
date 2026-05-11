import { FileSignature, CheckCircle2, ArrowRight, Eye } from "lucide-react";
import type { PortalEngagementLetter } from "@/lib/portal/types";

interface Props {
  letter: PortalEngagementLetter;
}

/**
 * Engagement letter status card, slotted into the Messages list. Adapts
 * tone to the EL state — "Sign now" if unsigned, "View signed copy" if done.
 *
 * Note: in-portal signing isn't wired yet (the Apex /sign endpoint returns
 * 501). For now the unsigned CTA links to the existing public token URL,
 * which is what's already in the welcome email. After Phase 1.5, this
 * becomes a fully in-portal flow.
 */
export default function EngagementLetterInline({ letter }: Props) {
  if (letter.status === "Signed") {
    return (
      <div className="bg-emerald-50/70 rounded-2xl border border-emerald-100 p-5 sm:p-6 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-11 w-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-emerald-900">
              Engagement letter signed
            </h3>
            <p className="mt-0.5 text-sm text-emerald-800/85">
              {letter.signedDate
                ? `Signed ${formatDate(letter.signedDate)}.`
                : "All formal terms agreed."}{" "}
              We&apos;ve got a copy on file.
            </p>
            {letter.pdfReady && letter.token && (
              <a
                href={`/api/engagement-letter/pdf?t=${letter.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                <Eye size={14} />
                Download signed copy
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Unsigned / Sent / Viewed states
  const isViewed = letter.status === "Viewed";
  return (
    <div className="bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl p-5 sm:p-6 shadow-lg animate-fade-in-up relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <div className="shrink-0 h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
          <FileSignature size={22} />
        </div>
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
            Action needed
          </span>
          <h3 className="mt-2 text-lg font-semibold">
            {isViewed
              ? "Finish signing your engagement letter"
              : "Sign your engagement letter"}
          </h3>
          <p className="mt-1 text-sm text-white/85 max-w-xl">
            Our formal terms — required so we can act on your behalf with HMRC.
            Takes 60 seconds.
          </p>
          {letter.token && (
            <a
              href={`/engagement-letter/${letter.token}`}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary text-sm font-semibold shadow-sm hover:shadow-md transition-all group"
            >
              {isViewed ? "Continue signing" : "Open and sign"}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
