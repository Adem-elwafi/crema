import { useState, lazy, Suspense, useEffect } from 'react'
import { ScrollTrigger } from './lib/gsap';
import { LenisProvider } from './context/LenisProvider'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import HeroSlider from './components/HeroSlider'

const CinematicManifesto = lazy(() => import('./components/CinematicManifesto'));
const TactileMenu = lazy(() => import('./components/TactileMenu'));
const EditorialStory = lazy(() => import('./components/EditorialStory'));
const VisitUs = lazy(() => import('./components/VisitUs'));
const Newsletter = lazy(() => import('./components/Newsletter'));
const Footer = lazy(() => import('./components/Footer'));

function LazyContentReady({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(t);
  }, []);
  return <>{children}</>;
}

function App() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  return (
    <LenisProvider paused={!isPreloaderComplete}>
      <div className="bg-[#0E0805] text-[#FDF8F3] font-body overflow-x-clip">
        {!isPreloaderComplete && <Preloader onComplete={() => {
          setIsPreloaderComplete(true);
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }} />}

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
              <Suspense fallback={null}>
                <CinematicManifesto />
              </Suspense>
            </div>
          </div>

          {/* TactileMenu + EditorialStory: downstream dark sections */}
          <div className="relative z-10">
            <Suspense fallback={null}>
              <LazyContentReady>
                <TactileMenu />
                <EditorialStory />
              </LazyContentReady>
            </Suspense>
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
  )
}

export default App