import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  getFeedList,
  toggleLike,
  getPresignedUrl,
  uploadImageToS3,
  createFeed,
} from "./community.api";

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
            await uploadImageToS3(
              presignedResponse.data.uploadUrl,
              params.file,
              params.file.type,
            );
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
