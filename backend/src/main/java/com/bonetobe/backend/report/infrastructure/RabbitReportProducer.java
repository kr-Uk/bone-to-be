package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.common.rabbitconfig.RabbitExchangeProperties;
import com.bonetobe.backend.report.domain.ReportProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitReportProducer implements ReportProducer {
    private final AmqpTemplate amqpTemplate;
    private final RabbitExchangeProperties exProps;

    @Override
    public void produce(ReportMessage.Request reportMessage) {
        amqpTemplate.convertAndSend(
            exProps.analysis().exchange(),
            exProps.analysis().queues().request().routingKey(),
            reportMessage);
    }
}
