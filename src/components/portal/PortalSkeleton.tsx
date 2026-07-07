/**
 * Generic portal content skeleton, shown by each route's loading.tsx while the
 * server renders. The PortalShell (big title + bottom tab bar / sidebar)
 * persists around it, so tapping a tab paints a structured placeholder
 * instantly instead of leaving the previous screen frozen.
 */
export default function PortalSkeleton() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
      <div className="animate-pulse space-y-4 motion-reduce:animate-none">
        <div className="h-4 w-40 rounded bg-black/[0.06]" />
        <div className="h-32 rounded-3xl bg-black/[0.06]" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded-2xl bg-black/[0.06]" />
          <div className="h-24 rounded-2xl bg-black/[0.06]" />
        </div>
        <div className="space-y-2.5">
          <div className="h-16 rounded-2xl bg-black/[0.06]" />
          <div className="h-16 rounded-2xl bg-black/[0.06]" />
          <div className="h-16 rounded-2xl bg-black/[0.06]" />
        </div>
      </div>
    </div>
  );
}
