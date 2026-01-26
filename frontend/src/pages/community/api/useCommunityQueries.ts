import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFeedList, toggleLike, createFeed } from "./community.api";

import type {
  FeedListRequest,
  FeedListResponse,
  LikeToggleRequest,
  FeedCreateRequest,
} from "./community.types";

/**
 * 피드 리스트 조회 쿼리
 */
export function useFeedList(request: FeedListRequest) {
  return useQuery<FeedListResponse, Error>({
    queryKey: ["feedList", request],
    queryFn: () => getFeedList(request),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 피드 좋아요 토글 뮤테이션
 */
export function useLikeToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LikeToggleRequest) => toggleLike(request),
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["feedList"] });
    },
  });
}

/**
 * 피드 생성 뮤테이션
 */
export function useFeedCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FeedCreateRequest) => createFeed(request),
    onSuccess: () => {
      // 피드 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["feedList"] });
    },
  });
}
