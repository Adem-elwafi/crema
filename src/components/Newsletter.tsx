import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { y: 20, opacity: 0 });

  return (
    <section ref={sectionRef} className="py-16 bg-accent px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl text-cream mb-4 font-bold">
          Stay in the Loop
        </h2>
        <p className="text-cream/80 font-body mb-8">
          Subscribe for the latest coffee tips, exclusive offers, and new menu updates.
        </p>
        
        <form className="flex flex-col sm:flex-row max-w-md mx-auto mb-10 shadow-lg shadow-brown-900/10 rounded-full" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-grow rounded-t-full sm:rounded-tr-none sm:rounded-l-full px-6 py-3 bg-white/20 text-cream placeholder-cream/60 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-body"
            required
          />
          <button 
            type="submit" 
            className="bg-cream text-brown-900 rounded-b-full sm:rounded-bl-none sm:rounded-r-full px-8 py-3 font-semibold hover:bg-white transition-colors duration-300 font-body sm:w-auto w-full"
          >
            SUBSCRIBE
          </button>
        </form>

        <div className="flex justify-center items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center text-cream hover:bg-cream/40 transition-colors duration-300">
            <Instagram size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center text-cream hover:bg-cream/40 transition-colors duration-300">
            <Facebook size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center text-cream hover:bg-cream/40 transition-colors duration-300">
            <Twitter size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center text-cream hover:bg-cream/40 transition-colors duration-300">
            <Youtube size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
