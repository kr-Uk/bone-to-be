import * as S from "./LikesPanel.styles";

import type { LikesPanelProps } from "./types";

export function LikesPanel({ isOpen, onClose, likeUsers }: LikesPanelProps) {
  if (!isOpen) return null;

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
              return (
                <S.LikeItem key={user.id}>
                  <S.LikeLeft>
                    <S.LikeAvatar />
                    <div>
                      <S.LikeName>{user.username}</S.LikeName>
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
