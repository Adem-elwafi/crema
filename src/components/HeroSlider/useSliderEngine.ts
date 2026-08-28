import { useState, useCallback, useEffect, useRef } from 'react';

export function useSliderEngine(totalSlides: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const isHoveredRef = useRef(false);
  const isDrawerOpenRef = useRef(false);

  const onNext = useCallback(() => {
    if (isAnimating) return;
    setDirection(1);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [isAnimating, totalSlides]);

  const onPrev = useCallback(() => {
    if (isAnimating) return;
    setDirection(-1);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [isAnimating, totalSlides]);

  const onSelect = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setIsAnimating(true);
    setCurrentIndex(index);
  }, [isAnimating, currentIndex]);

  const setHovered = useCallback((val: boolean) => {
    isHoveredRef.current = val;
  }, []);

  const setDrawerOpen = useCallback((val: boolean) => {
    isDrawerOpenRef.current = val;
  }, []);

  // Auto-play: 5s interval, pauses on hover/animating/drawer open
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && !isHoveredRef.current && !isDrawerOpenRef.current) {
        setDirection(1);
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  return {
    currentIndex,
    direction,
    isAnimating,
    setIsAnimating,
    onNext,
    onPrev,
    onSelect,
    setHovered,
    setDrawerOpen
  };
}
