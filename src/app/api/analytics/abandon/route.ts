import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/analytics/abandon
 * Receives abandonment beacon from signup form (navigator.sendBeacon).
 * Logs to console — wire up to your analytics DB or Salesforce if needed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    console.log('[signup_abandoned]', JSON.stringify(data));
    // Future: write to Salesforce, Segment, BigQuery etc.
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 }); // Always 204 — beacon doesn't read response
  }
}
