import {
  AnimatePresence,
  motion
} from 'framer-motion';
import type { SlideData } from '../../data/slides';
import FloatingIngredients from './FloatingIngredients';

interface CenterPieceProps {
  slide: SlideData;
  direction: number;
  isAnimating?: boolean;
  onAnimationComplete: (index: number) => void;
}

export default function CenterPiece({ slide, direction, onAnimationComplete }: CenterPieceProps) {
  const handleExitComplete = () => {
    onAnimationComplete(slide.id);
  };

  return (
    <div
      className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 min-[955px]:w-[420px] min-[955px]:h-[420px] lg:w-[500px] lg:h-[500px] pointer-events-none flex items-center justify-center"
    >
      {/* Ambient warm radial glow */}
      <motion.div
        className="absolute w-4/5 h-4/5 rounded-full blur-3xl opacity-35 pointer-events-none"
        animate={{ backgroundColor: slide.liquidColor || '#C8956C' }}
        transition={{ duration: 0.7 }}
      />

      <div className="w-full h-full relative">
        {/* Floating ingredients anchored to the cup center */}
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
            <div className="w-full h-full flex items-center justify-center">
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
