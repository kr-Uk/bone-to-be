import { type KeyboardEvent } from "react";

import * as S from "./LikesPanel.styles";

import type { LikesPanelProps } from "../../types";

import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";

export function LikesPanel({ isOpen, onClose, likeUsers }: LikesPanelProps) {
  const protectedNavigate = useProtectedNavigate();

  if (!isOpen) return null;

  const handleUserClick = (userId: string) => {
    if (!userId) return;
    protectedNavigate(`/profile/${userId}`);
  };

  const handleUserKeyDown = (event: KeyboardEvent<HTMLDivElement>, userId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleUserClick(userId);
    }
  };

  return (
    <S.LikesOverlay onClick={onClose}>
      <S.LikesPanel onClick={(event) => event.stopPropagation()}>
        <S.LikesHeader>
          <S.LikesTitle>좋아요</S.LikesTitle>
          <S.LikesCloseButton type="button" onClick={onClose}>
            ✕
          </S.LikesCloseButton>
        </S.LikesHeader>
        {likeUsers.length === 0 ? (
          <S.LikesEmpty>아직 좋아요가 없어요.</S.LikesEmpty>
        ) : (
          <S.LikesList>
            {likeUsers.map((user) => {
              const secondary =
                user.displayName ?? [user.bodyType, user.location].filter(Boolean).join(" · ");
              const handleClick = () => handleUserClick(user.id);
              const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) =>
                handleUserKeyDown(event, user.id);
              return (
                <S.LikeItem key={user.id}>
                  <S.LikeLeft>
                    <S.LikeAvatar
                      role="button"
                      tabIndex={0}
                      onClick={handleClick}
                      onKeyDown={handleKeyDown}
                      aria-label={`${user.username} 프로필 보기`}
                    >
                      {user.avatarUrl ? (
                        <S.LikeAvatarImage src={user.avatarUrl} alt={`${user.username} avatar`} />
                      ) : (
                        <S.LikeAvatarFallback />
                      )}
                    </S.LikeAvatar>
                    <div>
                      <S.LikeName
                        role="button"
                        tabIndex={0}
                        onClick={handleClick}
                        onKeyDown={handleKeyDown}
                        aria-label={`${user.username} 프로필 보기`}
                      >
                        {user.username}
                      </S.LikeName>
                      {secondary ? <S.LikeMeta>{secondary}</S.LikeMeta> : null}
                    </div>
                  </S.LikeLeft>
                  <S.FollowButton type="button">팔로우</S.FollowButton>
                </S.LikeItem>
              );
            })}
          </S.LikesList>
        )}
      </S.LikesPanel>
    </S.LikesOverlay>
  );
}
