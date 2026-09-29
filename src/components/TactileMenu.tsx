import { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Plus, Check, Droplet, ArrowRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useLenis } from '../context/LenisContext';

import cappuccinoCup from '../assets/images/hero/cappuccino-cup.webp';
import coldbrewGlass from '../assets/images/hero/coldbrew-glass.webp';
import latteCup from '../assets/images/hero/latte-cup.webp';
import espressoCup from '../assets/images/hero/espresso-cup.webp';

interface ExtractionItem {
  id: string;
  name: string;
  shortName: string;
  index: string;
  price: string;
  originElevation: string;
  notes: string;
  tasteNotes: string[];
  heroImage: string;
  heroWidth: number;
  heroHeight: number;
}

const EXTRACTIONS: ExtractionItem[] = [
  {
    id: 'cappuccino',
    name: 'Artisan Cortado & Cappuccino',
    shortName: 'Cortado',
    index: '01',
    price: '$4.80',
    originElevation: 'Guji Highland, Ethiopia · 2,150m',
    notes:
      'Aerated silky microfoam paired with single-origin Ethiopian Guji. Offers nuanced undertones of candied orange, wild stonefruit, and floral jasmine blossom.',
    tasteNotes: ['Candied Orange', 'Wild Stonefruit', 'Silky Microfoam'],
    heroImage: cappuccinoCup,
    heroWidth: 260,
    heroHeight: 215,
  },
  {
    id: 'coldbrew',
    name: 'Single-Origin Kyoto Cold Drip',
    shortName: 'Kyoto Cold',
    index: '02',
    price: '$5.50',
    originElevation: 'Boquete, Panama · 1,800m',
    notes:
      '18-hour cold percolation through artisanal glass distillation columns. Features washed Panama Geisha with crystal-clear notes of bergamot, honeysuckle, and lychee.',
    tasteNotes: ['Bergamot Citrus', 'Washed Geisha', '18h Slow Drip'],
    heroImage: coldbrewGlass,
    heroWidth: 220,
    heroHeight: 340,
  },
  {
    id: 'latte',
    name: 'Velvet Layered Honey Latte',
    shortName: 'Honey Latte',
    index: '03',
    price: '$5.20',
    originElevation: 'Huila, Colombia · 1,950m',
    notes:
      'Steamed Jersey whole milk with micro-textures, Colombian Huila espresso extraction, and a delicate infusion of raw mountain wildflower honeycomb.',
    tasteNotes: ['Wildflower Honey', 'Jersey Whole Milk', 'Honeycomb Velvet'],
    heroImage: latteCup,
    heroWidth: 250,
    heroHeight: 290,
  },
  {
    id: 'ristretto',
    name: 'Double Ristretto Obsidian',
    shortName: 'Obsidian',
    index: '04',
    price: '$4.20',
    originElevation: 'Tarrazú, Costa Rica · 2,050m',
    notes:
      'Restricted 18g pull concentrated in 22 seconds. Yields a dense tiger-stripe crema with deep notes of bittersweet raw cacao, roasted hazelnut, and molasses.',
    tasteNotes: ['Tiger Crema', '85% Raw Cacao', 'Restricted Pull'],
    heroImage: espressoCup,
    heroWidth: 250,
    heroHeight: 235,
  },
];

export default function TactileMenu() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useLenis();
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [orderedId, setOrderedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Touch gesture tracking for mobile swipe navigation
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Desktop click jump: Smooth scroll to specific card in the pinned deck
  const handleCardClick = useCallback(
    (cardIndex: number) => {
      const totalCards = EXTRACTIONS.length;
      if (totalCards <= 1) return;

      const fraction = cardIndex / (totalCards - 1);
      let targetScroll: number;

      if (scrollTriggerRef.current) {
        const st = scrollTriggerRef.current;
        const totalDist = st.end - st.start;
        const safeOffset = cardIndex === totalCards - 1 ? totalDist - 2 : fraction * totalDist;
        targetScroll = st.start + safeOffset;
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const containerTop = rect.top + scrollY;
        const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
        const safeOffset = cardIndex === totalCards - 1 ? scrollDistance - 2 : fraction * scrollDistance;
        targetScroll = containerTop + safeOffset;
      } else {
        return;
      }

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [lenis]
  );

  const handleOrder = (item: ExtractionItem) => {
    setOrderedId(item.id);
    setToastMessage(`Added 1x ${item.name} to Roastery Extraction Ticket`);
    setTimeout(() => {
      setOrderedId(null);
    }, 2500);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Mobile Touch Swipe Handlers (Horizontal gestures only, non-blocking for vertical scroll)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchStartYRef.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartXRef.current - touchEndX;
    const deltaY = Math.abs(touchStartYRef.current - touchEndY);

    // Only switch card when horizontal swipe is intentional and exceeds 40px
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        setActiveMobileIndex((prev) => (prev < EXTRACTIONS.length - 1 ? prev + 1 : 0));
      } else {
        setActiveMobileIndex((prev) => (prev > 0 ? prev - 1 : EXTRACTIONS.length - 1));
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // GSAP Responsive Timeline Choreography:
  // Desktop gets pinned scrubbed rolodex stack.
  // Mobile gets ZERO scrolltriggers, ZERO sticky pinning, and 100% native scrolling.
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const deck = deckRef.current;
    if (!container || !stage || !deck) return;

    const mm = gsap.matchMedia();

    // ─── DESKTOP (md breakpoint: >= 768px): Pinned rolodex scrub timeline ────────
    mm.add('(min-width: 768px)', () => {
      const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cardElements.length < 2) return;

      const movingCards = cardElements.slice(1);
      const count = movingCards.length;
      const sliceDuration = 3 / count;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;

      // Card 0 stays anchored at resting position (top 0, bottom 0)
      gsap.set(cardElements[0], { yPercent: 0, zIndex: 10 });

      // Distribute remaining cards evenly across the scroll duration
      movingCards.forEach((card, i) => {
        const cardIndex = i + 1;
        gsap.set(card, { zIndex: 10 + cardIndex });

        const startOffset = i * sliceDuration;

        tl.fromTo(
          card,
          { yPercent: 115 },
          {
            yPercent: 0,
            ease: 'none',
            duration: sliceDuration,
          },
          startOffset
        );
      });

      return () => {
        scrollTriggerRef.current = null;
      };
    });

    // ─── MOBILE (< 768px): Reset transforms, zero scroll-hijacking overhead ─────
    mm.add('(max-width: 767px)', () => {
      scrollTriggerRef.current = null;
      const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      cardElements.forEach((card) => {
        gsap.set(card, { clearProps: 'all' });
      });
      return () => {};
    });

    return () => {
      scrollTriggerRef.current = null;
      mm.revert();
    };
  }, []);

  const activeMobileItem = EXTRACTIONS[activeMobileIndex];

  return (
    <section
      ref={containerRef}
      id="menu"
      className="relative w-full h-auto md:h-[380vh] bg-[#0E0805] text-[#FDF8F3] select-none"
    >
      {/* Lightweight Ambient Atmospheric Glow */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(200,149,108,0.05)_0%,transparent_75%)]"
        aria-hidden="true"
      />

      {/* STAGE: Natural document flow on mobile (<768px), Viewport Pinned on desktop (>=768px) */}
      <div
        ref={stageRef}
        className="relative md:sticky md:top-0 h-auto md:h-dvh w-full overflow-x-clip flex flex-col justify-between py-4 sm:py-5 md:py-5 lg:py-6 px-4 sm:px-8 lg:px-12"
      >
        {/* Soft Ambient Aura behind Deck (desktop only) */}
        <div
          className="hidden md:block pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(200,149,108,0.06)_0%,transparent_68%)]"
          aria-hidden="true"
        />

        {/* 1. TOP SECTION HEADER */}
        <div className="relative z-30 max-w-5xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 shrink-0">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C8956C] mb-1.5">
              <Sparkles size={13} />
              <span>02 / THE TACTILE MENU</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] text-[#F5EDE4] font-normal tracking-[0.08em] uppercase leading-tight">
              Curated Extractions
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-body text-xs sm:text-sm text-[#D7CCC8]/70 max-w-xs sm:text-right hidden md:block">
              Scrub to cycle through single-origin roastery extractions.
            </p>
            <div className="flex items-center gap-1.5 bg-black/40 border border-[#C8956C]/30 px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-widest text-[#E8C9A0]">
              <Layers size={12} className="text-[#C8956C]" />
              <span className="hidden sm:inline">4 STACKED LOTS</span>
              <span className="sm:hidden">4 CURATED LOTS</span>
            </div>
          </div>
        </div>

        {/* 2A. MOBILE SHOWCASE (< 768px)
            Ultra-performant: lightweight CSS, zero scroll-hijacking,
            clean touch-swipe gestures, instant tab navigation & touch targets. */}
        <div className="block md:hidden relative z-20 w-full max-w-md mx-auto my-5">
          {/* Quick Selection Tab Bar */}
          <div
            role="tablist"
            aria-label="Extraction lots"
            className="flex items-center gap-1.5 p-1 bg-[#140C08] border border-[#C8956C]/25 rounded-xl mb-3.5 overflow-x-auto scrollbar-none"
          >
            {EXTRACTIONS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeMobileIndex === idx}
                onClick={() => setActiveMobileIndex(idx)}
                className={`flex-1 min-w-[68px] py-2 px-1.5 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                  activeMobileIndex === idx
                    ? 'bg-[#C8956C] text-[#120A06] font-semibold shadow-md'
                    : 'text-[#D7CCC8]/70 hover:text-[#FDF8F3] hover:bg-white/5'
                }`}
              >
                <span className="block font-mono text-[9px] opacity-75">0{idx + 1}</span>
                <span className="truncate block font-serif text-[11px] tracking-tight">{item.shortName}</span>
              </button>
            ))}
          </div>

          {/* Interactive Mobile Card */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative bg-[#110A06] border border-[#C8956C]/25 rounded-2xl p-4 sm:p-5 overflow-hidden shadow-2xl transition-all duration-200"
          >
            {/* Subtle Inner Accent Border */}
            <div className="absolute inset-2 rounded-xl border border-white/5 pointer-events-none" />

            {/* Header: Index, Title & Price */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#C8956C]/15 relative z-10">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C8956C] font-semibold shrink-0">
                  {activeMobileItem.index}
                </span>
                <span className="text-[#C8956C]/30 font-mono text-xs">/</span>
                <h3 className="font-display italic text-sm sm:text-base text-[#FDF8F3] font-medium tracking-wide truncate">
                  {activeMobileItem.name}
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-[#E8C9A0] px-2.5 py-1 rounded-md bg-black/40 border border-[#C8956C]/30 shrink-0">
                {activeMobileItem.price}
              </span>
            </div>

            {/* Drink Hero Image Presentation (Lightweight: pure CSS radial aura, no expensive blur/drop-shadow filters) */}
            <div className="relative h-40 sm:h-48 w-full flex items-center justify-center my-2 sm:my-3">
              <div
                className="absolute w-36 h-36 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(200, 149, 108, 0.12) 0%, transparent 70%)',
                }}
              />
              <img
                src={activeMobileItem.heroImage}
                alt={activeMobileItem.name}
                width={activeMobileItem.heroWidth}
                height={activeMobileItem.heroHeight}
                className="relative z-10 max-h-[150px] sm:max-h-[180px] w-auto object-contain select-none"
                loading="eager"
              />
            </div>

            {/* Story & Tasting Notes */}
            <div className="relative z-10 space-y-2.5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C8956C] block mb-0.5">
                  {activeMobileItem.originElevation}
                </span>
                <h4 className="font-display text-base sm:text-lg text-[#F5EDE4] font-medium tracking-tight leading-snug">
                  {activeMobileItem.name}
                </h4>
              </div>

              <p className="font-body text-xs text-[#D7CCC8]/85 leading-relaxed font-light">
                {activeMobileItem.notes}
              </p>

              {/* Tasting Note Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {activeMobileItem.tasteNotes.map((note, nIdx) => (
                  <span
                    key={nIdx}
                    className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-[#E8C9A0] bg-[#1F130D] border border-[#C8956C]/30 px-2.5 py-1 rounded-full"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Full-width Touch-friendly Order Action */}
              <div className="pt-2">
                <button
                  onClick={() => handleOrder(activeMobileItem)}
                  className={`w-full cursor-pointer min-h-[46px] py-3 px-4 rounded-xl text-xs font-mono tracking-widest uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 ${
                    orderedId === activeMobileItem.id
                      ? 'bg-emerald-600 text-cream shadow-emerald-900/40'
                      : 'bg-[#C8956C] text-[#120A06] hover:bg-[#E8C9A0] border border-[#E8C9A0]/50'
                  }`}
                  aria-label={`Order ${activeMobileItem.name}`}
                >
                  {orderedId === activeMobileItem.id ? (
                    <>
                      <Check size={14} /> EXTRACTING TICKET
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> ORDER EXTRACTION — {activeMobileItem.price}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Chevrons & Pagination Indicators */}
          <div className="flex items-center justify-between mt-3 px-1">
            <button
              type="button"
              onClick={() =>
                setActiveMobileIndex((prev) => (prev > 0 ? prev - 1 : EXTRACTIONS.length - 1))
              }
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#C8956C] hover:text-[#E8C9A0] px-3 py-1.5 rounded-lg bg-[#140C08] border border-[#C8956C]/25 transition-colors cursor-pointer"
              aria-label="Previous lot"
            >
              <ChevronLeft size={14} />
              <span>PREV</span>
            </button>

            {/* Pagination Step Dots */}
            <div className="flex items-center gap-1.5">
              {EXTRACTIONS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveMobileIndex(dotIdx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeMobileIndex === dotIdx
                      ? 'w-5 h-1.5 bg-[#C8956C]'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to extraction lot 0${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveMobileIndex((prev) => (prev < EXTRACTIONS.length - 1 ? prev + 1 : 0))
              }
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#C8956C] hover:text-[#E8C9A0] px-3 py-1.5 rounded-lg bg-[#140C08] border border-[#C8956C]/25 transition-colors cursor-pointer"
              aria-label="Next lot"
            >
              <span>NEXT</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 2B. DESKTOP PINNED CARD DECK CONTAINER (>= 768px only) */}
        <div
          ref={deckRef}
          className="hidden md:block relative w-full max-w-5xl mx-auto flex-1 my-2 min-h-[380px] max-h-[520px] lg:max-h-[550px] overflow-hidden rounded-3xl border border-[#C8956C]/15 shadow-2xl"
        >
          {EXTRACTIONS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="absolute inset-x-0 will-change-transform flex flex-col"
              style={{
                top: `${idx * 48}px`,
                bottom: 0,
              }}
            >
              {/* PINNED HEADER TAB (Rolodex Tab / Breadcrumb) */}
              <div
                onClick={() => handleCardClick(idx)}
                className="relative z-30 h-[48px] rounded-t-2xl bg-[#180F0A] border-t border-x border-[#C8956C]/25 px-6 md:px-8 flex items-center justify-between cursor-pointer hover:bg-[#20140D] transition-colors group shrink-0"
                style={{
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
                }}
              >
                {/* Hairline Gold Accent on Top of Active Tab */}
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#C8956C]/60 to-transparent" />

                {/* Left: Tab Title & Index */}
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C8956C] font-semibold shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="text-[#C8956C]/30 font-mono text-xs">/</span>
                  <h3 className="font-display italic text-sm md:text-base text-[#FDF8F3] font-medium tracking-wide truncate group-hover:text-[#E8C9A0] transition-colors">
                    {item.name}
                  </h3>
                </div>

                {/* Right: Price */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="font-mono text-xs font-semibold text-[#E8C9A0] px-2.5 py-1 rounded-md bg-black/40 border border-[#C8956C]/30">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* CARD BODY (Quiet Luxury Editorial Curtain Wipe Panel) */}
              <div
                className="relative z-20 flex-1 bg-[#110A06] border-x border-b border-[#C8956C]/20 rounded-b-2xl md:rounded-b-3xl overflow-hidden p-5 md:p-6 lg:p-7 flex flex-row items-center justify-between gap-6 md:gap-8"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, #1A0E08 0%, #110A06 70%)',
                }}
              >
                {/* Subtle Inner Border Accent */}
                <div className="absolute inset-2 rounded-2xl border border-white/5 pointer-events-none" />

                {/* LEFT COLUMN: Poetic Sensory Story & Refined Details */}
                <div className="w-[56%] flex flex-col justify-between h-full relative z-10 py-0.5 space-y-2 md:space-y-3">
                  <div>
                    <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#C8956C] block mb-0.5 md:mb-1">
                      {item.originElevation}
                    </span>
                    <h4 className="font-display text-xl md:text-2xl lg:text-[1.75rem] text-[#F5EDE4] font-medium tracking-tight leading-snug">
                      {item.name}
                    </h4>
                  </div>

                  {/* Tasting Notes */}
                  <p className="font-body text-xs md:text-sm text-[#D7CCC8]/90 leading-relaxed font-light line-clamp-2 md:line-clamp-3">
                    {item.notes}
                  </p>

                  {/* Curated Taste Notes */}
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    {item.tasteNotes.map((note, nIdx) => (
                      <span
                        key={nIdx}
                        className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase text-[#E8C9A0] bg-[#1F130D]/80 border border-[#C8956C]/30 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Action & Order Row */}
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => handleOrder(item)}
                      className={`cursor-pointer px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs font-mono tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2 md:gap-2.5 shadow-lg ${
                        orderedId === item.id
                          ? 'bg-emerald-600 text-cream scale-105 shadow-emerald-900/40'
                          : 'bg-[#C8956C] text-[#120A06] hover:bg-[#E8C9A0] hover:scale-105 shadow-[#C8956C]/25 border border-[#E8C9A0]/50'
                      }`}
                      aria-label={`Order ${item.name}`}
                    >
                      {orderedId === item.id ? (
                        <>
                          <Check size={14} /> EXTRACTING TICKET
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> ORDER EXTRACTION — {item.price}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Artisanal Drink Presentation */}
                <div className="w-[44%] h-full relative flex items-center justify-center overflow-visible">
                  {/* Atmospheric Glow */}
                  <div className="absolute w-44 md:w-52 h-44 md:h-52 rounded-full bg-[#C8956C]/12 blur-2xl pointer-events-none" />

                  {/* Studio Hero Product Cutout */}
                  <img
                    src={item.heroImage}
                    alt={item.name}
                    width={item.heroWidth}
                    height={item.heroHeight}
                    className="relative z-10 max-h-[170px] md:max-h-[200px] lg:max-h-[230px] w-auto object-contain filter drop-shadow-[0_20px_24px_rgba(0,0,0,0.75)] select-none pointer-events-auto transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. BOTTOM FOOTER NAVIGATION CALLOUT */}
        <div className="relative z-30 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 md:pt-1 pb-1 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#C8956C]/70 uppercase tracking-widest">
            <Droplet size={12} />
            <span>ROASTED ON 1968 PROBAT DRUM</span>
          </div>

          <a
            href="#visit"
            className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#E8C9A0] hover:text-[#FDF8F3] border-b border-[#C8956C]/50 hover:border-[#FDF8F3] pb-0.5 transition-colors"
          >
            <span>FULL TASTING ROSTER</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1A100B]/95 border border-[#C8956C] text-[#FDF8F3] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-2xl backdrop-blur-md font-mono text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-2.5 sm:gap-3 max-w-[92vw] text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
