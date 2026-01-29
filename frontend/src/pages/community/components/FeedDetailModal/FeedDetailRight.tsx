import { useEffect, useRef, useState } from "react";
import { FaRegHeart, FaHeart, FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";

import { useCreateFeedComment, useLikeToggle } from "../../api";
import { CommentInput } from "../CommentInput";

import { CommentSection } from "./CommentSection";
import * as S from "./FeedDetailRight.styles";
import { LikesPanel } from "./LikesPanel";
import { formatTimeAgo } from "./utils";

import type { FeedDetailRightProps } from "./types";
import type { FeedLikeUser } from "../../api";

export function FeedDetailRight({
  detail,
  comments,
  likeUsers: likeUsersProp,
  likeCount: likeCountProp,
  isLoading,
  hasError,
}: FeedDetailRightProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState<FeedLikeUser[]>([]);
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const likeToggleMutation = useLikeToggle();
  const createCommentMutation = useCreateFeedComment();

  useEffect(() => {
    if (!detail) return;
    setLiked(detail.isLiked);
    setSaved(detail.isSaved);
    setLikeCount(detail.likeCount);
    setLikeUsers(detail.likeUsers ?? []);
  }, [detail]);

  useEffect(() => {
    if (typeof likeCountProp === "number") {
      setLikeCount(likeCountProp);
    }
  }, [likeCountProp]);

  useEffect(() => {
    if (likeUsersProp) {
      setLikeUsers(likeUsersProp);
    }
  }, [likeUsersProp]);

  useEffect(() => {
    const updateDevice = () => {
      setIsMobile(window.innerWidth <= 430);
    };
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsInputVisible(true);
      return;
    }
    setIsInputVisible(false);
  }, [isMobile, detail?.id]);

  const desktopMeta = detail?.height
    ? `키 ${detail.height}cm${detail.weight ? ` · 몸무게 ${detail.weight}kg` : ""}`
    : detail?.weight
      ? `몸무게 ${detail.weight}kg`
      : "정보 없음";

  const handleLikeToggle = () => {
    if (!detail) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((count) => (nextLiked ? count + 1 : count - 1));
    setLikeUsers((users) => {
      const exists = users.some((user) => user.id === "me");
      if (nextLiked && !exists) {
        return [
          {
            id: "me",
            username: "me",
            bodyType: "Wave",
            location: "Seoul, Korea",
            avatarUrl: null,
          },
          ...users,
        ];
      }
      if (!nextLiked && exists) {
        return users.filter((user) => user.id !== "me");
      }
      return users;
    });
    likeToggleMutation.mutate({ feedId: detail.id });
  };

  const handleSubmitComment = () => {
    if (!detail) return;
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    createCommentMutation.mutate({
      feedId: detail.id,
      text: trimmed,
    });

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

            <S.IconButton onClick={() => setSaved((v) => !v)}>
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
              disabled={createCommentMutation.isPending}
            />
          </S.FixedInput>
        )}
      </S.BottomStack>
    </S.RightContainer>
  );
}
