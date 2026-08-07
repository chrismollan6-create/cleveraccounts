import InsuranceSuccess from '@/components/insurance/InsuranceSuccess';

/**
 * Design-review preview of the insurance SOF success page.
 *   /insurance-sof/preview            → suitable ("you're covered")
 *   /insurance-sof/preview?state=no   → unsuitable
 * Not linked anywhere; safe to leave for future design tweaks.
 */
export const dynamic = 'force-dynamic';

export default async function InsuranceSuccessPreview({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const sp = await searchParams;
  const suitable = sp.state !== 'no';
  return (
    <InsuranceSuccess
      suitable={suitable}
      companyName="SOF Portal Test Ltd"
      startDate="2026-08-07"
      token="preview"
      brandEmail="support@cleveraccounts.com"
      brandPhone="0113 518 8800"
    />
  );
}
