package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.report.presentation.BodyMetrics;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;

@RequiredArgsConstructor
@Getter
public enum ReportTypeMapper {
    SHOULDER_SLOPE_ANGLE("어깨 기울기 각도", BodyMetrics::shoulderSlopeAngle, SkeletonTypeAnalyzer::shoulderSlopeAngle),
    SHOULDER_WIDTH_INDEX("어깨 너비 지수", BodyMetrics::shoulderWidthIndex, SkeletonTypeAnalyzer::shoulderWidthIndex),
    HIP_WIDTH_INDEX("골반 너비 지수", BodyMetrics::hipWidthIndex, SkeletonTypeAnalyzer::hipWidthIndex),
    SHOULDER_HIP_RATIO("어깨 골반 비율", BodyMetrics::shoulderHipRatio, SkeletonTypeAnalyzer::shoulderHipRatio),
    UPPER_BODY_DEPTH_INDEX("상체 두께 지수", BodyMetrics::upperBodyDepthIndex, SkeletonTypeAnalyzer::upperBodyDepthIndex),
    RIBCAGE_VOLUME_INDEX("흉곽 볼륨 지수", BodyMetrics::ribcageVolumeIndex, SkeletonTypeAnalyzer::ribcageVolumeIndex),
    WAIST_CURVATURE_INDEX("허리 곡률 지수", BodyMetrics::waistCurvatureIndex, SkeletonTypeAnalyzer::waistCurvatureIndex),
    JOINT_THICKNESS_INDEX("관절 두께 지수", BodyMetrics::jointThicknessIndex, SkeletonTypeAnalyzer::jointThicknessIndex),
    ARM_TORSO_RATIO("팔 몸통 비율", BodyMetrics::armTorsoRatio, SkeletonTypeAnalyzer::armTorsoRatio),
    LINEARITY_INDEX("체형 직선성 지수", BodyMetrics::linearityIndex, SkeletonTypeAnalyzer::linearityIndex),
    LEG_LENGTH_INDEX("다리 길이 지수", BodyMetrics::legLengthIndex, SkeletonTypeAnalyzer::legLengthIndex);

    private final String title;

    private final ToDoubleFunction<BodyMetrics> extractor;

    private final Function<Double, SkeletonType> analyser;

    public AnalysisDetail mapToDetail(BodyMetrics metrics) {
        // result 안의 getter 호출
        Double score = extractor.applyAsDouble(metrics);

        // skeleton 값에 맞는 진단 호출
        SkeletonType skeletonType = analyser.apply(score);

        return AnalysisDetail.of(title, score, skeletonType);
    }
}
