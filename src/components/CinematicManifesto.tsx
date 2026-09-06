import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

      // Timeline scrubbed by the scroll runway with advanced trigger timing (top 75%)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          end: 'bottom bottom',
          pin: pinEl,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (progressNumRef.current) {
              const pct = Math.round(self.progress * 100);
              progressNumRef.current.textContent = `${pct.toString().padStart(2, '0')}%`;
            }
          },
        },
      });

      // Baseline state: High baseline opacity (0.28) and moderate y offset (45%)
      // No filter: blur() to eliminate GPU ghosting and muddy artifacts
      gsap.set(words, {
        y: '45%',
        opacity: 0.28,
        letterSpacing: '0.02em',
      });

      // Crisp masked rise, letter-spacing settle, and opacity illumination
      tl.to(words, {
        y: '0%',
        opacity: 1,
        letterSpacing: '0em',
        stagger: {
          each: 0.06,
          from: 'start',
        },
        ease: 'power2.out',
        duration: 1.2,
      });

      // Ambient radial glow pulsation on scroll
      tl.fromTo(
        '.manifesto-glow',
        { scale: 0.9, opacity: 0.4 },
        { scale: 1.25, opacity: 0.85, ease: 'sine.inOut', duration: 1.2 },
        0
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const renderWords = (text: string, isItalic = false) => {
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-top mr-[0.28em] pb-[0.1em] leading-none"
      >
        <span
          className={`manifesto-word inline-block will-change-transform ${
            isItalic ? 'italic text-accent' : ''
          }`}
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
      className="relative w-full h-[180vh] bg-[#120B08] text-cream"
    >
      {/* Seamless Geometric Angled Transition Wedge from Hero (Desktop >= 955px) */}
      {/* Connects the Hero's diagonal split (which terminates at 40% left / 60% right cream) smoothly into the obsidian canvas */}
      <svg
        className="hidden min-[955px]:block absolute top-0 left-0 w-full h-16 xl:h-24 z-30 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="40,0 100,0 100,100" fill="#FDF8F3" />
      </svg>

      {/* Sticky / Pinned Fullscreen Stage */}
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-20 select-none bg-radial-obsidian"
      >
        {/* Subtle Ambient Radial Amber Glow */}
        <div className="manifesto-glow absolute inset-0 bg-radial-glow pointer-events-none transition-transform duration-700 will-change-transform" />

        {/* Minimalist Micro-Metadata: Top Row */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[11px] sm:text-xs tracking-[0.25em] text-[#C8956C]/80 uppercase pt-4 sm:pt-0">
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
