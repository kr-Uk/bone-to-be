package com.bonetobe.backend.report.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.report.domain.Diagnosis;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportStatus;

import java.time.LocalDateTime;

public record GetReportList(
    Long reportId,
    SkeletonType skeletonType,
    ReportStatus reportStatus,
    Double straightRate,
    Double naturalRate,
    Double waveRate,
    LocalDateTime createdAt
) {
    public static GetReportList from(Report report) {
        Diagnosis diagnosis = report.getDiagnosis(report.getStatus());
        return new GetReportList(
            report.getId(),
            diagnosis == null ? null : diagnosis.getFitType(),
            report.getStatus(),
            diagnosis == null ? 0 : diagnosis.getStraightRatio(),
            diagnosis == null ? 0 :diagnosis.getNaturalRatio(),
            diagnosis == null ? 0 :diagnosis.getWaveRatio(),
            report.getCreatedAt()
        );
    }
}
