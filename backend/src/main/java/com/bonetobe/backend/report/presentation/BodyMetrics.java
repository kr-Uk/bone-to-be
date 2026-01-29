package com.bonetobe.backend.report.presentation;

public record BodyMetrics(
        Double shoulderSlopeAngle,
        Double shoulderWidthIndex,
        Double hipWidthIndex,
        Double shoulderHipRatio,
        Double upperBodyDepthIndex,
        Double ribcageVolumeIndex,
        Double waistCurvatureIndex,
        Double jointThicknessIndex,
        Double armTorsoRatio,
        Double linearityIndex,
        Double legLengthIndex
) {
}
