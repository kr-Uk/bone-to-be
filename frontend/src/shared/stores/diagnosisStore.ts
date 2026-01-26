import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type {
  DiagnosisData,
  BasicInfoApiData,
  AnalysisResultData,
} from "@/shared/types/diagnosis";

type DiagnosisStore = {
  diagnosisData: DiagnosisData;
  setBasicInfo: (data: BasicInfoApiData) => void;
  setPhotoData: (data: string) => void;
  setAnalysisResult: (data: AnalysisResultData) => void;
  clearDiagnosisData: () => void;
};

export const useDiagnosisStore = create<DiagnosisStore>()(
  persist(
    (set) => ({
      diagnosisData: {
        basicInfo: null,
        photoData: null,
        analysisResult: null,
      },
      setBasicInfo: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, basicInfo: data },
        })),
      setPhotoData: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, photoData: data },
        })),
      setAnalysisResult: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, analysisResult: data },
        })),
      clearDiagnosisData: () =>
        set({
          diagnosisData: {
            basicInfo: null,
            photoData: null,
            analysisResult: null,
          },
        }),
    }),
    {
      name: "diagnosis-storage",
      storage: createJSONStorage(() => sessionStorage), // 탭 닫으면 자동 삭제
    },
  ),
);
