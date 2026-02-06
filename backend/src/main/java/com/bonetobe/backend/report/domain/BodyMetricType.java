package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static com.bonetobe.backend.common.SkeletonType.*;

@Getter
@RequiredArgsConstructor
public enum BodyMetricType {

    // --- [Group A] 핵심 판별 지표 (가중치: 3~5점) ---
    // 가장 신뢰도가 높고, 각 체형을 결정짓는 핵심 무기들입니다.

    UPPER_BODY_DEPTH_INDEX(
        "upper_body_depth_index", "상체 두께 지수",
        BodyMetrics::upperBodyDepthIndex,
        0.110, 0.170, "납작함 (Wave)", "두꺼움 (Straight)",
        "상체의 앞뒤 두께감을 측정하여 몸의 입체감을 분석한 지표입니다.",
        List.of(new Zone("납작함", WAVE, 0.123), new Zone("보통", NATURAL, 0.130), new Zone("두꺼움", STRAIGHT, 0.170)),
        score -> score < 0.123 ? WAVE : (score < 0.130 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "상체가 얇고 여리여리한 편이에요.", NATURAL, "상체 두께가 표준적이에요.", STRAIGHT, "상체에 입체적인 두께감이 있어요."),
        // [가중치 전략] 스트레이트는 두께가 생명(5점), 나머지는 3점
        Map.of(STRAIGHT, 5, NATURAL, 3, WAVE, 3)
    ),

    WAIST_CURVATURE_INDEX(
        "waist_curvature_index", "허리 곡률 지수",
        BodyMetrics::waistCurvatureIndex,
        9.0, 17.0, "직선적 (Natural)", "곡선형 (Wave)",
        "허리 라인이 안쪽으로 들어가는 곡선의 강도를 측정한 지표입니다.",
        List.of(new Zone("직선형", NATURAL, 12.2), new Zone("완만함", STRAIGHT, 13.2), new Zone("곡선형", WAVE, 17.0)),
        score -> score < 12.2 ? NATURAL : (score < 13.2 ? STRAIGHT : WAVE),
        Map.of(NATURAL, "허리 라인이 일자에 가까워요.", STRAIGHT, "허리 굴곡이 완만해요.", WAVE, "허리 라인이 잘록하고 곡선이 뚜렷해요."),
        // [가중치 전략] 웨이브는 곡선이 생명(5점), 나머지는 3점
        Map.of(WAVE, 5, STRAIGHT, 3, NATURAL, 3)
    ),

    SHOULDER_WIDTH_INDEX(
        "shoulder_width_index", "어깨 너비 지수",
        BodyMetrics::shoulderWidthIndex,
        0.210, 0.270, "좁음 (Wave)", "넓음 (Natural)",
        "키 대비 어깨 골격의 너비가 얼마나 넓은지를 나타내는 지표입니다.",
        List.of(new Zone("좁음", WAVE, 0.230), new Zone("표준", STRAIGHT, 0.242), new Zone("넓음", NATURAL, 0.270)),
        score -> score < 0.230 ? WAVE : (score < 0.242 ? STRAIGHT : NATURAL),
        Map.of(WAVE, "어깨 너비가 아담한 편이에요.", STRAIGHT, "어깨 너비가 표준적이에요.", NATURAL, "어깨 프레임이 넓고 존재감이 있어요."),
        // [가중치 전략] 내추럴은 어깨가 생명(5점), 나머지는 3점
        Map.of(NATURAL, 5, STRAIGHT, 3, WAVE, 3)
    ),

    // --- [Group B] 라인 및 비율 지표 (가중치: 2~4점) ---
    // 전반적으로 신뢰할 수 있으나 미세한 겹침이 있는 구간입니다.

    SHOULDER_SLOPE_ANGLE(
        "shoulder_slope_angle", "어깨 기울기 각도",
        BodyMetrics::shoulderSlopeAngle,
        35.0, 48.0, "직각 (Natural)", "처짐 (Wave)",
        "목에서 어깨 끝점으로 이어지는 라인의 기울기를 측정한 지표입니다.",
        List.of(new Zone("직각", NATURAL, 40.0), new Zone("보통", STRAIGHT, 42.0), new Zone("처짐", WAVE, 48.0)),
        score -> score < 40.0 ? NATURAL : (score < 42.0 ? STRAIGHT : WAVE),
        Map.of(NATURAL, "어깨 라인이 직각에 가까워요.", STRAIGHT, "어깨 경사가 표준적이에요.", WAVE, "어깨 라인이 부드럽게 떨어져요."),
        // [가중치 전략] 내추럴(직각)과 웨이브(옷걸이) 특징이 강함(4점), 스트레이트는 평범(2점)
        Map.of(NATURAL, 4, WAVE, 4, STRAIGHT, 2)
    ),

    LEG_LENGTH_INDEX(
        "leg_length_index", "다리 길이 지수",
        BodyMetrics::legLengthIndex,
        0.450, 0.520, "짧음 (Wave)", "김 (Straight)",
        "키 대비 다리 길이의 비율을 분석한 지표입니다.",
        List.of(new Zone("아담함", WAVE, 0.485), new Zone("표준", NATURAL, 0.495), new Zone("김", STRAIGHT, 0.520)),
        score -> score < 0.485 ? WAVE : (score < 0.495 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "허리가 길고 다리는 아담한 편이에요.", NATURAL, "다리 길이 비율이 표준적이에요.", STRAIGHT, "다리가 길어 비율이 좋아요."),
        // [가중치 전략] 다들 비슷하게 3점
        Map.of(STRAIGHT, 3, NATURAL, 3, WAVE, 3)
    ),

    ARM_TORSO_RATIO(
        "arm_torso_ratio", "팔 몸통 비율",
        BodyMetrics::armTorsoRatio,
        1.05, 1.30, "짧음 (Wave)", "김 (Natural)",
        "상체 길이 대비 팔 길이의 비율을 분석한 지표입니다.",
        List.of(new Zone("아담함", WAVE, 1.15), new Zone("표준", STRAIGHT, 1.20), new Zone("김", NATURAL, 1.30)),
        score -> score < 1.15 ? WAVE : (score < 1.20 ? STRAIGHT : NATURAL),
        Map.of(WAVE, "팔 길이가 아담한 편이에요.", STRAIGHT, "팔 길이가 비율에 맞아요.", NATURAL, "팔이 길고 시원시원해요."),
        // [가중치 전략] 내추럴은 팔 긴게 특징(4점), 나머지는 2점
        Map.of(NATURAL, 4, WAVE, 2, STRAIGHT, 2)
    ),

    // --- [Group C] 세부 특징 지표 (가중치: 1~3점) ---
    // 역설정 로직이나 측정 변수가 많은 보조 지표들입니다.

    JOINT_THICKNESS_INDEX(
        "joint_thickness_index", "관절 두께 지수",
        BodyMetrics::jointThicknessIndex,
        50.0, 80.0, "가늘다 (Wave)", "굵다 (Straight)",
        "손목과 발목의 둘레를 통해 뼈대의 전반적인 두께를 측정한 지표입니다.",
        List.of(new Zone("가늘다", WAVE, 57.0), new Zone("보통", NATURAL, 61.0), new Zone("굵다", STRAIGHT, 80.0)),
        score -> score < 57.0 ? WAVE : (score < 61.0 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "손목과 발목 뼈대가 가늘어요.", NATURAL, "뼈대 굵기가 표준적이에요.", STRAIGHT, "뼈대가 굵고 존재감이 있어요."),
        // [가중치 전략] 웨이브(얇음)와 스트레이트(굵음) 특징이 뚜렷함(3점), 내추럴은 중간(2점)
        Map.of(WAVE, 3, STRAIGHT, 3, NATURAL, 2)
    ),

    WAIST_LENGTH_INDEX(
        "waist_length_index", "허리 길이 지수",
        BodyMetrics::waistLengthIndex,
        0.230, 0.310, "김 (Wave)", "짧음 (Straight)",
        "가슴 밑선에서 골반까지의 거리를 측정한 지표입니다. (수치가 낮을수록 시각적으로 깁니다)",
        List.of(new Zone("김", WAVE, 0.265), new Zone("표준", NATURAL, 0.278), new Zone("짧음", STRAIGHT, 0.310)),
        score -> score < 0.265 ? WAVE : (score < 0.278 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "허리 라인이 길고 우아해요.", NATURAL, "허리 길이가 평균적이에요.", STRAIGHT, "허리가 짧고 상체가 컴팩트해요."),
        // [가중치 전략] 역설정 로직이므로 보너스 점수 수준(1점)
        Map.of(WAVE, 1, NATURAL, 1, STRAIGHT, 1)
    ),

    NECK_LENGTH_INDEX(
        "neck_length_index", "목 길이 지수",
        BodyMetrics::neckLengthIndex,
        0.150, 0.180, "김 (Wave)", "짧음 (Straight)",
        "턱 끝에서 쇄골까지의 길이를 측정한 지표입니다. (수치가 낮을수록 시각적으로 깁니다)",
        List.of(new Zone("김", WAVE, 0.160), new Zone("표준", NATURAL, 0.164), new Zone("짧음", STRAIGHT, 0.180)),
        score -> score < 0.160 ? WAVE : (score < 0.164 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "목선이 길고 가녀려요.", NATURAL, "목 길이가 표준적이에요.", STRAIGHT, "목 길이가 비율에 맞게 안정적이에요."),
        // [가중치 전략] 역설정 로직이므로 보너스 점수 수준(1점)
        Map.of(WAVE, 1, NATURAL, 1, STRAIGHT, 1)
    );

    // --- Enum Fields ---
    private final String key;
    private final String title;
    private final Function<BodyMetrics, Double> extractor;
    private final Double min;
    private final Double max;
    private final String leftLabel;
    private final String rightLabel;
    private final String guideText;
    private final List<Zone> zones;
    private final Function<Double, SkeletonType> analyzer;
    private final Map<SkeletonType, String> resultMessages;
    private final Map<SkeletonType, Integer> typeWeights;

    // --- Helper Methods ---

    public SkeletonType analyze(Double score) {
        return (score == null) ? STRAIGHT : analyzer.apply(score);
    }

    public int getPercent(Double score) {
        if (score == null) return 0;
        double ratio = (score - min) / (max - min);
        return (int) Math.round(Math.min(Math.max(ratio, 0.0), 1.0) * 100);
    }

    public AnalysisDetail mapToDetail(BodyMetrics bodyMetrics) {
        Double score = extractor.apply(bodyMetrics);
        SkeletonType skeletonType = analyze(score);
        Integer weight = typeWeights.get(skeletonType);
        return AnalysisDetail.of(
            key,
            title,
            skeletonType,
            score,
            getPercent(score),
            guideText,
            new RangeMeta(min, max, leftLabel, rightLabel),
            Analysis.from(skeletonType, resultMessages.get(skeletonType)),
            zones,
            weight
        );
    }
}