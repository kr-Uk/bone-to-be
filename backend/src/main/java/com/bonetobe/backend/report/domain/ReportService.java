package com.bonetobe.backend.report.domain;

import java.util.List;

public interface ReportService {
    Report saveReport(ReportCommand command);

    Report saveResult(Long reportId, List<AnalysisDetail> report);

    Report getReportWithFile(Long reportId, Long userId);

    Report getReportWithFile(Long reportId);

    List<Report> getReportList(Long id);

    Report isOwner(Long userId, Long reportId);

    void delete(Report reportId);

    void clearRepresentativeReport(Long userId);

    Report getRepresentativeReport(Long userId);
}
