import {
  AnimatePresence,
  motion,
  animate
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { SlideData } from '../../data/slides';
import FloatingIngredients from './FloatingIngredients';

interface CenterPieceProps {
  slide: SlideData;
  direction: number;
  isAnimating?: boolean;
  onAnimationComplete: (index: number) => void;
}

export default function CenterPiece({ slide, direction, onAnimationComplete }: CenterPieceProps) {
  const cupFloatRef = useRef<HTMLDivElement>(null);

  // Continuous subtle floating & slight rotation drift applied to the cup only,
  // so no transform ancestor isolates the ingredients' multiply blend.
  useEffect(() => {
    if (!cupFloatRef.current) return;

    const el = cupFloatRef.current;
    const float = animate(
      { y: 0, rotate: 0 },
      { y: 12, rotate: 2 },
      {
        duration: 3.2,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        onUpdate: (latest) => {
          el.style.transform = `translateY(${latest.y}px) rotate(${latest.rotate}deg)`;
        }
      }
    );

    return () => float.stop();
  }, [slide.id]);

  const handleExitComplete = () => {
    onAnimationComplete(slide.id);
  };

  return (
    <div
      className="absolute right-[4%] md:right-[6%] lg:right-[10%] top-[calc(50%-160px)] sm:top-[calc(50%-210px)] md:top-[calc(50%-240px)] lg:top-[calc(50%-280px)] w-80 sm:w-[420px] md:w-[480px] lg:w-[560px] aspect-square pointer-events-none flex items-center justify-center"
    >
      {/* Ambient warm radial glow */}
      <motion.div
        className="absolute w-4/5 h-4/5 rounded-full blur-3xl opacity-35 pointer-events-none"
        animate={{ backgroundColor: slide.liquidColor || '#C8956C' }}
        transition={{ duration: 0.7 }}
      />

      <div className="w-full h-full relative">
        {/* Floating ingredients anchored to the cup center, moving with it */}
        <FloatingIngredients
          ingredients={slide.ingredients}
          slideId={slide.id}
          direction={direction}
        />

        <AnimatePresence
          mode="popLayout"
          initial={false}
          onExitComplete={handleExitComplete}
        >
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: direction * 380, rotate: direction * -40, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -280, rotate: direction * 50, scale: 0.8 }}
            transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 z-[1] flex items-center justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <div ref={cupFloatRef} className="w-full h-full flex items-center justify-center" style={{ willChange: 'transform' }}>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(44,24,16,0.4)] select-none filter contrast-105"
                draggable={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}