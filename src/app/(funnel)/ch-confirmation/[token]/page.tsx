import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import ChConfirmationClient from './ChConfirmationClient';

export interface Officer {
  name?: string;
  role?: string;
  appointed?: string;
  nationality?: string;
}
export interface Psc {
  name?: string;
  nature?: string;
  kind?: string;
}
export interface ShareClass {
  shareClass?: string;
  numShares?: string;
  aggregateNominal?: string;
}
export interface Capital {
  totalShares?: string;
  shareCurrency?: string;
  totalNominal?: string;
  classes?: ShareClass[];
}
export interface Shareholding {
  shareClass?: string;
  numberHeld?: string;
  shareholders?: string[];
}
export interface IdvPerson {
  key?: string;
  name?: string;
  role?: string;
  type?: 'officer' | 'psc';
  id?: string;
  verified?: boolean;
}
export interface ChConfirmationDto {
  companyName?: string;
  companyNumber?: string;
  dueDate?: string;
  /** Whether the deadline has already passed — decided server-side, since dueDate is display-only. */
  overdue?: boolean;
  /** "We'll run the Companies House ID checks for you" — £49 + VAT per director/PSC. */
  idvServiceAvailable?: boolean;
  idvServiceRequested?: boolean;
  idvServiceCount?: number;
  idvServiceUnitNet?: number;
  idvServiceUnitGross?: number;
  idvServiceTotal?: number;
  registeredOffice?: string;
  registeredEmail?: string | null;
  sicCodes?: string[];
  officers?: Officer[];
  pscs?: Psc[];
  capital?: Capital;
  shareholdings?: Shareholding[];
  idvPeople?: IdvPerson[];
  idvAllVerified?: boolean;
  hasWebfilingCode?: boolean;
  status?: 'Not Sent' | 'Sent' | 'Confirmed' | 'Changes Requested';
  alreadyResponded?: boolean;
  brandName?: string;
  brandEmail?: string;
  brandPhone?: string;
  feeStatus?: 'Unpaid' | 'Paid' | 'Waived';
  feeRequired?: boolean;
  feeAmount?: number;
  feeCurrency?: string;
  chFeesUrl?: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Confirm your company details | ${brand.name}`,
    description: `Review the details Companies House holds for your company with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchPack(
  token: string,
): Promise<{ status: number; data: ChConfirmationDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/CHConfirmation?t=${encodeURIComponent(token)}`), {
    headers: { Authorization: `Bearer ${sfToken}` },
    cache: 'no-store',
  });
  // A Salesforce 502 returns HTML, so res.json() would throw — parse defensively.
  try {
    const data = await res.json();
    return { status: res.status, data };
  } catch {
    return {
      status: res.status >= 400 ? res.status : 502,
      data: { error: 'We couldn’t load your company details just now. Please try again in a moment.' },
    };
  }
}

function StateCard({
  title,
  body,
  variant,
  email,
  phone,
}: {
  title: string;
  body: string;
  variant: 'success' | 'warning' | 'error';
  email: string;
  phone: string;
}) {
  const Icon = variant === 'success' ? CheckCircle2 : variant === 'warning' ? AlertTriangle : AlertCircle;
  const colors =
    variant === 'success'
      ? 'text-emerald-600 bg-emerald-50'
      : variant === 'warning'
        ? 'text-amber-600 bg-amber-50'
        : 'text-rose-600 bg-rose-50';
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${colors}`}>
          <Icon size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">{title}</h1>
        <p className="text-text-light leading-relaxed mb-6">{body}</p>
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
          <span>Need help?</span>
          <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <a className="text-primary hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        </div>
      </div>
    </main>
  );
}

export default async function ChConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const brand = await getBrand();

  if (!token || token.length < 10) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This link doesn’t match an active confirmation statement. It may have been mistyped. Please get in touch and we’ll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const { status, data } = await fetchPack(token);

  if (status === 404) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This link doesn’t match an active confirmation statement. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we’ll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <StateCard
        variant="error"
        title="Couldn’t load your company details"
        body={'error' in data ? data.error : 'An unexpected error occurred. Please try refreshing, or get in touch if this keeps happening.'}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const dto = data as ChConfirmationDto;

  if (dto.alreadyResponded && dto.status === 'Confirmed') {
    return (
      <StateCard
        variant="success"
        title="Thanks — you’ve confirmed your details"
        body="We’ve got everything we need. We’ll file your confirmation statement with Companies House and let you know once it’s done."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (dto.alreadyResponded && dto.status === 'Changes Requested') {
    return (
      <StateCard
        variant="success"
        title="Thanks — we’ve got your response"
        body="You told us something’s changed. One of the team will be in touch to sort it out before we file your confirmation statement."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  return <ChConfirmationClient token={token} dto={dto} brandEmail={brand.email} brandPhone={brand.phone} />;
}
