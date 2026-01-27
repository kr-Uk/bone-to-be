package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({RabbitConnectionProperties.class, RabbitExchangeProperties.class})
public class RabbitAnalysisSendConfiguration {
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

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
