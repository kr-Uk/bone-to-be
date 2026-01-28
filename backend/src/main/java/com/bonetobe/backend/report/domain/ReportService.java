package com.bonetobe.backend.report.domain;


import java.util.List;

public interface ReportService {
    Report saveReport(ReportCommand command);

    Report saveResult(Long reportId, List<AnalysisDetail> report);
}
