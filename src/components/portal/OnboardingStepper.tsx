import {
  PhoneCall,
  Users,
  GraduationCap,
  ClipboardCheck,
  ClipboardList,
  Trophy,
  Check,
  Calendar,
  Clock,
  AlertCircle,
  Sparkles,
  Timer,
  ListChecks,
} from "lucide-react";
import type { PortalStageInfo, PortalStageKey } from "@/lib/portal/types";
import { STAGE_CONTENT } from "@/lib/portal/stage-content";

interface Props {
  stages: PortalStageInfo[];
}

/**
 * Vertical onboarding journey. Each stage has three visual states with
 * different indicators, badges, and motion. The connector line between
 * stages adapts (solid/brand for completed segments, dashed/grey upcoming).
 */
export default function OnboardingStepper({ stages }: Props) {
  const completedCount = stages.filter((s) => s.state === "complete").length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-2">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-text">Your onboarding journey</h2>
            <p className="text-xs text-text-light mt-0.5">
              Six steps to get you fully settled with us.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {completedCount} of {stages.length} complete
          </span>
        </div>
      </div>

      <div className="px-6 sm:px-8 pt-4 pb-7">
        <ol className="relative">
          {stages.map((stage, idx) => {
            const isLast = idx === stages.length - 1;
            return (
              <li
                key={stage.key}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Connector line */}
                {!isLast && <Connector connectorComplete={stage.state === "complete"} />}
                <StageRow stage={stage} isLast={isLast} />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Connector({ connectorComplete }: { connectorComplete: boolean }) {
  if (connectorComplete) {
    return (
      <div
        aria-hidden
        className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 to-primary/30"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="absolute left-[24px] top-12 bottom-0 border-l-2 border-dashed border-gray-200"
    />
  );
}

interface StageRowProps {
  stage: PortalStageInfo;
  isLast: boolean;
}

function StageRow({ stage, isLast }: StageRowProps) {
  const showDetails = stage.state === "current";
  const Icon = stageIcon(stage.key);
  const content = stage.key !== "complete" ? STAGE_CONTENT[stage.key] : null;

  return (
    <div className={`flex gap-4 ${isLast ? "pb-0" : "pb-7"}`}>
      <StageIndicator stage={stage} icon={Icon} />

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h3
            className={`text-base font-semibold transition-colors ${
              stage.state === "upcoming" ? "text-text-light" : "text-text"
            }`}
          >
            {stage.title}
          </h3>
          <StageBadge stage={stage} />
        </div>

        {/* Tagline (the "sell" line) — shown for current + upcoming */}
        {content && stage.state !== "complete" && (
          <p
            className={`mt-0.5 text-xs font-medium ${
              stage.state === "current" ? "text-primary" : "text-text-light/80"
            }`}
          >
            {content.tagline}
          </p>
        )}

        <div className="mt-1.5 text-sm text-text-light">
          {stage.state === "complete" && (
            <CompletedStageRecap stage={stage} content={content} />
          )}
          {stage.state === "current" && <CurrentStageDetail stage={stage} />}
          {stage.state === "upcoming" && content && (
            <UpcomingStageMeta content={content} />
          )}
        </div>

        {showDetails && content && <CurrentStagePanel stage={stage} content={content} />}
      </div>
    </div>
  );
}

function CompletedStageRecap({
  stage,
  content,
}: {
  stage: PortalStageInfo;
  content: ReturnType<typeof getContent>;
}) {
  return (
    <span>
      {stage.completedDate ? (
        <>Completed {formatShortDate(stage.completedDate)}</>
      ) : (
        <>Done</>
      )}
      {content?.completedRecap && (
        <span className="text-text-light/70"> — {content.completedRecap}</span>
      )}
    </span>
  );
}

function UpcomingStageMeta({ content }: { content: NonNullable<ReturnType<typeof getContent>> }) {
  return (
    <span className="text-text-light/80">
      {content.upcomingTeaser}
      <span className="ml-1.5 inline-flex items-center gap-1 text-text-light/60">
        <Timer size={11} className="inline" />
        {content.duration}
      </span>
    </span>
  );
}

/** Helper so TS infers the right type for the optional content prop. */
function getContent(key: PortalStageKey) {
  if (key === "complete") return null;
  return STAGE_CONTENT[key];
}

interface CurrentStagePanelProps {
  stage: PortalStageInfo;
  content: NonNullable<ReturnType<typeof getContent>>;
}

function CurrentStagePanel({ stage, content }: CurrentStagePanelProps) {
  return (
    <div className="mt-4 rounded-2xl bg-gradient-to-br from-surface to-surface-alt/40 border border-primary/10 p-5 sm:p-6 space-y-5 animate-fade-in-up">
      {/* Why this matters */}
      <div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          <Sparkles size={11} />
          Why this matters
        </p>
        <p className="mt-1.5 text-sm text-text leading-relaxed">{content.whyMatters}</p>
      </div>

      {/* What happens */}
      <div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          <ListChecks size={11} />
          What happens
        </p>
        <p className="mt-1.5 text-sm text-text-light leading-relaxed">
          {content.whatHappens}
        </p>
      </div>

      {/* What you'll walk away with */}
      <div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          <Check size={11} strokeWidth={3} />
          What you&apos;ll walk away with
        </p>
        <ul className="mt-2 space-y-1.5">
          {content.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={3} />
              <span className="text-text">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer pills */}
      <div className="pt-3 border-t border-primary/10 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-text-light">
          <Timer size={11} />
          {content.duration}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-text-light">
          <ClipboardCheck size={11} />
          {content.prep}
        </span>
        {stage.scheduledDate && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
            <Calendar size={11} />
            Booked {formatLongDateTime(stage.scheduledDate)}
          </span>
        )}
      </div>
    </div>
  );
}

function StageIndicator({
  stage,
  icon: Icon,
}: {
  stage: PortalStageInfo;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  if (stage.state === "complete") {
    return (
      <div className="relative shrink-0">
        <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
          <Check size={20} strokeWidth={3} />
        </div>
      </div>
    );
  }

  if (stage.state === "current") {
    return (
      <div className="relative shrink-0">
        <div className="relative h-12 w-12 rounded-full bg-secondary text-white flex items-center justify-center shadow-md ring-[6px] ring-secondary/15">
          <Icon size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <div className="h-12 w-12 rounded-full bg-white text-text-light/70 border-2 border-dashed border-gray-200 flex items-center justify-center font-semibold text-sm">
        {stage.stageNumber}
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: PortalStageInfo }) {
  if (stage.state === "complete") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
        <Check size={11} strokeWidth={3} />
        Done
      </span>
    );
  }
  if (stage.state === "current") {
    if (stage.isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-medium">
          <AlertCircle size={11} />
          Action needed
        </span>
      );
    }
    if (stage.scheduledDate) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Calendar size={11} />
          Booked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-white text-xs font-medium shadow-sm">
        <Clock size={11} />
        Up next
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-gray-50 text-text-light/80 text-xs font-medium">
      Coming up
    </span>
  );
}

function CurrentStageDetail({ stage }: { stage: PortalStageInfo }) {
  if (stage.scheduledDate) {
    return (
      <span>
        Booked for{" "}
        <span className="text-text font-medium">{formatLongDateTime(stage.scheduledDate)}</span>
      </span>
    );
  }
  if (stage.isOverdue) {
    return (
      <span className="text-red-700">
        Let&apos;s get this back on track — book a time to keep things moving.
      </span>
    );
  }
  if (stage.dueDate) {
    return (
      <span>
        Due by <span className="text-text font-medium">{formatLongDate(stage.dueDate)}</span>
      </span>
    );
  }
  return <span>Ready when you are.</span>;
}

// ───────────────────────────────────────────────────────────────────────────
// Stage metadata helpers
// ───────────────────────────────────────────────────────────────────────────

function stageIcon(key: PortalStageKey) {
  switch (key) {
    case "welcome":
      return PhoneCall;
    case "main":
      return Users;
    case "portal":
      return GraduationCap;
    case "checkin30":
      return ClipboardCheck;
    case "checkin60":
      return ClipboardList;
    case "catchup":
      return Trophy;
    default:
      return Check;
  }
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function formatLongDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
