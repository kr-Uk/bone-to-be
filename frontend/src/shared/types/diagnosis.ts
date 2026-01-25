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

// 전체 진단 데이터 (Zustand 스토어용)
export type DiagnosisData = {
  basicInfo: BasicInfoApiData | null;
  photoData: string | null;
  analysisResult: unknown;
};
