package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static com.bonetobe.backend.common.SkeletonType.*;

@Getter
@RequiredArgsConstructor
public enum BodyMetricType {

    // --- [Group A] 핵심 골격 및 너비 (가장 높은 가중치) ---
    SHOULDER_WIDTH_INDEX(
        "shoulder_width_index", "어깨 너비 지수",
        BodyMetrics::shoulderWidthIndex,
        0.14, 0.24, "좁음 (Wave)", "넓음 (Natural)",
        "키 대비 어깨 골격의 너비가 얼마나 넓은지를 나타내는 지표입니다.",
        List.of(new Zone("좁음", WAVE, 0.17), new Zone("표준", STRAIGHT, 0.19), new Zone("넓음", NATURAL, 0.24)),
        score -> score < 0.17 ? WAVE : (score < 0.19 ? STRAIGHT : NATURAL),
        Map.of(WAVE, "어깨 너비가 아담한 편이에요.", STRAIGHT, "어깨 너비가 표준적이에요.", NATURAL, "어깨 프레임이 넓고 뚜렷해요."),
        Map.of(NATURAL, 1, STRAIGHT, 1, WAVE, 1)
    ),

    HIP_WIDTH_INDEX(
        "hip_width_index", "골반 너비 지수",
        BodyMetrics::hipWidthIndex,
        0.12, 0.22, "좁음 (Straight)", "넓음 (Wave)",
        "키 대비 골반 골격의 너비를 측정한 지표입니다.",
        List.of(new Zone("좁음", STRAIGHT, 0.15), new Zone("표준", NATURAL, 0.17), new Zone("넓음", WAVE, 0.22)),
        score -> score < 0.15 ? STRAIGHT : (score < 0.17 ? NATURAL : WAVE),
        Map.of(STRAIGHT, "골반 너비가 좁은 편이에요.", NATURAL, "골반 너비가 표준적이에요.", WAVE, "골반 라인이 돋보이는 편이에요."),
        Map.of(WAVE, 1, NATURAL, 1, STRAIGHT, 1)
    ),

    UPPER_BODY_DEPTH_INDEX(
        "upper_body_depth_index", "상체 두께 지수",
        BodyMetrics::upperBodyDepthIndex,
        0.12, 0.38, "평면적 (Wave)", "입체적 (Straight)",
        "상체의 앞뒤 두께감을 측정하여 몸의 입체감을 분석한 지표입니다.",
        List.of(new Zone("납작함", WAVE, 0.18), new Zone("보통", NATURAL, 0.23), new Zone("두꺼움", STRAIGHT, 0.38)),
        score -> score < 0.18 ? WAVE : (score < 0.23 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "상체가 얇고 여리여리해요.", NATURAL, "상체 두께가 표준적이에요.", STRAIGHT, "상체에 입체적인 두께감이 있어요."),
        Map.of(STRAIGHT, 1, NATURAL, 1, WAVE, 1)
    ),

    // --- [Group B] 라인 및 비율 (중간 가중치) ---
    SHOULDER_SLOPE_ANGLE(
        "shoulder_slope_angle", "어깨 기울기 각도",
        BodyMetrics::shoulderSlopeAngle,
        0.0, 35.0, "직각 (Natural)", "처짐 (Wave)",
        "목에서 어깨 끝점으로 이어지는 라인의 기울기를 측정한 지표입니다.",
        List.of(new Zone("직각", NATURAL, 10.0), new Zone("보통", STRAIGHT, 20.0), new Zone("처짐", WAVE, 35.0)),
        score -> score < 10.0 ? NATURAL : (score < 20.0 ? STRAIGHT : WAVE),
        Map.of(NATURAL, "어깨 라인이 직각에 가까워요.", STRAIGHT, "어깨 경사가 표준적이에요.", WAVE, "어깨 라인이 부드럽게 떨어져요."),
        Map.of(WAVE, 1, NATURAL, 1, STRAIGHT, 1)
    ),

    WAIST_CURVATURE_INDEX(
        "waist_curvature_index", "허리 곡률 지수",
        BodyMetrics::waistCurvatureIndex,
        0.0, 0.15, "통허리 (Straight)", "굴곡짐 (Wave)",
        "허리 라인이 안쪽으로 들어가는 곡선의 정도를 측정한 지표입니다.",
        List.of(new Zone("통허리", STRAIGHT, 0.08), new Zone("완만함", NATURAL, 0.10), new Zone("굴곡짐", WAVE, 0.15)),
        score -> score < 0.08 ? STRAIGHT : (score < 0.10 ? NATURAL : WAVE),
        Map.of(STRAIGHT, "허리 라인이 직선적이에요.", NATURAL, "허리 라인이 자연스러워요.", WAVE, "허리 라인이 잘록하게 들어가요."),
        Map.of(WAVE, 1, STRAIGHT, 1, NATURAL, 1)
    ),

    RIBCAGE_VOLUME_INDEX(
        "ribcage_volume_index", "흉곽 볼륨 지수",
        BodyMetrics::ribcageVolumeIndex,
        0.85, 1.35, "통허리 (Straight)", "잘록함 (Wave)",
        "흉곽과 허리 너비의 비율을 통해 상체 라인을 분석한 지표입니다.",
        List.of(new Zone("일자형", STRAIGHT, 1.05), new Zone("완만함", NATURAL, 1.15), new Zone("잘록함", WAVE, 1.35)),
        score -> score < 1.05 ? STRAIGHT : (score < 1.15 ? NATURAL : WAVE),
        Map.of(STRAIGHT, "허리 라인이 일자형에 가까워요.", NATURAL, "허리 굴곡이 완만해요.", WAVE, "허리가 가늘고 흉곽과 대비돼요."),
        Map.of(WAVE, 1, STRAIGHT, 1, NATURAL, 1)
    ),

    SHOULDER_HIP_RATIO(
        "shoulder_hip_ratio", "어깨 골반 비율",
        BodyMetrics::shoulderHipRatio,
        0.90, 1.30, "A라인 (Wave)", "Y라인 (Natural)",
        "어깨와 골반의 너비를 비교하여 상·하체 균형을 분석한 지표입니다.",
        List.of(new Zone("A라인", WAVE, 0.95), new Zone("I라인", STRAIGHT, 1.15), new Zone("Y라인", NATURAL, 1.30)),
        score -> score < 0.95 ? WAVE : (score < 1.15 ? STRAIGHT : NATURAL),
        Map.of(WAVE, "하체에 무게감이 실리는 체형이에요.", STRAIGHT, "상하체 균형이 잘 잡혀 있어요.", NATURAL, "상체 프레임이 돋보이는 체형이에요."),
        Map.of(WAVE, 1, NATURAL, 1, STRAIGHT, 1)
    ),

    // --- [Group C] 세부 특징 (낮은 가중치) ---
    JOINT_THICKNESS_INDEX(
        "joint_thickness_index", "관절 두께 지수",
        BodyMetrics::jointThicknessIndex,
        0.03, 0.07, "얇음 (Wave)", "굵음 (Natural)",
        "손목과 발목의 굵기를 통해 뼈대의 전반적인 두께를 측정한 지표입니다.",
        List.of(new Zone("얇음", WAVE, 0.04), new Zone("표준", STRAIGHT, 0.05), new Zone("굵음", NATURAL, 0.07)),
        score -> score < 0.04 ? WAVE : (score < 0.05 ? STRAIGHT : NATURAL),
        Map.of(WAVE, "손목과 발목 뼈대가 가늘어요.", STRAIGHT, "관절 굵기가 표준적이에요.", NATURAL, "뼈대가 굵고 존재감이 있어요."),
        Map.of(NATURAL, 1, WAVE, 1, STRAIGHT, 1)
    ),

    LINEARITY_INDEX(
        "linearity_index", "체형 직선성 지수",
        BodyMetrics::linearityIndex,
        0.60, 1.00, "곡선형 (Wave)", "직선형 (Straight)",
        "신체 외곽선이 얼마나 직선에 가까운지, 혹은 곡선인지를 나타내는 지표입니다.",
        List.of(new Zone("곡선", WAVE, 0.75), new Zone("자연스러움", NATURAL, 0.85), new Zone("직선", STRAIGHT, 1.00)),
        score -> score < 0.75 ? WAVE : (score < 0.85 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "몸의 실루엣에 곡선이 많아요.", NATURAL, "실루엣이 자연스럽게 흘러요.", STRAIGHT, "몸의 선이 직선으로 곧게 뻗었어요."),
        Map.of(STRAIGHT, 1, WAVE, 1, NATURAL, 1)
    ),

    ARM_TORSO_RATIO(
        "arm_torso_ratio", "팔 몸통 비율",
        BodyMetrics::armTorsoRatio,
        0.70, 1.20, "짧음 (Wave)", "김 (Natural)",
        "상체 길이 대비 팔 길이의 비율을 분석한 지표입니다.",
        List.of(new Zone("짧음", WAVE, 0.85), new Zone("표준", STRAIGHT, 1.0), new Zone("김", NATURAL, 1.20)),
        score -> score < 0.85 ? WAVE : (score < 1.0 ? STRAIGHT : NATURAL),
        Map.of(WAVE, "팔 길이가 아담한 편이에요.", STRAIGHT, "팔 길이가 비율에 맞아요.", NATURAL, "팔이 길고 시원시원해요."),
        Map.of(NATURAL, 1, WAVE, 1, STRAIGHT, 1)
    ),

    LEG_LENGTH_INDEX(
        "leg_length_index", "다리 길이 지수",
        BodyMetrics::legLengthIndex,
        0.40, 0.55, "짧음 (Wave)", "김 (Straight)",
        "키 대비 다리 길이의 비율을 분석한 지표입니다.",
        List.of(new Zone("짧음", WAVE, 0.45), new Zone("보통", NATURAL, 0.48), new Zone("김", STRAIGHT, 0.55)),
        score -> score < 0.45 ? WAVE : (score < 0.48 ? NATURAL : STRAIGHT),
        Map.of(WAVE, "허리가 길고 다리는 아담해요.", NATURAL, "다리 길이 비율이 표준적이에요.", STRAIGHT, "다리가 길어 비율이 좋아요."),
        Map.of(STRAIGHT, 1, WAVE, 1, NATURAL, 1)
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
        return AnalysisDetail.of(
            key,
            title,
            skeletonType,
            score,
            getPercent(score),
            guideText,
            new RangeMeta(min, max, leftLabel, rightLabel),
            Analysis.from(skeletonType, resultMessages.get(skeletonType)),
            zones
        );
    }
}