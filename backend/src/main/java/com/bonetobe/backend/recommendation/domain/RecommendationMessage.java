package com.bonetobe.backend.recommendation.domain;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.user.domain.Gender;

public record RecommendationMessage(
    Long reportId,
    Gender gender,
    SkeletonType skeletonType,
    String presignedUrl,
    String bestClothingPresignedUrl,
    String bestResultUploadUrl,
    String worstClothingPresignedUrl,
    String worstResultUploadUrl
) {
    public static RecommendationMessage of(
        Recommendation recommendation,
        String presignedUrl,
        String bestClothingPresignedUrl,
        String bestResultUploadUrl,
        String worstClothingPresignedUrl,
        String worstResultUploadUrl
    ) {
        return new RecommendationMessage(
            recommendation.getId(),
            recommendation.getReport().getBodyInfo().getGender(),
            recommendation.getReport().getDiagnosis().getFitType(),
            presignedUrl,
            bestClothingPresignedUrl,
            bestResultUploadUrl,
            worstClothingPresignedUrl,
            worstResultUploadUrl
        );
    }
}
