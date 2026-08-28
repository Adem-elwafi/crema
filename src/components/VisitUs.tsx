import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MapPin, Clock, Phone, ArrowUpRight } from 'lucide-react';

import cafeInterior1Img from '../assets/images/visit/cafe-interior-1.jpg';
import cafeInterior2Img from '../assets/images/visit/cafe-interior-2.jpg';
import cafeInterior3Img from '../assets/images/visit/cafe-interior-3.jpg';

export default function VisitUs() {
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useScrollReveal(textRef, { x: -40, opacity: 0 });
  useScrollReveal(imgRef, { x: 40, opacity: 0 });

  return (
    <section className="py-24 md:py-32 bg-cream-dark px-6 overflow-hidden relative" id="visit">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Editorial Info */}
        <div ref={textRef} className="lg:col-span-5">
          <span className="text-xs uppercase tracking-widest text-accent mb-3 font-semibold font-body block">Our Haven</span>
          <h2 className="font-display text-4xl md:text-5xl text-brown-900 mb-6 font-bold leading-tight">
            Visit Us Today & Experience Stillness
          </h2>
          <p className="text-brown-400 font-body leading-relaxed mb-8 text-base md:text-lg">
            Step into our warm sanctuary where every corner is designed to inspire tranquility. Whether you need a morning espresso rush or a leisurely afternoon corner for deep reading, your table is waiting.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <button className="bg-accent text-cream rounded-full px-8 py-3.5 font-semibold hover:bg-accent-dark transition-all duration-300 font-body flex items-center gap-2 shadow-lg shadow-accent/25 hover:scale-105">
              <MapPin size={18} /> GET DIRECTIONS
            </button>
            <a 
              href="#contact" 
              className="border border-brown-300 text-brown-900 rounded-full px-6 py-3.5 font-semibold hover:bg-brown-900 hover:text-cream transition-all duration-300 font-body flex items-center gap-2"
            >
              Reserve Table <ArrowUpRight size={18} />
            </a>
          </div>
          
          {/* Details list */}
          <div className="space-y-4 pt-6 border-t border-brown-200/60">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-white shadow-sm text-accent mt-0.5">
                <MapPin size={18} />
              </div>
              <div>
                <h5 className="font-bold text-brown-900 font-display text-base">Location</h5>
                <p className="text-brown-400 font-body text-sm">450 Artisan Boulevard, Downtown District, CB 1024</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-white shadow-sm text-accent mt-0.5">
                <Clock size={18} />
              </div>
              <div>
                <h5 className="font-bold text-brown-900 font-display text-base">Opening Hours</h5>
                <p className="text-brown-400 font-body text-sm">Mon–Fri: 7:00 AM – 9:00 PM • Sat–Sun: 8:00 AM – 10:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-white shadow-sm text-accent mt-0.5">
                <Phone size={18} />
              </div>
              <div>
                <h5 className="font-bold text-brown-900 font-display text-base">Contact & Inquiries</h5>
                <p className="text-brown-400 font-body text-sm">(555) 328-CREMA • hello@cremacoffee.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Gallery Collage */}
        <div ref={imgRef} className="lg:col-span-7 grid grid-cols-2 gap-4 h-[460px] md:h-[540px]">
          {/* Main big image */}
          <div className="col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-xl shadow-brown-900/10 relative h-[250px] md:h-[280px] group">
            <img
              src={cafeInterior1Img}
              alt="CREMA Main Café Space"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 via-transparent to-black/10" />
            <div className="absolute bottom-4 left-5 text-cream">
              <span className="text-[11px] uppercase tracking-widest text-accent font-semibold block">Main Hall</span>
              <h4 className="font-display font-bold text-xl md:text-2xl">Warm Timber & Sunlit Roastery</h4>
            </div>
          </div>
          
          {/* Sub image 1 */}
          <div className="col-span-1 rounded-3xl overflow-hidden shadow-xl shadow-brown-900/10 relative h-[190px] md:h-[240px] group">
            <img
              src={cafeInterior2Img}
              alt="Cozy Seating Corner"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-cream">
              <span className="text-[10px] uppercase tracking-widest text-accent font-semibold block">Sanctuary</span>
              <h5 className="font-display font-bold text-sm md:text-base">Cozy Library Nook</h5>
            </div>
          </div>
          
          {/* Sub image 2 */}
          <div className="col-span-1 rounded-3xl overflow-hidden shadow-xl shadow-brown-900/10 relative h-[190px] md:h-[240px] group">
            <img
              src={cafeInterior3Img}
              alt="Brew Bar"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-cream">
              <span className="text-[10px] uppercase tracking-widest text-accent font-semibold block">Pour-Over</span>
              <h5 className="font-display font-bold text-sm md:text-base">Artisanal Brew Bar</h5>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
