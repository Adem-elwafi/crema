import { motion, AnimatePresence } from 'framer-motion';

interface NavLogoProps {
  isScrolled: boolean;
  onClick?: () => void;
}

export const NavLogo = ({ isScrolled, onClick }: NavLogoProps) => {
  return (
    <a
      href="#hero"
      onClick={onClick}
      className="group relative flex items-center select-none focus:outline-none"
      aria-label="CREMA Home"
    >
      <AnimatePresence mode="wait">
        {!isScrolled ? (
          /* Full Expanded Logo */
          <motion.div
            key="expanded-logo"
            initial={{ opacity: 0, x: -10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            {/* Crest Mark */}
            <div className="w-10 h-10 rounded-full border border-accent/60 bg-brown-900/80 backdrop-blur-md flex items-center justify-center text-accent group-hover:border-gold group-hover:text-gold transition-all duration-300 shadow-md">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                {/* Coffee Cup / Steam SVG */}
                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                <line x1="6" y1="2" x2="6" y2="4" />
                <line x1="10" y1="2" x2="10" y2="4" />
                <line x1="14" y1="2" x2="14" y2="4" />
              </svg>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-[0.22em] text-accent group-hover:text-gold transition-colors duration-300 leading-none drop-shadow-sm">
                CREMA
              </span>
              <span className="font-body text-[9px] uppercase tracking-[0.32em] text-cream/90 mt-1 font-semibold">
                Artisanal Roasters
              </span>
            </div>
          </motion.div>
        ) : (
          /* Collapsed Minimal Monogram Mark */
          <motion.div
            key="collapsed-logo"
            initial={{ opacity: 0, scale: 0.85, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brown-900/90 backdrop-blur-xl border border-cream/20 text-cream shadow-2xl hover:border-gold hover:text-gold transition-all duration-300"
          >
            <div className="w-6 h-6 rounded-full bg-accent text-brown-900 flex items-center justify-center font-display font-bold text-xs shadow-inner">
              C
            </div>
            <span className="font-display font-bold text-sm tracking-[0.18em] text-cream">
              CREMA
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
};
