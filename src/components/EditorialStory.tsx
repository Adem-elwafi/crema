import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useLenis } from '../context/LenisContext';
import { Compass, Clock, VolumeX, ArrowUpRight, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import qualityCoffeeImg from '../assets/images/features/quality-coffee.jpg';
import freshDeliciousImg from '../assets/images/features/fresh-delicious.jpg';
import cozyAtmosphereImg from '../assets/images/features/cozy-atmosphere.jpg';

interface Chapter {
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

const CHAPTERS: Chapter[] = [
  {
    id: 'sourcing',
    index: '01',
    badge: 'THE HEIRLOOM HARVEST',
    title: 'The Monastic Sourcing',
    previewText: [
      'Small runs. No conveyor belts, just slow simmering,',
      'constant olfactory checks, and generational growers harvesting at dawn.',
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
      'Every bean captured at peak crack, overseen in patient, unhurried cadence.',
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
      'Real fruit. Organic stone. Natural oak baffles. No synthetic shortcuts.',
      'Hand-crafted ceramic vessels designed to retain deliberate thermal mass.',
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

// Helper to pre-compute SVG curved ruler ticks and dots
// Curve equation: Y(t) = 210 - 320 * t * (1 - t) inside 1600x280 coordinate space
interface TickMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isMajor: boolean;
  isMedium: boolean;
  dotX?: number;
  dotY?: number;
}

function generateRulerTicks(count = 88, width = 1600): TickMark[] {
  const ticks: TickMark[] = [];

  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const x = t * width;
    // Parabolic quadratic curve y(t)
    const y = 210 - 320 * t * (1 - t);

    // Derivative dy/dt for normal angle
    const dy = -320 * (1 - 2 * t);
    const dx = width;
    const angle = Math.atan2(dy, dx);

    // Normal unit vector (perpendicular to curve)
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);

    const isMajor = i % 10 === 0;
    const isMedium = i % 5 === 0 && !isMajor;
    const len = isMajor ? 20 : isMedium ? 13 : 7;
    const half = len / 2;

    const tick: TickMark = {
      x1: x - nx * half,
      y1: y - ny * half,
      x2: x + nx * half,
      y2: y + ny * half,
      isMajor,
      isMedium,
    };

    if (!isMajor && !isMedium && i % 2 === 0) {
      tick.dotX = x + nx * 10;
      tick.dotY = y + ny * 10;
    }

    ticks.push(tick);
  }
  return ticks;
}

// Parabolic geometry calculation for numbers riding the fixed arc
function getArcGeometry(chapterIndex: number, currentProgress: number) {
  const delta = chapterIndex - currentProgress;
  // Step offset: adjacent chapters sit at 42% distance from center
  const stepOffset = 0.42;
  const t = 0.5 + delta * stepOffset;
  const xPct = t * 100;

  // Parabolic curve height Y(t) in 280px container:
  // Y(t) = 210 - 320 * t * (1 - t)
  const clampedT = Math.max(0, Math.min(1, t));
  const yPx = 210 - 320 * clampedT * (1 - clampedT);
  const yPct = (yPx / 280) * 100;

  // Tangent angle along curve
  const slope = -0.2 * (1 - 2 * clampedT);
  const rotDeg = Math.atan(slope) * (180 / Math.PI);

  const dist = Math.abs(delta);
  const scale = Math.max(0.68, 1 - dist * 0.32);
  const opacity = Math.max(0, 1 - dist * 0.65);

  return { xPct, yPct, rotDeg, scale, opacity, isCentered: dist < 0.2 };
}

export default function EditorialStory() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const numElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const storyElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useLenis();
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Active step (0, 1, 2)
  const [activeStep, setActiveStep] = useState(0);

  // Monograph Modal state
  const [selectedMonograph, setSelectedMonograph] = useState<Chapter | null>(null);

  // Ruler ticks memo
  const rulerTicks = useMemo(() => generateRulerTicks(88, 1600), []);

  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const activeStepRef = useRef(0);

  // Mobile navigation progress and tweens
  const mobileProgressRef = useRef({ value: 0 });
  const mobileTweenRef = useRef<gsap.core.Tween | null>(null);
  const isMobileRef = useRef(false);

  // Touch gesture tracking for phones
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Track viewport breakpoint (< 768px)
  useEffect(() => {
    const updateIsMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  // Update DOM positions directly for 120 FPS buttery smooth motion
  const updateDOMPositions = useCallback((progress: number) => {
    numElementsRef.current.forEach((el, idx) => {
      if (!el) return;
      const geo = getArcGeometry(idx, progress);
      el.style.left = `${geo.xPct}%`;
      el.style.top = `${geo.yPct}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${geo.rotDeg}deg) scale(${geo.scale})`;
      el.style.opacity = `${geo.opacity}`;
      el.style.zIndex = geo.isCentered ? '30' : '10';
      el.style.pointerEvents = geo.isCentered ? 'auto' : 'none';
      if (geo.isCentered) {
        el.style.filter = 'drop-shadow(0 0 25px rgba(200,149,108,0.3))';
      } else {
        el.style.filter = 'none';
      }
    });
  }, []);

  // Update dial dots continuously with scroll progress
  const updateDots = useCallback((progress: number) => {
    dotsRef.current.forEach((dot, idx) => {
      if (!dot) return;
      const dist = Math.abs(progress - idx);
      const factor = Math.max(0, 1 - dist); // 1 when centered, 0 when >= 1 step away
      const width = 8 + factor * 24; // 8px -> 32px
      const alpha = 0.3 + factor * 0.7; // 0.3 -> 1.0

      dot.style.width = `${width}px`;
      dot.style.backgroundColor = factor > 0.5 ? '#E8C9A0' : `rgba(200, 149, 108, ${alpha})`;
      dot.style.boxShadow = factor > 0.3 ? `0 0 ${factor * 8}px rgba(232, 201, 160, ${factor * 0.6})` : 'none';
    });
  }, []);

  // Smooth mobile slide transition without hijacking page scroll
  const animateToMobileStep = useCallback(
    (targetStep: number) => {
      if (mobileTweenRef.current) {
        mobileTweenRef.current.kill();
      }

      setActiveStep(targetStep);
      activeStepRef.current = targetStep;

      mobileTweenRef.current = gsap.to(mobileProgressRef.current, {
        value: targetStep,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => {
          updateDOMPositions(mobileProgressRef.current.value);
          updateDots(mobileProgressRef.current.value);
        },
      });

      const storyElements = storyElementsRef.current.filter(Boolean) as HTMLDivElement[];
      gsap.killTweensOf(storyElements);
      storyElements.forEach((el, idx) => {
        if (idx === targetStep) {
          el.style.pointerEvents = 'auto';
          gsap.to(el, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
        } else {
          el.style.pointerEvents = 'none';
          const dir = idx < targetStep ? -30 : 30;
          gsap.to(el, { opacity: 0, x: dir, duration: 0.35, ease: 'power2.in' });
        }
      });
    },
    [updateDOMPositions, updateDots]
  );

  const stepFractions = useMemo(() => [0, 0.5, 0.98], []);

  // Jump to specific chapter (Scroll-driven on desktop, slide-driven on mobile)
  const goToStep = useCallback(
    (targetStep: number) => {
      const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, targetStep));

      if (isMobileRef.current) {
        animateToMobileStep(clamped);
        return;
      }

      // Desktop: ScrollTrigger scroll jump
      const targetFraction = stepFractions[clamped];

      if (scrollTriggerRef.current) {
        const st = scrollTriggerRef.current;
        const totalDist = st.end - st.start;
        const targetScroll = st.start + targetFraction * totalDist;

        if (lenis) {
          lenis.scrollTo(targetScroll, {
            duration: 0.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      } else {
        animateToMobileStep(clamped);
      }
    },
    [animateToMobileStep, lenis, stepFractions]
  );

  const handleNext = useCallback(() => {
    if (activeStep < CHAPTERS.length - 1) {
      goToStep(activeStep + 1);
    }
  }, [activeStep, goToStep]);

  const handlePrev = useCallback(() => {
    if (activeStep > 0) {
      goToStep(activeStep - 1);
    }
  }, [activeStep, goToStep]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - endX;
    const diffY = touchStartYRef.current - endY;

    // Trigger swipe if horizontal distance > 40px and dominant over vertical
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // GSAP Responsive Timeline Choreography: Desktop gets fast pinned scrub, Mobile gets ZERO scrolltriggers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    // Initial setup of numeral positions and dots at current chapter
    updateDOMPositions(activeStepRef.current);
    updateDots(activeStepRef.current);

    const storyElements = storyElementsRef.current.filter(Boolean) as HTMLDivElement[];
    if (storyElements.length < 3) return;

    // ─── DESKTOP (md breakpoint: >= 768px): Pinned fast-scroll scrub timeline ────────
    mm.add('(min-width: 768px)', () => {
      const progressObj = { value: activeStepRef.current };

      // Set initial story element states based on current step
      storyElements.forEach((el, idx) => {
        if (idx === activeStepRef.current) {
          gsap.set(el, { opacity: 1, x: 0 });
          el.style.pointerEvents = 'auto';
        } else {
          gsap.set(el, { opacity: 0, x: idx < activeStepRef.current ? -40 : 40 });
          el.style.pointerEvents = 'none';
        }
      });

      const handleUpdate = () => {
        const currentVal = progressObj.value;
        updateDOMPositions(currentVal);
        updateDots(currentVal);

        const currentStep = Math.min(2, Math.max(0, Math.round(currentVal)));
        if (currentStep !== activeStepRef.current) {
          activeStepRef.current = currentStep;
          setActiveStep(currentStep);
        }

        storyElements.forEach((el, idx) => {
          if (el) {
            el.style.pointerEvents = (currentVal >= idx - 0.35 && currentVal <= idx + 0.35) ? 'auto' : 'none';
          }
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=280%', // Deliberate, unhurried desktop scroll duration
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: handleUpdate,
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;

      // Continuous Linear Timeline Choreography
      // progressObj moves strictly linearly from 0 to 2 across the pinned range
      tl.to(
        progressObj,
        {
          value: 2,
          ease: 'none',
          duration: 2.0,
        },
        0
      );

      // Chapter 0 -> Chapter 1 text crossfade (centered at 0.5)
      tl.to(
        storyElements[0],
        { opacity: 0, x: -40, ease: 'none', duration: 0.4 },
        0.3
      );
      tl.fromTo(
        storyElements[1],
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, ease: 'none', duration: 0.4 },
        0.3
      );

      // Chapter 1 -> Chapter 2 text crossfade (centered at 1.5)
      tl.to(
        storyElements[1],
        { opacity: 0, x: -40, ease: 'none', duration: 0.4 },
        1.3
      );
      tl.fromTo(
        storyElements[2],
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, ease: 'none', duration: 0.4 },
        1.3
      );

      return () => {
        scrollTriggerRef.current = null;
      };
    });

    // ─── MOBILE (< 768px): ZERO ScrollTrigger, zero pin, zero scroll jank ──────────
    mm.add('(max-width: 767px)', () => {
      scrollTriggerRef.current = null;
      mobileProgressRef.current.value = activeStepRef.current;
      updateDOMPositions(activeStepRef.current);
      updateDots(activeStepRef.current);

      storyElements.forEach((el, idx) => {
        if (idx === activeStepRef.current) {
          gsap.set(el, { opacity: 1, x: 0 });
          el.style.pointerEvents = 'auto';
        } else {
          gsap.set(el, { opacity: 0, x: idx < activeStepRef.current ? -30 : 30 });
          el.style.pointerEvents = 'none';
        }
      });

      return () => {
        if (mobileTweenRef.current) {
          mobileTweenRef.current.kill();
        }
      };
    });

    return () => {
      scrollTriggerRef.current = null;
      mm.revert();
    };
  }, [updateDOMPositions, updateDots]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMonograph) {
        if (e.key === 'Escape') setSelectedMonograph(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedMonograph]);

  return (
    <section
      ref={containerRef}
      id="why-us"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-dvh md:h-screen md:h-dvh bg-[#0E0805] text-[#FDF8F3] select-none overflow-hidden flex flex-col justify-between pt-14 sm:pt-16 md:pt-20 pb-6 sm:pb-8"
    >
      {/* Anchor shim for legacy navigation links */}
      <span id="about" className="absolute top-0 pointer-events-none" />

      {/* Atmospheric ambient warm gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,rgba(200,149,108,0.08)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. TOP SECTION HEADER (ALWAYS VISIBLE & REFINED)
          ───────────────────────────────────────────────────────────── */}
      <header className="relative z-30 text-center px-6 max-w-4xl 2xl:max-w-6xl mx-auto pt-2">
        <span className="font-mono text-[10px] sm:text-xs 2xl:text-sm text-[#C8956C] uppercase tracking-[0.28em] opacity-90 block mb-1.5">
          ANALOG CADENCE · MONASTIC PURITY
        </span>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl 2xl:text-6xl font-light text-[#F5EDE4] tracking-[0.14em] uppercase leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
          Our Journey of Distillation
        </h2>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. FIXED ARC STAGE (NUMBERS RIDE PARABOLIC CURVE AT ALL TIMES)
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative z-20 w-full max-w-[1600px] 2xl:max-w-[1920px] h-[240px] sm:h-[280px] lg:h-[300px] 2xl:h-[360px] mx-auto my-auto flex items-center justify-center overflow-visible"
      >
        {/* SVG FIXED PRECISION RULER GAUGE ARC */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible opacity-60"
            viewBox="0 0 1600 280"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="fixedRulerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C8956C" stopOpacity="0.05" />
                <stop offset="25%" stopColor="#C8956C" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#F5EDE4" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#C8956C" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#C8956C" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Continuous arched datum line: Y(t) = 210 - 320 * t * (1 - t) */}
            <path
              d="M 0 210 Q 800 50 1600 210"
              stroke="url(#fixedRulerGrad)"
              strokeWidth="1.2"
              strokeDasharray="3 6"
              strokeLinecap="round"
            />

            {/* Precision Ruler Tick Marks (Bisecting all numbers) */}
            {rulerTicks.map((tick, idx) => (
              <g key={idx}>
                <line
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke="url(#fixedRulerGrad)"
                  strokeWidth={tick.isMajor ? '2' : tick.isMedium ? '1.2' : '0.8'}
                  strokeLinecap="round"
                  opacity={tick.isMajor ? 0.9 : tick.isMedium ? 0.6 : 0.35}
                />
                {tick.dotX !== undefined && (
                  <circle
                    cx={tick.dotX}
                    cy={tick.dotY}
                    r="1.2"
                    fill="#C8956C"
                    opacity="0.4"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* NUMERALS CONTAINER: Scaled boldly for 15.6"+ screens (2xl breakpoint) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-visible">
          {CHAPTERS.map((chap, idx) => (
            <div
              key={chap.id}
              ref={(el) => {
                numElementsRef.current[idx] = el;
              }}
              onClick={() => goToStep(idx)}
              className="absolute flex flex-col items-center justify-center select-none will-change-transform cursor-pointer"
            >
              <span
                className="arc-number-stroke font-sans font-light text-[6.5rem] sm:text-[8.5rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[17rem] min-[1800px]:text-[19.5rem] tracking-tight leading-none text-[rgba(245,237,228,0.08)]"
              >
                {chap.index}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CENTERED READING POCKET (STORY TEXT CROSSFADES IN PLACE)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-30 w-full max-w-xl 2xl:max-w-2xl mx-auto px-6 text-center min-h-[140px] 2xl:min-h-[170px] flex items-center justify-center mb-3 sm:mb-4">
        {CHAPTERS.map((chap, idx) => (
          <div
            key={chap.id}
            ref={(el) => {
              storyElementsRef.current[idx] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none will-change-transform"
          >
            {/* Cream Pill Badge */}
            <div className="mb-2 sm:mb-2.5 2xl:mb-3">
              <span className="inline-block bg-[#F5EDE4] text-[#1E110A] px-3.5 sm:px-4 py-1 2xl:px-5 2xl:py-1.5 rounded-full font-mono text-[10px] sm:text-xs 2xl:text-sm font-bold tracking-[0.24em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.7)] border border-[#FAF3EB]/50">
                {chap.badge}
              </span>
            </div>

            {/* Story Narrative Paragraph */}
            <p className="font-body text-xs sm:text-sm md:text-base 2xl:text-lg font-normal text-[#E6DFD5] leading-[1.6] sm:leading-[1.65] 2xl:leading-[1.7] max-w-md 2xl:max-w-xl mx-auto">
              {chap.previewText.join(' ')}
            </p>

            {/* Monograph Button */}
            <div className="mt-2 sm:mt-2.5 2xl:mt-3">
              <button
                onClick={() => setSelectedMonograph(chap)}
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs 2xl:text-sm uppercase tracking-[0.22em] text-[#E8C9A0] hover:text-[#FDF8F3] transition-colors border-b border-[#C8956C]/50 hover:border-[#FDF8F3] pb-0.5 cursor-pointer touch-manipulation"
              >
                <span>READ ARCHIVE MONOGRAPH</span>
                <ArrowUpRight
                  size={13}
                  className="2xl:w-4 2xl:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. ALWAYS-ACCESSIBLE BOTTOM ARROW CONTROLS & DIAL INDICATORS
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-30 flex items-center justify-between px-6 max-w-md 2xl:max-w-lg mx-auto w-full pt-1 sm:pt-2">
        {/* Prev Chapter Arrow */}
        <button
          onClick={handlePrev}
          disabled={activeStep === 0}
          aria-label="Previous chapter"
          className={`p-3 sm:p-2.5 2xl:p-3.5 rounded-full border border-[#C8956C]/40 text-[#E8C9A0] transition-all duration-300 flex items-center justify-center min-w-[48px] min-h-[48px] touch-manipulation ${
            activeStep === 0
              ? 'opacity-20 cursor-not-allowed'
              : 'bg-black/40 hover:bg-[#C8956C]/20 hover:border-[#E8C9A0] active:scale-95 cursor-pointer shadow-lg'
          }`}
        >
          <ChevronLeft size={22} className="2xl:w-6 2xl:h-6" />
        </button>

        {/* Vintage Dial Indicator Dots */}
        <div className="flex items-center gap-3 sm:gap-3.5 2xl:gap-4 py-2">
          {CHAPTERS.map((chap, i) => (
            <button
              key={chap.id}
              onClick={() => goToStep(i)}
              className="group flex items-center gap-2 p-2 touch-manipulation cursor-pointer"
              aria-label={`Jump to chapter ${chap.index}`}
            >
              <span
                ref={(el) => {
                  dotsRef.current[i] = el;
                }}
                className="h-2 sm:h-1.5 2xl:h-2 rounded-full will-change-transform"
                style={{
                  width: i === 0 ? '32px' : '8px',
                  backgroundColor: i === 0 ? '#E8C9A0' : 'rgba(200, 149, 108, 0.3)',
                  boxShadow: i === 0 ? '0 0 8px rgba(232, 201, 160, 0.6)' : 'none',
                }}
              />
            </button>
          ))}
        </div>

        {/* Next Chapter Arrow */}
        <button
          onClick={handleNext}
          disabled={activeStep === CHAPTERS.length - 1}
          aria-label="Next chapter"
          className={`p-3 sm:p-2.5 2xl:p-3.5 rounded-full border border-[#C8956C]/40 text-[#E8C9A0] transition-all duration-300 flex items-center justify-center min-w-[48px] min-h-[48px] touch-manipulation ${
            activeStep === CHAPTERS.length - 1
              ? 'opacity-20 cursor-not-allowed'
              : 'bg-black/40 hover:bg-[#C8956C]/20 hover:border-[#E8C9A0] active:scale-95 cursor-pointer shadow-lg'
          }`}
        >
          <ChevronRight size={22} className="2xl:w-6 2xl:h-6" />
        </button>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          5. EDITORIAL MONOGRAPH ARCHIVE MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedMonograph && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMonograph(null)}
        >
          <div
            className="relative w-full max-w-4xl 2xl:max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1C110B] border border-[#C8956C]/30 text-[#FDF8F3] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 2xl:p-12 flex flex-col md:flex-row gap-8 2xl:gap-10 items-stretch"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMonograph(null)}
              className="absolute top-5 right-5 p-2 2xl:p-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FDF8F3] transition-colors z-20 cursor-pointer touch-manipulation"
              aria-label="Close monograph"
            >
              <X size={20} className="2xl:w-6 2xl:h-6" />
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
                <div className="absolute top-4 left-4 bg-[#F5EDE4] text-brown-900 px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full text-[10px] 2xl:text-xs font-mono font-bold tracking-widest uppercase">
                  {selectedMonograph.badge}
                </div>
              </div>

              {/* Technical Specs & Measurements */}
              <div className="grid grid-cols-2 gap-2.5 2xl:gap-3.5 p-3.5 2xl:p-5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs 2xl:text-sm">
                {selectedMonograph.specs.map((spec, sIdx) => (
                  <div key={sIdx}>
                    <span className="text-[10px] 2xl:text-xs text-accent block uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="text-cream/90 font-medium 2xl:text-base">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Rich Narrative & Monograph Text */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs 2xl:text-sm font-mono uppercase tracking-[0.25em] text-accent mb-2">
                  <Sparkles size={14} className="2xl:w-4 2xl:h-4" />
                  <span>CHAPTER {selectedMonograph.index} OF 03</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl 2xl:text-5xl font-bold text-cream mb-4 leading-tight">
                  {selectedMonograph.title}
                </h3>

                <blockquote className="font-display italic text-lg sm:text-xl 2xl:text-2xl text-[#E8C9A0] font-medium leading-snug mb-6 border-l-2 border-accent pl-4">
                  &ldquo;{selectedMonograph.quote}&rdquo;
                </blockquote>

                <div className="space-y-4 font-body text-[#D7CCC8] leading-relaxed text-sm sm:text-base 2xl:text-lg">
                  <p>
                    <span className="float-left font-display text-4xl 2xl:text-5xl leading-none font-bold text-cream pr-2.5 pt-0.5">
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
                  className="inline-flex items-center gap-2 font-mono text-xs 2xl:text-sm uppercase tracking-[0.2em] font-semibold text-accent hover:text-[#E8C9A0] transition-colors"
                >
                  <span>ORDER TASTING FLIGHT</span>
                  <ArrowUpRight size={14} className="2xl:w-4 2xl:h-4" />
                </a>

                <span className="font-mono text-xs 2xl:text-sm text-white/40">CREMA ARCHIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
