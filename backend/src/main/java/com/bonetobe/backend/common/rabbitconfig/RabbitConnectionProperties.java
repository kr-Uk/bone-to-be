package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.rabbitmq")
public record RabbitConnectionProperties(
    String host,
    int port,
    String username,
    String password
) {
}
