import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * 무한 스크롤을 위한 커스텀 훅
 * Intersection Observer를 사용하여 특정 요소가 화면에 보일 때 콜백 실행
 *
 * @param options.onLoadMore - 다음 페이지를 로드하는 콜백 함수
 * @param options.hasMore - 더 로드할 데이터가 있는지 여부
 * @param options.isLoading - 현재 로딩 중인지 여부
 * @param options.threshold - 뷰포트와의 교차 비율 (기본값: 0.1)
 * @param options.rootMargin - 루트 요소의 마진 (기본값: "200px")
 * @returns 관찰 대상 요소에 연결할 ref
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
  rootMargin = "200px",
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 observer 생성 안 함
    if (isLoading || !hasMore) {
      return;
    }

    // Intersection Observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 요소가 화면에 보이고, 로딩 중이 아니며, 더 로드할 데이터가 있을 때만 콜백 실행
        if (entry.isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    // 현재 요소 관찰 시작
    const currentElement = elementRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    // cleanup: 컴포넌트 언마운트 시 observer 정리
    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
      }
    };
  }, [onLoadMore, hasMore, isLoading, threshold, rootMargin]);

  return elementRef;
}
