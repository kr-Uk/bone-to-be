import type {
  FeedListRequest,
  FeedListResponse,
  LikeToggleRequest,
  LikeToggleResponse,
} from "./community.types";

import axiosInstance from "@/shared/api/axios";

const BASE_PATH = "/v1/community";

/**
 * 피드 리스트 조회
 */
export async function getFeedList(request: FeedListRequest): Promise<FeedListResponse> {
  const { data } = await axiosInstance.get<FeedListResponse>(`${BASE_PATH}/feed`, {
    params: request,
  });
  return data;
}

/**
 * 피드 좋아요 토글
 */
export async function toggleLike(request: LikeToggleRequest): Promise<LikeToggleResponse> {
  const { data } = await axiosInstance.post<LikeToggleResponse>(
    `${BASE_PATH}/feed/${request.feedId}/like`,
  );
  return data;
}
