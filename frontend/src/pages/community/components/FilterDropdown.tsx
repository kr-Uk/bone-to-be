import { useRef, useState, useCallback } from "react";
import styled from "styled-components";

import { useClickOutside } from "@/shared/hooks/useClickOutside";

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
  placeholder?: string;
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
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const DropdownIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  font-size: 0.8em;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 100;
  overflow: hidden;
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
    ${({ $selected, theme }) =>
      $selected ? theme.colors.purple[600] : theme.colors.gray[600]};
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
  placeholder = "선택",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(dropdownRef, handleClose);

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
    <DropdownContainer ref={dropdownRef} onKeyDown={handleKeyDown}>
      <DropdownButton
        type="button"
        $isOpen={isOpen}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {label}
        <DropdownIcon $isOpen={isOpen}>▼</DropdownIcon>
      </DropdownButton>

      {isOpen && (
        <DropdownMenu role="listbox" aria-label={label}>
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
      )}
    </DropdownContainer>
  );
}
