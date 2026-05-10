import {
  PartyPopper,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  FileSignature,
  AlertCircle,
} from "lucide-react";
import type { PortalOnboardingStatus } from "@/lib/portal/types";

interface Props {
  status: PortalOnboardingStatus;
  limit?: number;
}

interface ActivityEvent {
  key: string;
  date: Date;
  iso: string;
  title: string;
  detail?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: "success" | "info" | "warn" | "neutral";
}

/**
 * Derived activity feed — built entirely from the existing onboarding status
 * payload. No new API needed. Shows the most recent N events in reverse
 * chronological order so the dashboard ends with momentum.
 */
export default function ActivityTimeline({ status, limit = 7 }: Props) {
  const events = buildEvents(status);
  if (events.length === 0) return null;

  const visible = events.slice(0, limit);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
        <div>
          <h2 className="text-lg font-semibold text-text">Recent activity</h2>
          <p className="text-xs text-text-light mt-0.5">
            What&apos;s happened on your account so far.
          </p>
        </div>
        <span className="text-xs text-text-light/70">
          Showing the last {visible.length}
        </span>
      </div>

      <ol className="relative space-y-4">
        {visible.map((event, idx) => (
          <li
            key={event.key}
            className="relative flex gap-3 animate-fade-in-up"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* connector */}
            {idx < visible.length - 1 && (
              <div
                aria-hidden
                className="absolute left-[15px] top-8 bottom-[-16px] w-px bg-gray-200"
              />
            )}
            <ActivityIcon event={event} />
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <p className="text-sm font-medium text-text leading-snug">{event.title}</p>
                <time className="text-[11px] text-text-light/70 shrink-0 font-medium">
                  {formatRelative(event.date)}
                </time>
              </div>
              {event.detail && (
                <p className="mt-0.5 text-xs text-text-light/85">{event.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ActivityIcon({ event }: { event: ActivityEvent }) {
  const Icon = event.icon;
  const tones = {
    success: "bg-primary/10 text-primary ring-primary/20",
    info: "bg-blue-50 text-blue-600 ring-blue-100",
    warn: "bg-red-50 text-red-600 ring-red-100",
    neutral: "bg-gray-100 text-text-light ring-gray-200",
  };
  return (
    <div
      className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ring-1 ${
        tones[event.tone]
      }`}
    >
      <Icon size={14} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Event derivation — pure function over PortalOnboardingStatus
// ───────────────────────────────────────────────────────────────────────────

function buildEvents(status: PortalOnboardingStatus): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const now = Date.now();

  // 1. Joined the firm
  if (status.joinedDate) {
    events.push({
      key: "joined",
      date: new Date(status.joinedDate),
      iso: status.joinedDate,
      title: `Welcome aboard — you joined ${labelForBrand(status.brand)}`,
      icon: PartyPopper,
      tone: "success",
    });
  }

  // 2. Stage completions (one event per completed stage)
  for (const stage of status.stages) {
    if (stage.state === "complete" && stage.completedDate) {
      events.push({
        key: `stage_complete_${stage.key}`,
        date: new Date(stage.completedDate),
        iso: stage.completedDate,
        title: `${stage.title} complete`,
        detail: stageRecap(stage.key),
        icon: CheckCircle2,
        tone: "success",
      });
    }
  }

  // 3. Currently scheduled stages (future-dated bookings)
  for (const stage of status.stages) {
    if (stage.scheduledDate && stage.state !== "complete") {
      const ms = new Date(stage.scheduledDate).getTime();
      if (!isNaN(ms) && ms > now) {
        events.push({
          key: `stage_booked_${stage.key}`,
          date: new Date(stage.scheduledDate),
          iso: stage.scheduledDate,
          title: `${stage.title} booked`,
          detail: `Confirmed for ${formatLongDate(stage.scheduledDate)}`,
          icon: Calendar,
          tone: "info",
        });
      }
    }
  }

  // 4. Overdue current stage
  for (const stage of status.stages) {
    if (
      stage.state === "current" &&
      stage.isOverdue &&
      stage.dueDate &&
      !stage.scheduledDate
    ) {
      events.push({
        key: `stage_overdue_${stage.key}`,
        date: new Date(stage.dueDate),
        iso: stage.dueDate,
        title: `${stage.title} is overdue`,
        detail: "Book a time to keep things moving.",
        icon: AlertCircle,
        tone: "warn",
      });
    }
  }

  // 5. Completed compliance tasks
  for (const task of status.tasks ?? []) {
    if (task.state === "complete" && task.completedDate) {
      events.push({
        key: `task_complete_${task.key}`,
        date: new Date(task.completedDate),
        iso: task.completedDate,
        title: complianceTitle(task.key, "complete"),
        icon: complianceIcon(task.key),
        tone: "success",
      });
    }
  }

  // Sort newest-first, drop invalid dates
  return events
    .filter((e) => !isNaN(e.date.getTime()))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function complianceTitle(key: string, state: "complete"): string {
  if (key === "engagement_letter") {
    return state === "complete" ? "Engagement letter signed" : "Engagement letter sent";
  }
  if (key === "id_verification") {
    return state === "complete" ? "Identity verified" : "Identity check requested";
  }
  return "Task complete";
}

function complianceIcon(key: string) {
  if (key === "engagement_letter") return FileSignature;
  if (key === "id_verification") return ShieldCheck;
  return CheckCircle2;
}

function stageRecap(key: string): string | undefined {
  switch (key) {
    case "welcome":
      return "You met your accountant.";
    case "main":
      return "We mapped out your business.";
    case "portal":
      return "You're set up with FreeAgent.";
    case "checkin30":
      return "30-day catch-up done.";
    case "checkin60":
      return "60-day check-in done.";
    case "catchup":
      return "Onboarding wrapped up.";
    default:
      return undefined;
  }
}

function labelForBrand(brand: "clever" | "workwell"): string {
  return brand === "workwell" ? "Workwell Accountancy" : "Clever Accounts";
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays > 0 && diffDays <= 7) return `${diffDays}d ago`;
  if (diffDays < 0 && diffDays >= -7) return `in ${Math.abs(diffDays)}d`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
