import { useState, useCallback, useEffect, useRef } from 'react';

interface TouchState {
  startX: number;
  startY: number;
}

const SWIPE_THRESHOLD = 48;

export function useSliderEngine(totalSlides: number, _isPaused: boolean = false) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Synchronous lock so rapid clicks / spammed keys in the same frame are
  // always rejected, independent of React state batching.
  const isAnimatingRef = useRef(false);
  const touch = useRef<TouchState | null>(null);

  const go = useCallback((nextIndex: number, dir: 1 | -1) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setDirection(dir);
    setIsAnimating(true);
    setCurrentIndex(nextIndex);
  }, []);

  // Callback invoked by the orchestrator once BOTH regions have settled.
  const unlock = useCallback(() => {
    isAnimatingRef.current = false;
    setIsAnimating(false);
  }, []);

  const onNext = useCallback(() => {
    go((currentIndex + 1) % totalSlides, 1);
  }, [go, currentIndex, totalSlides]);

  const onPrev = useCallback(() => {
    go((currentIndex - 1 + totalSlides) % totalSlides, -1);
  }, [go, currentIndex, totalSlides]);

  const onSelect = useCallback((index: number) => {
    if (index === currentIndex) return;
    go(index, index > currentIndex ? 1 : -1);
  }, [go, currentIndex]);

  // Keyboard accessibility: left/right arrows.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  // Native touch swipe handling. Returns handlers bound to the hero section.
  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      touch.current = { startX: t.clientX, startY: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!touch.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.current.startX;
      const dy = t.clientY - touch.current.startY;
      touch.current = null;
      // Horizontal-ish swipe; ignore vertical scrolling gestures.
      if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 40) return;
      if (dx < -SWIPE_THRESHOLD) onNext();
      else if (dx > SWIPE_THRESHOLD) onPrev();
    }
  };

  // isPaused is retained for API compatibility but, with auto-play removed,
  // the slider is fully user-driven and never advances on its own.

  return {
    currentIndex,
    direction,
    isAnimating,
    unlock,
    onNext,
    onPrev,
    onSelect,
    touchHandlers,
  };
}
