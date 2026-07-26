import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import VatQueriesClient from './VatQueriesClient';

export interface QueryLine {
  txnDate?: string;
  payee?: string;
  amountText?: string;
  vatText?: string;
}

export interface QuerySection {
  code: string;
  title: string;
  txnCount: number;
  instruction?: string;
  excluded: boolean;
  responseStatus?: string | null; // 'fixed' | 'correct' | null
  responseNote?: string | null;
  lines: QueryLine[];
}

export interface VatQueriesDto {
  clientName?: string;
  period?: string;
  dueDate?: string; // HMRC filing deadline, display text
  email?: string;
  status?: string | null; // 'sent' | 'responded'
  alreadyResponded: boolean;
  checks: QuerySection[];
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Your VAT return — a few things to check | ${brand.name}`,
    description: `Review and respond to a few points on your VAT return with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchQueries(
  token: string,
): Promise<{ status: number; data: VatQueriesDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/VATQueries?t=${encodeURIComponent(token)}`), {
    headers: { Authorization: `Bearer ${sfToken}` },
    cache: 'no-store',
  });
  try {
    const data = await res.json();
    return { status: res.status, data };
  } catch {
    return {
      status: res.status >= 400 ? res.status : 502,
      data: { error: 'We couldn’t load your VAT return just now. Please try again in a moment.' },
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

export default async function VatQueriesPage({
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
        body="This link doesn't match an active VAT return. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we'll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const { status, data } = await fetchQueries(token);

  if (status === 404) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This link doesn't match an active VAT return. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we'll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <StateCard
        variant="error"
        title="Couldn't load your VAT return"
        body={'error' in data ? data.error : 'An unexpected error occurred. Please try refreshing, or get in touch if this keeps happening.'}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const dto = data as VatQueriesDto;

  if (dto.alreadyResponded) {
    return (
      <StateCard
        variant="success"
        title="Thanks — we've got your responses"
        body="We've received your answers and we're taking another look at your VAT return. There's nothing else you need to do right now — we'll be in touch if we need anything further."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const sections = (dto.checks ?? []).filter((c) => !c.excluded);
  if (sections.length === 0) {
    return (
      <StateCard
        variant="success"
        title="Nothing to check right now"
        body="There's nothing outstanding on your VAT return at the moment. If you were expecting something to review, please get in touch."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  return (
    <VatQueriesClient
      token={token}
      clientName={dto.clientName}
      period={dto.period}
      dueDate={dto.dueDate}
      sections={sections}
      brandEmail={brand.email}
      brandPhone={brand.phone}
    />
  );
}
