'use client';

import { type ReactNode } from 'react';
import { BrandIdContext } from '@/lib/useBrand';
import type { BrandId } from '@/lib/constants';

/**
 * Client-side wrapper that bridges the server-resolved brand id into the
 * React context tree. Rendered once at the top of each route-group layout
 * (src/app/(site)/layout.tsx + src/app/(funnel)/layout.tsx).
 *
 * Existed only because React Context Providers can't be invoked directly
 * from a server component — we need this 'use client' boundary.
 */
export default function BrandProvider({
  brandId,
  children,
}: {
  brandId: BrandId;
  children: ReactNode;
}) {
  return <BrandIdContext.Provider value={brandId}>{children}</BrandIdContext.Provider>;
}
