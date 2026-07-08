import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const MainInteractiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = 120;

  const targetFrame = useRef({ val: 0 });
  const currentFrameRef = useRef(0);

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

  // Handle canvas drawing with backing store resolution scaling
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || imagesRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img) return;

    // Cap the device pixel ratio multiplier to prevent GPU over-allocation (Fix Pixelation)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Ensure the 2D context scales appropriately
    ctx.scale(dpr, dpr);

    // Clean seamless image-fit drawing (Object-Fit: Cover with Max-Scale Bounding)
    let ratio = Math.max(canvas.clientWidth / img.width, canvas.clientHeight / img.height);
    
    // Zoom out slightly on screens wider than 1440px to create elegant framing space
    if (window.innerWidth > 1440) {
      ratio = ratio * 0.82;
    }

    const centerShiftX = (canvas.clientWidth - img.width * ratio) / 2;
    const centerShiftY = (canvas.clientHeight - img.height * ratio) / 2;
    
    ctx.drawImage(
      img, 
      0, 
      0, 
      img.width, 
      img.height, 
      centerShiftX, 
      centerShiftY, 
      img.width * ratio, 
      img.height * ratio
    );

    ctx.restore();
  };

  // Continuous independent requestAnimationFrame rendering loop with weighted inertia
  useEffect(() => {
    if (!imagesLoaded) return;

    let animationId: number;
    const render = () => {
      // Smoothly lerp towards target frame value with a 0.09 weighted inertia multiplier
      const diff = targetFrame.current.val - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.09;
      } else {
        currentFrameRef.current = targetFrame.current.val;
      }

      // Draw the image corresponding to Math.round(currentFrame)
      drawFrame(Math.round(currentFrameRef.current));

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [imagesLoaded]);

  // Initial draw and window resizing support
  useEffect(() => {
    const handleResize = () => {
      if (imagesLoaded) {
        drawFrame(Math.round(currentFrameRef.current));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);

  // GSAP ScrollTrigger timeline configuration
  useGSAP(() => {
    if (!imagesLoaded) return;

    // Master Timeline bound to #scroll-experience
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-experience',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });

    // Timeline A: Canvas Sequence (tween the targetFrame val)
    // 0% -> 30% (frames 0 to 39)
    tl.to(targetFrame.current, {
      val: 39,
      ease: 'none',
      duration: 30,
    }, 0);

    // 30% -> 70% (frames 40 to 89)
    tl.to(targetFrame.current, {
      val: 89,
      ease: 'none',
      duration: 40,
    }, 30);

    // 70% -> 100% (frames 90 to 119)
    tl.to(targetFrame.current, {
      val: 119,
      ease: 'none',
      duration: 30,
    }, 70);

    // Timeline B: Video Parallax (70% -> 100%)
    tl.to(videoRef.current, {
      yPercent: -12,
      ease: 'none',
      duration: 30,
    }, 70);

  }, { dependencies: [imagesLoaded] });

  return (
    <div className="absolute inset-0 pointer-events-none">
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

      {/* Layer 10 (Base): Background Video */}
      <div className="fixed inset-0 z-10 pointer-events-none w-full h-full overflow-hidden">
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
        className="fixed inset-0 z-20 pointer-events-none w-full h-full"
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
};

export default MainInteractiveCanvas;
