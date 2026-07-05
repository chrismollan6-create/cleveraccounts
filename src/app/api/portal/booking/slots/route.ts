import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getBookingSlots } from "@/lib/portal/booking";
import { checkPortalApiLimit, rateLimitResponse } from "@/lib/portal/ratelimit";
import { sanitisedError } from "@/lib/portal/log";

/**
 * GET /api/portal/booking/slots?eventTypeUri=&start=YYYY-MM-DD&end=YYYY-MM-DD
 * Available call slots for the visible week. Read-only.
 */
export async function GET(req: Request) {
  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkPortalApiLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  const url = new URL(req.url);
  const eventTypeUri = url.searchParams.get("eventTypeUri");
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  if (!eventTypeUri || !start || !end) {
    return NextResponse.json(
      { error: "MISSING_PARAM", message: "eventTypeUri, start and end are required" },
      { status: 400 }
    );
  }

  try {
    const result = await getBookingSlots(eventTypeUri, start, end);
    if (result.ok === false) {
      return NextResponse.json({ error: result.reason }, { status: 401 });
    }
    return NextResponse.json(result.data);
  } catch (err) {
    console.error("[/api/portal/booking/slots] uncaught:", sanitisedError(err));
    return NextResponse.json({ error: "INTERNAL", message: "Failed to load availability" }, { status: 500 });
  }
}
