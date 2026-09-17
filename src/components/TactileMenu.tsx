import { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Plus, Check, Droplet, ArrowRight, Layers } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useLenis } from '../context/LenisContext';

import cappuccinoCup from '../assets/images/hero/cappuccino-cup.webp';
import coldbrewGlass from '../assets/images/hero/coldbrew-glass.webp';
import latteCup from '../assets/images/hero/latte-cup.webp';
import espressoCup from '../assets/images/hero/espresso-cup.webp';
import singleCoffeeBean from '../assets/images/hero/single-coffee-bean.webp';
import creamSplash from '../assets/images/hero/cream-splash.webp';
import mintLeaf from '../assets/images/hero/mint-leaf.webp';
import cinnamonSticks from '../assets/images/hero/cinnamon-sticks.webp';

interface ExtractionItem {
  id: string;
  name: string;
  index: string;
  price: string;
  originElevation: string;
  notes: string;
  tasteNotes: string[];
  heroImage: string;
  heroWidth: number;
  heroHeight: number;
  accentImage: string;
}

const EXTRACTIONS: ExtractionItem[] = [
  {
    id: 'cappuccino',
    name: 'Artisan Cortado & Cappuccino',
    index: '01',
    price: '$4.80',
    originElevation: 'Guji Highland, Ethiopia · 2,150m',
    notes:
      'Aerated silky microfoam paired with single-origin Ethiopian Guji. Offers nuanced undertones of candied orange, wild stonefruit, and floral jasmine blossom.',
    tasteNotes: ['Candied Orange', 'Wild Stonefruit', 'Silky Microfoam'],
    heroImage: cappuccinoCup,
    heroWidth: 260,
    heroHeight: 215,
    accentImage: singleCoffeeBean,
  },
  {
    id: 'coldbrew',
    name: 'Single-Origin Kyoto Cold Drip',
    index: '02',
    price: '$5.50',
    originElevation: 'Boquete, Panama · 1,800m',
    notes:
      '18-hour cold percolation through artisanal glass distillation columns. Features washed Panama Geisha with crystal-clear notes of bergamot, honeysuckle, and lychee.',
    tasteNotes: ['Bergamot Citrus', 'Washed Geisha', '18h Slow Drip'],
    heroImage: coldbrewGlass,
    heroWidth: 220,
    heroHeight: 340,
    accentImage: mintLeaf,
  },
  {
    id: 'latte',
    name: 'Velvet Layered Honey Latte',
    index: '03',
    price: '$5.20',
    originElevation: 'Huila, Colombia · 1,950m',
    notes:
      'Steamed Jersey whole milk with micro-textures, Colombian Huila espresso extraction, and a delicate infusion of raw mountain wildflower honeycomb.',
    tasteNotes: ['Wildflower Honey', 'Jersey Whole Milk', 'Honeycomb Velvet'],
    heroImage: latteCup,
    heroWidth: 250,
    heroHeight: 290,
    accentImage: cinnamonSticks,
  },
  {
    id: 'ristretto',
    name: 'Double Ristretto Obsidian',
    index: '04',
    price: '$4.20',
    originElevation: 'Tarrazú, Costa Rica · 2,050m',
    notes:
      'Restricted 18g pull concentrated in 22 seconds. Yields a dense tiger-stripe crema with deep notes of bittersweet raw cacao, roasted hazelnut, and molasses.',
    tasteNotes: ['Tiger Crema', '85% Raw Cacao', 'Restricted Pull'],
    heroImage: espressoCup,
    heroWidth: 250,
    heroHeight: 235,
    accentImage: creamSplash,
  },
];

export default function TactileMenu() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useLenis();

  const [orderedId, setOrderedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Smooth jump to specific card when clicking its header tab
  const handleCardClick = useCallback(
    (cardIndex: number) => {
      if (!containerRef.current) return;
      const totalCards = EXTRACTIONS.length;
      if (totalCards <= 1) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const containerTop = rect.top + scrollY;
      const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;

      // Card 0 is at start (0%), cards 1..3 mapped across [0.08, 0.95]
      const fraction = cardIndex === 0 ? 0 : (cardIndex / (totalCards - 1)) * 0.92;
      const targetScroll = containerTop + fraction * scrollDistance;

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 0.9,
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

  // GSAP ScrollTrigger Accordion Stack Timeline
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const deck = deckRef.current;
    if (!container || !stage || !deck) return;

    const ctx = gsap.context(() => {
      // Responsive Tab Height: 52px on mobile, 60px on md+
      const isMobile = window.innerWidth < 768;
      const tabHeight = isMobile ? 52 : 60;

      const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cardElements.length < 2) return;

      // Create smooth scrubbing timeline pinned across container scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Card 0 stays anchored at top 0.
      // Subsequent cards slide up sequentially and stop at (i * tabHeight)
      cardElements.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { y: 0, zIndex: 10 });
          return;
        }

        const targetY = i * tabHeight;
        const zIndex = 10 + i;
        gsap.set(card, { zIndex });

        // Start offscreen below viewport and slide upward
        tl.fromTo(
          card,
          {
            yPercent: 125,
            y: 0,
          },
          {
            yPercent: 0,
            y: targetY,
            ease: 'power1.inOut',
            duration: 1.2,
          },
          (i - 1) * 1.0
        );

        // Subtly parallax the floating accent element inside the card
        const fgImg = card.querySelector('.parallax-fg');
        if (fgImg) {
          tl.fromTo(
            fgImg,
            { y: 35, rotation: -12 },
            { y: -15, rotation: 12, ease: 'none', duration: 1.2 },
            (i - 1) * 1.0
          );
        }
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="menu"
      className="relative w-full h-[380vh] bg-[#0E0805] text-[#FDF8F3] select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #1A100B 0%, #0E0805 70%)',
      }}
    >
      {/* Ambient Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(200,149,108,0.06)_0%,transparent_75%)]" />

      {/* STICKY STAGE (Viewport Pinned) */}
      <div
        ref={stageRef}
        className="sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between py-5 sm:py-7 md:py-8 px-4 sm:px-8 lg:px-12"
      >
        {/* 1. TOP SECTION HEADER */}
        <div className="relative z-30 max-w-5xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
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
              <span>4 STACKED LOTS</span>
            </div>
          </div>
        </div>

        {/* 2. PINNED CARD DECK CONTAINER */}
        <div
          ref={deckRef}
          className="relative w-full max-w-5xl mx-auto flex-1 my-2 sm:my-3 min-h-[420px] max-h-[540px] sm:max-h-[560px] md:max-h-[580px] lg:max-h-[600px]"
        >
          {EXTRACTIONS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="absolute inset-x-0 top-0 h-full will-change-transform flex flex-col"
            >
              {/* PINNED HEADER TAB (Rolodex Tab / Breadcrumb) */}
              <div
                onClick={() => handleCardClick(idx)}
                className="relative z-30 h-[52px] md:h-[60px] rounded-t-2xl sm:rounded-t-3xl bg-[#180F0A] border-t border-x border-[#C8956C]/25 px-4 sm:px-7 md:px-8 flex items-center justify-between shadow-[0_16px_30px_rgba(0,0,0,0.7)] cursor-pointer hover:bg-[#20140D] transition-colors group"
                style={{
                  boxShadow: '0 16px 30px rgba(0, 0, 0, 0.65)',
                }}
              >
                {/* Hairline Gold Accent on Top of Active Tab */}
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#C8956C]/60 to-transparent" />

                {/* Left: Tab Title & Index */}
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C8956C] font-semibold shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="text-[#C8956C]/30 font-mono text-xs">
                    /
                  </span>
                  <h3 className="font-display italic text-sm sm:text-base md:text-lg text-[#FDF8F3] font-medium tracking-wide truncate group-hover:text-[#E8C9A0] transition-colors">
                    {item.name}
                  </h3>
                </div>

                {/* Right: Price */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#E8C9A0] px-3 py-1 rounded-md bg-black/40 border border-[#C8956C]/30">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* CARD BODY (Quiet Luxury Editorial Curtain Wipe Panel) */}
              <div
                className="relative z-20 flex-1 bg-[#110A06] border-x border-b border-[#C8956C]/20 rounded-b-2xl sm:rounded-b-3xl overflow-hidden p-5 sm:p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8"
                style={{
                  background:
                    'radial-gradient(ellipse at 70% 50%, #1A0E08 0%, #110A06 70%)',
                }}
              >
                {/* Subtle Inner Border Accent */}
                <div className="absolute inset-2 rounded-xl sm:rounded-2xl border border-white/5 pointer-events-none" />

                {/* LEFT COLUMN: Poetic Sensory Story & Refined Details */}
                <div className="w-full md:w-[54%] flex flex-col justify-between h-full relative z-10 space-y-3 sm:space-y-4">
                  <div>
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C8956C] block mb-1">
                      {item.originElevation}
                    </span>
                    <h4 className="font-display text-xl sm:text-2xl md:text-3xl text-[#F5EDE4] font-medium tracking-tight leading-snug">
                      {item.name}
                    </h4>
                  </div>

                  {/* Tasting Notes */}
                  <p className="font-body text-xs sm:text-sm md:text-[0.9375rem] text-[#D7CCC8]/90 leading-relaxed font-light">
                    {item.notes}
                  </p>

                  {/* Curated Taste Notes */}
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    {item.tasteNotes.map((note, nIdx) => (
                      <span
                        key={nIdx}
                        className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-[#E8C9A0] bg-[#1F130D]/80 border border-[#C8956C]/30 px-3 py-1 rounded-full"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Action & Order Row */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => handleOrder(item)}
                      className={`cursor-pointer px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-mono tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2.5 shadow-lg ${
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
                <div className="w-full md:w-[44%] h-44 sm:h-56 md:h-full relative flex items-center justify-center overflow-visible">
                  {/* Atmospheric Glow */}
                  <div className="absolute w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-[#C8956C]/12 blur-3xl pointer-events-none" />

                  {/* Studio Hero Product Cutout */}
                  <img
                    src={item.heroImage}
                    alt={item.name}
                    width={item.heroWidth}
                    height={item.heroHeight}
                    className="relative z-10 max-h-[170px] sm:max-h-[210px] md:max-h-[250px] lg:max-h-[270px] w-auto object-contain filter drop-shadow-[0_22px_28px_rgba(0,0,0,0.85)] select-none pointer-events-auto transition-transform duration-500 hover:scale-105"
                  />

                  {/* Floating Micro Accent Element */}
                  <img
                    src={item.accentImage}
                    alt=""
                    aria-hidden="true"
                    className="parallax-fg absolute z-20 w-12 sm:w-16 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] -right-2 bottom-2 pointer-events-none select-none will-change-transform"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. BOTTOM FOOTER NAVIGATION CALLOUT */}
        <div className="relative z-30 max-w-5xl mx-auto w-full flex items-center justify-between pt-1 pb-1">
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1A100B]/95 border border-[#C8956C] text-[#FDF8F3] px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md font-mono text-xs uppercase tracking-wider flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
