import { http, HttpResponse, delay } from "msw";

import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
} from "@/pages/diagnosis/api";

/**
 * 진단 관련 MSW 핸들러
 */
export const diagnosisHandlers = [
  // POST /api/v1/diagnosis/presigned-url - Presigned URL 생성
  http.post<never, PresignedUrlRequest>("/api/v1/diagnosis/presigned-url", async ({ request }) => {
    await delay(300); // 네트워크 지연 시뮬레이션

    const body = await request.json();
    const { fileName } = body;

    const response: PresignedUrlResponse = {
      uploadUrl: `https://mock-s3-bucket.amazonaws.com/uploads/${fileName}`,
      fileKey: `uploads/${fileName}`,
      expiresIn: 3600,
    };

    return HttpResponse.json(response);
  }),

  // PUT https://mock-s3-bucket.amazonaws.com/* - S3 업로드 목킹
  http.put("https://mock-s3-bucket.amazonaws.com/*", async () => {
    await delay(1000); // S3 업로드 지연 시뮬레이션
    return new HttpResponse(null, { status: 200 });
  }),

  // POST /api/v1/diagnosis/analyze - 분석 요청
  http.post<never, AnalysisRequest>("/api/v1/diagnosis/analyze", async ({ request }) => {
    await delay(500); // 네트워크 지연 시뮬레이션

    const body = await request.json();

    // 분석 요청 검증
    if (!body.imageKey || !body.gender || !body.height || !body.weight) {
      return HttpResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 },
      );
    }

    const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const response: AnalysisResponse = {
      analysisId,
      status: "completed", // MSW에서는 즉시 완료로 처리
      estimatedTime: 0,
    };

    return HttpResponse.json(response);
  }),

  // GET /api/v1/diagnosis/analyze/:analysisId - 분석 결과 조회
  http.get<{ analysisId: string }>("/api/v1/diagnosis/analyze/:analysisId", async ({ params }) => {
    await delay(300); // 네트워크 지연 시뮬레이션

    const { analysisId } = params;

    // 목 분석 결과 데이터
    const result: AnalysisResult = {
      analysisId,
      bodyType: "Natural",
      bodyTypeRatio: {
        natural: 60,
        wave: 25,
        straight: 15,
      },
      measurements: {
        shoulderWidth: 42,
        waistWidth: 28,
        hipWidth: 38,
      },
      recommendations: [
        "루즈핏 상의가 잘 어울립니다",
        "자연스러운 실루엣의 원피스를 추천합니다",
        "오버사이즈 아우터로 편안한 스타일을 연출해보세요",
        "스트레이트 핏 청바지가 체형에 잘 맞습니다",
      ],
      processedAt: new Date().toISOString(),
    };

    return HttpResponse.json(result);
  }),
];
