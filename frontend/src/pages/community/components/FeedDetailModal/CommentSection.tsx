import { useMemo } from "react";

import { CommentRow } from "../CommentRow";

import * as S from "./CommentSection.styles";
import { formatTimeAgo } from "./utils";

import type { CommentSectionProps } from "./types";
import type { FeedComment } from "../../api";

export function CommentSection({ comments, isLoading, hasError }: CommentSectionProps) {
  const orderedComments = useMemo(() => {
    const byId = new Map<string, FeedComment>();
    const children = new Map<string, FeedComment[]>();

    for (const comment of comments) {
      byId.set(comment.id, comment);
    }

    for (const comment of comments) {
      const parentId = comment.parentCommentId ?? null;
      if (!parentId) continue;
      const list = children.get(parentId) ?? [];
      list.push(comment);
      children.set(parentId, list);
    }

    const topLevel = comments.filter(
      (comment) => !comment.parentCommentId || !byId.has(comment.parentCommentId),
    );

    const ordered: Array<{ comment: FeedComment; depth: number }> = [];

    const visit = (comment: FeedComment, depth: number) => {
      ordered.push({ comment, depth });
      const kids = children.get(comment.id);
      if (!kids) return;
      for (const child of kids) {
        visit(child, depth + 1);
      }
    };

    for (const comment of topLevel) {
      visit(comment, 0);
    }

    return ordered;
  }, [comments]);

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
              username={comment.username}
              text={comment.text}
              time={formatTimeAgo(comment.createdAt)}
              likeCount={0}
            />
          </S.CommentRowWrapper>
        ))
      )}
    </S.CommentsSection>
  );
}
