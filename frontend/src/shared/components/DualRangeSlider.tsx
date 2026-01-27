import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  unit?: string;
  formatLabel?: (value: number) => string;
}

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 1.5rem 0.5rem;
`;

const SliderTrack = styled.div`
  position: relative;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.gray[700]};
  border-radius: 3px;
  cursor: pointer;
`;

const SliderRange = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  height: 100%;
  left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  background-color: ${({ theme }) => theme.colors.purple[600]};
  border-radius: 3px;
  pointer-events: none;
`;

const SliderThumb = styled.div<{ $left: number; $isDragging: boolean }>`
  position: absolute;
  top: 50%;
  left: ${({ $left }) => $left}%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 3px solid ${({ theme }) => theme.colors.purple[600]};
  border-radius: 50%;
  cursor: grab;
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "box-shadow 0.2s ease")};
  z-index: ${({ $isDragging }) => ($isDragging ? 3 : 2)};

  &:hover {
    box-shadow: 0 0 0 4px rgba(152, 16, 250, 0.2);
  }

  &:active {
    cursor: grabbing;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(152, 16, 250, 0.3);
  }

  /* Mobile touch target */
  @media (max-width: 767px) {
    width: 24px;
    height: 24px;
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0 0.5rem;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.body.sm.medium};
  color: ${({ theme }) => theme.colors.gray[400]};
  user-select: none;
`;

export function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  unit = "",
  formatLabel,
}: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const [minValue, maxValue] = value;

  // Calculate percentage positions
  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;
  const minPercent = getPercent(minValue);
  const maxPercent = getPercent(maxValue);

  // Format label with custom formatter or default
  const formatValue = (val: number) => {
    if (formatLabel) return formatLabel(val);
    return `${val}${unit}`;
  };

  // Convert mouse/touch position to value
  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percent * (max - min);

      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step],
  );

  // Handle drag start
  const handleDragStart = (thumb: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(thumb);
  };

  // Handle drag move
  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newValue = getValueFromPosition(clientX);

      if (dragging === "min") {
        // Ensure min doesn't exceed max
        const clampedValue = Math.min(newValue, maxValue - step);
        onChange([clampedValue, maxValue]);
      } else {
        // Ensure max doesn't go below min
        const clampedValue = Math.max(newValue, minValue + step);
        onChange([minValue, clampedValue]);
      }
    },
    [dragging, getValueFromPosition, minValue, maxValue, onChange, step],
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  // Attach global event listeners for drag
  useEffect(() => {
    if (dragging) {
      const handleMove = (e: MouseEvent | TouchEvent) => handleDragMove(e);
      const handleEnd = () => handleDragEnd();

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [dragging, handleDragMove, handleDragEnd]);

  // Handle track click to jump
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) return;

    const newValue = getValueFromPosition(e.clientX);
    const distToMin = Math.abs(newValue - minValue);
    const distToMax = Math.abs(newValue - maxValue);

    // Move the closer thumb
    if (distToMin < distToMax) {
      onChange([Math.min(newValue, maxValue - step), maxValue]);
    } else {
      onChange([minValue, Math.max(newValue, minValue + step)]);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (thumb: "min" | "max") => (e: React.KeyboardEvent) => {
    let delta = 0;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      delta = -step;
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      delta = step;
      e.preventDefault();
    }

    if (delta !== 0) {
      if (thumb === "min") {
        const newMin = Math.max(min, Math.min(maxValue - step, minValue + delta));
        onChange([newMin, maxValue]);
      } else {
        const newMax = Math.min(max, Math.max(minValue + step, maxValue + delta));
        onChange([minValue, newMax]);
      }
    }
  };

  return (
    <SliderContainer>
      <SliderTrack ref={trackRef} onClick={handleTrackClick}>
        <SliderRange $left={minPercent} $width={maxPercent - minPercent} />

        <SliderThumb
          $left={minPercent}
          $isDragging={dragging === "min"}
          onMouseDown={handleDragStart("min")}
          onTouchStart={handleDragStart("min")}
          onKeyDown={handleKeyDown("min")}
          role="slider"
          aria-label="Minimum value"
          aria-valuemin={min}
          aria-valuemax={maxValue}
          aria-valuenow={minValue}
          tabIndex={0}
        />

        <SliderThumb
          $left={maxPercent}
          $isDragging={dragging === "max"}
          onMouseDown={handleDragStart("max")}
          onTouchStart={handleDragStart("max")}
          onKeyDown={handleKeyDown("max")}
          role="slider"
          aria-label="Maximum value"
          aria-valuemin={minValue}
          aria-valuemax={max}
          aria-valuenow={maxValue}
          tabIndex={0}
        />
      </SliderTrack>

      <SliderLabels>
        <Label>{formatValue(minValue)}</Label>
        <Label>{formatValue(maxValue)}</Label>
      </SliderLabels>
    </SliderContainer>
  );
}
