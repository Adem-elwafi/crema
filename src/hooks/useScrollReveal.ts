import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

interface ScrollRevealOptions {
  y?: number;        // default 60
  x?: number;        // default 0
  opacity?: number;  // default 0
  stagger?: number;  // default 0.15
  delay?: number;    // default 0
  duration?: number; // default 0.8
  start?: string;    // viewport offset, ignored (kept for API compatibility)
  childSelector?: string;  // if provided, animates children matching this selector instead of the ref element itself
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 60,
      x = 0,
      opacity = 0,
      stagger = 0.15,
      delay = 0,
      duration = 0.8,
      childSelector
    } = options;

    let targets: HTMLElement | NodeListOf<Element>;
    if (childSelector) {
      targets = el.querySelectorAll(childSelector);
    } else {
      targets = el;
    }

    // Apply initial hidden state
    if (targets instanceof NodeList) {
      gsap.set(targets, { y, x, opacity, visibility: 'hidden' });
    } else {
      gsap.set(targets, { y, x, opacity, visibility: 'hidden' });
    }

    let revealTween: gsap.core.Tween | gsap.core.Timeline | null = null;

    const reveal = () => {
      if (revealTween) return;
      revealTween = gsap.to(targets, {
        y: 0,
        x: 0,
        opacity: 1,
        visibility: 'visible',
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        overwrite: true
      });
    };

    // IntersectionObserver is robust against page-height changes caused by
    // images loading after mount, unlike ScrollTrigger position calculation.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (revealTween) revealTween.kill();
      gsap.set(targets, { clearProps: 'all' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, optionsKey]);
}
