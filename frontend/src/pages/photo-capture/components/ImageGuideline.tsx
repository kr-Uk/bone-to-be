import { memo } from "react";
import styled, { keyframes } from "styled-components";

import guidelineImage from "@/assets/image/guide2-removebg-preview.png";

interface ImageGuidelineProps {
  /** 가이드라인 표시 여부 */
  show: boolean;
}

/**
 * 이미지 기반 전신 촬영 가이드라인 오버레이
 *
 * guide2.png를 사용하여 사용자에게 올바른 촬영 자세를 안내합니다.
 *
 * @example
 * ```tsx
 * <ImageGuideline show={!capturedImage && cameraActive} />
 * ```
 */
export const ImageGuideline = memo<ImageGuidelineProps>(({ show }) => {
  return (
    <GuidelineOverlay $show={show}>
      <GuidelineImage src={guidelineImage} alt="전신 촬영 가이드라인" />
    </GuidelineOverlay>
  );
});

ImageGuideline.displayName = "ImageGuideline";

// Styled Components

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 0.4;
    transform: scale(1);
  }
`;

const GuidelineOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: ${({ $show }) => ($show ? 0.4 : 0)};
  transition: opacity 0.3s ease;
  z-index: 1.5;

  /* 등장 애니메이션 */
  animation: ${({ $show }) => ($show ? fadeInAnimation : "none")} 0.4s ease-out;
`;

const GuidelineImage = styled.img`
  /* 기본: 80% 너비, 최대 320px */
  width: 80%;
  max-width: 320px;
  height: auto;
  object-fit: contain;

  /* 눈에 가장 잘 띄는 형광 녹색(라임) 색상 */
  filter: hue-rotate(90deg) brightness(1.3) saturate(1.5);

  /* 반응형: 태블릿 */
  @media (min-width: 768px) {
    width: 75%;
    max-width: 360px;
  }

  /* 반응형: 데스크톱 */
  @media (min-width: 1024px) {
    width: 70%;
    max-width: 400px;
  }
`;
