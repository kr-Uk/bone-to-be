import styled from "styled-components";

import type { FeedTextareaProps } from "./types";

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 211.88px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 15px;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 400;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple[600]};
    box-shadow: 0 0 0 3px rgba(152, 16, 250, 0.1);
    transform: scale(1.01);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  @media (max-width: 767px) {
    min-height: 150px;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: clamp(12px, 2.5vw, 14px);
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export function FeedTextarea({ value, onChange, maxLength }: FeedTextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <TextareaContainer>
      <StyledTextarea
        value={value}
        onChange={handleChange}
        placeholder="오늘의 코디를 공유해보세요..."
        maxLength={maxLength}
      />
      <CharCount>
        {value.length}/{maxLength.toLocaleString()}
      </CharCount>
    </TextareaContainer>
  );
}
