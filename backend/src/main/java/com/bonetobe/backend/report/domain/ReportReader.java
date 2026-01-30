package com.bonetobe.backend.report.domain;

import java.util.List;
import java.util.Optional;

public interface ReportReader {
    Report read(Long reportId);

    List<Report> readReports(Long id);

    Optional<Report> readRepresentativeReport(Long userId);
}
