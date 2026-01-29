package com.bonetobe.backend.common.rabbitconfig;

public record Topology(
    String exchange,
    Queues queues
) {
}
