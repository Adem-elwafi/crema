import { useState, lazy, Suspense } from 'react'
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

function App() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  return (
    <LenisProvider paused={!isPreloaderComplete}>
      <div className="bg-cream text-brown-900 font-body overflow-x-hidden">
        {!isPreloaderComplete && <Preloader onComplete={() => setIsPreloaderComplete(true)} />}

        <Navbar />
        <HeroSlider isPaused={!isPreloaderComplete} />
        <Suspense fallback={null}>
          <CinematicManifesto />
          <TactileMenu />
          <EditorialStory />
          <VisitUs />
          <Newsletter />
          <Footer />
        </Suspense>
      </div>
    </LenisProvider>
  )
}

export default App