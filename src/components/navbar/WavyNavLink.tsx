import { useState } from 'react';
import { motion } from 'framer-motion';

interface WavyNavLinkProps {
  label: string;
  href: string;
  onClick?: () => void;
  className?: string;
  variant?: 'light' | 'dark';
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

export const WavyNavLink = ({
  label,
  href,
  onClick,
  className = '',
  variant = 'light',
  isHovered: externalHovered,
  onHoverChange,
}: WavyNavLinkProps) => {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;

  const handleMouseEnter = () => {
    setInternalHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    onHoverChange?.(false);
  };

  const letters = label.split('');

  const defaultColor = variant === 'light' ? '#FDF8F3' : '#2C1810';
  const hoverColor = variant === 'light' ? '#E8C9A0' : '#A0714D';
  const hoverGlow = variant === 'light' ? '0 0 10px rgba(232, 201, 160, 0.5)' : '0 0 8px rgba(160, 113, 77, 0.35)';
  const underlineGradient = variant === 'light'
    ? 'bg-gradient-to-r from-accent to-gold shadow-[0_0_8px_rgba(200,149,108,0.8)]'
    : 'bg-gradient-to-r from-brown-900 to-accent shadow-[0_0_8px_rgba(44,24,16,0.4)]';

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
                    color: hoverColor,
                    textShadow: hoverGlow,
                  }
                : {
                    y: 0,
                    rotate: 0,
                    color: defaultColor,
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
        className={`absolute bottom-0 left-1 right-1 h-[2px] rounded-full ${underlineGradient}`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isHovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </a>
  );
};

