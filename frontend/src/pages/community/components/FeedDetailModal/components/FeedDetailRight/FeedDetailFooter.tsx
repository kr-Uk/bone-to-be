import { CommentInput } from "../../../CommentInput";
import { LikesPanel } from "../LikesPanel";

import * as S from "./FeedDetailRight.styles";

import type { FeedLikeUser } from "../../../../api";
import type { RefObject } from "react";

export interface FeedDetailFooterProps {
  likeCount: number;
  likeUsers: FeedLikeUser[];
  isLikesOpen: boolean;
  onLikesClick: () => void;
  onLikesClose: () => void;
  commentInput: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  isCommentInputVisible: boolean;
  isSubmitting: boolean;
  commentInputRef: RefObject<HTMLInputElement | null>;
  isMobile: boolean;
}

export function FeedDetailFooter({
  likeCount,
  likeUsers,
  isLikesOpen,
  onLikesClick,
  onLikesClose,
  commentInput,
  onCommentChange,
  onCommentSubmit,
  isCommentInputVisible,
  isSubmitting,
  commentInputRef,
  isMobile,
}: FeedDetailFooterProps) {
  return (
    <>
      <S.LikesButton type="button" onClick={onLikesClick}>
        {likeCount} likes
      </S.LikesButton>

      <LikesPanel
        isOpen={isLikesOpen}
        onClose={onLikesClose}
        likeUsers={likeUsers}
        likeCount={likeCount}
      />

      {(!isMobile || isCommentInputVisible) && (
        <S.FixedInput>
          <CommentInput
            ref={commentInputRef}
            value={commentInput}
            onChange={onCommentChange}
            onSubmit={onCommentSubmit}
            placeholder={"댓글 달기 ..."}
            disabled={isSubmitting}
          />
        </S.FixedInput>
      )}
    </>
  );
}
