package com.bonetobe.backend.report.domain;

import java.util.List;

public interface ReportService {
    Report saveReport(ReportCommand command);

    Report saveResult(Long reportId, List<AnalysisDetail> report);

    Report getReport(Long reportId, Long userId);

    List<Report> getReportList(Long id);

    Report isOwner(Long userId, Long reportId);

    void delete(Report reportId);

    void makeRepresentative(Report report);

    Report getRepresentativeReport(Long userId);
}
