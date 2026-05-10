/**
 * TypeScript mirrors of the Apex DTOs returned by the portal REST endpoints.
 *
 * Keep these in sync with `force-app/main/default/classes/CommandCentreOnboardingService.cls`
 * (the `PortalOnboardingStatus`, `PortalStageInfo`, `PortalAccountantInfo` inner classes).
 *
 * Apex JSON serialization conventions used here:
 *   - Salesforce Id  →  string (18-char canonical form)
 *   - Date           →  string in 'YYYY-MM-DD' (no timezone)
 *   - DateTime       →  string in ISO 8601 ('YYYY-MM-DDTHH:mm:ss.sssZ')
 *   - null           →  null (not omitted — Apex keeps the key)
 */

export type PortalStageKey =
  | "welcome"
  | "main"
  | "portal"
  | "checkin30"
  | "checkin60"
  | "catchup"
  | "complete";

export type PortalStageState = "complete" | "current" | "upcoming";

export type PortalBlockedOn = "client" | "us" | "nobody";

export type PortalNextActionType =
  | "book_call"
  | "awaiting_call"
  | "snoozed"
  | "paused_by_us"
  | "complete";

export interface PortalStageInfo {
  key: PortalStageKey;
  title: string;
  stageNumber: number;
  state: PortalStageState;
  completedDate: string | null;
  scheduledDate: string | null;
  dueDate: string | null;
  isOverdue: boolean;
}

export interface PortalAccountantInfo {
  userId: string | null;
  name: string | null;
  email: string | null;
  calendlySlug: string | null;
  calendlyUrl: string | null;
  photoUrl: string | null;
}

export type PortalTaskState = "pending" | "in_progress" | "complete" | "awaiting_us";

export interface PortalTask {
  /** Stable key for visual mapping (icon, fallback copy etc). */
  key: "engagement_letter" | "id_verification" | string;
  title: string;
  description: string;
  state: PortalTaskState;
  completedDate: string | null;
  actionLabel: string | null;
  actionUrl: string | null;
  isExternal: boolean;
  isUrgent: boolean;
}

export interface PortalOnboardingStatus {
  workflowId: string;
  accountId: string;
  accountName: string | null;
  brand: "clever" | "workwell";

  currentStage: PortalStageKey;
  stageTitle: string;
  stageNumber: number;
  totalStages: number;
  isComplete: boolean;
  signedOffDate: string | null;

  blockedOn: PortalBlockedOn;
  nextActionType: PortalNextActionType;
  nextActionLabel: string;

  stages: PortalStageInfo[];
  accountant: PortalAccountantInfo;
  tasks: PortalTask[];

  currentStageScheduled: string | null;
  currentStageDue: string | null;

  joinedDate: string | null;
  daysSinceSignup: number;
}
