import { useRef, useState, useCallback } from "react";
import { FaChevronDown } from "react-icons/fa6";
import styled from "styled-components";

import { DropdownPortal } from "@/shared/components/DropdownPortal";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useDropdownFixedPosition } from "@/shared/hooks/useDropdownPosition";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  multiSelect?: boolean;
}

const DropdownContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const DropdownButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.625rem;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray[200]};
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
    min-height: 48px; /* Ensure minimum touch target size */
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
  min-width: ${({ $isMobile }) => ($isMobile ? "auto" : "200px")};

  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ $isMobile }) => ($isMobile ? "1rem 1rem 0 0" : "0.5rem")};

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

const OptionItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray[700] : "transparent"};
  border: none;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.purple[200] : theme.colors.gray[200]};
  font-size: 1rem;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }

  /* Mobile */
  @media (max-width: 767px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
`;

const SelectionIndicator = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: 2px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.purple[600] : theme.colors.gray[600])};
  border-radius: ${({ $selected }) => ($selected ? "0.25rem" : "50%")};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.purple[600] : "transparent"};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: ${({ $selected }) => ($selected ? '"✓"' : '""')};
    color: ${({ theme }) => theme.colors.gray[50]};
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  multiSelect = false,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(dropdownRef, handleClose);

  // Calculate fixed positioning for portal
  const position = useDropdownFixedPosition(buttonRef, isOpen, 8, 300);

  // Lock body scroll on mobile when open
  useBodyScrollLock(isOpen, true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isSelected = (optionValue: string): boolean => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        // Remove from selection
        const newValues = currentValues.filter((v) => v !== optionValue);
        onChange(newValues.length > 0 ? newValues : []);
      } else {
        // Add to selection
        onChange([...currentValues, optionValue]);
      }
    } else {
      // Single select: toggle or select
      if (value === optionValue) {
        onChange(null); // Deselect
      } else {
        onChange(optionValue); // Select
      }
      setIsOpen(false); // Close dropdown after selection
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <>
      <DropdownContainer ref={dropdownRef} onKeyDown={handleKeyDown}>
        <DropdownButton
          ref={buttonRef}
          type="button"
          $isOpen={isOpen}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {label}
          <DropdownIcon $isOpen={isOpen}>
            <FaChevronDown />
          </DropdownIcon>
        </DropdownButton>
      </DropdownContainer>

      <DropdownPortal isOpen={isOpen} onBackdropClick={handleClose} showBackdrop={position.isMobile}>
        <DropdownMenu
          role="listbox"
          aria-label={label}
          aria-modal={position.isMobile}
          $top={position.top}
          $bottom={position.bottom}
          $left={position.left}
          $right={position.right}
          $maxHeight={position.maxHeight}
          $isMobile={position.isMobile}
        >
          {options.map((option) => (
            <OptionItem
              key={option.value}
              type="button"
              $selected={isSelected(option.value)}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={isSelected(option.value)}
            >
              <SelectionIndicator $selected={isSelected(option.value)} />
              {option.label}
            </OptionItem>
          ))}
        </DropdownMenu>
      </DropdownPortal>
    </>
  );
}
