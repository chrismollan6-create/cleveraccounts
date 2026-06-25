import { getApprovalsForCurrentUser } from "./approvals";
import { getDocumentsForCurrentUser } from "./documents";
import { getDeadlinesForCurrentUser } from "./deadlines";
import { getOnboardingForCurrentUser, isOnboardingError } from "./onboarding";
import { isSurfaceHidden } from "./features";
import type { PortalActionItem } from "./types";

/**
 * Aggregates everything currently blocked on the CLIENT across the portal —
 * pending approvals, requested documents, and deadlines that need them — into
 * one prioritised list for the dashboard "Needs you" hub.
 *
 * Composes the existing scoped read helpers (each already goes through
 * withPortalScope), so there's no new query surface or IDOR risk. Returns an
 * empty array if not signed in / scope denied — the dashboard handles auth.
 */

function daysUntil(due: string | null): number | null {
  if (!due) return null;
  const d = new Date(due);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

function urgencyFor(due: string | null, overdue = false): PortalActionItem["urgency"] {
  if (overdue) return "overdue";
  const n = daysUntil(due);
  if (n == null) return "normal";
  if (n < 0) return "overdue";
  if (n <= 14) return "soon";
  return "normal";
}

export async function getActionItemsForCurrentUser(): Promise<PortalActionItem[]> {
  const [appr, docs, dl, onb] = await Promise.all([
    getApprovalsForCurrentUser(),
    getDocumentsForCurrentUser(),
    getDeadlinesForCurrentUser(),
    getOnboardingForCurrentUser(),
  ]);

  const items: PortalActionItem[] = [];

  // Kinds with an open approval — used to suppress the duplicate deadline row
  // (a VAT return shows ONCE, as the approval, not also as a deadline).
  const approvedKinds = new Set<string>();

  if (appr.ok && !isSurfaceHidden("/portal/approvals")) {
    for (const a of appr.data) {
      if (a.status !== "pending") continue;
      approvedKinds.add(a.kind);
      items.push({
        id: `approval:${a.id}`,
        type: "approval",
        title: a.title,
        detail: a.amountLabel ?? "Ready to review & approve",
        href: "/portal/approvals",
        dueDate: a.dueDate,
        urgency: urgencyFor(a.dueDate),
      });
    }
  }

  // Onboarding tasks the CLIENT must action (not awaiting-us, not complete) —
  // e.g. "Verify your identity". The onboarding next-step (book the call) stays
  // in the hero, so it isn't duplicated here.
  if (!isOnboardingError(onb) && onb.data) {
    for (const t of onb.data.tasks ?? []) {
      if (t.state === "complete" || t.state === "awaiting_us") continue;
      items.push({
        id: `task:${t.key}`,
        type: "task",
        title: t.title,
        detail: t.actionLabel ?? t.description ?? null,
        href: t.actionUrl ?? "/portal/documents",
        dueDate: null,
        urgency: t.isUrgent ? "soon" : "normal",
      });
    }
  }

  if (docs.ok && !isSurfaceHidden("/portal/documents")) {
    for (const d of docs.data.requests) {
      if (d.status !== "requested") continue;
      items.push({
        id: `document:${d.id}`,
        type: "document",
        title: `Upload ${d.name}`,
        detail: "We need this from you",
        href: "/portal/documents",
        dueDate: d.dueDate,
        urgency: urgencyFor(d.dueDate),
      });
    }
  }

  if (dl.ok) {
    for (const d of dl.data) {
      const needsClient =
        d.status === "overdue" ||
        (d.status === "due_soon" && d.blockedOn === "client");
      if (!needsClient) continue;
      // Already represented as an approval (e.g. the VAT return) → don't repeat.
      if (approvedKinds.has(d.kind)) continue;
      items.push({
        id: `deadline:${d.id}`,
        type: "deadline",
        title: d.title,
        detail: d.periodLabel,
        href: "/portal/deadlines",
        dueDate: d.dueDate,
        urgency: urgencyFor(d.dueDate, d.status === "overdue"),
      });
    }
  }

  // Overdue first, then soonest due date (no-date items last).
  const rank = { overdue: 0, soon: 1, normal: 2 };
  items.sort((a, b) => {
    if (rank[a.urgency] !== rank[b.urgency]) return rank[a.urgency] - rank[b.urgency];
    const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return da - db;
  });

  return items;
}
