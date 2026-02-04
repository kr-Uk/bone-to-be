import styled from "styled-components";

import { Skeleton } from "./Skeleton";

import type { CSSProperties } from "react";

interface SkeletonTextProps {
  lines?: number;
  width?: string | string[];
  lineHeight?: CSSProperties["lineHeight"];
  gap?: CSSProperties["gap"];
  className?: string;
}

interface StyledSkeletonTextContainerProps {
  $gap: CSSProperties["gap"];
}

const StyledSkeletonTextContainer = styled.div<StyledSkeletonTextContainerProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || "0.5rem"};
`;

/**
 * Multi-line text skeleton component
 *
 * @param lines - Number of text lines to display (default: 1)
 * @param width - Width of lines. Can be a single string or array of strings for each line (default: '100%')
 * @param lineHeight - Height of each line (default: '1rem')
 * @param gap - Spacing between lines (default: '0.5rem')
 *
 * @example
 * // Single line with default width
 * <SkeletonText />
 *
 * @example
 * // Multiple lines with last line shorter
 * <SkeletonText lines={3} width={['100%', '100%', '60%']} />
 *
 * @example
 * // All lines with same custom width
 * <SkeletonText lines={4} width="80%" />
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  width = "100%",
  lineHeight = "1rem",
  gap = "0.5rem",
  className,
}) => {
  // Generate array of widths
  const widths: string[] = Array.isArray(width) ? width : (Array(lines).fill(width) as string[]);

  // Ensure we have enough widths for all lines
  const lineWidths: string[] = Array(lines)
    .fill(null)
    .map((_, index) => widths[index] || widths[widths.length - 1] || "100%");

  return (
    <StyledSkeletonTextContainer $gap={gap} className={className}>
      {lineWidths.map((lineWidth, index) => (
        <Skeleton key={index} variant="text" width={lineWidth} height={lineHeight} />
      ))}
    </StyledSkeletonTextContainer>
  );
};
