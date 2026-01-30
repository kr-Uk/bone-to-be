import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { DiagnosisData, BasicInfoApiData, AnalysisResultData } from "@/shared/types/diagnosis";

type DiagnosisStore = {
  diagnosisData: DiagnosisData;
  reportId: number | null; // 추가: 현재 리포트 ID
  setBasicInfo: (data: BasicInfoApiData) => void;
  setPhotoData: (data: string) => void;
  setReportId: (id: number) => void; // 추가: 리포트 ID 설정
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
      reportId: null, // 추가: 초기값
      setBasicInfo: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, basicInfo: data },
        })),
      setPhotoData: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, photoData: data },
        })),
      setReportId: (id) => set({ reportId: id }), // 추가: 리포트 ID 설정
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
          reportId: null, // 추가: 초기화 시 포함
        }),
    }),
    {
      name: "diagnosis-storage",
      storage: createJSONStorage(() => sessionStorage), // 탭 닫으면 자동 삭제
      partialize: (state) => ({
        diagnosisData: {
          basicInfo: state.diagnosisData.basicInfo,
          photoData: null,
          analysisResult: state.diagnosisData.analysisResult,
        },
        reportId: state.reportId,
      }),
    },
  ),
);
