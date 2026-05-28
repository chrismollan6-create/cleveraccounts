/**
 * OnboardingGuide — the onboarding guide document.
 *
 * Pure presentational server component, rendered at A4 width and turned into
 * a PDF by headless Chrome (full modern CSS — gradients, shadows, shapes all
 * render). Brand theming works by setting `data-brand` on the root <div>:
 * the [data-brand="…"] rules in globals.css re-define the --color-* /
 * --font-sans tokens for the subtree.
 *
 * Layout: a full-bleed cover page, then colour-blocked content sections.
 */

import {
  ShieldCheck,
  Building2,
  ReceiptText,
  Coins,
  Landmark,
  Briefcase,
  MonitorSmartphone,
  UserCheck,
  MessageCircle,
  Monitor,
  BadgeCheck,
  Phone,
  Mail,
  ArrowRight,
  Check,
  Clock,
  CalendarDays,
  Sparkles,
  Users,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { BRANDS } from '@/lib/constants';
import {
  getSections,
  sectionTitle,
  welcomeIntro,
  WORKING_PHASES,
  ACCOUNTANT_BIO,
  ENGAGEMENT_LETTER_EXPLANATION,
  credasExplanation,
  introCallExplanation,
  WHAT_TO_EXPECT,
  CONTACT_CHANNELS,
  OFFICE_HOURS,
  getDeadlines,
  getFaqs,
  getQuickWins,
  getLearnTopics,
  HAS_LEARN_CENTRE,
  TEAM_INTRO,
  TEAM_ROLES,
  type LearnTopicIconKey,
  type OnboardingGuideData,
  type SectionIconKey,
  type ContactChannelIcon,
} from '@/content/onboarding-guide';
import GuideDownloadButton from './GuideDownloadButton';

/** Hex (#RRGGBB) → rgba(...) with the given alpha. Used for translucent
 *  brand-colour fills via inline style — Tailwind's `bg-secondary/55` style
 *  utilities don't reliably pick up the data-brand cascade with @theme inline,
 *  so brand-coloured surfaces are set inline from BRANDS[brandId].colors. */
function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SECTION_ICON: Record<SectionIconKey, LucideIcon> = {
  director: ShieldCheck,
  formation: Building2,
  bank: Landmark,
  vat: ReceiptText,
  paye: Coins,
  ir35: Briefcase,
  freeagent: MonitorSmartphone,
};

const INCLUDED: { icon: LucideIcon; label: string }[] = [
  { icon: UserCheck, label: 'Dedicated accountant' },
  { icon: MessageCircle, label: 'Unlimited advice' },
  { icon: Monitor, label: 'FreeAgent included' },
  { icon: BadgeCheck, label: 'No minimum contract' },
];

function SectionHeader({
  num,
  eyebrow,
  title,
  primaryColor,
}: {
  num: string;
  eyebrow: string;
  title: string;
  primaryColor: string;
}) {
  return (
    <div className="flex items-start gap-4 break-after-avoid">
      <span
        className="text-[46px] font-extrabold leading-[0.8]"
        style={{ color: primaryColor, opacity: 0.15 }}
      >
        {num}
      </span>
      <div className="pt-1">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: primaryColor }}
        >
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-[24px] font-extrabold tracking-tight text-text">{title}</h2>
      </div>
    </div>
  );
}

export default function OnboardingGuide({ data }: { data: OnboardingGuideData }) {
  const sections = getSections(data);
  const deadlines = getDeadlines(data.variant);
  const faqs = getFaqs(data);
  const quickWins = getQuickWins(data.variant);
  const showLearnLinks = HAS_LEARN_CENTRE[data.brandId];
  const learnTopics = showLearnLinks ? getLearnTopics(data) : [];
  const LEARN_ICON: Record<LearnTopicIconKey, LucideIcon> = {
    expenses: ReceiptText,
    taxsaving: Sparkles,
    freeagent: MonitorSmartphone,
    selfassessment: FileText,
    director: ShieldCheck,
    companieshouse: Building2,
    ir35: Briefcase,
  };
  const CHANNEL_ICON: Record<ContactChannelIcon, LucideIcon> = {
    mail: Mail,
    phone: Phone,
    monitor: Monitor,
    calendar: CalendarDays,
  };
  const brand = BRANDS[data.brandId];
  const logo = `/brand/${data.brandId}/logo.png`;
  const accInitials = data.accountant.name
    .split(' ')
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Brand palette — referenced inline for any surface that picks up a brand
  // colour. Driving these from BRANDS[brandId].colors directly (rather than
  // through Tailwind utilities like `bg-secondary`) guarantees the right
  // palette flows through; the data-brand cascade isn't reliable for every
  // Tailwind utility under @theme inline.
  const isWorkwell = data.brandId === 'workwell';
  const c = brand.colors;
  const coverGradient = isWorkwell
    ? `linear-gradient(to bottom right, ${c.primary}, ${c.primaryDark}, ${c.secondary})`
    : `linear-gradient(to bottom right, ${c.primary}, ${c.primary}, ${c.primaryDark})`;
  const footerGradient = `linear-gradient(to bottom right, ${c.primaryDark}, ${c.primary})`;
  const iconTileGradient = `linear-gradient(to bottom right, ${c.primary}, ${c.primaryDark})`;
  const secondaryButtonGradient = `linear-gradient(to bottom right, ${c.secondary}, ${c.secondaryDark})`;

  const stats = [
    { value: `${brand.stats.years}+`, label: "Years' experience" },
    { value: `${brand.stats.businesses.toLocaleString()}+`, label: 'Businesses supported' },
    { value: 'Unlimited', label: 'Accountant support' },
  ];

  return (
    <div
      data-brand={data.brandId}
      className="onboarding-guide mx-auto bg-white font-sans text-text"
      style={
        {
          width: '210mm',
          // Inline CSS variable overrides so Tailwind utilities that DO use
          // `var(--color-*)` pick up the brand palette. The literal inline
          // styles below cover anything @theme inline may have baked.
          '--color-primary': c.primary,
          '--color-primary-dark': c.primaryDark,
          '--color-primary-light': c.primaryLight,
          '--color-primary-50': c.primary50,
          '--color-secondary': c.secondary,
          '--color-secondary-dark': c.secondaryDark,
          '--color-secondary-light': c.secondaryLight,
          '--color-accent': c.accent,
          '--color-surface': c.surface,
          '--color-surface-alt': c.surfaceAlt,
          '--color-text': c.text,
          '--color-text-light': c.textLight,
        } as React.CSSProperties
      }
    >
      {/* ═══════════════ COVER (page 1) ═══════════════ */}
      <section
        className="relative flex min-h-[297mm] flex-col overflow-hidden text-white"
        style={{ backgroundImage: coverGradient }}
      >
        <span className="h-[7px] w-full shrink-0" style={{ backgroundColor: c.secondary }} />
        {/* decorative shapes */}
        <span className="absolute -right-32 -top-28 h-[380px] w-[380px] rounded-full bg-white/[0.13]" />
        <span className="absolute right-16 top-60 h-48 w-48 rounded-full border-2 border-white/20" />
        <span
          className="absolute -bottom-36 -left-28 h-[360px] w-[360px] rounded-full"
          style={{ backgroundColor: hexAlpha(c.secondary, isWorkwell ? 0.55 : 0.3) }}
        />
        <span className="absolute bottom-44 left-24 h-24 w-24 rounded-full border-2 border-white/15" />

        {/* logo */}
        <div className="relative px-[20mm] pt-[18mm]">
          <span className="inline-flex rounded-xl bg-white px-5 py-3 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={data.brandName} className="h-8 w-auto" />
          </span>
        </div>

        {/* hero */}
        <div className="relative flex flex-1 flex-col justify-center px-[20mm]">
          <p className="text-[13px] font-bold uppercase tracking-[0.36em] text-white/70">
            Onboarding Guide
          </p>
          <h1 className="mt-5 text-[60px] font-extrabold leading-[1.0]">
            Welcome aboard,
            <br />
            {data.clientFirstName}.
          </h1>
          <div className="mt-7 h-[6px] w-28 rounded-full" style={{ backgroundColor: c.secondary }} />
          <p className="mt-7 max-w-[132mm] text-[17px] leading-relaxed text-white/85">
            Everything you need for a confident start with {data.brandName} — your next
            steps, the essentials, and how to reach us whenever you need.
          </p>
          <p className="mt-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Prepared for {data.companyName}
          </p>
        </div>

        {/* stat strip */}
        <div className="relative mx-[20mm] mb-[20mm] grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-6 text-center">
              <p className="text-[28px] font-extrabold leading-none">{s.value}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CONTENT (page 2+) ═══════════════ */}

      {/* Running header + intro */}
      <section className="break-before-page flex items-center justify-between border-b border-border px-[20mm] pb-5 pt-[16mm]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={data.brandName} className="h-6 w-auto opacity-90" />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-text-light">
          Onboarding Guide
        </span>
      </section>

      <section className="px-[20mm] pt-[10mm]">
        <p className="text-[14.5px] leading-[1.78] text-text-light">{welcomeIntro(data)}</p>
      </section>

      {/* Compact accountant strip — name + generic bio, no photo, no quote */}
      <section className="px-[20mm] pt-[11mm]">
        <div className="flex break-inside-avoid items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white shadow-md"
            style={{ backgroundImage: iconTileGradient }}
          >
            {accInitials}
          </div>
          <div className="flex-1">
            <p className="text-[14px] text-text">
              <span className="font-extrabold">{data.accountant.name}</span>
              <span className="font-medium text-text-light"> · Your dedicated accountant</span>
            </p>
            <p className="mt-0.5 text-[12px] leading-[1.55] text-text-light">
              {ACCOUNTANT_BIO}
            </p>
          </div>
        </div>
      </section>

      {/* Get started — your first three actions */}
      <section className="px-[20mm] pt-[12mm]">
        <div
          className="break-inside-avoid rounded-2xl border-2 border-dashed px-7 py-7"
          style={{
            borderColor: c.secondary,
            backgroundColor: hexAlpha(c.secondary, 0.07),
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: c.secondaryDark }}
          >
            Get started
          </p>
          <h2 className="mt-1.5 text-[24px] font-extrabold leading-tight tracking-tight text-text">
            Your first three actions
          </h2>
          <p className="mt-2 max-w-[140mm] text-[12.5px] leading-[1.6] text-text-light">
            These three things need to happen before we can begin work for you. We&rsquo;ll
            guide you through each — but they sit on your side to action.
          </p>
          <ol className="mt-7 space-y-6">
            {[
              {
                id: 'engagement',
                title: 'Sign your engagement letter',
                body: ENGAGEMENT_LETTER_EXPLANATION,
              },
              {
                id: 'credas',
                title: 'Complete your ID verification (Credas)',
                body: credasExplanation(data),
              },
              {
                id: 'intro',
                title: 'Book your introductory call',
                body: introCallExplanation(data),
              },
            ].map((item, i) => (
              <li key={item.id} className="flex break-inside-avoid items-start gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white shadow-md"
                  style={{ backgroundImage: secondaryButtonGradient }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[15px] font-extrabold text-text">{item.title}</h3>
                    {item.id === 'intro' &&
                      (data.dates.welcomeCall ? (
                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-bold text-white"
                          style={{ backgroundColor: c.primary }}
                        >
                          {data.dates.welcomeCall}
                        </span>
                      ) : (
                        <a
                          href={data.calendlyUrl ?? `mailto:${data.accountant.email}`}
                          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-white no-underline shadow-sm"
                          style={{ backgroundImage: secondaryButtonGradient }}
                        >
                          {data.calendlyUrl ? 'Book your call' : 'Reply to book'}
                          <ArrowRight size={12} />
                        </a>
                      ))}
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-[1.65] text-text-light">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 01 — How we'll work with you (three phases) */}
      <section className="mt-[12mm] bg-surface px-[20mm] py-[14mm]">
        <SectionHeader
          num="01"
          eyebrow="How we'll work with you"
          title="From here, in three phases"
          primaryColor={c.primary}
        />
        <div className="mt-8 space-y-4">
          {WORKING_PHASES.map((phase) => (
            <article
              key={phase.num}
              className="flex break-inside-avoid items-start gap-6 rounded-2xl border border-border bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
            >
              <p
                className="shrink-0 text-[44px] font-extrabold leading-[0.85]"
                style={{ color: c.primary, opacity: 0.2, width: '60px' }}
              >
                {phase.num}
              </p>
              <div className="flex-1">
                <h3 className="text-[18px] font-extrabold text-text">{phase.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.7] text-text-light">{phase.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 02 — What you can expect from us (2-up grid with gradient icon tiles) */}
      <section className="px-[20mm] py-[14mm]">
        <SectionHeader
          num="02"
          eyebrow="What you can expect from us"
          title="Our service standards"
          primaryColor={c.primary}
        />
        <div className="mt-7 grid grid-cols-2 gap-4">
          {WHAT_TO_EXPECT.map((item) => (
            <div
              key={item.title}
              className="break-inside-avoid rounded-2xl border border-border bg-white p-5 shadow-[0_3px_14px_rgba(15,23,42,0.06)]"
            >
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                style={{ backgroundImage: iconTileGradient }}
              >
                <Check size={20} strokeWidth={2.5} />
              </div>
              <p className="text-[14px] font-extrabold leading-snug text-text">{item.title}</p>
              <p className="mt-1.5 text-[12px] leading-[1.6] text-text-light">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — How and when to reach us */}
      <section className="bg-surface px-[20mm] py-[14mm]">
        <SectionHeader
          num="03"
          eyebrow="How and when to reach us"
          title="The easiest ways to get hold of us"
          primaryColor={c.primary}
        />
        <div className="mt-7 grid grid-cols-2 gap-4">
          {CONTACT_CHANNELS.map((ch) => {
            const Icon = CHANNEL_ICON[ch.iconKey];
            return (
              <div
                key={ch.iconKey}
                className="flex break-inside-avoid items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ backgroundImage: iconTileGradient }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13.5px] font-extrabold text-text">{ch.label}</p>
                  <p className="mt-1 text-[12px] leading-[1.55] text-text-light">{ch.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex break-inside-avoid items-start gap-3 rounded-xl border border-border bg-white p-4">
          <Clock size={18} className="mt-0.5 shrink-0" style={{ color: c.primary }} />
          <p className="text-[12px] leading-[1.6] text-text-light">{OFFICE_HOURS}</p>
        </div>
      </section>

      {/* 04 — Key deadlines (brand-coloured accent + emphasised "when") */}
      <section className="bg-surface px-[20mm] py-[14mm]">
        <SectionHeader
          num="04"
          eyebrow="Key deadlines"
          title="The dates we'll be working to"
          primaryColor={c.primary}
        />
        <ul className="mt-7 space-y-3">
          {deadlines.map((d) => (
            <li
              key={d.label}
              className="flex break-inside-avoid items-start gap-4 overflow-hidden rounded-r-2xl bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
              style={{ borderLeft: `4px solid ${c.primary}` }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                style={{ backgroundImage: iconTileGradient }}
              >
                <CalendarDays size={18} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-extrabold text-text">{d.label}</p>
                <p
                  className="mt-1 text-[12px] font-semibold"
                  style={{ color: c.primary }}
                >
                  {d.when}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 — Common questions (Q/A badge styling) */}
      <section className="px-[20mm] py-[14mm]">
        <SectionHeader
          num="05"
          eyebrow="Common questions"
          title="In your first month"
          primaryColor={c.primary}
        />
        <div className="mt-7 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="break-inside-avoid rounded-2xl border border-border bg-white p-6 shadow-[0_3px_14px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white shadow-md"
                  style={{ backgroundImage: iconTileGradient }}
                >
                  Q
                </span>
                <p className="pt-1 text-[14.5px] font-extrabold leading-snug text-text">
                  {faq.q}
                </p>
              </div>
              <div className="mt-4 flex items-start gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold"
                  style={{
                    backgroundColor: hexAlpha(c.primary, 0.12),
                    color: c.primary,
                  }}
                >
                  A
                </span>
                <div className="flex-1 pt-1.5">
                  <p className="text-[12.5px] leading-[1.7] text-text-light">{faq.a}</p>
                  {showLearnLinks && faq.slug && (
                    <a
                      href={`https://${brand.domain}${faq.slug}`}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold no-underline"
                      style={{ color: c.primary }}
                    >
                      Read the full article
                      <ArrowRight size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — Quick wins (accent border + numbered badges) */}
      <section className="bg-surface px-[20mm] py-[14mm]">
        <SectionHeader
          num="06"
          eyebrow="Quick wins"
          title="For your first year"
          primaryColor={c.primary}
        />
        <ul className="mt-7 space-y-3">
          {quickWins.map((w, i) => (
            <li
              key={w.title}
              className="flex break-inside-avoid items-start gap-4 rounded-xl border-l-[5px] px-5 py-4"
              style={{
                borderColor: c.secondary,
                backgroundColor: hexAlpha(c.secondary, 0.09),
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white shadow-md"
                style={{ backgroundImage: secondaryButtonGradient }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-extrabold text-text">{w.title}</p>
                <p className="mt-1 text-[12px] leading-[1.6] text-text-light">{w.body}</p>
              </div>
              <Sparkles
                size={16}
                strokeWidth={2}
                className="mt-1 shrink-0"
                style={{ color: c.secondary }}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* 07 — The essentials (deeper educational topics — moved to the end) */}
      <section className="px-[20mm] py-[14mm]">
        <SectionHeader
          num="07"
          eyebrow="The essentials"
          title="Getting set up the right way"
          primaryColor={c.primary}
        />
        <div className="mt-8 space-y-4">
          {sections.map((sec) => {
            const Icon = SECTION_ICON[sec.icon];
            const paragraphs = sec.body(data).split('\n\n');
            return (
              <article
                key={sec.id}
                className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_3px_16px_rgba(15,23,42,0.07)]"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ backgroundImage: iconTileGradient }}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15.5px] font-extrabold leading-snug text-text">
                    {sectionTitle(sec, data)}
                  </h3>
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className={
                        (i === 0 ? 'mt-1.5' : 'mt-2.5') +
                        ' text-[12.5px] leading-[1.65] text-text-light'
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Where to learn more — topic-tile panel pointing at learn-centre hubs.
          Brand-aware: only rendered for brands that have a learn centre live
          (currently Clever only — flip HAS_LEARN_CENTRE.workwell when ready). */}
      {learnTopics.length > 0 && (
        <section className="px-[20mm] py-[14mm]">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: c.primary }}
          >
            Explore more
          </p>
          <h2 className="mt-2 text-[24px] font-extrabold leading-tight tracking-tight text-text">
            Where to learn more
          </h2>
          <p className="mt-2 max-w-[140mm] text-[12.5px] leading-[1.6] text-text-light">
            Our learn centre has full guides on the questions that come up most. A few
            worth bookmarking:
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {learnTopics.map((t) => {
              const Icon = LEARN_ICON[t.iconKey];
              return (
                <a
                  key={t.slug}
                  href={`https://${brand.domain}${t.slug}`}
                  className="flex break-inside-avoid items-center gap-4 rounded-2xl border border-border bg-white p-4 no-underline shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                    style={{ backgroundImage: iconTileGradient }}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-extrabold text-text">{t.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-[1.45] text-text-light">
                      {t.blurb}
                    </p>
                  </div>
                  <ArrowRight size={14} className="shrink-0" style={{ color: c.primary }} />
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* The team behind your accountant (richer: brand-tinted decorative blob + numbered role badges) */}
      <section className="bg-surface px-[20mm] py-[14mm]">
        <div className="relative overflow-hidden break-inside-avoid rounded-3xl border border-border bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.07)]">
          <span
            className="absolute -right-10 -top-10 h-36 w-36 rounded-full"
            style={{ backgroundColor: hexAlpha(c.primary, 0.07) }}
          />
          <span
            className="absolute -bottom-14 -left-10 h-44 w-44 rounded-full"
            style={{ backgroundColor: hexAlpha(c.secondary, 0.07) }}
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                style={{ backgroundImage: iconTileGradient }}
              >
                <Users size={20} strokeWidth={2} />
              </div>
              <div>
                <p
                  className="text-[10.5px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: c.primary }}
                >
                  Behind the scenes
                </p>
                <h3 className="text-[18px] font-extrabold leading-tight text-text">
                  The team behind your accountant
                </h3>
              </div>
            </div>
            <p className="mt-4 max-w-[140mm] text-[12.5px] leading-[1.6] text-text-light">
              {TEAM_INTRO}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {TEAM_ROLES.map((r, i) => (
                <li
                  key={r.role}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white shadow-sm"
                      style={{ backgroundImage: iconTileGradient }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[12.5px] font-extrabold text-text">{r.role}</p>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-[1.55] text-text-light">
                    {r.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What's included (tinted band) */}
      <section className="break-inside-avoid bg-surface px-[20mm] py-[13mm]">
        <p
          className="text-center text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: c.primary }}
        >
          Included as standard
        </p>
        <h2 className="mt-2 text-center text-[22px] font-extrabold tracking-tight text-text">
          What every {data.brandName} client gets
        </h2>
        <div className="mt-8 grid grid-cols-4 gap-4">
          {INCLUDED.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex flex-col items-center rounded-2xl border border-border bg-white px-4 py-6 text-center shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md"
                  style={{ backgroundImage: iconTileGradient }}
                >
                  <Icon size={21} strokeWidth={2} />
                </div>
                <p className="mt-3 text-[12px] font-bold leading-tight text-text">{f.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact footer */}
      <footer
        className="relative flex break-inside-avoid flex-col overflow-hidden px-[20mm] py-[16mm] text-white"
        style={{ backgroundImage: footerGradient }}
      >
        <span className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/[0.07]" />
        <span className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-2 border-white/10" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">
            We&rsquo;re here for you
          </p>
          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-[25px] font-extrabold">{data.accountant.name}</p>
              <p className="text-[13px] text-white/70">Your accountant · {data.brandName}</p>
            </div>
            <div className="shrink-0 space-y-2 text-right text-[13px]">
              <p className="flex items-center justify-end gap-2">
                <Mail size={15} style={{ color: c.secondary }} />
                {data.accountant.email}
              </p>
              <p className="flex items-center justify-end gap-2">
                <Phone size={15} style={{ color: c.secondary }} />
                {data.accountant.phone}
              </p>
            </div>
          </div>
          <p className="mt-6 flex items-center gap-2 border-t border-white/15 pt-5 text-[12px] leading-[1.6] text-white/70">
            <ArrowRight size={14} className="shrink-0" style={{ color: c.secondary }} />
            Call or email as often as you need — unlimited advice is part of your package.
            General enquiries: {data.support.email} · {data.support.phone}
          </p>
        </div>
      </footer>

      <GuideDownloadButton
        brandId={data.brandId}
        variant={data.variant}
        brandColor={c.primary}
        brandColorDark={c.primaryDark}
      />
    </div>
  );
}
