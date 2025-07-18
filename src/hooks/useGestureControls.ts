import { useState, useEffect, useCallback } from 'react';

interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isActive: boolean;
  startTime: number;
}

interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
}

export const useGestureControls = (
  element: HTMLElement | null,
  callbacks: GestureCallbacks = {},
  options: {
    swipeThreshold?: number;
    tapThreshold?: number;
    longPressThreshold?: number;
    doubleTapThreshold?: number;
  } = {}
) => {
  const {
    swipeThreshold = 50,
    tapThreshold = 10,
    longPressThreshold = 500,
    doubleTapThreshold = 300,
  } = options;

  const [gestureState, setGestureState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    startTime: 0,
  });

  const [lastTapTime, setLastTapTime] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const newState = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isActive: true,
      startTime: Date.now(),
    };
    
    setGestureState(newState);

    // Start long press timer
    const timer = setTimeout(() => {
      if (gestureState.isActive) {
        callbacks.onLongPress?.();
      }
    }, longPressThreshold);
    
    setLongPressTimer(timer);
  }, [callbacks.onLongPress, longPressThreshold, gestureState.isActive]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!gestureState.isActive) return;

    const touch = e.touches[0];
    setGestureState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }));

    // Clear long press timer on move
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [gestureState.isActive, longPressTimer]);

  const handleTouchEnd = useCallback(() => {
    if (!gestureState.isActive) return;

    const deltaX = gestureState.currentX - gestureState.startX;
    const deltaY = gestureState.currentY - gestureState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - gestureState.startTime;

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Check for swipe gestures
    if (distance > swipeThreshold) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    } else if (distance < tapThreshold) {
      // Tap gesture
      const now = Date.now();
      if (now - lastTapTime < doubleTapThreshold) {
        callbacks.onDoubleTap?.();
      } else {
        callbacks.onTap?.();
      }
      setLastTapTime(now);
    }

    setGestureState(prev => ({ ...prev, isActive: false }));
  }, [
    gestureState,
    callbacks,
    swipeThreshold,
    tapThreshold,
    doubleTapThreshold,
    lastTapTime,
    longPressTimer,
  ]);

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const newState = {
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isActive: true,
      startTime: Date.now(),
    };
    
    setGestureState(newState);

    // Start long press timer
    const timer = setTimeout(() => {
      if (gestureState.isActive) {
        callbacks.onLongPress?.();
      }
    }, longPressThreshold);
    
    setLongPressTimer(timer);
  }, [callbacks.onLongPress, longPressThreshold, gestureState.isActive]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!gestureState.isActive) return;

    setGestureState(prev => ({
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
    }));

    // Clear long press timer on move
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [gestureState.isActive, longPressTimer]);

  const handleMouseUp = useCallback(() => {
    if (!gestureState.isActive) return;

    const deltaX = gestureState.currentX - gestureState.startX;
    const deltaY = gestureState.currentY - gestureState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Check for swipe gestures
    if (distance > swipeThreshold) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    } else if (distance < tapThreshold) {
      // Click gesture
      const now = Date.now();
      if (now - lastTapTime < doubleTapThreshold) {
        callbacks.onDoubleTap?.();
      } else {
        callbacks.onTap?.();
      }
      setLastTapTime(now);
    }

    setGestureState(prev => ({ ...prev, isActive: false }));
  }, [
    gestureState,
    callbacks,
    swipeThreshold,
    tapThreshold,
    doubleTapThreshold,
    lastTapTime,
    longPressTimer,
  ]);

  // Attach event listeners
  useEffect(() => {
    if (!element) return;

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse events
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    element,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  ]);

  return {
    gestureState,
    isActive: gestureState.isActive,
  };
};