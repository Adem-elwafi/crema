import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from 'react';

const Philosophy = () => {
  const philosophyRef = useRef(null);
  const isInView = useInView(philosophyRef, { once: true, amount: 0.3 });

  return (
    <section 
      ref={philosophyRef}
      className="py-24 md:py-32 px-6 md:px-12 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-white mb-8">
          Our Philosophy
        </h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed md:leading-loose">
          In a world of constant noise, we believe in the calm ritual of preparation, 
          the quiet focus of craftsmanship, and the mindful enjoyment of what is truly 
          essential. Each roast is a return to purity—a deliberate, unhurried process 
          that honors the bean's deepest character.
        </p>
      </motion.div>
    </section>
  );
};

export default Philosophy;