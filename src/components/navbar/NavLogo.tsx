import { useId } from 'react';
import { motion } from 'framer-motion';
import { CompactMark, ExpandedMark } from './CremaLogoMark';

interface NavLogoProps {
  isScrolled: boolean;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

export const NavLogo = ({ isScrolled, onClick, variant = 'light' }: NavLogoProps) => {
  // React 18 useId - unique per component instance to prevent SVG gradient collisions
  const uid = useId().replace(/:/g, '');
  const gradId = `crema-${uid}-${variant}`;
  const isDark = variant === 'dark';

  // Buttery-smooth spring curve for the cross-fade
  const morphTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <a
      href="#hero"
      onClick={onClick}
      className="group relative inline-flex items-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full h-12"
      aria-label="CREMA - Return to top"
    >
      <div className="relative flex items-center">
        {/* STATE 1: EXPANDED LOGO (Active when unscrolled) */}
        <motion.div
          className="flex items-center gap-3 origin-left select-none"
          initial={false}
          animate={{
            opacity: isScrolled ? 0 : 1,
            scale: isScrolled ? 0.85 : 1,
            y: isScrolled ? -4 : 0,
            pointerEvents: isScrolled ? 'none' : 'auto',
          }}
          transition={morphTransition}
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Expanded Mark */}
          <div className="w-12 h-12 flex items-center justify-center shrink-0 drop-shadow-sm">
            <ExpandedMark id={`${gradId}-exp`} isDark={isDark} />
          </div>

          {/* Typography */}
          <div className="flex flex-col justify-center">
            <span
              className={`font-display font-bold leading-none whitespace-nowrap text-2xl tracking-[0.16em] transition-colors duration-300 drop-shadow-sm ${
                isDark
                  ? 'text-brown-900 group-hover:text-brown-700'
                  : 'text-accent group-hover:text-gold'
              }`}
            >
              CREMA
            </span>
            <span
              className={`font-body uppercase font-semibold whitespace-nowrap text-[8px] tracking-[0.3em] mt-1 hidden md:block ${
                isDark ? 'text-brown-600' : 'text-cream/80'
              }`}
            >
              Artisanal Roasters
            </span>
          </div>
        </motion.div>

        {/* STATE 2: COMPACT PILL LOGO (Active when scrolled) */}
        <motion.div
          className="absolute left-0 top-1/2 flex items-center gap-2 pl-2.5 pr-4 py-1.5 rounded-full bg-brown-900/95 border border-cream/15 backdrop-blur-md shadow-2xl origin-left select-none"
          initial={false}
          animate={{
            opacity: isScrolled ? 1 : 0,
            scale: isScrolled ? 1 : 0.85,
            y: '-50%',
            pointerEvents: isScrolled ? 'auto' : 'none',
          }}
          transition={morphTransition}
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Compact Mark */}
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <CompactMark id={`${gradId}-cmp`} />
          </div>

          {/* Compact Typography */}
          <span className="font-display font-bold leading-none text-sm tracking-[0.14em] text-accent group-hover:text-gold whitespace-nowrap">
            CREMA
          </span>
        </motion.div>
      </div>
    </a>
  );
};
