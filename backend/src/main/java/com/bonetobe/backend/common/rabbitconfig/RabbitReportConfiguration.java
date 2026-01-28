package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@EnableConfigurationProperties({RabbitConnectionProperties.class, RabbitExchangeProperties.class})
public class RabbitReportConfiguration {
    @Bean
    TopicExchange analysisExchange(RabbitExchangeProperties props) {
        return new TopicExchange(props.analysis().exchange());
    }

    @Bean
    Queue analysisRequestQueue(RabbitExchangeProperties props) {
        return new Queue(props.analysis().queues().request().name());
    }

    @Bean
    Queue analysisCompletedQueue(RabbitExchangeProperties props) {
        return new Queue(props.analysis().queues().completed().name());
    }

    @Bean
    Queue analysisFailedQueue(RabbitExchangeProperties props) {
        return new Queue(props.analysis().queues().failed().name());
    }

    @Bean
    Binding analysisRequestBinding(
        @Qualifier("analysisRequestQueue") Queue queue,
        TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.analysis().queues().request().routingKey());
    }

    @Bean
    Binding analysisCompletedBinding(
        @Qualifier("analysisCompletedQueue") Queue queue,
        TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.analysis().queues().completed().routingKey());
    }

    @Bean
    Binding analysisFailedBinding(
        @Qualifier("analysisFailedQueue") Queue queue,
        TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.analysis().queues().failed().routingKey());
    }
}
