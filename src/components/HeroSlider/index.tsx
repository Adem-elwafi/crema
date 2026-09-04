import { slides } from '../../data/slides';
import { useSliderEngine } from './useSliderEngine';
import CenterPiece from './CenterPiece';
import SlideContent from './SlideContent';
import SlideControls from './SlideControls';
import { useRef, useEffect } from 'react';

export default function HeroSlider({ isPaused = false }: { isPaused?: boolean }) {
  // Eagerly pre-decode all slide cups and ingredients into GPU VRAM
  // so transitions never suffer from synchronous raster thread decode freezes
  useEffect(() => {
    if (isPaused) return;

    const imageUrls = new Set<string>();
    slides.forEach((s) => {
      if (s.image) imageUrls.add(s.image);
      s.ingredients?.forEach((ing) => {
        if (ing.image) imageUrls.add(ing.image);
      });
    });

    imageUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, [isPaused]);

  const {
    currentIndex,
    direction,
    isAnimating,
    unlock,
    onNext,
    onPrev,
    onSelect,
    touchHandlers,
  } = useSliderEngine(slides.length, isPaused);

  const currentSlide = slides[currentIndex];

  // Track which slide each animated region has settled on, so the engine only
  // unlocks once BOTH the cup and the text have finished the same transition.
  // The slide-id comparison is self-resetting across consecutive transitions,
  // so stale completions can never unlock the wrong one.
  const cupDoneFor = useRef(currentSlide.id);
  const textDoneFor = useRef(currentSlide.id);

  const handleAnimationComplete = (region: 'cup' | 'text') => (id: number) => {
    if (region === 'cup') cupDoneFor.current = id;
    else textDoneFor.current = id;

    if (cupDoneFor.current === currentSlide.id && textDoneFor.current === currentSlide.id) {
      unlock();
    }
  };

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-cream touch-pan-y"
      {...touchHandlers}
    >
      {/* Incline Diagonal Split — 2 columns vertical split on desktop (>954px), 2 rows inclined middle split on <=954px */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900 to-brown-700 hero-split-dark" />
        <div className="absolute inset-0 bg-gradient-to-br from-cream-dark to-cream hero-split-cream" />
      </div>

      {/* Content Layout — 2 rows on <=954px (Row 1: Cup, Row 2: Text), 2 columns on >954px */}
      <div className="relative z-10 w-full min-h-screen flex flex-col min-[955px]:grid min-[955px]:grid-cols-2">
        {/* Text Column / Row 2 on <=954px: Order 2 on mobile, Order 1 on desktop */}
        <div className="relative z-20 flex flex-col justify-center px-6 sm:px-12 min-[955px]:pl-16 lg:pl-24 min-[955px]:pr-8 max-[954px]:order-2 max-[954px]:pt-6 max-[954px]:pb-16 min-[955px]:order-1 min-[955px]:py-0">
          <SlideContent
            slide={currentSlide}
            slideIndex={currentIndex}
            totalSlides={slides.length}
            direction={direction}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete('text')}
          />
          <SlideControls
            currentIndex={currentIndex}
            totalSlides={slides.length}
            isAnimating={isAnimating}
            onPrev={onPrev}
            onNext={onNext}
            onSelect={onSelect}
          />
        </div>

        {/* Product Visual / Row 1 on <=954px: Order 1 on mobile, Order 2 on desktop */}
        <div className="relative z-10 flex items-center justify-center max-[954px]:order-1 max-[954px]:h-[42vh] max-[954px]:pt-16 min-[955px]:order-2 min-[955px]:min-h-screen">
          <CenterPiece
            slide={currentSlide}
            direction={direction}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete('cup')}
          />
        </div>
      </div>
    </section>
  );
}
