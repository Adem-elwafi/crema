import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Plus } from 'lucide-react';

import cappuccinoImg from '../assets/images/menu/cappuccino.jpg';
import chocolateCakeImg from '../assets/images/menu/chocolate-cake.jpg';
import sandwichImg from '../assets/images/menu/sandwich.jpg';
import icedLatteImg from '../assets/images/menu/iced-latte.jpg';

export default function MenuHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef, { y: 30, opacity: 0 });
  useScrollReveal(gridRef, { y: 40, opacity: 0, stagger: 0.15, childSelector: '.menu-item' });

  const items = [
    {
      name: 'Artisan Cappuccino',
      category: 'Signature Hot',
      price: '$4.50',
      image: cappuccinoImg,
      badge: 'Popular',
      rating: '4.9 ★'
    },
    {
      name: 'Dark Chocolate Ganache',
      category: 'Artisanal Bakery',
      price: '$5.50',
      image: chocolateCakeImg,
      badge: 'Chef Choice',
      rating: '5.0 ★'
    },
    {
      name: 'Herb Brioche Sandwich',
      category: 'Savory Kitchen',
      price: '$7.50',
      image: sandwichImg,
      badge: 'Fresh Daily',
      rating: '4.8 ★'
    },
    {
      name: 'Layered Iced Latte',
      category: 'Cold Brews',
      price: '$5.00',
      image: icedLatteImg,
      badge: 'Seasonal',
      rating: '4.9 ★'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-cream px-6 relative" id="menu">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold font-body">Freshly Prepared</span>
          <h2 className="font-display text-4xl md:text-5xl text-brown-900 mt-2 mb-4 font-bold">Our Menu Highlights</h2>
          <p className="text-brown-400 font-body max-w-xl mx-auto text-base md:text-lg">
            Crafted with uncompromising passion, roasted in small batches, and served with love.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="menu-item rounded-3xl overflow-hidden bg-white/90 border border-brown-100/40 shadow-[0_8px_30px_-12px_rgba(44,24,16,0.12)] group cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_-20px_rgba(44,24,16,0.25)] transition-all duration-500 flex flex-col"
            >
              {/* Product Photo */}
              <div className="relative aspect-square overflow-hidden bg-cream-dark">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-brown-900 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {item.badge}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-brown-900/80 backdrop-blur-md text-cream text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {item.rating}
                </div>

                {/* Quick Add floating button */}
                <button 
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-accent text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:bg-accent-dark hover:scale-110"
                  aria-label={`Order ${item.name}`}
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brown-400 block mb-1.5">
                    {item.category}
                  </span>
                  <h3 className="font-display font-bold text-lg text-brown-900 group-hover:text-accent transition-colors leading-snug">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-brown-100/40 flex items-center justify-between">
                  <span className="font-display font-semibold text-[#A0714D] text-xl">{item.price}</span>
                  <span className="text-xs text-brown-400 uppercase tracking-wider font-semibold group-hover:text-brown-900 transition-colors">
                    Order Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border border-accent/60 text-accent hover:bg-[#E8C9A0] hover:border-[#E8C9A0] hover:text-brown-900 rounded-full px-12 py-3.5 font-semibold transition-all duration-500 font-body tracking-[0.2em] text-sm uppercase shadow-sm hover:shadow-lg group">
            VIEW FULL MENU &amp; PRICING
          </button>
        </div>
      </div>
    </section>
  );
}
