import { theme } from "@/shared/styles/theme";

/**
 * 전신 가이드라인 오버레이 설정
 *
 * 비율은 캔버스 크기(640×480, 4:3)를 기준으로 정의됩니다.
 * - 세로 비율: 캔버스 높이 기준 (0.0 ~ 1.0)
 * - 가로 비율: 캔버스 너비 기준 (0.0 ~ 1.0)
 */
export const GUIDELINE_CONFIG = {
  // 색상
  colors: {
    primary: theme.colors.purple[600], // #9810FA (기본)
    secondary: theme.colors.purple[200], // #E9D4FF (옵션)
    accent: theme.colors.gray[50], // #FFFFFF (하이라이트)
  },

  // 투명도
  opacity: {
    default: 0.3,
    hover: 0.5, // 미래 확장용
  },

  // 선 스타일
  stroke: {
    width: 2,
    dasharray: "8 4",
    linecap: "round" as const,
    linejoin: "round" as const,
  },

  // 세로 비율 (캔버스 높이 기준) - 4:3 가로형에 최적화
  verticalRatios: {
    headTop: 0.08, // 상단 8%에서 시작 (세로 압축)
    headBottom: 0.18, // 머리 끝 18%
    shoulderY: 0.23, // 어깨선 23%
    hipY: 0.52, // 골반선 52% (중앙 약간 아래)
    footY: 0.93, // 발 93% (하단 7% 여백)
  },

  // 가로 비율 (캔버스 너비 기준) - 4:3 가로형에 최적화
  horizontalRatios: {
    headWidth: 0.19, // 머리 너비 19% (가로 넓어짐 대비)
    shoulderWidth: 0.38, // 어깨 너비 38%
    hipWidth: 0.3, // 골반 너비 30%
    footWidth: 0.11, // 발 너비 11%
  },

  // 애니메이션 설정
  animation: {
    enablePulse: false, // 펄스 효과 비활성화
    fadeInDuration: 0.4, // 페이드인 지속 시간 (초)
  },

  // 이미지 가이드라인 설정 (guide2.png 기반)
  image: {
    opacity: 0.4, // 이미지 투명도
    width: "80%", // 기본 너비
    maxWidth: "320px", // 최대 너비
  },
} as const;
