import { Menu } from 'lucide-react';
import { slides } from '../../data/slides';
import { useSliderEngine } from './useSliderEngine';
import CenterPiece from './CenterPiece';
import SlideContent from './SlideContent';
import SlideControls from './SlideControls';
import QuickSelectDrawer from './QuickSelectDrawer';
import { useRef, useState } from 'react';

export default function HeroSlider({ isPaused = false }: { isPaused?: boolean }) {
  const [isDrawerOpen, setIsDrawerOpenLocal] = useState(false);

  const {
    currentIndex,
    direction,
    isAnimating,
    setIsAnimating,
    onNext,
    onPrev,
    onSelect,
    setHovered,
    setDrawerOpen
  } = useSliderEngine(slides.length, isPaused);

  const currentSlide = slides[currentIndex];

  // Track which slide each animated region has settled on, so the engine only
  // unlocks once BOTH the cup and the text have finished the same transition.
  const cupDoneFor = useRef(currentSlide.id);
  const textDoneFor = useRef(currentSlide.id);

  const handleAnimationComplete = (region: 'cup' | 'text') => (id: number) => {
    if (region === 'cup') cupDoneFor.current = id;
    else textDoneFor.current = id;

    if (cupDoneFor.current === currentSlide.id && textDoneFor.current === currentSlide.id) {
      setIsAnimating(false);
    }
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpenLocal(true);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpenLocal(false);
    setDrawerOpen(false);
  };

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-cream"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Diagonal Split Background */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-brown-900 to-brown-700"
        style={{ clipPath: 'polygon(0 0, 55% 0, 40% 100%, 0 100%)' }}
      />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-cream-dark to-cream"
        style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 40% 100%)' }}
      />

      {/* Menu Icon */}
      <button
        onClick={handleDrawerOpen}
        className="absolute top-24 right-8 z-30 p-3 rounded-full bg-cream shadow-md hover:shadow-lg text-brown-900 transition-all hover:scale-105"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Center Product Visual + anchored floating ingredients */}
      <CenterPiece
        slide={currentSlide}
        direction={direction}
        isAnimating={isAnimating}
        onAnimationComplete={handleAnimationComplete('cup')}
      />

      {/* Text Content */}
      <SlideContent
        slide={currentSlide}
        slideIndex={currentIndex}
        totalSlides={slides.length}
        direction={direction}
        onAnimationComplete={handleAnimationComplete('text')}
      />

      {/* Navigation Controls */}
      <SlideControls
        currentIndex={currentIndex}
        totalSlides={slides.length}
        isAnimating={isAnimating}
        onPrev={onPrev}
        onNext={onNext}
      />

      {/* Quick Select Drawer */}
      <QuickSelectDrawer
        isOpen={isDrawerOpen}
        slides={slides}
        currentIndex={currentIndex}
        onSelect={onSelect}
        onClose={handleDrawerClose}
      />
    </section>
  );
}
