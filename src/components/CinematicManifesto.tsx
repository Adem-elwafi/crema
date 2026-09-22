import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

export default function CinematicManifesto() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // ─── 1. Luxury Depth: Hero dims as Manifesto ascends over it ─────────────
      // Pure GPU compositing (opacity only) to ensure 120fps smooth scrolling
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

      // ─── 2. Ambient Radial Glow: breathes subtly with natural scroll ──────────
      gsap.fromTo(
        '.manifesto-glow',
        { scale: 0.9, opacity: 0.25 },
        {
          scale: 1.25,
          opacity: 0.75,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

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

      {/* Main Content Stage: Responsive padding with safe clearance for fixed navbar */}
      <div className="relative w-full min-h-dvh flex flex-col justify-between pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-6 sm:px-10 md:px-14 lg:px-20 select-none">
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

        {/* ─── Central Typography Statement (Confident, Static Editorial) ── */}
        <div className="relative z-10 max-w-5xl mx-auto my-auto text-center px-2 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="mb-5 sm:mb-8 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-accent/90">
            CREMA PHILOSOPHY
          </div>

          <h2 className="font-display font-medium text-[clamp(1.85rem,3.8vw+0.5rem,4.5rem)] leading-[1.18] tracking-tight text-[#FDF8F3]">
            We do not simply brew coffee.
          </h2>

          <div className="my-5 sm:my-8 flex items-center justify-center gap-4 opacity-40">
            <span className="h-[1px] w-8 sm:w-12 bg-accent" />
            <span className="text-accent text-[10px] sm:text-xs font-mono">◆</span>
            <span className="h-[1px] w-8 sm:w-12 bg-accent" />
          </div>

          <p className="font-display font-light text-[clamp(1.45rem,2.8vw+0.4rem,3.4rem)] leading-[1.24] tracking-tight text-[#E8C9A0]/95 italic">
            We harvest{' '}
            <span className="text-accent hover:text-white hover:text-glow-amber transition-colors duration-300 cursor-default">
              silence
            </span>
            , shape{' '}
            <span className="text-accent hover:text-white hover:text-glow-amber transition-colors duration-300 cursor-default">
              heat
            </span>
            , and capture the fleeting{' '}
            <span className="text-accent hover:text-white hover:text-glow-amber transition-colors duration-300 cursor-default">
              geometry
            </span>{' '}
            of an{' '}
            <span className="text-accent hover:text-white hover:text-glow-amber transition-colors duration-300 cursor-default">
              unhurried
            </span>{' '}
            morning.
          </p>
        </div>

        {/* ─── Bottom Micro-Data: Quiet Editorial Footnote ──────────────── */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.22em] text-cream/50 uppercase">
          <div className="flex flex-col gap-0.5">
            <span className="text-accent/80 font-medium">ROAST PROFILE</span>
            <span className="text-cream/80 text-[11px] sm:text-xs tracking-[0.18em]">
              OBSIDIAN CORE · HARVEST 2026
            </span>
          </div>

          <div className="text-right flex flex-col gap-0.5">
            <span className="text-accent/80 font-medium">TERROIR</span>
            <span className="text-cream/80 text-[11px] sm:text-xs tracking-[0.18em]">
              YIRGACHEFFE · HUILA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
