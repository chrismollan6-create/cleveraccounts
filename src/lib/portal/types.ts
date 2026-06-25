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

// ───────────────────────────────────────────────────────────────────────────
// "Your details" page — personal (Contact), company (Account + CH_Company__c),
// and Companies House officers (CH_Officer__c). Served from the Postgres cache.
// ───────────────────────────────────────────────────────────────────────────

export interface PortalPersonalDetails {
  contactSfId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  /** Pulled from the matching CH_Officer record when available. */
  role: string | null;
  dateOfBirth: string | null; // "Month YYYY" (CH only exposes month + year)
  nationality: string | null;
  appointedOn: string | null;
  idvVerifiedOn: string | null;
}

export interface PortalCompanyDetails {
  accountSfId: string;
  /** Account name — always present even if no CH record is linked yet. */
  accountName: string | null;
  /** True when a CH_Company__c record is linked + cached. */
  hasCompaniesHouse: boolean;
  companyNumber: string | null;
  companyName: string | null;
  status: string | null;
  statusDetail: string | null;
  companyType: string | null;
  dateOfCreation: string | null;
  registeredAddress: string | null; // formatted single line
  sicCodes: string[];
  accountsNextDue: string | null;
  accountsOverdue: boolean;
  csNextDue: string | null;
  csOverdue: boolean;
  lastSynced: string | null;
}

export interface PortalOfficer {
  id: string;
  name: string | null;
  role: string | null;
  appointedOn: string | null;
  resignedOn: string | null;
  dateOfBirth: string | null; // "Month YYYY"
  nationality: string | null;
  countryOfResidence: string | null;
  occupation: string | null;
  idvVerified: boolean;
}

export interface PortalDetailsBundle {
  personal: PortalPersonalDetails;
  company: PortalCompanyDetails;
  officers: PortalOfficer[];
}

// ───────────────────────────────────────────────────────────────────────────
// Deadlines + notifications — the recurring "reason to log in" surfaces.
// ───────────────────────────────────────────────────────────────────────────

export type PortalDeadlineKind =
  | "accounts"
  | "confirmation_statement"
  | "vat"
  | "self_assessment"
  | "corporation_tax"
  | "payroll";

export type PortalDeadlineStatus =
  | "upcoming"
  | "due_soon"
  | "overdue"
  | "submitted";

export interface PortalDeadline {
  id: string;
  kind: PortalDeadlineKind | string;
  title: string;
  dueDate: string | null;
  periodLabel: string | null;
  status: PortalDeadlineStatus | string;
  blockedOn: "client" | "us" | "nobody" | string | null;
  /** Whole days until due (negative = overdue). Null when no due date. */
  daysUntil: number | null;
}

export type PortalNotificationType =
  | "message"
  | "deadline"
  | "approval"
  | "request"
  | "document"
  | "general";

export interface PortalNotification {
  id: string;
  type: PortalNotificationType | string;
  title: string;
  body: string | null;
  href: string | null;
  /** True when the client must act (approve/sign/send) — drives the badge. */
  actionRequired: boolean;
  read: boolean;
  createdAt: string;
}

export type PortalApprovalKind =
  | "mtd_review"
  | "vat"
  | "self_assessment"
  | "accounts";

export type PortalApprovalStatus = "pending" | "approved" | "queried";

export interface PortalApproval {
  id: string;
  kind: PortalApprovalKind | string;
  title: string;
  periodLabel: string | null;
  status: PortalApprovalStatus | string;
  summary: string | null;
  amountLabel: string | null;
  dueDate: string | null;
  approvedAt: string | null;
}

export interface PortalDocument {
  id: string;
  name: string;
  category: string;
  /** 'shared' (downloadable) | 'request' (we need it uploaded) */
  direction: "shared" | "request" | string;
  /** shared → 'available'; request → 'requested' | 'received' */
  status: string;
  fileType: string | null;
  sizeLabel: string | null;
  downloadUrl: string | null;
  sharedAt: string | null;
  dueDate: string | null;
}

export interface PortalDocumentsBundle {
  shared: PortalDocument[];
  requests: PortalDocument[];
}

/**
 * A single thing blocked on the client, aggregated across approvals, document
 * requests and deadlines — powers the dashboard "Needs you" hub.
 */
export interface PortalActionItem {
  id: string;
  type: "approval" | "document" | "deadline" | "task";
  title: string;
  detail: string | null;
  href: string;
  dueDate: string | null;
  urgency: "overdue" | "soon" | "normal";
}
