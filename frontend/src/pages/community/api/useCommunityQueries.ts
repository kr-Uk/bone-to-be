import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFeedComments, getFeedDetail, getFeedList, toggleLike } from "./community.api";

import type {
  FeedCommentListRequest,
  FeedCommentListResponse,
  FeedDetail,
  FeedListRequest,
  FeedListResponse,
  LikeToggleRequest,
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
 * 피드 상세 조회 쿼리
 */
export function useFeedDetail(feedId: string) {
  return useQuery<FeedDetail, Error>({
    queryKey: ["feedDetail", feedId],
    queryFn: () => getFeedDetail(feedId),
    enabled: Boolean(feedId),
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 댓글 리스트 조회 쿼리
 */
export function useFeedComments(request: FeedCommentListRequest) {
  return useQuery<FeedCommentListResponse, Error>({
    queryKey: ["feedComments", request.feedId, request.page, request.limit],
    queryFn: () => getFeedComments(request),
    enabled: Boolean(request.feedId),
    staleTime: 1000 * 30, // 30초
  });
}

/**
 * 피드 좋아요 토글 뮤테이션
 */
export function useLikeToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LikeToggleRequest) => toggleLike(request),
    onSuccess: (_, request) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["feedList"] });
      queryClient.invalidateQueries({ queryKey: ["feedDetail", request.feedId] });
    },
  });
}
