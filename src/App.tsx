import './index.css'
import MainInteractiveCanvas from './components/MainInteractiveCanvas'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'

function App() {
  return (
    <div className="w-full bg-[#0f0d0b] text-white">
      <PageTransition>
        <div className="space-y-0">
          <MainInteractiveCanvas />

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