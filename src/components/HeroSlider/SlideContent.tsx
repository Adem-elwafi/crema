import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { SlideData } from '../../data/slides';

interface SlideContentProps {
  slide: SlideData;
  slideIndex: number;
  totalSlides: number;
  direction: number;
  onAnimationComplete?: (id: number) => void;
}

const EASE = [0.65, 0, 0.35, 1] as const;

const innerVariants = (direction: number): Variants => ({
  enter: {
    y: direction * 35,
    opacity: 0
  },
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: EASE }
  },
  exit: {
    y: direction * -30,
    opacity: 0,
    transition: { duration: 0.45, ease: EASE }
  }
});

export default function SlideContent({ slide, slideIndex, totalSlides, direction, onAnimationComplete }: SlideContentProps) {
  const titleWords = slide.title.split(' ');

  const handleComplete = () => onAnimationComplete?.(slide.id);

  return (
    <div className="absolute left-8 md:left-24 top-1/2 -translate-y-1/2 z-30 max-w-lg w-full px-4 md:px-0 pointer-events-none">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          className="w-full pointer-events-auto"
          variants={{
            enter: {},
            center: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
            exit: {}
          }}
          initial="enter"
          animate="center"
          exit="exit"
          onAnimationComplete={handleComplete}
        >
          <motion.div custom={direction} variants={innerVariants(direction)} className="flex items-center space-x-4 mb-6" style={{ willChange: 'transform, opacity' }}>
            <div className="text-4xl font-display font-bold text-[#E8C9A0]">
              {String(slideIndex + 1).padStart(2, '0')}
            </div>
            <div className="h-[1px] w-12 bg-[#E8C9A0]/70" />
            <div className="text-xl font-display text-[#C8956C]">
              {String(totalSlides).padStart(2, '0')}
            </div>
          </motion.div>

          <motion.div
            custom={direction}
            variants={innerVariants(direction)}
            className="text-sm font-bold tracking-[0.2em] text-[#C8956C] uppercase mb-4"
            style={{ willChange: 'transform, opacity' }}
          >
            {slide.subtitle}
          </motion.div>

          <motion.h1
            custom={direction}
            variants={innerVariants(direction)}
            className="text-5xl md:text-7xl font-display font-bold text-cream mb-6 leading-tight"
            style={{ willChange: 'transform, opacity', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            {titleWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-3 pb-2">
                <span className="inline-block">{word}</span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            custom={direction}
            variants={innerVariants(direction)}
            className="text-lg text-[#E8D8C8]/90 mb-8 max-w-md font-body leading-relaxed"
            style={{ willChange: 'transform, opacity', textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}
          >
            {slide.description}
          </motion.p>

          <motion.div
            custom={direction}
            variants={innerVariants(direction)}
            className="flex items-center space-x-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="text-4xl font-bold font-display text-[#E8C9A0]">
              {slide.price}
            </span>
            <button className="flex items-center justify-center space-x-2 bg-[#C8956C]/90 backdrop-blur-sm border border-[#E8C9A0]/40 hover:bg-[#E8C9A0] hover:text-brown-900 px-8 py-4 rounded-full transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-[#E8C9A0]/20">
              <span className="font-semibold tracking-[0.18em] uppercase text-sm">Order Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
