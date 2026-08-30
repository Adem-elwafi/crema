import { ShoppingBag } from 'lucide-react';
import { NavLogo } from './NavLogo';
import { WavyNavLink } from './WavyNavLink';

interface SplitNavLayerProps {
  variant: 'light' | 'dark';
  navLinks: { label: string; href: string }[];
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  cartCount: number;
  onCartClick: () => void;
  onOrderClick: () => void;
  onOpenDrawer: () => void;
}

export const SplitNavLayer = ({
  variant,
  navLinks,
  hoveredIndex,
  onHoverIndex,
  cartCount,
  onCartClick,
  onOrderClick,
  onOpenDrawer,
}: SplitNavLayerProps) => {
  return (
    <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between relative pointer-events-auto select-none">
      {/* LEFT: Dynamic Logo */}
      <div className="flex items-center z-10">
        <NavLogo isScrolled={false} variant={variant} />
      </div>

      {/* CENTER: Navigation Links (No pill background - pure, breathable editorial links) */}
      <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
        {navLinks.map((link, idx) => (
          <WavyNavLink
            key={link.label}
            label={link.label}
            href={link.href}
            variant={variant}
            isHovered={hoveredIndex === idx}
            onHoverChange={(hovered) => onHoverIndex(hovered ? idx : null)}
          />
        ))}
      </nav>

      {/* RIGHT: Action CTAs */}
      <div className="flex items-center z-10">
        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onCartClick}
            aria-label="View Cart"
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer ${
              variant === 'light'
                ? 'border-cream/30 text-cream hover:border-gold hover:text-gold hover:bg-white/5'
                : 'border-brown-900/30 text-brown-900 hover:border-brown-900 hover:text-accent-dark hover:bg-brown-900/5'
            }`}
          >
            <ShoppingBag size={17} strokeWidth={2.2} />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-4 h-4 font-bold text-[9px] rounded-full flex items-center justify-center shadow ${
                  variant === 'light'
                    ? 'bg-accent text-brown-900'
                    : 'bg-brown-900 text-cream'
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOrderClick}
            className={`px-6 py-2.5 rounded-full font-body text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 active:scale-95 cursor-pointer shadow-md ${
              variant === 'light'
                ? 'bg-accent text-brown-900 hover:bg-gold hover:shadow-accent/30'
                : 'bg-brown-900 text-cream hover:bg-brown-800 hover:shadow-brown-900/30'
            }`}
          >
            Order Online
          </button>
        </div>

        {/* Mobile-only Actions */}
        <div className="md:hidden flex items-center gap-2.5">
          <button
            onClick={onCartClick}
            aria-label="View Cart"
            className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer ${
              variant === 'light'
                ? 'border-cream/30 text-cream hover:text-gold'
                : 'border-brown-900/30 text-brown-900 hover:text-accent-dark'
            }`}
          >
            <ShoppingBag size={15} strokeWidth={2.2} />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-3.5 h-3.5 font-bold text-[8px] rounded-full flex items-center justify-center shadow ${
                  variant === 'light'
                    ? 'bg-accent text-brown-900'
                    : 'bg-brown-900 text-cream'
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenDrawer}
            aria-label="Open mobile navigation"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              variant === 'light'
                ? 'border-cream/30 text-cream hover:text-gold'
                : 'border-brown-900/30 text-brown-900 hover:text-accent-dark'
            }`}
          >
            <div className="space-y-1">
              <span className="block w-4 h-[2px] bg-current rounded-full" />
              <span className="block w-4 h-[2px] bg-current rounded-full" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
