/**
 * Instant-paint skeleton for /portal/dashboard.
 *
 * Server-rendered page does a Promise.all on Clerk currentUser() + portal.users
 * + onboarding + messages, all parallel, but the slowest one (~300-400ms
 * warm, several seconds cold) gates the first paint. With this loading.tsx
 * the user sees the page chrome and rough shape of the content immediately
 * while RSC streams the real data in.
 */
export default function DashboardLoading() {
  return (
    <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
      {/* Hero banner placeholder */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 animate-pulse">
        <div className="h-7 w-2/3 max-w-sm bg-gray-100 rounded-lg" />
        <div className="mt-3 h-4 w-3/4 max-w-md bg-gray-100 rounded" />
        <div className="mt-4 h-2 w-full bg-gray-100 rounded-full" />
      </div>

      {/* Stats row */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 animate-pulse"
          >
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="mt-2 h-6 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Next-action card */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 animate-pulse">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="mt-3 h-6 w-3/4 max-w-md bg-gray-100 rounded" />
        <div className="mt-2 h-4 w-2/3 max-w-sm bg-gray-100 rounded" />
        <div className="mt-4 h-10 w-32 bg-gray-100 rounded-xl" />
      </div>

      {/* Two-column lower */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 animate-pulse">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-100 rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-1/3 bg-gray-100 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse h-64" />
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse h-40" />
        </div>
      </div>
    </div>
  );
}
