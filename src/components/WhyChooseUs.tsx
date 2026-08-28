import { useRef } from 'react';
import { Coffee, Leaf, Heart, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

import qualityCoffeeImg from '../assets/images/features/quality-coffee.jpg';
import freshDeliciousImg from '../assets/images/features/fresh-delicious.jpg';
import cozyAtmosphereImg from '../assets/images/features/cozy-atmosphere.jpg';

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef, { y: 30, opacity: 0 });
  useScrollReveal(cardsRef, { y: 40, opacity: 0, stagger: 0.2, childSelector: '.feature-card' });

  const features = [
    {
      title: 'Quality Coffee',
      subtitle: 'Artisanal Roasts',
      description: 'We source exclusively single-origin, shade-grown Arabica beans from ethical, sustainable micro-farms worldwide.',
      icon: <Coffee className="text-cream" size={20} />,
      image: qualityCoffeeImg,
      badge: 'Single Origin'
    },
    {
      title: 'Fresh & Delicious',
      subtitle: 'Daily Bakery',
      description: 'Handcrafted pastries and gourmet bites baked fresh every dawn using pure butter and organic local ingredients.',
      icon: <Leaf className="text-cream" size={20} />,
      image: freshDeliciousImg,
      badge: 'Organic'
    },
    {
      title: 'Cozy Atmosphere',
      subtitle: 'Mindful Spaces',
      description: 'Designed as an acoustic and aesthetic sanctuary for deep work, warm conversations, and unhurried coffee rituals.',
      icon: <Heart className="text-cream" size={20} />,
      image: cozyAtmosphereImg,
      badge: 'Sanctuary'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-cream-dark px-6 relative overflow-hidden" id="about">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brown-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold font-body">The Crema Experience</span>
          <h2 className="font-display text-4xl md:text-5xl text-brown-900 mt-2 mb-4 font-bold">Why Choose Us</h2>
          <p className="text-brown-400 font-body max-w-xl mx-auto text-base md:text-lg">
            Experience the harmonious union of uncompromising craft, warm hospitality, and pure flavor.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card rounded-3xl bg-white/80 backdrop-blur-md border border-brown-100/40 p-6 shadow-[0_8px_30px_-12px_rgba(44,24,16,0.12)] group hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between hover:shadow-[0_20px_50px_-18px_rgba(44,24,16,0.22)]"
            >
              <div>
                {/* Image Container with zoom effect */}
                <div className="mb-6 w-full h-56 rounded-2xl overflow-hidden relative shadow-inner">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-black/10" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-brown-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {feature.badge}
                  </div>

                  {/* Icon Circle */}
                  <div className="absolute bottom-3 right-3 bg-accent p-2.5 rounded-full shadow-md text-cream group-hover:rotate-12 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-accent mb-1 block">
                  {feature.subtitle}
                </span>
                <h3 className="font-display text-2xl text-brown-900 mb-3 font-bold">
                  {feature.title}
                </h3>
                <p className="text-brown-400 font-body mb-6 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>

              <a
                href="#menu"
                className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:text-accent-dark transition-colors group-hover:gap-3 duration-300 pt-4 border-t border-brown-100/40 tracking-wide"
              >
                DISCOVER MORE <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
