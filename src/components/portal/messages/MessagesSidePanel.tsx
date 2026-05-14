import Image from "next/image";
import {
  Calendar,
  Mail,
  Clock,
  Shield,
  Sparkles,
  FileText,
  CheckCircle2,
  Download,
} from "lucide-react";
import type {
  PortalAccountantInfo,
  PortalEngagementLetter,
} from "@/lib/portal/types";

interface Props {
  accountant: PortalAccountantInfo | null;
  brandName: string;
  engagementLetter: PortalEngagementLetter | null;
}

/**
 * Right-hand sidebar for the Messages page.
 *
 * Three stacked cards:
 *   1. Accountant mini-card — photo, name, book-a-call CTA, email link
 *   2. Response-time expectation — manages SLA expectations up-front
 *   3. Quick tips — what makes a great message (mobile-collapsible)
 *
 * Designed to make the page feel populated without competing with the
 * conversation thread for attention.
 */
export default function MessagesSidePanel({
  accountant,
  brandName,
  engagementLetter,
}: Props) {
  const showSignedEl =
    engagementLetter && engagementLetter.status === "Signed";

  return (
    <div className="space-y-5 lg:sticky lg:top-6">
      <AccountantMiniCard accountant={accountant} brandName={brandName} />
      {showSignedEl && (
        <EngagementLetterSignedCard letter={engagementLetter} />
      )}
      <ResponseTimeCard />
      <TipsCard />
    </div>
  );
}

function EngagementLetterSignedCard({
  letter,
}: {
  letter: PortalEngagementLetter;
}) {
  const downloadHref =
    letter.pdfReady && letter.token
      ? `/api/engagement-letter/pdf?t=${letter.token}`
      : null;

  return (
    <div className="bg-emerald-50/70 rounded-2xl border border-emerald-100 p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
          <CheckCircle2 size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-emerald-900">
            Engagement letter signed
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-800/80 leading-relaxed">
            {letter.signedDate
              ? `On ${formatShortDate(letter.signedDate)} — we’ve got it on file.`
              : "All formal terms agreed. We’ve got it on file."}
          </p>
          {downloadHref && (
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <Download size={11} />
              Download signed copy
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AccountantMiniCard({
  accountant,
  brandName,
}: {
  accountant: PortalAccountantInfo | null;
  brandName: string;
}) {
  const displayName = accountant?.name ?? "Your accountant";
  const calendlyHref = accountant?.calendlyUrl ?? null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Brand gradient header */}
      <div
        className="relative h-20 bg-gradient-to-br from-primary-light via-primary to-primary-dark overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "16px 16px, auto",
        }}
      >
        <div
          className="absolute -top-12 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
      </div>

      <div className="px-5 pb-5 -mt-10">
        <div className="flex items-end gap-3">
          <div className="relative shrink-0">
            {accountant?.photoUrl ? (
              <Image
                src={accountant.photoUrl}
                alt={accountant.name ?? "Accountant"}
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-2xl ring-4 ring-white shadow-md object-cover bg-gray-100"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl ring-4 ring-white shadow-md bg-gradient-to-br from-primary-light to-primary-dark text-white text-lg font-bold flex items-center justify-center">
                {computeInitials(displayName)}
              </div>
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
              aria-label="Active"
              title="Available"
            />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">
              Your accountant
            </p>
            <p className="mt-0.5 text-sm font-semibold text-text truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-text-light truncate">
              at {brandName}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {calendlyHref ? (
            <a
              href={calendlyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-dark hover:shadow-md transition-all group"
            >
              <Calendar
                size={14}
                className="transition-transform group-hover:-rotate-6"
              />
              Book a call instead
            </a>
          ) : null}

          {accountant?.email && (
            <a
              href={`mailto:${accountant.email}`}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-text-light hover:border-primary/30 hover:text-primary transition-colors"
            >
              <Mail size={12} />
              <span className="truncate">{accountant.email}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ResponseTimeCard() {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-white to-white rounded-2xl border border-primary/10 p-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Clock size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text">Typical reply</h3>
          <p className="mt-1 text-xs text-text-light leading-relaxed">
            We aim to reply within{" "}
            <span className="font-semibold text-text">one working day</span>.
            Urgent? Mention it in your message — we&apos;ll prioritise.
          </p>
        </div>
      </div>
    </div>
  );
}

function TipsCard() {
  const tips = [
    {
      icon: FileText,
      title: "Be specific",
      body: "Include figures, dates, or HMRC reference numbers where you can.",
    },
    {
      icon: Sparkles,
      title: "Markdown works",
      body: "Use **bold**, *italic*, lists, and [links](url) to keep things clear.",
    },
    {
      icon: Shield,
      title: "Private & encrypted",
      body: "All messages are end-to-end encrypted in transit and logged for compliance.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-light">
        Good message, fast reply
      </h3>
      <ul className="mt-4 space-y-3.5">
        {tips.map((tip) => (
          <li key={tip.title} className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <tip.icon size={13} className="text-text-light" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text">{tip.title}</p>
              <p className="text-[11px] text-text-light leading-relaxed mt-0.5">
                {tip.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
