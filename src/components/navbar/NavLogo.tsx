import { motion } from 'framer-motion';

interface NavLogoProps {
  isScrolled: boolean;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

export const NavLogo = ({ isScrolled, onClick, variant = 'light' }: NavLogoProps) => {
  const isDark = variant === 'dark';

  return (
    <a
      href="#hero"
      onClick={onClick}
      className="group relative inline-flex items-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
      aria-label="CREMA - Return to top"
    >
      {/* Outer badge wrapper: transitions background, border, padding, and backdrop-filter */}
      <motion.div
        className="flex items-center transition-colors overflow-hidden"
        animate={{
          backgroundColor: isScrolled ? 'rgba(43, 23, 11, 0.95)' : 'rgba(0, 0, 0, 0)',
          borderColor: isScrolled ? 'rgba(245, 235, 225, 0.15)' : 'rgba(0, 0, 0, 0)',
          paddingLeft: isScrolled ? '8px' : '0px',
          paddingRight: isScrolled ? '16px' : '0px',
          paddingTop: isScrolled ? '6px' : '0px',
          paddingBottom: isScrolled ? '6px' : '0px',
          borderRadius: '9999px',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderWidth: '1px',
          boxShadow: isScrolled ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 1. STANDALONE EMBLEM MARK (Unified 0 0 80 80 ViewBox) */}
        <div className="relative flex items-center justify-center shrink-0">
          <motion.svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none drop-shadow-sm group-hover:scale-105 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            animate={{
              width: isScrolled ? '32px' : '40px',
              height: isScrolled ? '32px' : '40px',
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <title>CREMA Mark</title>
            <defs>
              <linearGradient id={`cremaGoldGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? '#4E342E' : '#D4AF37'} />
                <stop offset="50%" stopColor={isDark ? '#6D4C41' : '#C49A6C'} />
                <stop offset="100%" stopColor={isDark ? '#2C1810' : '#A0714D'} />
              </linearGradient>
              <linearGradient id={`cremaSwirlGrad-${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isDark ? '#2C1810' : '#FFF2E2'} />
                <stop offset="40%" stopColor={isDark ? '#8D6E63' : '#E8C9A0'} />
                <stop offset="100%" stopColor={isDark ? '#5D4037' : '#C49A6C'} />
              </linearGradient>
              <linearGradient id={`cupBodyGrad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isDark ? '#2C1810' : '#8D6E63'} />
                <stop offset="100%" stopColor={isDark ? '#1A0C05' : '#4E342E'} />
              </linearGradient>
            </defs>

            {/* Outer Organic 'C' Crescent */}
            <motion.path
              d="M 58,22 A 26,26 0 1,0 58,58"
              fill="none"
              stroke={`url(#cremaGoldGrad-${variant})`}
              strokeLinecap="round"
              animate={{
                strokeWidth: isScrolled ? 11 : 6,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Coffee Cup Body */}
            <motion.path
              d="M 22,46 C 22,66 58,66 58,46 Z"
              fill={`url(#cupBodyGrad-${variant})`}
              animate={{
                scale: isScrolled ? 1.05 : 1,
                y: isScrolled ? 2 : 0,
              }}
              style={{ transformOrigin: '40px 46px' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Cup Handle */}
            <motion.path
              d="M 56,48 C 68,48 68,60 56,60"
              fill="none"
              stroke={`url(#cremaGoldGrad-${variant})`}
              strokeLinecap="round"
              animate={{
                strokeWidth: isScrolled ? 5 : 4,
                y: isScrolled ? 2 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Crema Liquid Surface */}
            <motion.ellipse
              cx="40"
              cy="46"
              rx="18"
              ry="4.5"
              fill={`url(#cremaSwirlGrad-${variant})`}
              animate={{
                scale: isScrolled ? 1.05 : 1,
                y: isScrolled ? 2 : 0,
              }}
              style={{ transformOrigin: '40px 46px' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Primary Steam (Upward S-Flame) */}
            <motion.path
              d="M 38,42 C 30,34 48,26 40,14"
              fill="none"
              stroke={`url(#cremaGoldGrad-${variant})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{
                opacity: isScrolled ? 0 : 1,
                pathLength: isScrolled ? 0 : 1,
                y: isScrolled ? -4 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Secondary Steam Wisp */}
            <motion.path
              d="M 46,38 C 40,30 52,24 46,18"
              fill="none"
              stroke={`url(#cremaGoldGrad-${variant})`}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                opacity: isScrolled ? 0 : 0.7,
                pathLength: isScrolled ? 0 : 1,
                y: isScrolled ? -4 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            />
          </motion.svg>
        </div>

        {/* 2. TYPOGRAPHY (HTML Text morphs seamlessly via Framer Motion) */}
        <motion.div
          className="flex flex-col justify-center overflow-hidden pl-2.5"
          animate={{
            gap: isScrolled ? '0px' : '4px',
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Logotype */}
          <motion.span
            className={`font-display font-bold leading-none drop-shadow-sm whitespace-nowrap ${
              isScrolled
                ? 'text-cream group-hover:text-gold' /* Force light text in dark pill */
                : isDark
                ? 'text-brown-900 group-hover:text-accent-dark'
                : 'text-accent group-hover:text-gold'
            }`}
            animate={{
              fontSize: isScrolled ? '14px' : '24px',
              letterSpacing: isScrolled ? '0.05em' : '0.16em',
              y: isScrolled ? 1 : 0, // Optical nudge
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            CREMA
          </motion.span>
          
          {/* Subtitle */}
          <motion.span
            className={`font-body uppercase font-semibold whitespace-nowrap ${
              isDark ? 'text-brown-700/80' : 'text-cream/90'
            }`}
            animate={{
              height: isScrolled ? 0 : 'auto',
              opacity: isScrolled ? 0 : 1,
              fontSize: isScrolled ? '0px' : '8.5px',
              letterSpacing: isScrolled ? '0em' : '0.32em',
              marginTop: isScrolled ? '0px' : '4px',
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Artisanal Roasters
          </motion.span>
        </motion.div>
      </motion.div>
    </a>
  );
};
