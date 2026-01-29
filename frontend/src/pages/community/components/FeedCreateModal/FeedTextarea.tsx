import React from "react";
import styled from "styled-components";

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 210px;
  resize: none;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? "#ff4444" : theme.colors.gray[600])};
  border-radius: 15px;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 400;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? "#ff4444" : theme.colors.purple[600])};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? "rgba(255, 68, 68, 0.1)" : "rgba(152, 16, 250, 0.1)")};
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

interface FeedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
  currentLength: number;
  error?: string;
}

export const FeedTextarea = React.forwardRef<HTMLTextAreaElement, FeedTextareaProps>(
  ({ maxLength, currentLength, error, ...props }, ref) => {
    return (
      <TextareaContainer>
        <StyledTextarea ref={ref} maxLength={maxLength} $hasError={!!error} {...props} />
        <CharCount>
          {currentLength}/{maxLength.toLocaleString()}
        </CharCount>
      </TextareaContainer>
    );
  },
);

FeedTextarea.displayName = "FeedTextarea";
