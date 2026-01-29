import axios from "axios";

import type {
  FeedListRequest,
  FeedListApiParams,
  FeedDetailDto,
  FeedCommentListRequest,
  FeedLikesRequest,
  FeedCommentCreateRequest,
  FeedCommentDto,
  LikeToggleRequest,
  LikeToggleResponseDto,
  FeedListResponseDto,
  ApiFeedListResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
  FeedCreateRequest,
  FeedCreateResponse,
  ApiResponse,
  FeedLikeUserDto,
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
    params.gender = request.filters.gender === "F" ? "female" : "male";
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
export async function getFeedList(request: FeedListRequest): Promise<FeedListResponseDto> {
  const apiParams = buildFeedApiParams(request);
  const { data } = await axiosInstance.get<ApiFeedListResponse>(`/feeds`, {
    params: apiParams,
  });

  // 백엔드 응답을 프론트엔드 형태로 변환
  return {
    items: data.data.content,
    total: data.data.totalElements,
    page: data.data.pageNumber,
    hasMore: !data.data.last,
  };
}

/**
 * 피드 상세 조회
 */
export async function getFeedDetail(feedId: string): Promise<FeedDetailDto> {
  const { data } = await axiosInstance.get<ApiResponse<FeedDetailDto>>(`/feeds/${feedId}`);
  return data.data; // 래퍼 언래핑
}

/**
 * 댓글 리스트 조회
 */
export async function getFeedComments(request: FeedCommentListRequest): Promise<FeedCommentDto[]> {
  const { data } = await axiosInstance.get<ApiResponse<FeedCommentDto[]>>(
    `/feeds/${request.feedId}/replies`, // comments → replies
    {
      params: {
        page: request.page,
        size: request.limit,
      },
    },
  );
  return data.data; // 래퍼 언래핑
}

/**
 * 좋아요 리스트 조회
 */
export async function getFeedLikes(request: FeedLikesRequest): Promise<FeedLikeUserDto[]> {
  const { data } = await axiosInstance.get<ApiResponse<FeedLikeUserDto[]>>(
    `/feeds/${request.feedId}/likes`,
    {
      params: {
        page: request.page,
        size: request.limit,
      },
    },
  );
  return data.data; // 래퍼 언래핑
}

/**
 * 댓글 작성
 */
export async function createFeedComment(
  request: FeedCommentCreateRequest,
): Promise<FeedCommentDto> {
  const { data } = await axiosInstance.post<FeedCommentDto>(`/feeds/${request.feedId}/comments`, {
    text: request.text,
    parentCommentId: request.parentCommentId ?? null,
  });
  return data;
}

/**
 * 피드 좋아요 토글
 */
export async function toggleLike(request: LikeToggleRequest): Promise<LikeToggleResponseDto> {
  const { data } = await axiosInstance.post<LikeToggleResponseDto>(`/feeds/${request.feedId}/like`);
  return data;
}

/**
 * 1단계: Presigned URL 발급
 */
export async function getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
  const { data } = await axiosInstance.post<PresignedUrlResponse>("/feeds/presigned-url", request);
  return data;
}

/**
 * 2단계-A: S3에 이미지 직접 업로드
 */
export async function uploadImageToS3(
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
  });
}

/**
 * 2단계-B: 피드 생성 (JSON 형식)
 */
export async function createFeed(request: FeedCreateRequest): Promise<FeedCreateResponse> {
  const { data } = await axiosInstance.post<FeedCreateResponse>("/feeds", request, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

/**
 * 댓글 좋아요 토글
 */
export async function toggleCommentLike(replyId: string, isLiked: boolean): Promise<void> {
  const method = isLiked ? "delete" : "post";
  await axiosInstance[method]<ApiResponse<null>>(`/replies/${replyId}/likes`);
}
