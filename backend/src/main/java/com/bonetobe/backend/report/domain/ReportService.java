package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.user.domain.User;

public interface ReportService {
    void generateReport(User userId, String presignedUrl);
}
