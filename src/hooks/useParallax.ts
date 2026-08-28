import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useParallax(
  ref: RefObject<HTMLElement | null>,
  speed: number = 0.5  // multiplier for parallax offset
) {
  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }, el);

    return () => ctx.revert();
  }, [ref, speed]);
}
