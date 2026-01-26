import type {
  FeedListRequest,
  FeedListResponse,
  FeedListApiParams,
  LikeToggleRequest,
  LikeToggleResponse,
} from "./community.types";

import axiosInstance from "@/shared/api/axios";

/**
 * 프론트엔드 상태를 API 파라미터로 변환
 */
function buildFeedApiParams(request: FeedListRequest): FeedListApiParams {
  const params: FeedListApiParams = {};

  // 1. 정렬 값 변환 (추천순과 인기순 모두 popular로)
  params.sort =
    request.sortBy === "recommended" || request.sortBy === "popular" ? "popular" : "latest";

  // 2. 성별 필터
  if (request.filters.gender) {
    params.gender = request.filters.gender;
  }

  // 3. 스타일 필터 (소문자로 변환하여 쉼표로 결합)
  if (request.filters.styles && request.filters.styles.length > 0) {
    params.style = request.filters.styles.map((s) => s.toLowerCase()).join(",");
  }

  // 4. 키 범위 필터
  if (request.filters.heightRange) {
    params.min_height = request.filters.heightRange.min;
    params.max_height = request.filters.heightRange.max;
  }

  // 5. 몸무게 범위 필터
  if (request.filters.weightRange) {
    params.min_weight = request.filters.weightRange.min;
    params.max_weight = request.filters.weightRange.max;
  }

  // 6. 페이징 파라미터
  params.page = request.page;
  params.size = request.limit;

  return params;
}

/**
 * 피드 리스트 조회
 */
export async function getFeedList(request: FeedListRequest): Promise<FeedListResponse> {
  const apiParams = buildFeedApiParams(request);
  const { data } = await axiosInstance.get<FeedListResponse>(`/feed`, {
    params: apiParams,
  });
  return data;
}

/**
 * 피드 좋아요 토글
 */
export async function toggleLike(request: LikeToggleRequest): Promise<LikeToggleResponse> {
  const { data } = await axiosInstance.post<LikeToggleResponse>(`/feed/${request.feedId}/like`);
  return data;
}
