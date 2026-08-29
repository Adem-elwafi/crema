import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Instagram, Sparkles, ArrowUpRight } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  onOrderClick?: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  links,
  onOrderClick,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md h-full bg-brown-900 text-cream border-l border-cream/10 shadow-2xl flex flex-col justify-between p-8 md:p-12 overflow-y-auto z-10"
          >
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between border-b border-cream/10 pb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                <span className="font-display tracking-[0.2em] text-lg font-bold text-cream">
                  CREMA
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:text-accent hover:border-accent transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links List */}
            <nav className="my-8 flex flex-col gap-5">
              {links.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * (idx + 1), duration: 0.3 }}
                  className="group flex items-center justify-between text-2xl md:text-3xl font-display font-medium text-cream hover:text-accent transition-colors duration-200 py-1"
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-200">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-accent"
                  />
                </motion.a>
              ))}
            </nav>

            {/* Bottom Actions & Info */}
            <div className="space-y-6 pt-6 border-t border-cream/10">
              <button
                onClick={() => {
                  onClose();
                  onOrderClick?.();
                }}
                className="w-full py-3.5 rounded-full bg-accent hover:bg-gold text-brown-900 font-body text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-accent/20"
              >
                Order Online Now
              </button>

              <div className="space-y-2.5 text-xs text-cream/70 font-body">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-accent shrink-0" />
                  <span>124 Espresso Boulevard, SoHo, NY</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-accent shrink-0" />
                  <span>Mon – Sun: 7:00 AM – 8:00 PM</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-cream/5 text-xs text-cream/50">
                <span>© {new Date().getFullYear()} CREMA Roastery</span>
                <div className="flex items-center gap-3 text-cream/70">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
