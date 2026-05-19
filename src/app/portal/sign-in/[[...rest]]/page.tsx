import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Calendar,
  MessageCircle,
  Lock,
} from "lucide-react";
import { getBrand } from "@/lib/brand";
import { getPortalClerkAppearance } from "@/lib/clerk-appearance";

/**
 * Portal sign-in — split-screen layout.
 *
 * Left rail: branded marketing panel (logo, value props, trust signals).
 * Right rail: Clerk's <SignIn /> heavily styled to match the portal aesthetic.
 *
 * On portal pages we already skip PortalShell (see /portal/layout.tsx), so
 * this page owns the full viewport. Mobile collapses to a single column with
 * the brand content trimmed to logo + heading only.
 */
export default async function PortalSignInPage() {
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
        {/* Soft glow accents */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative flex h-full min-h-screen flex-col px-8 py-10 lg:px-14 lg:py-16">
          {/* Logo */}
          <Link href="/" className="inline-flex w-fit">
            <Image
              src={brand.assets.logoWhite ?? brand.assets.logo}
              alt={brand.name}
              width={180}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Hero copy */}
          <div className="my-auto py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles size={12} className="text-amber-300" />
              Your client portal
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Welcome back.
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
              Sign in to see where you are in onboarding, book a call with your
              accountant, sign documents, and message us — all in one place.
            </p>

            {/* Value props */}
            <ul className="mt-10 space-y-4 max-w-md">
              {[
                {
                  icon: Calendar,
                  title: "Booking, in one click",
                  desc: "Pick a time directly with your accountant — no email tag.",
                },
                {
                  icon: MessageCircle,
                  title: "Messages in one place",
                  desc: "Threads with your accountant, all preserved in one feed.",
                },
                {
                  icon: ShieldCheck,
                  title: "Encrypted and secure",
                  desc: "Passkey sign-in, UK-resident data, audited every login.",
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

          {/* Trust footer */}
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

      {/* ─── RIGHT — Clerk sign-in card ─── */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 px-6 py-12 lg:flex-[0.9]">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-text">
              Sign in to your portal
            </h2>
            <p className="mt-1 text-sm text-text-light">
              Use your passkey, or we&apos;ll email you a sign-in link.{" "}
              <Link
                href="/portal/sign-up"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Need access?
              </Link>
            </p>
          </div>

          <SignIn
            appearance={getPortalClerkAppearance(brand)}
            forceRedirectUrl="/portal/dashboard"
            signUpUrl="/portal/sign-up"
          />

          <p className="mt-6 text-center text-xs text-neutral-500">
            By signing in you agree to our{" "}
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
