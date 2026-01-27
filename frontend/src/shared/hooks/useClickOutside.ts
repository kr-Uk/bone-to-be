import { useEffect, type RefObject } from "react";

/**
 * Hook to detect clicks outside of a referenced element
 * @param ref - React ref object pointing to the element
 * @param handler - Callback function to execute when click outside is detected
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      // Check if click is inside the dropdown portal
      const portalRoot = document.getElementById("dropdown-portal-root");
      if (portalRoot && portalRoot.contains(target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    document.addEventListener("touchend", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("touchend", listener);
    };
  }, [ref, handler]);
}
