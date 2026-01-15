import './index.css'
import Hero from './components/hero'
import Philosophy from './components/Philosophy'
import Divider from './components/Divider'

function App() {
  return (
    <div className="w-full bg-[#0f0d0b]">
      <Hero />
      <Divider />
      <Philosophy />
    </div>
  )
}

export default App