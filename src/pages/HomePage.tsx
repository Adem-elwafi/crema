import { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import LenisProvider from '../context/LenisProvider';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import CinematicManifesto from '../components/CinematicManifesto';
import TactileMenu from '../components/TactileMenu';
import EditorialStory from '../components/EditorialStory';

const VisitUs = lazy(() => import('../components/VisitUs'));
const Newsletter = lazy(() => import('../components/Newsletter'));
const Footer = lazy(() => import('../components/Footer'));

function LazyContentReady({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // Immediate and staggered refresh to catch post-render reflows
    const t1 = setTimeout(refresh, 50);
    const t2 = setTimeout(refresh, 300);

    // Watch for image loads and layout resizes within the lazy subtree
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver?.disconnect();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

export default function HomePage() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  return (
    <LenisProvider paused={!isPreloaderComplete}>
      <div className="bg-[#0E0805] text-[#FDF8F3] font-body overflow-x-clip">
        {!isPreloaderComplete && (
          <Preloader
            onComplete={() => {
              setIsPreloaderComplete(true);
              setTimeout(() => ScrollTrigger.refresh(), 200);
            }}
          />
        )}

        <Navbar />

        {/* ─── Unified Dark Canvas ─────────────────────────────────────────────
            All three dark editorial sections (Manifesto → Extractions → Journey)
            share one continuous bg-[#0E0805] ground plane and a single radial
            glow overlay so glows bleed across section boundaries seamlessly.   */}
        <div className="relative w-full bg-[#0E0805]">
          {/* Hero + Manifesto: Hero is sticky; Manifesto ascends and curtains over it */}
          <div className="relative z-10 w-full">
            <div className="sticky top-0 z-0 h-dvh w-full overflow-hidden">
              <HeroSlider isPaused={!isPreloaderComplete} />
            </div>
            <div className="relative z-10">
              <CinematicManifesto />
            </div>
          </div>

          {/* TactileMenu + EditorialStory: downstream dark sections */}
          <div className="relative z-10">
            <TactileMenu />
            <EditorialStory />
          </div>
        </div>

        {/* ─── Downstream light sections ──────────────────────────────────────── */}
        <Suspense fallback={null}>
          <LazyContentReady>
            <VisitUs />
            <Newsletter />
            <Footer />
          </LazyContentReady>
        </Suspense>
      </div>
    </LenisProvider>
  );
}