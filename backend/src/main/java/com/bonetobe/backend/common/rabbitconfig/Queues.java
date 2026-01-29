package com.bonetobe.backend.common.rabbitconfig;

public record Queues(
    QueueDomain request,
    QueueDomain completed,
    QueueDomain failed
) {
}
