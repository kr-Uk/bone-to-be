import { FaHeart, FaRegHeart } from "react-icons/fa";
import styled from "styled-components";

import type { FeedItem } from "../api";

interface FeedCardProps {
  item: FeedItem;
  isActive?: boolean;
  onLike: () => void;
  onClick: () => void;
}

const CardContainer = styled.div<{ $isActive?: boolean }>`
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid
    ${({ $isActive, theme }) => ($isActive ? theme.colors.purple[600] : theme.colors.gray[600])};
  box-shadow: ${({ $isActive }) => ($isActive ? "0 0 30px rgba(124, 58, 237, 0.2)" : "none")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    z-index: 1;

    .overlay {
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: calc(${({ theme }) => theme.spacing.md} + 36px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding-bottom: calc(${({ theme }) => theme.spacing.sm} + 32px);
  }
`;

const UserInfo = styled.div`
  color: ${({ theme }) => theme.colors.gray[50]};
`;

const Username = styled.div`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.gray[200]};
`;

const HeightBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.2;
  background-color: ${({ theme }) => theme.colors.gray[600]};
  color: ${({ theme }) => theme.colors.gray[50]};
  padding: 2px 8px;
  border-radius: 12px;
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
  color: ${({ $liked }) => ($liked ? "#ef4444" : "#fafafa")};
  font-size: 18px;

  svg {
    transition:
      transform 0.2s ease,
      color 0.2s ease;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);

    svg {
      transform: scale(1.15);
    }
  }

  &:active svg {
    transform: scale(1.3);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 16px;
    bottom: ${({ theme }) => theme.spacing.sm};
    right: ${({ theme }) => theme.spacing.sm};
  }
`;

export function FeedCard({ item, isActive, onLike, onClick }: FeedCardProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  return (
    <CardContainer $isActive={isActive} onClick={onClick}>
      <Image src={item.imageUrl} alt={item.username} />
      <Overlay className="overlay">
        <UserInfo>
          <Username>@{item.username}</Username>
          <BadgesContainer>
            <Badge>{item.bodyType}</Badge>
            <HeightBadge>{item.height}cm</HeightBadge>
          </BadgesContainer>
        </UserInfo>
      </Overlay>
      <LikeButton
        $liked={item.isLiked}
        onClick={handleLikeClick}
        aria-label={item.isLiked ? "좋아요 취소" : "좋아요"}
        aria-pressed={item.isLiked}
      >
        {item.isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
      </LikeButton>
    </CardContainer>
  );
}
