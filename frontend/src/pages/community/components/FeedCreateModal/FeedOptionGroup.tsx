import styled from "styled-components";

import type { FeedOptionGroupProps } from "./types";

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 20px;
  letter-spacing: 0.75px;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
`;

const OptionsWrapper = styled.div`
  display: flex;
  gap: clamp(8px, 2vw, 15px);
  flex-wrap: wrap;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.purple[600] : theme.colors.gray[700]};
  color: ${({ theme, $selected }) => ($selected ? "white" : theme.colors.gray[400])};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.purple[600] : theme.colors.gray[600])};
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  cursor: pointer;
  transform: scale(1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  -webkit-tap-highlight-color: rgba(152, 16, 250, 0.2);
  touch-action: manipulation;

  &:hover {
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.purple[900] : theme.colors.gray[600]};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.purple[900] : theme.colors.gray[600]};
  }

  @media (min-width: 768px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
`;

export function FeedOptionGroup({
  label,
  icon,
  options,
  value,
  onChange,
  multiSelect = false,
}: FeedOptionGroupProps) {
  const handleClick = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues.length > 0 ? newValues : null);
    } else {
      onChange(value === optionValue ? null : optionValue);
    }
  };

  const isSelected = (optionValue: string): boolean => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <GroupContainer>
      <Label>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {label}
      </Label>
      <OptionsWrapper>
        {options.map((option) => (
          <OptionButton
            key={option.value}
            type="button"
            $selected={isSelected(option.value)}
            onClick={() => handleClick(option.value)}
            aria-pressed={isSelected(option.value)}
            aria-label={`${option.label} 선택`}
          >
            {option.label}
          </OptionButton>
        ))}
      </OptionsWrapper>
    </GroupContainer>
  );
}
