import styled from "styled-components";
import { CommentInput } from "./CommentInput";
import { CommentRow } from "./CommentRow";

import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCreateFeedComment, useLikeToggle } from "../api";

import type { FeedComment, FeedDetail, FeedLikeUser } from "../api";

interface Props {
  detail: FeedDetail | null;
  comments: FeedComment[];
  likeUsers?: FeedLikeUser[];
  likeCount?: number;
  isLoading?: boolean;
  hasError?: boolean;
}

function formatTimeAgo(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function FeedDetailRight({
  detail,
  comments,
  likeUsers: likeUsersProp,
  likeCount: likeCountProp,
  isLoading,
  hasError,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState<FeedLikeUser[]>([]);
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement | null>(null);
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
    <RightContainer>
      <DesktopHeader>
        {detail?.author.avatarUrl ? (
          <DesktopAvatar src={detail.author.avatarUrl} alt="profile" />
        ) : (
          <DesktopAvatarFallback />
        )}
        <div>
          <DesktopName>{detail?.author.username ?? "Loading..."}</DesktopName>
          <DesktopMeta>{desktopMeta}</DesktopMeta>
        </div>
      </DesktopHeader>
      <ContentStack>
        <PostContent>
          <Avatar />
          <div>
            <Username>{detail?.author.username ?? "Loading..."}</Username>
            {(detail?.content ?? []).map((line, index) => (
              <Text key={`content-${index}`}>{line}</Text>
            ))}
            <Tags>
              {(detail?.tags ?? []).map((tag) => `#${tag}`).join(" ")}
            </Tags>
            <Time>{detail?.createdAt ? formatTimeAgo(detail.createdAt) : ""}</Time>
          </div>
        </PostContent>

        <CommentsSection ref={commentsSectionRef}>
          {hasError ? (
            <CommentStatus>댓글을 불러올 수 없습니다.</CommentStatus>
          ) : isLoading && comments.length === 0 ? (
            <CommentStatus>댓글 로딩 중...</CommentStatus>
          ) : comments.length === 0 ? (
            <CommentStatus>첫 댓글을 남겨보세요.</CommentStatus>
          ) : (
            orderedComments.map(({ comment, depth }) => (
              <CommentRowWrapper key={comment.id} $depth={depth}>
                <CommentRow
                  username={comment.username}
                  text={comment.text}
                  time={formatTimeAgo(comment.createdAt)} likeCount={0}              />
              </CommentRowWrapper>
            ))
          )}
        </CommentsSection>
      </ContentStack>

      <BottomStack>
        <Footer>
          <ActionRow>
            <LeftActions>
              <HeartButton liked={liked} onClick={handleLikeToggle}>
                {liked ? <FaHeart size={20}/> : <FaRegHeart size={20}/>}
              </HeartButton>

              <IconButton onClick={handleCommentNavigate}>
                <FaRegComment size={20}/>
              </IconButton>

            </LeftActions>

            <IconButton onClick={() => setSaved((v) => !v)}>
              {saved ? <FaBookmark size={20}/> : <FaRegBookmark size={20}/>}
            </IconButton>
          </ActionRow>

          <LikesButton type="button" onClick={() => setIsLikesOpen(true)}>
            {likeCount} likes
          </LikesButton>

          {isLikesOpen && (
            <LikesOverlay onClick={() => setIsLikesOpen(false)}>
              <LikesPanel onClick={(event) => event.stopPropagation()}>
                <LikesHeader>
                  <LikesTitle>좋아요</LikesTitle>
                  <LikesCloseButton type="button" onClick={() => setIsLikesOpen(false)}>
                    ✕
                  </LikesCloseButton>
                </LikesHeader>
                {likeUsers.length === 0 ? (
                  <LikesEmpty>아직 좋아요가 없어요.</LikesEmpty>
                ) : (
                  <LikesList>
                    {likeUsers.map((user) => {
                      const secondary = user.displayName ?? [user.bodyType, user.location].filter(Boolean).join(" · ");
                      return (
                        <LikeItem key={user.id}>
                          <LikeLeft>
                            <LikeAvatar />
                            <div>
                              <LikeName>{user.username}</LikeName>
                              {secondary ? <LikeMeta>{secondary}</LikeMeta> : null}
                            </div>
                          </LikeLeft>
                          <FollowButton type="button">팔로우</FollowButton>
                        </LikeItem>
                      );
                    })}
                  </LikesList>
                )}
              </LikesPanel>
            </LikesOverlay>
          )}
        </Footer>
        {(!isMobile || isInputVisible) && (
          <FixedInput>
            <CommentInput
              ref={commentInputRef}
              value={commentInput}
              onChange={setCommentInput}
              onSubmit={handleSubmitComment}
              placeholder={"댓글 달기 ..."}
              disabled={createCommentMutation.isPending}
            />
          </FixedInput>
        )}
      </BottomStack>
    </RightContainer>
  );
}

const RightContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #262626;
  overflow-y: auto;
  position: relative;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;

  /* Chrome, Edge, Safari */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  @media (max-width: 430px) {
    overflow-y: hidden;
  }

  @media (max-width: 430px) {
    overflow-y: hidden;
  }
`;

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const BottomStack = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;

const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #3f3f3f;
  background: #262626;

  @media (max-width: 430px) {
    display: none;
  }
`;

const DesktopAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #525252;
  flex-shrink: 0;
`;

const DesktopAvatarFallback = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
`;

const DesktopName = styled.div`
  color: #fafafa;
  font-weight: 600;
  font-size: 15px;
`;

const DesktopMeta = styled.div`
  color: #a1a1a1;
  font-size: 13px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
`;

const Username = styled.div`
  color: #fafafa;
  font-weight: 600;
`;

const PostContent = styled.div`
  padding: 20px;
  display: inline-flex;
  flex: 0 0 Auto;
  gap: 6px;
  position: relative;
`;

const Text = styled.p`
  color: #fafafa;
`;

const Tags = styled.div`
  color: #9810fa;
`;

const Time = styled.div`
  color: #a1a1a1;
  font-size: 13px;
`;

const CommentsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Desktop */

  @media (max-width: 768px) {
    gap: 12px; /* Tablet */
  }

  @media (max-width: 430px) {
    gap: 8px; /* Mobile */
  }
`;

const CommentStatus = styled.div`
  color: #a1a1a1;
  font-size: 14px;
`;

const CommentRowWrapper = styled.div<{ $depth: number }>`
  padding-left: ${({ $depth }) => ($depth > 0 ? "24px" : "0")};
`;


const Footer = styled.div`
  padding: 16px 16px 0;
  position: relative;

  @media (max-width: 430px) {
    padding: 16px 16px 16px;
  }
`;


const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 16px;
`;

const IconButton = styled.button`
  font-size: 20px;
  color: #fafafa;
  cursor: pointer;

  svg {
    transition: all 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }
`;

const HeartButton = styled.button<{ liked: boolean }>`
  font-size: 20px;
  cursor: pointer;
  color: ${({ liked }) => (liked ? "#ef4444" : "#fafafa")};

  svg {
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }

  &:active svg {
    transform: scale(1.3);
  }
`;


const LikesButton = styled.button`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
    color: #e5e5e5;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 430px) {
    font-size: 14px;
  }
`;

const LikesOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const LikesPanel = styled.div`
  width: min(640px, 92vw);
  max-height: 82vh;
  background: #202124;
  border: 1px solid #2f3033;
  border-radius: 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const LikesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 14px 18px;
  border-bottom: 1px solid #2f3033;
`;

const LikesTitle = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
`;

const LikesCloseButton = styled.button`
  color: #a1a1a1;
  font-size: 22px;
  cursor: pointer;
  transition: color 0.2s ease;
  position: absolute;
  right: 16px;
  top: 8px;

  &:hover {
    color: #fafafa;
  }
`;

const LikesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  padding: 6px 0;
  max-height: 504px;
`;

const LikeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  min-height: 72px;
`;

const LikeLeft = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const LikeAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
`;

const LikeName = styled.div`
  color: #fafafa;
  font-weight: 600;
  font-size: 15px;
`;

const LikeMeta = styled.div`
  color: #a1a1a1;
  font-size: 14px;
`;

const LikesEmpty = styled.div`
  color: #a1a1a1;
  font-size: 15px;
  padding: 16px 18px;
`;

const FollowButton = styled.button`
  background: #6366f1;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FixedInput = styled.div`
  position: relative;
  background: #262626;
  padding: 12px 16px;
  border-top: 1px solid #525252;

  @media (max-width: 430px) {
    padding: 12px 16px 12px;
  }
`;


