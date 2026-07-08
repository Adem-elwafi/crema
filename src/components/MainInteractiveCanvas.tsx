import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Hero from './hero';
import ProductGrid from './ProductGrid';
import BrewingRitual from './BrewingRitual';

gsap.registerPlugin(ScrollTrigger);

const MainInteractiveCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const ritualWrapperRef = useRef<HTMLDivElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = 120;

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preload = () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameIndex = String(i).padStart(3, '0');
        img.src = `/assets/sequence/cylinder_${frameIndex}.webp`;
        img.onload = () => {
          loaded++;
          setProgress(Math.round((loaded / totalFrames) * 100));
          if (loaded === totalFrames) {
            imagesRef.current = loadedImages;
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          console.error(`Failed to load cylinder_${frameIndex}.webp`);
          loaded++;
          if (loaded === totalFrames) {
            imagesRef.current = loadedImages;
            setImagesLoaded(true);
          }
        };
        loadedImages.push(img);
      }
    };

    preload();
  }, []);

  // Handle canvas drawing on resize & load
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || imagesRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to maintain aspect ratio (cover style)
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imagesLoaded) {
        drawFrame(0);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);

  // Initial frame draw
  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(0);
    }
  }, [imagesLoaded]);

  // GSAP ScrollTrigger timeline configuration
  useGSAP(() => {
    if (!imagesLoaded || !triggerRef.current || !containerRef.current) return;

    const playhead = { frame: 0 };

    // Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: containerRef.current,
        pinSpacing: true,
        invalidateOnRefresh: true,
      }
    });

    // Timeline A: Canvas Sequence
    // 0% -> 30% (frames 0 to 39)
    tl.to(playhead, {
      frame: 39,
      ease: 'none',
      duration: 30,
      onUpdate: () => drawFrame(Math.floor(playhead.frame)),
    }, 0);

    // 30% -> 70% (frames 40 to 89)
    tl.to(playhead, {
      frame: 89,
      ease: 'none',
      duration: 40,
      onUpdate: () => drawFrame(Math.floor(playhead.frame)),
    }, 30);

    // 70% -> 100% (frames 90 to 119)
    tl.to(playhead, {
      frame: 119,
      ease: 'none',
      duration: 30,
      onUpdate: () => drawFrame(Math.floor(playhead.frame)),
    }, 70);

    // Timeline B: Video Parallax (70% -> 100%)
    tl.to(videoRef.current, {
      yPercent: -12,
      ease: 'none',
      duration: 30,
    }, 70);

    // Timeline C: Foreground UI Animations
    // Hero Layout (0% -> 25%): Fade out and scale up
    tl.to(heroWrapperRef.current, {
      opacity: 0,
      scale: 1.12,
      ease: 'power1.inOut',
      duration: 25,
    }, 0);

    // Collections Grid (35% -> 65%): Slide up and fade in
    tl.fromTo(gridWrapperRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 30,
      },
      35
    );

    // Collections Grid fade out (65% -> 70%) to clear the canvas cutout
    tl.to(gridWrapperRef.current, {
      opacity: 0,
      y: -60,
      ease: 'power2.in',
      duration: 5,
    }, 65);

    // Brewing Ritual (72% -> 97%): Fade in and slide up
    tl.fromTo(ritualWrapperRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 25,
      },
      72
    );

  }, { dependencies: [imagesLoaded], scope: triggerRef });

  return (
    <div ref={triggerRef} className="relative w-full h-[400vh]">
      {/* Loading Overlay */}
      {!imagesLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0d0b] text-white">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            CREMA / NOIR
          </div>
          <div className="w-48 h-px bg-white/10 overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-xs font-light text-neutral-500">
            LOADING EXPERIENCE {progress}%
          </div>
        </div>
      )}

      {/* Pinned Viewport Container */}
      <div ref={containerRef} className="w-full h-screen overflow-hidden">
        {/* Layer 10 (Base): Background Video */}
        <div className="absolute inset-0 z-10 pointer-events-none w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            src="/assets/crema-core.mp4"
            className="w-full h-[120%] object-cover absolute top-0 left-0"
            loop
            muted
            playsInline
            autoPlay
          />
        </div>

        {/* Layer 20 (Middle): Canvas Sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-20 pointer-events-none w-full h-full object-cover"
        />

        {/* Layer 30 (Top): Foreground overlays */}
        <div className="absolute inset-0 z-30 w-full h-full pointer-events-none">
          {/* Hero Section Container */}
          <div 
            ref={heroWrapperRef} 
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto"
          >
            <Hero />
          </div>

          {/* Collections Grid Section Container */}
          <div 
            ref={gridWrapperRef} 
            className="absolute inset-0 w-full h-full flex items-center justify-center overflow-y-auto"
            style={{ opacity: 0 }}
          >
            <div className="w-full max-w-6xl px-6 pointer-events-auto">
              <ProductGrid />
            </div>
          </div>

          {/* Brewing Ritual Section Container */}
          <div 
            ref={ritualWrapperRef} 
            className="absolute inset-0 w-full h-full flex items-center justify-center overflow-y-auto"
            style={{ opacity: 0 }}
          >
            <div className="w-full max-w-6xl px-6 pointer-events-auto">
              <BrewingRitual />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInteractiveCanvas;
