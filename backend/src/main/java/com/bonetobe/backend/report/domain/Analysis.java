package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;

public record Analysis(SkeletonType resultType, String resultText) {

    public static Analysis from(SkeletonType skeletonType, String resultText) {
        return new Analysis(skeletonType, resultText);
    }
}
