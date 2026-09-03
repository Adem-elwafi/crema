import { useId } from 'react';
import { motion } from 'framer-motion';
import { CompactMark, ExpandedMark } from './CremaLogoMark';

interface NavLogoProps {
  isScrolled: boolean;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

export const NavLogo = ({ isScrolled, onClick, variant = 'light' }: NavLogoProps) => {
  // React 18 useId - guaranteed unique per component instance.
  // This prevents SVG gradient ID collisions when NavLogo renders
  // twice simultaneously in the split-clip dual-layer navbar.
  const uid = useId().replace(/:/g, '');
  const gradId = `crema-${uid}-${variant}`;
  const isDark = variant === 'dark';

  // The custom transition spring to make it buttery smooth (matches the 'Bucks Sauce' feel)
  const morphTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <a
      href="#hero"
      onClick={onClick}
      className="group relative inline-flex items-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
      aria-label="CREMA - Return to top"
    >
      <motion.div
        className="flex items-center overflow-hidden transition-colors"
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(43, 23, 11, 0.95)' : 'rgba(0, 0, 0, 0)',
          borderColor: isScrolled ? 'rgba(245, 235, 225, 0.15)' : 'rgba(0, 0, 0, 0)',
          paddingLeft: isScrolled ? '10px' : '0px',
          paddingRight: isScrolled ? '16px' : '0px',
          paddingTop: isScrolled ? '6px' : '0px',
          paddingBottom: isScrolled ? '6px' : '0px',
          borderRadius: '9999px',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderWidth: isScrolled ? '1px' : '0px',
          boxShadow: isScrolled ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
          gap: isScrolled ? '8px' : '12px'
        }}
        transition={morphTransition}
      >
        {/* LOGO MARK CONTAINER - The "Overlapping Cross-Fade" Illusion */}
        <motion.div
          className="relative flex items-center justify-center shrink-0"
          initial={false}
          animate={{
            width: isScrolled ? 28 : 48,
            height: isScrolled ? 28 : 48,
          }}
          transition={morphTransition}
        >
          {/* EXPANDED MARK (Fades out, shrinks, moves up) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-sm"
            initial={false}
            animate={{
              opacity: isScrolled ? 0 : 1,
              scale: isScrolled ? 0.7 : 1,
              y: isScrolled ? -12 : 0,
            }}
            transition={morphTransition}
          >
            <div style={{ width: 48, height: 48 }}>
              <ExpandedMark id={`${gradId}-exp`} isDark={isDark} />
            </div>
          </motion.div>

          {/* COMPACT MARK (Fades in, shrinks into place, moves up from below) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={false}
            animate={{
              opacity: isScrolled ? 1 : 0,
              scale: isScrolled ? 1 : 1.3,
              y: isScrolled ? 0 : 12,
            }}
            transition={morphTransition}
          >
            <div style={{ width: 28, height: 28 }}>
              <CompactMark id={`${gradId}-cmp`} />
            </div>
          </motion.div>
        </motion.div>

        {/* TYPOGRAPHY CONTAINER */}
        <motion.div 
          className="flex flex-col justify-center"
          initial={false}
          animate={{
            y: isScrolled ? 1 : 0 // Optical nudge to align text with the smaller pill center
          }}
          transition={morphTransition}
        >
          {/* Main Logotype */}
          <motion.span
            className={`font-display font-bold leading-none drop-shadow-sm whitespace-nowrap transition-colors duration-300 ${
              isScrolled
                ? 'text-accent group-hover:text-gold'
                : isDark
                ? 'text-brown-900 group-hover:text-brown-700'
                : 'text-accent group-hover:text-gold'
            }`}
            initial={false}
            animate={{
              fontSize: isScrolled ? '14px' : '24px',
              letterSpacing: isScrolled ? '0.14em' : '0.16em',
            }}
            transition={morphTransition}
          >
            CREMA
          </motion.span>
          
          {/* Subtitle — hidden on mobile to prevent overflow */}
          <motion.span
            className={`font-body uppercase font-semibold whitespace-nowrap overflow-hidden hidden md:block ${
              isDark ? 'text-brown-600' : 'text-cream/80'
            }`}
            initial={false}
            animate={{
              height: isScrolled ? 0 : 'auto',
              opacity: isScrolled ? 0 : 1,
              fontSize: isScrolled ? '0px' : '8px',
              letterSpacing: isScrolled ? '0em' : '0.3em',
              marginTop: isScrolled ? '0px' : '4px',
            }}
            transition={morphTransition}
          >
            Artisanal Roasters
          </motion.span>
        </motion.div>
      </motion.div>
    </a>
  );
};
