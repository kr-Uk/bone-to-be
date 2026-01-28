package com.bonetobe.backend.report.infrastructure;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitReportConsumer {
    @RabbitListener(
        queues = "${rabbitmq.topology.analysis.queues.completed.name}"
    )
    public void consumeMessage(Message message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        String body = new String(message.getBody());
        ReportMessage.ReportResult response = objectMapper.readValue(body, ReportMessage.ReportResult.class);
        log.info(response.toString());
    }
}
