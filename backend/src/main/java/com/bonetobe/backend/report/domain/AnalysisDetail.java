package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class AnalysisDetail {
    private String title;
    private Double score;
    private SkeletonType skeletonType;

    public static AnalysisDetail of(
        String title,
        Double score,
        SkeletonType skeletonType
    ) {
        AnalysisDetail detail = new AnalysisDetail();
        detail.title = title;
        detail.score = score;
        detail.skeletonType = skeletonType;
        return detail;
    }
}
