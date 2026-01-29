import { useEffect, useState } from "react";

import { useCreateFeedComment, useLikeToggle } from "../../../api";

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

    // 낙관적 업데이트
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

    // 서버 요청
    likeToggleMutation.mutate({ feedId });
  };

  const handleSaveToggle = () => {
    setSaved((prev) => !prev);
    // TODO: 서버 요청 추가 (API 완성 시)
  };

  const handleCommentSubmit = (text: string) => {
    if (!text.trim()) return;

    createCommentMutation.mutate({
      feedId,
      text: text.trim(),
    });
  };

  return {
    liked,
    saved,
    likeCount,
    likeUsers,
    handleLikeToggle,
    handleSaveToggle,
    handleCommentSubmit,
    isSubmittingComment: createCommentMutation.isPending,
  };
}
