import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { NavLogo } from './navbar/NavLogo';
import { WavyNavLink } from './navbar/WavyNavLink';
import { CompactActions } from './navbar/CompactActions';
import { MenuDrawer } from './navbar/MenuDrawer';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Monitor scroll position with Framer Motion for 60fps performance
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Threshold of 60px before collapsing into sticky floating mode
    const shouldCollapse = latest > 60;
    if (shouldCollapse !== isScrolled) {
      setIsScrolled(shouldCollapse);
    }
  });

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Menu', href: '#menu' },
    { label: 'Visit Us', href: '#visit' },
    { label: 'Newsletter', href: '#newsletter' },
  ];

  const handleOrderClick = () => {
    setCartCount((prev) => prev + 1);
    setOrderToast('Added artisanal roast to your cart!');
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleCartClick = () => {
    setOrderToast(`You have ${cartCount} items in your basket.`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 pointer-events-none transition-all duration-300 ${
          isScrolled ? 'pt-4 md:pt-5' : 'pt-6 md:pt-7'
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between min-h-[48px]">
          {/* LEFT: Dynamic Logo (Full on top, Monogram on scroll) */}
          <div className="pointer-events-auto flex items-center z-10">
            <NavLogo isScrolled={isScrolled} />
          </div>

          {/* CENTER: Expanded Navigation Links (Positioned absolutely in center to eliminate any layout shift) */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.nav
                key="expanded-desktop-nav"
                initial={{ opacity: 0, scale: 0.94, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex items-center gap-6 pointer-events-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-brown-900/90 backdrop-blur-xl px-7 py-2.5 rounded-full border border-cream/20 shadow-2xl z-10"
              >
                {navLinks.map((link) => (
                  <WavyNavLink
                    key={link.label}
                    label={link.label}
                    href={link.href}
                  />
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* RIGHT: Dynamic Actions (Swaps smoothly between expanded action & compact capsule) */}
          <div className="pointer-events-auto flex items-center z-10">
            <AnimatePresence mode="wait">
              {!isScrolled ? (
                /* Top / Unscrolled State Action Pill */
                <motion.div
                  key="expanded-actions"
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex items-center gap-3"
                >
                  <button
                    onClick={handleCartClick}
                    aria-label="View Cart"
                    className="relative w-10 h-10 rounded-full border border-cream/20 bg-brown-900/90 backdrop-blur-xl text-cream flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 shadow-2xl cursor-pointer"
                  >
                    <ShoppingBag size={17} strokeWidth={2.2} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-brown-900 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleOrderClick}
                    className="px-6 py-2.5 rounded-full bg-accent text-brown-900 hover:bg-gold font-body text-xs tracking-[0.2em] uppercase font-bold shadow-2xl hover:shadow-accent/40 transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    Order Online
                  </button>
                </motion.div>
              ) : (
                /* Scrolled Sticky State Capsule (Order Now + Cart + Hamburger) */
                <CompactActions
                  key="compact-actions"
                  isMenuOpen={isDrawerOpen}
                  onToggleMenu={() => setIsDrawerOpen(!isDrawerOpen)}
                  onOrderClick={handleOrderClick}
                  onCartClick={handleCartClick}
                  cartCount={cartCount}
                />
              )}
            </AnimatePresence>

            {/* Mobile-only toggle when at the very top */}
            {!isScrolled && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="Open mobile navigation"
                  className="w-10 h-10 rounded-full bg-brown-900/90 backdrop-blur-xl border border-cream/20 text-cream flex items-center justify-center hover:text-gold transition-colors cursor-pointer shadow-2xl"
                >
                  <div className="space-y-1">
                    <span className="block w-4 h-[2px] bg-current rounded-full" />
                    <span className="block w-4 h-[2px] bg-current rounded-full" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        links={navLinks}
        onOrderClick={handleOrderClick}
      />

      {/* Interactive Quick Feedback Toast */}
      <AnimatePresence>
        {orderToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[110] px-5 py-3 rounded-2xl bg-brown-900/95 text-cream border border-accent/40 shadow-2xl backdrop-blur-md flex items-center gap-3 font-body text-xs tracking-wide"
          >
            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>{orderToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
