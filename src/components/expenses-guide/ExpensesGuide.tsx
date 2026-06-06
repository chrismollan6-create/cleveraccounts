/**
 * ExpensesGuide — the expenses guide document.
 *
 * Pure presentational server component. Rendered at A4 width and turned into
 * a PDF by headless Chrome (see /api/expenses-guide/pdf). Brand theming works
 * by setting `data-brand` on the root <div>: the [data-brand="…"] rules in
 * globals.css re-define --color-* / --font-sans tokens for the subtree.
 */

import {
  Home,
  Car,
  Smartphone,
  Package,
  Monitor,
  CreditCard,
  BookOpen,
  Landmark,
  Megaphone,
  Umbrella,
  PiggyBank,
  Gift,
  Users,
  Wrench,
  HardHat,
  Stethoscope,
  Camera,
  Receipt,
  AlertTriangle,
  ArrowRight,
  Check,
  Briefcase,
  FileText,
  Mail,
  Phone,
  Sparkles,
  X,
  Zap,
  Truck,
  UtensilsCrossed,
  ShoppingBag,
  BarChart2,
  type LucideIcon,
} from 'lucide-react';
import { BRANDS } from '@/lib/constants';
import {
  GOLDEN_RULE,
  EVERYDAY_ESSENTIALS,
  LTD_EXTRAS,
  CONTRACTOR_ITEMS,
  TRAVEL_ITEMS,
  GREY_AREAS,
  RECORD_KEEPING,
  HAS_LEARN_CENTRE,
  LEARN_CENTRE_DOMAIN,
  getLearnItems,
  getHomeOfficeContent,
  getSectorBlock,
  variantIntro,
  type ExpensesGuideData,
  type EssentialIconKey,
  type GreyIconKey,
  type RecordIconKey,
} from '@/content/expenses-guide';

function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
        style={{ color: primaryColor, opacity: 0.13 }}
      >
        {num}
      </span>
      <div className="pt-1">
        <p
          className="text-[10.5px] font-bold uppercase tracking-[0.24em]"
          style={{ color: primaryColor }}
        >
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-[23px] font-extrabold tracking-tight text-text">{title}</h2>
      </div>
    </div>
  );
}

/** Inline "pro tip" callout — used for high-value insights the client might not know */
function ProTip({
  children,
  secondaryColor,
  secondaryBg,
}: {
  children: React.ReactNode;
  secondaryColor: string;
  secondaryBg: string;
}) {
  return (
    <div
      className="flex break-inside-avoid items-start gap-3 rounded-xl border-l-[4px] p-4"
      style={{ borderColor: secondaryColor, backgroundColor: secondaryBg }}
    >
      <Zap size={15} className="mt-0.5 shrink-0" style={{ color: secondaryColor }} />
      <p className="text-[11.5px] leading-[1.65] text-text-light">
        <strong className="font-extrabold text-text">Pro tip: </strong>
        {children}
      </p>
    </div>
  );
}

const ESSENTIAL_ICON: Record<EssentialIconKey, LucideIcon> = {
  home: Home,
  car: Car,
  phone: Smartphone,
  supplies: Package,
  software: Monitor,
  subscriptions: CreditCard,
  training: BookOpen,
  bank: Landmark,
  advertising: Megaphone,
  insurance: Umbrella,
};

const GREY_ICON: Record<GreyIconKey, LucideIcon> = {
  entertaining: Users,
  clothing: X,
  commute: Car,
  fines: AlertTriangle,
  food: Receipt,
};

const RECORD_ICON: Record<RecordIconKey, LucideIcon> = {
  receipts: Receipt,
  mileage: Car,
  bank: Landmark,
  freeagent: Monitor,
};

export default function ExpensesGuide({ data }: { data: ExpensesGuideData }) {
  const brand = BRANDS[data.brandId];
  const logo = `/brand/${data.brandId}/logo.png`;
  const c = brand.colors;

  const isWorkwell = data.brandId === 'workwell';
  const coverGradient = isWorkwell
    ? `linear-gradient(135deg, ${c.primary} 0%, ${c.primaryDark} 60%, ${c.secondary} 100%)`
    : `linear-gradient(135deg, ${c.primary} 0%, ${c.primaryDark} 100%)`;
  const footerGradient = `linear-gradient(135deg, ${c.primaryDark} 0%, ${c.primary} 100%)`;
  const iconTileGradient = `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`;
  const secondaryButtonGradient = `linear-gradient(135deg, ${c.secondary}, ${c.secondaryDark})`;

  const isPsc = data.clientType === 'PSC';
  const isLtd = data.variant === 'ltd';
  const sector = data.sector ?? 'general';
  const sectorBlock = getSectorBlock(sector);
  const homeOffice = getHomeOfficeContent(data);
  const showLearnLinks = HAS_LEARN_CENTRE[data.brandId];
  const learnItems = showLearnLinks ? getLearnItems(data) : [];

  const accInitials = data.accountant.name
    .split(' ')
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Determine guide sections for the cover "what's inside" strip
  const coverTopics = [
    'Everyday essentials',
    'Working from home',
    'Travel & mileage',
    isLtd ? 'Ltd company extras' : null,
    isPsc ? 'Contractor rules' : null,
    sector === 'cis' ? 'CIS / Construction' : sector === 'medical' ? 'Healthcare' : sector === 'creative' ? 'Creative & tech' : null,
    'Grey areas',
    'Record-keeping',
  ].filter(Boolean) as string[];

  // Section numbering
  let sectionNum = 1;
  const nextNum = () => String(sectionNum++).padStart(2, '0');

  const secondaryBg = hexAlpha(c.secondary, 0.08);
  const warnAmber = '#D97706'; // warm amber for warning/not-allowed treatments

  return (
    <div
      data-brand={data.brandId}
      className="mx-auto bg-white font-sans text-text"
      style={
        {
          width: '210mm',
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
      {/* ═══════════════ COVER ═══════════════ */}
      <section
        className="relative flex min-h-[297mm] flex-col overflow-hidden text-white"
        style={{ backgroundImage: coverGradient }}
      >
        {/* top accent stripe */}
        <span className="h-[7px] w-full shrink-0" style={{ backgroundColor: c.secondary }} />

        {/* decorative shapes */}
        <span className="absolute -right-32 -top-28 h-[400px] w-[400px] rounded-full bg-white/[0.10]" />
        <span className="absolute right-20 top-56 h-52 w-52 rounded-full border-[1.5px] border-white/[0.18]" />
        <span
          className="absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full"
          style={{ backgroundColor: hexAlpha(c.secondary, isWorkwell ? 0.50 : 0.25) }}
        />
        <span className="absolute bottom-52 left-28 h-20 w-20 rounded-full border-[1.5px] border-white/[0.13]" />

        {/* logo */}
        <div className="relative px-[20mm] pt-[18mm]">
          <span className="inline-flex rounded-xl bg-white px-5 py-3 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={data.brandName} className="h-8 w-auto" />
          </span>
        </div>

        {/* hero */}
        <div className="relative flex flex-1 flex-col justify-center px-[20mm]">
          <p className="text-[12px] font-bold uppercase tracking-[0.38em] text-white/60">
            Expenses Guide
          </p>
          <h1 className="mt-5 text-[58px] font-extrabold leading-[1.0] tracking-tight">
            Know what you
            <br />
            can claim.
          </h1>
          <div className="mt-7 h-[5px] w-24 rounded-full" style={{ backgroundColor: c.secondary }} />
          <p className="mt-7 max-w-[130mm] text-[16px] leading-[1.7] text-white/80">
            The everyday essentials, the money-savers most businesses miss, and
            the ones to approach with care — for {data.variant === 'ltd' ? 'limited companies' : 'sole traders'}.
          </p>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Prepared for {data.companyName}
          </p>

          {/* "What's inside" topic pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {coverTopics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/25 bg-white/[0.12] px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* key figures strip */}
        <div className="relative mx-[20mm] mb-[20mm] grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.09]">
          {[
            { value: '£312/yr', label: 'Home office minimum (flat rate)' },
            { value: '55p/mile', label: 'HMRC approved mileage rate (2026/27)' },
            { value: isLtd ? '£300/yr' : '6 yrs', label: isLtd ? 'Director trivial benefits cap' : 'Records you must keep' },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5 text-center">
              <p className="text-[24px] font-extrabold leading-none tracking-tight">{s.value}</p>
              <p className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CONTENT ═══════════════ */}

      {/* Running header */}
      <section className="break-before-page flex items-center justify-between border-b border-border px-[20mm] pb-5 pt-[16mm]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={data.brandName} className="h-6 w-auto opacity-90" />
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-light">
          Expenses Guide · {data.companyName}
        </span>
      </section>

      {/* Intro copy + accountant strip side by side */}
      <section className="px-[20mm] pt-[10mm]">
        <p className="text-[14px] leading-[1.82] text-text-light">{variantIntro(data)}</p>
        <div className="mt-6 flex break-inside-avoid items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white shadow-md"
            style={{ backgroundImage: iconTileGradient }}
          >
            {accInitials}
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] text-text">
              <span className="font-extrabold">{data.accountant.name}</span>
              <span className="font-medium text-text-light"> · Your dedicated accountant</span>
            </p>
            <p className="mt-0.5 text-[11.5px] leading-[1.55] text-text-light">
              Anything in this guide that looks relevant to your situation — call or email us first.
              We&rsquo;d always rather you check before claiming than have to unwind it later.
            </p>
          </div>
        </div>
      </section>

      {/* The golden rule — 2-column: rule + quick examples */}
      <section className="px-[20mm] pt-[9mm]">
        <div
          className="break-inside-avoid overflow-hidden rounded-2xl border"
          style={{ borderColor: hexAlpha(c.primary, 0.18), backgroundColor: hexAlpha(c.primary, 0.04) }}
        >
          <div className="flex divide-x" style={{ borderColor: hexAlpha(c.primary, 0.12) }}>
            {/* Left: the rule */}
            <div className="flex-1 p-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.24em]"
                style={{ color: c.primary }}
              >
                The fundamental test
              </p>
              <h3 className="mt-1.5 text-[15px] font-extrabold text-text">{GOLDEN_RULE.title}</h3>
              <p className="mt-2 text-[12px] leading-[1.65] text-text-light">{GOLDEN_RULE.body}</p>
            </div>
            {/* Right: quick examples */}
            <div className="w-[62mm] shrink-0 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">
                Quick examples
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { ok: true, label: 'FreeAgent subscription' },
                  { ok: true, label: 'Business mileage' },
                  { ok: true, label: 'Professional training' },
                  { ok: false, label: 'Client entertaining' },
                  { ok: false, label: 'Everyday clothing' },
                  { ok: false, label: 'Commuting costs' },
                ].map((ex) => (
                  <li key={ex.label} className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                      style={{ backgroundColor: ex.ok ? c.primary : warnAmber }}
                    >
                      {ex.ok ? '✓' : '✗'}
                    </span>
                    <span className="text-[11.5px] text-text-light">{ex.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 01: Everyday essentials ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className="mt-[11mm] bg-surface px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Applies to every business"
              title="The everyday essentials"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              These deductions are available whether you trade as a sole trader or through a
              limited company. Badges highlight the ones clients most often under-claim.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {EVERYDAY_ESSENTIALS.map((item) => {
                const Icon = ESSENTIAL_ICON[item.iconKey];
                return (
                  <div
                    key={item.iconKey}
                    className="break-inside-avoid rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                  >
                    {/* icon + optional badge row */}
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                        style={{ backgroundImage: iconTileGradient }}
                      >
                        <Icon size={19} strokeWidth={2} />
                      </div>
                      {item.badge && (
                        <span
                          className="rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide text-white"
                          style={{ backgroundColor: c.secondary }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-extrabold leading-snug text-text">
                      {item.title}
                    </p>
                    {item.stat && (
                      <p
                        className="mt-0.5 text-[15px] font-extrabold leading-tight"
                        style={{ color: c.primary }}
                      >
                        {item.stat}
                      </p>
                    )}
                    <p className="mt-1.5 text-[11.5px] leading-[1.62] text-text-light">{item.body}</p>
                    {showLearnLinks && item.learnSlug && (
                      <a
                        href={`https://${LEARN_CENTRE_DOMAIN}${item.learnSlug}`}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold no-underline"
                        style={{ color: c.primary }}
                      >
                        Read more <ArrowRight size={10} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* ── 02: Working from home ── */}
      {(() => {
        const num = nextNum();
        const ho = homeOffice;
        return (
          <section className="px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="The claim most businesses under-use"
              title="Working from home"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              Two methods — one effortless, one more rewarding for intensive home workers.
              Either way, the claim is real and easily missed.
            </p>

            {/* Side-by-side method comparison */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Method A — green/easy */}
              <article
                className="flex break-inside-avoid flex-col rounded-2xl border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                style={{ borderColor: hexAlpha(c.primary, 0.25) }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundImage: iconTileGradient }}
                  >
                    <Home size={19} strokeWidth={2} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide text-white"
                    style={{ backgroundColor: c.primary }}
                  >
                    Easiest
                  </span>
                </div>
                <h3 className="text-[13.5px] font-extrabold leading-snug text-text">
                  {ho.fixedRate.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[11.5px] leading-[1.62] text-text-light">
                  {ho.fixedRate.body}
                </p>
              </article>

              {/* Method B — sparkle/higher */}
              <article
                className="flex break-inside-avoid flex-col rounded-2xl border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                style={{ borderColor: hexAlpha(c.secondary, 0.30) }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundImage: secondaryButtonGradient }}
                  >
                    <Sparkles size={19} strokeWidth={2} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide text-white"
                    style={{ backgroundColor: c.secondary }}
                  >
                    Higher claim
                  </span>
                </div>
                <h3 className="text-[13.5px] font-extrabold leading-snug text-text">
                  {ho.actualCosts.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[11.5px] leading-[1.62] text-text-light">
                  {ho.actualCosts.body}
                </p>
              </article>
            </div>

            {/* Ltd licence-to-occupy note */}
            {ho.ltdNote && (
              <article
                className="mt-4 flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundImage: secondaryButtonGradient }}
                >
                  <Landmark size={19} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p
                    className="mb-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: c.secondary }}
                  >
                    Limited company directors
                  </p>
                  <h3 className="text-[14px] font-extrabold leading-snug text-text">
                    {ho.ltdNote.title}
                  </h3>
                  <p className="mt-1.5 text-[11.5px] leading-[1.62] text-text-light">
                    {ho.ltdNote.body}
                  </p>
                </div>
              </article>
            )}

            {/* CGT warning */}
            <div
              className="mt-4 flex break-inside-avoid items-start gap-3 rounded-xl border-l-[4px] p-4"
              style={{ borderColor: warnAmber, backgroundColor: 'rgba(217,119,6,0.05)' }}
            >
              <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: warnAmber }} />
              <p className="text-[11.5px] leading-[1.62] text-text-light">
                <strong className="font-extrabold text-text">CGT note: </strong>
                {ho.warning}
              </p>
            </div>
          </section>
        );
      })()}

      {/* ── 03: Travel & subsistence ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className="bg-surface px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Knowing the rules pays off"
              title="Travel & subsistence"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              One of the most valuable expense categories — and one of the most commonly
              mis-claimed. The line between business travel and commuting is real and
              worth understanding.
            </p>
            <ul className="mt-6 space-y-3">
              {TRAVEL_ITEMS.map((item, i) => (
                <li
                  key={i}
                  className="flex break-inside-avoid items-start gap-4 overflow-hidden rounded-r-2xl bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
                  style={{ borderLeft: `4px solid ${c.primary}` }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundImage: iconTileGradient }}
                  >
                    <Car size={17} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-extrabold text-text">{item.title}</p>
                    <p className="mt-1 text-[11.5px] leading-[1.65] text-text-light">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Mileage quick-reference card */}
            <div
              className="mt-5 break-inside-avoid overflow-hidden rounded-2xl border shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
              style={{ borderColor: hexAlpha(c.primary, 0.20) }}
            >
              <div
                className="px-5 py-3"
                style={{ backgroundImage: iconTileGradient }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  HMRC Approved Mileage Rates — 2026/27 (increased from April 2026)
                </p>
              </div>
              <div className="divide-y divide-border bg-white">
                {[
                  { label: 'Car or van — first 10,000 miles', value: '55p / mile', highlight: true },
                  { label: 'Car or van — after 10,000 miles', value: '25p / mile', highlight: false },
                  { label: 'Electric car (personally owned)', value: '9p / mile fuel + 55p AMAP', highlight: false },
                  { label: 'Motorbike', value: '24p / mile', highlight: false },
                  { label: 'Bicycle', value: '20p / mile', highlight: false },
                  { label: 'Business passenger (per person)', value: '+5p / mile', highlight: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-5 py-2.5"
                    style={row.highlight ? { backgroundColor: hexAlpha(c.primary, 0.05) } : {}}
                  >
                    <p
                      className="text-[12px]"
                      style={{ color: row.highlight ? c.text : c.textLight }}
                    >
                      {row.label}
                    </p>
                    <p
                      className="text-[13px] font-extrabold"
                      style={{ color: row.highlight ? c.primary : c.text }}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── 04: Ltd extras (ltd only) ── */}
      {isLtd && (() => {
        const num = nextNum();
        return (
          <section className="px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Limited company advantages"
              title="Making the most of your company"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              Trading through a limited company opens up deductions that simply
              aren&rsquo;t available to sole traders. These are often the biggest single
              savings we identify.
            </p>

            {/* Key numbers banner */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              {[
                { value: '£60,000', label: 'Pension annual allowance' },
                { value: '£300/yr', label: 'Director trivial benefits' },
                { value: '£150/head', label: 'Staff event limit' },
                { value: '100%', label: 'AIA first-year relief' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="break-inside-avoid rounded-xl border border-border bg-surface px-4 py-4 text-center"
                >
                  <p
                    className="text-[20px] font-extrabold leading-none tracking-tight"
                    style={{ color: c.primary }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium leading-tight text-text-light">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3.5">
              {LTD_EXTRAS.map((item, i) => {
                const icons: LucideIcon[] = [PiggyBank, Gift, Users, Sparkles, FileText, Wrench];
                const Icon = icons[i] ?? Sparkles;
                return (
                  <article
                    key={i}
                    className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundImage: i === 1 ? secondaryButtonGradient : iconTileGradient }}
                    >
                      <Icon size={19} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-extrabold leading-snug text-text">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[11.5px] leading-[1.65] text-text-light">
                        {item.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-4">
              <ProTip secondaryColor={c.secondary} secondaryBg={secondaryBg}>
                Pension contributions made before your company&rsquo;s year-end reduce
                this year&rsquo;s Corporation Tax bill. If you have a good year, ask us to
                run the numbers before the year closes — it&rsquo;s one of the highest-value
                conversations we have.
              </ProTip>
            </div>
          </section>
        );
      })()}

      {/* ── 05: Contractor focus (PSC only) ── */}
      {isPsc && (() => {
        const num = nextNum();
        return (
          <section className="bg-surface px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Personal service companies"
              title="Contractor expenses — what changes"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              You have access to the same deductions as any Ltd company — but the 24-month
              rule and IR35 status can significantly change which ones apply to each contract.
            </p>
            <div className="mt-6 space-y-3.5">
              {CONTRACTOR_ITEMS.map((item, i) => {
                const icons: LucideIcon[] = [Briefcase, Car, AlertTriangle, Monitor, Umbrella];
                const Icon = icons[i] ?? Briefcase;
                const isWarning = i === 2;
                return (
                  <article
                    key={i}
                    className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{
                        backgroundImage: isWarning
                          ? `linear-gradient(135deg, ${warnAmber}, #B45309)`
                          : iconTileGradient,
                      }}
                    >
                      <Icon size={19} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      {isWarning && (
                        <p className="mb-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em]" style={{ color: warnAmber }}>
                          Critical
                        </p>
                      )}
                      <h3 className="text-[14px] font-extrabold leading-snug text-text">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[11.5px] leading-[1.65] text-text-light">
                        {item.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-4">
              <ProTip secondaryColor={c.secondary} secondaryBg={secondaryBg}>
                Register your company&rsquo;s trading address as your home address — this
                makes travel to every client site &ldquo;business travel&rdquo; from your permanent
                base, not commuting to a client&rsquo;s office.
              </ProTip>
            </div>

            {showLearnLinks && (
              <a
                href={`https://${LEARN_CENTRE_DOMAIN}/learn/24-month-rule-contractors`}
                className="mt-4 flex break-inside-avoid items-center gap-3 rounded-xl border border-border bg-white p-4 no-underline shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                  style={{ backgroundImage: iconTileGradient }}
                >
                  <BookOpen size={16} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-extrabold text-text">The 24-month rule — full guide</p>
                  <p className="text-[11px] text-text-light">{LEARN_CENTRE_DOMAIN}/learn/24-month-rule-contractors</p>
                </div>
                <ArrowRight size={13} className="shrink-0" style={{ color: c.primary }} />
              </a>
            )}
          </section>
        );
      })()}

      {/* ── Sector-specific section ── */}
      {sectorBlock && (() => {
        const num = nextNum();
        const SectorIcon =
          sector === 'cis' ? HardHat :
          sector === 'medical' ? Stethoscope :
          sector === 'transport' ? Truck :
          sector === 'hospitality' ? UtensilsCrossed :
          sector === 'retail' ? ShoppingBag :
          sector === 'consulting' ? BarChart2 :
          Camera;
        return (
          <section className="px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Your sector"
              title={sectorBlock.heading}
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              {sectorBlock.intro}
            </p>
            <div className="mt-6 space-y-3.5">
              {sectorBlock.items.map((item, i) => (
                <article
                  key={i}
                  className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundImage: iconTileGradient }}
                  >
                    <SectorIcon size={19} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-extrabold leading-snug text-text">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[11.5px] leading-[1.65] text-text-light">
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── Grey areas: what you cannot claim ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className="bg-surface px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Approach with care"
              title="What you generally cannot claim"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              These are the most common mis-claims we see. Getting them wrong
              doesn&rsquo;t just lose the deduction — it can trigger a broader HMRC enquiry
              into all your expenses.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {GREY_AREAS.map((item) => {
                const Icon = GREY_ICON[item.iconKey];
                return (
                  <div
                    key={item.iconKey}
                    className="break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    style={{ borderLeft: `4px solid ${warnAmber}`, border: `1px solid rgba(217,119,6,0.20)`, borderLeftWidth: '4px' }}
                  >
                    <div className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: 'rgba(217,119,6,0.10)', color: warnAmber }}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide"
                          style={{ backgroundColor: 'rgba(217,119,6,0.10)', color: warnAmber }}
                        >
                          Not claimable
                        </span>
                      </div>
                      <p className="text-[13px] font-extrabold leading-snug text-text">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-[11.5px] leading-[1.62] text-text-light">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ask-first nudge */}
            <div
              className="mt-5 flex break-inside-avoid items-start gap-3 rounded-xl border-l-[4px] bg-white p-4 shadow-[0_1px_6px_rgba(15,23,42,0.05)]"
              style={{ borderColor: c.primary }}
            >
              <Check size={15} className="mt-0.5 shrink-0" style={{ color: c.primary }} />
              <p className="text-[11.5px] leading-[1.62] text-text-light">
                <strong className="font-extrabold text-text">When in doubt, ask first. </strong>
                A quick email to your accountant before claiming something uncertain takes
                seconds. Being caught in an HMRC enquiry for a mis-claim takes considerably
                longer — and costs considerably more.
              </p>
            </div>
          </section>
        );
      })()}

      {/* ── Record-keeping: numbered checklist ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className="px-[20mm] py-[13mm]">
            <SectionHeader
              num={num}
              eyebrow="Protecting your claims"
              title="Record-keeping — the non-negotiables"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              HMRC can challenge an expense claim if you cannot produce evidence for it.
              With FreeAgent, most of this is automatic — but the habits matter.
            </p>
            <ul className="mt-6 space-y-3">
              {RECORD_KEEPING.map((item, i) => {
                const Icon = RECORD_ICON[item.iconKey];
                return (
                  <li
                    key={i}
                    className="flex break-inside-avoid items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-sm"
                      style={{ backgroundImage: iconTileGradient }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="text-[13px] font-extrabold text-text">{item.title}</p>
                      <p className="mt-1 text-[11.5px] leading-[1.65] text-text-light">{item.body}</p>
                    </div>
                    <Icon
                      size={16}
                      className="mt-1 shrink-0 opacity-30"
                      style={{ color: c.primary }}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })()}

      {/* ── Learn more (Clever brand only) ── */}
      {learnItems.length > 0 && (
        <section className="bg-surface px-[20mm] py-[13mm]">
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.24em]"
            style={{ color: c.primary }}
          >
            Go deeper
          </p>
          <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight text-text">
            Learn more at cleveraccounts.com/learn
          </h2>
          <p className="mt-2 max-w-[140mm] text-[12px] leading-[1.65] text-text-light">
            Each topic in this guide has a full article with worked examples, HMRC
            references, and the latest figures — free to access at any time.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {learnItems.map((t) => (
              <a
                key={t.slug}
                href={`https://${LEARN_CENTRE_DOMAIN}${t.slug}`}
                className="flex break-inside-avoid items-center gap-4 rounded-2xl border border-border bg-white p-4 no-underline shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundImage: iconTileGradient }}
                >
                  <BookOpen size={17} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-extrabold text-text">{t.title}</p>
                  <p className="mt-0.5 text-[11px] leading-[1.45] text-text-light">{t.blurb}</p>
                </div>
                <ArrowRight size={13} className="shrink-0" style={{ color: c.primary }} />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contact footer */}
      <footer
        className="relative flex break-inside-avoid flex-col overflow-hidden px-[20mm] py-[15mm] text-white"
        style={{ backgroundImage: footerGradient }}
      >
        <span className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/[0.06]" />
        <span className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/[0.09]" />
        <div className="relative">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-white/50">
            Questions about your expenses?
          </p>
          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-[24px] font-extrabold">{data.accountant.name}</p>
              <p className="text-[12.5px] text-white/65">Your accountant · {data.brandName}</p>
            </div>
            <div className="shrink-0 space-y-2 text-right text-[12.5px]">
              <p className="flex items-center justify-end gap-2">
                <Mail size={14} style={{ color: c.secondary }} />
                {data.accountant.email}
              </p>
              <p className="flex items-center justify-end gap-2">
                <Phone size={14} style={{ color: c.secondary }} />
                {data.accountant.phone}
              </p>
            </div>
          </div>
          <p className="mt-6 flex items-start gap-2 border-t border-white/[0.12] pt-5 text-[11.5px] leading-[1.65] text-white/60">
            <ArrowRight size={13} className="mt-0.5 shrink-0" style={{ color: c.secondary }} />
            Ask us before claiming anything you&rsquo;re unsure about — it is always easier to
            check first than to unwind a mis-claim later.
            General enquiries: {data.support.email} · {data.support.phone}
          </p>
        </div>
      </footer>
    </div>
  );
}
