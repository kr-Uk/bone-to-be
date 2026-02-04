package com.bonetobe.backend.recommendation.presentation;


import com.bonetobe.backend.recommendation.domain.TryOnStatus;

public record TryOnResult(
    Long reportId,
    TryOnStatus status
) {
}
