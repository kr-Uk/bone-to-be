import styled from "styled-components";
import { CommentInput } from "./CommentInput";
import { IoIosMore } from "react-icons/io";
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

import type { FeedComment, FeedDetail } from "../api";

interface Props {
  detail: FeedDetail | null;
  comments: FeedComment[];
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

export function FeedDetailRight({ detail, comments, isLoading, hasError }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [replyTarget, setReplyTarget] = useState<{ id: string; username: string } | null>(
    null,
  );
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const likeToggleMutation = useLikeToggle();
  const createCommentMutation = useCreateFeedComment();

  useEffect(() => {
    if (!detail) return;
    setLiked(detail.isLiked);
    setSaved(detail.isSaved);
    setLikeCount(detail.likeCount);
  }, [detail]);

  const handleLikeToggle = () => {
    if (!detail) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((count) => (nextLiked ? count + 1 : count - 1));
    likeToggleMutation.mutate({ feedId: detail.id });
  };

  const handleReplyClick = (username: string, commentId: string) => {
    const mention = `@${username} `;
    setReplyTarget({ id: commentId, username });
    setCommentInput((prev) => {
      if (prev.startsWith(mention)) return prev;
      const stripped = prev.replace(/^@\S+\s+/, "");
      return `${mention}${stripped}`;
    });
    commentInputRef.current?.focus();
  };

  const handleSubmitComment = () => {
    if (!detail) return;
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    createCommentMutation.mutate({
      feedId: detail.id,
      text: trimmed,
      parentCommentId: replyTarget?.id ?? null,
    });

    setCommentInput("");
    setReplyTarget(null);
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
      <Header>
        <UserInfo>
          <Avatar />
          <div>
            <Username>{detail?.author.username ?? "Loading..."}</Username>
            <SubInfo>
              {detail
                ? `${detail.author.bodyType} · ${detail.author.location}`
                : "Loading..."}
            </SubInfo>
          </div>
        </UserInfo>
        <IoIosMore color="#FAFAFA" size={25} />
      </Header>

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

      <CommentsSection>
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
                time={formatTimeAgo(comment.createdAt)}
                onReply={() => handleReplyClick(comment.username, comment.id)}
              />
            </CommentRowWrapper>
          ))
        )}
      </CommentsSection>

      <Footer>
        <ActionRow>
          <LeftActions>
            <HeartButton liked={liked} onClick={handleLikeToggle}>
              {liked ? <FaHeart size={32}/> : <FaRegHeart size={32}/>}
            </HeartButton>

            <IconButton onClick={() => commentInputRef.current?.focus()}>
              <FaRegComment size={32}/>
            </IconButton>

          </LeftActions>

          <IconButton onClick={() => setSaved((v) => !v)}>
            {saved ? <FaBookmark size={32}/> : <FaRegBookmark size={32}/>}
          </IconButton>
        </ActionRow>

        <Likes>{likeCount} likes</Likes>

        <CommentInput
          ref={commentInputRef}
          value={commentInput}
          onChange={setCommentInput}
          onSubmit={handleSubmitComment}
          placeholder={
            replyTarget ? `@${replyTarget.username} 님에게 답글 달기...` : "댓글 달기 ..."
          }
          disabled={createCommentMutation.isPending}
        />
      </Footer>
    </RightContainer>
  );
}

const RightContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #050505;
  overflow-y: auto;

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

`;



const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #525252;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
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
  font-weight: 700;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

const SubInfo = styled.div`
  color: #a1a1a1;
  font-size: 14px;
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

  @media (max-width: 390px) {
    font-size: 12px;
  }
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

  @media (max-width: 390px) {
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
  padding: 16px;
  border-top: 1px solid #525252;
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


const Likes = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

