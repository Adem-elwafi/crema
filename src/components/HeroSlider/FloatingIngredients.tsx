import { AnimatePresence, motion } from 'framer-motion';
import type { IngredientData } from '../../data/slides';

type DepthLayer = 'foreground' | 'midground' | 'background';

/**
 * Camera Depth-of-Field layers:
 * - foreground: closest to camera, heavy blur, largest, top z-index
 * - midground:  the focus layer, razor sharp, medium size
 * - background: behind the cup, slight blur, smallest z-index
 */
const LAYER: Record<DepthLayer, { zIndex: number; blur: string; spinDuration: number }> = {
  foreground: { zIndex: 4, blur: 'blur(5px)', spinDuration: 20 },
  midground: { zIndex: 2, blur: 'none', spinDuration: 28 },
  background: { zIndex: 0, blur: 'blur(2px)', spinDuration: 36 },
};

function layerFor(depth: number): DepthLayer {
  if (depth >= 1.5) return 'foreground';
  if (depth <= 0.7) return 'background';
  return 'midground';
}

interface FloatingIngredientsProps {
  ingredients: IngredientData[];
  slideId: number;
  direction: number;
}

export default function FloatingIngredients({ ingredients, slideId, direction }: FloatingIngredientsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {ingredients.map((ingredient, i) => {
          const layer = layerFor(ingredient.depth);
          const cfg = LAYER[layer];
          // Opposing continuous rotation: elements on the right spin clockwise,
          // elements on the left spin counter-clockwise (anti-gravity feel).
          const clockwise = ingredient.position.x >= 50;
          const targetRotation = ingredient.rotation + (clockwise ? 360 : -360);

          return (
            <div
              key={`${slideId}-${ingredient.id}-${i}`}
              className="absolute select-none pointer-events-none"
              style={{
                left: `${ingredient.position.x}%`,
                top: `${ingredient.position.y}%`,
                width: ingredient.size,
                height: ingredient.size,
                zIndex: cfg.zIndex,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: direction * -90, y: -45, scale: 0.4 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * 60, y: 25, scale: 0.5 }}
                transition={{
                  opacity: { duration: 0.35 },
                  x: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  y: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  delay: i * 0.03
                }}
              >
                <motion.div
                  initial={{ rotate: ingredient.rotation }}
                  animate={{ rotate: targetRotation }}
                  transition={{ duration: cfg.spinDuration, repeat: Infinity, ease: 'linear' }}
                  style={{ filter: cfg.blur }}
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}