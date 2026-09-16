import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useLenis } from '../context/LenisContext';
import { Compass, Clock, VolumeX, ArrowUpRight, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import qualityCoffeeImg from '../assets/images/features/quality-coffee.jpg';
import freshDeliciousImg from '../assets/images/features/fresh-delicious.jpg';
import cozyAtmosphereImg from '../assets/images/features/cozy-atmosphere.jpg';
import singleCoffeeBean from '../assets/images/hero/single-coffee-bean.webp';

export interface Chapter {
  id: string;
  index: string;
  badge: string;
  title: string;
  previewText: string[];
  quote: string;
  dropCap: string;
  story: string;
  storyCont: string;
  image: string;
  specs: { label: string; value: string }[];
  icon: typeof Compass;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'sourcing',
    index: '01',
    badge: 'THE HEIRLOOM HARVEST',
    title: 'The Monastic Sourcing',
    previewText: [
      'Small runs. No conveyor belts, just slow simmering,',
      'constant taste checks, and Doug hovering like it owes him money.',
    ],
    quote: 'Coffee is not roasted to be swallowed; it is crafted to arrest the velocity of the morning.',
    dropCap: 'E',
    story:
      'very lot begins on mist-veiled volcanic ridges above 2,100 meters, where Arabica cherries mature in patient, shade-grown stillness. We bypass commodity brokers to partner exclusively with generational growers who hand-select only crimson, brix-dense cherries at peak dawn ripeness.',
    storyCont:
      'In our roastery, we roast on an analog cast-iron drum, relying on olfactory cues and airflow modulation rather than algorithmic presets to unlock vibrant stonefruit acidity and honeyed aromatics.',
    image: qualityCoffeeImg,
    specs: [
      { label: 'ELEVATION', value: '2,100M – 2,350M' },
      { label: 'VARIETAL', value: 'HEIRLOOM TYPICA & BOURBON' },
      { label: 'FERMENT', value: 'NATURAL ANAEROBIC (72H)' },
      { label: 'DRYING', value: 'SUSPENDED AFRICAN BEDS' },
    ],
    icon: Compass,
  },
  {
    id: 'bakery',
    index: '02',
    badge: 'THE DAWN OVEN',
    title: 'The Dawn Oven',
    previewText: [
      'Small runs. Precision heat. Single-origin micro-roasting at sunrise.',
      'Every bean is captured at its flavor peak by Doug, who oversees each crack.',
    ],
    quote: 'Long before the city street lamps flicker out, the wild sourdough cultures begin their slow exhale.',
    dropCap: 'B',
    story:
      'ehind frosted glass, our viennoiserie masters work through the quietest hours of the night. Each croissant is laminated with cultured butter from grass-fed Normandy herds, layered through 81 distinct folds across a 72-hour cold retard process to ensure an audible, honeycomb shatter upon bite.',
    storyCont:
      'We grind heritage stoneground grains daily to preserve volatile wheat oils, pairing warm brioches and seasonal galettes with our daily roast profiles.',
    image: freshDeliciousImg,
    specs: [
      { label: 'FERMENT', value: '72H SLOW SOURDOUGH CULT' },
      { label: 'BUTTER', value: '84% AOP NORMANDY BUTTER' },
      { label: 'LAMINATION', value: '81 CRISP FLAKY LAYERS' },
      { label: 'ROAST', value: 'ANALOG CAST-IRON DRUM' },
    ],
    icon: Clock,
  },
  {
    id: 'space',
    index: '03',
    badge: 'THE ACOUSTIC SANCTUARY',
    title: 'The Acoustic Sanctuary',
    previewText: [
      'Real fruit. Fresh from local growers. No powders. No synthetic shortcuts.',
      'Hand-selected, sliced, spiced, and distilled in unhurried rhythm.',
    ],
    quote: 'We constructed not just a café, but a physical refusal of contemporary noise and hurry.',
    dropCap: 'S',
    story:
      'tep beyond our threshold and the high-frequency friction of metropolitan life recedes. Crafted with acoustic oak baffles, raw limestone surfaces, and natural daylight orientation, CREMA provides an intentional soundscape where thoughts expand without interference.',
    storyCont:
      'Every ceramic cup is hand-thrown by local potters with deliberate thermal mass, inviting you to linger, read, or contemplate undisturbed for as long as your spirit requires.',
    image: cozyAtmosphereImg,
    specs: [
      { label: 'ACOUSTICS', value: 'NATURAL OAK BAFFLING' },
      { label: 'LIGHTING', value: 'DIFFUSED NORTHERN LUX' },
      { label: 'CERAMICS', value: 'HAND-THROWN HIGH-IRON' },
      { label: 'ATMOSPHERE', value: 'UNHURRIED MEDITATIVE' },
    ],
    icon: VolumeX,
  },
];

const PIN_DISTANCE = 750;

export default function EditorialStory() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();

  // Initial resting position: 0 (Step 01 in the middle!)
  const [dialProgress, setDialProgress] = useState<number>(0);
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Active step integer (0, 1, 2)
  const activeStep = Math.min(2, Math.max(0, Math.round(dialProgress)));

  // Interaction locks & timestamps
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);

  // Monograph Modal state
  const [selectedMonograph, setSelectedMonograph] = useState<Chapter | null>(null);

  // Smooth spring lerp for dial movements (used primarily for pointer drag snapping)
  const animateDial = useCallback(function tick() {
    const diff = targetProgress.current - currentProgress.current;
    if (Math.abs(diff) > 0.001) {
      currentProgress.current += diff * 0.18;
      setDialProgress(currentProgress.current);
      animFrameId.current = requestAnimationFrame(tick);
    } else {
      currentProgress.current = targetProgress.current;
      setDialProgress(targetProgress.current);
      animFrameId.current = null;
    }
  }, []);

  // Discrete 1-Touch Step Navigator: moves exactly 1 step and syncs scroll
  const goToStep = useCallback(
    (targetStep: number) => {
      const clamped = Math.max(0, Math.min(2, targetStep));
      targetProgress.current = clamped;

      // Sync page scroll with the step inside the pinned region.
      // We rely on lenis.scrollTo to drive the ScrollTrigger progress, 
      // which in turn perfectly synchronizes the dial without stuttering.
      if (scrollTriggerInstance.current) {
        const st = scrollTriggerInstance.current;
        const targetScroll = st.start + (clamped / 2) * PIN_DISTANCE;

        if (lenis) {
          lenis.scrollTo(targetScroll, {
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      } else {
        // Fallback if ScrollTrigger is missing
        if (animFrameId.current === null) {
          animFrameId.current = requestAnimationFrame(animateDial);
        }
      }
    },
    [lenis, animateDial]
  );

  // Pinned ScrollTrigger setup (Starts at Step 01 when section docks at top)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Sync GSAP's scroll progress directly to our dial progress unless user is pointer-dragging the dial
          if (!isDragging.current) {
            const p = self.progress * 2;
            targetProgress.current = p;
            currentProgress.current = p;
            setDialProgress(p);
          }
        },
      });
      scrollTriggerInstance.current = st;
    }, container);

    return () => {
      ctx.revert();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // 1-Touch Scroll Interceptors removed: The dial now smoothly tracks native scroll momentum.

  // Pointer drag on track
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartProgress.current = currentProgress.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const trackWidth = trackRef.current?.offsetWidth || window.innerWidth;
    const stepDelta = -(deltaX / (trackWidth * 0.32));
    const nextProgress = Math.max(-0.1, Math.min(2.1, dragStartProgress.current + stepDelta));
    targetProgress.current = nextProgress;
    currentProgress.current = nextProgress;
    setDialProgress(nextProgress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    const snapped = Math.round(Math.max(0, Math.min(2, currentProgress.current)));
    goToStep(snapped);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToStep(Math.max(0, activeStep - 1));
      } else if (e.key === 'ArrowRight') {
        goToStep(Math.min(2, activeStep + 1));
      } else if (e.key === 'Escape' && selectedMonograph) {
        setSelectedMonograph(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, selectedMonograph, goToStep]);

  // Parabolic dome geometry (continuous mathematical interpolation "ribbon physics"):
  // Tracks exactly to the SVG Bezier curve so the dashed line dead-centers the numerals.
  const calculateGeometry = (stepIndex: number) => {
    const delta = stepIndex - dialProgress;
    const xPct = 50 + delta * 33;
    const normalizedDist = Math.abs(delta);

    // Exact quadratic Bezier Y calculation matching: M 0 76 Q 600 16 1200 76
    const t = xPct / 100;
    const exactY = Math.pow(1 - t, 2) * 76 + 2 * (1 - t) * t * 16 + Math.pow(t, 2) * 76;

    // Tangent slope angle
    const rotationDeg = delta * 8;

    // Smooth scaling from 1.05 (center) down to 0.65 (edges)
    const scale = Math.max(0.65, 1.05 - normalizedDist * 0.4);

    // Number opacity: overall fade near the edges, never abruptly pops
    const opacity = Math.max(0.15, 1.0 - normalizedDist * 0.6);

    // Badge continuous interpolation (fades out and moves down smoothly as it leaves center)
    const badgeOpacity = Math.max(0, 1 - normalizedDist * 2.5);
    const badgeTranslateY = normalizedDist * 16;
    const badgeScale = Math.max(0.85, 1 - normalizedDist * 0.2);

    // Crossfade between Solid Fill (Center) and Wireframe (Sides)
    const fillOpacity = Math.max(0, 1 - normalizedDist * 1.5);
    const wireframeOpacity = Math.min(1, normalizedDist * 1.5);

    const isInteractiveCenter = normalizedDist < 0.2;

    return { 
      delta, 
      xPct, 
      exactY, 
      rotationDeg, 
      scale, 
      opacity, 
      badgeOpacity, 
      badgeTranslateY, 
      badgeScale, 
      fillOpacity, 
      wireframeOpacity, 
      isInteractiveCenter 
    };
  };

  // Coffee Bean marker: sits at 50% + 9.2% width, perfectly hugging the exact Bezier path
  const beanGeometry = useMemo(() => {
    const beanXPct = 50 + 9.2;
    const t = beanXPct / 100;
    const exactY = Math.pow(1 - t, 2) * 76 + 2 * (1 - t) * t * 16 + Math.pow(t, 2) * 76;
    // Roll rotation as dial travels between numbers
    const rollAngle = 26 + dialProgress * 40;
    return { beanXPct, exactY, rollAngle };
  }, [dialProgress]);

  const activeChapter = CHAPTERS[activeStep];

  return (
    <section
      ref={containerRef}
      id="why-us"
      className="relative w-full h-dvh max-h-dvh bg-[#140C08] text-[#FDF8F3] overflow-hidden select-none flex flex-col justify-between py-6 sm:py-8"
      style={{
        background:
          'radial-gradient(ellipse at 50% 34%, #28170F 0%, #160D08 55%, #0D0704 100%)',
      }}
    >
      {/* Anchor shim for legacy #about links */}
      <span id="about" className="absolute top-0 pointer-events-none" />

      {/* Atmospheric warm ambient glow & vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_34%,rgba(218,165,96,0.13)_0%,rgba(0,0,0,0.7)_85%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#140C08] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#140C08] to-transparent pointer-events-none" />

      {/* 1. TOP HEADER (Pinned high with generous vertical breathing room) */}
      <header className="relative z-20 text-center px-6 max-w-5xl mx-auto pt-2 md:pt-4">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] text-[#F5EDE4] font-normal tracking-[0.18em] uppercase leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.85)]">
          Our Journey of Distillation
        </h2>
      </header>

      {/* 2. CENTRAL DIAL TRACK (Only the numbers, badge, and coffee bean on the curve) */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative z-10 w-full h-[320px] sm:h-[350px] md:h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none overflow-hidden my-auto"
      >
        {/* SVG DELICATE DOTTED GOLD GUIDELINE DOME */}
        <div className="absolute inset-x-0 top-[180px] sm:top-[195px] md:top-[210px] -translate-y-1/2 h-[120px] pointer-events-none z-0">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="goldDottedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C8956C" stopOpacity="0.08" />
                <stop offset="15%" stopColor="#D4A373" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#F5EDE4" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#D4A373" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#C8956C" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            {/* Parabolic dome: starts at (0, 76), crests at (600, 16), ends at (1200, 76) */}
            <path
              d="M 0 76 Q 600 16 1200 76"
              stroke="url(#goldDottedGrad)"
              strokeWidth="1.8"
              strokeDasharray="2.5 6.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ROASTED COFFEE BEAN PIN MARKER WITH CONTINUOUS FLOAT & ROLL */}
        <div
          className="absolute z-20 pointer-events-none top-[180px] sm:top-[195px] md:top-[210px] -translate-y-1/2 will-change-transform"
          style={{
            left: `${beanGeometry.beanXPct}%`,
            transform: `translate(-50%, calc(-50% + ${beanGeometry.exactY}px)) rotate(${beanGeometry.rollAngle}deg)`,
          }}
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[4.5rem] md:h-[4.5rem] animate-float-bean">
            <img
              src={singleCoffeeBean}
              alt="Roasted Coffee Bean Marker"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(218,165,96,0.45)]"
              draggable={false}
            />
          </div>
        </div>

        {/* THREE NUMERALS (01, 02, 03) */}
        {CHAPTERS.map((chap, idx) => {
          const geo = calculateGeometry(idx);

          return (
            <div
              key={chap.id}
              onClick={() => {
                if (idx !== activeStep) {
                  goToStep(idx);
                }
              }}
              style={{
                left: `${geo.xPct}%`,
                // Calculate position so the dashed line exactly pierces the vertical center of the numeral
                transform: `translate(-50%, calc(-50% + ${geo.exactY}px)) rotate(${geo.rotationDeg}deg) scale(${geo.scale})`,
                opacity: geo.opacity,
                willChange: 'transform, opacity',
              }}
              className={`absolute top-[180px] sm:top-[195px] md:top-[210px] -translate-y-1/2 flex flex-col items-center justify-center select-none ${
                geo.isInteractiveCenter
                  ? 'z-30 cursor-default'
                  : 'z-10 cursor-pointer hover:opacity-40 transition-opacity'
              }`}
            >
              {/* CREAM BADGE (Absolutely positioned above the numeral to decouple from document flow) */}
              <div
                className="absolute bottom-[80%] pointer-events-none whitespace-nowrap z-40 will-change-transform"
                style={{
                  opacity: geo.badgeOpacity,
                  transform: `translateY(${geo.badgeTranslateY}px) scale(${geo.badgeScale})`,
                  display: geo.badgeOpacity > 0.01 ? 'block' : 'none'
                }}
              >
                <div className="bg-[#F5EDE4] text-[#1E110A] px-4 py-1 sm:px-5 sm:py-1.5 rounded-sm shadow-[0_4px_18px_rgba(0,0,0,0.7)] font-mono text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase border border-[#FAF3EB]/60">
                  {chap.badge}
                </div>
              </div>

              {/* NUMERAL DISPLAY (Stacked continuous crossfade) */}
              <div className="relative font-sans font-light tracking-tighter leading-none select-none flex items-center justify-center">
                {/* 1. SIDES INACTIVE: Delicate wireframe outline */}
                <span
                  style={{
                    WebkitTextStroke: '1.5px rgba(200, 149, 108, 0.45)',
                    color: 'transparent',
                    opacity: geo.wireframeOpacity,
                  }}
                  className="block text-[6.5rem] sm:text-[8rem] md:text-[9.5rem] lg:text-[10.5rem] font-light will-change-opacity"
                >
                  {chap.index}
                </span>

                {/* 2. CENTER ACTIVE: Solid warm cream fill with luminous ambient gold glow */}
                <span
                  style={{
                    color: '#F5F2ED',
                    textShadow: '0 0 32px rgba(232, 201, 160, 0.45), 0 0 60px rgba(200, 149, 108, 0.25)',
                    opacity: geo.fillOpacity,
                  }}
                  className="absolute inset-0 block text-[6.5rem] sm:text-[8rem] md:text-[9.5rem] lg:text-[10.5rem] font-medium will-change-opacity flex items-center justify-center"
                >
                  {chap.index}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. DEDICATED STATIC STORY CONTAINER BELOW THE ARC (Clean, isolated, centered) */}
      <div className="relative z-20 max-w-xl mx-auto px-6 text-center min-h-[140px] sm:min-h-[150px] flex flex-col items-center justify-center">
        {/* Animated Story Text with smooth cross-fade */}
        <div
          key={activeChapter.id}
          className="transition-all duration-300 ease-out animate-fade-in"
        >
          <p className="font-body text-base sm:text-[1.0625rem] md:text-lg font-medium text-[#E6DFD5] leading-[1.7] max-w-lg mx-auto">
            {activeChapter.previewText.join(' ')}
          </p>

          {/* Underlined "LEARN MORE" Button */}
          <div className="mt-4 sm:mt-5 flex justify-center">
            <button
              onClick={() => setSelectedMonograph(activeChapter)}
              className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[#E8C9A0] hover:text-[#FDF8F3] transition-all duration-300 border-b border-[#C8956C]/60 hover:border-[#FDF8F3] pb-1 cursor-pointer"
            >
              <span>LEARN MORE</span>
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ALWAYS-VISIBLE NAVIGATION BAR & DIAL INDICATORS (Guaranteed within 100vh) */}
      <footer className="relative z-30 flex items-center justify-between px-6 sm:px-12 max-w-md mx-auto w-full pt-1 pb-2">
        {/* Prev Arrow */}
        <button
          onClick={() => goToStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          aria-label="Previous step"
          className={`p-2.5 rounded-full border border-[#C8956C]/30 text-[#E8C9A0] transition-all duration-300 flex items-center justify-center ${
            activeStep === 0
              ? 'opacity-20 cursor-not-allowed'
              : 'hover:bg-[#C8956C]/20 hover:border-[#E8C9A0] cursor-pointer'
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Vintage Dial Indicators */}
        <div className="flex items-center gap-3">
          {CHAPTERS.map((chap, i) => (
            <button
              key={chap.id}
              onClick={() => goToStep(i)}
              className="group flex items-center gap-2 p-1 cursor-pointer"
              aria-label={`Jump to step ${chap.index}`}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeStep
                    ? 'w-8 bg-[#E8C9A0] shadow-[0_0_8px_rgba(232,201,160,0.6)]'
                    : 'w-2 bg-[#C8956C]/30 group-hover:bg-[#C8956C]/60'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Next Arrow */}
        <button
          onClick={() => goToStep(Math.min(2, activeStep + 1))}
          disabled={activeStep === 2}
          aria-label="Next step"
          className={`p-2.5 rounded-full border border-[#C8956C]/30 text-[#E8C9A0] transition-all duration-300 flex items-center justify-center ${
            activeStep === 2
              ? 'opacity-20 cursor-not-allowed'
              : 'hover:bg-[#C8956C]/20 hover:border-[#E8C9A0] cursor-pointer'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </footer>

      {/* EDITORIAL MONOGRAPH ARCHIVE MODAL */}
      {selectedMonograph && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMonograph(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1C110B] border border-[#C8956C]/30 text-[#FDF8F3] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-stretch"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMonograph(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FDF8F3] transition-colors z-20 cursor-pointer"
              aria-label="Close monograph"
            >
              <X size={20} />
            </button>

            {/* Left: High-Res Archive Photography */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-4">
                <img
                  src={selectedMonograph.image}
                  alt={selectedMonograph.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute top-4 left-4 bg-[#F5EDE4] text-brown-900 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
                  {selectedMonograph.badge}
                </div>
              </div>

              {/* Technical Specs */}
              <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                {selectedMonograph.specs.map((spec, sIdx) => (
                  <div key={sIdx}>
                    <span className="text-[10px] text-accent block uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="text-cream/90 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Rich Narrative & Monograph Text */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-accent mb-2">
                  <Sparkles size={14} />
                  <span>CHAPTER {selectedMonograph.index} OF 03</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4 leading-tight">
                  {selectedMonograph.title}
                </h3>

                <blockquote className="font-display italic text-lg sm:text-xl text-[#E8C9A0] font-medium leading-snug mb-6 border-l-2 border-accent pl-4">
                  &ldquo;{selectedMonograph.quote}&rdquo;
                </blockquote>

                <div className="space-y-4 font-body text-[#D7CCC8] leading-relaxed text-sm sm:text-base">
                  <p>
                    <span className="float-left font-display text-4xl leading-none font-bold text-cream pr-2 pt-0.5">
                      {selectedMonograph.dropCap}
                    </span>
                    {selectedMonograph.story}
                  </p>
                  <p>{selectedMonograph.storyCont}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <a
                  href="#menu"
                  onClick={() => setSelectedMonograph(null)}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-[#E8C9A0] transition-colors"
                >
                  <span>ORDER TASTING FLIGHT</span>
                  <ArrowUpRight size={14} />
                </a>

                <span className="font-mono text-xs text-white/40">CREMA ARCHIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
