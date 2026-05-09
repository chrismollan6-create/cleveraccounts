'use client';

import { createContext, useContext } from 'react';
import { BRANDS, type BrandConfig, type BrandId } from './constants';

/**
 * React context that carries the active brand id down the client tree.
 *
 * The provider is rendered in the root layouts (src/app/(site)/layout.tsx
 * and src/app/(funnel)/layout.tsx) using the brand resolved server-side.
 * Client components then read it via `useBrand()`.
 *
 * Default value is 'clever' so isolated components rendered outside a
 * provider (e.g. in tests) still get a sensible brand.
 */
export const BrandIdContext = createContext<BrandId>('clever');

/**
 * Read the current brand config inside a client component.
 *
 *   const brand = useBrand();
 *   <a href={`tel:${brand.freephone}`}>{brand.freephone}</a>
 */
export function useBrand(): BrandConfig {
  const id = useContext(BrandIdContext);
  return BRANDS[id] ?? BRANDS.clever;
}
