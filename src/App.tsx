import './index.css'
import Hero from './components/hero'
import ProductGrid from './components/ProductGrid'
import BrewingRitual from './components/BrewingRitual'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'

function App() {
  return (
    <div className="w-full bg-[#0f0d0b] text-white">
      <PageTransition>
        <div className="space-y-0">
          <PageTransition key="hero" className="mb-0">
            <Hero />
          </PageTransition>

          <PageTransition key="collections" className="mb-0">
            <ProductGrid />
          </PageTransition>

          <PageTransition key="ritual" className="mb-0">
            <BrewingRitual />
          </PageTransition>

          <PageTransition key="philosophy" className="mb-0">
            <Philosophy />
          </PageTransition>

          <PageTransition key="footer">
            <Footer />
          </PageTransition>
        </div>
      </PageTransition>
    </div>
  )
}

export default App