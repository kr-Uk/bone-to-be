package com.bonetobe.backend.common.rabbitconfig;

public record QueueDomain(
    String name,
    String routingKey
) {
}
