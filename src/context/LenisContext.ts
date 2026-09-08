import { createContext, useContext } from 'react';
import type React from 'react';
import type Lenis from 'lenis';

export const LenisContext = createContext<React.RefObject<Lenis | null>>({ current: null });

export function useLenis(): Lenis | null {
  const ctx = useContext(LenisContext);
  return ctx.current;
}
