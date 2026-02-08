package com.bonetobe.backend.recommendation.presentation;

import com.bonetobe.backend.recommendation.application.TryOnFacade;
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
public class RabbitTryOnConsumer {
    private final TryOnFacade tryOnFacade;
    private final ObjectMapper objectMapper = JsonMapper.builder()
        .propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
        .addModule(new JavaTimeModule())
        .build();

    @RabbitListener(
        queues = "${rabbitmq.topology.tryon.queues.completed.name}"
    )
    public void consumeMessage(Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            // 데이터 입력 받음
            String body = new String(message.getBody());
            TryOnResult result = objectMapper.readValue(body, TryOnResult.class);

            // 결과 저장 및 알림 발송
            tryOnFacade.saveResultAndSendEvent(result);
            channel.basicAck(deliveryTag, false);
        } catch (Exception e) {
            log.error("가상 피팅 메시지 처리 실패 : {}", e.getMessage());
            channel.basicNack(deliveryTag, false, false);
        }
    }
}
