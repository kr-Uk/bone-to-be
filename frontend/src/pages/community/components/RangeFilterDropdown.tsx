import { useCallback, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import styled from "styled-components";

import { DropdownPortal } from "@/shared/components/DropdownPortal";
import { DualRangeSlider } from "@/shared/components/DualRangeSlider";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useDropdownFixedPosition } from "@/shared/hooks/useDropdownPosition";

export interface RangePreset {
  label: string;
  min: number;
  max: number;
}

interface RangeFilterDropdownProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: { min: number; max: number } | null;
  onChange: (value: { min: number; max: number } | null) => void;
  presetRanges: RangePreset[];
}

const DropdownContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const DropdownButton = styled.button<{ $isOpen: boolean; $hasValue: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.625rem;
  border-radius: 9999px;
  border: 1px solid
    ${({ $hasValue, theme }) => ($hasValue ? theme.colors.purple[600] : theme.colors.gray[600])};
  background-color: ${({ $hasValue, theme }) =>
    $hasValue ? theme.colors.purple[900] : "transparent"};
  color: ${({ $hasValue, theme }) =>
    $hasValue ? theme.colors.purple[200] : theme.colors.gray[200]};
  font-weight: 500;
  font-size: 1.09375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purple[600]};
  }

  /* Mobile */
  @media (max-width: 767px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    min-height: 48px;
  }
`;

const DropdownIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  font-size: 0.8em;
`;

interface DropdownMenuProps {
  $top?: number;
  $bottom?: number;
  $left: number;
  $right?: number;
  $maxHeight: number;
  $isMobile: boolean;
}

const DropdownMenu = styled.div<DropdownMenuProps>`
  position: fixed;
  top: ${({ $top }) => ($top !== undefined ? `${$top}px` : "auto")};
  bottom: ${({ $bottom }) => ($bottom !== undefined ? `${$bottom}px` : "auto")};
  left: ${({ $left, $isMobile }) => ($isMobile ? `${$left}px` : `${$left}px`)};
  right: ${({ $right, $isMobile }) =>
    $isMobile && $right !== undefined ? `${$right}px` : "auto"};

  max-height: ${({ $maxHeight }) => `${$maxHeight}px`};
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  /* Mobile: Full width with padding */
  width: ${({ $isMobile }) => ($isMobile ? "auto" : "max-content")};
  min-width: ${({ $isMobile }) => ($isMobile ? "auto" : "280px")};

  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ $isMobile }) => ($isMobile ? "1rem 1rem 0 0" : "0.5rem")};
  padding: 1rem;

  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 9999;

  /* Mobile: Slide up animation */
  animation: ${({ $isMobile, $bottom }) =>
    $isMobile && $bottom !== undefined ? "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)" : "fadeIn 0.2s ease"};

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[700]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[600]};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.gray[500]};
    }
  }
`;

const SliderSection = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[700]};
`;

const PresetsSection = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[700]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[600]};
    border-radius: 2px;
  }
`;

const PresetOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray[700] : "transparent"};
  border: none;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.purple[200] : theme.colors.gray[200]};
  font-size: 0.875rem;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
  border-radius: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const RadioIndicator = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: 2px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.purple[600] : theme.colors.gray[600])};
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.colors.purple[600] : "transparent"};
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.purple[600] : theme.colors.gray[600]};
  background-color: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.purple[600] : "transparent"};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.purple[900] : theme.colors.gray[700]};
  }
`;

export function RangeFilterDropdown({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  presetRanges,
}: RangeFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Local state for range value (only committed on "Apply")
  const [localRange, setLocalRange] = useState<[number, number]>([
    value?.min ?? min,
    value?.max ?? max,
  ]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(dropdownRef, handleClose);

  // Calculate fixed positioning for portal
  const position = useDropdownFixedPosition(buttonRef, isOpen, 8, 400);

  // Lock body scroll on mobile when open
  useBodyScrollLock(isOpen, true);

  const handleToggle = () => {
    if (!isOpen) {
      // Reset local state when opening
      setLocalRange([value?.min ?? min, value?.max ?? max]);
    }
    setIsOpen(!isOpen);
  };

  // Find matching preset for current range
  const findMatchingPreset = (range: [number, number]): RangePreset | null => {
    return (
      presetRanges.find((preset) => preset.min === range[0] && preset.max === range[1]) || null
    );
  };

  const selectedPreset = findMatchingPreset(localRange);

  const handlePresetClick = (preset: RangePreset) => {
    setLocalRange([preset.min, preset.max]);
  };

  const handleReset = () => {
    onChange(null);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange({ min: localRange[0], max: localRange[1] });
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Format button label
  const getButtonLabel = () => {
    if (value) {
      return `${label} ${value.min}${unit}~${value.max}${unit}`;
    }
    return label;
  };

  return (
    <>
      <DropdownContainer ref={dropdownRef} onKeyDown={handleKeyDown}>
        <DropdownButton
          ref={buttonRef}
          type="button"
          $isOpen={isOpen}
          $hasValue={value !== null}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getButtonLabel()}
          <DropdownIcon $isOpen={isOpen}>
            <FaChevronDown />
          </DropdownIcon>
        </DropdownButton>
      </DropdownContainer>

      <DropdownPortal isOpen={isOpen} onBackdropClick={handleClose} showBackdrop={position.isMobile}>
        <DropdownMenu
          aria-modal={position.isMobile}
          $top={position.top}
          $bottom={position.bottom}
          $left={position.left}
          $right={position.right}
          $maxHeight={position.maxHeight}
          $isMobile={position.isMobile}
        >
          <SliderSection>
            <DualRangeSlider
              min={min}
              max={max}
              step={step}
              value={localRange}
              onChange={setLocalRange}
              unit={unit}
            />
          </SliderSection>

          <PresetsSection>
            {presetRanges.map((preset) => {
              const isSelected = selectedPreset?.label === preset.label;
              return (
                <PresetOption
                  key={preset.label}
                  type="button"
                  $selected={isSelected}
                  onClick={() => handlePresetClick(preset)}
                >
                  <RadioIndicator $selected={isSelected} />
                  {preset.label}
                </PresetOption>
              );
            })}
          </PresetsSection>

          <ButtonGroup>
            <ActionButton type="button" $variant="secondary" onClick={handleReset}>
              초기화
            </ActionButton>
            <ActionButton type="button" $variant="primary" onClick={handleApply}>
              적용
            </ActionButton>
          </ButtonGroup>
        </DropdownMenu>
      </DropdownPortal>
    </>
  );
}
