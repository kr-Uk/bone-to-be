package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.report.domain.ReportPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitReportPublisher implements ReportPublisher {

    private final AmqpTemplate amqpTemplate;
    @Override
    public void publish(Long userId, String presignedUrl) {
        return;
    }
}
