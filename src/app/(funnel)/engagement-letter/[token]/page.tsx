import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { renderLetter, type VariantId, type Jurisdiction, type MergeContext } from '@/content/engagement-letter';
import { getBrand } from '@/lib/brand';
import EngagementLetterClient from './EngagementLetterClient';
import LetterStateMessage from './LetterStateMessage';

interface ApexLetterDto {
  status: 'Sent' | 'Viewed' | 'Signed' | 'Expired' | 'Superseded' | 'Cancelled';
  variant: 'Sole Trader' | 'Limited Company';
  signerFirstName?: string;
  signerLastName?: string;
  signerEmail?: string;
  businessName?: string;
  registeredJurisdiction?: string;
  joiningDateIso?: string;
  documentVersion?: string;
  documentSha256?: string;
  alreadySigned?: boolean;
  signedAt?: string;
  signedPdfDownloadUrl?: string;
  isExpired?: boolean;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Engagement Letter | ${brand.name}`,
    description: `Review and sign your engagement letter with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchLetter(token: string): Promise<{ status: number; data: ApexLetterDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/EngagementLetter?t=${encodeURIComponent(token)}`), {
    headers: { Authorization: `Bearer ${sfToken}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return { status: res.status, data };
}

function mapVariant(apex: 'Sole Trader' | 'Limited Company'): VariantId {
  return apex === 'Limited Company' ? 'limited-company' : 'sole-trader';
}

function mapJurisdiction(j: string | undefined): Jurisdiction {
  if (j === 'Scotland' || j === 'Northern Ireland') return j;
  return 'England and Wales';
}

export default async function EngagementLetterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const brand = await getBrand();

  if (!token || token.length < 10) {
    notFound();
  }

  const { status, data } = await fetchLetter(token);

  if (status === 404) {
    return (
      <LetterStateMessage
        title="Link not recognised"
        body="This signing link doesn't match an active engagement letter. It may have been mistyped, or your accountant may have superseded it. Please get in touch and we'll send a fresh one."
        variant="warning"
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <LetterStateMessage
        title="Couldn't load your engagement letter"
        body={'error' in data ? data.error : 'An unexpected error occurred. Please try refreshing the page, or get in touch if this keeps happening.'}
        variant="error"
      />
    );
  }

  // Status is OK and data is the DTO
  const dto = data as ApexLetterDto;

  // Expired link → friendly state with contact details, no content shown.
  if (dto.isExpired) {
    return (
      <LetterStateMessage
        title="This signing link has expired"
        body={`For security, signing links expire after a fixed period. Please contact us at ${brand.email} or ${brand.phone} and we'll send you a fresh letter.`}
        variant="warning"
      />
    );
  }

  // Build merge context from Salesforce data.
  // Read User-Agent / IP server-side here would be possible, but for the page
  // they're only displayed in the live audit summary — not legally captured.
  // The /sign POST is what captures the IP/UA into the audit log.
  const ctx: MergeContext = {
    joiningDate: dto.joiningDateIso ?? new Date().toISOString().slice(0, 10),
    jurisdiction: mapJurisdiction(dto.registeredJurisdiction),
    businessName: dto.businessName ?? '',
    firstName: dto.signerFirstName ?? '',
    lastName: dto.signerLastName ?? '',
    phoneNumber: brand.phone,
    supportEmail: 'support@cleveraccounts.com',
  };

  // If signer name / business name aren't filled in by Salesforce we should
  // refuse to render — a contract without a counterparty is meaningless.
  if (!ctx.businessName || !ctx.firstName) {
    return (
      <LetterStateMessage
        title="Letter not ready yet"
        body="Your engagement letter is being prepared but isn't quite ready. Please try again in a few minutes, or get in touch if this persists."
        variant="warning"
      />
    );
  }

  const variant = mapVariant(dto.variant);
  const rendered = await renderLetter(variant, ctx);

  // Already signed: show a confirmation state with download link.
  if (dto.alreadySigned) {
    return (
      <LetterStateMessage
        title="Your engagement letter has been signed"
        body={
          dto.signedAt
            ? `Signed on ${new Date(dto.signedAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}. Thanks — you don't need to do anything else.`
            : "Thanks — you don't need to do anything else."
        }
        variant="success"
        downloadUrl={dto.signedPdfDownloadUrl}
      />
    );
  }

  // Capture the IP we'd report (best-effort; for legal capture the /sign POST
  // re-reads it server-side from headers as the canonical record).
  const headerList = await headers();
  const displayIp = (headerList.get('x-forwarded-for') ?? headerList.get('x-real-ip') ?? '').split(',')[0].trim();

  return (
    <EngagementLetterClient
      token={token}
      letter={rendered}
      signer={{
        firstName: ctx.firstName,
        lastName: ctx.lastName,
        email: dto.signerEmail ?? '',
        businessName: ctx.businessName,
      }}
      displayIp={displayIp}
      canSign={true}
    />
  );
}
