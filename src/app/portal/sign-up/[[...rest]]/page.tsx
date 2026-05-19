import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Calendar,
  MessageCircle,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getPortalClerkAppearance } from "@/lib/clerk-appearance";

/**
 * Portal sign-up — split-screen layout matching sign-in.
 *
 * Phase 1 strategy: portal accounts are invite-led (Salesforce Flow on
 * New_Client_Workflow__c create → Clerk Invitation API). This page is the
 * landing for invite-link redemption. Direct self-serve sign-up is also
 * accepted but the user must have an email matching an existing Contact
 * with an active workflow (enforced server-side after sign-up via
 * Clerk webhook → portal.users link table → SF lookup).
 */
export default async function PortalSignUpPage() {
  const brand = await getBrand();
  const isWorkwell = brand.id === "workwell";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ─── LEFT — branded panel ─── */}
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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles size={12} className="text-amber-300" />
              Set up your access
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Welcome to {brand.name}.
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
              Set up your portal access — about 90 seconds — and you&apos;ll be
              straight into your dashboard with your accountant.
            </p>

            <ul className="mt-10 space-y-4 max-w-md">
              {[
                {
                  icon: CheckCircle2,
                  title: "Passwordless sign-in",
                  desc: "Use a passkey, or a one-tap link emailed to you.",
                },
                {
                  icon: Calendar,
                  title: "Book calls instantly",
                  desc: "Pick a time with your accountant — no scheduling back-and-forth.",
                },
                {
                  icon: MessageCircle,
                  title: "All your messages in one feed",
                  desc: "Threads stay neat and your accountant always has context.",
                },
                {
                  icon: ShieldCheck,
                  title: "Built for ICO + GDPR",
                  desc: "UK-resident data, encrypted in transit and at rest.",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur ring-1 ring-white/15">
                    <item.icon size={16} className="text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-sm text-white/65">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <Lock size={12} /> 256-bit SSL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} /> ICO-registered · GDPR-compliant
            </span>
            <span className="inline-flex items-center gap-1.5">
              FCSA accredited
            </span>
          </div>
        </div>
      </aside>

      {/* ─── RIGHT — Clerk sign-up card ─── */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 px-6 py-12 lg:flex-[0.9]">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-text">
              Set up your portal access
            </h2>
            <p className="mt-1 text-sm text-text-light">
              Just an email to get started — no password needed.{" "}
              <Link
                href="/portal/sign-in"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Already have an account?
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
        </div>
      </section>
    </div>
  );
}
