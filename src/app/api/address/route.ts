import { NextRequest, NextResponse } from 'next/server';

const POSTCODER_KEY = 'PCWDU-WX5WJ-LBU9E-PQGQ9';

/** GET /api/address?postcode=SW1A+1AA */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get('postcode');
  if (!postcode || postcode.trim().length < 3) {
    return NextResponse.json({ error: 'Valid postcode required' }, { status: 400 });
  }

  const encoded = encodeURIComponent(postcode.trim());
  const url = `https://ws.postcoder.com/pcw/${POSTCODER_KEY}/address/uk/${encoded}?format=json&lines=3`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Address lookup failed' }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Address lookup unavailable' }, { status: 502 });
  }
}
