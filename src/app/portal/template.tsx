/**
 * Portal route template — Next.js re-renders this on every navigation
 * (unlike layout.tsx, which is preserved). Used for cross-page transitions.
 *
 * The wrapper applies a subtle fade-in + slight rise so navigating between
 * Dashboard → Documents → Appointments etc. feels alive rather than hard-cut.
 *
 * Pure CSS animation keeps this a server component (zero client-side JS).
 */
export default function PortalTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-page-enter">{children}</div>;
}
