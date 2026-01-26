package com.bonetobe.backend.report.domain;

public interface ReportPublisher {
    void publish(Long userId, String presignedUrl);
}
