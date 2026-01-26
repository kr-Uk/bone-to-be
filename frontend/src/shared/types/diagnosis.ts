// 폼 데이터 (UI용 - string 타입)
export type BasicInfoFormData = {
  gender: "women" | "men";
  height: string;
  weight: string;
  styles: string[];
};

// API 전송용 (숫자 변환)
export type BasicInfoApiData = {
  gender: "women" | "men";
  height: number;
  weight: number;
  styles: string[];
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
  styles: string[];
  imageKey: string;
};

// 분석 결과 데이터
export type AnalysisResultData = {
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

// 전체 진단 데이터 (Zustand 스토어용)
export type DiagnosisData = {
  basicInfo: BasicInfoApiData | null;
  photoData: string | null;
  analysisResult: AnalysisResultData | null;
};
