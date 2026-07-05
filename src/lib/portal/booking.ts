import {
  tryWithPortalScope,
  assertWritable,
  type PortalScopeResult,
} from "./withAccountScope";
import { fetchPortalApex } from "./salesforce";
import { logPortalEventScoped } from "./audit";

/**
 * Client-portal call booking — thin portal layer over the Salesforce
 * /Portal/calendly* endpoints (PortalCalendlyService → CalendlyIntegration).
 * The client browses their accountant's availability and books a call.
 */

export interface BookingConfig {
  success: boolean;
  eventTypeUri?: string;
  eventTypeName?: string;
  schedulingUrl?: string;
  accountantName?: string;
  error?: string;
}

export interface BookingSlot {
  startTime: string; // ISO 8601, e.g. 2026-07-10T09:00:00Z
  status: string;
  inviteesRemaining: number;
  displayDate: string; // "Thu, 10 Jul"
  displayTime: string; // "09:00"
  dateKey: string; // "2026-07-10"
}

export interface BookingConfirmation {
  success: boolean;
  message?: string;
  startTime?: string;
}

/** Resolve the account's accountant + their bookable event type. */
export async function getBookingConfig(): Promise<PortalScopeResult<BookingConfig>> {
  return tryWithPortalScope(async ({ accountSfId, contactSfId, brand, clerkUserId }) => {
    const r = await fetchPortalApex<BookingConfig>(
      { clerkUserId, accountId: accountSfId, contactId: contactSfId, brand },
      "/calendly"
    );
    return r.ok === true ? r.data : { success: false, error: r.message };
  });
}

/** Available slots for a (≤7-day) window. Read-only — allowed under view-as. */
export async function getBookingSlots(
  eventTypeUri: string,
  start: string,
  end: string
): Promise<PortalScopeResult<BookingSlot[]>> {
  return tryWithPortalScope(async ({ accountSfId, contactSfId, brand, clerkUserId }) => {
    const r = await fetchPortalApex<BookingSlot[]>(
      { clerkUserId, accountId: accountSfId, contactId: contactSfId, brand },
      "/calendly/slots",
      { eventTypeUri, start, end }
    );
    return r.ok === true ? r.data ?? [] : [];
  });
}

/** Book the chosen slot with the account's accountant. Blocked under view-as. */
export async function bookSlotForCurrentUser(
  startTime: string
): Promise<PortalScopeResult<BookingConfirmation>> {
  return tryWithPortalScope(async (scope) => {
    assertWritable(scope); // staff view-as must not book as the client
    const { accountSfId, contactSfId, brand, clerkUserId, db } = scope;
    const r = await fetchPortalApex<BookingConfirmation>(
      { clerkUserId, accountId: accountSfId, contactId: contactSfId, brand },
      "/calendly/book",
      undefined,
      { method: "POST", body: { startTime } }
    );
    if (r.ok === true) {
      if (r.data.success) {
        await logPortalEventScoped(db, {
          action: "book_call",
          clerkUserId,
          accountSfId,
          target: startTime,
        });
      }
      return r.data;
    }
    return { success: false, message: r.message };
  });
}
