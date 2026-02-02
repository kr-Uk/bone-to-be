package com.bonetobe.backend.report.presentation.dto;

import com.bonetobe.backend.report.domain.AnalysisDetail;
import com.bonetobe.backend.report.domain.BodyMetricType;
import com.bonetobe.backend.report.domain.BodyMetrics;
import com.bonetobe.backend.report.domain.ReportStatus;

import java.util.Arrays;
import java.util.List;

public record ReportResult(
        ReportStatus status,
        Long reportId,
        BodyMetrics bodyMetrics
) {
    public List<AnalysisDetail> toAnalysisReport() {
        return Arrays.stream(BodyMetricType.values())
                .map(mapper -> mapper.mapToDetail(this.bodyMetrics))
                .toList();
    }
}
