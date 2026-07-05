"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Loader2,
  Clock,
  User,
  ArrowRight,
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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
    const wStart = addDays(startOfToday(), weekOffset * 7);
    const start = ymd(wStart);
    const end = ymd(addDays(wStart, 6));
    try {
      const res = await fetch(
        `/api/portal/booking/slots?eventTypeUri=${encodeURIComponent(
          eventTypeUri
        )}&start=${start}&end=${end}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as BookingSlot[];
      setSlots(data);
      const keys = Array.from({ length: 7 }, (_, i) => ymd(addDays(wStart, i)));
      setSelectedDay(keys.find((k) => data.some((s) => s.dateKey === k)) ?? null);
    } catch {
      setLoadError("Couldn't load available times. Please try again.");
      setSlots([]);
      setSelectedDay(null);
    } finally {
      setLoading(false);
    }
  }, [eventTypeUri, weekOffset]);

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
        loadSlots();
      }
    } catch {
      setBookError("Something went wrong booking that time. Please try again.");
    } finally {
      setBooking(false);
    }
  }

  // ── Booked confirmation ─────────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-7 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <CalendarCheck size={24} />
          </div>
          <h2 className="text-lg font-bold">You&apos;re booked in</h2>
          <p className="mt-1 text-sm text-emerald-50">
            {booked.displayDate} at {booked.displayTime}
          </p>
        </div>
        <div className="px-6 py-5 text-center">
          <p className="text-sm text-text-light">
            Your call with <span className="font-semibold text-text">{accountantName}</span> is
            confirmed. A calendar invite — with a link to reschedule — is on its way to your inbox.
          </p>
          <button
            type="button"
            onClick={() => {
              setBooked(null);
              setSelected(null);
              loadSlots();
            }}
            className="mt-4 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-text hover:bg-gray-50"
          >
            Book another time
          </button>
        </div>
      </div>
    );
  }

  const daySlots = selectedDay ? slots.filter((s) => s.dateKey === selectedDay) : [];
  const morning = daySlots.filter((s) => Number(s.displayTime.slice(0, 2)) < 12);
  const afternoon = daySlots.filter((s) => Number(s.displayTime.slice(0, 2)) >= 12);
  const selectedDate = selectedDay
    ? new Date(`${selectedDay}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;
  const rangeLabel = `${windowStart.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${addDays(windowStart, 6).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="lg:flex">
        {/* LEFT — context / details */}
        <aside className="border-b border-gray-100 bg-gray-50/60 p-5 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6">
          <h2 className="text-lg font-bold leading-snug text-text">{eventTypeName}</h2>
          <dl className="mt-4 space-y-2.5 text-sm text-text-light">
            <div className="flex items-center gap-2.5">
              <User size={15} className="shrink-0 text-primary" />
              <span>
                With <span className="font-medium text-text">{accountantName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="shrink-0 text-primary" />
              <span>Times shown in UK time</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CalendarCheck size={15} className="shrink-0 text-primary" />
              <span>Calendar invite + reminder</span>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-text-light">
            A quick, no-pressure call to talk through anything on your mind. Pick a slot that
            suits you — you can reschedule anytime from the invite.
          </p>
        </aside>

        {/* RIGHT — scheduler */}
        <div className="flex-1 p-5 lg:p-6">
          {/* Week nav */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
              disabled={weekOffset === 0 || loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-text transition hover:bg-gray-50 disabled:opacity-40"
              aria-label="Previous week"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-text">{rangeLabel}</span>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w + 1)}
              disabled={loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-text transition hover:bg-gray-50 disabled:opacity-40"
              aria-label="Next week"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day selector */}
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => {
              const key = ymd(d);
              const count = slots.filter((s) => s.dateKey === key).length;
              const isSel = selectedDay === key;
              const disabled = count === 0;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedDay(key);
                    setSelected(null);
                  }}
                  className={`flex flex-col items-center rounded-xl border py-2 transition ${
                    isSel
                      ? "border-primary bg-primary text-white shadow-sm"
                      : disabled
                        ? "cursor-not-allowed border-gray-100 text-text-light/40"
                        : "border-gray-200 text-text hover:border-primary/60 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    {d.toLocaleDateString("en-GB", { weekday: "short" })}
                  </span>
                  <span className="text-base font-bold leading-tight">{d.getDate()}</span>
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${
                      isSel ? "bg-white" : disabled ? "bg-transparent" : "bg-primary/50"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          {/* Times */}
          <div className="mt-5 min-h-[13rem]">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-light">
                <Loader2 size={16} className="animate-spin" /> Loading available times…
              </div>
            ) : loadError ? (
              <div className="py-12 text-center">
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
              <div className="py-12 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-text-light">
                  <Clock size={18} />
                </div>
                <p className="text-sm text-text-light">No times available this week.</p>
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => w + 1)}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Try next week <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <div>
                {selectedDate && (
                  <p className="mb-3 text-sm font-semibold text-text">{selectedDate}</p>
                )}
                {[
                  { label: "Morning", items: morning },
                  { label: "Afternoon", items: afternoon },
                ]
                  .filter((g) => g.items.length > 0)
                  .map((group) => (
                    <div key={group.label} className="mb-4 last:mb-0">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-light/70">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {group.items.map((s) => {
                          const isSel = selected?.startTime === s.startTime;
                          return (
                            <button
                              key={s.startTime}
                              type="button"
                              onClick={() => setSelected(s)}
                              className={`rounded-lg border py-2 text-sm font-semibold transition ${
                                isSel
                                  ? "border-primary bg-primary text-white shadow-sm"
                                  : "border-gray-200 text-text hover:border-primary hover:text-primary"
                              }`}
                            >
                              {s.displayTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm bar — spans the card */}
      {selected && (
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-3.5 lg:px-6 sm:flex-row sm:items-center sm:justify-between">
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {booking ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Booking…
                </>
              ) : (
                <>
                  Confirm booking <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
