import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
  CreatePresignedUrlRequest,
  CreatePresignedUrlResponse,
  CreateReportRequest,
  CreateReportResponse,
  ReportDetailResponse,
} from "./diagnosis.types";

import axios from "@/shared/api/axios";

/**
 * ===== 새로운 /reports API =====
 */

/**
 * S3 Presigned URL 생성 (새 API)
 */
export async function createPresignedUrl(
  originalFileName: string,
  contentType: string,
  fileSize: number,
): Promise<CreatePresignedUrlResponse["data"]> {
  const requestData: CreatePresignedUrlRequest = {
    originalFileName,
    contentType,
    fileSize,
  };

  const response = await axios.post<CreatePresignedUrlResponse>("/reports/createUrl", requestData);

  return response.data.data; // 래퍼 벗기기
}

/**
 * S3에 이미지 업로드 (변경 없음)
 */
export async function uploadImageToS3(uploadUrl: string, imageBlob: Blob): Promise<void> {
  await axios.put(uploadUrl, imageBlob, {
    headers: {
      "Content-Type": imageBlob.type,
    },
  });
}

/**
 * 리포트 생성 (분석 시작)
 */
export async function createReport(
  request: CreateReportRequest,
): Promise<CreateReportResponse["data"]> {
  const response = await axios.post<CreateReportResponse>("/reports", request);

  return response.data.data; // 래퍼 벗기기
}

/**
 * 리포트 상세 조회
 */
export async function getReportDetail(reportId: number): Promise<ReportDetailResponse["data"]> {
  const response = await axios.get<ReportDetailResponse>(`/reports/${reportId}`);

  return response.data.data; // 래퍼 벗기기
}

/**
 * ===== 레거시 API (기존 코드 호환성) =====
 */

/**
 * S3 Presigned URL 요청 (레거시)
 */
export async function getPresignedUrl(
  fileName: string,
  fileType: string,
): Promise<PresignedUrlResponse> {
  const requestData: PresignedUrlRequest = {
    fileName,
    fileType,
  };

  const response = await axios.post<PresignedUrlResponse>("/diagnosis/presigned-url", requestData);

  return response.data;
}

/**
 * 분석 요청 제출 (레거시)
 */
export async function submitAnalysisRequest(request: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await axios.post<AnalysisResponse>("/diagnosis/analyze", request);

  return response.data;
}

/**
 * 분석 결과 조회 (레거시)
 */
export async function getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
  const response = await axios.get<AnalysisResult>(`/diagnosis/analyze/${analysisId}`);

  return response.data;
}
