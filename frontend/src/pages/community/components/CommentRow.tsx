import styled from "styled-components";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CommentItem } from "./CommentItem";

interface Props {
  username: string;
  text: string;
  time: string;
  likeCount: number;
}

export function CommentRow(props: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(props.likeCount);

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
  };

  return (
    <Row>
      <CommentItem {...props} likeCount={count} />
      <LikeButton liked={liked} onClick={handleLikeClick}>
        {liked ? <FaHeart /> : <FaRegHeart />}
      </LikeButton>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 */
  gap: 12px;
`;

const LikeButton = styled.button<{ liked: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  font-size: 14px;
  color: ${({ liked }) => (liked ? "#ef4444" : "#a1a1a1")};

  svg {
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }

  &:active svg {
    transform: scale(1.3);
  }
`;
