/**
 * Canvas 최대 크기 (참고용)
 *
 * 주의: 실제 Canvas 크기는 PreviewWrapper의 CSS 크기에 따라 동적으로 결정됩니다.
 * 이 상수는 더 이상 usePoseDetection에서 사용되지 않으며,
 * 필요시 최대 크기 참조용으로만 사용하세요.
 */
export const MAX_CANVAS_SIZE = {
  width: 640,
  height: 480,
} as const;

/**
 * @deprecated 더 이상 사용되지 않습니다. MAX_CANVAS_SIZE를 사용하세요.
 */
export const size = MAX_CANVAS_SIZE;
