package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.bonetobe.backend.common.SkeletonType.*;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diagnosis {
    private Double straightRatio;
    private Double waveRatio;
    private Double naturalRatio;

    public static Diagnosis calculateRatio(List<AnalysisDetail> details) {
        Diagnosis diagnosis = new Diagnosis();
        int total = details.size();

        EnumMap<SkeletonType, Long> counts =
            details.stream()
                .collect(Collectors.groupingBy(
                    detail -> {
                        return detail.getAnalysis().resultType();
                    },
                    () -> new EnumMap<>(SkeletonType.class),
                    Collectors.counting()
                ));

        diagnosis.straightRatio = counts.getOrDefault(STRAIGHT, 0L) / (double) total;
        diagnosis.waveRatio = counts.getOrDefault(WAVE, 0L) / (double) total;
        diagnosis.naturalRatio = counts.getOrDefault(NATURAL, 0L) / (double) total;

        return diagnosis;
    }

    public SkeletonType getFitType() {

        Map<SkeletonType, Double> scores = Map.of(
            SkeletonType.STRAIGHT, straightRatio,
            SkeletonType.WAVE, waveRatio,
            SkeletonType.NATURAL, naturalRatio
        );

        return scores.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .orElseThrow()
            .getKey();
    }
}