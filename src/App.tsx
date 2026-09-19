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

        {/* Hero + Manifesto Stage: Hero is ONLY sticky while Manifesto ascends over it */}
        <div className="relative w-full">
          <div className="sticky top-0 z-0 h-dvh w-full overflow-hidden">
            <HeroSlider isPaused={!isPreloaderComplete} />
          </div>
          <div className="relative z-10">
            <Suspense fallback={null}>
              <CinematicManifesto />
            </Suspense>
          </div>
        </div>

        {/* ─── Unified Dark Canvas ───────────────────────────────────────────
            TactileMenu and EditorialStory share one continuous dark wrapper so
            their radial glows bleed through section boundaries without any
            visible seam or clip edge.                                          */}
        <section className="relative w-full bg-[#0E0805] overflow-x-clip">
          {/* Single shared atmospheric radial glow — replaces per-section inline backgrounds */}
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_20%,#1A100B_0%,#0E0805_70%)]"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <Suspense fallback={null}>
              <LazyContentReady>
                <TactileMenu />
                <EditorialStory />
              </LazyContentReady>
            </Suspense>
          </div>
        </section>

        {/* ─── Downstream light sections ────────────────────────────────────── */}
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