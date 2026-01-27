package com.bonetobe.backend.common.rabbitconfig;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rabbitmq.topology")
public record RabbitExchangeProperties(
    Topology analysis,
    Topology tryon
) {
}
