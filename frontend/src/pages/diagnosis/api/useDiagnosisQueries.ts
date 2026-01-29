import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getPresignedUrl,
  uploadImageToS3,
  submitAnalysisRequest,
  getAnalysisResult,
  createPresignedUrl,
  createReport,
  getReportDetail,
} from "./diagnosis.api";

import type {
  PresignedUrlResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
  CreatePresignedUrlResponse,
  CreateReportRequest,
  CreateReportResponse,
  ReportDetailResponse,
} from "./diagnosis.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

/**
 * ===== 새로운 /reports API Hooks =====
 */

/**
 * Presigned URL 생성 훅 (새 API)
 */
export function useCreatePresignedUrl(): UseMutationResult<
  CreatePresignedUrlResponse["data"],
  Error,
  { originalFileName: string; contentType: string; fileSize: number }
> {
  return useMutation({
    mutationFn: ({ originalFileName, contentType, fileSize }) =>
      createPresignedUrl(originalFileName, contentType, fileSize),
  });
}

/**
 * S3 업로드 훅 (변경 없음)
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
 * 리포트 생성 훅 (분석 시작)
 */
export function useCreateReport(): UseMutationResult<
  CreateReportResponse["data"],
  Error,
  CreateReportRequest
> {
  return useMutation({
    mutationFn: (request) => createReport(request),
  });
}

/**
 * 리포트 상세 조회 훅 (폴링 지원)
 */
export function useReportDetail(
  reportId: number | null,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: ReportDetailResponse["data"]) => void;
    onError?: (error: Error) => void;
  }
): UseQueryResult<ReportDetailResponse["data"], Error> {
  return useQuery({
    queryKey: ["reportDetail", reportId],
    queryFn: () => getReportDetail(reportId!),
    enabled: options?.enabled !== false && reportId !== null,

    // 핵심: 폴링 로직
    refetchInterval: (query) => {
      const data = query.state.data;

      // PENDING 상태이면 2초마다 재조회
      if (data?.status === "PENDING") {
        return 2000;
      }

      // COMPLETED or FAILED이면 폴링 중지
      return false;
    },

    staleTime: 0, // 항상 최신 데이터 요청

    // 에러 재시도 로직
    retry: (failureCount, error) => {
      // 4xx 에러는 재시도 안 함
      if (error instanceof Error && "response" in error) {
        const status = (error as any).response?.status;
        if (status && status >= 400 && status < 500) {
          return false;
        }
      }
      // 서버 에러는 최대 3번 재시도
      return failureCount < 3;
    },
  });
}

/**
 * ===== 레거시 API Hooks (기존 코드 호환성) =====
 */

/**
 * Presigned URL 요청 훅 (레거시)
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
 * 분석 요청 훅 (레거시)
 */
export function useAnalysisRequest(): UseMutationResult<AnalysisResponse, Error, AnalysisRequest> {
  return useMutation({
    mutationFn: (request) => submitAnalysisRequest(request),
  });
}

/**
 * 분석 결과 조회 훅 (레거시, 폴링 지원)
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
