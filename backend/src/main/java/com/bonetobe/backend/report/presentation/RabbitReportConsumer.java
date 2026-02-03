package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.recommendation.application.TryOnFacade;
import com.bonetobe.backend.report.application.ReportFacade;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.presentation.dto.ReportResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitReportConsumer {
    private final ReportFacade reportFacade;
    private final TryOnFacade tryOnFacade;
    private final ObjectMapper objectMapper = JsonMapper.builder()
        .propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
        .addModule(new JavaTimeModule())
        .build();

    @RabbitListener(
        queues = "${rabbitmq.topology.analysis.queues.completed.name}"
    )
    public void consumeMessage(Message message) throws JsonProcessingException {
        // 데이터 입력 받음
        String body = new String(message.getBody());
        ReportResult result = objectMapper.readValue(body, ReportResult.class);

        // 결과 저장 및 알림 발송
        Report report = reportFacade.saveResultAndSendEvent(result);

        // 옷 가상피팅 실행
        tryOnFacade.startTryOn(report.getId());
    }
}
