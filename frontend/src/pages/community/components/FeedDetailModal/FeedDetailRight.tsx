import { useEffect, useRef, useState } from "react";
import { FaRegHeart, FaHeart, FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";

import { CommentInput } from "../CommentInput";

import { CommentSection } from "./CommentSection";
import * as S from "./FeedDetailRight.styles";
import { useFeedDetailState } from "./hooks/useFeedDetailState";
import { LikesPanel } from "./LikesPanel";
import { formatTimeAgo } from "./utils";

import type { FeedDetailRightProps } from "./types";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

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

  return (
    <S.RightContainer>
      <S.DesktopHeader>
        {detail?.author.avatarUrl ? (
          <S.DesktopAvatar src={detail.author.avatarUrl} alt="profile" />
        ) : (
          <S.DesktopAvatarFallback />
        )}
        <div>
          <S.DesktopName>{detail?.author.username ?? "Loading..."}</S.DesktopName>
          <S.DesktopMeta>{desktopMeta}</S.DesktopMeta>
        </div>
      </S.DesktopHeader>
      <S.ContentStack>
        <S.PostContent>
          <S.Avatar />
          <div>
            <S.Username>{detail?.author.username ?? "Loading..."}</S.Username>
            {(detail?.content ?? []).map((line: string, index: number) => (
              <S.Text key={`content-${index}`}>{line}</S.Text>
            ))}
            <S.Tags>{(detail?.tags ?? []).map((tag: string) => `#${tag}`).join(" ")}</S.Tags>
            <S.Time>{detail?.createdAt ? formatTimeAgo(detail.createdAt) : ""}</S.Time>
          </div>
        </S.PostContent>

        <CommentSection comments={comments} isLoading={isLoading} hasError={hasError} />
      </S.ContentStack>

      <S.BottomStack>
        <S.Footer>
          <S.ActionRow>
            <S.LeftActions>
              <S.HeartButton $liked={liked} onClick={handleLikeToggle}>
                {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
              </S.HeartButton>

              <S.IconButton onClick={handleCommentNavigate}>
                <FaRegComment size={20} />
              </S.IconButton>
            </S.LeftActions>

            <S.IconButton onClick={handleSaveToggle}>
              {saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
            </S.IconButton>
          </S.ActionRow>

          <S.LikesButton type="button" onClick={() => setIsLikesOpen(true)}>
            {likeCount} likes
          </S.LikesButton>

          <LikesPanel
            isOpen={isLikesOpen}
            onClose={() => setIsLikesOpen(false)}
            likeUsers={likeUsers}
            likeCount={likeCount}
          />
        </S.Footer>
        {(!isMobile || isInputVisible) && (
          <S.FixedInput>
            <CommentInput
              ref={commentInputRef}
              value={commentInput}
              onChange={setCommentInput}
              onSubmit={handleSubmitComment}
              placeholder={"댓글 달기 ..."}
              disabled={isSubmittingComment}
            />
          </S.FixedInput>
        )}
      </S.BottomStack>
    </S.RightContainer>
  );
}
