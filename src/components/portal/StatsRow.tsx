import {
  CalendarClock,
  Sparkles,
  ChartNoAxesCombined,
  CheckCheck,
  AlertCircle,
} from "lucide-react";
import type { PortalOnboardingStatus } from "@/lib/portal/types";

interface Props {
  status: PortalOnboardingStatus;
}

/**
 * Small grid of headline numbers that anchor the dashboard. Each card uses
 * brand tones so the row reads as one cohesive band, but each metric stays
 * scannable at a glance.
 */
export default function StatsRow({ status }: Props) {
  const completed = status.stages.filter((s) => s.state === "complete").length;
  const total = status.totalStages;
  const pct = Math.round((completed / Math.max(total, 1)) * 100);

  // "Next milestone" logic. We never want to display a past date here — that
  // would mis-frame an overdue step as if it's coming up.
  //   - If a stage is BOOKED in the future → that future date is the milestone.
  //   - Else if the stage has a due date IN THE FUTURE → show it.
  //   - Else if the stage is overdue → show how overdue.
  //   - Else fall back to a friendly status ("Awaiting you" / "On track").
  const nextMilestone = computeNextMilestone(status);

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={ChartNoAxesCombined}
        label="Progress"
        value={`${pct}%`}
        helper={`${completed} of ${total} steps`}
        tone="primary"
        delay={0}
      />
      <StatCard
        icon={Sparkles}
        label="Current step"
        value={`${status.stageNumber} of ${total}`}
        helper={status.stageTitle}
        tone="secondary"
        delay={60}
      />
      <StatCard
        icon={CalendarClock}
        label="With us since"
        value={status.joinedDate ? formatJoinedShort(status.joinedDate) : "—"}
        helper={status.joinedDate ? `${status.daysSinceSignup} days in` : ""}
        tone="muted"
        delay={120}
      />
      <StatCard
        icon={nextMilestone.tone === "warn" ? AlertCircle : CheckCheck}
        label={nextMilestone.label}
        value={nextMilestone.value}
        helper={nextMilestone.helper}
        tone={nextMilestone.tone === "warn" ? "warn" : "muted"}
        delay={180}
      />
    </div>
  );
}

interface NextMilestone {
  label: string;
  value: string;
  helper: string;
  tone: "muted" | "warn";
}

function computeNextMilestone(status: PortalOnboardingStatus): NextMilestone {
  const scheduled = status.currentStageScheduled;
  const due = status.currentStageDue;
  const now = Date.now();

  if (scheduled) {
    const scheduledMs = new Date(scheduled).getTime();
    if (!isNaN(scheduledMs) && scheduledMs > now) {
      return {
        label: "Next call",
        value: formatRelativeShort(scheduled),
        helper: formatLongDate(scheduled),
        tone: "muted",
      };
    }
  }

  if (due) {
    const dueMs = new Date(due).getTime();
    if (!isNaN(dueMs)) {
      if (dueMs > now) {
        return {
          label: "Due by",
          value: formatRelativeShort(due),
          helper: formatLongDate(due),
          tone: "muted",
        };
      }
      // Overdue
      const days = Math.round((now - dueMs) / (1000 * 60 * 60 * 24));
      return {
        label: "Action needed",
        value: days <= 1 ? "Today" : `${days} days late`,
        helper: "Book to keep things moving",
        tone: "warn",
      };
    }
  }

  if (status.isComplete) {
    return { label: "Status", value: "All set", helper: "Onboarding complete", tone: "muted" };
  }

  return {
    label: "Status",
    value: status.blockedOn === "client" ? "Awaiting you" : "On track",
    helper: status.blockedOn === "client" ? "Pick a time when you can" : "We're on it",
    tone: "muted",
  };
}

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  helper: string;
  tone: "primary" | "secondary" | "muted" | "warn";
  delay: number;
}

function StatCard({ icon: Icon, label, value, helper, tone, delay }: StatCardProps) {
  const tones = {
    primary: { iconBg: "bg-primary/10", iconColor: "text-primary" },
    secondary: { iconBg: "bg-secondary/10", iconColor: "text-secondary-dark" },
    muted: { iconBg: "bg-gray-100", iconColor: "text-text-light" },
    warn: { iconBg: "bg-red-50", iconColor: "text-red-600" },
  }[tone];

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-gray-200 transition-all"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-light/80">
          {label}
        </p>
        <div className={`h-8 w-8 rounded-lg ${tones.iconBg} flex items-center justify-center`}>
          <Icon size={15} className={tones.iconColor} />
        </div>
      </div>
      <p
        className={`mt-3 text-2xl font-bold leading-none tracking-tight ${
          tone === "warn" ? "text-red-700" : "text-text"
        }`}
      >
        {value}
      </p>
      {helper && <p className="mt-1.5 text-xs text-text-light truncate">{helper}</p>}
    </div>
  );
}

function formatRelativeShort(iso: string): string {
  const target = new Date(iso);
  const now = new Date();
  if (isNaN(target.getTime())) return iso;
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return target.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Compact "30 Mar 2026" style. */
function formatJoinedShort(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
