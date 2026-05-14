import {
  FileText,
  ShieldCheck,
  ArrowRight,
  Check,
  Clock,
  Hourglass,
  CircleDashed,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import type { PortalTask, PortalTaskState } from "@/lib/portal/types";

interface Props {
  tasks: PortalTask[];
}

/**
 * "Things to complete" — compliance + admin tasks the client needs to do
 * (or sometimes wait on us for). Shown prominently because these typically
 * BLOCK their accountant from acting on their behalf with HMRC.
 *
 * Auto-collapses to a quiet "all done" line once everything is complete.
 */
export default function TasksPanel({ tasks }: Props) {
  if (tasks.length === 0) return null;

  const pending = tasks.filter((t) => t.state !== "complete");
  const allComplete = pending.length === 0;

  if (allComplete) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-teal-50/50 border border-emerald-100 p-5 sm:p-6"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.08) 1px, transparent 0), linear-gradient(135deg, rgb(236 253 245), rgb(204 251 241 / 0.5))",
          backgroundSize: "16px 16px, auto",
        }}
      >
        <Sparkles
          className="absolute top-4 right-4 text-emerald-300"
          size={18}
          aria-hidden
        />
        <PartyPopper
          className="absolute bottom-4 right-10 text-emerald-200"
          size={24}
          aria-hidden
        />
        <div className="relative flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-md shrink-0 ring-4 ring-white/50">
            <Check size={22} strokeWidth={3} />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="font-semibold text-emerald-900 text-base">
              All your compliance is sorted ✨
            </h3>
            <p className="mt-1 text-sm text-emerald-800/80 max-w-md">
              Engagement letter signed, identity verified — everything formal is taken
              care of. Now you can focus on what really matters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const urgentCount = pending.filter((t) => t.isUrgent).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 sm:px-7 pt-6 pb-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-text">Things to complete</h2>
            <p className="text-xs text-text-light mt-0.5">
              {urgentCount > 0
                ? "Quick formalities that unlock the rest of your onboarding."
                : "A few admin items in progress — we'll let you know if you need to act."}
            </p>
          </div>
          {urgentCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-dark text-xs font-semibold">
              <Hourglass size={11} />
              {urgentCount} pending
            </span>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-7 pb-6 grid gap-3 sm:grid-cols-2">
        {tasks.map((task, idx) => (
          <TaskCard key={task.key} task={task} delay={idx * 60} />
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: PortalTask;
  delay: number;
}

function TaskCard({ task, delay }: TaskCardProps) {
  const Icon = taskIcon(task.key);
  const tone = stateTone(task.state, task.isUrgent);

  return (
    <div
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all ${tone.cardBg} ${tone.cardBorder} ${tone.hover}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${tone.iconBg}`}
        >
          <Icon size={18} className={tone.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className={`text-sm font-semibold ${tone.titleColor}`}>{task.title}</h3>
            <StateBadge state={task.state} isUrgent={task.isUrgent} />
          </div>
          <p className={`mt-1 text-xs leading-relaxed ${tone.descColor}`}>
            {task.description}
          </p>

          {task.state === "complete" && task.completedDate && (
            <p className="mt-2 text-[11px] text-emerald-700/80 font-medium">
              Verified {formatShortDate(task.completedDate)}
            </p>
          )}

          {(task.actionUrl || task.actionLabel) && task.state !== "complete" && (
            <div className="mt-3">
              {task.actionUrl ? (
                <a
                  href={task.actionUrl}
                  {...(task.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tone.ctaBg} ${tone.ctaHover}`}
                >
                  {task.actionLabel ?? "Open"}
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-text-light cursor-default">
                  {task.actionLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StateBadge({ state, isUrgent }: { state: PortalTaskState; isUrgent: boolean }) {
  switch (state) {
    case "complete":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          <Check size={10} strokeWidth={3} />
          Done
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
          <Clock size={10} />
          Started
        </span>
      );
    case "awaiting_us":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
          <CircleDashed size={10} />
          With us
        </span>
      );
    case "pending":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isUrgent ? "bg-secondary text-white" : "bg-gray-100 text-text-light"
          }`}
        >
          <Hourglass size={10} />
          {isUrgent ? "Action needed" : "To do"}
        </span>
      );
  }
}

interface ToneSet {
  cardBg: string;
  cardBorder: string;
  hover: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  descColor: string;
  ctaBg: string;
  ctaHover: string;
}

function stateTone(state: PortalTaskState, isUrgent: boolean): ToneSet {
  if (state === "complete") {
    return {
      cardBg: "bg-emerald-50/40",
      cardBorder: "border-emerald-100",
      hover: "",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      titleColor: "text-emerald-900",
      descColor: "text-emerald-800/80",
      ctaBg: "",
      ctaHover: "",
    };
  }
  if (state === "in_progress") {
    return {
      cardBg: "bg-amber-50/30",
      cardBorder: "border-amber-100",
      hover: "hover:border-amber-200 hover:shadow-sm",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      titleColor: "text-text",
      descColor: "text-text-light",
      ctaBg: "bg-secondary text-white shadow-sm",
      ctaHover: "hover:bg-secondary-dark",
    };
  }
  if (state === "awaiting_us") {
    return {
      cardBg: "bg-blue-50/30",
      cardBorder: "border-blue-100",
      hover: "",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-text",
      descColor: "text-text-light",
      ctaBg: "",
      ctaHover: "",
    };
  }
  // pending
  return {
    cardBg: isUrgent ? "bg-secondary/[0.04]" : "bg-white",
    cardBorder: isUrgent ? "border-secondary/30" : "border-gray-100",
    hover: "hover:border-primary/30 hover:shadow-sm",
    iconBg: isUrgent ? "bg-secondary/15" : "bg-gray-50",
    iconColor: isUrgent ? "text-secondary-dark" : "text-text-light",
    titleColor: "text-text",
    descColor: "text-text-light",
    ctaBg: "bg-primary text-white shadow-sm",
    ctaHover: "hover:bg-primary-dark",
  };
}

function taskIcon(key: string) {
  switch (key) {
    case "engagement_letter":
      return FileText;
    case "id_verification":
      return ShieldCheck;
    default:
      return CircleDashed;
  }
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
