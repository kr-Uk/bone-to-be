import { useEffect, useRef, useState } from "react";

import { useFeedDetailState } from "../../hooks/useFeedDetailState";
import { CommentSection } from "../CommentSection";

import { FeedDetailActions } from "./FeedDetailActions";
import { FeedDetailContent } from "./FeedDetailContent";
import { FeedDetailFooter } from "./FeedDetailFooter";
import { FeedDetailHeader } from "./FeedDetailHeader";
import * as S from "./FeedDetailRight.styles";

import type { FeedDetailRightProps } from "../../types";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";

export function FeedDetailRight({
  detail,
  comments,
  likeUsers: likeUsersProp,
  likeCount: likeCountProp,
  isLoading,
  hasError,
}: FeedDetailRightProps) {
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const protectedNavigate = useProtectedNavigate();

  const {
    liked,
    saved,
    likeCount,
    likeUsers,
    handleLikeToggle,
    handleSaveToggle,
    handleCommentSubmit: submitComment,
    isSubmittingComment,
  } = useFeedDetailState({
    feedId: detail?.id ?? "",
    initialLiked: detail?.isLiked ?? false,
    initialSaved: detail?.isSaved ?? false,
    initialLikeCount: likeCountProp ?? detail?.likeCount ?? 0,
    initialLikeUsers: likeUsersProp ?? detail?.likeUsers ?? [],
  });

  useEffect(() => {
    setIsInputVisible(!isMobile);
  }, [isMobile, detail?.id]);

  const desktopMeta = detail?.height
    ? `키 ${detail.height}cm${detail.weight ? ` · 몸무게 ${detail.weight}kg` : ""}`
    : detail?.weight
      ? `몸무게 ${detail.weight}kg`
      : "정보 없음";

  const handleSubmitComment = () => {
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    submitComment(trimmed);
    setCommentInput("");
  };

  const handleCommentNavigate = () => {
    if (isMobile) {
      setIsInputVisible((prev) => {
        const next = !prev;
        if (next) {
          requestAnimationFrame(() => commentInputRef.current?.focus());
        }
        return next;
      });
      return;
    }
    commentInputRef.current?.focus();
  };

  const handleAuthorClick = detail?.author.userId
    ? () => protectedNavigate(`/profile/${detail.author.userId}`)
    : undefined;

  return (
    <S.RightContainer>
      <FeedDetailHeader
        avatarUrl={detail?.author.avatarUrl ?? null}
        username={detail?.author.username ?? "Loading..."}
        meta={desktopMeta}
        onUserClick={handleAuthorClick}
      />

      <S.ContentStack>
        {detail && (
          <FeedDetailContent
            author={{
              userId: detail.author.userId,
              username: detail.author.username,
              avatarUrl: detail.author.avatarUrl,
            }}
            content={detail.content}
            tags={detail.tags}
            createdAt={detail.createdAt}
            onUserClick={handleAuthorClick}
          />
        )}

        <CommentSection comments={comments} isLoading={isLoading} hasError={hasError} />
      </S.ContentStack>

      <S.BottomStack>
        <S.Footer>
          <FeedDetailActions
            liked={liked}
            saved={saved}
            onLikeToggle={handleLikeToggle}
            onCommentClick={handleCommentNavigate}
            onSaveToggle={handleSaveToggle}
          />

          <FeedDetailFooter
            likeCount={likeCount}
            likeUsers={likeUsers}
            isLikesOpen={isLikesOpen}
            onLikesClick={() => setIsLikesOpen(true)}
            onLikesClose={() => setIsLikesOpen(false)}
            commentInput={commentInput}
            onCommentChange={setCommentInput}
            onCommentSubmit={handleSubmitComment}
            isCommentInputVisible={isInputVisible}
            isSubmitting={isSubmittingComment}
            commentInputRef={commentInputRef}
            isMobile={isMobile}
          />
        </S.Footer>
      </S.BottomStack>
    </S.RightContainer>
  );
}
