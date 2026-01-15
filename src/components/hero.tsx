// src/components/Hero.tsx
import { motion } from 'framer-motion'
import type { FC } from 'react'

// Simple fade + gentle slide up animation variants
const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1], // smooth, premium cubic-bezier
    }
  }
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,     // gentle staggering between elements
      delayChildren: 0.2,        // slight initial delay before first element
    }
  }
}

const Hero: FC = () => {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#0f0d0b] px-6">
      <motion.div
        className="max-w-5xl w-full mx-auto text-center space-y-10 md:space-y-12"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
        >
          <span className="block">Creative Developer</span>
          <span className="block mt-2 text-amber-400/90">Building digital experiences</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
        >
          I craft clean, performant, and thoughtful interfaces that help brands 
          <span className="text-white"> stand out</span> and users feel something.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={fadeInUp}
          className="pt-6"
        >
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
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero