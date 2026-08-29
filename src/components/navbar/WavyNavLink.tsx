import { useState } from 'react';
import { motion } from 'framer-motion';

interface WavyNavLinkProps {
  label: string;
  href: string;
  onClick?: () => void;
  className?: string;
}

export const WavyNavLink = ({
  label,
  href,
  onClick,
  className = '',
}: WavyNavLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const letters = label.split('');

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center py-2 px-2 cursor-pointer select-none group font-body text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 ${className}`}
    >
      <span className="relative flex items-center">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            animate={
              isHovered
                ? {
                    y: [0, -5, 2, 0],
                    rotate: [0, -4, 2, 0],
                    color: '#E8C9A0', // radiant gold
                    textShadow: '0 0 10px rgba(232, 201, 160, 0.5)',
                  }
                : {
                    y: 0,
                    rotate: 0,
                    color: '#FDF8F3', // crisp bright cream
                    textShadow: 'none',
                  }
            }
            transition={{
              duration: 0.45,
              delay: index * 0.03,
              ease: [0.34, 1.56, 0.64, 1], // bouncy spring curve
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>

      {/* Kinetic Underline Indicator */}
      <motion.span
        className="absolute bottom-0 left-1 right-1 h-[2px] bg-gradient-to-r from-accent to-gold rounded-full shadow-[0_0_8px_rgba(200,149,108,0.8)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isHovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </a>
  );
};
