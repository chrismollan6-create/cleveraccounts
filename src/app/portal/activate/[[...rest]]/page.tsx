import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  HandHeart,
  Calendar,
  PartyPopper,
  Check,
  Mail,
  Phone,
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getPortalClerkAppearance } from "@/lib/clerk-appearance";

/**
 * Portal sign-up — invite-only.
 *
 * Two render paths:
 *   1. Invite ticket present (?__clerk_ticket=…) — render the Clerk SignUp
 *      component so the user can complete account creation via the invite.
 *   2. No ticket — show an invite-only landing. There is deliberately NO
 *      self-serve sign-up form and NO "request access" flow, because:
 *        · The portal is for existing accountancy clients only (those with
 *          an active New_Client_Workflow__c in Salesforce).
 *        · Anyone can guess client emails; a self-request flow would let an
 *          attacker probe whether arbitrary emails are clients (information
 *          leak) and potentially trigger nuisance emails. Invite-only avoids
 *          both.
 *
 * Lost invites are handled out-of-band — clients contact their accountant
 * and the accountant re-fires the SF Flow that creates a fresh invite.
 */
export default async function PortalSignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  // Clerk Invitation API drops `__clerk_ticket` into the URL when redirecting
  // an invitee here. Some older SDK versions use `__clerk_invitation_token`.
  const hasInviteTicket = Boolean(
    params.__clerk_ticket || params.__clerk_invitation_token,
  );

  const brand = await getBrand();
  const isWorkwell = brand.id === "workwell";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ─── LEFT — branded panel (same as sign-in for visual continuity, but
            differentiated by the content below — journey, not value props) ─── */}
      <aside
        className="relative flex-1 lg:flex-[1.1] overflow-hidden text-white"
        style={{
          background: isWorkwell
            ? `linear-gradient(135deg, ${brand.colors.primaryDark} 0%, ${brand.colors.primary} 60%, ${brand.colors.secondaryDark} 100%)`
            : `linear-gradient(135deg, #0a1d2e 0%, #0e3a5a 50%, ${brand.colors.primary} 100%)`,
        }}
      >
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative flex h-full min-h-screen flex-col px-8 py-10 lg:px-14 lg:py-16">
          <Link href="/" className="inline-flex w-fit">
            <Image
              src={brand.assets.logo}
              alt={brand.name}
              width={180}
              height={48}
              priority
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div className="my-auto py-12">
            {hasInviteTicket ? (
              <SignUpInviteJourney brandName={brand.name} />
            ) : (
              <InviteOnlyExplanation brandName={brand.name} />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <Lock size={12} /> 256-bit SSL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} /> ICO-registered · GDPR-compliant
            </span>
          </div>
        </div>
      </aside>

      {/* ─── RIGHT — Clerk card (with invite) or no-invite message ─── */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 px-6 py-12 lg:flex-[0.9]">
        <div className="w-full max-w-md">
          {hasInviteTicket ? (
            <InviteSignUpCard brand={brand} />
          ) : (
            <NoInviteCard />
          )}
        </div>
      </section>
    </div>
  );
}

/** Left-rail content shown when the user arrived via a real invite link.
 *  4-step journey shows what happens after they finish setting up. */
function SignUpInviteJourney({ brandName }: { brandName: string }) {
  const steps = [
    {
      icon: Check,
      title: "Set up your sign-in",
      sub: "About 90 seconds.",
      state: "now" as const,
    },
    {
      icon: HandHeart,
      title: "Meet your accountant",
      sub: "On your dashboard the moment you finish.",
      state: "next" as const,
    },
    {
      icon: Calendar,
      title: "Book your welcome call",
      sub: "Pick a time directly — no email tag.",
      state: "next" as const,
    },
    {
      icon: PartyPopper,
      title: "You're up and running",
      sub: "Everything in one place from here on.",
      state: "next" as const,
    },
  ];
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
        <HandHeart size={12} className="text-amber-300" />
        Setting up your access
      </span>
      <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Welcome to {brandName}.
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
        Setup takes about 90 seconds. Here&apos;s what happens next.
      </p>

      <ol className="relative mt-10 max-w-md space-y-5 border-l border-white/15 pl-7">
        {steps.map((step, i) => {
          const isNow = step.state === "now";
          return (
            <li key={i} className="relative">
              <span
                className={`absolute -left-10 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-[#0e3a5a] ${
                  isNow
                    ? "bg-amber-300 text-stone-900"
                    : "bg-white/10 text-white/60"
                }`}
              >
                <step.icon size={13} strokeWidth={2.5} />
              </span>
              <div>
                <div
                  className={`font-semibold ${isNow ? "text-white" : "text-white/80"}`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-sm ${isNow ? "text-amber-200" : "text-white/55"}`}
                >
                  {step.sub}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/** Left-rail content shown when there's NO invite ticket — explains why
 *  there's no sign-up form and where to get an invite. */
function InviteOnlyExplanation({ brandName }: { brandName: string }) {
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
        <ShieldCheck size={12} className="text-amber-300" />
        Invite-only
      </span>
      <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Access by invite only.
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
        The {brandName} client portal is reserved for existing clients. Your
        accountant sends you a personal invite link by email when your
        onboarding starts.
      </p>

      <ul className="mt-8 max-w-md space-y-4">
        <li className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur ring-1 ring-white/15">
            <Mail size={16} className="text-amber-300" />
          </div>
          <div>
            <div className="font-semibold text-white">Got an invite link?</div>
            <div className="text-sm text-white/65">
              Open the email we sent you and click the link. You&apos;ll land
              back here ready to finish.
            </div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur ring-1 ring-white/15">
            <Phone size={16} className="text-amber-300" />
          </div>
          <div>
            <div className="font-semibold text-white">
              Can&apos;t find your invite?
            </div>
            <div className="text-sm text-white/65">
              Contact your accountant — they&apos;ll send a fresh one straight
              away.
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}

/** Right-side card when a Clerk invite ticket is present. */
function InviteSignUpCard({
  brand,
}: {
  brand: Awaited<ReturnType<typeof getBrand>>;
}) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-text">
          Finish setting up
        </h2>
        <p className="mt-1 text-sm text-text-light">
          Use your passkey, or set a password if you prefer.{" "}
          <Link
            href="/portal/sign-in"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Already set up?
          </Link>
        </p>
      </div>

      <SignUp
        appearance={getPortalClerkAppearance(brand)}
        forceRedirectUrl="/portal/dashboard"
        signInUrl="/portal/sign-in"
      />

      <p className="mt-6 text-center text-xs text-neutral-500">
        By creating an account you agree to our{" "}
        <Link
          href="/terms"
          className="font-medium text-neutral-700 hover:text-primary"
        >
          terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium text-neutral-700 hover:text-primary"
        >
          privacy policy
        </Link>
        .
      </p>
    </>
  );
}

/** Right-side card when NO invite — explains and points to /sign-in. */
function NoInviteCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-200">
        <Mail size={22} className="text-amber-600" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-text">
        You&apos;ll need an invite link to sign up
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-light">
        We don&apos;t take self-serve sign-ups on the portal — every client
        gets a personal invite link by email when their onboarding starts.
      </p>

      <div className="mt-6 space-y-2.5 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">
        <p className="font-semibold text-text">What to do now</p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
            <span>
              <strong>Search your email</strong> for &ldquo;
              {`Clever Accounts portal`}&rdquo; or &ldquo;your invite&rdquo; —
              the link came from us
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
            <span>
              <strong>Contact your accountant</strong> if you can&apos;t find
              it — they&apos;ll send a fresh one
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
            <span>
              <strong>Already set up?</strong> Use{" "}
              <Link
                href="/portal/sign-in"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                sign in
              </Link>{" "}
              instead
            </span>
          </li>
        </ul>
      </div>

      <Link
        href="/contact"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-text transition hover:border-neutral-400"
      >
        Contact us
      </Link>
    </div>
  );
}
