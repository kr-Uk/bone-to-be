package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class AnalysisDetail {
    private String key;
    private String label;
    private SkeletonType skeletonType;
    private Double score;
    private Integer percent;
    private String description;
    private RangeMeta rangeMeta;
    private Analysis analysis;
    private List<Zone> zones;
    private Integer weight;

    public static AnalysisDetail of(
        String key,
        String label,
        SkeletonType skeletonType,
        Double score,
        Integer percent,
        String description,
        RangeMeta rangeMeta,
        Analysis analysis,
        List<Zone> zones,
        Integer weight
    ) {
        AnalysisDetail detail = new AnalysisDetail();
        detail.key = key;
        detail.label = label;
        detail.skeletonType = skeletonType;
        detail.score = score;
        detail.percent = percent;
        detail.description = description;
        detail.rangeMeta = rangeMeta;
        detail.analysis = analysis;
        detail.zones = zones;
        detail.weight = weight;
        return detail;
    }
}
