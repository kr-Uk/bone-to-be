import { memo, type RefObject, useMemo, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import { GUIDELINE_CONFIG } from "./guideline-config";

interface FullBodyGuidelineProps {
  /** 가이드라인 표시 여부 */
  show: boolean;

  /** 캔버스 크기와 동기화하기 위한 ref (optional) */
  canvasRef?: RefObject<HTMLCanvasElement | null>;
}

/**
 * 전신 촬영 가이드라인 오버레이 컴포넌트
 *
 * 사용자가 카메라 촬영 시 올바른 자세와 위치를 잡을 수 있도록
 * 사람 전신 윤곽 형태의 가이드라인을 표시합니다.
 *
 * @example
 * ```tsx
 * <FullBodyGuideline
 *   show={mode === "camera" && !selectedImage}
 *   canvasRef={canvasRef}
 * />
 * ```
 */
export const FullBodyGuideline = memo<FullBodyGuidelineProps>(
  ({ show }) => {
    // Canvas 크기를 고정값으로 설정 (400×300)
    const [dimensions] = useState({ width: 400, height: 300 });

    // SVG 경로 메모이제이션
    const paths = useMemo(() => {
      const { width, height } = dimensions;
      const centerX = width / 2;

      const {
        verticalRatios: { headTop, headBottom, shoulderY, hipY, footY },
        horizontalRatios: { headWidth, shoulderWidth, hipWidth, footWidth },
      } = GUIDELINE_CONFIG;

      // 좌표 계산
      const headTopY = height * headTop;
      const headBottomY = height * headBottom;
      const headCenterY = (headTopY + headBottomY) / 2;
      const headHeight = headBottomY - headTopY;
      const headWidthPx = width * headWidth;

      const shoulderYPx = height * shoulderY;
      const shoulderWidthPx = width * shoulderWidth;

      const hipYPx = height * hipY;
      const hipWidthPx = width * hipWidth;

      const footYPx = height * footY;
      const footWidthPx = width * footWidth;

      // 머리 (타원형)
      const headPath = `
        M ${centerX - headWidthPx / 2} ${headCenterY}
        A ${headWidthPx / 2} ${headHeight / 2} 0 1 1 ${centerX + headWidthPx / 2} ${headCenterY}
        A ${headWidthPx / 2} ${headHeight / 2} 0 1 1 ${centerX - headWidthPx / 2} ${headCenterY}
      `;

      // 몸통 (직사각형)
      const torsoPath = `
        M ${centerX - shoulderWidthPx / 2} ${shoulderYPx}
        L ${centerX + shoulderWidthPx / 2} ${shoulderYPx}
        L ${centerX + hipWidthPx / 2} ${hipYPx}
        L ${centerX - hipWidthPx / 2} ${hipYPx}
        Z
      `;

      // 왼쪽 다리
      const leftLegPath = `
        M ${centerX - hipWidthPx / 2} ${hipYPx}
        L ${centerX - footWidthPx} ${footYPx}
      `;

      // 오른쪽 다리
      const rightLegPath = `
        M ${centerX + hipWidthPx / 2} ${hipYPx}
        L ${centerX + footWidthPx} ${footYPx}
      `;

      // 어깨선 (수평선)
      const shoulderLine = `
        M ${centerX - shoulderWidthPx / 2} ${shoulderYPx}
        L ${centerX + shoulderWidthPx / 2} ${shoulderYPx}
      `;

      // 골반선 (수평선)
      const hipLine = `
        M ${centerX - hipWidthPx / 2} ${hipYPx}
        L ${centerX + hipWidthPx / 2} ${hipYPx}
      `;

      return {
        head: headPath,
        torso: torsoPath,
        leftLeg: leftLegPath,
        rightLeg: rightLegPath,
        shoulderLine,
        hipLine,
      };
    }, [dimensions]);

    return (
      <GuidelineOverlay $show={show}>
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          {/* 머리 */}
          <path d={paths.head} />

          {/* 몸통 */}
          <path d={paths.torso} />

          {/* 왼쪽 다리 */}
          <path d={paths.leftLeg} />

          {/* 오른쪽 다리 */}
          <path d={paths.rightLeg} />

          {/* 어깨선 */}
          <path d={paths.shoulderLine} />

          {/* 골반선 */}
          <path d={paths.hipLine} />
        </svg>
      </GuidelineOverlay>
    );
  },
  (prevProps, nextProps) => {
    // show가 변경될 때만 리렌더링
    return prevProps.show === nextProps.show;
  },
);

FullBodyGuideline.displayName = "FullBodyGuideline";

// Styled Components

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: ${GUIDELINE_CONFIG.opacity.default};
    transform: scale(1);
  }
`;

const GuidelineOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${({ $show }) => ($show ? GUIDELINE_CONFIG.opacity.default : 0)};
  transition: opacity 0.3s ease;
  z-index: 1.5;

  /* 등장 애니메이션 */
  animation: ${({ $show }) =>
    $show
      ? css`
          ${fadeInAnimation} ${GUIDELINE_CONFIG.animation.fadeInDuration}s ease-out
        `
      : "none"};

  svg {
    display: block;
  }

  svg path {
    fill: none;
    stroke: ${GUIDELINE_CONFIG.colors.primary};
    stroke-width: ${GUIDELINE_CONFIG.stroke.width}px;
    stroke-dasharray: ${GUIDELINE_CONFIG.stroke.dasharray};
    stroke-linecap: ${GUIDELINE_CONFIG.stroke.linecap};
    stroke-linejoin: ${GUIDELINE_CONFIG.stroke.linejoin};

    /* 반응형: 태블릿 */
    @media (min-width: 768px) {
      stroke-width: 2.5px;
    }

    /* 반응형: 데스크톱 */
    @media (min-width: 1024px) {
      stroke-width: 3px;
    }
  }
`;
