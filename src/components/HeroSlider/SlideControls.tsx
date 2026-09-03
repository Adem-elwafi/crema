import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideControlsProps {
  currentIndex: number;
  totalSlides: number;
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (index: number) => void;
}

export default function SlideControls({ currentIndex, totalSlides, isAnimating, onPrev, onNext, onSelect }: SlideControlsProps) {
  return (
    <motion.div
      className="relative z-30 mt-8 flex items-center space-x-8"
      initial={false}
      // Fade controls out during transit, back in once settled.
      animate={isAnimating ? 'hidden' : 'visible'}
      variants={{
        visible: {
          opacity: 1,
          scale: 1,
          pointerEvents: 'auto',
          transition: { type: 'spring', damping: 22, stiffness: 280, delay: 0.05 },
        },
        hidden: {
          opacity: 0,
          scale: 0,
          pointerEvents: 'none',
          transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
        },
      }}
    >
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onPrev}
          disabled={isAnimating}
          aria-label="Previous slide"
          className="w-12 h-12 shrink-0 rounded-full border border-[#A0714D] flex items-center justify-center text-[#A0714D] hover:bg-[#A0714D] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          disabled={isAnimating}
          aria-label="Next slide"
          className="w-12 h-12 shrink-0 rounded-full border border-[#A0714D] flex items-center justify-center text-[#A0714D] hover:bg-[#A0714D] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Fixed-width pagination track prevents any horizontal wiggle */}
      <div className="flex items-center space-x-2 shrink-0 w-24">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect?.(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              i === currentIndex ? 'w-8 bg-[#A0714D]' : 'w-2 bg-[#D7CCC8] hover:bg-[#C8956C]'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
