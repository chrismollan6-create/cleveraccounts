import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  Sparkles,
} from "lucide-react";
import type {
  PortalNextActionType,
  PortalOnboardingStatus,
} from "@/lib/portal/types";

interface Props {
  status: PortalOnboardingStatus;
}

interface ActionTheme {
  /** Outer gradient classes for the card background. */
  bg: string;
  /** Headline icon. */
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Eyebrow tag colour. */
  eyebrow: string;
  eyebrowText: string;
  /** Headline copy override (or null = use stage's nextActionLabel). */
  headline: (status: PortalOnboardingStatus) => string;
  /** Sub-copy. */
  body: (status: PortalOnboardingStatus) => string;
  /** CTA: null to hide. */
  cta: ((status: PortalOnboardingStatus) =>
    | { label: string; href: string; external?: boolean }
    | null)
    | null;
}

const THEMES: Record<PortalNextActionType, ActionTheme> = {
  book_call: {
    bg: "bg-gradient-to-br from-primary via-primary-dark to-primary",
    Icon: Calendar,
    eyebrow: "bg-white/20 text-white",
    eyebrowText: "Your next step",
    headline: (s) => `Book your ${s.stageTitle.toLowerCase()}`,
    body: () => "Pick a time that suits you. It'll only take a few minutes to set up.",
    cta: (s) =>
      s.accountant.calendlyUrl
        ? { label: "Choose a time", href: s.accountant.calendlyUrl, external: true }
        : null,
  },
  awaiting_call: {
    bg: "bg-gradient-to-br from-primary-light via-primary to-primary-dark",
    Icon: Coffee,
    eyebrow: "bg-white/20 text-white",
    eyebrowText: "All set",
    headline: (s) => `${s.stageTitle} is on the calendar`,
    body: () =>
      "Nothing else to do for now — you'll get a calendar invite and a reminder before the call.",
    cta: (s) =>
      s.accountant.calendlyUrl
        ? { label: "Need to reschedule?", href: s.accountant.calendlyUrl, external: true }
        : null,
  },
  snoozed: {
    bg: "bg-gradient-to-br from-primary-dark via-primary to-primary-dark",
    Icon: Clock,
    eyebrow: "bg-white/20 text-white",
    eyebrowText: "Paused for now",
    headline: () => "We're waiting on a few things",
    body: () =>
      "Your accountant will be in touch when it's time to pick up. No action needed from you right now.",
    cta: null,
  },
  paused_by_us: {
    bg: "bg-gradient-to-br from-primary-dark via-primary to-primary-dark",
    Icon: Coffee,
    eyebrow: "bg-white/20 text-white",
    eyebrowText: "We've got this",
    headline: () => "Your accountant has paused this step",
    body: () =>
      "We're sorting some things on our side. We'll be back in touch shortly — no action needed from you.",
    cta: null,
  },
  complete: {
    bg: "bg-gradient-to-br from-primary via-primary-dark to-primary",
    Icon: Sparkles,
    eyebrow: "bg-white/20 text-white",
    eyebrowText: "All done",
    headline: () => "Onboarding complete 🎉",
    body: () => "You're fully set up. We're with you for the long haul — anything we can help with, just ask.",
    cta: null,
  },
};

export default function NextActionCard({ status }: Props) {
  const theme = THEMES[status.nextActionType] ?? THEMES.book_call;
  const cta = theme.cta ? theme.cta(status) : null;
  const Icon = theme.Icon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${theme.bg} text-white shadow-lg animate-fade-in-up`}
      style={{ animationDelay: "100ms" }}
    >
      {/* Subtle dot-grid texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      {/* Soft glowing blobs */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />

      <div className="relative p-6 sm:p-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* Left: icon */}
        <div className="flex sm:block">
          <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
            <Icon size={28} className="text-white" />
          </div>
        </div>

        {/* Right: content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${theme.eyebrow}`}
            >
              {status.blockedOn === "client" ? (
                <CheckCircle2 size={12} />
              ) : (
                <Clock size={12} />
              )}
              {theme.eyebrowText}
            </span>
            <span className="text-xs text-white/70">
              Stage {status.stageNumber} of {status.totalStages}
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
            {theme.headline(status)}
          </h2>
          <p className="mt-2 text-white/85 max-w-xl">
            {theme.body(status)}
          </p>

          {cta && (
            <div className="mt-5">
              <a
                href={cta.href}
                {...(cta.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary text-sm font-semibold shadow-md hover:shadow-lg hover:bg-white/95 transition-all group"
              >
                {cta.label}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          )}

          {/* If no CTA, show a calmer reassurance footer */}
          {!cta && (
            <p className="mt-5 text-sm text-white/70">
              We&apos;ll let you know when there&apos;s something for you to do.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
