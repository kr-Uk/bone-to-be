package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;

import java.time.LocalDateTime;
import java.util.List;

public record PostSummary(
        Long postId,
        String imageUrl,
        String gender,
        SkeletonType skeletonType,
        List<String> style,
        Integer height,
        Integer weight,
        boolean isLiked,
        LocalDateTime createdAt
) {
}
