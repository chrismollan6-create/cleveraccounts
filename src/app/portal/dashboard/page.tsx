import { currentUser } from "@clerk/nextjs/server";
import { AlertTriangle } from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import {
  getOnboardingForCurrentUser,
  isOnboardingError,
} from "@/lib/portal/onboarding";
import WelcomeBanner from "@/components/portal/WelcomeBanner";
import NextActionCard from "@/components/portal/NextActionCard";
import OnboardingStepper from "@/components/portal/OnboardingStepper";
import AccountantCard from "@/components/portal/AccountantCard";
import StatsRow from "@/components/portal/StatsRow";
import EngagementLetterCard from "@/components/portal/EngagementLetterCard";
import TasksPanel from "@/components/portal/TasksPanel";
import ActivityTimeline from "@/components/portal/ActivityTimeline";
import AccessGate from "@/components/portal/AccessGate";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [user, brand, portalUser, onboardingResult] = await Promise.all([
    currentUser(),
    getBrand(),
    getCurrentPortalUser(),
    getOnboardingForCurrentUser(),
  ]);

  const firstName =
    user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? null;

  // Soft-block states — show AccessGate instead of trying to load data
  if (portalUser && (portalUser.status === "disabled" || portalUser.status === "pending")) {
    return (
      <DashboardShell>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </DashboardShell>
    );
  }

  // Error state
  if (isOnboardingError(onboardingResult)) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={22} />
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                Couldn&apos;t load your onboarding
              </h2>
              <p className="mt-1 text-sm text-amber-800">{onboardingResult.message}</p>
              <p className="mt-3 text-xs text-amber-700/80">
                Error code: <code className="font-mono">{onboardingResult.error}</code>
                {" · "}
                Status: <code className="font-mono">{onboardingResult.status}</code>
              </p>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const status = onboardingResult.data;

  // Empty state
  if (!status) {
    return (
      <DashboardShell>
        <div className="text-center py-16 max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-text">Hi {firstName ?? "there"} 👋</h1>
          <p className="mt-3 text-text-light">
            Your onboarding hasn&apos;t started yet. We&apos;ll be in touch shortly to get
            things moving — or feel free to email us if you have questions.
          </p>
          <a
            href={`mailto:${brand.supportEmail}`}
            className="mt-6 inline-block text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            {brand.supportEmail}
          </a>
        </div>
      </DashboardShell>
    );
  }

  const completedStages = status.stages.filter((s) => s.state === "complete").length;

  return (
    <DashboardShell>
      <WelcomeBanner
        firstName={firstName}
        totalStages={status.totalStages}
        completedStages={completedStages}
        isComplete={status.isComplete}
      />

      <div className="mt-8">
        <StatsRow status={status} />
      </div>

      <div className="mt-6">
        <NextActionCard status={status} />
      </div>

      {status.tasks && status.tasks.length > 0 && (
        <div className="mt-6">
          <TasksPanel tasks={status.tasks} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OnboardingStepper stages={status.stages} />
        </div>
        <div className="space-y-6">
          <AccountantCard accountant={status.accountant} brandName={brand.name} />
          <EngagementLetterCard />
        </div>
      </div>

      <div className="mt-6">
        <ActivityTimeline status={status} />
      </div>
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
      {children}
    </div>
  );
}
