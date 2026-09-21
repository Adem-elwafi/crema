import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useLenis } from '../context/LenisContext';
import { Compass, Clock, VolumeX, ArrowUpRight, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import qualityCoffeeImg from '../assets/images/features/quality-coffee.jpg';
import freshDeliciousImg from '../assets/images/features/fresh-delicious.jpg';
import cozyAtmosphereImg from '../assets/images/features/cozy-atmosphere.jpg';
import singleCoffeeBean from '../assets/images/hero/single-coffee-bean.webp';

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
  const beanRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Active step (0, 1, 2)
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);
  const progressAnimRef = useRef<{ value: number }>({ value: 0 });
  const isTransitioningRef = useRef(false);
  const isPinnedRef = useRef(false);
  const isGestureActiveRef = useRef(false);
  const gestureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Monograph Modal state
  const [selectedMonograph, setSelectedMonograph] = useState<Chapter | null>(null);

  // Ruler ticks memo
  const rulerTicks = useMemo(() => generateRulerTicks(88, 1600), []);

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

    // Animate bean mascot with momentum
    if (beanRef.current) {
      const deltaCenter = progress - Math.round(progress);
      beanRef.current.style.transform = `translateY(${Math.sin(progress * Math.PI) * -12}px) rotate(${
        deltaCenter * 45
      }deg)`;
    }
  }, []);

  // Discrete 1-Touch Step Transition with Directional Narrative Slide
  const goToStep = useCallback(
    (targetStep: number, syncScroll = true) => {
      const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, targetStep));
      const prevStep = activeStepRef.current;
      if (clamped === prevStep && !isTransitioningRef.current) return;
      if (isTransitioningRef.current) return;

      isTransitioningRef.current = true;
      const isMovingRight = clamped > prevStep;
      activeStepRef.current = clamped;
      setActiveStep(clamped);

      // Directional narrative text transition:
      // "if im scrolling right discription fades right , if left fade left"
      storyElementsRef.current.forEach((el, idx) => {
        if (!el) return;
        if (idx === clamped) {
          // Incoming text glides in from opposite side to 0
          gsap.killTweensOf(el);
          gsap.fromTo(
            el,
            { opacity: 0, x: isMovingRight ? -45 : 45, pointerEvents: 'auto' },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 }
          );
        } else if (idx === prevStep) {
          // Outgoing text glides in scroll direction and fades out
          gsap.killTweensOf(el);
          gsap.to(el, {
            opacity: 0,
            x: isMovingRight ? 45 : -45,
            duration: 0.32,
            ease: 'power2.in',
            pointerEvents: 'none',
          });
        } else {
          gsap.killTweensOf(el);
          gsap.set(el, { opacity: 0, x: isMovingRight ? 45 : -45, pointerEvents: 'none' });
        }
      });

      // Animate progress smoothly along the parabolic arc (snappy 0.4s)
      gsap.to(progressAnimRef.current, {
        value: clamped,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          updateDOMPositions(progressAnimRef.current.value);
        },
        onComplete: () => {
          updateDOMPositions(clamped);
          isTransitioningRef.current = false;
        },
      });

      // Synchronize page scroll position instantly so 03 immediately exits down, and 01 immediately exits up!
      if (syncScroll && scrollTriggerRef.current) {
        const st = scrollTriggerRef.current;
        const totalDist = st.end - st.start;
        const fraction = clamped / (CHAPTERS.length - 1);
        const safeOffset = clamped === CHAPTERS.length - 1 ? totalDist - 2 : fraction * totalDist;
        const targetScroll = st.start + safeOffset;

        if (lenis) {
          lenis.scrollTo(targetScroll, {
            immediate: true,
            lock: false,
          });
        } else {
          window.scrollTo({ top: targetScroll });
        }
      }
    },
    [updateDOMPositions, lenis]
  );

  // Initialize positions on mount
  useEffect(() => {
    updateDOMPositions(0);
    // Initialize narrative cards: 0 is visible, others hidden to the right
    storyElementsRef.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === 0) {
        gsap.set(el, { opacity: 1, x: 0, pointerEvents: 'auto' });
      } else {
        gsap.set(el, { opacity: 0, x: 45, pointerEvents: 'none' });
      }
    });
  }, [updateDOMPositions]);

  // ScrollTrigger Pinning & 1-Touch Scroll Interceptor with Gesture Idle Lock
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pin section with ScrollTrigger with compact 600px runway
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=600',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onEnter: () => {
        isPinnedRef.current = true;
      },
      onLeave: () => {
        isPinnedRef.current = false;
      },
      onEnterBack: () => {
        isPinnedRef.current = true;
        // When scrolling back up into section from below, activate Chapter 03 immediately
        goToStep(CHAPTERS.length - 1, false);
      },
      onLeaveBack: () => {
        isPinnedRef.current = false;
      },
    });
    scrollTriggerRef.current = st;

    // Gesture-Lock Wheel Interceptor:
    // Guarantees ONE physical wheel flick advances EXACTLY 1 CHAPTER, never skipping!
    const handleWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) return;

      // 1. If no gesture is currently active, process the new intentional scroll:
      if (!isGestureActiveRef.current) {
        if (e.deltaY > 15) {
          // Scrolling down (towards next chapter)
          if (activeStepRef.current < CHAPTERS.length - 1) {
            e.preventDefault();
            e.stopPropagation();
            isGestureActiveRef.current = true;
            goToStep(activeStepRef.current + 1);
          } else {
            // Already at Chapter 03 -> allow natural scroll down into VisitUs!
            return;
          }
        } else if (e.deltaY < -15) {
          // Scrolling up (towards prev chapter)
          if (activeStepRef.current > 0) {
            e.preventDefault();
            e.stopPropagation();
            isGestureActiveRef.current = true;
            goToStep(activeStepRef.current - 1);
          } else {
            // Already at Chapter 01 -> allow natural scroll up into TactileMenu!
            return;
          }
        }
      } else {
        // 2. Gesture is still active (wheel inertia / momentum ticks from the fast flick):
        // Consume all events so the ongoing fast spin CANNOT skip multiple numbers!
        if (
          (activeStepRef.current < CHAPTERS.length - 1 && e.deltaY > 0) ||
          (activeStepRef.current > 0 && e.deltaY < 0)
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      }

      // 3. Reset gesture active flag ONLY after wheel completely stops spinning (180ms of silence)
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
      gestureTimeoutRef.current = setTimeout(() => {
        isGestureActiveRef.current = false;
      }, 180);
    };

    // Touch gesture interceptor for tactile phones
    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchActive = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTouchActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPinnedRef.current) return;

      if (isTouchActive) {
        if (
          (activeStepRef.current < CHAPTERS.length - 1 && touchStartY - e.touches[0].clientY > 0) ||
          (activeStepRef.current > 0 && touchStartY - e.touches[0].clientY < 0)
        ) {
          if (e.cancelable) e.preventDefault();
        }
        return;
      }

      const deltaY = touchStartY - e.touches[0].clientY;
      const deltaX = touchStartX - e.touches[0].clientX;

      // Vertical or Horizontal Swipe
      if (deltaY > 35 || deltaX > 35) {
        if (activeStepRef.current < CHAPTERS.length - 1) {
          if (e.cancelable) e.preventDefault();
          isTouchActive = true;
          goToStep(activeStepRef.current + 1);
        }
      } else if (deltaY < -35 || deltaX < -35) {
        if (activeStepRef.current > 0) {
          if (e.cancelable) e.preventDefault();
          isTouchActive = true;
          goToStep(activeStepRef.current - 1);
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchActive = false;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
      scrollTriggerRef.current = null;
      st.kill();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToStep(activeStepRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToStep(activeStepRef.current - 1);
      } else if (e.key === 'Escape' && selectedMonograph) {
        setSelectedMonograph(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToStep, selectedMonograph]);

  return (
    <section
      ref={containerRef}
      id="why-us"
      className="relative w-full h-screen bg-[#0E0805] text-[#FDF8F3] select-none overflow-hidden flex flex-col justify-between pt-16 md:pt-20 pb-8"
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
      <header className="relative z-30 text-center px-6 max-w-4xl mx-auto pt-2">
        <span className="font-mono text-[10px] sm:text-xs text-[#C8956C] uppercase tracking-[0.28em] opacity-90 block mb-1.5">
          ANALOG CADENCE · MONASTIC PURITY
        </span>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-light text-[#F5EDE4] tracking-[0.14em] uppercase leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
          Our Journey of Distillation
        </h2>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. FIXED ARC STAGE (NUMBERS RIDE PARABOLIC CURVE AT ALL TIMES)
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative z-20 w-full max-w-[1600px] h-[280px] mx-auto my-auto flex items-center justify-center overflow-visible"
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

        {/* NUMERALS CONTAINER: Each numeral is pinned to the arc via Parabolic Math */}
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
                className="font-sans font-light text-[7.5rem] sm:text-[9rem] md:text-[10.5rem] tracking-tight leading-none"
                style={{
                  WebkitTextStroke: '1.5px rgba(245, 237, 228, 0.75)',
                  color: 'rgba(245, 237, 228, 0.08)',
                }}
              >
                {chap.index}
              </span>
            </div>
          ))}

          {/* ROASTED COFFEE BEAN MASCOT: Anchored beside active center numeral */}
          <div
            ref={beanRef}
            className="absolute left-[calc(50%+85px)] top-[calc(46.43%-10px)] -translate-y-1/2 z-20 pointer-events-none will-change-transform"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 animate-float-bean">
              <img
                src={singleCoffeeBean}
                alt="Roasted Bean Marker"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_18px_rgba(0,0,0,0.95)] drop-shadow-[0_0_15px_rgba(200,149,108,0.35)]"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CENTERED READING POCKET (STORY TEXT CROSSFADES IN PLACE)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-30 w-full max-w-xl mx-auto px-6 text-center min-h-[140px] flex items-center justify-center mb-4">
        {CHAPTERS.map((chap, idx) => (
          <div
            key={chap.id}
            ref={(el) => {
              storyElementsRef.current[idx] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none will-change-transform"
          >
            {/* Cream Pill Badge */}
            <div className="mb-2.5">
              <span className="inline-block bg-[#F5EDE4] text-[#1E110A] px-4 py-1 rounded-full font-mono text-[10px] sm:text-xs font-bold tracking-[0.24em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.7)] border border-[#FAF3EB]/50">
                {chap.badge}
              </span>
            </div>

            {/* Story Narrative Paragraph */}
            <p className="font-body text-xs sm:text-sm md:text-base font-normal text-[#E6DFD5] leading-[1.65] max-w-md mx-auto">
              {chap.previewText.join(' ')}
            </p>

            {/* Monograph Button */}
            <div className="mt-2.5">
              <button
                onClick={() => setSelectedMonograph(chap)}
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#E8C9A0] hover:text-[#FDF8F3] transition-colors border-b border-[#C8956C]/50 hover:border-[#FDF8F3] pb-0.5 cursor-pointer"
              >
                <span>READ ARCHIVE MONOGRAPH</span>
                <ArrowUpRight
                  size={13}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. ALWAYS-ACCESSIBLE BOTTOM ARROW CONTROLS & DIAL INDICATORS
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-30 flex items-center justify-between px-6 max-w-md mx-auto w-full pt-2">
        {/* Prev Chapter Arrow */}
        <button
          onClick={() => goToStep(activeStep - 1)}
          disabled={activeStep === 0}
          aria-label="Previous chapter"
          className={`p-2.5 rounded-full border border-[#C8956C]/30 text-[#E8C9A0] transition-all duration-300 flex items-center justify-center ${
            activeStep === 0
              ? 'opacity-20 cursor-not-allowed'
              : 'bg-black/30 hover:bg-[#C8956C]/20 hover:border-[#E8C9A0] cursor-pointer active:scale-95'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Vintage Dial Indicator Dots */}
        <div className="flex items-center gap-3">
          {CHAPTERS.map((chap, i) => (
            <button
              key={chap.id}
              onClick={() => goToStep(i)}
              className="group flex items-center gap-2 p-1 cursor-pointer"
              aria-label={`Jump to chapter ${chap.index}`}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-400 ${
                  i === activeStep
                    ? 'w-8 bg-[#E8C9A0] shadow-[0_0_8px_rgba(232,201,160,0.6)]'
                    : 'w-2 bg-[#C8956C]/30 group-hover:bg-[#C8956C]/60'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Next Chapter Arrow */}
        <button
          onClick={() => goToStep(activeStep + 1)}
          disabled={activeStep === CHAPTERS.length - 1}
          aria-label="Next chapter"
          className={`p-2.5 rounded-full border border-[#C8956C]/30 text-[#E8C9A0] transition-all duration-300 flex items-center justify-center ${
            activeStep === CHAPTERS.length - 1
              ? 'opacity-20 cursor-not-allowed'
              : 'bg-black/30 hover:bg-[#C8956C]/20 hover:border-[#E8C9A0] cursor-pointer active:scale-95'
          }`}
        >
          <ChevronRight size={20} />
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
