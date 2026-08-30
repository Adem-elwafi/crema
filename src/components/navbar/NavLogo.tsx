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
      <div
        className={`flex items-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'px-2 py-1.5 rounded-full bg-brown-900/90 backdrop-blur-xl border border-cream/20 shadow-2xl hover:border-gold'
            : 'p-0 bg-transparent border-transparent'
        }`}
      >
        {/* 1. STANDALONE EMBLEM MARK (Always 100% visible, centered in badge when scrolled) */}
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full pointer-events-none transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: isScrolled ? 'scale(1.06)' : 'scale(1)',
            }}
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
            </defs>

            {/* Outer Organic Crema Ribbon */}
            <path
              d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 15.2 33.9 10.9 30.5 8"
              stroke={`url(#cremaGoldGrad-${variant})`}
              strokeWidth="2.4"
              strokeLinecap="round"
              className="drop-shadow-sm transition-all duration-300 group-hover:opacity-80"
            />

            {/* Inner Fluid Vortex Swirl */}
            <path
              d="M20 9C14.5 9 10 13.5 10 19C10 24.5 14.5 29 20 29C23.8 29 27.1 26.9 28.8 23.8C30.2 21.2 30 18.2 28.5 16C26.8 13.5 23.8 12.2 21 12.8C18.2 13.4 16 15.8 16 18.8C16 21.8 18.2 24.2 21.2 24.2C23.2 24.2 24.8 22.8 25 21"
              stroke={`url(#cremaSwirlGrad-${variant})`}
              strokeWidth="2.0"
              strokeLinecap="round"
            />

            {/* Central Coffee Bean S-Curve Core */}
            <path
              d="M17 14.5C18.5 16 21.5 16.5 22.5 18C23.5 19.5 22 21.5 20.5 22.5"
              stroke={`url(#cremaGoldGrad-${variant})`}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Micro Roastery Spark */}
            <circle cx="20" cy="20" r="1.5" fill={`url(#cremaSwirlGrad-${variant})`} />
          </svg>
        </div>

        {/* 2. TYPOGRAPHY (Collapses smoothly with max-width, opacity, and transform) */}
        <div
          data-nav-logo
          className={`flex flex-col justify-center overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'max-w-0 opacity-0 -translate-x-3 pointer-events-none pl-0'
              : 'max-w-[130px] opacity-100 translate-x-0 pointer-events-auto pl-2.5'
          }`}
        >
          <span
            className={`font-display font-bold text-2xl tracking-[0.16em] transition-colors duration-300 leading-none drop-shadow-sm whitespace-nowrap ${
              isDark
                ? 'text-brown-900 group-hover:text-accent-dark'
                : 'text-accent group-hover:text-gold'
            }`}
          >
            CREMA
          </span>
          <span
            className={`font-body text-[8.5px] uppercase tracking-[0.32em] mt-1 font-semibold whitespace-nowrap ${
              isDark ? 'text-brown-700/80' : 'text-cream/90'
            }`}
          >
            Roasters
          </span>
        </div>
      </div>
    </a>
  );
};

