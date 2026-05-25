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
  Wallet,
  MonitorSmartphone,
  UserCheck,
  MessageCircle,
  Monitor,
  BadgeCheck,
  Phone,
  Mail,
  ArrowRight,
  Quote,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { BRANDS } from '@/lib/constants';
import {
  getSections,
  getTips,
  welcomeIntro,
  JOURNEY_STAGES,
  type OnboardingGuideData,
  type SectionIconKey,
} from '@/content/onboarding-guide';
import GuideDownloadButton from './GuideDownloadButton';

const SECTION_ICON: Record<SectionIconKey, LucideIcon> = {
  director: ShieldCheck,
  formation: Building2,
  vat: ReceiptText,
  wages: Wallet,
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
}: {
  num: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-4 break-after-avoid">
      <span className="text-[46px] font-extrabold leading-[0.8] text-primary/15">{num}</span>
      <div className="pt-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h2 className="mt-1.5 text-[24px] font-extrabold tracking-tight text-text">{title}</h2>
      </div>
    </div>
  );
}

export default function OnboardingGuide({ data }: { data: OnboardingGuideData }) {
  const sections = getSections(data.variant);
  const tips = getTips(data.variant);
  const brand = BRANDS[data.brandId];
  const logo = `/brand/${data.brandId}/logo.png`;
  const accFirstName = data.accountant.name.split(' ')[0];
  const accInitials = data.accountant.name
    .split(' ')
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const stats = [
    { value: `${brand.stats.years}+`, label: "Years' experience" },
    { value: `${brand.stats.businesses.toLocaleString()}+`, label: 'Businesses supported' },
    { value: 'Unlimited', label: 'Accountant support' },
  ];

  return (
    <div
      data-brand={data.brandId}
      className="onboarding-guide mx-auto bg-white font-sans text-text"
      style={{ width: '210mm' }}
    >
      {/* ═══════════════ COVER (page 1) ═══════════════ */}
      <section className="relative flex min-h-[297mm] flex-col overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
        <span className="h-[7px] w-full shrink-0 bg-secondary" />
        {/* decorative shapes */}
        <span className="absolute -right-32 -top-28 h-[380px] w-[380px] rounded-full bg-white/[0.13]" />
        <span className="absolute right-16 top-60 h-48 w-48 rounded-full border-2 border-white/20" />
        <span className="absolute -bottom-36 -left-28 h-[360px] w-[360px] rounded-full bg-secondary/30" />
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
          <div className="mt-7 h-[6px] w-28 rounded-full bg-secondary" />
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

      {/* Accountant personal note */}
      <section className="px-[20mm] pt-[11mm]">
        <div className="relative flex break-inside-avoid gap-6 overflow-hidden rounded-2xl border border-border bg-surface p-6">
          <span className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/[0.06]" />
          {data.accountant.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.accountant.photoUrl}
              alt={data.accountant.name}
              className="relative h-[92px] w-[92px] shrink-0 rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-[28px] font-extrabold text-white shadow-md">
              {accInitials}
            </div>
          )}
          <div className="relative">
            <Quote size={22} className="text-primary/25" />
            <p className="mt-1 text-[13.5px] italic leading-[1.7] text-text">
              Hi {data.clientFirstName}, I&rsquo;m {accFirstName} — I&rsquo;ll be your
              dedicated accountant. I&rsquo;m here whenever you need me, so please
              don&rsquo;t hesitate to get in touch. I&rsquo;m looking forward to working
              together.
            </p>
            <p className="mt-3 text-[14px] font-extrabold text-text">{data.accountant.name}</p>
            <p className="text-[11.5px] font-medium text-text-light">
              Your dedicated accountant · {data.brandName}
            </p>
          </div>
        </div>
      </section>

      {/* 01 — Journey (tinted band) */}
      <section className="mt-[12mm] bg-surface px-[20mm] py-[14mm]">
        <SectionHeader num="01" eyebrow="Step by step" title="What happens next" />
        <ol className="mt-8">
          {JOURNEY_STAGES.map((stage, i) => {
            const date = data.dates[stage.key];
            const isLast = i === JOURNEY_STAGES.length - 1;
            return (
              <li key={stage.key} className="relative flex break-inside-avoid gap-5 pb-4 last:pb-0">
                {!isLast && (
                  <span className="absolute bottom-1 left-[22px] top-12 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/15" />
                )}
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-[16px] font-extrabold text-white shadow-md">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-2xl border border-border bg-white px-5 py-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[15px] font-extrabold text-text">{stage.label}</h3>
                    <span
                      className={
                        date
                          ? 'rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white'
                          : 'rounded-full bg-border px-3 py-1 text-[11px] font-semibold text-text-light'
                      }
                    >
                      {date ?? 'To be confirmed'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-[1.6] text-text-light">
                    {stage.blurb}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 02 — Essentials (white, 2-up grid) */}
      <section className="px-[20mm] py-[14mm]">
        <SectionHeader num="02" eyebrow="The essentials" title="Getting set up the right way" />
        <div className="mt-8 grid grid-cols-2 gap-4">
          {sections.map((sec) => {
            const Icon = SECTION_ICON[sec.icon];
            return (
              <article
                key={sec.id}
                className="flex break-inside-avoid flex-col rounded-2xl border border-border bg-white p-5 shadow-[0_3px_16px_rgba(15,23,42,0.07)]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-md">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-extrabold leading-snug text-text">{sec.title}</h3>
                <p className="mt-1.5 text-[12px] leading-[1.6] text-text-light">{sec.body(data)}</p>
              </article>
            );
          })}
        </div>

        {/* Good-to-know callouts */}
        <div className="mt-5 space-y-3">
          {tips.map((tip) => (
            <div
              key={tip}
              className="flex break-inside-avoid gap-3 rounded-xl border-l-[5px] border-secondary bg-secondary/[0.09] px-5 py-4"
            >
              <Lightbulb size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-secondary-dark" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary-dark">
                  Good to know
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.6] text-text">{tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's included (tinted band) */}
      <section className="break-inside-avoid bg-surface px-[20mm] py-[13mm]">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-md">
                  <Icon size={21} strokeWidth={2} />
                </div>
                <p className="mt-3 text-[12px] font-bold leading-tight text-text">{f.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact footer */}
      <footer className="relative flex break-inside-avoid flex-col overflow-hidden bg-gradient-to-br from-primary-dark to-primary px-[20mm] py-[16mm] text-white">
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
                <Mail size={15} className="text-secondary" />
                {data.accountant.email}
              </p>
              <p className="flex items-center justify-end gap-2">
                <Phone size={15} className="text-secondary" />
                {data.accountant.phone}
              </p>
            </div>
          </div>
          <p className="mt-6 flex items-center gap-2 border-t border-white/15 pt-5 text-[12px] leading-[1.6] text-white/70">
            <ArrowRight size={14} className="shrink-0 text-secondary" />
            Call or email as often as you need — unlimited advice is part of your package.
            General enquiries: {data.support.email} · {data.support.phone}
          </p>
        </div>
      </footer>

      <GuideDownloadButton />
    </div>
  );
}
