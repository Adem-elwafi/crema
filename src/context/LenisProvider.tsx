import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenisConfig } from '../lib/lenis';
import { LenisContext } from './LenisContext';

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: ReactNode;
  /** When true, scroll is frozen (e.g. while the Preloader owns scroll lock). */
  paused?: boolean;
  /** Called when Lenis finishes initializing. */
  onReady?: () => void;
}

export function LenisProvider({ children, paused = false, onReady }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerFnRef = useRef<((time: number) => void) | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis(lenisConfig);
    lenisRef.current = lenis;

    // Bridge Lenis drives into GSAP's ScrollTrigger so scrubbed parallax
    // animations recompute on every smooth frame instead of jamming.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from the GSAP ticker so it stays in sync with every other
    // GSAP animation. Keep a reference for correct cleanup.
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    tickerFnRef.current = tickerFn;
    gsap.ticker.add(tickerFn);
    // Prevent GSAP's lag compensation from fighting Lenis' own timing.
    gsap.ticker.lagSmoothing(0);

    setReady(true);
    onReady?.();

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause/unpause reacts to the preloader / drawer state.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
    } else {
      lenis.start();
    }
  }, [paused]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
