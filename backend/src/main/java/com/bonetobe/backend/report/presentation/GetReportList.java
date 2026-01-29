package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.report.domain.Report;

import java.time.LocalDateTime;

public record GetReportList(
    Long reportId,
    SkeletonType skeletonType,
    Double straightRate,
    Double naturalRate,
    Double waveRate,
    LocalDateTime createdAt
) {
    public static GetReportList from(Report report) {
        return new GetReportList(
            report.getId(),
            report.getDiagnosis().getFitType(),
            report.getDiagnosis().getStraightRatio(),
            report.getDiagnosis().getNaturalRatio(),
            report.getDiagnosis().getWaveRatio(),
            report.getCreatedAt()
        );
    }
}
