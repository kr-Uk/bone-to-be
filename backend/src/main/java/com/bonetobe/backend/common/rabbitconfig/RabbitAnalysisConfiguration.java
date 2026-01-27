package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.amqp.core.*;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({RabbitConnectionProperties.class, RabbitExchangeProperties.class})
public class RabbitAnalysisConfiguration {
    @Bean
    TopicExchange exchange(RabbitExchangeProperties exchangeProperties) {
        return new TopicExchange(exchangeProperties.analysis().exchange());
    }

    @Bean
    Queue AnalysisRequestQueue(RabbitExchangeProperties exchangeProperties) {
        return new Queue(exchangeProperties.analysis().queues().request().name());
    }

    @Bean
    Binding binding(Queue queue, TopicExchange exchange, RabbitExchangeProperties exchangeProperties) {
        return BindingBuilder.bind(queue).to(exchange).with(exchangeProperties.analysis().queues().request().routingKey());
    }
}
