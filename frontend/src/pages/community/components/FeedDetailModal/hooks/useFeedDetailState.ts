import axios from "axios";
import { useEffect, useState } from "react";

import { useCreateFeedComment, useFeedScrap, useLikeToggle } from "../../../api";
import { followUser, unfollowUser } from "@/pages/profile/api/profile.api";

import type { FeedLikeUser } from "../../../api";

export interface UseFeedDetailStateProps {
  feedId: string;
  initialLiked: boolean;
  initialSaved: boolean;
  initialLikeCount: number;
  initialLikeUsers: FeedLikeUser[];
}

export interface UseFeedDetailStateReturn {
  // 상태
  liked: boolean;
  saved: boolean;
  likeCount: number;
  likeUsers: FeedLikeUser[];

  // 액션
  handleLikeToggle: () => void;
  handleFollowToggle: (userId: string) => void;
  handleSaveToggle: () => void;
  handleCommentSubmit: (text: string) => void;

  // UI 상태
  isSubmittingComment: boolean;
}

export function useFeedDetailState({
  feedId,
  initialLiked,
  initialSaved,
  initialLikeCount,
  initialLikeUsers,
}: UseFeedDetailStateProps): UseFeedDetailStateReturn {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeUsers, setLikeUsers] = useState<FeedLikeUser[]>(initialLikeUsers);

  const likeToggleMutation = useLikeToggle();
  const createCommentMutation = useCreateFeedComment();
  const scrapMutation = useFeedScrap();

  // 서버 상태 동기화
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    setLikeUsers(initialLikeUsers);
  }, [initialLikeUsers]);

  const handleLikeToggle = () => {
    const nextLiked = !liked;

    // 낙관적 업데이트 (로컬 상태)
    setLiked(nextLiked);
    setLikeCount((count) => (nextLiked ? count + 1 : count - 1));

    // likeUsers 업데이트 (낙관적)
    setLikeUsers((users) => {
      const exists = users.some((user) => user.id === "me");

      if (nextLiked && !exists) {
        return [
          {
            id: "me",
            username: "me",
            displayName: "me",
            avatarUrl: null,
            isFollowing: false,
          },
          ...users,
        ];
      }

      if (!nextLiked && exists) {
        return users.filter((user) => user.id !== "me");
      }

      return users;
    });

    // 서버 요청 (현재 좋아요 상태 전달 - API가 토글 처리)
    likeToggleMutation.mutate(
      { feedId, isLiked: liked },
      {
        onError: () => {
          // 에러 발생 시 로컬 상태 롤백
          setLiked(liked);
          setLikeCount((count) => (liked ? count + 1 : count - 1));
          setLikeUsers((users) => {
            if (liked) {
              // 좋아요였다면 다시 추가
              return [
                {
                  id: "me",
                  username: "me",
                  displayName: "me",
                  avatarUrl: null,
                  isFollowing: false,
                },
                ...users.filter((u) => u.id !== "me"),
              ];
            }
            // 좋아요 아니었다면 다시 제거
            return users.filter((u) => u.id !== "me");
          });
        },
      },
    );
  };

  const handleFollowToggle = (userId: string) => {
    if (!userId) return;
    const target = likeUsers.find((user) => user.id === userId);
    if (!target) return;

    const prevIsFollowing = Boolean(target.isFollowing);
    const nextIsFollowing = !prevIsFollowing;

    setLikeUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, isFollowing: nextIsFollowing } : user,
      ),
    );

    const request = nextIsFollowing ? followUser(userId) : unfollowUser(userId);
    request.catch(() => {
      setLikeUsers((users) =>
        users.map((user) =>
          user.id === userId ? { ...user, isFollowing: prevIsFollowing } : user,
        ),
      );
    });
  };

  const handleSaveToggle = () => {
    if (!feedId || scrapMutation.isPending) return;
    const nextSaved = !saved;
    setSaved(nextSaved);

    scrapMutation.mutate(
      { feedId, isScrapped: saved },
      {
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const code = (error.response?.data as { code?: number } | undefined)?.code;
            if (!saved && (status === 409 || code === 2050)) {
              setSaved(true);
              return;
            }
            if (saved && status === 404) {
              setSaved(false);
              return;
            }
          }
          setSaved(saved);
        },
      },
    );
  };

  const handleCommentSubmit = (text: string) => {
    if (!text.trim()) return;

    createCommentMutation.mutate({
      feedId,
      content: text.trim(),
    });
  };

  return {
    liked,
    saved,
    likeCount,
    likeUsers,
    handleLikeToggle,
    handleFollowToggle,
    handleSaveToggle,
    handleCommentSubmit,
    isSubmittingComment: createCommentMutation.isPending,
  };
}
