package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.report.domain.ReportPublisher;
import org.springframework.stereotype.Service;

@Service
public class RabbitReportPublisher implements ReportPublisher {
    @Override
    public void publish(Long userId, String presignedUrl) {

    }
}
