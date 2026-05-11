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

// ───────────────────────────────────────────────────────────────────────────
// Messages (Phase D)
// ───────────────────────────────────────────────────────────────────────────

export interface PortalMessage {
  id: string;
  caseId: string;
  caseSubject: string | null;
  caseStatus: string | null;
  caseClosed: boolean;
  fromAddress: string | null;
  fromName: string | null;
  subject: string | null;
  /** Markdown source — render with react-markdown on the portal side. */
  bodyText: string;
  sentAt: string; // ISO 8601
  /** True when message came from the client (matches a Contact on the Account). */
  isFromClient: boolean;
  /** True when the message originated from the portal Compose box (vs Outlook). */
  isPortalAuthored: boolean;
}

export interface SendMessageResult {
  emailMessageId: string;
  caseId: string;
  /** True if a new Case was opened (false = appended to existing open Case). */
  newCase: boolean;
  message: PortalMessage;
}

// ───────────────────────────────────────────────────────────────────────────
// Engagement Letter (Phase D)
// ───────────────────────────────────────────────────────────────────────────

export interface PortalEngagementLetter {
  id: string;
  status: "Sent" | "Viewed" | "Signed" | "Expired";
  variant: "sole-trader" | "limited-company" | string;
  sentDate: string | null;
  signedDate: string | null;
  signerName: string | null;
  /** Opaque token — only included when the EL is still being sent/viewed. */
  token: string | null;
  /** True when the signed PDF has been generated and is downloadable. */
  pdfReady: boolean;
}

// ───────────────────────────────────────────────────────────────────────────
// Compliance tasks (Foundation 1 → already shipped)
// ───────────────────────────────────────────────────────────────────────────

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
