import { currentUser } from "@clerk/nextjs/server";
import { AlertTriangle } from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { listMessagesForCurrentUser } from "@/lib/portal/messages";
import { getEngagementLetterForCurrentUser } from "@/lib/portal/engagement-letter";
import MessagesView from "@/components/portal/messages/MessagesView";
import AccessGate from "@/components/portal/AccessGate";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const [user, brand, portalUser, initialMessages, initialEl] = await Promise.all([
    currentUser(),
    getBrand(),
    getCurrentPortalUser(),
    listMessagesForCurrentUser(50),
    getEngagementLetterForCurrentUser(),
  ]);

  const firstName =
    user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? null;

  // Soft-block states (same pattern as dashboard)
  if (portalUser && (portalUser.status === "disabled" || portalUser.status === "pending")) {
    return (
      <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </div>
    );
  }

  // Hard error — couldn't fetch initial messages
  if (initialMessages.ok === false) {
    return (
      <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={22} />
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                Couldn&apos;t load your messages
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                We hit an issue loading your conversation history. Try refreshing
                the page; if this keeps happening, drop your accountant a quick
                email and we&apos;ll sort it.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initialEngagementLetter =
    initialEl.ok === true ? initialEl.data : null;

  return (
    <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          Messages
        </h1>
        <p className="mt-1.5 text-text-light">
          Your direct line to your accountant at {brand.name}.
        </p>
      </div>

      <MessagesView
        initialMessages={initialMessages.data}
        initialEngagementLetter={initialEngagementLetter}
        currentUserFirstName={firstName ?? "you"}
        brandName={brand.name}
      />
    </div>
  );
}
