import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  getFeedList,
  toggleLike,
  getPresignedUrl,
  uploadImageToS3,
  createFeed,
  createFeedComment,
  getFeedComments,
  getFeedDetail,
  getFeedLikes,
} from "./community.api";

import type {
  FeedCommentListRequest,
  FeedCommentListResponse,
  FeedCommentCreateRequest,
  FeedDetail,
  FeedListResponseDto,
  FeedListItemDto,
  FeedDetailDto,
  FeedCommentListResponseDto,
  FeedCommentDto,
  FeedLikesRequest,
  FeedLikesResponseDto,
  FeedLikeUserDto,
  FeedLikeUser,
  FeedListRequest,
  FeedListResponse,
  LikeToggleRequest,
  FeedCreateRequest,
} from "./community.types";

const mapGenderToUi = (gender: "female" | "male"): "F" | "M" => (gender === "female" ? "F" : "M");

const mapContentToLines = (content: string) => {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length > 0) return lines;
  return content ? [content] : [];
};

const mapFeedItemDtoToUi = (item: FeedListItemDto) => ({
  id: String(item.postId),
  imageUrl: item.imageUrl,
  username: item.author.nickname,
  bodyType: item.skeletonType,
  height: item.height,
  weight: item.weight,
  styles: item.style,
  gender: mapGenderToUi(item.gender),
  isLiked: item.isLiked,
  likeCount: item.likeCount,
  createdAt: item.createdAt,
});

const mapFeedDetailDtoToUi = (detail: FeedDetailDto): FeedDetail => ({
  id: String(detail.postId),
  imageUrl: detail.imageUrl,
  author: {
    username: detail.author.nickname,
    bodyType: detail.skeletonType,
    location: "Unknown",
    avatarUrl: detail.author.profileImageUrl,
  },
  height: detail.height,
  weight: detail.weight,
  content: mapContentToLines(detail.content),
  tags: detail.style,
  createdAt: detail.createdAt,
  isLiked: detail.isLiked,
  likeCount: detail.likeCount,
  likeUsers: [],
  commentCount: detail.commentCount,
  isSaved: false,
});

const mapFeedCommentDtoToUi = (comment: FeedCommentDto) => ({
  id: String(comment.replyId),
  username: comment.author.nickname,
  text: comment.replyContent,
  createdAt: comment.createdAt,
  likeCount: comment.likeCount,
  isLiked: comment.isLiked,
  parentCommentId: null,
});

const mapFeedLikeUserDtoToUi = (user: FeedLikeUserDto): FeedLikeUser => ({
  id: String(user.memberId),
  username: user.nickname,
  displayName: user.nickname,
  avatarUrl: user.profileImageUrl,
  isFollowing: user.isFollowing,
});

/**
 * 피드 리스트 조회 쿼리
 */
export function useFeedList(request: FeedListRequest) {
  return useQuery<FeedListResponseDto, Error, FeedListResponse>({
    queryKey: ["feedList", request],
    queryFn: () => getFeedList(request),
    staleTime: 1000 * 60 * 5, // 5분
    select: (data) => ({
      items: data.items.map(mapFeedItemDtoToUi),
      total: data.total,
      page: data.page,
      hasMore: data.hasMore,
    }),
  });
}

/**
 * 피드 상세 조회 쿼리
 */
export function useFeedDetail(feedId: string) {
  return useQuery<FeedDetailDto, Error, FeedDetail>({
    queryKey: ["feedDetail", feedId],
    queryFn: () => getFeedDetail(feedId),
    enabled: Boolean(feedId),
    staleTime: 1000 * 60 * 2, // 2분
    select: mapFeedDetailDtoToUi,
  });
}

/**
 * 댓글 리스트 조회 쿼리
 */
export function useFeedComments(request: FeedCommentListRequest) {
  return useQuery<FeedCommentListResponseDto, Error, FeedCommentListResponse>({
    queryKey: ["feedComments", request.feedId, request.page, request.limit],
    queryFn: () => getFeedComments(request),
    enabled: Boolean(request.feedId),
    staleTime: 1000 * 30, // 30초
    select: (data) => ({
      items: data.comments.map(mapFeedCommentDtoToUi),
      total: data.commentCount,
      page: request.page,
      hasMore: data.hasNext,
    }),
  });
}

/**
 * 좋아요 리스트 조회 쿼리
 */
export function useFeedLikes(request: FeedLikesRequest) {
  return useQuery<
    FeedLikesResponseDto,
    Error,
    { likeCount: number; likes: FeedLikeUser[]; hasMore: boolean }
  >({
    queryKey: ["feedLikes", request.feedId, request.page, request.limit],
    queryFn: () => getFeedLikes(request),
    enabled: Boolean(request.feedId),
    staleTime: 1000 * 30,
    select: (data) => ({
      likeCount: data.likeCount,
      likes: data.likes.map(mapFeedLikeUserDtoToUi),
      hasMore: data.hasNext,
    }),
  });
}

/**
 * 댓글 작성 뮤테이션
 */
export function useCreateFeedComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FeedCommentCreateRequest) => createFeedComment(request),
    onSuccess: (_, request) => {
      queryClient.invalidateQueries({ queryKey: ["feedComments", request.feedId] });
      queryClient.invalidateQueries({ queryKey: ["feedDetail", request.feedId] });
    },
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

/**
 * 통합 피드 생성 훅 (3단계 조합)
 * 1. Presigned URL 발급
 * 2. S3 업로드
 * 3. 피드 생성
 */
export function useFeedCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      file: File;
      content: string;
      gender: "F" | "M";
      bodyType: "Natural" | "Wave" | "Straight";
      styles: string[];
      height: number;
      weight: number;
    }) => {
      try {
        // 1단계: Presigned URL 발급
        const presignedResponse = await getPresignedUrl({
          originalFileName: params.file.name,
          contentType: params.file.type,
          fileSize: params.file.size,
        });

        // 2단계: S3 업로드 (재시도 포함)
        let uploadAttempts = 0;
        const MAX_UPLOAD_RETRIES = 3;

        while (uploadAttempts < MAX_UPLOAD_RETRIES) {
          try {
            await uploadImageToS3(presignedResponse.data.uploadUrl, params.file, params.file.type);
            break; // 성공 시 탈출
          } catch {
            uploadAttempts++;
            if (uploadAttempts >= MAX_UPLOAD_RETRIES) {
              throw new Error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
            }
            // 재시도 전 대기 (exponential backoff)
            await new Promise((resolve) => setTimeout(resolve, 1000 * uploadAttempts));
          }
        }

        // 3단계: 피드 생성 (데이터 변환)
        const feedRequest: FeedCreateRequest = {
          fileId: presignedResponse.data.fileId,
          content: params.content,
          gender: params.gender === "F" ? "female" : "male",
          skeletonType: params.bodyType.toLowerCase() as "natural" | "wave" | "straight",
          style: params.styles.map((s) => s.toLowerCase()),
          height: params.height,
          weight: params.weight,
        };

        return await createFeed(feedRequest);
      } catch (error) {
        // 사용자 친화적인 에러 메시지로 변환
        if (axios.isAxiosError(error)) {
          const message =
            (error.response?.data as { message?: string } | undefined)?.message ||
            "피드 작성에 실패했습니다.";
          throw new Error(message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      // 피드 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["feedList"] });
    },
  });
}
