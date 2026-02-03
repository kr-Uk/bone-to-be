package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@EnableConfigurationProperties({RabbitConnectionProperties.class, RabbitExchangeProperties.class})
public class RabbitConfiguration {
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
        @Qualifier("analysisExchange") TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.analysis().queues().request().routingKey());
    }

    @Bean
    Binding analysisCompletedBinding(
        @Qualifier("analysisCompletedQueue") Queue queue,
        @Qualifier("analysisExchange") TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.analysis().queues().completed().routingKey());
    }

    @Bean
    Binding analysisFailedBinding(
        @Qualifier("analysisFailedQueue") Queue queue,
        @Qualifier("analysisExchange") TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.analysis().queues().failed().routingKey());
    }

    @Bean
    TopicExchange tryonExchange(RabbitExchangeProperties props) {
        return new TopicExchange(props.tryon().exchange());
    }

    @Bean
    Queue tryonRequestQueue(RabbitExchangeProperties props) {
        return new Queue(props.tryon().queues().request().name());
    }

    @Bean
    Queue tryonCompletedQueue(RabbitExchangeProperties props) {
        return new Queue(props.tryon().queues().completed().name());
    }

    @Bean
    Queue tryonFailedQueue(RabbitExchangeProperties props) {
        return new Queue(props.tryon().queues().failed().name());
    }

    @Bean
    Binding tryonRequestBinding(
        @Qualifier("tryonRequestQueue") Queue queue,
        @Qualifier("tryonExchange") TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.tryon().queues().request().routingKey());
    }

    @Bean
    Binding tryonCompletedBinding(
        @Qualifier("tryonCompletedQueue") Queue queue,
        @Qualifier("tryonExchange") TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.tryon().queues().completed().routingKey());
    }

    @Bean
    Binding tryonFailedBinding(
        @Qualifier("tryonFailedQueue") Queue queue,
        @Qualifier("tryonExchange") TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.tryon().queues().failed().routingKey());
    }
}
