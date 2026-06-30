import { notFound, redirect, permanentRedirect } from "next/navigation";
import { getRedirects } from "@/sanity/queries";

/**
 * Catch-all for paths that don't match any route. Checks the editor-managed
 * redirects list (Studio → Redirects) and sends the visitor on if there's a
 * match; otherwise renders the 404. This is what makes "change a page's URL"
 * safe and self-serve: change the slug, then add a redirect old → new.
 */
const norm = (s: string) => (s.replace(/\/+$/, "") || "/").toLowerCase();

/**
 * Carry the incoming query string onto the redirect target so links that pass
 * data via the URL — e.g. /p11d-2026?tfa_55=… or
 * /companies-house-identity-verification-checks?id=001… — don't lose it (the
 * destination forms read those params). Only applied to same-site relative
 * targets: we never append our query to an external absolute URL, to avoid
 * leaking params (an SF id, an NI number) off-site. If the target already
 * defines its own query, that wins.
 */
function withQuery(to: string, sp: Record<string, string | string[] | undefined>): string {
  if (!to.startsWith("/") || to.includes("?")) return to;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
    else if (v != null) qs.append(k, v);
  }
  const s = qs.toString();
  return s ? `${to}?${s}` : to;
}

export default async function CatchAllRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ notFound?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { notFound: segs } = await params;
  const path = "/" + (segs?.join("/") ?? "");

  const redirects = await getRedirects().catch(() => []);
  const match = redirects.find((r) => norm(r.from) === norm(path));

  if (match?.to) {
    const dest = withQuery(match.to, await searchParams);
    if (match.permanent === false) redirect(dest);
    permanentRedirect(dest);
  }

  notFound();
}
