package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.report.domain.AnalysisDetail;
import com.bonetobe.backend.report.domain.Report;

import java.util.List;

public record GetReport(
    Long reportId,
    SkeletonType skeletonType,
    Double straightRate,
    Double naturalRate,
    Double waveRate,
    List<AnalysisDetail> details
) {
    public static GetReport from(Report report) {
        return new GetReport(
            report.getId(),
            report.getDiagnosis().getFitType(),
            report.getDiagnosis().getStraightRatio(),
            report.getDiagnosis().getNaturalRatio(),
            report.getDiagnosis().getWaveRatio(),
            report.getAnalysisReport()
        );
    }
}
