package com.bonetobe.backend.recommendation.presentation;

import com.bonetobe.backend.recommendation.domain.TryOnStatus;

public record GetTryOnPicture(
        Long reportId,
        String bestImageUrl,
        String worstImageUrl,
        TryOnStatus status
) {
}
