import { useState } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import HeroSlider from './components/HeroSlider'
import WhyChooseUs from './components/WhyChooseUs'
import MenuHighlights from './components/MenuHighlights'
import VisitUs from './components/VisitUs'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <div className="bg-cream text-brown-900 font-body overflow-x-hidden">
      {!preloaderComplete && <Preloader onComplete={() => setPreloaderComplete(true)} />}

      <Navbar />
      <HeroSlider />
      <WhyChooseUs />
      <MenuHighlights />
      <VisitUs />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default App