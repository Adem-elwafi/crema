import type Lenis from 'lenis';

// Lenis options — tuned for editorial luxury feel.
// Centralized so every part of the app uses one consistent configuration.
export const lenisConfig = {
  duration: 1.2, // lerp duration in seconds (higher = more glide)
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo decay
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9, // slightly reduce sensitivity for premium feel
  touchMultiplier: 1.5, // keep touch/mobile responsive
  infinite: false,
} satisfies ConstructorParameters<typeof Lenis>[0];
