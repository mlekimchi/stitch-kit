import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd:   (e: React.TouchEvent) => void;
}

interface UseSwipeOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?:  () => void;
  threshold?: number; // px, default 60
}

export function useSwipe({ onSwipeRight, onSwipeLeft, threshold = 60 }: UseSwipeOptions): SwipeHandlers {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.changedTouches[0].clientX;
    startY.current = e.changedTouches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;

    // Only count as horizontal swipe if horizontal movement dominates
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx > 0) onSwipeRight?.();
    else        onSwipeLeft?.();

    startX.current = null;
    startY.current = null;
  }, [onSwipeRight, onSwipeLeft, threshold]);

  return { onTouchStart, onTouchEnd };
}
