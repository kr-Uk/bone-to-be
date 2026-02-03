package com.bonetobe.backend.recommendation.infrastructure;

import com.bonetobe.backend.common.rabbitconfig.RabbitExchangeProperties;
import com.bonetobe.backend.recommendation.domain.RecommendationMessage;
import com.bonetobe.backend.recommendation.domain.TryOnProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RabbitTryOnProducerImpl implements TryOnProducer {
    private final AmqpTemplate amqpTemplate;
    private final RabbitExchangeProperties exProps;

    @Override
    public void produce(RecommendationMessage recommendationMessage) {
        amqpTemplate.convertAndSend(
            exProps.tryon().exchange(),
            exProps.tryon().queues().request().routingKey(),
            recommendationMessage);
    }
}
