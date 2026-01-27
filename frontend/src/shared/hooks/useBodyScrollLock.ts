import { useEffect, useRef } from "react";

/**
 * Hook to lock body scroll when dropdown is open (mobile only)
 * Prevents background scrolling and maintains scroll position
 *
 * @param isLocked - Whether to lock the body scroll
 * @param mobileOnly - Only apply lock on mobile devices (default: true)
 */
export function useBodyScrollLock(isLocked: boolean, mobileOnly: boolean = true) {
  const scrollYRef = useRef<number>(0);

  useEffect(() => {
    // Only apply on mobile if mobileOnly is true
    if (mobileOnly && window.innerWidth >= 768) {
      return;
    }

    if (!isLocked) {
      return;
    }

    // Save current scroll position
    scrollYRef.current = window.scrollY;

    // Get original styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Lock scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";

    // Cleanup: Restore scroll
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isLocked, mobileOnly]);
}
