import type { StyleOption } from '@/shared/constants/styleOptions';

// 폼 데이터 (UI용 - string 타입)
export type BasicInfoFormData = {
  gender: "women" | "men";
  height: string;
  weight: string;
  styles: StyleOption;
};

// API 전송용 (숫자 변환)
export type BasicInfoApiData = {
  gender: "women" | "men";
  height: number;
  weight: number;
  styles: StyleOption;
};

// 촬영 모드
export type CaptureMode = "camera" | "upload";

// 분석 상태
export type AnalysisStatus = "idle" | "s3-upload" | "analysis-request" | "processing" | "complete";

// Presigned URL 데이터
export type PresignedUrlData = {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
};

// 분석 요청 데이터
export type AnalysisRequestData = {
  gender: "women" | "men";
  height: number;
  weight: number;
  styles: StyleOption;
  imageKey: string;
};

// 분석 결과 데이터 (업데이트: reportId 및 status 추가, null safety)
export type AnalysisResultData = {
  reportId: number; // 변경: analysisId (string) → reportId (number)
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
  } | null; // 변경: null 가능
  recommendations: string[];
  processedAt: string;
  status: "PENDING" | "COMPLETED" | "FAILED"; // 추가: 분석 상태
};

// 전체 진단 데이터 (Zustand 스토어용)
export type DiagnosisData = {
  basicInfo: BasicInfoApiData | null;
  photoData: string | null;
  analysisResult: AnalysisResultData | null;
};
