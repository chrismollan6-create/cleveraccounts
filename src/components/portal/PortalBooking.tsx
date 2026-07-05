"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import type { BookingSlot } from "@/lib/portal/booking";

/** Local YYYY-MM-DD (not UTC — avoids the day slipping under BST). */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function PortalBooking({
  eventTypeUri,
  eventTypeName,
  accountantName,
}: {
  eventTypeUri: string;
  eventTypeName: string;
  accountantName: string;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<BookingSlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState<BookingSlot | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);

  const windowStart = addDays(startOfToday(), weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(windowStart, i));

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSelected(null);
    const start = ymd(windowStart);
    const end = ymd(addDays(windowStart, 6));
    try {
      const res = await fetch(
        `/api/portal/booking/slots?eventTypeUri=${encodeURIComponent(
          eventTypeUri
        )}&start=${start}&end=${end}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSlots((await res.json()) as BookingSlot[]);
    } catch {
      setLoadError("Couldn't load available times. Please try again.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [eventTypeUri, weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  async function confirm() {
    if (!selected) return;
    setBooking(true);
    setBookError(null);
    try {
      const res = await fetch("/api/portal/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime: selected.startTime }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setBooked(selected);
      } else {
        setBookError(
          data?.message ||
            (res.status === 403
              ? "Booking is disabled in staff view."
              : "That time is no longer available — please pick another.")
        );
        // Refresh availability — the slot may have just been taken.
        loadSlots();
      }
    } catch {
      setBookError("Something went wrong booking that time. Please try again.");
    } finally {
      setBooking(false);
    }
  }

  if (booked) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CalendarCheck size={20} />
          </span>
          <div>
            <h2 className="text-base font-bold text-emerald-900">You&apos;re booked in</h2>
            <p className="text-sm text-emerald-800">
              {booked.displayDate} at {booked.displayTime} with {accountantName}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-emerald-800">
          A calendar invite is on its way to your inbox, with a link to reschedule if you
          need to.
        </p>
        <button
          type="button"
          onClick={() => {
            setBooked(null);
            setSelected(null);
            loadSlots();
          }}
          className="mt-4 inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
        >
          Book another time
        </button>
      </div>
    );
  }

  const byDay = (key: string) => slots.filter((s) => s.dateKey === key);
  const rangeLabel = `${windowStart.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${addDays(windowStart, 6).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })}`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 lg:p-6">
      {/* Heading + description */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-text">{eventTypeName}</h2>
        <p className="mt-0.5 text-sm text-text-light">
          Choose a slot below to book with {accountantName}. Times are shown in UK time.
        </p>
      </div>

      {/* Week nav */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
          disabled={weekOffset === 0 || loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-text hover:bg-gray-50 disabled:opacity-40"
          aria-label="Previous week"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-text">{rangeLabel}</span>
        <button
          type="button"
          onClick={() => setWeekOffset((w) => w + 1)}
          disabled={loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-text hover:bg-gray-50 disabled:opacity-40"
          aria-label="Next week"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-text-light">
          <Loader2 size={16} className="animate-spin" /> Loading available times…
        </div>
      ) : loadError ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text-light">{loadError}</p>
          <button
            type="button"
            onClick={loadSlots}
            className="mt-3 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-text hover:bg-gray-50"
          >
            Try again
          </button>
        </div>
      ) : slots.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text-light">
            No times available this week. Try the next week.
          </p>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Next week <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const key = ymd(d);
            const daySlots = byDay(key);
            return (
              <div key={key} className="min-w-[7.25rem] flex-1">
                <div className="mb-2 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-text-light">
                    {d.toLocaleDateString("en-GB", { weekday: "short" })}
                  </div>
                  <div className="text-sm font-bold text-text">{d.getDate()}</div>
                </div>
                <div className="space-y-1.5">
                  {daySlots.length === 0 ? (
                    <div className="rounded-md border border-dashed border-gray-100 py-2 text-center text-[11px] text-text-light/60">
                      —
                    </div>
                  ) : (
                    daySlots.map((s) => {
                      const isSel = selected?.startTime === s.startTime;
                      return (
                        <button
                          key={s.startTime}
                          type="button"
                          onClick={() => setSelected(s)}
                          className={`flex w-full items-center justify-center rounded-md border px-2 py-1.5 text-sm font-medium transition ${
                            isSel
                              ? "border-primary bg-primary text-white"
                              : "border-gray-200 text-text hover:border-primary hover:text-primary"
                          }`}
                        >
                          {s.displayTime}
                          {isSel && <Check size={13} className="ml-1" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm bar */}
      {selected && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <span className="text-text-light">Selected: </span>
            <span className="font-semibold text-text">
              {selected.displayDate} at {selected.displayTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {bookError && <span className="text-xs text-red-600">{bookError}</span>}
            <button
              type="button"
              onClick={confirm}
              disabled={booking}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {booking ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Booking…
                </>
              ) : (
                <>Confirm booking</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
