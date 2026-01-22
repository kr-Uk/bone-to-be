package com.bonetobe.backend.post.application.query;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.member.domain.Gender;

import java.time.LocalDateTime;

public record PostSummaryRow(
        Long postId,
        String storagePath,
        Gender gender,
        SkeletonType skeletonType,
        Integer height,
        Integer weight,
        LocalDateTime createdAt
) {
}
