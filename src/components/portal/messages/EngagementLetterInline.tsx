import { FileSignature, ArrowRight } from "lucide-react";
import type { PortalEngagementLetter } from "@/lib/portal/types";

interface Props {
  letter: PortalEngagementLetter;
}

/**
 * Engagement letter status card, slotted into the Messages list ABOVE the
 * conversation thread. Renders only for unsigned states (Sent / Viewed) —
 * once signed, the conversation is the focus and we surface a compact
 * "EL signed" confirmation in the right sidebar instead (see
 * MessagesSidePanel.EngagementLetterStatus).
 *
 * Note: in-portal signing isn't wired yet (the Apex /sign endpoint returns
 * 501). For now the unsigned CTA links to the existing public token URL,
 * which is what's already in the welcome email. After Phase 1.5, this
 * becomes a fully in-portal flow.
 */
export default function EngagementLetterInline({ letter }: Props) {
  // Signed letters live in the sidebar — don't compete with the thread
  if (letter.status === "Signed") return null;

  // Unsigned / Sent / Viewed states
  const isViewed = letter.status === "Viewed";
  return (
    <div className="bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
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

