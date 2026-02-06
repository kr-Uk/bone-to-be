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
 * 체형분석목록 (본인)
 */
export type ReportSummaryDto = {
  reportId: number;
  skeletonType: SkeletonType | null;
  reportStatus: ReportStatus;
  isRepresentative: boolean;
  straightRate: number;
  naturalRate: number;
  waveRate: number;
  createdAt: string;
};

export type ReportListResponse = ApiResponse<ReportSummaryDto[]>;

export type ReportSummary = {
  reportId: number;
  skeletonType: SkeletonType | null;
  status: ReportStatus;
  isRepresentative: boolean;
  straightRate: number;
  naturalRate: number;
  waveRate: number;
  createdAt: string;
};

/**
 * 타유저 대표 리포트
 */
export type RepresentativeReportDto = {
  reportId: number;
  skeletonType: SkeletonType | null;
  isRepresentative: boolean;
  straightRate: number;
  naturalRate: number;
  waveRate: number;
  createdAt: string;
};

export type RepresentativeReportResponse = ApiResponse<RepresentativeReportDto | null>;

export type RepresentativeReport = {
  reportId: number;
  skeletonType: SkeletonType | null;
  isRepresentative: boolean;
  straightRate: number;
  naturalRate: number;
  waveRate: number;
  createdAt: string;
};

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
 * 리포트 상세 분석의 구간(Zone) 정의
 */
export type Zone = {
  label: string; // 구간 레이블 (예: "좁음", "표준", "넓음")
  skeletonType: SkeletonType; // 구간 타입 (색상 매핑용)
  max: number; // 구간 최대값
};

/**
 * 리포트 상세 분석 지표 (11개 골격 분석 지표)
 */
export type ReportDetailMetric = {
  key: string; // 지표 ID (예: "shoulder_width_index")
  label: string; // 지표 이름 (예: "어깨 너비 지수")
  score: number; // 실제 측정값
  percent: number; // 백분율 표시값 (0-100)
  description: string; // 지표 설명
  rangeMeta: {
    min: number; // 범위 최소값
    max: number; // 범위 최대값
    leftLabel: string; // 왼쪽 레이블 (예: "좁음 (Wave)")
    rightLabel: string; // 오른쪽 레이블 (예: "넓음 (Natural)")
  };
  analysis: {
    resultType: SkeletonType; // 이 지표의 결과 타입 (STRAIGHT/NATURAL/WAVE)
    resultText: string; // 결과 설명 (예: "어깨 너비가 표준적이에요.")
  };
  zones: Zone[]; // 3개 구간 정의
};

/**
 * 리포트 상세 조회 응답
 */
export type ReportDetailResponse = ApiResponse<{
  reportId: number;
  gender?: "MALE" | "FEMALE"; // API에서 대문자로 반환
  skeletonType: SkeletonType | null;
  straightRate: number;
  naturalRate: number;
  waveRate: number;
  details: ReportDetailMetric[]; // 11개 골격 분석 지표 배열
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
 * @param skeletonType - SkeletonType 값 (null이면 안전을 위해 기본값 "natural" 반환)
 * @returns "natural" | "wave" | "straight"
 * @note 호출 측에서 null 체크를 먼저 수행하는 것을 권장
 */
export const convertSkeletonTypeToBodyType = (
  skeletonType: SkeletonType | null,
): "natural" | "wave" | "straight" => {
  if (!skeletonType) return "natural"; // 안전을 위한 fallback
  return skeletonType.toLowerCase() as "natural" | "wave" | "straight";
};

/**
 * API gender 값을 컴포넌트 gender 값으로 변환
 */
export const convertApiGenderToComponent = (
  apiGender: "MALE" | "FEMALE" | undefined,
): "male" | "female" | undefined => {
  if (!apiGender) return undefined;
  return apiGender.toLowerCase() as "male" | "female";
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
  styles: string;
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

/**
 * ===== Try-On API 타입 =====
 */

/**
 * Try-On API 응답 데이터
 */
export interface TryOnResponse {
  reportId: number;
  bestImageUrl: string | null;
  worstImageUrl: string | null;
}

export type TryOnDataResponse = ApiResponse<TryOnResponse>;

/**
 * TryOnComparisonSection Props
 */
export interface TryOnComparisonSectionProps {
  bestImageUrl: string | null;
  worstImageUrl: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

/**
 * Try-On 데이터 준비 상태 타입 가드
 */
export const isTryOnReady = (data: TryOnResponse | undefined): data is TryOnResponse => {
  return Boolean(data?.bestImageUrl && data?.worstImageUrl);
};
