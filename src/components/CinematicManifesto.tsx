import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

const FIRST_LINE = 'We do not simply brew coffee.';
const SECOND_LINE = 'We harvest silence, shape heat, and capture the fleeting geometry of an unhurried morning.';
const INTERACTIVE_KEYWORDS = new Set(['silence,', 'silence', 'heat,', 'heat', 'geometry', 'unhurried']);

export default function CinematicManifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.manifesto-word');

      // ─── 1. Luxury depth: Hero dims as Manifesto ascends over it ─────────────
      // Pure GPU compositing (opacity only) to avoid compositor repaints
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        gsap.to(heroEl, {
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            onLeave: () => {
              heroEl.style.visibility = 'hidden';
              heroEl.style.pointerEvents = 'none';
            },
            onEnterBack: () => {
              heroEl.style.visibility = 'visible';
              heroEl.style.pointerEvents = 'auto';
            },
          },
        });
      }

      // ─── 2. Progressive Word Luminescence Scrub (Zero Pinning) ────────────────
      // Words start in a muted warm obsidian/charcoal tone and smoothly illuminate
      // into radiant cream and gold as the section passes naturally through the viewport.
      gsap.set(words, {
        opacity: 0.2,
        y: 14,
      });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: {
          each: 0.04,
          from: 'start',
        },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.6,
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

      // ─── 3. Ambient Radial Glow: breathes subtly with natural scroll ──────────
      gsap.fromTo(
        '.manifesto-glow',
        { scale: 0.88, opacity: 0.3 },
        {
          scale: 1.25,
          opacity: 0.8,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );

      // ─── 4. High-Performance Cursor Spotlight (Pointer / Desktop only) ───────
      const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (isFinePointer && spotlight) {
        const quickX = gsap.quickTo(spotlight, 'x', { duration: 0.45, ease: 'power3' });
        const quickY = gsap.quickTo(spotlight, 'y', { duration: 0.45, ease: 'power3' });

        const handlePointerMove = (e: PointerEvent) => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left - 180;
          const y = e.clientY - rect.top - 180;
          quickX(x);
          quickY(y);
          spotlight.style.opacity = '1';
        };

        const handlePointerLeave = () => {
          spotlight.style.opacity = '0';
        };

        container.addEventListener('pointermove', handlePointerMove, { passive: true });
        container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

        return () => {
          container.removeEventListener('pointermove', handlePointerMove);
          container.removeEventListener('pointerleave', handlePointerLeave);
        };
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const renderWords = (text: string, isItalic = false) => {
    return text.split(' ').map((word, i) => {
      const cleanWord = word.toLowerCase();
      const isKeyword = INTERACTIVE_KEYWORDS.has(cleanWord);

      return (
        <span
          key={i}
          className="inline-block overflow-hidden align-top mr-[0.28em] pb-[0.14em] leading-none"
        >
          <span
            className={`manifesto-word inline-block transition-all duration-300 ${
              isItalic ? 'italic text-accent' : ''
            } ${
              isKeyword
                ? 'cursor-default transition-colors duration-300 hover:text-white hover:text-glow-amber'
                : ''
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            {word}
          </span>
        </span>
      );
    });
  };

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative z-10 w-full min-h-dvh bg-[#0E0805] text-cream overflow-hidden"
    >
      {/* High-Performance Tactile Film Grain (0ms CPU, pure CSS SVG filter tile) */}
      <div className="bg-film-grain absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay will-change-transform" />

      {/* Ambient Breathing Radial Glow */}
      <div className="manifesto-glow absolute inset-0 bg-radial-glow pointer-events-none will-change-transform" />

      {/* Hardware-Accelerated Cursor Spotlight (Desktop fine pointer only) */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute top-0 left-0 w-[360px] h-[360px] rounded-full opacity-0 transition-opacity duration-500 blur-3xl will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(200, 149, 108, 0.18) 0%, rgba(200, 149, 108, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Main Content Stage: Responsive padding with safe clearance for fixed navbar */}
      <div className="relative w-full min-h-dvh flex flex-col justify-between pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 px-6 sm:px-10 md:px-14 lg:px-20 select-none">
        {/* ─── Top Micro-Data Row ────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#C8956C]/85 uppercase">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>01 / MANIFESTO</span>
          </div>

          <div className="text-right text-cream/45">
            <span className="hidden sm:inline">LAT: 09°01&apos;N · </span>
            <span>ELEV: 2,100M</span>
          </div>
        </div>

        {/* ─── Central Typography Statement ──────────────────────────────── */}
        <div className="relative z-10 max-w-5xl mx-auto my-auto text-center px-2 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="mb-5 sm:mb-8 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-accent/90">
            CREMA PHILOSOPHY
          </div>

          <p className="font-display font-medium text-[clamp(1.85rem,3.8vw+0.5rem,4.5rem)] leading-[1.18] tracking-tight text-[#FDF8F3]">
            {renderWords(FIRST_LINE)}
          </p>

          <div className="my-5 sm:my-8 flex items-center justify-center gap-4 opacity-40">
            <span className="h-[1px] w-8 sm:w-12 bg-accent" />
            <span className="text-accent text-[10px] sm:text-xs font-mono">◆</span>
            <span className="h-[1px] w-8 sm:w-12 bg-accent" />
          </div>

          <p className="font-display font-light text-[clamp(1.45rem,2.8vw+0.4rem,3.4rem)] leading-[1.24] tracking-tight text-[#E8C9A0]/95">
            {renderWords(SECOND_LINE, true)}
          </p>
        </div>

        {/* ─── Bottom Micro-Data & Progress Controls ─────────────────────── */}
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between font-mono text-[10px] sm:text-xs tracking-[0.22em] text-cream/50 uppercase border-t border-white/5 pt-5 sm:pt-6">
          <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:items-start gap-1">
            <span className="text-accent/80 font-medium">ROAST PROFILE</span>
            <span className="text-cream/80 text-[11px] sm:text-xs tracking-[0.18em]">
              OBSIDIAN CORE · HARVEST 2026
            </span>
          </div>

          {/* Scrubbed Progress Tracker */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            <span className="text-cream/40">REVEAL</span>
            <div className="flex-1 sm:w-36 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <div
                ref={progressLineRef}
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-accent via-[#E8C9A0] to-white origin-left scale-x-0 will-change-transform"
              />
            </div>
            <span
              ref={progressNumRef}
              className="text-accent font-semibold w-9 sm:w-10 text-right tabular-nums"
            >
              00%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
