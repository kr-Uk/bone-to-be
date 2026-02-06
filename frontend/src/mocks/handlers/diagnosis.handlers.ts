import { http, HttpResponse, delay } from "msw";

import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
  ReportListResponse,
  RepresentativeReportResponse,
  ReportDetailResponse,
} from "@/pages/diagnosis/api";

import { STYLE_OPTIONS, type StyleOption } from '@/shared/constants/styleOptions';

/**
 * 진단 관련 MSW 핸들러
 */
export const diagnosisHandlers = [
  // POST /api/diagnosis/presigned-url - Presigned URL 생성
  http.post<never, PresignedUrlRequest>("/api/diagnosis/presigned-url", async ({ request }) => {
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
  http.post<never, AnalysisRequest>("/api/diagnosis/analyze", async ({ request }) => {
    await delay(500); // 네트워크 지연 시뮬레이션

    const body = await request.json();

    // 분석 요청 검증
    if (!body.imageKey || !body.gender || !body.height || !body.weight) {
      return HttpResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
    }

    // 스타일 검증 (백엔드 동작 시뮬레이션)
    if (body.styles) {
      const validStyles = Object.values(STYLE_OPTIONS);

      // 타입 가드: string이 유효한 StyleOption인지 확인
      const isValidStyleOption = (style: string): style is StyleOption => {
        return validStyles.includes(style as StyleOption);
      };

      if (!isValidStyleOption(body.styles)) {
        return HttpResponse.json(
          { error: `Invalid style option: ${body.styles}` },
          { status: 400 }
        );
      }
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
  http.get<{ analysisId: string }>("/api/diagnosis/analyze/:analysisId", async ({ params }) => {
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
  // GET /api/reports - 본인 리포트 목록
  http.get("/api/reports", () => {
    const response: ReportListResponse = {
      code: 200,
      message: "요청 성공",
      data: [
        {
          reportId: 6,
          skeletonType: null,
          reportStatus: "PENDING",
          isRepresentative: true,
          straightRate: 0,
          naturalRate: 0,
          waveRate: 0,
          createdAt: "2026-01-29T22:23:19.89252",
        },
        {
          reportId: 7,
          skeletonType: null,
          reportStatus: "PENDING",
          isRepresentative: false,
          straightRate: 0,
          naturalRate: 0,
          waveRate: 0,
          createdAt: "2026-01-29T22:23:19.89252",
        },
      ],
    };

    return HttpResponse.json(response);
  }),
  // GET /api/users/:userId/representative - 타유저 대표 리포트
  http.get<{ userId: string }>("/api/users/:userId/representative", () => {
    const response: RepresentativeReportResponse = {
      code: 200,
      message: "요청 성공",
      data: {
        reportId: 6,
        skeletonType: null,
        isRepresentative: false,
        straightRate: 0,
        naturalRate: 0,
        waveRate: 0,
        createdAt: "2026-01-29T22:23:19.89252",
      },
    };

    return HttpResponse.json(response);
  }),

  // GET /api/reports/:id - 리포트 상세 조회 (11개 골격 분석 지표 포함)
  http.get<{ id: string }>("/api/reports/:id", ({ params }) => {
    const { id } = params;

    // 403 발생용 테스트 케이스
    // return HttpResponse.json(null, { status: 403 });

    const response: ReportDetailResponse = {
      code: 200,
      message: "요청 성공",
      data: {
        reportId: Number(id),
        skeletonType: "STRAIGHT",
        straightRate: 0.6363636363636364,
        naturalRate: 0.36363636363636365,
        waveRate: 0.0,
        details: [
          {
            key: "shoulder_width_index",
            label: "어깨 너비 지수",
            score: 0.18416351079940796,
            percent: 44,
            description: "키 대비 어깨 골격의 너비가 얼마나 넓은지를 나타내는 지표입니다.",
            rangeMeta: {
              min: 0.14,
              max: 0.24,
              leftLabel: "좁음 (Wave)",
              rightLabel: "넓음 (Natural)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "어깨 너비가 표준적이에요.",
            },
            zones: [
              { label: "좁음", skeletonType: "WAVE", max: 0.17 },
              { label: "표준", skeletonType: "STRAIGHT", max: 0.19 },
              { label: "넓음", skeletonType: "NATURAL", max: 0.24 },
            ],
          },
          {
            key: "hip_width_index",
            label: "골반 너비 지수",
            score: 0.16115592420101166,
            percent: 41,
            description: "키 대비 골반 골격의 너비를 측정한 지표입니다.",
            rangeMeta: {
              min: 0.12,
              max: 0.22,
              leftLabel: "좁음 (Straight)",
              rightLabel: "넓음 (Wave)",
            },
            analysis: {
              resultType: "NATURAL",
              resultText: "골반 너비가 표준적이에요.",
            },
            zones: [
              { label: "좁음", skeletonType: "STRAIGHT", max: 0.15 },
              { label: "표준", skeletonType: "NATURAL", max: 0.17 },
              { label: "넓음", skeletonType: "WAVE", max: 0.22 },
            ],
          },
          {
            key: "upper_body_depth_index",
            label: "상체 두께 지수",
            score: 0.34523752331733704,
            percent: 87,
            description: "상체의 앞뒤 두께감을 측정하여 몸의 입체감을 분석한 지표입니다.",
            rangeMeta: {
              min: 0.12,
              max: 0.38,
              leftLabel: "평면적 (Wave)",
              rightLabel: "입체적 (Straight)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "상체에 입체적인 두께감이 있어요.",
            },
            zones: [
              { label: "납작함", skeletonType: "WAVE", max: 0.18 },
              { label: "보통", skeletonType: "NATURAL", max: 0.23 },
              { label: "두꺼움", skeletonType: "STRAIGHT", max: 0.38 },
            ],
          },
          {
            key: "shoulder_slope_angle",
            label: "어깨 기울기 각도",
            score: 6.7387895584106445,
            percent: 19,
            description: "목에서 어깨 끝점으로 이어지는 라인의 기울기를 측정한 지표입니다.",
            rangeMeta: {
              min: 0.0,
              max: 35.0,
              leftLabel: "직각 (Natural)",
              rightLabel: "처짐 (Wave)",
            },
            analysis: {
              resultType: "NATURAL",
              resultText: "어깨 라인이 직각에 가까워요.",
            },
            zones: [
              { label: "직각", skeletonType: "NATURAL", max: 10.0 },
              { label: "보통", skeletonType: "STRAIGHT", max: 20.0 },
              { label: "처짐", skeletonType: "WAVE", max: 35.0 },
            ],
          },
          {
            key: "waist_curvature_index",
            label: "허리 곡률 지수",
            score: 0.07125731557607651,
            percent: 48,
            description: "허리 라인이 안쪽으로 들어가는 곡선의 정도를 측정한 지표입니다.",
            rangeMeta: {
              min: 0.0,
              max: 0.15,
              leftLabel: "통허리 (Straight)",
              rightLabel: "굴곡짐 (Wave)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "허리 라인이 직선적이에요.",
            },
            zones: [
              { label: "통허리", skeletonType: "STRAIGHT", max: 0.08 },
              { label: "완만함", skeletonType: "NATURAL", max: 0.1 },
              { label: "굴곡짐", skeletonType: "WAVE", max: 0.15 },
            ],
          },
          {
            key: "ribcage_volume_index",
            label: "흉곽 볼륨 지수",
            score: 1.1435288190841675,
            percent: 59,
            description: "흉곽과 허리 너비의 비율을 통해 상체 라인을 분석한 지표입니다.",
            rangeMeta: {
              min: 0.85,
              max: 1.35,
              leftLabel: "통허리 (Straight)",
              rightLabel: "잘록함 (Wave)",
            },
            analysis: {
              resultType: "NATURAL",
              resultText: "허리 굴곡이 완만해요.",
            },
            zones: [
              { label: "일자형", skeletonType: "STRAIGHT", max: 1.05 },
              { label: "완만함", skeletonType: "NATURAL", max: 1.15 },
              { label: "잘록함", skeletonType: "WAVE", max: 1.35 },
            ],
          },
          {
            key: "shoulder_hip_ratio",
            label: "어깨 골반 비율",
            score: 1.142765998840332,
            percent: 61,
            description: "어깨와 골반의 너비를 비교하여 상·하체 균형을 분석한 지표입니다.",
            rangeMeta: {
              min: 0.9,
              max: 1.3,
              leftLabel: "A라인 (Wave)",
              rightLabel: "Y라인 (Natural)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "상하체 균형이 잘 잡혀 있어요.",
            },
            zones: [
              { label: "A라인", skeletonType: "WAVE", max: 0.95 },
              { label: "I라인", skeletonType: "STRAIGHT", max: 1.15 },
              { label: "Y라인", skeletonType: "NATURAL", max: 1.3 },
            ],
          },
          {
            key: "joint_thickness_index",
            label: "관절 두께 지수",
            score: 0.04422637075185776,
            percent: 36,
            description: "손목과 발목의 굵기를 통해 뼈대의 전반적인 두께를 측정한 지표입니다.",
            rangeMeta: {
              min: 0.03,
              max: 0.07,
              leftLabel: "얇음 (Wave)",
              rightLabel: "굵음 (Natural)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "관절 굵기가 표준적이에요.",
            },
            zones: [
              { label: "얇음", skeletonType: "WAVE", max: 0.04 },
              { label: "표준", skeletonType: "STRAIGHT", max: 0.05 },
              { label: "굵음", skeletonType: "NATURAL", max: 0.07 },
            ],
          },
          {
            key: "linearity_index",
            label: "체형 직선성 지수",
            score: 0.85,
            percent: 63,
            description:
              "신체 외곽선이 얼마나 직선에 가까운지, 혹은 곡선인지를 나타내는 지표입니다.",
            rangeMeta: {
              min: 0.6,
              max: 1.0,
              leftLabel: "곡선형 (Wave)",
              rightLabel: "직선형 (Straight)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "몸의 선이 직선으로 곧게 뻗었어요.",
            },
            zones: [
              { label: "곡선", skeletonType: "WAVE", max: 0.75 },
              { label: "자연스러움", skeletonType: "NATURAL", max: 0.85 },
              { label: "직선", skeletonType: "STRAIGHT", max: 1.0 },
            ],
          },
          {
            key: "arm_torso_ratio",
            label: "팔 몸통 비율",
            score: 1.0462666749954224,
            percent: 69,
            description: "상체 길이 대비 팔 길이의 비율을 분석한 지표입니다.",
            rangeMeta: {
              min: 0.7,
              max: 1.2,
              leftLabel: "짧음 (Wave)",
              rightLabel: "길 (Natural)",
            },
            analysis: {
              resultType: "NATURAL",
              resultText: "팔이 길고 시원시원해요.",
            },
            zones: [
              { label: "짧음", skeletonType: "WAVE", max: 0.85 },
              { label: "표준", skeletonType: "STRAIGHT", max: 1.0 },
              { label: "길", skeletonType: "NATURAL", max: 1.2 },
            ],
          },
          {
            key: "leg_length_index",
            label: "다리 길이 지수",
            score: 0.5252833962440491,
            percent: 84,
            description: "키 대비 다리 길이의 비율을 분석한 지표입니다.",
            rangeMeta: {
              min: 0.4,
              max: 0.55,
              leftLabel: "짧음 (Wave)",
              rightLabel: "길 (Straight)",
            },
            analysis: {
              resultType: "STRAIGHT",
              resultText: "다리가 길어 비율이 좋아요.",
            },
            zones: [
              { label: "짧음", skeletonType: "WAVE", max: 0.45 },
              { label: "보통", skeletonType: "NATURAL", max: 0.48 },
              { label: "길", skeletonType: "STRAIGHT", max: 0.55 },
            ],
          },
        ],
        status: "COMPLETED",
        createdAt: "2026-02-02T09:15:00.897446",
      },
    };

    return HttpResponse.json(response);
  }),
];
