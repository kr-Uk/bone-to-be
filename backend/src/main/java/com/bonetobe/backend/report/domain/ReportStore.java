package com.bonetobe.backend.report.domain;

public interface ReportStore {
    Report save(Report report);

    Report update(Report report);

    void changeRepresentative(Long userId);
}
