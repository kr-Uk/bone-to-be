/**
 * API 공통 응답 래퍼
 */
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

/**
 * ===== 새로운 /reports API 타입 =====
 */

/**
 * Presigned URL 생성 요청
 */
export type CreatePresignedUrlRequest = {
  originalFileName: string;
  contentType: string;
  fileSize: number;
};

/**
 * Presigned URL 생성 응답
 */
export type CreatePresignedUrlResponse = ApiResponse<{
  fileId: number;
  uploadUrl: string;
}>;

/**
 * 리포트 생성 요청 (분석 시작)
 */
export type CreateReportRequest = {
  fileId: number;
  height: number;
  weight: number;
  gender: "MALE" | "FEMALE";
};

/**
 * 리포트 생성 응답
 */
export type CreateReportResponse = ApiResponse<{
  reportId: number;
}>;

/**
 * 리포트 상태
 */
export type ReportStatus = "PENDING" | "COMPLETED" | "FAILED";

/**
 * 스켈레톤 타입
 */
export type SkeletonType = "NATURAL" | "WAVE" | "STRAIGHT";

/**
 * 리포트 상세 조회 응답
 */
export type ReportDetailResponse = ApiResponse<{
  reportId: number;
  skeletonType: SkeletonType | null;
  straightRate: number;
  naturalRate: number;
  waveRate: number;
  details: {
    measurements?: {
      shoulderWidth: number;
      waistWidth: number;
      hipWidth: number;
    };
    recommendations?: string[];
  } | null;
  status: ReportStatus;
  createdAt: string;
}>;

/**
 * ===== 변환 유틸리티 함수 =====
 */

/**
 * 프론트엔드 gender 값을 API gender 값으로 변환
 */
export const convertGenderToApi = (gender: "women" | "men"): "MALE" | "FEMALE" => {
  return gender === "men" ? "MALE" : "FEMALE";
};

/**
 * API skeletonType을 프론트엔드 bodyType으로 변환
 */
export const convertSkeletonTypeToBodyType = (
  skeletonType: SkeletonType | null,
): "natural" | "wave" | "straight" => {
  if (!skeletonType) return "natural"; // fallback
  return skeletonType.toLowerCase() as "natural" | "wave" | "straight";
};

/**
 * ===== 레거시 타입 (기존 코드 호환성) =====
 */

/**
 * Presigned URL 요청 (레거시)
 */
export type PresignedUrlRequest = {
  fileName: string;
  fileType: string;
};

/**
 * Presigned URL 응답 (레거시)
 */
export type PresignedUrlResponse = {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
};

/**
 * 분석 요청 (레거시)
 */
export type AnalysisRequest = {
  gender: "women" | "men";
  height: number;
  weight: number;
  styles: string[];
  imageKey: string;
};

/**
 * 분석 응답 (레거시)
 */
export type AnalysisResponse = {
  analysisId: string;
  status: "processing" | "completed" | "failed";
  estimatedTime: number; // 예상 소요 시간 (초)
};

/**
 * 분석 결과 (레거시)
 */
export type AnalysisResult = {
  analysisId: string;
  bodyType: string;
  bodyTypeRatio: {
    natural: number;
    wave: number;
    straight: number;
  };
  measurements: {
    shoulderWidth: number;
    waistWidth: number;
    hipWidth: number;
  };
  recommendations: string[];
  processedAt: string;
};
