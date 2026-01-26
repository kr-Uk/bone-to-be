/**
 * Presigned URL 요청
 */
export type PresignedUrlRequest = {
  fileName: string;
  fileType: string;
};

/**
 * Presigned URL 응답
 */
export type PresignedUrlResponse = {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
};

/**
 * 분석 요청
 */
export type AnalysisRequest = {
  gender: "women" | "men";
  height: number;
  weight: number;
  styles: string[];
  imageKey: string;
};

/**
 * 분석 응답
 */
export type AnalysisResponse = {
  analysisId: string;
  status: "processing" | "completed" | "failed";
  estimatedTime: number; // 예상 소요 시간 (초)
};

/**
 * 분석 결과
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
