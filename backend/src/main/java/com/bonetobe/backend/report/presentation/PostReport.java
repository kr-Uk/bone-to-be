package com.bonetobe.backend.report.presentation;

public record PostReport(Long reportId) {
    public static PostReport of(Long reportId) {
        return new PostReport(reportId);
    }
}
