package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class Analysis {
    private SkeletonType resultType;
    private String resultText;

    public static Analysis from(SkeletonType skeletonType, String resultText) {
        Analysis analysis = new Analysis();
        analysis.resultText = resultText;
        analysis.resultType = skeletonType;
        return analysis;
    }
}
