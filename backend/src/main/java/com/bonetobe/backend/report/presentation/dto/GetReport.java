package com.bonetobe.backend.report.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.report.domain.AnalysisDetail;
import com.bonetobe.backend.report.domain.Diagnosis;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportStatus;
import com.bonetobe.backend.user.domain.Gender;

import java.time.LocalDateTime;
import java.util.List;

public record GetReport(
    Long reportId,
    Double straightRate,
    Double naturalRate,
    Double waveRate,
    List<AnalysisDetail> details,
    ReportStatus status,
    LocalDateTime createdAt,
    Gender gender,
    SkeletonType skeletonType
) {
    public static GetReport from(Report report) {
        Diagnosis diagnosis = report.getDiagnosis(report.getStatus());
        return new GetReport(
            report.getId(),
            diagnosis == null ? 0 : diagnosis.getStraightRatio(),
            diagnosis == null ? 0 :diagnosis.getNaturalRatio(),
            diagnosis == null ? 0 :diagnosis.getWaveRatio(),
            report.getAnalysisReport(),
            report.getStatus(),
            report.getCreatedAt(),
            report.getBodyInfo().getGender(),
            diagnosis == null ? null : report.getDiagnosis().getFitType()
        );
    }
}
