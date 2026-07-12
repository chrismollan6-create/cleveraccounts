import { notFound } from 'next/navigation';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { getBrand } from '@/lib/brand';
import LetterStateMessage from '../../engagement-letter/[token]/LetterStateMessage';
import SignClient from './SignClient';

interface ApexSignatureRequestDto {
  status: 'Sent' | 'Viewed' | 'Signed' | 'Expired' | 'Superseded' | 'Cancelled';
  documentType: string;
  documentTitle: string;
  periodEndIso?: string;
  signerFirstName?: string;
  signerLastName?: string;
  signerEmail?: string;
  businessName?: string;
  brandId?: string;
  approvalStatement?: string;
  challengeType: 'Postcode' | 'Date of Birth' | 'None';
  challengeLocked?: boolean;
  sourcePdfSha256?: string;
  alreadySigned?: boolean;
  alreadyDeclined?: boolean;
  signedAt?: string;
  sealStatus?: string;
  isExpired?: boolean;
  coverLetterJson?: string;
  confirmationsJson?: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const brand = await getBrand();
  return {
    title: `Sign your document | ${brand.name}`,
    description: `Review and sign your document with ${brand.name}.`,
    robots: { index: false, follow: false },
  };
}

async function fetchRequest(
  token: string,
): Promise<{ status: number; data: ApexSignatureRequestDto | { error: string } }> {
  const sfToken = await getSalesforceToken();
  const res = await fetch(sfApex(`/SignatureRequest?t=${encodeURIComponent(token)}`), {
    headers: { Authorization: `Bearer ${sfToken}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return { status: res.status, data };
}

export default async function SignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const brand = await getBrand();

  if (!token || token.length < 10) {
    notFound();
  }

  const { status, data } = await fetchRequest(token);

  if (status === 404) {
    return (
      <LetterStateMessage
        title="Link not recognised"
        body="This signing link doesn't match an active document. It may have been mistyped, or a newer version may have been sent. Please check your latest email from us, or get in touch."
        variant="warning"
      />
    );
  }

  if (status >= 400 || 'error' in data) {
    return (
      <LetterStateMessage
        title="Couldn't load your document"
        body={
          'error' in data
            ? data.error
            : 'An unexpected error occurred. Please try refreshing the page, or get in touch if this keeps happening.'
        }
        variant="error"
      />
    );
  }

  const dto = data as ApexSignatureRequestDto;

  if (dto.status === 'Cancelled' || dto.status === 'Superseded') {
    return (
      <LetterStateMessage
        title="This signing request is no longer active"
        body={`A newer version may have been issued — please check your latest email from us, or contact us at ${brand.email} or ${brand.phone}.`}
        variant="warning"
      />
    );
  }

  if (dto.isExpired || dto.status === 'Expired') {
    return (
      <LetterStateMessage
        title="This signing link has expired"
        body={`For security, signing links expire after a fixed period. Please contact us at ${brand.email} or ${brand.phone} and we'll send you a fresh one.`}
        variant="warning"
      />
    );
  }

  if (dto.alreadySigned) {
    return (
      <LetterStateMessage
        title="This document has been signed"
        body={
          dto.signedAt
            ? `Signed on ${new Date(dto.signedAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}. Your signed copy was emailed to you — you don't need to do anything else.`
            : "Your signed copy was emailed to you — you don't need to do anything else."
        }
        variant="success"
      />
    );
  }

  if (dto.challengeLocked) {
    return (
      <LetterStateMessage
        title="This link has been locked"
        body={`Too many unsuccessful identity checks. To protect your information the link is locked — please contact us at ${brand.email} or ${brand.phone} and we'll reissue the document.`}
        variant="error"
      />
    );
  }

  let coverLetter = null;
  if (dto.coverLetterJson) {
    try {
      coverLetter = JSON.parse(dto.coverLetterJson);
    } catch {
      coverLetter = null; // malformed letter never blocks signing
    }
  }

  let confirmations: string[] = [];
  if (dto.confirmationsJson) {
    try {
      const parsed = JSON.parse(dto.confirmationsJson);
      if (Array.isArray(parsed)) confirmations = parsed.filter((c) => typeof c === 'string');
    } catch {
      confirmations = [];
    }
  }

  return (
    <SignClient
      token={token}
      meta={{
        documentTitle: dto.documentTitle,
        documentType: dto.documentType,
        approvalStatement: dto.approvalStatement ?? '',
        challengeType: dto.challengeType,
        signerFirstName: dto.signerFirstName ?? '',
        signerLastName: dto.signerLastName ?? '',
        signerEmail: dto.signerEmail ?? '',
        businessName: dto.businessName ?? '',
        sourcePdfSha256: dto.sourcePdfSha256 ?? '',
        periodEndIso: dto.periodEndIso ?? null,
        alreadyDeclined: !!dto.alreadyDeclined,
      }}
      coverLetter={coverLetter}
      confirmations={confirmations}
      brandPhone={brand.phone}
      brandEmail={brand.email}
      brandName={brand.name}
    />
  );
}
