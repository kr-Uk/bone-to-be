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
  ReportListResponse,
  ReportSummary,
  ReportSummaryDto,
  RepresentativeReportResponse,
  RepresentativeReport,
  RepresentativeReportDto,
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

const normalizeIsoString = (value: string): string => {
  if (!value) return value;
  if (!value.includes(".")) return value;
  return value.replace(/\.(\d{3})\d+/, ".$1");
};

const formatReportDate = (value: string): string => {
  const normalized = normalizeIsoString(value);
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${year}.${month}.${day} (${dayNames[date.getDay()]})`;
};

const mapReportSummary = (report: ReportSummaryDto): ReportSummary => ({
  reportId: report.reportId,
  skeletonType: report.skeletonType,
  status: report.reportStatus,
  isRepresentative: report.isRepresentative,
  straightRate: report.straightRate,
  naturalRate: report.naturalRate,
  waveRate: report.waveRate,
  createdAt: formatReportDate(report.createdAt),
});

const mapRepresentativeReport = (
  report: RepresentativeReportDto,
): RepresentativeReport => ({
  reportId: report.reportId,
  skeletonType: report.skeletonType,
  isRepresentative: report.isRepresentative,
  straightRate: report.straightRate,
  naturalRate: report.naturalRate,
  waveRate: report.waveRate,
  createdAt: formatReportDate(report.createdAt),
});

/**
 * 본인 분석 리포트 목록 조회
 */
export async function getMyReportList(): Promise<ReportSummary[]> {
  const response = await axios.get<ReportListResponse>("/reports");

  return response.data.data.map(mapReportSummary);
}

/**
 * 타유저 대표 리포트 조회
 */
export async function getRepresentativeReport(
  userId: string,
): Promise<RepresentativeReport | null> {
  const response = await axios.get<RepresentativeReportResponse>(
    `/users/${userId}/representative`,
  );

  const report = response.data.data;
  if (!report) return null;

  return mapRepresentativeReport(report);
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
