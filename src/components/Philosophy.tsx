import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from 'react';

const Philosophy = () => {
  const philosophyRef = useRef(null);
  const isInView = useInView(philosophyRef, { once: true, amount: 0.3 });

  return (
    <section 
      ref={philosophyRef}
      className="pt-16 pb-24 md:pt-20 md:pb-32 px-6 md:px-12 flex items-center justify-center"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Tagline Bridge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
          className="mb-10 md:mb-12"
        >
          <p className="text-sm md:text-base text-neutral-400 italic tracking-wide">
            More than coffee, it's a ritual.
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-white mb-8"
        >
          Our Philosophy
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="text-lg md:text-xl text-gray-300 leading-relaxed md:leading-loose"
        >
          In a world of constant noise, we believe in the calm ritual of preparation, 
          the quiet focus of craftsmanship, and the mindful enjoyment of what is truly 
          essential. Each roast is a return to purity—a deliberate, unhurried process 
          that honors the bean's deepest character.
        </motion.p>
      </div>
    </section>
  );
};

export default Philosophy;