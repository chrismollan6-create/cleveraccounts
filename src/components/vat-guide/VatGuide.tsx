/**
 * VatGuide — the VAT guide document.
 *
 * Pure presentational server component. Rendered at A4 width and turned into
 * a PDF by headless Chrome (see /api/vat-guide/pdf). Brand theming works by
 * setting `data-brand` on the root <div>: the [data-brand="…"] rules in
 * globals.css re-define --color-* / --font-sans tokens for the subtree.
 */

import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  BarChart2,
  BookOpen,
  Building2,
  CalendarClock,
  Camera,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Globe2,
  HardHat,
  Landmark,
  Mail,
  Megaphone,
  Monitor,
  Percent,
  Phone,
  Receipt,
  Repeat,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Tags,
  Truck,
  UtensilsCrossed,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { BRANDS } from '@/lib/constants';
import {
  DEADLINE_FACTS,
  FREEAGENT_HABITS,
  HAS_LEARN_CENTRE,
  HOW_VAT_WORKS,
  LEARN_CENTRE_DOMAIN,
  PENALTY_ITEMS,
  QUARTER_FOOTNOTE,
  RATE_BANDS,
  RATE_BAND_PRO_TIP,
  getCoverFigures,
  getDayOneItems,
  getFlatRateItems,
  getFreeAgentSetup,
  getLearnItems,
  getQuarterSteps,
  getSectorBlock,
  getTellUsItems,
  getTraps,
  howVatWorksBoxes,
  variantIntro,
  type DayOneIconKey,
  type RateBand,
  type TellUsIconKey,
  type TrapIconKey,
  type VatGuideData,
} from '@/content/vat-guide';

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

const DAY_ONE_ICON: Record<DayOneIconKey, LucideIcon> = {
  invoice: FileText,
  pricing: Tags,
  lookback: Receipt,
  records: FileSpreadsheet,
  customers: Megaphone,
};

const TRAP_ICON: Record<TrapIconKey, LucideIcon> = {
  foreign: Globe2,
  subcontractor: HardHat,
  rent: Building2,
  carlease: Truck,
  entertaining: UtensilsCrossed,
  receipt: Receipt,
  duplicate: Repeat,
  unexplained: AlertTriangle,
};

const TELL_US_ICON: Record<TellUsIconKey, LucideIcon> = {
  zerorate: Percent,
  overseas: Globe2,
  turnover: Wallet,
  bigpurchase: Truck,
  newtrade: Tags,
  property: Building2,
  hmrcletter: Mail,
  latebooks: CalendarClock,
};

/** Per-band accent so the rate reference reads at a glance. */
const BAND_ACCENT: Record<RateBand['tone'], string> = {
  charge: '#0F766E',
  reduced: '#2563EB',
  zero: '#15803D',
  exempt: '#B45309',
  outside: '#64748B',
};

export default function VatGuide({ data }: { data: VatGuideData }) {
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

  const isFrs = data.scheme === 'flat-rate';
  const isNew = data.newlyRegistered === true;
  const sector = data.sector ?? 'general';
  const sectorBlock = getSectorBlock(sector, data.variant);

  const coverFigures = getCoverFigures(data);
  const howBoxes = howVatWorksBoxes(data);
  const dayOneItems = getDayOneItems(data);
  const quarterSteps = getQuarterSteps(data);
  const freeAgentSetup = getFreeAgentSetup(data);
  const traps = getTraps(data);
  const tellUsItems = getTellUsItems(data);
  const flatRateItems = isFrs ? getFlatRateItems(data) : [];
  const showLearnLinks = HAS_LEARN_CENTRE[data.brandId];
  const learnItems = showLearnLinks ? getLearnItems(data) : [];

  const accInitials = data.accountant.name
    .split(' ')
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Cover "what's inside" strip
  const coverTopics = [
    isNew ? 'Your registration' : 'How VAT works',
    isNew ? 'From day one' : null,
    'Your quarter with us',
    'In FreeAgent',
    'What is vatable',
    'Reclaim traps',
    isFrs ? 'Flat Rate Scheme' : null,
    'Tell us when…',
    'Deadlines & penalties',
  ].filter(Boolean) as string[];

  let sectionNum = 1;
  const nextNum = () => String(sectionNum++).padStart(2, '0');
  /** Alternating section background — even-numbered sections get the tint. */
  const stripe = (num: string) => (Number(num) % 2 === 0 ? 'bg-surface' : '');

  const secondaryBg = hexAlpha(c.secondary, 0.08);
  const warnAmber = '#D97706';

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
        <span className="h-[7px] w-full shrink-0" style={{ backgroundColor: c.secondary }} />

        {/* decorative shapes */}
        <span className="absolute -right-32 -top-28 h-[400px] w-[400px] rounded-full bg-white/[0.10]" />
        <span className="absolute right-20 top-56 h-52 w-52 rounded-full border-[1.5px] border-white/[0.18]" />
        <span
          className="absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full"
          style={{ backgroundColor: hexAlpha(c.secondary, isWorkwell ? 0.5 : 0.25) }}
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
            VAT Guide
          </p>
          <h1 className="mt-5 text-[58px] font-extrabold leading-[1.0] tracking-tight">
            {isNew ? (
              <>
                You&rsquo;re VAT
                <br />
                registered.
              </>
            ) : (
              <>
                VAT, without
                <br />
                the surprises.
              </>
            )}
          </h1>
          <div className="mt-7 h-[5px] w-24 rounded-full" style={{ backgroundColor: c.secondary }} />
          <p className="mt-7 max-w-[130mm] text-[16px] leading-[1.7] text-white/80">
            {isNew
              ? 'What changes from day one, how each quarter runs with us, what to do in FreeAgent — and the handful of things that catch people out.'
              : 'How each quarter runs with us, what to do in FreeAgent, what is vatable and what is not — and the things worth telling us about as they happen.'}
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
          {coverFigures.map((s) => (
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
          VAT Guide &middot; {data.companyName}
        </span>
      </section>

      {/* Intro copy + accountant strip */}
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
              <span className="font-medium text-text-light"> &middot; Your dedicated accountant</span>
            </p>
            <p className="mt-0.5 text-[11.5px] leading-[1.55] text-text-light">
              Nothing in this guide is a rule you have to memorise. If something here looks like it
              applies to you, tell us — that is the whole job.
            </p>
          </div>
        </div>
      </section>

      {/* The mental model — 2-column: the rule + the three boxes */}
      <section className="px-[20mm] pt-[9mm]">
        <div
          className="break-inside-avoid overflow-hidden rounded-2xl border"
          style={{
            borderColor: hexAlpha(c.primary, 0.18),
            backgroundColor: hexAlpha(c.primary, 0.04),
          }}
        >
          <div className="flex divide-x" style={{ borderColor: hexAlpha(c.primary, 0.12) }}>
            {/* Left: the model */}
            <div className="flex-1 p-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.24em]"
                style={{ color: c.primary }}
              >
                The one thing to understand
              </p>
              <h3 className="mt-1.5 text-[15px] font-extrabold text-text">{HOW_VAT_WORKS.title}</h3>
              <p className="mt-2 text-[12px] leading-[1.65] text-text-light">{HOW_VAT_WORKS.body}</p>
            </div>
            {/* Right: the three moving parts */}
            <div className="w-[68mm] shrink-0 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">
                {isFrs ? 'On the Flat Rate Scheme' : 'The three moving parts'}
              </p>
              <ul className="mt-3 space-y-2.5">
                {howBoxes.map((b) => (
                  <li key={b.label}>
                    <p className="text-[11.5px] font-extrabold text-text">{b.label}</p>
                    <p className="mt-0.5 text-[11px] leading-[1.55] text-text-light">{b.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Your registration at a glance (new registrations only) ── */}
      {isNew && data.vatNumber && (
        <section className="px-[20mm] pt-[10mm]">
          <div
            className="break-inside-avoid overflow-hidden rounded-2xl border shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
            style={{ borderColor: hexAlpha(c.primary, 0.2) }}
          >
            <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundImage: iconTileGradient }}>
              <ShieldCheck size={16} className="shrink-0 text-white/85" strokeWidth={2} />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/85">
                Your registration &middot; keep this somewhere you can find it
              </p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-border bg-white">
              {[
                { label: 'VAT registration number', value: data.vatNumber },
                { label: 'Charge VAT from', value: data.effectiveDate ?? '—' },
                {
                  label: isFrs ? 'Scheme' : 'VAT scheme',
                  value: isFrs
                    ? `Flat Rate${data.flatRatePercent != null ? ` — ${data.flatRatePercent}%` : ''}${
                        data.flatRateCategory ? ` (${data.flatRateCategory})` : ''
                      }`
                    : 'Standard rated',
                },
                {
                  label: 'Quarters end in',
                  value: data.quarterEnds ?? 'We will confirm this with you',
                },
                {
                  label: 'Your first return covers',
                  value: data.firstReturnPeriod ?? 'We will confirm this with you',
                },
                {
                  label: 'Due with HMRC by',
                  value: data.firstReturnDeadline ?? 'One month and seven days after it ends',
                },
              ].map((row) => (
                <div key={row.label} className="px-5 py-3.5">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-text-light">
                    {row.label}
                  </p>
                  <p className="mt-1 text-[13px] font-extrabold leading-snug text-text">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Authorise-us action band */}
          {!data.hmrcAuthorised && (
            <div
              className="mt-4 flex break-inside-avoid items-start gap-4 rounded-2xl border-2 border-dashed px-5 py-5"
              style={{ borderColor: c.secondary, backgroundColor: hexAlpha(c.secondary, 0.06) }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                style={{ backgroundImage: secondaryButtonGradient }}
              >
                <Landmark size={20} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p
                  className="text-[10.5px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: c.secondaryDark }}
                >
                  One thing we need from you
                </p>
                <h3 className="mt-1 text-[16px] font-extrabold text-text">
                  Authorise us as your VAT agent with HMRC
                </h3>
                <p className="mt-2 text-[12.5px] leading-[1.65] text-text-light">
                  HMRC will not let us prepare or submit a single return until you have approved us
                  on their Making Tax Digital service. We have emailed you a link that takes about a
                  minute — you sign into your Government Gateway and confirm. If you cannot find the
                  email, tell us and we will send a fresh one. The link expires after around 21 days,
                  so it is worth doing today.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── From day one (new registrations only) ── */}
      {isNew &&
        (() => {
          const num = nextNum();
          return (
            <section className={`mt-[11mm] px-[20mm] py-[13mm] ${stripe(num)}`}>
              <SectionHeader
                num={num}
                eyebrow="The first fortnight"
                title="What changes from day one"
                primaryColor={c.primary}
              />
              <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
                Five things to deal with as soon as your registration comes through. None of them
                take long, and getting them done now avoids re-issuing invoices later.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {dayOneItems.map((item) => {
                  const Icon = DAY_ONE_ICON[item.iconKey];
                  return (
                    <div
                      key={item.iconKey}
                      className="break-inside-avoid rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    >
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
                      <p className="mt-1.5 text-[11.5px] leading-[1.62] text-text-light">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

      {/* ── How a quarter runs with us ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className={`px-[20mm] py-[13mm] ${isNew ? '' : 'mt-[11mm]'} ${stripe(num)}`}>
            <SectionHeader
              num={num}
              eyebrow="What happens, and when"
              title="How each quarter runs with us"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              You will hear from us at the same points every quarter, and only at those points.
              Two of these five steps need anything from you.
            </p>
            <ul className="mt-6 space-y-3">
              {quarterSteps.map((s) => {
                const isYou = s.actor === 'you';
                return (
                  <li
                    key={s.step}
                    className="flex break-inside-avoid items-start gap-4 overflow-hidden rounded-r-2xl bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
                    style={{ borderLeft: `4px solid ${isYou ? c.secondary : c.primary}` }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white shadow-sm"
                      style={{
                        backgroundImage: isYou ? secondaryButtonGradient : iconTileGradient,
                      }}
                    >
                      {s.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
                        <p className="text-[13px] font-extrabold text-text">{s.title}</p>
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide"
                          style={
                            isYou
                              ? { backgroundColor: hexAlpha(c.secondary, 0.16), color: c.secondaryDark }
                              : { backgroundColor: hexAlpha(c.primary, 0.1), color: c.primary }
                          }
                        >
                          {isYou ? 'Over to you' : 'We do this'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-[1.65] text-text-light">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5">
              <ProTip secondaryColor={c.secondary} secondaryBg={secondaryBg}>
                {QUARTER_FOOTNOTE}
              </ProTip>
            </div>
          </section>
        );
      })()}

      {/* ── In FreeAgent ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
            <SectionHeader
              num={num}
              eyebrow="Your bookkeeping"
              title="What to do in FreeAgent"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              Set it up once, then five habits that take seconds each. Done consistently, the
              quarter end becomes a single click for you and no questions from us.
            </p>

            {/* Setup */}
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-text-light">
              Set up once
            </p>
            <ol className="mt-3 space-y-2.5">
              {freeAgentSetup.map((s, i) => (
                <li
                  key={s.title}
                  className="flex break-inside-avoid items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow-sm"
                    style={{ backgroundImage: iconTileGradient }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-extrabold text-text">{s.title}</p>
                    {s.where && (
                      <p
                        className="mt-0.5 text-[10.5px] font-semibold"
                        style={{ color: c.primary }}
                      >
                        {s.where}
                      </p>
                    )}
                    <p className="mt-1 text-[11.5px] leading-[1.62] text-text-light">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Habits */}
            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-text-light">
              Then, every week
            </p>
            <div className="mt-3 space-y-3">
              {FREEAGENT_HABITS.map((h, i) => {
                const icons: LucideIcon[] = [CreditCard, Camera, CheckCircle2, Globe2, FileSpreadsheet];
                const Icon = icons[i] ?? Monitor;
                return (
                  <article
                    key={h.title}
                    className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundImage: i === 0 ? secondaryButtonGradient : iconTileGradient }}
                    >
                      <Icon size={19} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-extrabold leading-snug text-text">
                        {h.title}
                      </h3>
                      {h.where && (
                        <p className="mt-0.5 text-[10.5px] font-semibold" style={{ color: c.primary }}>
                          {h.where}
                        </p>
                      )}
                      <p className="mt-1.5 text-[11.5px] leading-[1.65] text-text-light">{h.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* ── Top tips: what is vatable ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
            <SectionHeader
              num={num}
              eyebrow="Top tips"
              title="What is vatable, and what is not"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              There are five bands, and almost everything sits in the first one. The examples below
              are the ones that come up most — if what you sell is not on this page, assume 20% and
              ask us.
            </p>

            <div className="mt-6 space-y-3.5">
              {RATE_BANDS.map((band) => {
                const accent = BAND_ACCENT[band.tone];
                return (
                  <div
                    key={band.name}
                    className="break-inside-avoid overflow-hidden rounded-2xl border bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    style={{ borderColor: hexAlpha(accent, 0.25) }}
                  >
                    <div
                      className="flex items-center gap-3 px-5 py-2.5"
                      style={{ backgroundColor: hexAlpha(accent, 0.08) }}
                    >
                      <span
                        className="flex min-w-[44px] justify-center rounded-md px-2 py-1 text-[12px] font-extrabold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {band.rate}
                      </span>
                      <p className="text-[13.5px] font-extrabold text-text">{band.name}</p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-[11.5px] leading-[1.62] text-text-light">{band.meaning}</p>
                      <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1.5">
                        {band.examples.map((ex) => (
                          <li key={ex} className="flex items-start gap-2">
                            <span
                              className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full"
                              style={{ backgroundColor: accent }}
                            />
                            <span className="text-[11px] leading-[1.5] text-text-light">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <ProTip secondaryColor={c.secondary} secondaryBg={secondaryBg}>
                {RATE_BAND_PRO_TIP}
              </ProTip>
            </div>
          </section>
        );
      })()}

      {/* ── Reclaim traps ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
            <SectionHeader
              num={num}
              eyebrow="Where the money goes wrong"
              title="Where VAT reclaims go wrong"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              These {traps.length} account for almost every correction we make. None of them are
              obscure — they are all things a bookkeeping default gets wrong if nobody overrides it.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {traps.map((t, i) => {
                const Icon = TRAP_ICON[t.iconKey];
                const never = t.severity === 'never';
                const accent = never ? warnAmber : c.primary;
                return (
                  <div
                    key={`${t.iconKey}-${i}`}
                    className="break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    style={{
                      border: `1px solid ${hexAlpha(accent, 0.2)}`,
                      borderLeft: `4px solid ${accent}`,
                    }}
                  >
                    <div className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: hexAlpha(accent, 0.1), color: accent }}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide"
                          style={{ backgroundColor: hexAlpha(accent, 0.1), color: accent }}
                        >
                          {never ? 'Never reclaimable' : 'Check first'}
                        </span>
                      </div>
                      <p className="text-[13px] font-extrabold leading-snug text-text">{t.title}</p>
                      <p className="mt-1.5 text-[11.5px] leading-[1.62] text-text-light">{t.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-5 flex break-inside-avoid items-start gap-3 rounded-xl border-l-[4px] bg-white p-4 shadow-[0_1px_6px_rgba(15,23,42,0.05)]"
              style={{ borderColor: c.primary }}
            >
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: c.primary }} />
              <p className="text-[11.5px] leading-[1.62] text-text-light">
                <strong className="font-extrabold text-text">The rule that covers all eight: </strong>
                reclaim what the supplier actually charged you, and nothing else. If the invoice does
                not show VAT, there is no VAT — however confidently the software fills the box in.
              </p>
            </div>
          </section>
        );
      })()}

      {/* ── Flat Rate Scheme (FRS clients only) ── */}
      {isFrs &&
        (() => {
          const num = nextNum();
          return (
            <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
              <SectionHeader
                num={num}
                eyebrow="Your scheme"
                title="The Flat Rate Scheme, in practice"
                primaryColor={c.primary}
              />
              <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
                You are on the Flat Rate Scheme
                {data.flatRatePercent != null ? ` at ${data.flatRatePercent}%` : ''}
                {data.flatRateCategory ? ` (${data.flatRateCategory})` : ''}. It is simpler than the
                standard scheme and, for the right business, cheaper — but it has three rules worth
                knowing properly.
              </p>

              {data.flatRatePercent != null && (
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {[
                    { value: `${data.flatRatePercent}%`, label: 'Your flat rate' },
                    { value: '£2,000', label: 'Capital asset reclaim floor' },
                    { value: '16.5%', label: 'Limited cost trader rate' },
                    { value: '£230k', label: 'You must leave above this' },
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
              )}

              <div className="mt-5 space-y-3.5">
                {flatRateItems.map((item, i) => {
                  const icons: LucideIcon[] = [Percent, Banknote, Receipt, AlertTriangle, Repeat];
                  const Icon = icons[i] ?? Percent;
                  return (
                    <article
                      key={item.title}
                      className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    >
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                        style={{ backgroundImage: i === 0 ? secondaryButtonGradient : iconTileGradient }}
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
            </section>
          );
        })()}

      {/* ── Sector-specific ── */}
      {sectorBlock &&
        (() => {
          const num = nextNum();
          const SectorIcon =
            sector === 'cis'
              ? HardHat
              : sector === 'medical'
                ? Stethoscope
                : sector === 'transport'
                  ? Truck
                  : sector === 'hospitality'
                    ? UtensilsCrossed
                    : sector === 'retail'
                      ? ShoppingBag
                      : sector === 'property'
                        ? Building2
                        : sector === 'beauty'
                          ? Scissors
                          : sector === 'creative'
                            ? Camera
                            : sector === 'consulting'
                              ? BarChart2
                              : ShieldCheck;
          return (
            <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
              <SectionHeader
                num={num}
                eyebrow={sector === 'general' ? 'Worth knowing' : 'Your sector'}
                title={sectorBlock.heading}
                primaryColor={c.primary}
              />
              <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
                {sectorBlock.intro}
              </p>
              <div className="mt-6 space-y-3.5">
                {sectorBlock.items.map((item) => (
                  <article
                    key={item.title}
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

      {/* ── Tell us when… ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
            <SectionHeader
              num={num}
              eyebrow="The short list"
              title="Tell us when&hellip;"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              We see your figures, not your plans. These are the moments where a two-minute message
              from you prevents a correction, a penalty, or a quarter of VAT charged at the wrong
              rate. None of them need a formal meeting — an email is fine.
            </p>
            <div className="mt-6 space-y-3">
              {tellUsItems.map((item) => {
                const Icon = TELL_US_ICON[item.iconKey];
                return (
                  <article
                    key={item.iconKey}
                    className="flex break-inside-avoid items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundImage: iconTileGradient }}
                    >
                      <Icon size={17} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[13.5px] font-extrabold leading-snug text-text">
                          {item.title}
                        </h3>
                        {item.urgency && (
                          <span
                            className="shrink-0 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white"
                            style={{ backgroundColor: c.secondary }}
                          >
                            {item.urgency}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[11.5px] leading-[1.65] text-text-light">
                        {item.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* ── Deadlines, payment and penalties ── */}
      {(() => {
        const num = nextNum();
        return (
          <section className={`px-[20mm] py-[13mm] ${stripe(num)}`}>
            <SectionHeader
              num={num}
              eyebrow="Dates and consequences"
              title="Deadlines, payment and what late costs"
              primaryColor={c.primary}
            />
            <p className="mt-3 max-w-[145mm] text-[12px] leading-[1.65] text-text-light">
              We will never let a deadline pass quietly — but it is worth knowing what the dates
              are, and what happens if one is missed.
            </p>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {DEADLINE_FACTS.map((f) => (
                <div
                  key={f.label}
                  className="break-inside-avoid rounded-xl border border-border bg-surface px-4 py-4 text-center"
                >
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-text-light">
                    {f.label}
                  </p>
                  <p
                    className="mt-1.5 text-[17px] font-extrabold leading-none tracking-tight"
                    style={{ color: c.primary }}
                  >
                    {f.value}
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium leading-tight text-text-light">
                    {f.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {PENALTY_ITEMS.map((p, i) => {
                const icons: LucideIcon[] = [CalendarClock, Banknote, ShieldCheck, CheckCircle2];
                const Icon = icons[i] ?? AlertTriangle;
                const isWarn = i < 2;
                return (
                  <article
                    key={p.title}
                    className="flex break-inside-avoid items-start gap-5 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{
                        backgroundImage: isWarn
                          ? `linear-gradient(135deg, ${warnAmber}, #B45309)`
                          : iconTileGradient,
                      }}
                    >
                      <Icon size={19} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-extrabold leading-snug text-text">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-[11.5px] leading-[1.65] text-text-light">{p.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {!data.directDebit && (
              <div className="mt-5">
                <ProTip secondaryColor={c.secondary} secondaryBg={secondaryBg}>
                  A VAT direct debit is the single easiest way to take late payment off the table
                  permanently — HMRC collects three working days after the deadline, so you also
                  keep the money slightly longer. Ask us and we will point you at the right screen.
                </ProTip>
              </div>
            )}
          </section>
        );
      })()}

      {/* ── Learn more ── */}
      {learnItems.length > 0 && (
        <section className="bg-surface px-[20mm] py-[13mm]">
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.24em]"
            style={{ color: c.primary }}
          >
            Go deeper
          </p>
          <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight text-text">
            Learn more at {LEARN_CENTRE_DOMAIN[data.brandId]}/learn/vat
          </h2>
          <p className="mt-2 max-w-[140mm] text-[12px] leading-[1.65] text-text-light">
            Each topic in this guide has a full article with worked examples, HMRC references and
            the latest figures — free to read at any time.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {learnItems.map((t) => (
              <a
                key={t.slug}
                href={`https://${LEARN_CENTRE_DOMAIN[data.brandId]}${t.slug}`}
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
            Questions about your VAT?
          </p>
          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-[24px] font-extrabold">{data.accountant.name}</p>
              <p className="text-[12.5px] text-white/65">
                Your accountant &middot; {data.brandName}
              </p>
            </div>
            <div className="shrink-0 space-y-2 text-right text-[12.5px]">
              <p className="flex items-center justify-end gap-2">
                <Mail size={14} style={{ color: c.secondary }} />
                {data.support.email}
              </p>
              <p className="flex items-center justify-end gap-2">
                <Phone size={14} style={{ color: c.secondary }} />
                {data.accountant.phone}
              </p>
            </div>
          </div>
          <p className="mt-6 flex items-start gap-2 border-t border-white/[0.12] pt-5 text-[11.5px] leading-[1.65] text-white/60">
            <ArrowRight size={13} className="mt-0.5 shrink-0" style={{ color: c.secondary }} />
            Ask us before you invoice something unusually, before you buy something substantial, and
            the day any letter arrives from HMRC. Email {data.support.email} or call{' '}
            {data.support.phone}.
          </p>
        </div>
      </footer>
    </div>
  );
}
