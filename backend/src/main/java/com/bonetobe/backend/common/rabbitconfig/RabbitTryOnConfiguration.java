package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({RabbitConnectionProperties.class, RabbitExchangeProperties.class})
public class RabbitTryOnConfiguration {
    @Bean
    TopicExchange analysisExchange(RabbitExchangeProperties props) {
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
        TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.tryon().queues().request().routingKey());
    }

    @Bean
    Binding tryonCompletedBinding(
        @Qualifier("tryonCompletedQueue") Queue queue,
        TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.tryon().queues().completed().routingKey());
    }

    @Bean
    Binding tryonFailedBinding(
        @Qualifier("tryonFailedQueue") Queue queue,
        TopicExchange exchange,
        RabbitExchangeProperties props
    ) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with(props.tryon().queues().failed().routingKey());
    }
}
