// src/components/Hero.tsx
import type { FC } from 'react'

const Hero: FC = () => {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#0f0d0b] px-6">
      <div className="max-w-5xl w-full mx-auto text-center space-y-10 md:space-y-12">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
          <span className="block">Creative Developer</span>
          <span className="block mt-2 text-amber-400/90">Building digital experiences</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
          I craft clean, performant, and thoughtful interfaces that help brands 
          <span className="text-white"> stand out</span> and users feel something.
        </p>

        {/* CTA Button */}
        <div className="pt-6">
          <button
            type="button"
            className="
              inline-flex items-center justify-center
              px-8 py-4 text-lg font-medium
              text-white bg-amber-600/90
              hover:bg-amber-600
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#0f0d0b]
              transition-colors duration-300
              rounded-full
              shadow-lg shadow-amber-900/30
              border border-amber-500/30
            "
          >
            View My Work
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
