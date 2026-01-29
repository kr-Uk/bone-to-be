import React from "react";
import styled from "styled-components";

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

const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 2rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 1px solid
    ${({ theme, $hasError }) => ($hasError ? "#ff4444" : theme.colors.gray[600])};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: clamp(10px, 2.5vw, 16px);
  font-weight: 400;
  padding: 8px 0;
  min-height: 40px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme, $hasError }) =>
      $hasError ? "#ff4444" : theme.colors.purple[600]};
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

interface FeedInputGroupProps {
  heightProps: React.InputHTMLAttributes<HTMLInputElement>;
  weightProps: React.InputHTMLAttributes<HTMLInputElement>;
  heightError?: string;
  weightError?: string;
}

export function FeedInputGroup({
  heightProps,
  weightProps,
  heightError,
  weightError,
}: FeedInputGroupProps) {
  return (
    <GroupContainer>
      <Label>키 / 몸무게</Label>
      <InputsWrapper>
        <InputContainer>
          <StyledInput
            type="text"
            inputMode="numeric"
            placeholder="키(cm)"
            aria-label="키(cm)"
            $hasError={!!heightError}
            {...heightProps}
          />
        </InputContainer>
        <InputContainer>
          <StyledInput
            type="text"
            inputMode="numeric"
            placeholder="몸무게(kg) *"
            aria-label="몸무게(kg)"
            $hasError={!!weightError}
            {...weightProps}
          />
        </InputContainer>
      </InputsWrapper>
    </GroupContainer>
  );
}
