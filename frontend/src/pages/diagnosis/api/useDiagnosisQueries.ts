import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getPresignedUrl,
  uploadImageToS3,
  submitAnalysisRequest,
  getAnalysisResult,
} from "./diagnosis.api";

import type {
  PresignedUrlResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
} from "./diagnosis.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

/**
 * Presigned URL 요청 훅
 */
export function usePresignedUrl(): UseMutationResult<
  PresignedUrlResponse,
  Error,
  { fileName: string; fileType: string }
> {
  return useMutation({
    mutationFn: ({ fileName, fileType }) => getPresignedUrl(fileName, fileType),
  });
}

/**
 * S3 업로드 훅
 */
export function useS3Upload(): UseMutationResult<
  void,
  Error,
  { uploadUrl: string; imageBlob: Blob }
> {
  return useMutation({
    mutationFn: ({ uploadUrl, imageBlob }) => uploadImageToS3(uploadUrl, imageBlob),
  });
}

/**
 * 분석 요청 훅
 */
export function useAnalysisRequest(): UseMutationResult<AnalysisResponse, Error, AnalysisRequest> {
  return useMutation({
    mutationFn: (request) => submitAnalysisRequest(request),
  });
}

/**
 * 분석 결과 조회 훅 (폴링 지원)
 */
export function useAnalysisResult(
  analysisId: string | null,
  enabled: boolean = false,
): UseQueryResult<AnalysisResult, Error> {
  return useQuery({
    queryKey: ["analysisResult", analysisId],
    queryFn: () => getAnalysisResult(analysisId!),
    enabled: enabled && !!analysisId,
    refetchInterval: (query) => {
      // 결과가 아직 processing 상태면 2초마다 폴링
      if (query.state.data?.analysisId) {
        return false; // 결과를 받으면 폴링 중지
      }
      return 2000;
    },
  });
}
