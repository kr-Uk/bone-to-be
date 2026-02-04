package com.bonetobe.backend.recommendation.presentation;

public record GetTryOnPicture(
        Long reportId,
        String bestImageUrl,
        String worstImageUrl
) {
}
