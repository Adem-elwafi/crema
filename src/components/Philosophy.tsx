import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from 'react';

const Philosophy = () => {
  const philosophyRef = useRef(null);
  const isInView = useInView(philosophyRef, { once: true, amount: 0.2 });

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smoother motion
      }
    }
  };

  return (
    <section 
      ref={philosophyRef}
      className="pt-16 pb-24 md:pt-20 md:pb-32 px-6 md:px-12 flex items-center justify-center"
    >
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Tagline Bridge */}
        <motion.div
          variants={childVariants}
          className="mb-10 md:mb-12"
        >
          <p className="text-sm md:text-base text-neutral-400 italic tracking-wide">
            More than coffee, it's a ritual.
          </p>
        </motion.div>

        <motion.h2
          variants={childVariants}
          className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-white mb-8"
        >
          Our Philosophy
        </motion.h2>
        <motion.p
          variants={childVariants}
          className="text-lg md:text-xl text-gray-300 leading-relaxed md:leading-loose"
        >
          In a world of constant noise, we believe in the calm ritual of preparation, 
          the quiet focus of craftsmanship, and the mindful enjoyment of what is truly 
          essential. Each roast is a return to purity—a deliberate, unhurried process 
          that honors the bean's deepest character.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Philosophy;