import styled from "styled-components";

import type { FeedInputGroupProps } from "./types";

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 3vw, 24px);
`;

const Label = styled.label`
  font-size: clamp(12px, 3vw, 20px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[300]};
  text-transform: uppercase;
  letter-spacing: 0.75px;
`;

const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(12px, 3vw, 24px);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[600]};
  color: ${({ theme }) => theme.colors.purple[600]};
  font-size: clamp(10px, 2.5vw, 16px);
  font-weight: 400;
  padding: 8px 0;
  min-height: 40px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.purple[600]};
    border-bottom-width: 2px;
    padding-bottom: 7px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  /* Remove number input arrows */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

export function FeedInputGroup({
  heightValue,
  weightValue,
  onHeightChange,
  onWeightChange,
}: FeedInputGroupProps) {
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      onHeightChange(value);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      onWeightChange(value);
    }
  };

  return (
    <GroupContainer>
      <Label>Height & Weight</Label>
      <InputsWrapper>
        <InputContainer>
          <StyledInput
            type="text"
            inputMode="numeric"
            value={heightValue}
            onChange={handleHeightChange}
            placeholder="키(cm)"
            aria-label="키(cm)"
          />
        </InputContainer>
        <InputContainer>
          <StyledInput
            type="text"
            inputMode="numeric"
            value={weightValue}
            onChange={handleWeightChange}
            placeholder="몸무게(kg)"
            aria-label="몸무게(kg)"
          />
        </InputContainer>
      </InputsWrapper>
    </GroupContainer>
  );
}
