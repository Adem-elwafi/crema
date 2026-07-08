import './index.css'
import MainInteractiveCanvas from './components/MainInteractiveCanvas'
import Hero from './components/hero'
import ProductGrid from './components/ProductGrid'
import BrewingRitual from './components/BrewingRitual'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'

function App() {
  return (
    <div className="w-full bg-[#0f0d0b] text-white relative">
      {/* Fixed Background Layers (z-index 10 & 20) */}
      <MainInteractiveCanvas />

      {/* Foreground Scroll Flow (z-index 30) */}
      <PageTransition>
        <div className="relative">
          <div id="scroll-experience" className="relative z-30">
            <Hero />
            <ProductGrid />
            <BrewingRitual />
          </div>

          <PageTransition key="philosophy" className="mb-0 relative z-30">
            <Philosophy />
          </PageTransition>

          <PageTransition key="footer" className="relative z-30">
            <Footer />
          </PageTransition>
        </div>
      </PageTransition>
    </div>
  )
}

export default App