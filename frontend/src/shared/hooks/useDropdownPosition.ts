import { useCallback, useEffect, useState, type RefObject } from "react";

export interface DropdownPosition {
  top?: string;
  bottom?: string;
  shouldFlipUp: boolean;
}

export interface DropdownFixedPosition {
  position: "fixed";
  top?: number;
  bottom?: number;
  left: number;
  right?: number;
  maxHeight: number;
  shouldFlipUp: boolean;
  isMobile: boolean;
}

/**
 * Hook to calculate smart dropdown positioning based on viewport space
 * @param buttonRef - Reference to the button that triggers the dropdown
 * @param isOpen - Whether the dropdown is currently open
 * @param offset - Gap between button and dropdown menu (default: 8px)
 * @param menuHeight - Estimated menu height (default: 300px)
 * @returns Position styles and flip direction flag
 */
export function useDropdownPosition(
  buttonRef: RefObject<HTMLElement>,
  isOpen: boolean,
  offset: number = 8,
  menuHeight: number = 300,
): DropdownPosition {
  const [position, setPosition] = useState<DropdownPosition>({
    top: `calc(100% + ${offset}px)`,
    shouldFlipUp: false,
  });

  useEffect(() => {
    if (!isOpen || !buttonRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate available space below and above the button
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Decide whether to flip upward
      const shouldFlipUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

      if (shouldFlipUp) {
        setPosition({
          bottom: `calc(100% + ${offset}px)`,
          shouldFlipUp: true,
        });
      } else {
        setPosition({
          top: `calc(100% + ${offset}px)`,
          shouldFlipUp: false,
        });
      }
    };

    updatePosition();

    // Update position on scroll or resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, buttonRef, offset, menuHeight]);

  return position;
}

// Debounce helper
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Hook to calculate fixed positioning for portal dropdowns
 * Supports mobile bottom sheet and desktop dropdown patterns
 *
 * @param buttonRef - Reference to the button that triggers the dropdown
 * @param isOpen - Whether the dropdown is currently open
 * @param offset - Gap between button and dropdown menu (default: 8px)
 * @param menuHeight - Estimated menu height (default: 300px)
 * @returns Fixed position styles optimized for viewport
 */
export function useDropdownFixedPosition(
  buttonRef: RefObject<HTMLElement>,
  isOpen: boolean,
  offset: number = 8,
  menuHeight: number = 300,
): DropdownFixedPosition {
  const [position, setPosition] = useState<DropdownFixedPosition>({
    position: "fixed",
    top: 0,
    left: 0,
    maxHeight: 300,
    shouldFlipUp: false,
    isMobile: false,
  });

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;

    // Mobile: Bottom sheet pattern
    if (isMobile) {
      setPosition({
        position: "fixed",
        bottom: 0,
        left: viewportWidth * 0.05, // 5% padding
        right: viewportWidth * 0.05,
        maxHeight: viewportHeight * 0.8, // 80% of viewport
        shouldFlipUp: false,
        isMobile: true,
      });
      return;
    }

    // Desktop: Smart positioning relative to button
    const spaceBelow = viewportHeight - buttonRect.bottom - offset;
    const spaceAbove = buttonRect.top - offset;
    const shouldFlipUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    // Calculate max-height based on available space
    const maxHeight = shouldFlipUp
      ? Math.min(spaceAbove, viewportHeight * 0.6)
      : Math.min(spaceBelow, viewportHeight * 0.6);

    setPosition({
      position: "fixed",
      top: shouldFlipUp ? undefined : buttonRect.bottom + offset,
      bottom: shouldFlipUp ? viewportHeight - buttonRect.top + offset : undefined,
      left: buttonRect.left,
      maxHeight,
      shouldFlipUp,
      isMobile: false,
    });
  }, [buttonRef, offset, menuHeight]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    // Debounced position updates for performance
    const debouncedUpdate = debounce(updatePosition, 16); // ~60fps

    window.addEventListener("scroll", debouncedUpdate, true);
    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("scroll", debouncedUpdate, true);
      window.removeEventListener("resize", debouncedUpdate);
      debouncedUpdate.cancel();
    };
  }, [isOpen, updatePosition]);

  return position;
}
