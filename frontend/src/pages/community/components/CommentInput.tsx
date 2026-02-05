import { forwardRef } from "react";
import styled from "styled-components";

import type { KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CommentInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, onSubmit, placeholder = "댓글 달기 ...", disabled }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
    };

    return (
      <Wrapper>
        <Input
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <PostButton type="button" onClick={onSubmit} disabled={disabled || !value.trim()}>
          등록
        </PostButton>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: #262626;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fafafa;
`;

const PostButton = styled.button`
  background: none;
  border: none;
  color: #9810fa;
  font-weight: 700;
  cursor: pointer;
`;
