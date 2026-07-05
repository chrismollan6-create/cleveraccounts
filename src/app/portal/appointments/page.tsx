import { CalendarDays } from "lucide-react";
import { getBookingConfig } from "@/lib/portal/booking";
import PortalBooking from "@/components/portal/PortalBooking";

export const dynamic = "force-dynamic";

export const metadata = { title: "Appointments" };

/**
 * Appointments — book a call with your accountant. Resolves the accountant's
 * Calendly event type server-side, then hands the slot browsing/booking to the
 * PortalBooking client component (live availability from the Calendly API).
 */
export default async function AppointmentsPage() {
  const result = await getBookingConfig();
  const config = result.ok ? result.data : null;
  const bookable = Boolean(config?.success && config?.eventTypeUri);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
      <header className="mb-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays size={18} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-text">Book a call</h1>
            <p className="text-sm text-text-light">
              Pick a time that suits you — you&apos;ll get a calendar invite and a reminder.
            </p>
          </div>
        </div>
      </header>

      {bookable ? (
        <PortalBooking
          eventTypeUri={config!.eventTypeUri!}
          eventTypeName={config!.eventTypeName ?? "Call"}
          accountantName={config!.accountantName ?? "your accountant"}
        />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <p className="text-sm font-medium text-text">
            Online booking isn&apos;t available right now.
          </p>
          <p className="mt-1 text-sm text-text-light">
            {config?.error ??
              "We couldn't reach the scheduling system. Please message your accountant to arrange a call."}
          </p>
          {config?.schedulingUrl && (
            <a
              href={config.schedulingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Open the booking page
            </a>
          )}
        </div>
      )}
    </div>
  );
}
