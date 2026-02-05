import styled from "styled-components";

import { Skeleton } from "./Skeleton";

import type { CSSProperties } from "react";

interface SkeletonCardProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  padding?: CSSProperties["padding"];
  borderRadius?: CSSProperties["borderRadius"];
  className?: string;
}

interface StyledSkeletonCardWrapperProps {
  $padding?: CSSProperties["padding"];
}

const StyledSkeletonCardWrapper = styled.div<StyledSkeletonCardWrapperProps>`
  padding: ${({ $padding }) => $padding || "0"};
`;

/**
 * Card skeleton component with optional padding
 *
 * @param width - Width of the card (default: '100%')
 * @param height - Height of the card (default: '10rem')
 * @param padding - Internal padding (default: '0')
 * @param borderRadius - Border radius (default: '0.25rem')
 *
 * @example
 * // Basic card
 * <SkeletonCard height="15rem" />
 *
 * @example
 * // Card with padding
 * <SkeletonCard height="20rem" padding="1.5rem" />
 *
 * @example
 * // Custom border radius
 * <SkeletonCard height="12rem" borderRadius="1rem" />
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = "100%",
  height = "10rem",
  padding,
  borderRadius = "0.25rem",
  className,
}) => {
  return (
    <StyledSkeletonCardWrapper $padding={padding} className={className}>
      <Skeleton variant="rectangular" width={width} height={height} borderRadius={borderRadius} />
    </StyledSkeletonCardWrapper>
  );
};
