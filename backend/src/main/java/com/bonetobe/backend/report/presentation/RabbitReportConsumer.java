package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.report.application.ReportFacade;
import com.bonetobe.backend.report.presentation.dto.ReportResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.rabbitmq.client.Channel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitReportConsumer {
    private final ReportFacade reportFacade;
    private final ObjectMapper objectMapper = JsonMapper.builder()
        .propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
        .addModule(new JavaTimeModule())
        .build();

    @RabbitListener(
        queues = "${rabbitmq.topology.analysis.queues.completed.name}"
    )
    public void consumeMessage(Message message, Channel channel) throws IOException {

        long tag = message.getMessageProperties().getDeliveryTag();
        try {
            // 데이터 입력 받음
            String body = new String(message.getBody());
            ReportResult result = objectMapper.readValue(body, ReportResult.class);

            // 결과 저장 및 알림 발송
            reportFacade.saveResultAndSendEvent(result);

            channel.basicAck(tag, false);
        } catch (Exception e) {
            log.error("메시지 저장 실패 {}", e.getMessage());
            channel.basicNack(tag, false, false);
        }
    }
}
