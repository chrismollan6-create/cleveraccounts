import { notFound, redirect, permanentRedirect } from "next/navigation";
import { getRedirects } from "@/sanity/queries";

/**
 * Catch-all for paths that don't match any route. Checks the editor-managed
 * redirects list (Studio → Redirects) and sends the visitor on if there's a
 * match; otherwise renders the 404. This is what makes "change a page's URL"
 * safe and self-serve: change the slug, then add a redirect old → new.
 */
const norm = (s: string) => (s.replace(/\/+$/, "") || "/").toLowerCase();

export default async function CatchAllRedirect({ params }: { params: Promise<{ notFound?: string[] }> }) {
  const { notFound: segs } = await params;
  const path = "/" + (segs?.join("/") ?? "");

  const redirects = await getRedirects().catch(() => []);
  const match = redirects.find((r) => norm(r.from) === norm(path));

  if (match?.to) {
    if (match.permanent === false) redirect(match.to);
    permanentRedirect(match.to);
  }

  notFound();
}
