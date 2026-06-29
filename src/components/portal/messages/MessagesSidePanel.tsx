import {
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
 * The accountant deliberately ISN'T repeated here — the persistent left
 * sidebar chip already carries it (book / message / online), so duplicating
 * it on this page was noise. The rail now just supports the conversation:
 *   1. Signed engagement-letter card (when applicable)
 *   2. Reply-time expectation — sets the SLA up front
 *   3. Quick tips — what makes a great message
 */
export default function MessagesSidePanel({ engagementLetter }: Props) {
  const showSignedEl =
    engagementLetter && engagementLetter.status === "Signed";

  return (
    <div className="space-y-5 lg:sticky lg:top-6">
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
