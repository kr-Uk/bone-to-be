import { useEffect, useState } from "react";

/**
 * CSS 미디어 쿼리를 React 상태로 변환하는 훅
 *
 * @param query - CSS 미디어 쿼리 문자열 (예: "(max-width: 767px)")
 * @returns 미디어 쿼리 매칭 여부
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = () => setMatches(mediaQuery.matches);

    // 초기값 설정
    handler();

    // 리스너 등록
    mediaQuery.addEventListener("change", handler);

    // 클린업
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
