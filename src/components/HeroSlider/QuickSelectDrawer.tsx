import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { SlideData } from '../../data/slides';

interface QuickSelectDrawerProps {
  isOpen: boolean;
  slides: SlideData[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export default function QuickSelectDrawer({ isOpen, slides, currentIndex, onSelect, onClose }: QuickSelectDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-brown-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-84 max-w-[90vw] bg-cream shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-brown-200/50">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Featured Selections</span>
              <h2 className="text-2xl font-display font-bold text-brown-900">Our Menu</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream-dark text-brown-900 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col space-y-4 pr-1">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  onSelect(index);
                  onClose();
                }}
                className={`flex items-center space-x-4 p-3 rounded-2xl transition-all duration-300 text-left group ${
                  currentIndex === index
                    ? 'bg-cream-dark border-2 border-accent shadow-sm'
                    : 'bg-white/60 border border-brown-100/50 hover:bg-cream-dark hover:border-accent/50'
                }`}
                style={{
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isOpen ? 1 : 0,
                  transitionDelay: `${index * 60 + 80}ms`
                }}
              >
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] tracking-widest uppercase text-accent font-semibold block">{slide.subtitle}</span>
                  <h3 className="font-display font-semibold text-brown-900 text-base truncate">{slide.title}</h3>
                  <p className="text-accent font-bold text-sm">{slide.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
