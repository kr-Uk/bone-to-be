import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  getFeedList,
  addFeedLike,
  removeFeedLike,
  addFeedScrap,
  getPresignedUrl,
  uploadImageToS3,
  createFeed,
  createFeedComment,
  getFeedComments,
  getFeedDetail,
  getFeedLikes,
  toggleCommentLike,
} from "./community.api";

import type {
  FeedCommentListRequest,
  FeedCommentListResponse,
  FeedCommentCreateRequest,
  FeedDetail,
  FeedListResponseDto,
  FeedListItemDto,
  FeedDetailDto,
  FeedCommentDto,
  FeedLikesRequest,
  FeedLikeUserDto,
  FeedLikeUser,
  FeedListRequest,
  FeedListResponse,
  FeedCreateRequest,
  CommentLikeToggleRequest,
} from "./community.types";

const mapGenderToUi = (gender: "FEMALE" | "MALE"): "F" | "M" => (gender === "FEMALE" ? "F" : "M");

const mapSkeletonTypeToUi = (
  type: "STRAIGHT" | "WAVE" | "NATURAL",
): "Straight" | "Wave" | "Natural" => {
  const map = {
    STRAIGHT: "Straight" as const,
    WAVE: "Wave" as const,
    NATURAL: "Natural" as const,
  };
  return map[type];
};

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
  username: "익명", // author 필드가 없으므로 기본값 제공
  bodyType: mapSkeletonTypeToUi(item.skeletonType), // "NATURAL" → "Natural"
  height: item.height,
  weight: item.weight,
  styles: item.style.map((s) => s.toLowerCase()), // ["MINIMAL", "STREET"] → ["minimal", "street"]
  gender: mapGenderToUi(item.gender), // "FEMALE" → "F"
  isLiked: item.isLiked,
  likeCount: 0, // likeCount 필드가 없으므로 기본값 0 제공
  createdAt: item.createdAt,
});

const mapFeedDetailDtoToUi = (detail: FeedDetailDto): FeedDetail => ({
  id: String(detail.postId),
  imageUrl: detail.imageUrl,
  author: {
    userId: String(detail.author.userId),
    username: detail.author.nickname,
    bodyType: detail.skeletonType,
    location: "Unknown",
    avatarUrl: detail.author.profileImageUrl,
  },
  height: detail.height,
  weight: detail.weight,
  content: mapContentToLines(detail.content),
  tags: detail.style.map((s) => s.toLowerCase()), // 대문자 → 소문자 변환
  createdAt: detail.createdAt,
  isLiked: detail.isLiked,
  likeCount: detail.likeCount,
  likeUsers: [],
  commentCount: detail.commentCount,
  isSaved: false,
});

const mapFeedCommentDtoToUi = (comment: FeedCommentDto) => ({
  id: String(comment.replyId),
  userId: String(comment.author.userId),
  username: comment.author.nickname,
  avatarUrl: comment.author.profileImageUrl,
  text: comment.content, // replyContent → content
  createdAt: comment.createdAt,
  likeCount: comment.likeCount,
  isLiked: comment.isLiked,
  isMine: comment.isMine, // 새로 추가
  parentCommentId: null,
});

const mapFeedLikeUserDtoToUi = (user: FeedLikeUserDto): FeedLikeUser => ({
  id: String(user.userId), // memberId → userId
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
  return useQuery<FeedCommentDto[], Error, FeedCommentListResponse>({
    queryKey: ["feedComments", request.feedId, request.page, request.limit],
    queryFn: () => getFeedComments(request),
    enabled: Boolean(request.feedId),
    staleTime: 1000 * 30, // 30초
    select: (data) => ({
      items: data.map(mapFeedCommentDtoToUi),
      total: data.length, // 실제 배열 길이
      page: request.page,
      hasMore: false, // API에서 페이징 정보 없음
    }),
  });
}

/**
 * 좋아요 리스트 조회 쿼리
 */
export function useFeedLikes(request: FeedLikesRequest) {
  return useQuery<FeedLikeUserDto[], Error, FeedLikeUser[]>({
    queryKey: ["feedLikes", request.feedId],
    queryFn: () => getFeedLikes(request),
    enabled: Boolean(request.feedId),
    staleTime: 1000 * 30,
    select: (data) => data.map(mapFeedLikeUserDtoToUi),
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
 * 피드 좋아요 토글 뮤테이션 (Optimistic Updates 적용)
 */
export function useLikeToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedId, isLiked }: { feedId: string; isLiked: boolean }) => {
      // 현재 좋아요 상태에 따라 추가/취소 API 호출
      if (isLiked) {
        await removeFeedLike(feedId);
      } else {
        await addFeedLike(feedId);
      }
    },
    onMutate: async ({ feedId, isLiked }) => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트와 충돌 방지)
      await queryClient.cancelQueries({ queryKey: ["feedDetail", feedId] });
      await queryClient.cancelQueries({ queryKey: ["feedList"] });

      // 이전 상태 스냅샷 저장
      const previousDetail = queryClient.getQueryData<FeedDetailDto>(["feedDetail", feedId]);

      // 낙관적 업데이트: 피드 상세의 좋아요 상태 즉시 변경
      queryClient.setQueryData<FeedDetailDto>(["feedDetail", feedId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !isLiked,
          likeCount: isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      // rollback을 위해 이전 상태 반환
      return { previousDetail };
    },
    onError: (_, { feedId }, context) => {
      // 에러 발생 시 이전 상태로 rollback
      if (context?.previousDetail) {
        queryClient.setQueryData(["feedDetail", feedId], context.previousDetail);
      }
    },
    onSettled: (_, __, { feedId }) => {
      // 성공/실패 무관하게 캐시 무효화하여 서버 상태 동기화
      queryClient.invalidateQueries({ queryKey: ["feedDetail", feedId] });
      queryClient.invalidateQueries({ queryKey: ["feedList"] });
      queryClient.invalidateQueries({ queryKey: ["feedLikes", feedId] });

      // Profile page 캐시도 무효화하여 좋아요 동기화
      queryClient.invalidateQueries({ queryKey: ["profile", "feeds"] });
    },
  });
}

/**
 * 피드 스크랩
 */
export function useFeedScrap() {
  return useMutation({
    mutationFn: (feedId: string) => addFeedScrap(feedId),
  });
}

/**
 * 댓글 좋아요 토글 뮤테이션
 */
export function useCommentLikeToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId, isLiked }: CommentLikeToggleRequest) =>
      toggleCommentLike(replyId, isLiked),
    onSuccess: () => {
      // 댓글 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["feedComments"] });
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
          skeletonType: params.bodyType.toUpperCase() as "NATURAL" | "WAVE" | "STRAIGHT",
          style: params.styles.map((s) => s.toUpperCase()),
          height: params.height,
          weight: params.weight,
        };

        console.log("Creating feed with request:", feedRequest);

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
