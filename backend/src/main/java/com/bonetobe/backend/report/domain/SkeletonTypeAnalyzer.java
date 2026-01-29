package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;

public class SkeletonTypeAnalyzer {
    public static SkeletonType shoulderSlopeAngle(Double score) {
        return SkeletonType.WAVE;
    }

    public static SkeletonType shoulderWidthIndex(Double score) {
        return SkeletonType.STRAIGHT;
    }

    public static SkeletonType hipWidthIndex(Double score) {
        return SkeletonType.NATURAL;
    }

    public static SkeletonType shoulderHipRatio(Double score) {
        return SkeletonType.WAVE;
    }

    public static SkeletonType upperBodyDepthIndex(Double score) {
        return SkeletonType.STRAIGHT;
    }

    public static SkeletonType ribcageVolumeIndex(Double score) {
        return SkeletonType.NATURAL;
    }

    public static SkeletonType waistCurvatureIndex(Double score) {
        return SkeletonType.WAVE;
    }

    public static SkeletonType jointThicknessIndex(Double score) {
        return SkeletonType.STRAIGHT;
    }

    public static SkeletonType armTorsoRatio(Double score) {
        return SkeletonType.NATURAL;
    }

    public static SkeletonType linearityIndex(Double score) {
        return SkeletonType.WAVE;
    }

    public static SkeletonType legLengthIndex(Double score) {
        return SkeletonType.STRAIGHT;
    }
}
