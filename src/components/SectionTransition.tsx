import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTransition({ children, className = '' }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useScrollReveal(ref, {
    y: 30,
    opacity: 0,
    duration: 0.8
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
