import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
} from "./diagnosis.types";

import axios from "@/shared/api/axios";

/**
 * S3 Presigned URL 요청
 */
export async function getPresignedUrl(
  fileName: string,
  fileType: string,
): Promise<PresignedUrlResponse> {
  const requestData: PresignedUrlRequest = {
    fileName,
    fileType,
  };

  const response = await axios.post<PresignedUrlResponse>(
    "/api/v1/diagnosis/presigned-url",
    requestData,
  );

  return response.data;
}

/**
 * S3에 이미지 업로드
 */
export async function uploadImageToS3(uploadUrl: string, imageBlob: Blob): Promise<void> {
  await axios.put(uploadUrl, imageBlob, {
    headers: {
      "Content-Type": imageBlob.type,
    },
  });
}

/**
 * 분석 요청 제출
 */
export async function submitAnalysisRequest(request: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await axios.post<AnalysisResponse>("/api/v1/diagnosis/analyze", request);

  return response.data;
}

/**
 * 분석 결과 조회
 */
export async function getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
  const response = await axios.get<AnalysisResult>(`/api/v1/diagnosis/analyze/${analysisId}`);

  return response.data;
}
