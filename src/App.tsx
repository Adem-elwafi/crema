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
      <div className="bg-brown-900 text-brown-900 font-body overflow-x-clip">
        {!isPreloaderComplete && <Preloader onComplete={() => {
          setIsPreloaderComplete(true);
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }} />}

        <Navbar />

        {/* Hero + Manifesto Stage: Hero is ONLY sticky while Manifesto ascends over it */}
        <div className="relative w-full">
          <div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
            <HeroSlider isPaused={!isPreloaderComplete} />
          </div>
          <div className="relative z-10">
            <Suspense fallback={null}>
              <CinematicManifesto />
            </Suspense>
          </div>
        </div>

        {/* Downstream Sections — completely independent, Hero can never leak here */}
        <Suspense fallback={null}>
          <LazyContentReady>
            <TactileMenu />
            <EditorialStory />
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