import styled, { css, keyframes } from "styled-components";

import type { CSSProperties } from "react";

type SkeletonVariant = "rectangular" | "circular" | "text";
type SkeletonAnimation = "pulse" | "wave" | "none";

interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  borderRadius?: CSSProperties["borderRadius"];
  className?: string;
}

interface StyledSkeletonProps {
  $width?: CSSProperties["width"];
  $height?: CSSProperties["height"];
  $variant: SkeletonVariant;
  $animation: SkeletonAnimation;
  $borderRadius?: CSSProperties["borderRadius"];
}

// Pulse animation: opacity transition
const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`;

// Wave animation: background position shift
const waveAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const StyledSkeleton = styled.div<StyledSkeletonProps>`
  background-color: #262626;
  display: block;

  /* Width and height */
  width: ${({ $width }) => (typeof $width === "number" ? `${$width}px` : $width || "100%")};
  height: ${({ $height }) => (typeof $height === "number" ? `${$height}px` : $height || "1rem")};

  /* Variant-specific styles */
  ${({ $variant, $borderRadius }) => {
    switch ($variant) {
      case "circular":
        return css`
          border-radius: 50%;
        `;
      case "text":
        return css`
          border-radius: 0.25rem;
          transform: scale(1, 0.85);
        `;
      case "rectangular":
      default:
        return css`
          border-radius: ${$borderRadius || "0.25rem"};
        `;
    }
  }}

  /* Animation */
  ${({ $animation }) => {
    switch ($animation) {
      case "pulse":
        return css`
          animation: ${pulseAnimation} 1.5s ease-in-out infinite;
        `;
      case "wave":
        return css`
          background: linear-gradient(
            90deg,
            #262626 0%,
            #3a3a3a 25%,
            #525252 50%,
            #3a3a3a 75%,
            #262626 100%
          );
          background-size: 200px 100%;
          animation: ${waveAnimation} 1.5s linear infinite;
        `;
      case "none":
      default:
        return "";
    }
  }}
`;

/**
 * Base Skeleton component for loading states
 *
 * @param width - Width of the skeleton (default: '100%')
 * @param height - Height of the skeleton (default: '1rem')
 * @param variant - Shape variant: 'rectangular', 'circular', or 'text' (default: 'rectangular')
 * @param animation - Animation type: 'pulse', 'wave', or 'none' (default: 'pulse')
 * @param borderRadius - Custom border radius (default: '0.25rem' for rectangular)
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = "rectangular",
  animation = "pulse",
  borderRadius,
  className,
}) => {
  return (
    <StyledSkeleton
      $width={width}
      $height={height}
      $variant={variant}
      $animation={animation}
      $borderRadius={borderRadius}
      className={className}
    />
  );
};
