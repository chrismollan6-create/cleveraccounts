/**
 * Shared mock onboarding status for portal redesign previews.
 *
 * Mirrors the real PortalOnboardingStatus shape but with hardcoded fields
 * so the preview pages render without SF / Postgres / Clerk dependencies.
 * Pravatar URLs give realistic avatar faces driven by the seed string.
 */

import type {
  PortalOnboardingStatus,
  PortalStageInfo,
} from "@/lib/portal/types";

const STAGES: PortalStageInfo[] = [
  {
    key: "welcome",
    title: "Welcome Call",
    stageNumber: 1,
    state: "complete",
    completedDate: "2026-03-30",
    scheduledDate: "2026-03-30T10:00:00.000Z",
    dueDate: "2026-03-30T10:00:00.000Z",
    isOverdue: false,
  },
  {
    key: "main",
    title: "Main Call",
    stageNumber: 2,
    state: "complete",
    completedDate: "2026-03-30",
    scheduledDate: "2026-03-30T14:00:00.000Z",
    dueDate: "2026-03-30T14:00:00.000Z",
    isOverdue: false,
  },
  {
    key: "portal",
    title: "Portal Training",
    stageNumber: 3,
    state: "current",
    completedDate: null,
    scheduledDate: null,
    dueDate: "2026-04-07T10:00:00.000Z",
    isOverdue: true,
  },
  {
    key: "checkin30",
    title: "30-day Check-in",
    stageNumber: 4,
    state: "upcoming",
    completedDate: null,
    scheduledDate: null,
    dueDate: null,
    isOverdue: false,
  },
  {
    key: "checkin60",
    title: "60-day Check-in",
    stageNumber: 5,
    state: "upcoming",
    completedDate: null,
    scheduledDate: null,
    dueDate: null,
    isOverdue: false,
  },
  {
    key: "catchup",
    title: "Catch-up",
    stageNumber: 6,
    state: "upcoming",
    completedDate: null,
    scheduledDate: null,
    dueDate: null,
    isOverdue: false,
  },
];

export const MOCK_STATUS: PortalOnboardingStatus = {
  workflowId: "a2bQ10000027ApVIAU",
  accountId: "001Q100000XuwueIAB",
  accountName: "Mollan Consulting Ltd",
  brand: "clever",

  currentStage: "portal",
  stageTitle: "Portal Training",
  stageNumber: 3,
  totalStages: 6,
  isComplete: false,
  signedOffDate: null,

  blockedOn: "client",
  nextActionType: "book_call",
  nextActionLabel: "Book your portal training",

  stages: STAGES,
  accountant: {
    userId: "005Q100000CharlieM",
    name: "Charlie McAuley",
    email: "charlie.mcauley@cleveraccounts.co.uk",
    calendlySlug: "charlie-mcauley",
    calendlyUrl: "https://calendly.com/charlie-mcauley",
    // Pravatar produces a consistent realistic face from the seed
    photoUrl: "https://i.pravatar.cc/300?u=charlie-mcauley-cleveraccounts",
  },
  tasks: [
    {
      key: "engagement_letter",
      title: "Sign your engagement letter",
      description:
        "We'll email this to you shortly. No action needed right now.",
      state: "awaiting_us",
      completedDate: null,
      actionLabel: null,
      actionUrl: null,
      isExternal: false,
      isUrgent: false,
    },
    {
      key: "id_verification",
      title: "Verify your identity",
      description:
        "A quick photo + selfie via Credas. Required by anti-money-laundering rules. Takes about 2 minutes.",
      state: "in_progress",
      completedDate: null,
      actionLabel: "Check your email",
      actionUrl: null,
      isExternal: false,
      isUrgent: true,
    },
  ],

  currentStageScheduled: null,
  currentStageDue: "2026-04-07T10:00:00.000Z",

  joinedDate: "2026-03-29",
  daysSinceSignup: 45,
};

export const MOCK_FIRST_NAME = "Chris";
