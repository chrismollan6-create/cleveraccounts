import { headers } from "next/headers";
import { UserProfile } from "@clerk/nextjs";
import { ShieldCheck, Bell, Database, Settings as SettingsIcon } from "lucide-react";
import { isNativeAppUA } from "@/lib/portal/native";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getPortalClerkAppearance } from "@/lib/clerk-appearance";
import AccessGate from "@/components/portal/AccessGate";
import EnableNotifications from "@/components/portal/notifications/EnableNotifications";
import DataRequestButtons from "@/components/portal/settings/DataRequestButtons";

export const dynamic = "force-dynamic";

/**
 * Settings — the page that was a greyed-out nav item for five months.
 *
 * Three sections, in the order a client cares about them:
 *
 *   1. Sign-in & security — Clerk's own UserProfile. Clerk already owns
 *      passkeys, two-factor enrolment, email addresses and the list of
 *      active devices with sign-out; all of that existed but was reachable
 *      only by finding the avatar menu. Embedding it here gives it a name
 *      and a place in the navigation.
 *   2. Notifications — the push opt-in, so it's changeable after the one
 *      time it's offered on the inbox.
 *   3. Your data — the UK GDPR rights that previously had no route at all.
 *
 * Deliberately NOT here: business details, which live on "Your details"
 * because they're the company's, not the login's.
 */
export default async function SettingsPage() {
  const [brand, portalUser, hdrs] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    headers(),
  ]);
  const isNativeApp = isNativeAppUA(hdrs.get("user-agent"));

  const firstName =
    portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  if (
    portalUser &&
    (portalUser.status === "disabled" || portalUser.status === "pending")
  ) {
    return (
      <Wrap>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </Wrap>
    );
  }

  return (
    <Wrap>
      {!isNativeApp && (
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-sm shadow-primary/20">
            <SettingsIcon size={19} />
          </span>
          <div>
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-text">
              Settings
            </h1>
            <p className="mt-0.5 text-sm text-text-light">
              How you sign in, what we tell you about, and the data we hold.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <Section
          icon={ShieldCheck}
          title="Sign in & security"
          blurb="Passkeys, two-factor authentication, your email address, and every device currently signed in — sign any of them out from here."
        >
          {/* Clerk renders its own card chrome, so the section gives it room
              rather than nesting a panel inside a panel. */}
          <div className="-mx-1 overflow-x-auto">
            <UserProfile
              routing="hash"
              appearance={getPortalClerkAppearance(brand)}
            />
          </div>
        </Section>

        <Section
          icon={Bell}
          title="Notifications"
          blurb="Get told about replies, approvals and deadlines without having to open the portal."
        >
          <EnableNotifications />
        </Section>

        <Section
          icon={Database}
          title="Your data"
          blurb="You can ask for a copy of the personal information we hold about you, or ask us to erase it. Either way we'll reply within one month."
        >
          <DataRequestButtons />
          <p className="mt-4 text-xs leading-relaxed text-text-light">
            We have to keep some records to meet our own legal obligations —
            company and tax records generally for six years — so an erasure
            request is a conversation about what can go and what can&apos;t,
            not an instant delete. Your accountant will set out exactly which
            is which.
          </p>
        </Section>
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[820px] px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  blurb,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-start gap-3 border-b border-neutral-100 px-5 py-4">
        <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={16} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-text">{title}</h2>
          <p className="mt-0.5 max-w-prose text-[13px] leading-relaxed text-text-light">
            {blurb}
          </p>
        </div>
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}
