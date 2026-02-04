import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { DiagnosisData, BasicInfoApiData, AnalysisResultData } from "@/shared/types/diagnosis";

type DiagnosisStore = {
  diagnosisData: DiagnosisData;
  reportId: number | null; // 추가: 현재 리포트 ID
  lastUpdated: number | null; // 추가: 마지막 업데이트 시간
  setBasicInfo: (data: BasicInfoApiData) => void;
  setPhotoData: (data: string) => void;
  setReportId: (id: number) => void; // 추가: 리포트 ID 설정
  setAnalysisResult: (data: AnalysisResultData) => void;
  clearDiagnosisData: () => void;
  checkExpiration: () => void; // 추가: 만료 체크
};

export const useDiagnosisStore = create<DiagnosisStore>()(
  persist(
    (set, get) => ({
      diagnosisData: {
        basicInfo: null,
        photoData: null,
        analysisResult: null,
      },
      reportId: null, // 추가: 초기값
      lastUpdated: null, // 추가: 초기값
      setBasicInfo: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, basicInfo: data },
          lastUpdated: Date.now(),
        })),
      setPhotoData: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, photoData: data },
          lastUpdated: Date.now(),
        })),
      setReportId: (id) =>
        set({
          reportId: id,
          lastUpdated: Date.now(),
        }),
      setAnalysisResult: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, analysisResult: data },
          lastUpdated: Date.now(),
        })),
      checkExpiration: () => {
        const { lastUpdated, clearDiagnosisData } = get();
        const ONE_HOUR = 60 * 60 * 1000;

        if (lastUpdated && Date.now() - lastUpdated > ONE_HOUR) {
          clearDiagnosisData();
        }
      },
      clearDiagnosisData: () =>
        set({
          diagnosisData: {
            basicInfo: null,
            photoData: null,
            analysisResult: null,
          },
          reportId: null,
          lastUpdated: null,
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
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
