import './index.css'
import Hero from './components/hero'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'

function App() {
  return (
    <div className="w-full bg-[#0f0d0b]">
      <Hero />
      <Philosophy />
      <Footer/>
    </div>
  )
}

export default App