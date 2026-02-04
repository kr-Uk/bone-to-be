import { useMemo } from "react";

import { CommentRow } from "../../../CommentRow";
import { formatTimeAgo } from "../../utils";
import { buildCommentTree } from "../../utils/commentTree";

import * as S from "./CommentSection.styles";

import type { CommentSectionProps } from "../../types";

import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";

export function CommentSection({ comments, isLoading, hasError }: CommentSectionProps) {
  const orderedComments = useMemo(() => buildCommentTree(comments), [comments]);
  const protectedNavigate = useProtectedNavigate();

  const handleUserClick = (userId: string) => {
    if (!userId) return;
    protectedNavigate(`/profile/${userId}`);
  };

  return (
    <S.CommentsSection>
      {hasError ? (
        <S.CommentStatus>댓글을 불러올 수 없습니다.</S.CommentStatus>
      ) : isLoading && comments.length === 0 ? (
        <S.CommentStatus>댓글 로딩 중...</S.CommentStatus>
      ) : comments.length === 0 ? (
        <S.CommentStatus>첫 댓글을 남겨보세요.</S.CommentStatus>
      ) : (
        orderedComments.map(({ comment, depth }) => (
          <S.CommentRowWrapper key={comment.id} $depth={depth}>
            <CommentRow
              userId={comment.userId}
              username={comment.username}
              text={comment.text}
              time={formatTimeAgo(comment.createdAt)}
              likeCount={0}
              onUserClick={handleUserClick}
            />
          </S.CommentRowWrapper>
        ))
      )}
    </S.CommentsSection>
  );
}
