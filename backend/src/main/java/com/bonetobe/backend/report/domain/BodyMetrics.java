package com.bonetobe.backend.report.domain;

public record BodyMetrics(
        Double shoulderSlopeAngle,
        Double shoulderWidthIndex,
        Double upperBodyDepthIndex,
        Double waistLengthIndex,
        Double waistCurvatureIndex,
        Double jointThicknessIndex,
        Double armTorsoRatio,
        Double legLengthIndex,
        Double neckLengthIndex
) {
}
