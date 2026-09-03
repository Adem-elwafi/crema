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
    // Lock scroll natively
    document.body.style.overflow = 'hidden';
    
    // Also explicitly target html for mobile browsers
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Unlock scroll immediately when preloader unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
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

    // 1.5s - Photorealistic Cutouts Burst In Radially (further from the central logo for clean breathing room)
    tl.fromTo('.ing-1', { x: -30, y: -30 }, { opacity: 1, scale: 1, x: -260, y: -180, rotation: -15, duration: 1.4, ease: 'expo.out' }, 1.55);
    tl.fromTo('.ing-2', { x: 30, y: -30 }, { opacity: 1, scale: 1, x: 270, y: -170, rotation: 20, duration: 1.4, ease: 'expo.out' }, 1.6);
    tl.fromTo('.ing-3', { x: 30, y: 30 }, { opacity: 1, scale: 1, x: 250, y: 190, rotation: -12, duration: 1.4, ease: 'expo.out' }, 1.65);
    tl.fromTo('.ing-4', { x: -30, y: 30 }, { opacity: 1, scale: 1, x: -260, y: 180, rotation: 10, duration: 1.4, ease: 'expo.out' }, 1.7);

    // 2.0s - Continuous Subtle Float
    tl.to('.ingredient', {
      y: '+=20',
      rotation: '+=6',
      duration: 2.5,
      ease: 'sine.inOut',
      stagger: 0.15,
      yoyo: true,
      repeat: 1
    }, 2.0);

    // 4.0s - Exit Choreo & Layout Transition
    tl.to('.ing-1', { x: -500, y: -450, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);
    tl.to('.ing-2', { x: 500, y: -450, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);
    tl.to('.ing-3', { x: 500, y: 450, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);
    tl.to('.ing-4', { x: -500, y: 450, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);

    // Subtext fades out
    tl.to('.logo-subtext', {
      opacity: 0,
      y: -15,
      duration: 0.6,
      ease: 'power3.inOut'
    }, 3.8);

    // FIX: Logo just smoothly fades up instead of translating into the navbar slot
    tl.to('.logo-text', {
      opacity: 0,
      y: -40,
      scale: 0.95,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 3.8);

    // Crossfade the entire background & rings to reveal the HeroSlider underneath seamlessly
    tl.to('.preloader-bg-elements', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 4.0);

    // Ensure container is hidden right as visual fade completes 
    // to instantly unmount and release Lenis scroll locks without any lagging delay.
    tl.to(container.current, {
      opacity: 0,
      duration: 0.1
    }, 4.8);

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
            className={`ingredient ${ing.class} absolute w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 drop-shadow-2xl`}
          >
            <img src={ing.src} alt={ing.alt} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Central Logo */}
      <div className="logo-container absolute z-20 flex flex-col items-center justify-center pointer-events-none origin-center">
        <h1 className="logo-text font-display text-7xl md:text-9xl text-cream font-bold tracking-wider m-0 leading-none">
          CREMA
        </h1>
        <p className="logo-subtext font-body text-accent tracking-[0.4em] uppercase text-xs md:text-sm mt-6 font-medium">
          Premium Coffee Roasters
        </p>
      </div>
    </div>
  );
}
