import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideControlsProps {
  currentIndex: number;
  totalSlides: number;
  isAnimating: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function SlideControls({ currentIndex, totalSlides, isAnimating, onPrev, onNext }: SlideControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 z-30 flex items-center space-x-8">
      <div className="flex items-center space-x-3">
        <button
          onClick={onPrev}
          disabled={isAnimating}
          className="w-12 h-12 rounded-full border border-[#A0714D] flex items-center justify-center text-[#A0714D] hover:bg-[#A0714D] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          disabled={isAnimating}
          className="w-12 h-12 rounded-full border border-[#A0714D] flex items-center justify-center text-[#A0714D] hover:bg-[#A0714D] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-[#A0714D]' : 'w-2 bg-[#D7CCC8]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
