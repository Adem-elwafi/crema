import { useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useGSAP } from '@gsap/react';

// Import the actual transparent cutout WebP assets used in the Hero section
import beansGroupImg from '../assets/images/hero/flying-coffee-beans.webp';
import beanSingleImg from '../assets/images/hero/single-coffee-bean.webp';
import cinnamonImg from '../assets/images/hero/cinnamon-sticks.webp';
import splashImg from '../assets/images/hero/cream-splash.webp';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

      // Initial hidden states for logo and ingredients
      gsap.set('.logo-text', { opacity: 0, scale: 0.8 });
      gsap.set('.logo-subtext', { opacity: 0, y: 20 });
      gsap.set('.ingredient', { opacity: 0, scale: 0.5 });
      
      // Set rings to viewport max sizes but scale 0 initially
      gsap.set('.ring', { width: '150vmax', height: '150vmax', scale: 0 });
      
      // On page load, the FIRST thing they see is just the tiny dot resting in the center
      gsap.set('.ring-4', { scale: 0.02 }); 

      const tl = gsap.timeline();

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

      // Responsive coordinates:
      // Mobile (<768px): coordinates stay within mobile half-width (180px–215px)
      // Desktop (>=768px): cinematic expansive burst and floating layout
      const config = isMobile
        ? {
            ing1: { burstX: -115, burstY: -125, rot: -15, exitX: -260, exitY: -280 },
            ing2: { burstX: 120, burstY: -120, rot: 18, exitX: 260, exitY: -280 },
            ing3: { burstX: 115, burstY: 125, rot: -12, exitX: 260, exitY: 280 },
            ing4: { burstX: -120, burstY: 120, rot: 10, exitX: -260, exitY: 280 },
            floatY: '+=10',
            floatRot: '+=4',
          }
        : {
            ing1: { burstX: -260, burstY: -180, rot: -15, exitX: -500, exitY: -450 },
            ing2: { burstX: 270, burstY: -170, rot: 20, exitX: 500, exitY: -450 },
            ing3: { burstX: 250, burstY: 190, rot: -12, exitX: 500, exitY: 450 },
            ing4: { burstX: -260, burstY: 180, rot: 10, exitX: -500, exitY: 450 },
            floatY: '+=20',
            floatRot: '+=6',
          };

      // 1.5s - Photorealistic Cutouts Burst In Radially
      tl.fromTo('.ing-1', { x: -20, y: -20 }, { opacity: 1, scale: 1, x: config.ing1.burstX, y: config.ing1.burstY, rotation: config.ing1.rot, duration: 1.4, ease: 'expo.out' }, 1.55);
      tl.fromTo('.ing-2', { x: 20, y: -20 }, { opacity: 1, scale: 1, x: config.ing2.burstX, y: config.ing2.burstY, rotation: config.ing2.rot, duration: 1.4, ease: 'expo.out' }, 1.6);
      tl.fromTo('.ing-3', { x: 20, y: 20 }, { opacity: 1, scale: 1, x: config.ing3.burstX, y: config.ing3.burstY, rotation: config.ing3.rot, duration: 1.4, ease: 'expo.out' }, 1.65);
      tl.fromTo('.ing-4', { x: -20, y: 20 }, { opacity: 1, scale: 1, x: config.ing4.burstX, y: config.ing4.burstY, rotation: config.ing4.rot, duration: 1.4, ease: 'expo.out' }, 1.7);

      // 2.0s - Continuous Subtle Float
      tl.to('.ingredient', {
        y: config.floatY,
        rotation: config.floatRot,
        duration: 2.5,
        ease: 'sine.inOut',
        stagger: 0.15,
        yoyo: true,
        repeat: 1
      }, 2.0);

      // 3.8s - Exit Choreo & Layout Transition
      tl.to('.ing-1', { x: config.ing1.exitX, y: config.ing1.exitY, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);
      tl.to('.ing-2', { x: config.ing2.exitX, y: config.ing2.exitY, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);
      tl.to('.ing-3', { x: config.ing3.exitX, y: config.ing3.exitY, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);
      tl.to('.ing-4', { x: config.ing4.exitX, y: config.ing4.exitY, opacity: 0, scale: 0.4, duration: 0.8, ease: 'power3.inOut' }, 3.8);

      // Subtext fades out
      tl.to('.logo-subtext', {
        opacity: 0,
        y: -15,
        duration: 0.6,
        ease: 'power3.inOut'
      }, 3.8);

      // Logo smoothly fades up
      tl.to('.logo-text', {
        opacity: 0,
        y: -40,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.inOut'
      }, 3.8);

      // Crossfade the entire background & rings
      tl.to('.preloader-bg-elements', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 4.0);

      // Ensure container is hidden right as visual fade completes 
      tl.to(container.current, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }
      }, 4.8);
    });

    return () => mm.revert();
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
            className={`ingredient ${ing.class} absolute w-14 h-14 sm:w-20 sm:h-20 md:w-36 md:h-36 drop-shadow-2xl`}
          >
            <img src={ing.src} alt={ing.alt} width={100} height={100} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Central Logo */}
      <div className="logo-container absolute z-20 flex flex-col items-center justify-center pointer-events-none origin-center text-center px-4">
        <h1 className="logo-text font-display text-5xl sm:text-7xl md:text-9xl text-cream font-bold tracking-wider m-0 leading-none">
          CREMA
        </h1>
        <p className="logo-subtext font-body text-accent tracking-[0.25em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs md:text-sm mt-4 sm:mt-6 font-medium whitespace-nowrap">
          Premium Coffee Roasters
        </p>
      </div>
    </div>
  );
}
