package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.report.presentation.GetReport;

import java.util.List;

public interface ReportReader {
    Report read(Long reportId);

    List<Report> readReports(Long id);

    Report readRepresentativeReport(Long userId);
}
