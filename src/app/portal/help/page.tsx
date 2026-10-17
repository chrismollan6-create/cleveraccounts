import Link from "next/link";
import { headers } from "next/headers";
import {
  HelpCircle,
  MessageCircle,
  CalendarDays,
  Phone,
  Mail,
  AlertTriangle,
  Upload,
  PoundSterling,
  CalendarClock,
  Building2,
  ArrowRight,
} from "lucide-react";
import { isNativeAppUA } from "@/lib/portal/native";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import {
  getOnboardingForCurrentUser,
  isOnboardingError,
} from "@/lib/portal/onboarding";
import AccessGate from "@/components/portal/AccessGate";

export const dynamic = "force-dynamic";

/**
 * Help — the other nav item that was greyed out.
 *
 * Not a knowledge base and not a chatbot: for a client of an accountancy
 * practice the answer to almost everything is "ask the person who does your
 * books". So this page's job is to route — get you to your accountant the
 * fastest way, or to the portal surface that already answers the question —
 * and to tell you what to do when a number looks wrong, which is the one
 * thing clients need and never know how to raise.
 */
export default async function HelpPage() {
  const [brand, portalUser, onboarding, hdrs] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getOnboardingForCurrentUser().catch(() => null),
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

  const status =
    onboarding && !isOnboardingError(onboarding) ? onboarding.data : null;
  const accountantName = status?.accountant?.name ?? null;
  const canBook = Boolean(status?.accountant?.calendlyUrl);
  const tel = brand.freephone.replace(/\s/g, "");

  return (
    <Wrap>
      {!isNativeApp && (
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-sm shadow-primary/20">
            <HelpCircle size={19} />
          </span>
          <div>
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-text">
              Help
            </h1>
            <p className="mt-0.5 text-sm text-text-light">
              {accountantName
                ? `${accountantName} handles your account — here's the quickest way to reach them.`
                : "The quickest ways to reach us, and where to find things."}
            </p>
          </div>
        </div>
      )}

      {/* ── Reach a human ─────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-text">Talk to us</h2>
          <p className="mt-0.5 text-[13px] text-text-light">
            Messages go straight to{" "}
            {accountantName ?? "your accountant"} — usually answered the same
            working day.
          </p>
        </div>
        <div className="grid divide-y divide-neutral-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <Contact
            icon={MessageCircle}
            label="Send a message"
            detail="Best for anything with detail or an attachment"
            href="/portal/messages"
          />
          {canBook ? (
            <Contact
              icon={CalendarDays}
              label="Book a call"
              detail="Pick a time that suits you"
              href="/portal/appointments"
            />
          ) : (
            <Contact
              icon={Mail}
              label={brand.email}
              detail="Email us"
              href={`mailto:${brand.email}`}
              external
            />
          )}
          <Contact
            icon={Phone}
            label={brand.freephone}
            detail="Monday to Friday, 9am to 5pm"
            href={`tel:${tel}`}
            external
          />
          <Contact
            icon={Mail}
            label={brand.supportEmail}
            detail="Email, if you'd rather not use the portal"
            href={`mailto:${brand.supportEmail}`}
            external
          />
        </div>
      </section>

      {/* ── Something looks wrong ─────────────────────────────────────── */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-orange-200 bg-orange-50/40">
        <div className="flex items-start gap-3 px-5 py-4">
          <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <AlertTriangle size={16} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text">
              A figure or a date looks wrong
            </h2>
            <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-text-light">
              Tell us — don&apos;t work around it. Figures here come from your
              bookkeeping and from Companies House, so a number that looks odd
              usually means something needs correcting at source, and the
              sooner we know the less it affects a filing. Send a message
              saying what you expected to see and what you&apos;re seeing
              instead.
            </p>
            <Link
              href="/portal/messages"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Report it <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Where things live ─────────────────────────────────────────── */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-text">Where things live</h2>
        </div>
        <ul className="divide-y divide-neutral-100">
          <Where
            icon={Upload}
            href="/portal/documents"
            q="How do I send you a receipt, a statement or a form?"
            a="Documents — upload up to ten files at a time, with a note."
          />
          <Where
            icon={CalendarClock}
            href="/portal/deadlines"
            q="When is my next filing due?"
            a="Deadlines — everything due, and whether it's waiting on you or on us."
          />
          <Where
            icon={PoundSterling}
            href="/portal/financials"
            q="How is the business doing?"
            a="Money — profit, cash, tax to set aside, and the full profit & loss."
          />
          <Where
            icon={Building2}
            href="/portal/details"
            q="What do you hold on file about me and my company?"
            a="Your details — personal, company and Companies House records."
          />
        </ul>
      </section>

      <p className="mt-6 px-1 text-xs text-text-light">
        Not happy with something? Tell {accountantName ?? "your accountant"}{" "}
        first — most things are a misunderstanding we can fix the same day. If
        that doesn&apos;t resolve it, email{" "}
        <a
          href={`mailto:${brand.supportEmail}`}
          className="font-medium text-primary hover:underline"
        >
          {brand.supportEmail}
        </a>{" "}
        and we&apos;ll handle it as a formal complaint.
      </p>
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

function Contact({
  icon: Icon,
  label,
  detail,
  href,
  external = false,
}: {
  icon: typeof Phone;
  label: string;
  detail: string;
  href: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-text">
          {label}
        </span>
        <span className="block text-[12px] text-text-light">{detail}</span>
      </span>
    </>
  );
  const cls =
    "flex items-center gap-3 px-5 py-4 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40";
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function Where({
  icon: Icon,
  href,
  q,
  a,
}: {
  icon: typeof Upload;
  href: string;
  q: string;
  a: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-start gap-3 px-5 py-4 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
      >
        <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-text-light">
          <Icon size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-text">{q}</span>
          <span className="block text-[13px] text-text-light">{a}</span>
        </span>
        <ArrowRight
          size={15}
          className="mt-1 flex-shrink-0 text-text-light/40 transition group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </Link>
    </li>
  );
}
