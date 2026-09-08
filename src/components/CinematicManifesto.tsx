import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

const FIRST_LINE = 'We do not simply brew coffee.';
const SECOND_LINE = 'We harvest silence, shape heat, and capture the fleeting geometry of an unhurried morning.';

export default function CinematicManifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pinEl = pinRef.current;
    if (!container || !pinEl) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.manifesto-word');

      // ─── Pin trigger ──────────────────────────────────────────────────────────
      // Keeps the stage pinned while the scroll runway plays out.
      // Progress gauge is driven by this trigger.
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinEl,
        onUpdate: (self) => {
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleX(${self.progress})`;
          }
          if (progressNumRef.current) {
            const pct = Math.round(self.progress * 100);
            progressNumRef.current.textContent = `${pct.toString().padStart(2, '0')}%`;
          }
        },
      });

      // ─── Word reveal trigger ──────────────────────────────────────────────────
      // Starts the MOMENT the section enters the bottom of the viewport,
      // and finishes when the section center reaches the viewport center.
      // Independent of the pin, so animation begins before the section
      // has fully scrolled into place.
      gsap.set(words, { y: '100%', opacity: 0 });

      gsap.to(words, {
        y: '0%',
        opacity: 1,
        stagger: { each: 0.03, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'bottom 25%',
          scrub: 0.6,
        },
      });

      // ─── Ambient glow trigger ─────────────────────────────────────────────────
      gsap.fromTo(
        '.manifesto-glow',
        { scale: 0.85, opacity: 0.3 },
        {
          scale: 1.3,
          opacity: 0.8,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const renderWords = (text: string, isItalic = false) => {
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-top mr-[0.28em] pb-[0.12em] leading-none"
      >
        <span
          className={`manifesto-word inline-block ${
            isItalic ? 'italic text-accent' : ''
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          {word}
        </span>
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative w-full h-[240vh] sm:h-[210vh] md:h-[185vh] lg:h-[160vh] bg-[#120B08] text-cream -mt-8 sm:-mt-12 rounded-t-[2rem] sm:rounded-t-[3rem] shadow-[0_-24px_60px_rgba(0,0,0,0.55)]"
    >
      {/* Sticky / Pinned Fullscreen Stage */}
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-20 select-none bg-radial-obsidian"
      >
        {/* Subtle Ambient Radial Amber Glow */}
        <div className="manifesto-glow absolute inset-0 bg-radial-glow pointer-events-none will-change-transform" />

        {/* Minimalist Micro-Metadata: Top Row */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[11px] sm:text-xs tracking-[0.25em] text-[#C8956C]/80 uppercase">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>01 / MANIFESTO</span>
          </div>
          <div className="hidden sm:block text-right text-cream/40">
            <span>LAT: 09°01&apos;N · ELEV: 2,100M</span>
          </div>
        </div>

        {/* Central Masked Typography Statement */}
        <div className="relative z-10 max-w-5xl mx-auto my-auto text-center px-4 sm:px-8">
          <div className="mb-6 sm:mb-8 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-accent/90">
            CREMA PHILOSOPHY
          </div>

          <p className="font-display font-medium text-[clamp(2.1rem,4.2vw+0.8rem,4.8rem)] leading-[1.18] tracking-tight text-[#FDF8F3]">
            {renderWords(FIRST_LINE)}
          </p>

          <div className="my-5 sm:my-8 flex items-center justify-center gap-4 opacity-40">
            <span className="h-[1px] w-12 bg-accent" />
            <span className="text-accent text-xs font-mono">◆</span>
            <span className="h-[1px] w-12 bg-accent" />
          </div>

          <p className="font-display font-light text-[clamp(1.75rem,3.4vw+0.6rem,3.8rem)] leading-[1.22] tracking-tight text-[#E8C9A0]/90">
            {renderWords(SECOND_LINE, true)}
          </p>
        </div>

        {/* Minimalist Micro-Metadata: Bottom Row */}
        <div className="relative z-10 flex items-end justify-between font-mono text-[11px] sm:text-xs tracking-[0.25em] text-cream/50 uppercase">
          <div className="flex flex-col gap-1">
            <span className="text-accent/70">ROAST PROFILE</span>
            <span className="text-cream/80">OBSIDIAN CORE · HARVEST 2026</span>
          </div>

          {/* Scrubbed Progress Tracker */}
          <div className="flex items-center gap-3">
            <span className="text-cream/40">REVEAL</span>
            <div className="w-24 sm:w-36 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <div
                ref={progressLineRef}
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-accent to-[#E8C9A0] origin-left scale-x-0 will-change-transform"
              />
            </div>
            <span ref={progressNumRef} className="text-accent font-semibold w-9 text-right">
              00%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
