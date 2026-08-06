import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import DirectorConsentClient from './DirectorConsentClient';

export interface DirectorConsentDto {
  companyName?: string;
  companyNumber?: string;
  directorName?: string;
  resignationDate?: string;
  status?: 'Requested' | 'Confirmed' | 'Declined' | 'Overridden';
  brand?: string;
  error?: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Confirm your resignation as a director | ${brand.name}`,
    description: `Confirm and sign your resignation as a director with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchConsent(
  token: string,
): Promise<{ status: number; data: DirectorConsentDto }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/DirectorConsent?t=${encodeURIComponent(token)}`), {
    headers: { Authorization: `Bearer ${sfToken}` },
    cache: 'no-store',
  });
  try {
    const data = await res.json();
    return { status: res.status, data };
  } catch {
    return {
      status: res.status >= 400 ? res.status : 502,
      data: { error: 'We couldn’t load this just now. Please try again in a moment.' },
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

export default async function DirectorConsentPage({
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
        body="This link doesn’t match a resignation we’re expecting. It may have been mistyped. Please get in touch and we’ll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  const { status, data } = await fetchConsent(token);

  if (status === 404) {
    return (
      <StateCard
        variant="warning"
        title="Link not recognised"
        body="This link doesn’t match a resignation we’re expecting. It may have been mistyped, or a newer link may have replaced it. Please get in touch and we’ll send a fresh one."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <StateCard
        variant="error"
        title="Couldn’t load this page"
        body={data.error ?? 'An unexpected error occurred. Please try refreshing, or get in touch if this keeps happening.'}
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  if (data.status === 'Confirmed' || data.status === 'Overridden') {
    return (
      <StateCard
        variant="success"
        title="Thank you — your resignation is confirmed"
        body="We’ve recorded your consent. We’ll file the resignation with Companies House and there’s nothing more you need to do."
        email={brand.email}
        phone={brand.phone}
      />
    );
  }

  return <DirectorConsentClient token={token} dto={data} brandEmail={brand.email} brandPhone={brand.phone} />;
}
