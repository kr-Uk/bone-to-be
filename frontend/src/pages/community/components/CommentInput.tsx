import styled from "styled-components";
import { useState, forwardRef } from "react";

export const CommentInput = forwardRef<HTMLInputElement>((_, ref) => {
  const [text, setText] = useState("");

  return (
    <Wrapper>
      <Input
        ref = {ref}
        placeholder="댓글 달기 ..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <PostButton>게시</PostButton>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
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
