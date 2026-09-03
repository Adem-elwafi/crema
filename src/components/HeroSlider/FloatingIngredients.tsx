import { AnimatePresence, motion } from 'framer-motion';
import type { IngredientData } from '../../data/slides';

type DepthLayer = 'foreground' | 'midground' | 'background';

/**
 * Camera Depth-of-Field layers:
 * - foreground: closest to camera, heavy blur, largest, top z-index
 * - midground:  the focus layer, razor sharp, medium size
 * - background: behind the cup, slight blur, smallest z-index (hidden on mobile)
 */
const LAYER: Record<DepthLayer, { zIndex: number; blur: string; opacity: number; spinDuration: number }> = {
  foreground: { zIndex: 3, blur: 'blur(4px)', opacity: 1, spinDuration: 22 },
  midground: { zIndex: 2, blur: 'none', opacity: 1, spinDuration: 28 },
  background: { zIndex: 1, blur: 'blur(2px)', opacity: 0.85, spinDuration: 34 },
};

function layerFor(depth: number): DepthLayer {
  if (depth >= 1.5) return 'foreground';
  if (depth <= 0.7) return 'background';
  return 'midground';
}

// Reference container width the ingredient pixel sizes were authored against.
// Expressing every size as a % keeps ingredients scaling in lock-step with the cup.
const BASE_CONTAINER = 560;

interface FloatingIngredientsProps {
  ingredients: IngredientData[];
  slideId: number;
  direction: number;
}

export default function FloatingIngredients({ ingredients, slideId, direction }: FloatingIngredientsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence mode="popLayout" initial={false}>
        {ingredients.map((ingredient, i) => {
          const layer = layerFor(ingredient.depth);
          const cfg = LAYER[layer];
          const sizePct = (ingredient.size / BASE_CONTAINER) * 100;
          // Foreground elements (foreground + midground) sit with the cup.
          // Background dust layer is hidden on small screens to reduce mobile clutter.
          const hiddenMobile = layer === 'background' ? 'hidden sm:block' : 'block';
          // Continuous smooth rotation for leaves and floating elements
          const clockwise = ingredient.position.x >= 50;
          const spinDelta = clockwise ? 360 : -360;

          return (
            <div
              key={`${slideId}-${ingredient.id}-${i}`}
              className={`absolute select-none pointer-events-none ${hiddenMobile}`}
              style={{
                left: `${ingredient.position.x}%`,
                top: `${ingredient.position.y}%`,
                width: `${sizePct}%`,
                height: `${sizePct}%`,
                zIndex: cfg.zIndex,
                opacity: cfg.opacity,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: direction * -70, y: -35, scale: 0.4 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * 40, y: 20, scale: 0.5 }}
                transition={{
                  opacity: { duration: 0.35 },
                  x: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  y: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  delay: i * 0.05
                }}
                style={{ willChange: 'transform, opacity' }}
              >
                <motion.div
                  animate={{ rotate: [ingredient.rotation, ingredient.rotation + spinDelta] }}
                  transition={{
                    duration: cfg.spinDuration,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ filter: cfg.blur, willChange: 'transform' }}
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
