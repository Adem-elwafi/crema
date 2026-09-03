import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { SlideData } from '../../data/slides';

interface SlideContentProps {
  slide: SlideData;
  slideIndex: number;
  totalSlides: number;
  direction: number;
  isAnimating?: boolean;
  onAnimationComplete?: (id: number) => void;
}

const transitionEase = [0.16, 1, 0.3, 1] as const;

export default function SlideContent({
  slide,
  slideIndex,
  totalSlides,
  direction,
  isAnimating = false,
  onAnimationComplete,
}: SlideContentProps) {
  const handleComplete = () => onAnimationComplete?.(slide.id);

  return (
    <div className="relative z-30 w-full max-w-lg select-none">
      {/* 1. SLOTTED COUNTER: Fixed width slot + tabular-nums prevents horizontal shifting */}
      <div className="flex items-center space-x-4 mb-4 sm:mb-6">
        {/* Fixed Width Rolling Slide Number Slot */}
        <div className="relative overflow-hidden h-9 sm:h-12 flex items-center w-12 sm:w-16 shrink-0 tabular-nums">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={slideIndex}
              custom={direction}
              initial={{ y: direction * 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction * -28, opacity: 0 }}
              transition={{ duration: 0.4, ease: transitionEase }}
              className="font-display font-bold text-[#E8C9A0] w-full text-left"
              style={{ fontSize: 'clamp(1.8rem, 1.4rem + 1vw, 2.75rem)' }}
            >
              {String(slideIndex + 1).padStart(2, '0')}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Permanent dividing line: Never unmounts, never shakes */}
        <div className="h-[1px] w-10 sm:w-12 bg-[#E8C9A0]/70 shrink-0" />

        {/* Permanent total slides count: Fixed width + tabular-nums */}
        <div
          className="font-display text-[#C8956C] shrink-0 tabular-nums w-8 text-left"
          style={{ fontSize: 'clamp(1rem, 0.875rem + 0.25vw, 1.25rem)' }}
        >
          {String(totalSlides).padStart(2, '0')}
        </div>
      </div>

      {/* 2. SLOTTED SUBTITLE: Bounded in-place text replacement */}
      <div className="relative overflow-hidden h-6 mb-3 sm:mb-4">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ y: direction * 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction * -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: transitionEase }}
            className="font-bold tracking-[0.2em] text-[#C8956C] uppercase text-xs sm:text-sm"
          >
            {slide.subtitle}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. SLOTTED TITLE: Locked fixed-height box prevents height expansion on multi-line titles like 'Slow-Drip Cold Brew' */}
      <div className="relative w-full h-24 sm:h-28 lg:h-32 mb-4 sm:mb-6 overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.h1
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, y: direction * 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -24 }}
            transition={{ duration: 0.4, ease: transitionEase }}
            onAnimationComplete={handleComplete}
            className="absolute inset-0 flex items-center font-display font-bold text-cream"
            style={{
              fontSize: 'clamp(1.85rem, 1.3rem + 1.6vw, 3.25rem)',
              lineHeight: 1.12,
              textShadow: '0 2px 12px rgba(0,0,0,0.35)',
            }}
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* 4. SLOTTED DESCRIPTION: Locked fixed-height box eliminates collapse and vertical shift */}
      <div className="relative w-full max-w-md h-16 sm:h-20 mb-6 sm:mb-8 overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.p
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, y: direction * 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -14 }}
            transition={{ duration: 0.35, ease: transitionEase }}
            className="absolute inset-0 flex items-start text-[#E8D8C8]/90 font-body leading-relaxed text-sm sm:text-base"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}
          >
            {slide.description}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 5. PRICE & ORDER BUTTON: Rolling price digit + Shrink-to-disappear CTA button */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        {/* Fixed Width Rolling price slot prevents shifting the CTA button */}
        <div className="relative overflow-hidden h-9 sm:h-11 flex items-center w-24 sm:w-28 shrink-0 tabular-nums">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.span
              key={slide.id}
              custom={direction}
              initial={{ y: direction * 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction * -22, opacity: 0 }}
              transition={{ duration: 0.4, ease: transitionEase }}
              className="font-bold font-display text-[#E8C9A0] text-2xl sm:text-3xl lg:text-4xl w-full text-left"
            >
              {slide.price}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* CTA Button: Shrinks until disappearing during swipe, pops back in when settled */}
        <motion.button
          initial={false}
          animate={{
            scale: isAnimating ? 0 : 1,
            opacity: isAnimating ? 0 : 1,
            pointerEvents: isAnimating ? 'none' : 'auto',
          }}
          transition={{
            type: 'spring',
            damping: 22,
            stiffness: 280,
            delay: isAnimating ? 0 : 0.05,
          }}
          disabled={isAnimating}
          className="flex items-center justify-center space-x-2 bg-[#C8956C]/90 backdrop-blur-sm border border-[#E8C9A0]/40 hover:bg-[#E8C9A0] hover:text-brown-900 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-colors duration-300 shadow-lg hover:shadow-[#E8C9A0]/20 cursor-pointer"
        >
          <span className="font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm">Order Now</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
    </div>
  );
}
