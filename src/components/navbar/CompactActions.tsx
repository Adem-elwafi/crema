import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface CompactActionsProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onOrderClick?: () => void;
  onCartClick?: () => void;
  cartCount?: number;
}

export const CompactActions = ({
  isMenuOpen,
  onToggleMenu,
  onOrderClick,
  onCartClick,
  cartCount = 2,
}: CompactActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -90, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -90, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2 p-1.5 rounded-full bg-brown-900/90 backdrop-blur-xl border border-cream/20 shadow-2xl"
    >
      {/* Primary CTA: Order Now Button */}
      <button
        onClick={onOrderClick}
        className="relative group overflow-hidden px-5 py-2 rounded-full bg-accent text-brown-900 font-body text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:bg-gold hover:shadow-accent/40 transition-all duration-300 active:scale-95 cursor-pointer"
      >
        <span className="relative z-10">ORDER NOW</span>
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
      </button>

      {/* Shopping Bag / Cart Icon Button with Badge */}
      <button
        onClick={onCartClick}
        aria-label="Shopping Cart"
        className="relative w-9 h-9 rounded-full bg-brown-800/90 border border-cream/15 text-cream flex items-center justify-center hover:text-gold hover:border-gold/50 hover:bg-brown-800 transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
      >
        <ShoppingBag size={16} strokeWidth={2.2} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-brown-900 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
            {cartCount}
          </span>
        )}
      </button>

      {/* Hamburger / Close Morphing Button */}
      <button
        onClick={onToggleMenu}
        aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        className="w-9 h-9 rounded-full bg-brown-800/90 border border-cream/15 text-cream flex flex-col items-center justify-center gap-1.5 hover:text-gold hover:border-gold/50 hover:bg-brown-800 transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
      >
        <motion.span
          animate={
            isMenuOpen
              ? { rotate: 45, y: 4.5, backgroundColor: '#E8C9A0' }
              : { rotate: 0, y: 0, backgroundColor: '#FDF8F3' }
          }
          transition={{ duration: 0.25 }}
          className="w-4 h-[2px] block rounded-full"
        />
        <motion.span
          animate={
            isMenuOpen
              ? { rotate: -45, y: -4.5, backgroundColor: '#E8C9A0' }
              : { rotate: 0, y: 0, backgroundColor: '#FDF8F3' }
          }
          transition={{ duration: 0.25 }}
          className="w-4 h-[2px] block rounded-full"
        />
      </button>
    </motion.div>
  );
};
