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
        int total = details
                .stream()
                .mapToInt(AnalysisDetail::getWeight)
                .sum();

        EnumMap<SkeletonType, Integer> weights =
            details.stream()
                .collect(Collectors.groupingBy(
                    detail -> detail.getAnalysis().getResultType(),
                    () -> new EnumMap<>(SkeletonType.class),
                    Collectors.summingInt(AnalysisDetail::getWeight)));


        diagnosis.straightRatio = weights.getOrDefault(STRAIGHT, 0) / (double) total;
        diagnosis.waveRatio = weights.getOrDefault(WAVE, 0) / (double) total;
        diagnosis.naturalRatio = weights.getOrDefault(NATURAL, 0) / (double) total;

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