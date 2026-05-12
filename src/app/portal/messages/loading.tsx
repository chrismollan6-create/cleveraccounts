/**
 * Instant-paint skeleton for /portal/messages.
 * Matches the live MessagesView layout (composer + thread | sidebar).
 */
export default function MessagesLoading() {
  return (
    <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2 animate-pulse">
        <div className="h-10 w-10 rounded-2xl bg-gray-100" />
        <div className="space-y-1.5">
          <div className="h-7 w-32 bg-gray-100 rounded" />
          <div className="h-3 w-56 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Composer + thread */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 animate-pulse">
            <div className="h-4 w-32 bg-gray-100 rounded mb-3" />
            <div className="h-10 w-full bg-gray-100 rounded-xl mb-3" />
            <div className="h-24 w-full bg-gray-100 rounded-xl" />
            <div className="mt-3 flex justify-end">
              <div className="h-10 w-32 bg-gray-100 rounded-xl" />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 animate-pulse">
            <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-end gap-2.5 mb-4">
                {i % 2 === 0 ? null : <div className="flex-1" />}
                <div className="h-9 w-9 rounded-full bg-gray-100" />
                <div
                  className={`max-w-[70%] space-y-2 ${
                    i % 2 === 0 ? "" : "items-end text-right"
                  }`}
                >
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } w-56 sm:w-72 h-20`}
                  />
                </div>
                {i % 2 === 0 ? <div className="flex-1" /> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-20 bg-gray-100" />
            <div className="p-5 space-y-3">
              <div className="flex gap-3">
                <div className="h-16 w-16 rounded-2xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse h-32" />
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse h-48" />
        </div>
      </div>
    </div>
  );
}
