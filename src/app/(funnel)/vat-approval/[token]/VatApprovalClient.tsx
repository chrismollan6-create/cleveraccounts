'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  MessageCircleQuestion,
  Loader2,
  Globe2,
  TrendingDown,
  RefreshCw,
  ReceiptText,
  Ban,
  Car,
  HardHat,
  FolderTree,
  Search,
  ChevronDown,
  FileText,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import type { VatApprovalDto, ReverseCharge, FindingGroup } from './page';
import VatSummaryView from './VatSummaryView';

function fmtDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtMoney(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

function capitalise(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Consistent card elevation across the page — soft, layered, never a hard drop shadow. */
const CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

type Outcome = null | 'approved' | 'queried' | 'rechecking';
type Action = 'approve' | 'query' | 'recheck';

export default function VatApprovalClient({
  token,
  dto,
  brandEmail,
  brandPhone,
  initialOutcome = null,
}: {
  token: string;
  dto: VatApprovalDto;
  brandEmail: string;
  brandPhone: string;
  /** 'queried' when they come back to a return they've already raised a query on — they land on
   *  the queried state, where the "I've updated my books" button lives. */
  initialOutcome?: Outcome;
}) {
  const [outcome, setOutcome] = useState<Outcome>(initialOutcome);
  const [busy, setBusy] = useState<Action | null>(null);
  const [showQuery, setShowQuery] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const periodLabel = `${fmtDate(dto.periodStart)} → ${fmtDate(dto.periodEnd)}`;
  const heading = dto.clientName || 'your business';

  // Prefer the new grouped findings; fall back to the deprecated single reverse-charge payload so
  // a page served from a not-yet-updated deploy still renders that section. Drop the fallback once
  // the Apex change has been live a release.
  const groups: FindingGroup[] =
    dto.groups && dto.groups.length > 0
      ? dto.groups
      : dto.reverseCharge
        ? [reverseChargeAsGroup(dto.reverseCharge)]
        : [];

  // Flagged assurance checks that don't have a transaction table of their own (e.g. "Missing
  // output VAT on sales", "VAT return reconciliation") — they belong on the to-do list too.
  const flaggedChecks = (dto.checks ?? []).filter((c) => c.status === 'Flagged');

  // The count MUST equal exactly what "Before you approve" renders, or the heading lies. So it is
  // groups + flagged checks + the income note — nothing else. Housekeeping is deliberately excluded:
  // it has its own section and its own copy that says it does NOT hold up approval.
  const attention = groups.length + flaggedChecks.length + (dto.confirmIncomeNote ? 1 : 0);

  async function submit(kind: Action) {
    setBusy(kind);
    setError(null);
    try {
      const res = await fetch(`/api/vat-approval/${kind}?t=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: kind === 'query' ? JSON.stringify({ notes }) : '{}',
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }
      setOutcome(kind === 'approve' ? 'approved' : kind === 'query' ? 'queried' : 'rechecking');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  // ── Success states ──────────────────────────────────────────────
  if (outcome === 'approved') {
    return (
      <Centered>
        <StateIcon tone="emerald">
          <CheckCircle2 size={30} />
        </StateIcon>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thank you — VAT return approved</h1>
        <p className="text-text-light leading-relaxed mb-4">
          We&rsquo;ve recorded your approval of the VAT return for{' '}
          <span className="font-semibold text-text">{heading}</span>.
        </p>
        <WhatNext />
        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  if (outcome === 'rechecking') {
    return (
      <Centered>
        <StateIcon tone="emerald">
          <RefreshCw size={28} />
        </StateIcon>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we&rsquo;re re-checking</h1>
        <p className="text-text-light leading-relaxed">
          We&rsquo;re pulling your latest figures through and running our checks again. If everything
          looks right we&rsquo;ll email you a fresh copy of the return to approve. If anything still
          needs a look, we&rsquo;ll be in touch. Nothing will be filed with HMRC until you&rsquo;ve
          approved it.
        </p>
        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  if (outcome === 'queried') {
    return (
      <Centered>
        <StateIcon tone="primary">
          <MessageCircleQuestion size={28} />
        </StateIcon>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">Thanks — we&rsquo;ve got your question</h1>
        <p className="text-text-light leading-relaxed">
          We&rsquo;ve logged it and your accountant will take a look and come back to you before this
          VAT return is submitted. There&rsquo;s nothing else you need to do for now.
        </p>

        {/* The client's own way out of the queried state. Without this, a client who fixes their
            books sits waiting for us to notice — and we only notice by asking a human to look. */}
        <div className="mt-7 pt-6 border-t border-gray-100">
          <p className="text-sm font-semibold text-text mb-1">Made changes in FreeAgent?</p>
          <p className="text-[13px] leading-relaxed text-text-light mb-4">
            If you&rsquo;ve updated your records since, let us know and we&rsquo;ll re-run the return
            on your latest figures.
          </p>
          {error && (
            <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <button
            onClick={() => submit('recheck')}
            disabled={busy !== null}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {busy === 'recheck' ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} className="text-primary" />}
            {busy === 'recheck' ? 'Sending…' : "I've updated my books"}
          </button>
        </div>

        <HelpFooter email={brandEmail} phone={brandPhone} />
      </Centered>
    );
  }

  // ── Active approval view ────────────────────────────────────────
  // Two columns from lg up: the figures they read on the left, the decision they make on the
  // right, pinned. The single narrow column meant Approve sat below a full quarter's worth of
  // tables — on a wide screen the client scrolled past the return to reach the thing the page
  // exists for, and the rest of the viewport was white space. Below lg it stacks back to one
  // column and the actions land at the foot, which is the right place on a phone.
  const net = dto.netVatDue ?? 0;
  const isReclaim = net < 0;
  const netLabel = isReclaim ? 'Net VAT to reclaim' : 'Net VAT to pay';
  const netText = fmtMoney(Math.abs(net));

  return (
    <main className="min-h-[70vh] px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-7 lg:items-start">
        {/* ── Left: the return itself ── */}
        <div className={`${CARD} overflow-hidden`}>
          {/* Context header — a slim brand-tinted band so the page opens on something designed */}
          <div className="px-6 sm:px-9 pt-7 pb-6 border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-transparent">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              <FileText size={13} strokeWidth={2.5} />
              VAT Return
            </div>
            <h1 className="mt-2.5 text-[1.7rem] sm:text-[2rem] font-bold text-text leading-[1.1] tracking-tight">
              {heading}
            </h1>
            <p className="mt-1.5 text-sm text-text-light">{periodLabel}</p>
          </div>

          <div className="px-6 sm:px-9 py-7 space-y-9">
            {/* Order is deliberate: the headline figure they came to see, THEN the short to-do list
                (so what needs them is high on the page and impossible to miss), THEN the detailed
                return. Nothing is hidden behind a tab — an approval page must show both the return
                and what needs checking; only each issue's long transaction list is on a toggle. */}
            <VatSummaryView dto={dto} part="hero" />

            {attention > 0 && (
              <section>
                <SectionHead tone="amber">
                  Before you approve
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-700 tracking-normal">
                    {attention}
                  </span>
                </SectionHead>
                <p className="mt-2.5 text-[13px] leading-relaxed text-text-light">
                  {attention === 1
                    ? 'One thing is worth a quick look first. It won’t hold anything up — each note says what to check and what to do.'
                    : `${capitalise(numberWord(attention))} things are worth a quick look first. They won’t hold anything up — each note says what to check and what to do.`}
                </p>
                <div className="mt-4 space-y-3.5">
                  {groups.map((g) => (
                    <FindingGroupSection key={g.code} group={g} />
                  ))}
                  {flaggedChecks.map((c, i) => (
                    <AttentionCard
                      key={`chk-${i}`}
                      icon={<Search size={16} />}
                      title={c.title}
                      intro={c.description}
                    />
                  ))}
                  {dto.confirmIncomeNote && <IncomeNoteCard note={dto.confirmIncomeNote} />}
                </div>
              </section>
            )}

            <VatSummaryView dto={dto} part="detail" />
          </div>
        </div>

        {/* ── Right: the decision, pinned ── */}
        <aside className="mt-6 lg:mt-0 lg:sticky lg:top-8 space-y-4">
          <div className={`${CARD} overflow-hidden`}>
            {/* What they're approving, right by the button that approves it */}
            <div className="bg-gradient-to-b from-primary-50 to-primary-50/40 px-5 sm:px-6 py-4 border-b border-primary/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">
                You&rsquo;re approving
              </p>
              <div className="mt-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-text-light">{netLabel}</span>
                <span className={`text-xl font-bold tabular-nums tracking-tight ${isReclaim ? 'text-emerald-600' : 'text-text'}`}>
                  {netText}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-[13px] leading-relaxed text-text-light">
                These figures come from your bookkeeping as it stands today, so they&rsquo;ll change
                if you amend anything in FreeAgent from here. Nothing is filed until you approve.
              </p>

              {attention > 0 && (
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[13px] leading-relaxed text-amber-800">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>
                    {attention === 1
                      ? 'One thing to look at first'
                      : `${capitalise(numberWord(attention))} things to look at first`}
                    {' '}&mdash; see &ldquo;Before you approve&rdquo;.
                  </span>
                </p>
              )}

              {error && (
                <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                onClick={() => submit('approve')}
                disabled={busy !== null}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                {busy === 'approve' ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {busy === 'approve' ? 'Submitting…' : 'Approve this VAT return'}
              </button>

              {!showQuery ? (
                <button
                  onClick={() => setShowQuery(true)}
                  disabled={busy !== null}
                  className="w-full mt-2.5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-text font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                >
                  <MessageCircleQuestion size={17} className="text-amber-500" />
                  Something needs checking
                </button>
              ) : (
                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
                  <label htmlFor="vat-query-notes" className="block text-sm font-semibold text-text mb-2">
                    What needs checking?
                  </label>
                  <textarea
                    id="vat-query-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    maxLength={5000}
                    placeholder="e.g. I've corrected the VAT on the Google Ads bills, or an invoice is missing, or why is the VAT higher than last quarter?"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                  {/* Amber, not primary blue: on this page amber means "something needs you", and a
                      second blue button beside Approve reads as a second way to say yes. */}
                  <button
                    onClick={() => submit('query')}
                    disabled={busy !== null}
                    className="w-full mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
                  >
                    {busy === 'query' ? <Loader2 size={16} className="animate-spin" /> : null}
                    {busy === 'query' ? 'Sending…' : 'Send to my accountant'}
                  </button>
                  <button
                    onClick={() => setShowQuery(false)}
                    disabled={busy !== null}
                    className="w-full mt-1.5 px-5 py-2 rounded-lg text-text-light text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-gray-100">
                <WhatNext />
              </div>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 px-1 text-center text-xs leading-relaxed text-text-light">
            <Lock size={11} className="shrink-0" />
            Secure &amp; encrypted. Questions?{' '}
            <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>
          </p>
        </aside>
      </div>
    </main>
  );
}

/** Bridge the deprecated single reverse-charge payload onto the general group shape. */
function reverseChargeAsGroup(rc: ReverseCharge): FindingGroup {
  return {
    code: 'TXN_RC_OVERCLAIM',
    title: 'VAT reclaimed on overseas suppliers',
    intro:
      `These look like overseas suppliers, but ${rc.totalVatText} of UK VAT has been reclaimed on ` +
      `them. Overseas suppliers don't normally charge UK VAT — so if there's no VAT on the invoice, ` +
      `there's none to reclaim, and claiming it means underpaying HMRC.`,
    action:
      `If we're right, please correct them in FreeAgent and tell us — we'll re-check and send the ` +
      `return back to you. If the invoices do show UK VAT, just continue and click Approve.`,
    totalVatText: rc.totalVatText,
    showVat: true,
    lines: rc.lines,
    moreCount: rc.moreCount,
  };
}

/**
 * A check that flagged something, with its actual transactions listed.
 *
 * The pattern each of these follows: state the position plainly (the bank narrative usually
 * carries the reason — "Google Ads … Dublin Irl", "AXA Insurance"), list the payments so the
 * client can recognise them, and always give both ways out — fix it, or tell us it's right and
 * approve. A section that only describes a problem strands the client, and a stranded client
 * emails us, which is the human touch this is meant to remove.
 */
const GROUP_ICONS: Record<string, LucideIcon> = {
  TXN_RC_OVERCLAIM: Globe2,
  TXN_VAT_ON_EXEMPT: ReceiptText,
  TXN_BLOCKED_VAT: Ban,
  TXN_CAR_LEASE: Car,
  TXN_UNEXPECTED_VAT: HardHat,
  TXN_ACCY_NO_VAT: ReceiptText,
  TXN_MISPOST_AI: FolderTree,
};

function FindingGroupSection({ group }: { group: FindingGroup }) {
  const g = group;
  const Icon = GROUP_ICONS[g.code] ?? ReceiptText;
  const [open, setOpen] = useState(false);
  // Short lists stay in view — collapsing one or two rows saves nothing and just adds a click.
  // Long ones tuck away so the page is a scannable to-do list, not a wall of tables. The total is
  // in the intro either way, so the amount is never behind the toggle.
  const collapsible = g.lines.length > 3;
  const tableId = `lines-${g.code}`;

  const detail = (
    <>
      <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left bg-gray-50/80 border-b border-gray-100">
              <Th>Date</Th>
              <Th>{g.showVat ? 'Supplier' : 'Item'}</Th>
              <Th right>Amount</Th>
              {g.showVat && <Th right>VAT</Th>}
            </tr>
          </thead>
          <tbody>
            {g.lines.map((l, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2 text-text-light whitespace-nowrap tabular-nums align-top">{l.txnDate}</td>
                <td className="px-3 py-2 text-text">
                  {cleanPayee(l.payee)}
                  {l.note && <span className="block text-[12px] text-text-light">{l.note}</span>}
                </td>
                <td className="px-3 py-2 text-text-light text-right whitespace-nowrap tabular-nums align-top">{l.amountText}</td>
                {g.showVat && (
                  <td className="px-3 py-2 text-text font-semibold text-right whitespace-nowrap tabular-nums align-top">{l.vatText}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {g.moreCount > 0 && (
        <p className="text-xs text-text-light mt-2">
          …and {g.moreCount} more
          {g.totalVatText ? `, included in the ${g.totalVatText} total` : ''}.
        </p>
      )}
    </>
  );

  return (
    <AttentionCard icon={<Icon size={16} />} title={g.title} intro={g.intro}>
      {collapsible ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={tableId}
            className="inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
          >
            <ChevronDown size={15} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            {open ? 'Hide payments' : `Show the ${g.lines.length} payments`}
          </button>
          {open && <div id={tableId}>{detail}</div>}
        </div>
      ) : (
        detail
      )}
      <p className="text-[13px] leading-relaxed text-text-light mt-3">{g.action}</p>
    </AttentionCard>
  );
}

/** "Your sales are well down on their usual" — a question only they can answer, not a finding. */
function IncomeNoteCard({ note }: { note: string }) {
  return (
    <AttentionCard
      icon={<TrendingDown size={16} />}
      title="A quieter quarter than usual"
      intro={note}
    />
  );
}

/**
 * One item on the "before you approve" list. White card, amber left-rail and icon — the section
 * heading already says these need attention, so each card doesn't have to shout it in full amber.
 * A run of three amber-filled slabs was a wall of yellow that drowned the signal it was meant to
 * carry.
 */
function AttentionCard({
  icon,
  title,
  intro,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 border-l-[3px] border-l-amber-400 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">{title}</p>
          <p className="text-[13px] leading-relaxed text-text-light mt-1">{intro}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-light whitespace-nowrap ${
        right ? 'text-right' : ''
      }`}
    >
      {children}
    </th>
  );
}

/** The one section-heading style used across the page: a short rule, a tracked uppercase label. */
function SectionHead({
  children,
  tone = 'primary',
}: {
  children: React.ReactNode;
  tone?: 'primary' | 'amber';
}) {
  const amber = tone === 'amber';
  return (
    <div className="flex items-center gap-2.5">
      <span className={`block h-[3px] w-6 rounded-full ${amber ? 'bg-amber-400' : 'bg-primary'}`} />
      <h2
        className={`flex items-center text-[12px] font-bold uppercase tracking-[0.16em] ${
          amber ? 'text-amber-600' : 'text-primary'
        }`}
      >
        {children}
      </h2>
    </div>
  );
}

/** Small words for small counts; the numeral above about ten. */
function numberWord(n: number): string {
  return (
    ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ??
    String(n)
  );
}

/**
 * Tidy a raw bank-feed narrative for display. These arrive as the bank wrote them —
 * "Google Ads8935894141   Dublin   Irl", "SumUp **Secure valetin Birmingham GBR" — long runs of
 * whitespace and a trailing transaction reference the client doesn't need to read. We collapse the
 * spacing and trim an obvious long digit-run, but keep the words: the payee is how they recognise
 * the transaction, so tidying must never remove the name.
 */
function cleanPayee(raw?: string): string {
  if (!raw) return '';
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  // Strip a long reference number (7+ digits) — often glued to the payee, so no word boundary to
  // rely on ("Google Ads8935894141"). Then clear any separator the number left stranded ("04851-"
  // → "04851") and re-collapse. Only keep the result if letters survive, so a payee that is ONLY a
  // reference is shown as-is rather than blanked.
  const stripped = collapsed
    .replace(/\d{7,}/g, ' ')
    .replace(/\s[-*/]+(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return /[a-z]/i.test(stripped) ? stripped : collapsed;
}

function WhatNext() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-light mb-2">
        What happens next
      </p>
      <p className="text-[13px] leading-relaxed text-text-light">
        Once you approve, we submit your VAT return to HMRC on your behalf and email you a
        confirmation. There&rsquo;s nothing else you need to do.
      </p>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className={`max-w-lg w-full ${CARD} p-8 sm:p-10`}>{children}</div>
    </main>
  );
}

/** The circular status glyph on the outcome screens — a soft tinted disc with a matching ring. */
function StateIcon({ children, tone }: { children: React.ReactNode; tone: 'emerald' | 'primary' }) {
  const cls =
    tone === 'emerald'
      ? 'text-emerald-600 bg-emerald-50 ring-emerald-100'
      : 'text-primary bg-primary-50 ring-primary/10';
  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-8 ${cls}`}>
      {children}
    </div>
  );
}

function HelpFooter({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
      <span>Need help?</span>
      <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
      <span className="text-gray-300 hidden sm:inline">·</span>
      <a className="text-primary hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
    </div>
  );
}
