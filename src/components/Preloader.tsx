import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Import the actual transparent cutout PNGs used in the Hero section
import beansGroupImg from '../assets/images/hero/flying-coffee-beans.png';
import beanSingleImg from '../assets/images/hero/single-coffee-bean.png';
import cinnamonImg from '../assets/images/hero/cinnamon-sticks.png';
import splashImg from '../assets/images/hero/cream-splash.png';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useGSAP(() => {
    // Initial hidden states for logo and ingredients
    gsap.set('.logo-text', { opacity: 0, scale: 0.8 });
    gsap.set('.logo-subtext', { opacity: 0, y: 20 });
    gsap.set('.ingredient', { opacity: 0, scale: 0.5 });
    
    // Set rings to viewport max sizes but scale 0 initially
    gsap.set('.ring', { width: '150vmax', height: '150vmax', scale: 0 });
    
    // On page load, the FIRST thing they see is just the tiny dot resting in the center
    gsap.set('.ring-4', { scale: 0.02 }); 

    const tl = gsap.timeline({
      onComplete: () => {
         onComplete();
      }
    });

    // 0.5s - The dot gets bigger, and the other circles come from it
    tl.to('.ring-4', { scale: 1, duration: 1.4, ease: 'expo.inOut' }, 0.5);
    tl.to('.ring-3', { scale: 1, duration: 1.4, ease: 'expo.inOut' }, 0.65);
    tl.to('.ring-2', { scale: 1, duration: 1.4, ease: 'expo.inOut' }, 0.8);
    tl.to('.ring-1', { scale: 1, duration: 1.4, ease: 'expo.inOut' }, 0.95);

    // 1.5s - Logo Emerges smoothly
    tl.to('.logo-text', {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'expo.out'
    }, 1.5);
    
    tl.to('.logo-subtext', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'expo.out'
    }, 1.6);

    // 1.5s - Photorealistic Cutouts Burst In Radially
    tl.fromTo('.ing-1', { x: -20, y: -20 }, { opacity: 1, scale: 1, x: -160, y: -140, rotation: -15, duration: 1.4, ease: 'expo.out' }, 1.55);
    tl.fromTo('.ing-2', { x: 20, y: -20 }, { opacity: 1, scale: 1, x: 180, y: -120, rotation: 20, duration: 1.4, ease: 'expo.out' }, 1.6);
    tl.fromTo('.ing-3', { x: 20, y: 20 }, { opacity: 1, scale: 1, x: 160, y: 160, rotation: -12, duration: 1.4, ease: 'expo.out' }, 1.65);
    tl.fromTo('.ing-4', { x: -20, y: 20 }, { opacity: 1, scale: 1, x: -180, y: 140, rotation: 10, duration: 1.4, ease: 'expo.out' }, 1.7);

    // 2.0s - Continuous Subtle Float
    tl.to('.ingredient', {
      y: '+=35',
      rotation: '+=8',
      duration: 2.5,
      ease: 'sine.inOut',
      stagger: 0.15,
      yoyo: true,
      repeat: 1
    }, 2.0);

    // 4.0s - Exit Choreo & Layout Transition
    tl.to('.ing-1', { x: -400, y: -400, opacity: 0, scale: 0.5, duration: 1.0, ease: 'power3.inOut' }, 4.0);
    tl.to('.ing-2', { x: 400, y: -400, opacity: 0, scale: 0.5, duration: 1.0, ease: 'power3.inOut' }, 4.0);
    tl.to('.ing-3', { x: 400, y: 400, opacity: 0, scale: 0.5, duration: 1.0, ease: 'power3.inOut' }, 4.0);
    tl.to('.ing-4', { x: -400, y: 400, opacity: 0, scale: 0.5, duration: 1.0, ease: 'power3.inOut' }, 4.0);

    // Subtext fades out instantly
    tl.to('.logo-subtext', {
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: 'power3.inOut'
    }, 4.0);

    // Logo translates continuously across the screen to top-left slot
    tl.to('.logo-text', {
      x: () => {
        const navRect = document.querySelector('header nav .font-display')?.getBoundingClientRect();
        const pRect = document.querySelector('.logo-text')?.getBoundingClientRect();
        if (navRect && pRect) {
           return navRect.left + navRect.width/2 - (pRect.left + pRect.width/2);
        }
        return -(window.innerWidth / 2) + 80;
      },
      y: () => {
        const navRect = document.querySelector('header nav .font-display')?.getBoundingClientRect();
        const pRect = document.querySelector('.logo-text')?.getBoundingClientRect();
        if (navRect && pRect) {
           return navRect.top + navRect.height/2 - (pRect.top + pRect.height/2);
        }
        return -(window.innerHeight / 2) + 40;
      },
      scale: () => {
        const navRect = document.querySelector('header nav .font-display')?.getBoundingClientRect();
        const pRect = document.querySelector('.logo-text')?.getBoundingClientRect();
        if (navRect && pRect) return navRect.width / pRect.width;
        return 0.2;
      },
      color: '#C8956C', // Transition to text-accent
      duration: 1.2,
      ease: 'expo.inOut'
    }, 4.0);

    // 4.0s - Crossfade the background & rings to reveal the HeroSlider underneath seamlessly
    tl.to('.preloader-bg-elements', {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut'
    }, 4.0);

    // 5.2s - Container finally unmounts after the logo translation is fully complete
    tl.to(container.current, {
      opacity: 0,
      duration: 0.1
    }, 5.2);

  }, { scope: container });

  // Use the native floating ingredient cutouts from the hero section!
  const ingredients = [
    { class: 'ing-1', src: splashImg, alt: 'Cream Splash' },
    { class: 'ing-2', src: beansGroupImg, alt: 'Flying Coffee Beans' },
    { class: 'ing-3', src: cinnamonImg, alt: 'Cinnamon Sticks' },
    { class: 'ing-4', src: beanSingleImg, alt: 'Single Coffee Bean' } 
  ];

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Background Elements Wrapper (Faded out early to reveal app seamlessly) */}
      <div className="preloader-bg-elements absolute inset-0 w-full h-full">
        {/* Base dark canvas */}
        <div className="absolute inset-0 bg-brown-900"></div>
        
        {/* Background Rings - Expand outward from a tiny dot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="ring ring-4 absolute rounded-full bg-cream-dark"></div>
          <div className="ring ring-3 absolute rounded-full bg-accent"></div>
          <div className="ring ring-2 absolute rounded-full bg-brown-800"></div>
          <div className="ring ring-1 absolute rounded-full bg-brown-900"></div>
        </div>
      </div>

      {/* Floating Transparent Cutouts */}
      <div className="ingredients-container absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        {ingredients.map((ing, i) => (
          <div 
            key={i} 
            className={`ingredient ${ing.class} absolute w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl`}
          >
            <img src={ing.src} alt={ing.alt} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Central Logo */}
      <div className="logo-container absolute z-20 flex flex-col items-center justify-center pointer-events-none origin-center">
        <h1 className="logo-text font-display text-7xl md:text-9xl text-cream font-bold tracking-[0.1em] m-0 leading-none">
          CREMA
        </h1>
        <p className="logo-subtext font-body text-accent tracking-[0.4em] uppercase text-xs md:text-sm mt-6 font-medium">
          Premium Coffee Roasters
        </p>
      </div>
    </div>
  );
}
