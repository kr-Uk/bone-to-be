import styled from "styled-components";

import type { FeedOptionGroupProps } from "./types";

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 15px);
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(12px, 3vw, 20px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[300]};
  text-transform: uppercase;
  letter-spacing: 0.75px;
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
  min-width: 44px;
  min-height: 44px;
  padding: clamp(12px, 2vw, 15.625px) clamp(12px, 1.5vw, 8.125px);
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.purple[600] : theme.colors.gray[700]};
  color: ${({ theme, $selected }) => ($selected ? "white" : theme.colors.gray[400])};
  border: none;
  border-radius: 10px;
  font-size: clamp(12px, 2.5vw, 15px);
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
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.purple[900] : theme.colors.gray[600]};
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
