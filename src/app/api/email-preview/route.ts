import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { BRANDS } from "@/lib/constants";
import PortalInvitationEmail from "@/lib/email/templates/portal-invitation";

/**
 * Diagnostic-only route. Renders the portal invitation email template to
 * HTML and returns it. Used to inspect exactly what Resend sends.
 *
 * GET /api/email-preview          — Clever brand, returns full HTML
 * GET /api/email-preview?brand=workwell&accountant=Joe&first=Sarah
 *
 * NOT for production use — there's no auth and this exposes brand data.
 * Remove before going to production OR gate behind an admin check.
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const brandId = (url.searchParams.get("brand") ?? "clever") as
    | "clever"
    | "workwell";
  const firstName = url.searchParams.get("first") ?? "Test";
  const accountant = url.searchParams.get("accountant") ?? "Charlie McAuley";

  const brand = BRANDS[brandId] ?? BRANDS.clever;

  const html = await render(
    PortalInvitationEmail({
      brand,
      firstName,
      inviteUrl:
        "https://charming-haddock-49.clerk.accounts.dev/v1/tickets/accept?ticket=example",
      accountantName: accountant,
    }),
  );

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
