import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from '../context/LenisContext';
import { NavLogo } from './navbar/NavLogo';
import { CompactActions } from './navbar/CompactActions';
import { MenuDrawer } from './navbar/MenuDrawer';
import { SplitNavLayer } from './navbar/SplitNavLayer';
import { MasterNavOverlay } from './navbar/MasterNavOverlay';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [orderToast, setOrderToast] = useState<string | null>(null);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const lenis = useLenis();

  const handleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(true);
    lenis?.stop();
  }, [lenis]);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    lenis?.start();
  }, [lenis]);

  // Monitor scroll position with Framer Motion for 60fps performance
  const { scrollY } = useScroll();

  // Scroll hysteresis to eliminate threshold bouncing & jitter
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!isScrolled && latest > 80) {
      setIsScrolled(true);
    } else if (isScrolled && latest < 35) {
      setIsScrolled(false);
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
      {/* 1. UNSCROLLED STATE: Dual-Layer Split-Clip Navbar (Clean, airy, perfectly mapped to Hero diagonal) */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            key="unscrolled-split-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 h-screen pointer-events-none z-50 overflow-hidden"
          >
            {/* LAYER 1: Dark Brown Region (Left: polygon 0 0, 55% 0, 40% 100%, 0 100%) - VISUAL */}
            <div
              className="absolute inset-0 pointer-events-none pt-6 select-none"
              style={{ clipPath: 'polygon(0 0, 55% 0, 40% 100%, 0 100%)' }}
              aria-hidden="true"
            >
              <SplitNavLayer
                variant="light"
                navLinks={navLinks}
                hoveredIndex={hoveredNavIndex}
                hoveredButton={hoveredButton}
                cartCount={cartCount}
                isVisualOnly={true}
              />
            </div>

            {/* LAYER 2: Light Cream Region (Right: polygon 55% 0, 100% 0, 100% 100%, 40% 100%) - VISUAL */}
            <div
              className="absolute inset-0 pointer-events-none pt-6 select-none"
              style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 40% 100%)' }}
              aria-hidden="true"
            >
              <SplitNavLayer
                variant="dark"
                navLinks={navLinks}
                hoveredIndex={hoveredNavIndex}
                hoveredButton={hoveredButton}
                cartCount={cartCount}
                isVisualOnly={true}
              />
            </div>

            {/* MASTER INTERACTIVE HIT-TEST OVERLAY (Unified hit-testing across both split regions) */}
            <div className="absolute inset-x-0 top-0 pt-6 pointer-events-auto">
              <MasterNavOverlay
                navLinks={navLinks}
                onHoverNavIndex={setHoveredNavIndex}
                onHoverButton={setHoveredButton}
                onCartClick={handleCartClick}
                onOrderClick={handleOrderClick}
                onOpenDrawer={handleDrawerOpen}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SCROLLED STICKY STATE: Compact Capsule Navbar (Appears when scrolling down) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.header
            key="scrolled-sticky-nav"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 w-full z-50 pointer-events-none pt-4"
          >
            <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
              {/* Left: Standalone Emblem Badge */}
              <div className="pointer-events-auto flex items-center z-10">
                <NavLogo isScrolled={true} />
              </div>

              {/* Right: Floating Compact Actions Capsule */}
              <div className="pointer-events-auto flex items-center z-10">
                <CompactActions
                  isMenuOpen={isDrawerOpen}
                  onToggleMenu={() => (isDrawerOpen ? handleDrawerClose() : handleDrawerOpen())}
                  onOrderClick={handleOrderClick}
                  onCartClick={handleCartClick}
                  cartCount={cartCount}
                />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Slide-out Menu Drawer */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
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


