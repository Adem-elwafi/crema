import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once here — import from this file everywhere instead of registering per-component.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
