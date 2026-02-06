import { type KeyboardEvent, useMemo } from "react";

import * as S from "./LikesPanel.styles";

import type { LikesPanelProps } from "../../types";

import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { useAuth } from "@/shared/hooks/useAuth";
import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";

export function LikesPanel({
  isOpen,
  onClose,
  likeUsers,
  onFollowToggle,
  onUserNavigate,
}: LikesPanelProps) {
  const protectedNavigate = useProtectedNavigate();
  const { me } = useAuth();
  const currentUserId = me?.userId != null ? String(me.userId) : null;
  const orderedUsers = useMemo(() => {
    const targetId = currentUserId ?? "me";
    if (!targetId) return likeUsers;
    const index = likeUsers.findIndex(
      (user) =>
        user.id === targetId ||
        user.id === "me" ||
        (me?.nickname && user.username === me.nickname),
    );
    if (index <= 0) return likeUsers;
    const next = [...likeUsers];
    const [meUser] = next.splice(index, 1);
    return [meUser, ...next];
  }, [currentUserId, likeUsers, me?.nickname]);

  if (!isOpen) return null;

  const handleUserClick = (userId: string) => {
    if (!userId) return;
    onClose();
    onUserNavigate?.();
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
        {orderedUsers.length === 0 ? (
          <S.LikesEmpty>아직 좋아요가 없어요.</S.LikesEmpty>
        ) : (
          <S.LikesList>
            {orderedUsers.map((user) => {
              const secondary =
                user.displayName ?? [user.bodyType, user.location].filter(Boolean).join(" · ");
              const isMe =
                user.id === "me" ||
                (currentUserId != null && user.id === currentUserId) ||
                (me?.nickname != null && user.username === me.nickname);
              const isFollowing = Boolean(user.isFollowing);
              const buttonLabel = isFollowing ? "팔로잉" : "팔로우";
              const handleClick = () => handleUserClick(user.id);
              const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) =>
                handleUserKeyDown(event, user.id);
              return (
                <S.LikeItem key={user.id}>
                  <S.LikeLeft>
                    <ProfileAvatar
                      src={user.avatarUrl}
                      alt={`${user.username} avatar`}
                      size="2.75rem"
                      role="button"
                      tabIndex={0}
                      onClick={handleClick}
                      onKeyDown={handleKeyDown}
                      aria-label={`${user.username} 사용자 프로필 보기`}
                    />
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
                  {!isMe && (
                    <S.FollowButton
                      type="button"
                      data-active={isFollowing}
                      onClick={() => onFollowToggle(user.id)}
                    >
                      {buttonLabel}
                    </S.FollowButton>
                  )}
                </S.LikeItem>
              );
            })}
          </S.LikesList>
        )}
      </S.LikesPanel>
    </S.LikesOverlay>
  );
}
