import { useRef, useState, type MouseEvent } from 'react';
import { Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

import cappuccinoCup from '../assets/images/hero/cappuccino-cup.webp';
import coldbrewGlass from '../assets/images/hero/coldbrew-glass.webp';
import latteCup from '../assets/images/hero/latte-cup.webp';
import espressoCup from '../assets/images/hero/espresso-cup.webp';
import singleCoffeeBean from '../assets/images/hero/single-coffee-bean.webp';
import creamSplash from '../assets/images/hero/cream-splash.webp';
import cinnamonSticks from '../assets/images/hero/cinnamon-sticks.webp';
import sugarCubes from '../assets/images/hero/sugar-cubes.webp';
import mintLeaf from '../assets/images/hero/mint-leaf.webp';
import flyingCoffeeBeans from '../assets/images/hero/flying-coffee-beans.webp';

interface TactileItem {
  id: string;
  name: string;
  category: string;
  index: string;
  price: string;
  notes: string;
  origin: string;
  elevation: string;
  heroImage: string;
  backdropImage: string;
  foregroundImage: string;
  accentColor: string;
}

const ITEMS: TactileItem[] = [
  {
    id: 'cappuccino',
    name: 'Artisan Cortado & Cappuccino',
    category: 'Signature Hot',
    index: '01',
    price: '$4.80',
    notes: 'Velvety microfoam, single-origin Ethiopian Guji, candied orange & wild stonefruit',
    origin: 'Guji Highland, Ethiopia',
    elevation: '2,150m',
    heroImage: cappuccinoCup,
    backdropImage: sugarCubes,
    foregroundImage: singleCoffeeBean,
    accentColor: '#C8956C',
  },
  {
    id: 'coldbrew',
    name: 'Single-Origin Kyoto Cold Drip',
    category: 'Slow Extraction',
    index: '02',
    price: '$5.50',
    notes: '18-hour cold percolation, washed Panama Geisha, crisp notes of jasmine, bergamot & lychee',
    origin: 'Boquete, Panama',
    elevation: '1,800m',
    heroImage: coldbrewGlass,
    backdropImage: flyingCoffeeBeans,
    foregroundImage: mintLeaf,
    accentColor: '#A0714D',
  },
  {
    id: 'latte',
    name: 'Velvet Layered Honey Latte',
    category: 'Signature Warmth',
    index: '03',
    price: '$5.20',
    notes: 'Steamed jersey whole milk, Colombian Huila espresso, raw wildflower honeycomb infusion',
    origin: 'Huila, Colombia',
    elevation: '1,950m',
    heroImage: latteCup,
    backdropImage: cinnamonSticks,
    foregroundImage: creamSplash,
    accentColor: '#E8C9A0',
  },
  {
    id: 'ristretto',
    name: 'Double Ristretto Obsidian',
    category: 'Pure Extraction',
    index: '04',
    price: '$4.20',
    notes: 'Restricted 18g pull in 22 seconds, dense tiger-stripe crema, bittersweet cacao & roasted hazelnut',
    origin: 'Tarrazú, Costa Rica',
    elevation: '2,050m',
    heroImage: espressoCup,
    backdropImage: sugarCubes,
    foregroundImage: singleCoffeeBean,
    accentColor: '#C8956C',
  },
];

function TactileCard({ item, onAdd }: { item: TactileItem; onAdd: (name: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLImageElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const fgRef = useRef<HTMLImageElement>(null);
  const [isOrdered, setIsOrdered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 10;

    // Tilt card
    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
    });

    // Opposite pop-out parallax for hero cup
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        x: (x - centerX) * 0.12,
        y: (y - centerY) * 0.12,
        duration: 0.45,
        ease: 'power2.out',
      });
    }

    // Deep background ingredient moves slower (depth-of-field)
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        x: (x - centerX) * -0.06,
        y: (y - centerY) * -0.06,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    // Foreground ingredient moves faster (closest to lens)
    if (fgRef.current) {
      gsap.to(fgRef.current, {
        x: (x - centerX) * 0.2,
        y: (y - centerY) * 0.2,
        rotation: (x - centerX) * 0.08,
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'power3.out',
    });

    if (heroRef.current) {
      gsap.to(heroRef.current, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' });
    }
    if (bgRef.current) {
      gsap.to(bgRef.current, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
    }
    if (fgRef.current) {
      gsap.to(fgRef.current, { x: 0, y: 0, rotation: 0, duration: 0.7, ease: 'power3.out' });
    }
  };

  const handleAction = () => {
    setIsOrdered(true);
    onAdd(item.name);
    setTimeout(() => setIsOrdered(false), 2400);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-3xl p-6 sm:p-8 bg-[#231712]/70 border border-[#C8956C]/20 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(200,149,108,0.15)] flex flex-col justify-between preserve-3d will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Top Meta Bar */}
      <div className="relative z-20 flex items-start justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80 block mb-1">
            {item.category} · {item.index}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-cream font-bold group-hover:text-[#E8C9A0] transition-colors leading-tight">
            {item.name}
          </h3>
        </div>
        <div className="font-display text-xl sm:text-2xl font-bold text-accent px-3 py-1 rounded-xl bg-black/30 border border-white/5 backdrop-blur-sm">
          {item.price}
        </div>
      </div>

      {/* 3D Diorama Stage */}
      <div className="relative w-full h-64 sm:h-72 my-4 flex items-center justify-center overflow-visible pointer-events-none">
        {/* Layer 0: Depth-of-field background ingredient (blurred, subtle) */}
        <img
          ref={bgRef}
          src={item.backdropImage}
          alt=""
          aria-hidden="true"
          className="absolute z-0 w-24 sm:w-28 opacity-40 filter blur-[3px] -left-2 top-8 pointer-events-none select-none transition-transform duration-300"
        />

        {/* Ambient Product Glow Behind Hero */}
        <div className="absolute w-44 h-44 rounded-full bg-accent/15 blur-2xl pointer-events-none" />

        {/* Layer 10: Hero Product Cutout (Breaks bounds) */}
        <img
          ref={heroRef}
          src={item.heroImage}
          alt={item.name}
          className="relative z-10 w-52 sm:w-60 max-w-none filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.65)] select-none transition-transform duration-300 pointer-events-auto"
        />

        {/* Layer 20: Foreground orbiting micro-element (closest to viewer, dynamic) */}
        <img
          ref={fgRef}
          src={item.foregroundImage}
          alt=""
          aria-hidden="true"
          className="absolute z-20 w-16 sm:w-20 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] -right-3 bottom-4 pointer-events-none select-none"
        />
      </div>

      {/* Bottom Information & Tasting Notes */}
      <div className="relative z-20 pt-4 border-t border-white/10 flex flex-col gap-4">
        <p className="font-body text-xs sm:text-sm text-cream/70 leading-relaxed line-clamp-2">
          {item.notes}
        </p>

        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-accent/70 uppercase">
          <span>{item.origin}</span>
          <span>{item.elevation}</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cream/50 group-hover:text-cream transition-colors flex items-center gap-1.5">
            Single Extraction
          </span>

          <button
            onClick={handleAction}
            className={`cursor-pointer px-4 py-2.5 rounded-full text-xs font-mono tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg ${
              isOrdered
                ? 'bg-emerald-600 text-cream scale-105'
                : 'bg-accent text-brown-900 hover:bg-[#E8C9A0] hover:scale-105 shadow-accent/20'
            }`}
            aria-label={`Order ${item.name}`}
          >
            {isOrdered ? (
              <>
                <Check size={14} /> EXTRACTING
              </>
            ) : (
              <>
                <Plus size={14} /> ORDER NOW
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TactileMenu() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddItem = (name: string) => {
    setToastMessage(`Added 1x ${name} to roastery extraction ticket`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <section
      id="menu"
      className="relative w-full py-28 sm:py-36 bg-[#160E0A] text-cream px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Background Ambience & Gradient Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#A0714D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">
              <Sparkles size={14} />
              <span>02 / THE TACTILE MENU</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream font-bold tracking-tight">
              Curated Extractions
            </h2>
          </div>
          <p className="font-body text-cream/70 max-w-md text-sm sm:text-base leading-relaxed">
            Move your cursor or touch each vessel to feel its weightless tactile geometry. Small-batch roasted on our 1968 Probat drum.
          </p>
        </div>

        {/* Diorama Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 perspective-1200">
          {ITEMS.map((item) => (
            <TactileCard key={item.id} item={item} onAdd={handleAddItem} />
          ))}
        </div>

        {/* Bottom Menu Action */}
        <div className="mt-16 sm:mt-24 text-center">
          <a
            href="#visit"
            className="inline-flex items-center gap-3 border border-accent/60 text-accent hover:bg-accent hover:text-brown-900 rounded-full px-10 py-4 font-mono text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-500 shadow-md hover:shadow-accent/20 hover:scale-105"
          >
            <span>VIEW COMPLETE ROASTERY CATALOG</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brown-900/95 border border-accent text-cream px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md font-mono text-xs uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
